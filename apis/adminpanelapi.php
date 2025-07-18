<?php
/**
 * فایل مدیریت API پنل ادمین
 * 
 * این فایل شامل توابع و endpointهای مختلف برای مدیریت بخش‌های مختلف سایت شامل:
 * - پیام‌ها
 * - درباره ما
 * - نمونه کارها (پورتفولیو)
 * - اعضای تیم
 * - مقالات
 * می‌باشد.
 */

// تنظیم هدرهای HTTP برای پاسخ JSON و کنترل دسترسی (CORS)
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *'); // اجازه دسترسی از همه دامنه‌ها
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS'); // متدهای مجاز
header('Access-Control-Allow-Headers: Content-Type, Authorization'); // هدرهای مجاز

// تنظیمات خطاها
error_reporting(E_ALL); // گزارش تمام خطاها
ini_set('display_errors', 0); // عدم نمایش خطاها به کاربر
ini_set('log_errors', 1); // فعال کردن لاگ خطاها
ini_set('error_log', __DIR__ . '/admin_errors.log'); // مسیر ذخیره لاگ خطاها

// تنظیمات افزایش محدودیت‌ها برای آپلود فایل‌های بزرگ
ini_set('upload_max_filesize', '1024M'); // حداکثر حجم فایل آپلودی
ini_set('post_max_size', '1050M'); // حداکثر حجم داده POST
ini_set('max_execution_time', 300); // زمان اجرای ماکسیمم (ثانیه)
ini_set('max_input_time', 300); // زمان پردازش ورودی ماکسیمم
ini_set('memory_limit', '2048M'); // محدودیت حافظه

// در ابتدای فایل، بعد از بخش تنظیمات، این متغیر را اضافه کنید:
$CACHE_VERSION = file_exists('../cache_version.txt') ? file_get_contents('../cache_version.txt') : '1';

/**
 * تابع برای لاگ دقیق خطاها
 * 
 * @param string $message پیام خطا
 */
function logError($message) {
    file_put_contents(__DIR__.'/upload_errors.log', date('[Y-m-d H:i:s]').' '.$message.PHP_EOL, FILE_APPEND);
}

/**
 * تابع برای نمایش پاسخ‌های JSON استاندارد
 * 
 * @param bool $success وضعیت عملیات
 * @param string $message پیام توضیحی
 * @param array $data داده‌های بازگشتی
 * @param int $statusCode کد وضعیت HTTP
 */
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

/**
 * تابع برای اتصال به پایگاه داده
 * 
 * @return PDO شیء PDO برای ارتباط با دیتابیس
 */
function connectDB() {
    $host = 'localhost';
    $dbname = 'shopdg_godshop-db';
    $username = 'shopdg_setiz';
    $password = 'sLNEpSqQq6b@RGzfuc';

    try {
        // ایجاد اتصال به دیتابیس با PDO
        $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
        // تنظیم حالت خطا به حالت استثنا
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        // تنظیم حالت پیش‌فرض fetch به آرایه انجمنی
        $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        // تنظیم کدگذاری ارتباط
        $pdo->exec("SET NAMES 'utf8mb4'");
        $pdo->exec("SET CHARACTER SET utf8mb4");
        $pdo->exec("SET SESSION collation_connection = 'utf8mb4_unicode_ci'");
        return $pdo;
    } catch (PDOException $e) {
        error_log("Database connection failed: " . $e->getMessage());
        sendResponse(false, 'خطا در اتصال به پایگاه داده', [], 500);
    }
}

/**
 * تابع اعتبارسنجی فایل‌های آپلود شده (تصاویر)
 * 
 * @param array $file فایل آپلود شده
 * @param array $allowedTypes انواع MIME مجاز
 * @param int $maxSize حداکثر حجم مجاز (بایت)
 * @return array نتیجه اعتبارسنجی
 */
