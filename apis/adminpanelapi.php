<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');


// تنظیمات خطاها
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/admin_errors.log');

error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);

// تنظیمات افزایش محدودیت‌ها
ini_set('upload_max_filesize', '1024M');
ini_set('post_max_size', '1050M');
ini_set('max_execution_time', 300);
ini_set('max_input_time', 300);
ini_set('memory_limit', '2048M');

// تابع برای لاگ دقیق خطاها
function logError($message) {
    file_put_contents(__DIR__.'/upload_errors.log', date('[Y-m-d H:i:s]').' '.$message.PHP_EOL, FILE_APPEND);
}

// تابع برای نمایش پیغام‌های خطا به صورت JSON
// تغییر در تابع sendResponse برای یکپارچه‌سازی بهتر با سیستم پیام‌های سفارشی
function sendResponse($success, $message = '', $data = [], $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');
    
    $response = [
        'success' => $success,
        'message' => $message,
        'data' => $data,
        'statusCode' => $statusCode
    ];
    
    echo json_encode($response, JSON_UNESCAPED_UNICODE);
    exit;
}

// در ابتدای فایل بعد از تابع connectDB()
error_log("========= New Request =========");
error_log("Request Method: " . $_SERVER['REQUEST_METHOD']);
error_log("POST Data: " . print_r($_POST, true));
error_log("FILES Data: " . print_r($_FILES, true));

// تابع برای اتصال به دیتابیس
function connectDB() {
    $host = 'localhost';
    $dbname = 'godshop-db';
    $username = 'root'; // تغییر دهید به نام کاربری دیتابیس
    $password = ''; // تغییر دهید به رمز عبور دیتابیس

    try {
        $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        $pdo->exec("SET NAMES 'utf8mb4'");
        $pdo->exec("SET CHARACTER SET utf8mb4");
        $pdo->exec("SET SESSION collation_connection = 'utf8mb4_unicode_ci'");
        return $pdo;
    } catch (PDOException $e) {
        error_log("Database connection failed: " . $e->getMessage());
        sendResponse(false, 'خطا در اتصال به پایگاه داده', [], 500);
        
    }
}


// اعتبارسنجی فایل‌های آپلود شده
function validateUploadedFile($file, $allowedTypes = ['image/jpeg', 'image/png', 'image/gif'], $maxSize = 5 * 1024 * 1024) {
    if ($file['error'] !== UPLOAD_ERR_OK) {
        return ['success' => false, 'message' => 'خطا در آپلود فایل'];
    }

    if ($file['size'] > $maxSize) {
        return ['success' => false, 'message' => 'حجم فایل بیش از حد مجاز است'];
    }

    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);

    if (!in_array($mime, $allowedTypes)) {
        return ['success' => false, 'message' => 'نوع فایل مجاز نیست'];
    }

    return ['success' => true];
}

// اعتبارسنجی فایل ویدیو
function validateVideoFile($file, $maxSize = 50 * 1024 * 1024) {
    $allowedTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    return validateUploadedFile($file, $allowedTypes, $maxSize);
}

// ذخیره فایل آپلود شده
function saveUploadedFile($file, $targetDir = '../content/uploads/') {
    if (!file_exists($targetDir)) {
        mkdir($targetDir, 0777, true);
    }

    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = uniqid() . '.' . $extension;
    $targetPath = $targetDir . $filename;

    if (move_uploaded_file($file['tmp_name'], $targetPath)) {
        return ['success' => true, 'filename' => $filename, 'path' => $targetPath];
    } else {
        return ['success' => false, 'message' => 'خطا در ذخیره فایل'];
    }
}

