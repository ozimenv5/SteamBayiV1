<?php
// Steam Delivery System - Configuration
// PHP 7.4 Compatible

// Hata raporlama (production'da kapatın)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Timezone ayarı
date_default_timezone_set('Europe/Istanbul');

// Veritabanı ayarları - Bu bilgileri cPanel'den alın
define('DB_HOST', 'localhost');
define('DB_NAME', 'your_database_name');     // cPanel'deki veritabanı adınız
define('DB_USER', 'your_database_user');     // cPanel'deki kullanıcı adınız  
define('DB_PASS', 'your_database_password'); // cPanel'deki şifreniz

// Admin şifresi
define('ADMIN_PASSWORD', 'xenforce123');

// Güvenlik ayarları
define('SESSION_TIMEOUT', 3600); // 1 saat
define('MAX_LOGIN_ATTEMPTS', 5);

// Site ayarları
define('SITE_URL', 'https://yourdomain.com/steam-delivery/');
define('SITE_TITLE', 'Steam Hesap Merkezi');

// Veritabanı bağlantı sınıfı
class Database {
    private static $connection = null;
    
    public static function getConnection() {
        if (self::$connection === null) {
            try {
                $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
                self::$connection = new PDO($dsn, DB_USER, DB_PASS, [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                ]);
            } catch (PDOException $e) {
                die("Veritabanı bağlantı hatası: " . $e->getMessage());
            }
        }
        return self::$connection;
    }
}

// Utility fonksiyonları
function generateUUID() {
    return sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand(0, 0xffff), mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0x0fff) | 0x4000,
        mt_rand(0, 0x3fff) | 0x8000,
        mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
    );
}

function sanitizeInput($input) {
    return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
}

function jsonResponse($data, $status = 200) {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

// CORS headers for API calls
function setCorsHeaders() {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }
}

// Session başlatma
session_start();
?>