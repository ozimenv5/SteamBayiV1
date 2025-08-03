<?php
// Steam Delivery System - Admin Panel
// PHP 7.4 Compatible

require_once 'config.php';

// Check admin authentication
if (!isset($_SESSION['admin_logged_in']) || !$_SESSION['admin_logged_in']) {
    header('Location: admin-login.php');
    exit;
}

// Check session timeout
if (isset($_SESSION['admin_login_time']) && 
    time() - $_SESSION['admin_login_time'] > SESSION_TIMEOUT) {
    session_destroy();
    header('Location: admin-login.php');
    exit;
}

// Handle logout
if (isset($_GET['logout'])) {
    session_destroy();
    header('Location: admin-login.php');
    exit;
}

$db = Database::getConnection();

// Get statistics
try {
    $stmt = $db->query("SELECT COUNT(*) as count FROM steam_accounts");
    $accountCount = $stmt->fetch()['count'];
    
    $stmt = $db->query("SELECT COUNT(*) as count FROM delivery_keys");
    $keyCount = $stmt->fetch()['count'];
} catch (Exception $e) {
    $accountCount = 0;
    $keyCount = 0;
}
?>
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Panel - <?php echo SITE_TITLE; ?></title>
    
    <!-- Meta Tags -->
    <meta name="robots" content="noindex, nofollow">
    
    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMiA3djEwYzAgNS41NSAzLjg0IDkuNzQgOSAxMSA1LjE2LTEuMjYgOS01LjQ1IDktMTFWN2wtMTAtNXoiIGZpbGw9IiMxZTkwZmYiLz4KPC9zdmc+">
    
    <!-- Styles -->
    <link rel="stylesheet" href="assets/style.css">
    <link rel="stylesheet" href="assets/admin.css">
