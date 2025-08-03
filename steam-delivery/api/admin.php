<?php
// Steam Delivery System - Admin API
// PHP 7.4 Compatible

require_once '../config.php';
setCorsHeaders();

$db = Database::getConnection();
$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

// Admin doğrulama fonksiyonu
function verifyAdminSession() {
    if (!isset($_SESSION['admin_logged_in']) || !$_SESSION['admin_logged_in']) {
        jsonResponse(['success' => false, 'message' => 'Unauthorized'], 401);
    }
    
    // Session timeout kontrolü
    if (isset($_SESSION['admin_login_time']) && 
        time() - $_SESSION['admin_login_time'] > SESSION_TIMEOUT) {
        session_destroy();
        jsonResponse(['success' => false, 'message' => 'Session expired'], 401);
    }
}

// Admin şifre doğrulama
if ($method === 'POST' && isset($input['password'])) {
    if ($input['password'] === ADMIN_PASSWORD) {
        $_SESSION['admin_logged_in'] = true;
        $_SESSION['admin_login_time'] = time();
        
        // Güvenlik için session token oluştur
        $token = bin2hex(random_bytes(32));
        $_SESSION['admin_token'] = $token;
        
        jsonResponse([
            'success' => true,
            'message' => 'Admin authenticated successfully',
            'token' => $token
        ]);
    } else {
        jsonResponse([
            'success' => false,
            'message' => 'Invalid admin password'
        ], 401);
    }
}

// Admin oturumu kontrol et
verifyAdminSession();

// Steam Hesap İşlemleri
if (strpos($_SERVER['REQUEST_URI'], '/accounts') !== false) {
    
    if ($method === 'GET') {
        // Hesapları listele
        $stmt = $db->query("SELECT * FROM steam_accounts ORDER BY created_at DESC");
        $accounts = $stmt->fetchAll();
        jsonResponse($accounts);
        
    } elseif ($method === 'POST') {
        // Yeni hesap ekle
        if (!isset($input['username']) || !isset($input['password'])) {
            jsonResponse(['success' => false, 'message' => 'Username and password required'], 400);
        }
        
        $id = generateUUID();
        $username = sanitizeInput($input['username']);
        $password = sanitizeInput($input['password']);
        
        $stmt = $db->prepare("INSERT INTO steam_accounts (id, username, password) VALUES (?, ?, ?)");
        $result = $stmt->execute([$id, $username, $password]);
        
        if ($result) {
            jsonResponse([
                'id' => $id,
                'username' => $username,
                'password' => $password,
                'created_at' => date('Y-m-d H:i:s')
            ]);
        } else {
            jsonResponse(['success' => false, 'message' => 'Failed to create account'], 500);
        }
        
    } elseif ($method === 'DELETE') {
        // Hesap sil
        $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        $pathParts = explode('/', $path);
        $accountId = end($pathParts);
        
        if (!$accountId) {
            jsonResponse(['success' => false, 'message' => 'Account ID required'], 400);
        }
        
        $stmt = $db->prepare("DELETE FROM steam_accounts WHERE id = ?");
        $result = $stmt->execute([$accountId]);
        
        if ($stmt->rowCount() > 0) {
            jsonResponse(['success' => true, 'message' => 'Account deleted successfully']);
        } else {
            jsonResponse(['success' => false, 'message' => 'Account not found'], 404);
        }
    }
}

// Delivery Key İşlemleri
elseif (strpos($_SERVER['REQUEST_URI'], '/keys') !== false) {
    
    if ($method === 'GET') {
        // Key'leri listele
        $stmt = $db->query("SELECT * FROM delivery_keys ORDER BY created_at DESC");
        $keys = $stmt->fetchAll();
        jsonResponse($keys);
        
    } elseif ($method === 'POST') {
        // Yeni key ekle
        if (!isset($input['key_value'])) {
            jsonResponse(['success' => false, 'message' => 'Key value required'], 400);
        }
        
        $id = generateUUID();
        $keyValue = sanitizeInput($input['key_value']);
        
        try {
            $stmt = $db->prepare("INSERT INTO delivery_keys (id, key_value) VALUES (?, ?)");
            $result = $stmt->execute([$id, $keyValue]);
            
            if ($result) {
                jsonResponse([
                    'id' => $id,
                    'key_value' => $keyValue,
                    'created_at' => date('Y-m-d H:i:s')
                ]);
            }
        } catch (PDOException $e) {
            if ($e->getCode() == 23000) { // Duplicate entry
                jsonResponse(['success' => false, 'message' => 'Key already exists'], 400);
            } else {
                jsonResponse(['success' => false, 'message' => 'Failed to create key'], 500);
            }
        }
        
    } elseif ($method === 'DELETE') {
        // Key sil
        $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        $pathParts = explode('/', $path);
        $keyId = end($pathParts);
        
        if (!$keyId) {
            jsonResponse(['success' => false, 'message' => 'Key ID required'], 400);
        }
        
        $stmt = $db->prepare("DELETE FROM delivery_keys WHERE id = ?");
        $result = $stmt->execute([$keyId]);
        
        if ($stmt->rowCount() > 0) {
            jsonResponse(['success' => true, 'message' => 'Key deleted successfully']);
        } else {
            jsonResponse(['success' => false, 'message' => 'Key not found'], 404);
        }
    }
}

else {
    jsonResponse(['success' => false, 'message' => 'Invalid endpoint'], 404);
}
?>