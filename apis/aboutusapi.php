<?php
header('Content-Type: application/json; charset=utf-8');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");

$response = [
    'status' => 'error',
    'message' => '',
    'data' => null
];

try {
    $pdo = new PDO('mysql:host=localhost;dbname=godshop-db', 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // دریافت اطلاعات درباره ما
    $stmt = $pdo->query("SELECT * FROM about_us LIMIT 1");
    $aboutData = $stmt->fetch(PDO::FETCH_ASSOC);

    // دریافت تعداد مقالات
    $stmt = $pdo->query("SELECT COUNT(*) as article_count FROM articles");
    $articleCount = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($aboutData) {
        $response['status'] = 'success';
        $response['data'] = [
            'description' => $aboutData['description'],
            'work_experience' => $aboutData['work_experience'],
            'completed_projects' => $aboutData['completed_projects'],
            'happy_clients' => $aboutData['happy_clients'],
            'published_articles' => $articleCount['article_count'] ?? 0
        ];
    } else {
        $response['message'] = 'داده‌ای یافت نشد';
    }
} catch (PDOException $e) {
    $response['message'] = 'خطای پایگاه داده: ' . $e->getMessage();
    error_log('Database Error: ' . $e->getMessage());
}

echo json_encode($response);
?>