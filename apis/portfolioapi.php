<?php
/**
 * فایل API مدیریت پروژه‌های پورتفولیو
 * 
 * این فایل دو حالت دارد:
 * 1. دریافت لیست تمام پروژه‌ها (صفحه اصلی)
 * 2. دریافت جزئیات یک پروژه خاص (صفحه جزئیات)
 */

// تنظیم هدرهای HTTP
header('Content-Type: application/json; charset=utf-8'); // نوع محتوای پاسخ
header('Access-Control-Allow-Origin: *'); // اجازه دسترسی از همه دامنه‌ها (CORS)

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
     * حالت اول: دریافت جزئیات یک پروژه خاص
     * (زمانی که پارامتر project_id در GET وجود دارد)
     */
    if (isset($_GET['project_id'])) {
        // آماده‌سازی و اجرای کوئری با استفاده از prepared statement برای امنیت بیشتر
        $stmt = $pdo->prepare("SELECT * FROM portfolio WHERE id = ?");
        $stmt->execute([$_GET['project_id']]);
        $project = $stmt->fetch();

        // اگر پروژه پیدا شد
        if ($project) {
            /**
             * پردازش فیلد images که به صورت JSON ذخیره شده
             * - ابتدا سعی می‌کنیم با json_decode آرایه را بخوانیم
             * - اگر موفق نشدیم، با روش جایگزین رشته را پردازش می‌کنیم
             */
            $images = json_decode($project['images']);
            if (!is_array($images)) {
                // روش جایگزین برای زمانی که json_decode موفق نباشد
                $images = array_filter(explode(',', str_replace(['[', ']', '"'], '', $project['images'])));
            }

            /**
             * ساخت آدرس کامل تصاویر
             * - هر نام فایل به مسیر uploads اضافه می‌شود
             */
            $project['image_urls'] = array_map(function($img) {
                return '../content/uploads/' . trim($img);
            }, $images);

            /**
             * پردازش فیلد ویدیو
             * - اگر ویدیویی وجود دارد، آدرس کامل آن ساخته می‌شود
             */
            if (!empty($project['video'])) {
                $project['video_url'] = '../content/videos/' . $project['video'];
            }

            // ارسال پاسخ موفقیت‌آمیز با داده‌های پروژه
            echo json_encode([
                'status' => 'success',
                'data' => $project
            ]);
            exit;
        }
    } 
    /**
     * حالت دوم: دریافت لیست تمام پروژه‌ها
     * (زمانی که پارامتر project_id وجود ندارد)
     */
    else {
        // دریافت تمام پروژه‌ها از دیتابیس
        $stmt = $pdo->query("SELECT id, name, category, images FROM portfolio ORDER BY created_at DESC");
        $projects = $stmt->fetchAll();

        /**
         * پردازش هر پروژه برای استخراج اولین تصویر
         * - هر پروژه توسط reference (&$project) پردازش می‌شود
         */
        foreach ($projects as &$project) {
            $images = json_decode($project['images']);
            // اگر تصاویر به درستی خوانده شدند و آرایه خالی نبود
            if (is_array($images) && count($images) > 0) {
                // ذخیره آدرس اولین تصویر
                $project['first_image'] = './content/uploads/' . trim($images[0]);
            }
        }

        // ارسال پاسخ موفقیت‌آمیز با لیست پروژه‌ها
        echo json_encode([
            'status' => 'success',
            'data' => $projects
        ]);
        exit;
    }

} catch (PDOException $e) {
    /**
     * مدیریت خطاهای پایگاه داده
     * - ثبت خطا در فایل لاگ سرور
     * - ارسال پاسخ خطا به کاربر
     */
    error_log('Database Error: ' . $e->getMessage());
    echo json_encode([
        'status' => 'error',
        'message' => 'خطای دیتابیس: ' . $e->getMessage()
    ]);
    exit;
}

/**
 * اگر هیچ یک از شرایط بالا برقرار نبود
 * (مثلاً project_id ارسال شده ولی پروژه‌ای پیدا نشد)
 */
echo json_encode([
    'status' => 'error',
    'message' => 'درخواست نامعتبر'
]);
exit;
?>