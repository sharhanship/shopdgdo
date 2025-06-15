<?php
header('Content-Type: application/json; charset=utf-8');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
ob_start('ob_gzhandler');

class Database {
    private $host = 'localhost';
    private $db_name = 'shopdgdo_db';
    private $username = 'root';
    private $password = '';
    private $conn;

    public function connect() {
        $this->conn = null;

        try {
            $this->conn = new PDO(
                'mysql:host='.$this->host.';dbname='.$this->db_name,
                $this->username,
                $this->password,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                ]
            );
            $this->conn->exec('SET NAMES utf8mb4');
        } catch(PDOException $e) {
            $this->sendError('Connection failed: '.$e->getMessage());
        }

        return $this->conn;
    }

    private function sendError($message) {
        echo json_encode(['error' => true, 'message' => $message]);
        exit;
    }
}

$db = new Database();
$conn = $db->connect();

function sanitizeInput($data) {
    return htmlspecialchars(strip_tags(trim($data)));
}

$action = sanitizeInput($_POST['action'] ?? '');

if(empty($action)) {
    echo json_encode(['error' => true, 'message' => 'No action specified']);
    exit;
}

try {
    switch($action) {
        case 'get_messages':
            $stmt = $conn->prepare("SELECT * FROM messages ORDER BY created_at DESC");
            $stmt->execute();
            echo json_encode($stmt->fetchAll());
            break;

        case 'delete_message':
            $id = (int)$_POST['id'];
            $stmt = $conn->prepare("DELETE FROM messages WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(['success' => true]);
            break;

        case 'get_about':
            $stmt = $conn->prepare("SELECT * FROM about LIMIT 1");
            $stmt->execute();
            $result = $stmt->fetch() ?: [
                'description' => '',
                'work_experience' => 0,
                'completed_projects' => 0,
                'happy_clients' => 0
            ];
            echo json_encode($result);
            break;

        case 'save_about':
            $description = sanitizeInput($_POST['description'] ?? '');
            $work_experience = (int)$_POST['work_experience'] ?? 0;
            $completed_projects = (int)$_POST['completed_projects'] ?? 0;
            $happy_clients = (int)$_POST['happy_clients'] ?? 0;
            
            $stmt = $conn->prepare("SELECT id FROM about LIMIT 1");
            $stmt->execute();
            $exists = $stmt->fetch();
            
            if ($exists) {
                $stmt = $conn->prepare("UPDATE about SET description = ?, work_experience = ?, completed_projects = ?, happy_clients = ? WHERE id = ?");
                $stmt->execute([$description, $work_experience, $completed_projects, $happy_clients, $exists['id']]);
            } else {
                $stmt = $conn->prepare("INSERT INTO about (description, work_experience, completed_projects, happy_clients) VALUES (?, ?, ?, ?)");
                $stmt->execute([$description, $work_experience, $completed_projects, $happy_clients]);
            }
            
            echo json_encode(['success' => true]);
            break;

        case 'get_portfolio':
            $stmt = $conn->prepare("SELECT * FROM portfolio ORDER BY created_at DESC");
            $stmt->execute();
            $portfolio = $stmt->fetchAll();
            
            foreach ($portfolio as &$item) {
                $stmt = $conn->prepare("SELECT image_path FROM portfolio_images WHERE portfolio_id = ?");
                $stmt->execute([$item['id']]);
                $item['images'] = $stmt->fetchAll(PDO::FETCH_COLUMN, 0);
                
                $stmt = $conn->prepare("SELECT video_path FROM portfolio_videos WHERE portfolio_id = ? LIMIT 1");
                $stmt->execute([$item['id']]);
                $item['video'] = $stmt->fetchColumn();
            }
            
            echo json_encode($portfolio);
            break;

        case 'add_portfolio':
            $project_name = sanitizeInput($_POST['project_name'] ?? '');
            $category = sanitizeInput($_POST['category'] ?? '');
            $technologies = sanitizeInput($_POST['technologies'] ?? '');
            $client = sanitizeInput($_POST['client'] ?? '');
            $delivery_time = sanitizeInput($_POST['delivery_time'] ?? '');
            $project_link = sanitizeInput($_POST['project_link'] ?? '');
            
            $stmt = $conn->prepare("INSERT INTO portfolio (project_name, category, technologies, client, delivery_time, project_link) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->execute([$project_name, $category, $technologies, $client, $delivery_time, $project_link]);
            $portfolio_id = $conn->lastInsertId();
            
            if (!empty($_FILES['images'])) {
                $images_dir = 'uploads/portfolio/images/';
                if (!file_exists($images_dir)) {
                    mkdir($images_dir, 0777, true);
                }
                
                foreach ($_FILES['images']['tmp_name'] as $key => $tmp_name) {
                    $file_name = uniqid() . '_' . basename($_FILES['images']['name'][$key]);
                    $target_path = $images_dir . $file_name;
                    
                    if (move_uploaded_file($tmp_name, $target_path)) {
                        $stmt = $conn->prepare("INSERT INTO portfolio_images (portfolio_id, image_path) VALUES (?, ?)");
                        $stmt->execute([$portfolio_id, $target_path]);
                    }
                }
            }
            
            if (!empty($_FILES['video'])) {
                $videos_dir = 'uploads/portfolio/videos/';
                if (!file_exists($videos_dir)) {
                    mkdir($videos_dir, 0777, true);
                }
                
                $file_name = uniqid() . '_' . basename($_FILES['video']['name']);
                $target_path = $videos_dir . $file_name;
                
                if (move_uploaded_file($_FILES['video']['tmp_name'], $target_path)) {
                    $stmt = $conn->prepare("INSERT INTO portfolio_videos (portfolio_id, video_path) VALUES (?, ?)");
                    $stmt->execute([$portfolio_id, $target_path]);
                }
            }
            
            echo json_encode(['success' => true, 'id' => $portfolio_id]);
            break;

        case 'delete_portfolio':
            $id = (int)$_POST['id'];
            
            $stmt = $conn->prepare("SELECT image_path FROM portfolio_images WHERE portfolio_id = ?");
            $stmt->execute([$id]);
            $images = $stmt->fetchAll(PDO::FETCH_COLUMN, 0);
            
            foreach ($images as $image) {
                if (file_exists($image)) {
                    unlink($image);
                }
            }
            
            $stmt = $conn->prepare("SELECT video_path FROM portfolio_videos WHERE portfolio_id = ?");
            $stmt->execute([$id]);
            $video = $stmt->fetchColumn();
            
            if ($video && file_exists($video)) {
                unlink($video);
            }
            
            $stmt = $conn->prepare("DELETE FROM portfolio WHERE id = ?");
            $stmt->execute([$id]);
            
            echo json_encode(['success' => true]);
            break;

        case 'get_team':
            $stmt = $conn->prepare("SELECT * FROM team_members ORDER BY created_at DESC");
            $stmt->execute();
            echo json_encode($stmt->fetchAll());
            break;

        case 'add_team_member':
            $first_name = sanitizeInput($_POST['first_name'] ?? '');
            $last_name = sanitizeInput($_POST['last_name'] ?? '');
            $phone = sanitizeInput($_POST['phone'] ?? '');
            $email = sanitizeInput($_POST['email'] ?? '');
            $about = sanitizeInput($_POST['about'] ?? '');
            $projects = sanitizeInput($_POST['projects'] ?? '');
            $role = sanitizeInput($_POST['role'] ?? '');
            
            $avatar_path = '';
            if (!empty($_FILES['avatar'])) {
                $avatar_dir = 'uploads/team/avatars/';
                if (!file_exists($avatar_dir)) {
                    mkdir($avatar_dir, 0777, true);
                }
                
                $file_name = uniqid() . '_' . basename($_FILES['avatar']['name']);
                $target_path = $avatar_dir . $file_name;
                
                if (move_uploaded_file($_FILES['avatar']['tmp_name'], $target_path)) {
                    $avatar_path = $target_path;
                }
            }
            
            $stmt = $conn->prepare("INSERT INTO team_members (first_name, last_name, avatar_path, phone, email, about, projects, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$first_name, $last_name, $avatar_path, $phone, $email, $about, $projects, $role]);
            
            echo json_encode(['success' => true, 'id' => $conn->lastInsertId()]);
            break;

        case 'delete_team_member':
            $id = (int)$_POST['id'];
            
            $stmt = $conn->prepare("SELECT avatar_path FROM team_members WHERE id = ?");
            $stmt->execute([$id]);
            $avatar_path = $stmt->fetchColumn();
            
            if ($avatar_path && file_exists($avatar_path)) {
                unlink($avatar_path);
            }
            
            $stmt = $conn->prepare("DELETE FROM team_members WHERE id = ?");
            $stmt->execute([$id]);
            
            echo json_encode(['success' => true]);
            break;

        case 'get_articles':
            $stmt = $conn->prepare("SELECT * FROM articles ORDER BY created_at DESC");
            $stmt->execute();
            $articles = $stmt->fetchAll();
            
            foreach ($articles as &$article) {
                $stmt = $conn->prepare("SELECT AVG(rating) FROM article_comments WHERE article_id = ?");
                $stmt->execute([$article['id']]);
                $article['rating'] = round($stmt->fetchColumn(), 1);
            }
            
            echo json_encode($articles);
            break;

        case 'add_article':
            $title = sanitizeInput($_POST['title'] ?? '');
            $category = sanitizeInput($_POST['category'] ?? '');
            $key_point = sanitizeInput($_POST['key_point'] ?? '');
            $content = sanitizeInput($_POST['content'] ?? '');
            
            $stmt = $conn->prepare("INSERT INTO articles (title, category, key_point, content) VALUES (?, ?, ?, ?)");
            $stmt->execute([$title, $category, $key_point, $content]);
            
            echo json_encode(['success' => true, 'id' => $conn->lastInsertId()]);
            break;

        case 'delete_article':
            $id = (int)$_POST['id'];
            
            $stmt = $conn->prepare("DELETE FROM articles WHERE id = ?");
            $stmt->execute([$id]);
            
            echo json_encode(['success' => true]);
            break;

        case 'get_article_comments':
            $article_id = (int)$_POST['article_id'];
            
            $stmt = $conn->prepare("SELECT * FROM article_comments WHERE article_id = ? ORDER BY created_at DESC");
            $stmt->execute([$article_id]);
            echo json_encode($stmt->fetchAll());
            break;

        default:
            echo json_encode(['error' => true, 'message' => 'Invalid action']);
    }
} catch(PDOException $e) {
    echo json_encode(['error' => true, 'message' => 'Database error: '.$e->getMessage()]);
} catch(Exception $e) {
    echo json_encode(['error' => true, 'message' => 'General error: '.$e->getMessage()]);
}

ob_end_flush();
?>