// پردازش درخواست‌های POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $action = $_POST['action'] ?? '';
        $pdo = connectDB();

        switch ($action) {
            // مدیریت پیام‌ها
            case 'delete_message':
                $messageId = $_POST['id'] ?? 0;
                $stmt = $pdo->prepare("DELETE FROM messages WHERE id = ?");
                $stmt->execute([$messageId]);
                sendResponse(true, 'پیام با موفقیت حذف شد');
                break;

            // مدیریت درباره ما
            case 'save_about':
                $description = $_POST['description'] ?? '';
                $work_experience = $_POST['work_experience'] ?? 0;
                $completed_projects = $_POST['completed_projects'] ?? 0;
                $happy_clients = $_POST['happy_clients'] ?? 0;

                $stmt = $pdo->prepare("UPDATE about_us SET description = ?, work_experience = ?, completed_projects = ?, happy_clients = ? WHERE id = 1");
                $stmt->execute([$description, $work_experience, $completed_projects, $happy_clients]);
                sendResponse(true, 'اطلاعات درباره ما با موفقیت ذخیره شد');
                break;

case 'add_portfolio':
    error_log("========= START PORTFOLIO ADD =========");
    
    // دریافت داده‌ها به صورت خام برای دیباگ
    $postData = file_get_contents("php://input");
    error_log("Raw POST data: " . $postData);
    error_log("POST array: " . print_r($_POST, true));
    error_log("FILES array: " . print_r($_FILES, true));

    // بررسی وجود فایل‌ها
    if (empty($_FILES)) {
        error_log("No files received");
        sendResponse(false, 'هیچ فایلی دریافت نشد', [], 400);
    }

    // بررسی وجود action
    if (empty($_POST['action'])) {
        error_log("No action specified");
        sendResponse(false, 'عملیات نامعتبر: action مشخص نشده', [], 400);
    }

    // اعتبارسنجی فیلدهای ضروری
    $required = ['project-name', 'project-category'];
    foreach ($required as $field) {
        if (empty($_POST[$field])) {
            error_log("Missing required field: " . $field);
            sendResponse(false, 'فیلدهای ضروری پر نشده‌اند', [], 400);
        }
    }

    // پردازش تصاویر
    $images = [];
    if (!empty($_FILES['project-images'])) {
        $targetDir = __DIR__ . '/../content/uploads/';
        if (!file_exists($targetDir)) {
            mkdir($targetDir, 0777, true);
        }

        foreach ($_FILES['project-images']['tmp_name'] as $index => $tmpName) {
            if ($_FILES['project-images']['error'][$index] !== UPLOAD_ERR_OK) {
                error_log("Upload error for file: " . $_FILES['project-images']['name'][$index]);
                continue;
            }

            $filename = uniqid() . '_' . basename($_FILES['project-images']['name'][$index]);
            $targetPath = $targetDir . $filename;

            if (move_uploaded_file($tmpName, $targetPath)) {
                $images[] = $filename;
            } else {
                error_log("Failed to move file: " . $_FILES['project-images']['name'][$index]);
            }
        }
    }

// پردازش ویدیو
$video = null;
if (!empty($_FILES['project-video']['tmp_name'])) {
    // اعتبارسنجی اولیه
    if ($_FILES['project-video']['error'] !== UPLOAD_ERR_OK) {
        error_log("Video upload error: " . $_FILES['project-video']['error']);
        sendResponse(false, 'خطا در آپلود ویدیو: کد خطا ' . $_FILES['project-video']['error'], [], 400);
    }

    // بررسی حجم فایل
    if ($_FILES['project-video']['size'] > 1024 * 1024 * 1024) { // 1GB
        sendResponse(false, 'حجم ویدیو نباید بیشتر از 1GB باشد', [], 400);
    }

    $targetDir = __DIR__ . '/../content/videos/';
    if (!file_exists($targetDir)) {
        if (!mkdir($targetDir, 0777, true)) {
            error_log("Cannot create video directory");
            sendResponse(false, 'خطا در ایجاد پوشه ویدیوها', [], 500);
        }
    }

    // نام فایل
    $filename = uniqid() . '_' . preg_replace('/[^a-z0-9\._-]/i', '_', $_FILES['project-video']['name']);
    $targetPath = $targetDir . $filename;

    // ذخیره موقت اطلاعات برای دیباگ
    error_log("Moving video: " . $_FILES['project-video']['tmp_name'] . " to " . $targetPath);

    if (!move_uploaded_file($_FILES['project-video']['tmp_name'], $targetPath)) {
        error_log("Move_uploaded_file failed");
        $lastError = error_get_last();
        error_log("Last error: " . print_r($lastError, true));
        sendResponse(false, 'خطا در ذخیره ویدیو: ' . ($lastError['message'] ?? 'خطای ناشناخته'), [], 500);
    }

    $video = $filename;
}

    // ذخیره در دیتابیس
    try {
        $stmt = $pdo->prepare("INSERT INTO portfolio (name, category, images, video, technologies, client, delivery_time, project_link) 
                              VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        
        $result = $stmt->execute([
            $_POST['project-name'],
            $_POST['project-category'],
            !empty($images) ? json_encode($images) : null,
            $video,
            $_POST['project-tech'] ?? null,
            $_POST['project-client'] ?? null,
            $_POST['project-delivery'] ?? null,
            $_POST['project-link'] ?? null
        ]);
        

        if (!$result) {
            error_log("Database error: " . print_r($stmt->errorInfo(), true));
            sendResponse(false, 'خطا در ذخیره اطلاعات', [], 500);
        }

        sendResponse(true, 'پروژه با موفقیت ذخیره شد', ['id' => $pdo->lastInsertId()]);
    } catch (PDOException $e) {
        error_log("Database exception: " . $e->getMessage());
        sendResponse(false, 'خطای پایگاه داده: ' . $e->getMessage(), [], 500);
    }
    break;
    

            case 'delete_portfolio':
                $portfolioId = $_POST['id'] ?? 0;
                // ابتدا اطلاعات پروژه را دریافت می‌کنیم تا فایل‌ها را حذف کنیم
                $stmt = $pdo->prepare("SELECT images, video FROM portfolio WHERE id = ?");
                $stmt->execute([$portfolioId]);
                $portfolio = $stmt->fetch();

                if ($portfolio) {
                    // حذف تصاویر
                    $images = json_decode($portfolio['images'], true);
                    foreach ($images as $image) {
                        $filePath = '../content/uploads/' . $image;
                        if (file_exists($filePath)) {
                            unlink($filePath);
                        }
                    }

                    // حذف ویدیو
                    if ($portfolio['video']) {
                        $videoPath = '../content/videos/' . $portfolio['video'];
                        if (file_exists($videoPath)) {
                            unlink($videoPath);
                        }
                    }
                }

                // حذف از دیتابیس
                $stmt = $pdo->prepare("DELETE FROM portfolio WHERE id = ?");
                $stmt->execute([$portfolioId]);
                sendResponse(true, 'پروژه با موفقیت حذف شد');
                break;

case 'add_team_member':
    // لاگ تمام داده‌های دریافتی
    error_log("Received POST: " . print_r($_POST, true));
    error_log("Received FILES: " . print_r($_FILES, true));

    // فیلدهای ضروری
    $required = ['member_name', 'member_lastname', 'member_phone', 'member_email', 'member_role'];
    foreach ($required as $field) {
        if (empty($_POST[$field])) {
            sendResponse(false, "فیلد $field الزامی است", [], 400);
        }
    }

    // پردازش تصویر
    $avatar = null;
    if (!empty($_FILES['member_avatar']['tmp_name']) && $_FILES['member_avatar']['size'] > 0) {
        $upload = saveUploadedFile($_FILES['member_avatar'], '../content/team/');
        if (!$upload['success']) {
            sendResponse(false, $upload['message'], [], 400);
        }
        $avatar = $upload['filename'];
    }

    // پردازش رزومه (اگر وجود دارد)
    $resume = null;
    if (!empty($_FILES['member_resume']['tmp_name']) && $_FILES['member_resume']['size'] > 0) {
        // اعتبارسنجی PDF
        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $mime = $finfo->file($_FILES['member_resume']['tmp_name']);
        if (!in_array($mime, ['application/pdf', 'application/x-pdf'])) {
            sendResponse(false, 'فقط فایل‌های PDF مجاز هستند', [], 400);
        }
        
        $filename = uniqid() . '_' . preg_replace('/[^a-z0-9\._-]/i', '_', $_FILES['member_resume']['name']);
        $target = '../content/resumes/' . $filename;
        
        if (!move_uploaded_file($_FILES['member_resume']['tmp_name'], $target)) {
            sendResponse(false, 'خطا در ذخیره رزومه', [], 500);
        }
        $resume = $filename;
    }

    // ذخیره در دیتابیس
    try {
        $stmt = $pdo->prepare("INSERT INTO team_members 
            (first_name, last_name, avatar, resume_file, phone, email, about, projects, role) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        
        $stmt->execute([
            $_POST['member_name'],
            $_POST['member_lastname'],
            $avatar,
            $resume,
            $_POST['member_phone'],
            $_POST['member_email'],
            $_POST['member_about'] ?? '',
            $_POST['member_projects'] ?? '',
            $_POST['member_role']
        ]);
        
        sendResponse(true, 'عضو تیم با موفقیت ذخیره شد', [
            'id' => $pdo->lastInsertId(),
            'avatar' => $avatar,
            'resume' => $resume
        ]);
    } catch (PDOException $e) {
        error_log("DB Error: " . $e->getMessage());
        sendResponse(false, 'خطای پایگاه داده: ' . $e->getMessage(), [], 500);
    }
    break;

          case 'delete_team_member':
    $memberId = $_POST['id'] ?? 0;
    // دریافت اطلاعات عضو
    $stmt = $pdo->prepare("SELECT avatar, resume_file FROM team_members WHERE id = ?");
    $stmt->execute([$memberId]);
    $member = $stmt->fetch();

    if ($member) {
        // حذف تصویر پروفایل
        if ($member['avatar']) {
            $filePath = '../content/team/' . $member['avatar'];
            if (file_exists($filePath)) {
                unlink($filePath);
            }
        }
        
        // حذف فایل رزومه
        if ($member['resume_file']) {
            $resumePath = '../content/resumes/' . $member['resume_file'];
            if (file_exists($resumePath)) {
                unlink($resumePath);
            }
        }
    }

    // حذف از دیتابیس
    $stmt = $pdo->prepare("DELETE FROM team_members WHERE id = ?");
    $stmt->execute([$memberId]);
    sendResponse(true, 'عضو تیم با موفقیت حذف شد');
    break;

            // مدیریت مقالات
            case 'add_article':
                $requiredFields = ['title', 'category', 'key_point', 'content'];
                foreach ($requiredFields as $field) {
                    if (empty($_POST[$field])) {
                        sendResponse(false, "فیلد $field الزامی است", [], 400);
                    }
                }

                $stmt = $pdo->prepare("INSERT INTO articles (title, category, key_point, content) VALUES (?, ?, ?, ?)");
                $stmt->execute([
                    $_POST['title'],
                    $_POST['category'],
                    $_POST['key_point'],
                    $_POST['content']
                ]);

                sendResponse(true, 'مقاله با موفقیت منتشر شد', ['id' => $pdo->lastInsertId()]);
                break;

            case 'delete_article':
                $articleId = $_POST['id'] ?? 0;
                $stmt = $pdo->prepare("DELETE FROM articles WHERE id = ?");
                $stmt->execute([$articleId]);
                sendResponse(true, 'مقاله با موفقیت حذف شد');
                break;

            default:
                sendResponse(false, 'عملیات نامعتبر', [], 400);
        }
    } catch (PDOException $e) {
        error_log("Database error: " . $e->getMessage());
        sendResponse(false, 'خطای پایگاه داده', [], 500);
    } catch (Exception $e) {
        error_log("Error: " . $e->getMessage());
        sendResponse(false, 'خطای سرور', [], 500);
    }
}