</head>
<body>
    <!-- Particle System -->
    <canvas id="particles-canvas"></canvas>
    
    <!-- Header -->
    <header class="admin-header">
        <div class="container">
            <div class="header-content">
                <div class="header-left">
                    <div class="admin-logo">
                        <i class="fas fa-chart-bar"></i>
                    </div>
                    <div class="header-info">
                        <h1>Steam Admin Panel</h1>
                        <p>Hesap ve Key Yönetim Merkezi</p>
                    </div>
                    
                    <!-- Search (will be shown on relevant tabs) -->
                    <div id="search-container" class="search-container" style="display: none;">
                        <div class="search-input-container">
                            <input
                                type="text"
                                id="search-input"
                                class="search-input"
                                placeholder="Ara..."
                            >
                            <i class="fas fa-search search-icon"></i>
                        </div>
                    </div>
                </div>
                
                <div class="header-right">
                    <a href="?logout=1" class="logout-btn">
                        <i class="fas fa-sign-out-alt"></i>
                        <span>Çıkış</span>
                    </a>
                </div>
            </div>
        </div>
    </header>

    <div class="admin-content">
        <div class="container">
            <!-- Navigation Tabs -->
            <div class="nav-tabs">
                <button class="nav-tab active" data-tab="dashboard">
                    <i class="fas fa-chart-pie"></i>
                    <span>Dashboard</span>
                </button>
                <button class="nav-tab" data-tab="accounts">
                    <i class="fas fa-gamepad"></i>
                    <span>Steam Hesapları</span>
                    <span class="tab-count" id="accounts-count"><?php echo $accountCount; ?></span>
                </button>
                <button class="nav-tab" data-tab="keys">
                    <i class="fas fa-key"></i>
                    <span>Delivery Keys</span>
                    <span class="tab-count" id="keys-count"><?php echo $keyCount; ?></span>
                </button>
            </div>

            <!-- Dashboard Tab -->
            <div id="dashboard-tab" class="tab-content active">
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon blue">
                            <i class="fas fa-users"></i>
                        </div>
                        <div class="stat-info">
                            <h3>Toplam Steam Hesabı</h3>
                            <div class="stat-number"><?php echo $accountCount; ?></div>
                            <div class="stat-trend positive">
                                <i class="fas fa-arrow-up"></i>
                                <span>+12%</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon green">
                            <i class="fas fa-key"></i>
                        </div>
                        <div class="stat-info">
                            <h3>Aktif Delivery Keys</h3>
                            <div class="stat-number"><?php echo $keyCount; ?></div>
                            <div class="stat-trend positive">
                                <i class="fas fa-arrow-up"></i>
                                <span>+8%</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon orange">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <div class="stat-info">
                            <h3>Sistem Durumu</h3>
                            <div class="stat-number">Aktif</div>
                            <div class="stat-status online">
                                <div class="status-dot"></div>
                                <span>Online</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Quick Actions -->
                <div class="glass-card">
                    <h3 class="card-title">
                        <i class="fas fa-bolt"></i>
                        Hızlı İşlemler
                    </h3>
                    <div class="quick-actions">
                        <button class="quick-action-btn" onclick="switchTab('accounts')">
                            <div class="action-icon blue">
                                <i class="fas fa-plus"></i>
                            </div>
                            <div class="action-info">
                                <h4>Steam Hesabı Ekle</h4>
                                <p>Yeni hesap bilgilerini sisteme ekleyin</p>
                            </div>
                        </button>
                        
                        <button class="quick-action-btn" onclick="switchTab('keys')">
                            <div class="action-icon green">
                                <i class="fas fa-key"></i>
                            </div>
                            <div class="action-info">
                                <h4>Delivery Key Oluştur</h4>
                                <p>Yeni teslimat anahtarı oluşturun</p>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Accounts Tab -->
            <div id="accounts-tab" class="tab-content">
                <!-- Add Account Form -->
                <div class="glass-card">
                    <h3 class="card-title">
                        <i class="fas fa-plus"></i>
                        Yeni Steam Hesabı Ekle
                    </h3>
                    <form id="add-account-form" class="add-form">
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label">
                                    <i class="fas fa-user"></i>
                                    Kullanıcı Adı
                                </label>
                                <input
                                    type="text"
                                    id="account-username"
                                    class="form-input"
                                    placeholder="Steam kullanıcı adı"
                                    required
                                >
                            </div>
                            <div class="form-group">
                                <label class="form-label">
                                    <i class="fas fa-lock"></i>
                                    Şifre
                                </label>
                                <input
                                    type="text"
                                    id="account-password"
                                    class="form-input"
                                    placeholder="Steam şifresi"
                                    required
                                >
                            </div>
                            <div class="form-group">
                                <button type="submit" class="btn btn-success">
                                    <i class="fas fa-plus"></i>
                                    Hesap Ekle
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                <!-- Accounts Table -->
                <div class="glass-card">
                    <h3 class="card-title">
                        <i class="fas fa-gamepad"></i>
                        Steam Hesapları
                    </h3>
                    <div class="table-container">
                        <table id="accounts-table" class="data-table">
                            <thead>
                                <tr>
                                    <th><i class="fas fa-user"></i> Kullanıcı Adı</th>
                                    <th><i class="fas fa-lock"></i> Şifre</th>
                                    <th><i class="fas fa-calendar"></i> Ekleme Tarihi</th>
                                    <th><i class="fas fa-cog"></i> İşlemler</th>
                                </tr>
                            </thead>
                            <tbody id="accounts-tbody">
                                <!-- Will be populated by JavaScript -->
                            </tbody>
                        </table>
                        <div id="accounts-empty" class="empty-state" style="display: none;">
                            <i class="fas fa-inbox"></i>
                            <h4>Henüz Steam hesabı eklenmemiş</h4>
                            <p>Yukarıdaki formu kullanarak hesap ekleyebilirsiniz</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Keys Tab -->
            <div id="keys-tab" class="tab-content">
                <!-- Add Key Form -->
                <div class="glass-card">
                    <h3 class="card-title">
                        <i class="fas fa-plus"></i>
                        Yeni Delivery Key Ekle
                    </h3>
                    <form id="add-key-form" class="add-form">
                        <div class="form-row">
                            <div class="form-group flex-2">
                                <label class="form-label">
                                    <i class="fas fa-key"></i>
                                    Key Değeri
                                </label>
                                <input
                                    type="text"
                                    id="key-value"
                                    class="form-input"
                                    placeholder="STEAM-XXXX-XXXX-XXXX"
                                    required
                                    style="font-family: Monaco, monospace; letter-spacing: 1px;"
                                >
                            </div>
                            <div class="form-group">
                                <button type="button" class="btn btn-secondary" onclick="generateRandomKey()">
                                    <i class="fas fa-dice"></i>
                                    Rastgele
                                </button>
                            </div>
                            <div class="form-group">
                                <button type="submit" class="btn btn-success">
                                    <i class="fas fa-plus"></i>
                                    Key Ekle
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                <!-- Keys Table -->
                <div class="glass-card">
                    <h3 class="card-title">
                        <i class="fas fa-key"></i>
                        Delivery Keys
                    </h3>
                    <div class="table-container">
                        <table id="keys-table" class="data-table">
                            <thead>
                                <tr>
                                    <th><i class="fas fa-key"></i> Key</th>
                                    <th><i class="fas fa-calendar"></i> Oluşturma Tarihi</th>
                                    <th><i class="fas fa-circle"></i> Durum</th>
                                    <th><i class="fas fa-cog"></i> İşlemler</th>
                                </tr>
                            </thead>
                            <tbody id="keys-tbody">
                                <!-- Will be populated by JavaScript -->
                            </tbody>
                        </table>
                        <div id="keys-empty" class="empty-state" style="display: none;">
                            <i class="fas fa-key"></i>
                            <h4>Henüz delivery key oluşturulmamış</h4>
                            <p>Yukarıdaki formu kullanarak key ekleyebilirsiniz</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Scripts -->
    <script src="assets/script.js"></script>
    <script src="assets/admin.js"></script>
</body>
</html>