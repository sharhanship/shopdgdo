<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

// لاگینگ برای دیباگ
error_reporting(E_ALL);
ini_set('display_errors', 1);
file_put_contents('teamapi.log', date('Y-m-d H:i:s') . " - Request started\n", FILE_APPEND);

$host = 'localhost';
$dbname = 'godshop-db';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // بخش دانلود رزومه
    if (isset($_GET['download']) && isset($_GET['id'])) {
        $stmt = $pdo->prepare("SELECT resume_file FROM team_members WHERE id = ?");
        $stmt->execute([$_GET['id']]);
        $member = $stmt->fetch();

        if ($member && $member['resume_file']) {
            $filePath = '../content/resumes/' . $member['resume_file'];
            
            if (file_exists($filePath)) {
                header('Content-Description: File Transfer');
                header('Content-Type: application/pdf');
                header('Content-Disposition: attachment; filename="'.basename($filePath).'"');
                header('Expires: 0');
                header('Cache-Control: must-revalidate');
                header('Pragma: public');
                header('Content-Length: ' . filesize($filePath));
                readfile($filePath);
                exit;
            }
        }
        
        header("HTTP/1.0 404 Not Found");
        exit;
    }

    // بخش جزئیات عضو
    if (isset($_GET['member_id'])) {
        $stmt = $pdo->prepare("SELECT * FROM team_members WHERE id = ?");
        $stmt->execute([$_GET['member_id']]);
        $member = $stmt->fetch();

        if ($member) {
            echo json_encode([
                'status' => 'success',
                'data' => $member
            ]);
            exit;
        }
    }

    // بخش لیست اعضا
    $stmt = $pdo->query("SELECT id, first_name, last_name, avatar, role, resume_file FROM team_members ORDER BY created_at DESC");
    $members = $stmt->fetchAll();

    echo json_encode([
        'status' => 'success',
        'data' => $members
    ]);
    exit;

} catch (PDOException $e) {
    file_put_contents('teamapi.log', "Error: " . $e->getMessage() . "\n", FILE_APPEND);
    echo json_encode([
        'status' => 'error',
        'message' => 'خطای دیتابیس'
    ]);
    exit;
}
?>