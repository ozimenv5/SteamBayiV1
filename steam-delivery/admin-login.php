<?php
// Steam Delivery System - Admin Login Page
// PHP 7.4 Compatible

require_once 'config.php';

// Check if already logged in
if (isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in']) {
    header('Location: admin.php');
    exit;
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
    <meta name="description" content="Admin Panel Giriş">
    
    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMiA3djEwYzAgNS41NSAzLjg0IDkuNzQgOSAxMSA1LjE2LTEuMjYgOS01LjQ1IDktMTFWN2wtMTAtNXoiIGZpbGw9IiNlZjQ0NDQiLz4KPC9zdmc+">
    
    <!-- Styles -->
    <link rel="stylesheet" href="assets/style.css">
    <style>
        .admin-header .logo-icon {
            background: linear-gradient(135deg, #ef4444, #dc2626);
            box-shadow: 0 20px 40px rgba(239, 68, 68, 0.3);
        }
        .admin-header .logo-icon::before {
            border-color: rgba(239, 68, 68, 0.3);
        }
    </style>
</head>
<body>
    <!-- Particle System -->
    <canvas id="particles-canvas"></canvas>
    
    <!-- Background Effects -->
    <div class="bg-animated">
        <div class="bg-image" style="background-image: url('https://images.unsplash.com/photo-1520347869523-5a7911be9fca?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHwzfHxzdGVhbSUyMGdhbWluZ3xlbnwwfHx8YmxhY2t8MTc1NDI0NzU3MHww&ixlib=rb-4.1.0&q=85');"></div>
        <div class="bg-gradient" style="background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), transparent, rgba(139, 92, 246, 0.1));"></div>
    </div>
    
    <!-- Main Content -->
    <div class="main-content">
        <div class="container">
            <!-- Header -->
            <header class="header admin-header">
                <div class="logo-container">
                    <div class="logo-icon">
                        <i class="fas fa-shield-alt"></i>
                    </div>
                    
                    <div class="logo-text">
                        <h1>Admin Panel</h1>
                        <h2>Güvenli Giriş</h2>
                        <div class="logo-line" style="background: linear-gradient(90deg, #ef4444, #dc2626);"></div>
                    </div>
                </div>
                
                <p class="subtitle">
                    Yetkili personel girişi gerekli
                </p>
            </header>

            <!-- Login Form -->
            <div class="form-container">
                <div class="glass-card">
                    <form id="admin-form">
                        <div class="form-group">
                            <label class="form-label">
                                <i class="fas fa-lock"></i>
                                Admin Şifresi
                            </label>
                            
                            <div class="input-container">
                                <input
                                    type="password"
                                    id="admin-password"
                                    class="form-input"
                                    placeholder="Şifrenizi girin..."
                                    required
                                    style="border-color: rgba(239, 68, 68, 0.2);"
                                >
                                <div class="input-icon" style="background: rgba(239, 68, 68, 0.2);">
                                    <i class="fas fa-user-shield" style="color: #ef4444;"></i>
                                </div>
                            </div>
                        </div>
                        
                        <button
                            type="submit"
                            id="admin-submit"
                            class="btn btn-danger btn-shine"
                            style="width: 100%;"
                        >
                            🚀 Giriş Yap
                        </button>
                    </form>

                    <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid rgba(255, 255, 255, 0.1); text-align: center;">
                        <p style="color: var(--text-muted); font-size: 14px; display: flex; align-items: center; justify-content: center;">
                            <div style="width: 8px; height: 8px; background: var(--success-color); border-radius: 50%; margin-right: 12px; animation: pulse 2s ease-in-out infinite;"></div>
                            256-bit SSL Şifreli Güvenli Bağlantı
                        </p>
                    </div>
                </div>
            </div>

            <!-- Navigation -->
            <div style="text-align: center; margin-top: 40px;">
                <a href="index.php" class="btn btn-secondary" style="display: inline-flex; align-items: center; gap: 12px; text-decoration: none;">
                    <i class="fas fa-arrow-left"></i>
                    Ana Sayfaya Dön
                </a>
            </div>
        </div>
    </div>

    <!-- Scripts -->
    <script src="assets/script.js"></script>
</body>
</html>