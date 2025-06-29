<?php
/**
 * فایل دریافت و پردازش فرم تماس
 * 
 * این فایل مسئول دریافت اطلاعات فرم تماس، اعتبارسنجی آنها،
 * بررسی محدودیت ارسال پیام و ذخیره در پایگاه داده است.
 */

// شروع سشن برای مدیریت CSRF Token
session_start();

// تنظیم هدرهای HTTP
header('Content-Type: application/json; charset=utf-8'); // نوع محتوای پاسخ
header("Access-Control-Allow-Origin: *"); // اجازه دسترسی از همه دامنه‌ها (CORS)
header("Access-Control-Allow-Methods: POST"); // اجازه فقط متد POST

// ساختار پیش‌فرض پاسخ
$response = [
    'status' => 'error', // وضعیت پیش‌فرض
    'message' => '', // پیام کلی پاسخ
    'errors' => [] // خطاهای اعتبارسنجی فیلدها
];

// پردازش فقط درخواست‌های POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // دریافت داده‌های ورودی (هم از JSON و هم از فرم معمولی)
    $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

    /**
     * بررسی CSRF Token برای جلوگیری از حملات CSRF
     * 
     * توکن ارسالی باید با توکن ذخیره شده در سشن مطابقت داشته باشد
     */
    if (!isset($input['csrf_token']) || $input['csrf_token'] !== ($_SESSION['csrf_token'] ?? '')) {
        $response['message'] = 'توکن امنیتی نامعتبر است';
        echo json_encode($response);
        exit;
    }

    // دریافت و پیش‌پردازش داده‌های فرم
    $name = trim($input['name'] ?? ''); // نام
    $email = trim($input['email'] ?? ''); // ایمیل
    $phone = trim($input['number'] ?? ''); // شماره تلفن (با نام فیلد number در فرم)
    $subject = trim($input['subject'] ?? ''); // موضوع
    $message = trim($input['message'] ?? ''); // متن پیام

    /**
     * اعتبارسنجی فیلدها
     */

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

    // اعتبارسنجی شماره تلفن
    if (empty($phone)) {
        $response['errors']['number'] = 'شماره تلفن الزامی است';
    } else {
        // حذف کاراکترهای غیرعددی
        $phone = preg_replace('/[^0-9]/', '', $phone);
        
        // بررسی معیارهای شماره تلفن ایرانی:
        // - طول 11 رقم
        // - شروع با 09
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

    // اگر هیچ خطای اعتبارسنجی وجود نداشت
    if (empty($response['errors'])) {
        try {
            // اتصال به پایگاه داده
            $pdo = new PDO('mysql:host=localhost;dbname=shopdg_godshop-db', 'root', '');
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            /**
             * بررسی محدودیت ارسال پیام:
             * کاربر نمی‌تواند بیش از 3 پیام در ساعت ارسال کند
             */
            $stmt = $pdo->prepare("SELECT COUNT(*) FROM messages 
                                  WHERE (email = :email OR phone = :phone) 
                                  AND created_at > DATE_SUB(NOW(), INTERVAL 1 HOUR)");
            $stmt->execute([':email' => $email, ':phone' => $phone]);
            $messageCount = $stmt->fetchColumn();

            if ($messageCount >= 3) {
                $response['message'] = 'شما بیش از حد مجاز پیام ارسال کرده‌اید. لطفاً 1 ساعت دیگر تلاش کنید.';
            } else {
                /**
                 * ذخیره پیام در پایگاه داده
                 * 
                 * استفاده از htmlspecialchars برای جلوگیری از XSS
                 * استفاده از prepared statements برای جلوگیری از SQL Injection
                 */
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

                // تنظیم پاسخ موفقیت‌آمیز
                $response['status'] = 'success';
                $response['message'] = 'پیام شما با موفقیت ارسال شد!';
            }
        } catch (PDOException $e) {
            // مدیریت خطاهای پایگاه داده
            $response['message'] = 'خطای پایگاه داده: ' . $e->getMessage();
            // ثبت خطا در فایل لاگ سرور
            error_log('Database Error: ' . $e->getMessage());
        }
    } else {
        // اگر خطاهای اعتبارسنجی وجود داشت
        $response['message'] = 'لطفاً خطاهای فرم را اصلاح کنید';
    }
}

// ارسال پاسخ به صورت JSON
echo json_encode($response);
?>