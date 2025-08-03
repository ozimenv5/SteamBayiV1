<?php
// Steam Delivery System - Key Redemption API
// PHP 7.4 Compatible

require_once '../config.php';
setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Only POST method allowed'], 405);
}

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['key']) || empty(trim($input['key']))) {
    jsonResponse([
        'success' => false,
        'message' => 'Key gerekli!'
    ], 400);
}

$key = sanitizeInput($input['key']);
$db = Database::getConnection();

try {
    // Transaction başlat
    $db->beginTransaction();
    
    // Key'in varlığını kontrol et
    $stmt = $db->prepare("SELECT * FROM delivery_keys WHERE key_value = ?");
    $stmt->execute([$key]);
    $keyData = $stmt->fetch();
    
    if (!$keyData) {
        $db->rollback();
        jsonResponse([
            'success' => false,
            'message' => 'Geçersiz key! Lütfen doğru key\'i girin.'
        ]);
    }
    
    // Mevcut hesapları getir
    $stmt = $db->query("SELECT * FROM steam_accounts");
    $accounts = $stmt->fetchAll();
    
    if (empty($accounts)) {
        $db->rollback();
        jsonResponse([
            'success' => false,
            'message' => 'Şu anda teslim edilecek hesap bulunmuyor.'
        ]);
    }
    
    // Rastgele hesap seç
    $randomAccount = $accounts[array_rand($accounts)];
    
    // Kullanılan key'i sil (tek kullanımlık)
    $stmt = $db->prepare("DELETE FROM delivery_keys WHERE key_value = ?");
    $stmt->execute([$key]);
    
    // Transaction'ı tamamla
    $db->commit();
    
    jsonResponse([
        'success' => true,
        'message' => 'Steam hesabınız başarıyla teslim edildi! Key kullanıldı.',
        'account' => [
            'username' => $randomAccount['username'],
            'password' => $randomAccount['password']
        ]
    ]);
    
} catch (Exception $e) {
    $db->rollback();
    error_log("Key redemption error: " . $e->getMessage());
    jsonResponse([
        'success' => false,
        'message' => 'Sistem hatası oluştu. Lütfen tekrar deneyin.'
    ], 500);
}
?>