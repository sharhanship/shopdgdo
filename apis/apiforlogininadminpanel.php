<?php
session_start();
header('Content-Type: application/json');

// تنظیمات دیتابیس
$db_host = 'localhost';
$db_name = 'godshop-db';
$db_user = 'root';
$db_pass = '';

$response = ['success' => false, 'message' => ''];

try {
    // اتصال به دیتابیس
    $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8mb4", $db_user, $db_pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

    // دریافت داده‌های فرم
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';

    // اعتبارسنجی اولیه
    if (empty($username) || empty($password)) {
        throw new Exception('نام کاربری و رمز عبور را وارد کنید');
    }

    // بررسی کاراکترهای خطرناک
    if (preg_match('/[\'";<>()=*]|--|\/\*|\*\//', $username) || preg_match('/[\'";<>()=*]|--|\/\*|\*\//', $password)) {
        throw new Exception('کاراکترهای غیرمجاز در ورودی');
    }

    // جستجوی کاربر در دیتابیس
    $stmt = $pdo->prepare("SELECT id, password FROM `admin-users` WHERE username = ? LIMIT 1");
    $stmt->execute([$username]);
    $user = $stmt->fetch();

    if (!$user) {
        throw new Exception('نام کاربری یا رمز عبور اشتباه است');
    }

    // بررسی رمز عبور
    if (!password_verify($password, $user['password'])) {
        throw new Exception('نام کاربری یا رمز عبور اشتباه است');
    }

    // ایجاد توکن امنیتی
    $token = bin2hex(random_bytes(32));
    $_SESSION['admin_token'] = $token;
    $_SESSION['admin_user_id'] = $user['id'];

    $response = [
        'success' => true,
        'message' => 'ورود موفقیت آمیز بود',
        'token' => $token
    ];

} catch (PDOException $e) {
    $response['message'] = 'خطای پایگاه داده';
    error_log("DB Error: " . $e->getMessage());
} catch (Exception $e) {
    $response['message'] = $e->getMessage();
}

echo json_encode($response, JSON_UNESCAPED_UNICODE);
?>