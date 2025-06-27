<?php
// تنظیم هدرهای HTTP برای پاسخ JSON و کنترل دسترسی (CORS)
header('Content-Type: application/json; charset=utf-8');
header("Access-Control-Allow-Origin: *"); // اجازه دسترسی از همه دامنه‌ها
header("Access-Control-Allow-Methods: GET"); // اجازه فقط متد GET

// ساختار پیش‌فرض پاسخ JSON
$response = [
    'status' => 'error', // وضعیت پیش‌فرض خطا
    'message' => '', // پیام خطا یا اطلاعات
    'data' => null // داده‌های اصلی پاسخ
];

try {
    // اتصال به پایگاه داده MySQL با استفاده از PDO
    $pdo = new PDO('mysql:host=localhost;dbname=godshop-db', 'root', '');
    // تنظیم حالت خطا برای PDO به حالت استثنا
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // دریافت اطلاعات درباره ما از جدول about_us
    $stmt = $pdo->query("SELECT * FROM about_us LIMIT 1");
    $aboutData = $stmt->fetch(PDO::FETCH_ASSOC);

    // دریافت تعداد کل مقالات از جدول articles
    $stmt = $pdo->query("SELECT COUNT(*) as article_count FROM articles");
    $articleCount = $stmt->fetch(PDO::FETCH_ASSOC);

    // اگر داده‌های درباره ما وجود داشت
    if ($aboutData) {
        $response['status'] = 'success'; // تغییر وضعیت به موفقیت‌آمیز
        $response['data'] = [
            'description' => $aboutData['description'], // توضیحات درباره ما
            'work_experience' => $aboutData['work_experience'], // سابقه کار
            'completed_projects' => $aboutData['completed_projects'], // پروژه‌های تکمیل شده
            'happy_clients' => $aboutData['happy_clients'], // مشتریان راضی
            'published_articles' => $articleCount['article_count'] ?? 0 // تعداد مقالات منتشر شده
        ];
    } else {
        $response['message'] = 'داده‌ای یافت نشد'; // پیام وقتی داده‌ای وجود ندارد
    }
} catch (PDOException $e) {
    // مدیریت خطاهای پایگاه داده
    $response['message'] = 'خطای پایگاه داده: ' . $e->getMessage();
    // ثبت خطا در لاگ سرور
    error_log('Database Error: ' . $e->getMessage());
}

// تبدیل آرایه پاسخ به JSON و ارسال به کلاینت
echo json_encode($response);
?>