function validateUploadedFile($file, $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'], $maxSize = 5 * 1024 * 1024) {
    // بررسی وجود فایل
    if (!isset($file) || $file['error'] === UPLOAD_ERR_NO_FILE) {
        return ['success' => true, 'optional' => true];
    }

    // بررسی خطاهای آپلود
    if ($file['error'] !== UPLOAD_ERR_OK) {
        return ['success' => false, 'message' => 'خطا در آپلود فایل. کد خطا: ' . $file['error']];
    }

    // بررسی حجم فایل
    if ($file['size'] > $maxSize) {
        return ['success' => false, 'message' => 'حجم فایل بیش از حد مجاز است'];
    }

    // بررسی نوع فایل با دو روش مختلف برای امنیت بیشتر
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);

    $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    $allowedExtensions = [
        'jpg' => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'png' => 'image/png',
        'gif' => 'image/gif',
        'webp' => 'image/webp' // اضافه کردن WebP
    ];

    // بررسی همزمان MIME type و extension
    if (!in_array($mime, $allowedTypes)) {
        return ['success' => false, 'message' => 'نوع فایل مجاز نیست (MIME)'];
    }

    if (!array_key_exists($extension, $allowedExtensions)) {
        return ['success' => false, 'message' => 'نوع فایل مجاز نیست (Extension)'];
    }

    if ($allowedExtensions[$extension] !== $mime) {
        return ['success' => false, 'message' => 'نوع فایل با پسوند آن مطابقت ندارد'];
    }

    // بررسی محتوای فایل تصویر
    if (strpos($mime, 'image/') === 0) {
        $imageInfo = getimagesize($file['tmp_name']);
        if (!$imageInfo) {
            return ['success' => false, 'message' => 'فایل تصویر معتبر نیست'];
        }
    }

    return ['success' => true];
}

/**
 * تابع اعتبارسنجی فایل‌های ویدیویی
 * 
 * @param array $file فایل ویدیویی آپلود شده
 * @param int $maxSize حداکثر حجم مجاز (بایت)
 * @return array نتیجه اعتبارسنجی
 */
function validateVideoFile($file, $maxSize = 500 * 1024 * 1024) {
    $allowedExtensions = ['mp4', 'webm', 'ogg'];
    $allowedMimeTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    
    // بررسی وجود فایل
    if (!isset($file) || $file['error'] === UPLOAD_ERR_NO_FILE) {
        return ['success' => true, 'optional' => true];
    }

    // بررسی خطاهای آپلود
    if ($file['error'] !== UPLOAD_ERR_OK) {
        return ['success' => false, 'message' => 'خطا در آپلود فایل. کد خطا: ' . $file['error']];
    }

    // بررسی حجم فایل
    if ($file['size'] > $maxSize) {
        return ['success' => false, 'message' => 'حجم فایل بیش از حد مجاز است'];
    }

    // بررسی پسوند فایل
    $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    if (!in_array($extension, $allowedExtensions)) {
        return ['success' => false, 'message' => 'پسوند فایل مجاز نیست'];
    }

    // بررسی MIME type
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);
    
    if (!in_array($mime, $allowedMimeTypes)) {
        return ['success' => false, 'message' => 'نوع فایل ویدیویی معتبر نیست'];
    }

    return ['success' => true];
}