// پردازش درخواست‌های GET
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $action = $_GET['action'] ?? '';
        $pdo = connectDB();

        switch ($action) {
            // دریافت پیام‌ها
            case 'get_messages':
                $stmt = $pdo->query("SELECT * FROM messages ORDER BY created_at DESC");
                $messages = $stmt->fetchAll();
                sendResponse(true, '', $messages);
                break;

            // دریافت اطلاعات درباره ما
            case 'get_about':
                $stmt = $pdo->query("SELECT * FROM about_us WHERE id = 1");
                $about = $stmt->fetch();
                sendResponse(true, '', $about);
                break;

            // دریافت نمونه کارها
            case 'get_portfolio':
                $stmt = $pdo->query("SELECT * FROM portfolio ORDER BY id DESC");
                $portfolio = $stmt->fetchAll();
                // تبدیل JSON images به آرایه
                foreach ($portfolio as &$item) {
                    $item['images'] = json_decode($item['images'], true);
                }
                sendResponse(true, '', $portfolio);
                break;

            // دریافت اعضای تیم
            case 'get_team':
                $stmt = $pdo->query("SELECT * FROM team_members ORDER BY id DESC");
                $team = $stmt->fetchAll();
                sendResponse(true, '', $team);
                break;

            // دریافت مقالات
            case 'get_articles':
                $stmt = $pdo->query("SELECT * FROM articles ORDER BY id DESC");
                $articles = $stmt->fetchAll();
                sendResponse(true, '', $articles);
                break;

            default:
                sendResponse(false, 'عملیات نامعتبر', [], 400);
        }
    } catch (PDOException $e) {
        error_log("Database error: " . $e->getMessage());
        sendResponse(false, 'خطای پایگاه داده', [], 500);
    }
}
?>