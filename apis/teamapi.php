<?php
/**
 * API مدیریت اعضای تیم
 * 
 * این فایل سه عملکرد اصلی دارد:
 * 1. دریافت لیست تمام اعضای تیم
 * 2. دریافت جزئیات یک عضو خاص
 * 3. دانلود فایل رزومه اعضا
 */

// تنظیم هدرهای HTTP
header('Content-Type: application/json; charset=utf-8'); // نوع محتوای پاسخ
header('Access-Control-Allow-Origin: *'); // اجازه دسترسی از همه دامنه‌ها (CORS)

// فعال کردن لاگینگ برای دیباگ
error_reporting(E_ALL); // گزارش تمام خطاها
ini_set('display_errors', 1); // نمایش خطاها (فقط در محیط توسعه)
file_put_contents('teamapi.log', date('Y-m-d H:i:s') . " - Request started\n", FILE_APPEND); // ثبت زمان شروع درخواست

// اطلاعات اتصال به پایگاه داده
$host = 'localhost'; // آدرس سرور دیتابیس
$dbname = 'shopdg_godshop-db'; // نام دیتابیس
$username = 'root'; // نام کاربری دیتابیس
$password = ''; // رمز عبور دیتابیس

try {
    // ایجاد اتصال به پایگاه داده با PDO
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    // تنظیم حالت خطا به حالت استثنا
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    /**
     * بخش اول: دانلود رزومه عضو تیم
     * (زمانی که پارامترهای download و id در GET وجود دارند)
     */
    if (isset($_GET['download']) && isset($_GET['id'])) {
        // جستجوی عضو تیم در دیتابیس
        $stmt = $pdo->prepare("SELECT resume_file FROM team_members WHERE id = ?");
        $stmt->execute([$_GET['id']]);
        $member = $stmt->fetch();

        // اگر عضو وجود داشت و فایل رزومه داشت
        if ($member && $member['resume_file']) {
            $filePath = '../content/resumes/' . $member['resume_file'];
            
            // اگر فایل وجود داشت
            if (file_exists($filePath)) {
                // تنظیم هدرهای مناسب برای دانلود فایل PDF
                header('Content-Description: File Transfer');
                header('Content-Type: application/pdf');
                header('Content-Disposition: attachment; filename="'.basename($filePath).'"');
                header('Expires: 0');
                header('Cache-Control: must-revalidate');
                header('Pragma: public');
                header('Content-Length: ' . filesize($filePath));
                
                // ارسال فایل به کاربر
                readfile($filePath);
                exit;
            }
        }
        
        // اگر فایل پیدا نشد
        header("HTTP/1.0 404 Not Found");
        exit;
    }

    /**
     * بخش دوم: دریافت جزئیات یک عضو خاص
     * (زمانی که پارامتر member_id در GET وجود دارد)
     */
    if (isset($_GET['member_id'])) {
        $stmt = $pdo->prepare("SELECT * FROM team_members WHERE id = ?");
        $stmt->execute([$_GET['member_id']]);
        $member = $stmt->fetch();

        // اگر عضو پیدا شد
        if ($member) {
            echo json_encode([
                'status' => 'success',
                'data' => $member
            ]);
            exit;
        }
    }

    /**
     * بخش سوم: دریافت لیست تمام اعضای تیم
     * (حالت پیش‌فرض زمانی که پارامتر خاصی ارسال نشده)
     */
    $stmt = $pdo->query("SELECT id, first_name, last_name, avatar, role, resume_file FROM team_members ORDER BY created_at DESC");
    $members = $stmt->fetchAll();

    // ارسال پاسخ موفقیت‌آمیز با لیست اعضا
    echo json_encode([
        'status' => 'success',
        'data' => $members
    ]);
    exit;

} catch (PDOException $e) {
    // ثبت خطا در فایل لاگ
    file_put_contents('teamapi.log', "Error: " . $e->getMessage() . "\n", FILE_APPEND);
    
    // ارسال پاسخ خطا به کاربر
    echo json_encode([
        'status' => 'error',
        'message' => 'خطای دیتابیس'
    ]);
    exit;
}
?>