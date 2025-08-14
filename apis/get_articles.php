<?php
// تنظیم هدرهای ضروری
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// نمایش خطاها برای دیباگ (در محیط تولید غیرفعال کنید)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// اطلاعات اتصال به دیتابیس
$host = 'localhost';
$dbname = 'shopdg_godshop-db';
$username = 'root';
$password = '';

// پاسخ پیش‌فرض
$response = [
    'success' => false,
    'message' => 'خطای ناشناخته رخ داده است',
    'articles' => []
];

try {
    // ایجاد اتصال PDO
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

    // کوئری برای دریافت مقالات
    $stmt = $pdo->query("SELECT id, title, category, key_point, content FROM articles");
    $articles = $stmt->fetchAll();

    // تبدیل محتوا به خلاصه
    foreach ($articles as &$article) {
        $article['excerpt'] = mb_substr(strip_tags($article['content']), 0, 150, 'UTF-8') . '...';
        // اگر تگ‌ها وجود ندارند، یک مقدار پیش‌فرض قرار دهید
        if (!isset($article['tags'])) {
            $article['tags'] = '';
        }
    }

    // تنظیم پاسخ موفقیت‌آمیز
    $response = [
        'success' => true,
        'message' => '',
        'articles' => $articles
    ];

} catch (PDOException $e) {
    $response['message'] = 'خطا در ارتباط با پایگاه داده: ' . $e->getMessage();
} catch (Exception $e) {
    $response['message'] = 'خطای عمومی: ' . $e->getMessage();
}

// ارسال پاسخ به صورت JSON
echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK);
exit;
?>