<?php
session_start();

header('Content-Type: application/json; charset=utf-8');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");

$response = [
    'status' => 'error',
    'message' => '',
    'errors' => []
];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

    // بررسی CSRF Token
    if (!isset($input['csrf_token']) || $input['csrf_token'] !== ($_SESSION['csrf_token'] ?? '')) {
        $response['message'] = 'توکن امنیتی نامعتبر است';
        echo json_encode($response);
        exit;
    }

    // دریافت و اعتبارسنجی داده‌ها
    $name = trim($input['name'] ?? '');
    $email = trim($input['email'] ?? '');
    $phone = trim($input['number'] ?? ''); // توجه: نام فیلد در فرم 'number' است
    $subject = trim($input['subject'] ?? '');
    $message = trim($input['message'] ?? '');

    // اعتبارسنجی نام
    if (empty($name)) {
        $response['errors']['name'] = 'نام الزامی است';
    }

    // اعتبارسنجی ایمیل
    if (empty($email)) {
        $response['errors']['email'] = 'ایمیل الزامی است';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $response['errors']['email'] = 'فرمت ایمیل نامعتبر است';
    }

    // اعتبارسنجی شماره تلفن (11 رقمی و شروع با پیش‌شماره ایرانی)
    if (empty($phone)) {
        $response['errors']['number'] = 'شماره تلفن الزامی است';
    } else {
        // حذف هر چیزی غیر از رقم
        $phone = preg_replace('/[^0-9]/', '', $phone);
        
        // بررسی 11 رقمی بودن و شروع با 09
        if (strlen($phone) !== 11 || !preg_match('/^09/', $phone)) {
            $response['errors']['number'] = 'شماره تلفن باید 11 رقمی و با 09 شروع شود';
        }
    }

    // اعتبارسنجی موضوع
    if (empty($subject)) {
        $response['errors']['subject'] = 'موضوع الزامی است';
    }

    // اعتبارسنجی پیام
    if (empty($message)) {
        $response['errors']['message'] = 'متن پیام الزامی است';
    } elseif (strlen($message) < 10) {
        $response['errors']['message'] = 'پیام باید حداقل 10 کاراکتر باشد';
    }

    if (empty($response['errors'])) {
        try {
            $pdo = new PDO('mysql:host=localhost;dbname=godshop-db', 'root', '');
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            // اصلاح شده: تغییر number به phone در کوئری SQL
            $stmt = $pdo->prepare("SELECT COUNT(*) FROM messages 
                                  WHERE (email = :email OR phone = :phone) 
                                  AND created_at > DATE_SUB(NOW(), INTERVAL 1 HOUR)");
            $stmt->execute([':email' => $email, ':phone' => $phone]);
            $messageCount = $stmt->fetchColumn();

            if ($messageCount >= 3) {
                $response['message'] = 'شما بیش از حد مجاز پیام ارسال کرده‌اید. لطفاً 1 ساعت دیگر تلاش کنید.';
            } else {
                // ذخیره پیام در دیتابیس
                $stmt = $pdo->prepare("INSERT INTO messages 
                                      (name, email, phone, subject, message, created_at) 
                                      VALUES (:name, :email, :phone, :subject, :message, NOW())");
                $stmt->execute([
                    ':name' => htmlspecialchars($name, ENT_QUOTES, 'UTF-8'),
                    ':email' => htmlspecialchars($email, ENT_QUOTES, 'UTF-8'),
                    ':phone' => htmlspecialchars($phone, ENT_QUOTES, 'UTF-8'),
                    ':subject' => htmlspecialchars($subject, ENT_QUOTES, 'UTF-8'),
                    ':message' => htmlspecialchars($message, ENT_QUOTES, 'UTF-8')
                ]);

                $response['status'] = 'success';
                $response['message'] = 'پیام شما با موفقیت ارسال شد!';
            }
        } catch (PDOException $e) {
            $response['message'] = 'خطای پایگاه داده: ' . $e->getMessage();
            // برای دیباگ می‌توانید خطا را لاگ کنید
            error_log('Database Error: ' . $e->getMessage());
        }
    } else {
        $response['message'] = 'لطفاً خطاهای فرم را اصلاح کنید';
    }
}

echo json_encode($response);
?>