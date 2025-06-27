<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$host = 'localhost';
$dbname = 'godshop-db';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if (isset($_GET['project_id'])) {
        // صفحه جزئیات پروژه
        $stmt = $pdo->prepare("SELECT * FROM portfolio WHERE id = ?");
        $stmt->execute([$_GET['project_id']]);
        $project = $stmt->fetch();

        if ($project) {
            // پردازش تصاویر - روش مطمئن برای آرایه JSON
            $images = json_decode($project['images']);
            if (!is_array($images)) {
                $images = array_filter(explode(',', str_replace(['[', ']', '"'], '', $project['images'])));
            }

            $project['image_urls'] = array_map(function($img) {
                return '../content/uploads/' . trim($img);
            }, $images);

            // پردازش ویدیو
            if (!empty($project['video'])) {
                $project['video_url'] = '../content/videos/' . $project['video'];
            }

            echo json_encode([
                'status' => 'success',
                'data' => $project
            ]);
            exit;
        }
    } else {
        // صفحه اصلی
        $stmt = $pdo->query("SELECT id, name, category, images FROM portfolio ORDER BY created_at DESC");
        $projects = $stmt->fetchAll();

        foreach ($projects as &$project) {
            $images = json_decode($project['images']);
            if (is_array($images) && count($images) > 0) {
                $project['first_image'] = './content/uploads/' . trim($images[0]);
            }
        }

        echo json_encode([
            'status' => 'success',
            'data' => $projects
        ]);
        exit;
    }

} catch (PDOException $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'خطای دیتابیس: ' . $e->getMessage()
    ]);
    exit;
}

echo json_encode([
    'status' => 'error',
    'message' => 'درخواست نامعتبر'
]);
exit;
?>