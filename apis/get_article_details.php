<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

// نمایش خطاها برای دیباگ
error_reporting(E_ALL);
ini_set('display_errors', 1);

// اطلاعات اتصال به دیتابیس (مقادیر را با اطلاعات خود جایگزین کنید)
$host = 'localhost';
$dbname = 'shopdg_godshop-db';
$username = 'root';
$password = '';

try {
    // ایجاد اتصال PDO
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // دریافت ID مقاله از پارامتر GET
    $articleId = $_GET['id'] ?? null;
    
    if (!$articleId) {
        throw new Exception('شناسه مقاله مشخص نشده است');
    }

    // کوئری برای دریافت مقاله
    $stmt = $pdo->prepare("SELECT title, key_point, content FROM articles WHERE id = ?");
    $stmt->execute([$articleId]);
    $article = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$article) {
        throw new Exception('مقاله مورد نظر یافت نشد');
    }

    // بازگرداندن داده به صورت JSON
    echo json_encode([
        'success' => true,
        'article' => $article
    ], JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
?>