// پردازش درخواست‌های POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $action = $_POST['action'] ?? '';
        $pdo = connectDB();

        switch ($action) {
            // مدیریت پیام‌ها - حذف پیام
            case 'delete_message':
                $messageId = (int)($_POST['id'] ?? 0);
                if ($messageId <= 0) {
                    sendResponse(false, 'شناسه پیام نامعتبر است', [], 400);
                }
                
                $stmt = $pdo->prepare("DELETE FROM messages WHERE id = ?");
                $stmt->execute([$messageId]);
                
                  //تنظیم مجدد کش
                  file_put_contents('../cache_version.txt', time());
                
                sendResponse(true, 'پیام با موفقیت حذف شد');
                break;

            // مدیریت درباره ما - ذخیره اطلاعات
            case 'save_about':
                $description = htmlspecialchars($_POST['description'] ?? '', ENT_QUOTES, 'UTF-8');
                $work_experience = (int)($_POST['work_experience'] ?? 0);
                $completed_projects = (int)($_POST['completed_projects'] ?? 0);
                $happy_clients = (int)($_POST['happy_clients'] ?? 0);

                $stmt = $pdo->prepare("UPDATE about_us SET description = ?, work_experience = ?, completed_projects = ?, happy_clients = ? WHERE id = 1");
                $stmt->execute([$description, $work_experience, $completed_projects, $happy_clients]);
                    
                    //تنظیم مجدد کش
                  file_put_contents('../cache_version.txt', time());
                
                sendResponse(true, 'اطلاعات درباره ما با موفقیت ذخیره شد');
                break;

            // مدیریت نمونه کارها - افزودن پروژه جدید
            case 'add_portfolio':
                // اعتبارسنجی فیلدهای ضروری
                $required = ['project-name', 'project-category'];
                foreach ($required as $field) {
                    if (empty($_POST[$field])) {
                        sendResponse(false, 'فیلدهای ضروری پر نشده‌اند', [], 400);
                    }
                }

                // پردازش تصاویر
                $images = [];
                if (!empty($_FILES['project-images']['tmp_name'][0])) {
                    $maxImages = 5;
                    
                    // بررسی تعداد تصاویر
                    if (count($_FILES['project-images']['tmp_name']) > $maxImages) {
                        sendResponse(false, "حداکثر $maxImages تصویر می‌توانید آپلود کنید", [], 400);
                    }
                    
                    foreach ($_FILES['project-images']['tmp_name'] as $index => $tmpName) {
                        $file = [
                            'name' => $_FILES['project-images']['name'][$index],
                            'type' => $_FILES['project-images']['type'][$index],
                            'tmp_name' => $tmpName,
                            'error' => $_FILES['project-images']['error'][$index],
                            'size' => $_FILES['project-images']['size'][$index]
                        ];
                        
                        $validation = validateUploadedFile($file);
                        if (!$validation['success']) {
                            sendResponse(false, "خطا در تصویر " . ($index+1) . ": " . $validation['message'], [], 400);
                        }
                        
                        // ایجاد نام منحصر به فرد برای فایل
                        $filename = uniqid('img_') . '_' . bin2hex(random_bytes(4)) . '.' . pathinfo($file['name'], PATHINFO_EXTENSION);
                        $targetPath = '../content/uploads/' . $filename;
                        
                        if (!move_uploaded_file($tmpName, $targetPath)) {
                            sendResponse(false, 'خطا در ذخیره تصویر', [], 500);
                        }
                        
                        $images[] = $filename;
                    }
                }

                // پردازش ویدیو
                $video = null;
                if (!empty($_FILES['project-video']['tmp_name'])) {
                    $validation = validateVideoFile($_FILES['project-video']);
                    if (!$validation['success']) {
                        sendResponse(false, $validation['message'], [], 400);
                    }
                    
                    // ایجاد نام منحصر به فرد برای ویدیو
                    $videoName = uniqid('video_') . '_' . bin2hex(random_bytes(4)) . '.' . pathinfo($_FILES['project-video']['name'], PATHINFO_EXTENSION);
                    $targetPath = '../content/videos/' . $videoName;
                    
                    if (!move_uploaded_file($_FILES['project-video']['tmp_name'], $targetPath)) {
                        sendResponse(false, 'خطا در ذخیره ویدیو', [], 500);
                    }
                    
                    $video = $videoName;
                }

                // ذخیره در دیتابیس
                try {
                    $stmt = $pdo->prepare("INSERT INTO portfolio 
                        (name, category, images, video, technologies, client, delivery_time, project_link) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
                    
                    $stmt->execute([
                        htmlspecialchars($_POST['project-name'], ENT_QUOTES, 'UTF-8'),
                        $_POST['project-category'],
                        !empty($images) ? json_encode($images) : null,
                        $video,
                        htmlspecialchars($_POST['project-tech'] ?? '', ENT_QUOTES, 'UTF-8'),
                        htmlspecialchars($_POST['project-client'] ?? '', ENT_QUOTES, 'UTF-8'),
                        htmlspecialchars($_POST['project-delivery'] ?? '', ENT_QUOTES, 'UTF-8'),
                        filter_var($_POST['project-link'] ?? '', FILTER_SANITIZE_URL)
                    ]);
                    
                      //تنظیم مجدد کش
                  file_put_contents('../cache_version.txt', time());
                    
                    sendResponse(true, 'پروژه با موفقیت ذخیره شد', ['id' => $pdo->lastInsertId()]);
                } catch (PDOException $e) {
                    error_log("Database exception: " . $e->getMessage());
                    sendResponse(false, 'خطای پایگاه داده: ' . $e->getMessage(), [], 500);
                }
                break;

            // مدیریت نمونه کارها - حذف پروژه
            case 'delete_portfolio':
                $portfolioId = (int)($_POST['id'] ?? 0);
                if ($portfolioId <= 0) {
                    sendResponse(false, 'شناسه پروژه نامعتبر است', [], 400);
                }
                
                // دریافت اطلاعات پروژه برای حذف فایل‌های مرتبط
                $stmt = $pdo->prepare("SELECT images, video FROM portfolio WHERE id = ?");
                $stmt->execute([$portfolioId]);
                $portfolio = $stmt->fetch();

                if ($portfolio) {
                    // حذف تصاویر
                    if ($portfolio['images']) {
                        $images = json_decode($portfolio['images'], true);
                        foreach ($images as $image) {
                            $filePath = '../content/uploads/' . $image;
                            if (file_exists($filePath)) {
                                unlink($filePath);
                            }
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
                
                  //تنظیم مجدد کش
                  file_put_contents('../cache_version.txt', time());
                
                sendResponse(true, 'پروژه با موفقیت حذف شد');
                break;

            // مدیریت اعضای تیم - افزودن عضو جدید
            case 'add_team_member':
                // فیلدهای ضروری
                $required = ['member_name', 'member_lastname', 'member_phone', 'member_email', 'member_role'];
                foreach ($required as $field) {
                    if (empty($_POST[$field])) {
                        sendResponse(false, "فیلد $field الزامی است", [], 400);
                    }
                }

                // اعتبارسنجی ایمیل
                if (!filter_var($_POST['member_email'], FILTER_VALIDATE_EMAIL)) {
                    sendResponse(false, 'فرمت ایمیل نامعتبر است', [], 400);
                }

                // پردازش تصویر پروفایل
                $avatar = null;
                if (!empty($_FILES['member_avatar']['tmp_name'])) {
                    $validation = validateUploadedFile($_FILES['member_avatar']);
                    if (!$validation['success']) {
                        sendResponse(false, $validation['message'], [], 400);
                    }
                    
                    // ایجاد نام منحصر به فرد برای تصویر
                    $avatarName = uniqid('avatar_') . '_' . bin2hex(random_bytes(4)) . '.' . pathinfo($_FILES['member_avatar']['name'], PATHINFO_EXTENSION);
                    $targetPath = '../content/team/' . $avatarName;
                    
                    if (!move_uploaded_file($_FILES['member_avatar']['tmp_name'], $targetPath)) {
                        sendResponse(false, 'خطا در ذخیره تصویر پروفایل', [], 500);
                    }
                    
                    $avatar = $avatarName;
                }

                // پردازش رزومه (اگر وجود دارد)
                $resume = null;
                if (!empty($_FILES['member_resume']['tmp_name'])) {
                    // اعتبارسنجی PDF
                    $finfo = new finfo(FILEINFO_MIME_TYPE);
                    $mime = $finfo->file($_FILES['member_resume']['tmp_name']);
                    if (!in_array($mime, ['application/pdf', 'application/x-pdf'])) {
                        sendResponse(false, 'فقط فایل‌های PDF مجاز هستند', [], 400);
                    }
                    
                    // ایجاد نام امن برای فایل رزومه
                    $filename = uniqid() . '_' . preg_replace('/[^a-z0-9\._-]/i', '_', $_FILES['member_resume']['name']);
                    $target = '../content/resumes/' . $filename;
                    
                    if (!move_uploaded_file($_FILES['member_resume']['tmp_name'], $target)) {
                        sendResponse(false, 'خطا در ذخیره رزومه', [], 500);
                    }
                    $resume = $filename;
                }

                // ذخیره در دیتابیس
                $stmt = $pdo->prepare("INSERT INTO team_members 
                    (first_name, last_name, avatar, resume_file, phone, email, about, projects, role) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
                
                $stmt->execute([
                    htmlspecialchars($_POST['member_name'], ENT_QUOTES, 'UTF-8'),
                    htmlspecialchars($_POST['member_lastname'], ENT_QUOTES, 'UTF-8'),
                    $avatar,
                    $resume,
                    htmlspecialchars($_POST['member_phone'], ENT_QUOTES, 'UTF-8'),
                    filter_var($_POST['member_email'], FILTER_SANITIZE_EMAIL),
                    htmlspecialchars($_POST['member_about'] ?? '', ENT_QUOTES, 'UTF-8'),
                    htmlspecialchars($_POST['member_projects'] ?? '', ENT_QUOTES, 'UTF-8'),
                    $_POST['member_role']
                ]);
                
                  //تنظیم مجدد کش
                  file_put_contents('../cache_version.txt', time());
                
                sendResponse(true, 'عضو تیم با موفقیت ذخیره شد', [
                    'id' => $pdo->lastInsertId(),
                    'avatar' => $avatar,
                    'resume' => $resume
                ]);
                break;

            // مدیریت اعضای تیم - حذف عضو
            case 'delete_team_member':
                $memberId = (int)($_POST['id'] ?? 0);
                if ($memberId <= 0) {
                    sendResponse(false, 'شناسه عضو تیم نامعتبر است', [], 400);
                }
                
                // دریافت اطلاعات عضو برای حذف فایل‌های مرتبط
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
                
                  //تنظیم مجدد کش
                  file_put_contents('../cache_version.txt', time());
                
                sendResponse(true, 'عضو تیم با موفقیت حذف شد');
                break;

            // مدیریت مقالات - افزودن مقاله جدید
            case 'add_article':
                $requiredFields = ['title', 'category', 'key_point', 'content'];
                foreach ($requiredFields as $field) {
                    if (empty($_POST[$field])) {
                        sendResponse(false, "فیلد $field الزامی است", [], 400);
                    }
                }

                $stmt = $pdo->prepare("INSERT INTO articles (title, category, key_point, content) VALUES (?, ?, ?, ?)");
                $stmt->execute([
                    htmlspecialchars($_POST['title'], ENT_QUOTES, 'UTF-8'),
                    $_POST['category'],
                    htmlspecialchars($_POST['key_point'], ENT_QUOTES, 'UTF-8'),
                    htmlspecialchars($_POST['content'], ENT_QUOTES, 'UTF-8')
                ]);
                
                  //تنظیم مجدد کش
                  file_put_contents('../cache_version.txt', time());

                sendResponse(true, 'مقاله با موفقیت منتشر شد', ['id' => $pdo->lastInsertId()]);
                break;

            // مدیریت مقالات - حذف مقاله
            case 'delete_article':
                $articleId = (int)($_POST['id'] ?? 0);
                if ($articleId <= 0) {
                    sendResponse(false, 'شناسه مقاله نامعتبر است', [], 400);
                }
                
                $stmt = $pdo->prepare("DELETE FROM articles WHERE id = ?");
                $stmt->execute([$articleId]);
                
                  //تنظیم مجدد کش
                  file_put_contents('../cache_version.txt', time());
                
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
            // دریافت لیست پیام‌ها
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

            // دریافت لیست نمونه کارها
            case 'get_portfolio':
                $stmt = $pdo->query("SELECT * FROM portfolio ORDER BY id DESC");
                $portfolio = $stmt->fetchAll();
                // تبدیل JSON images به آرایه
                foreach ($portfolio as &$item) {
                    $item['images'] = json_decode($item['images'], true);
                }
                sendResponse(true, '', $portfolio);
                break;

            // دریافت لیست اعضای تیم
            case 'get_team':
                $stmt = $pdo->query("SELECT * FROM team_members ORDER BY id DESC");
                $team = $stmt->fetchAll();
                sendResponse(true, '', $team);
                break;

            // دریافت لیست مقالات
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