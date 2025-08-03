<?php
// Steam Delivery System - Main Page
// PHP 7.4 Compatible

require_once 'config.php';
?>
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo SITE_TITLE; ?> - Premium Steam Hesapları</title>
    
    <!-- Meta Tags -->
    <meta name="description" content="Premium Steam hesaplarına anında erişim sağlayın. Güvenli, hızlı ve kolay kullanım.">
    <meta name="keywords" content="steam, hesap, gaming, oyun, premium">
    <meta name="author" content="Steam Hesap Merkezi">
    
    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMiA3djEwYzAgNS41NSAzLjg0IDkuNzQgOSAxMSA1LjE2LTEuMjYgOS01LjQ1IDktMTFWN2wtMTAtNXoiIGZpbGw9IiMxZTkwZmYiLz4KPC9zdmc+">
    
    <!-- Styles -->
    <link rel="stylesheet" href="assets/style.css">
    
    <!-- Open Graph -->
    <meta property="og:title" content="<?php echo SITE_TITLE; ?>">
    <meta property="og:description" content="Premium Steam hesaplarına anında erişim">
    <meta property="og:type" content="website">
    <meta property="og:url" content="<?php echo SITE_URL; ?>">
    
    <!-- Preload -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
</head>
<body>
    <!-- Particle System -->
    <canvas id="particles-canvas"></canvas>
    
    <!-- Background Effects -->
    <div class="bg-animated">
        <div class="bg-image" style="background-image: url('https://images.unsplash.com/photo-1511512578047-dfb367046420?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwxfHxnYW1pbmd8ZW58MHx8fGJsYWNrfDE3NTQyNDc1NzZ8MA&ixlib=rb-4.1.0&q=85');"></div>
        <div class="bg-gradient"></div>
    </div>
    
    <!-- Main Content -->
    <div class="main-content">
        <div class="container">
            <!-- Header -->
            <header class="header">
                <div class="logo-container">
                    <div class="logo-icon">
                        <i class="fas fa-shield-alt"></i>
                        <div class="status-indicator">
                            <div class="status-dot"></div>
                        </div>
                    </div>
                    
                    <div class="logo-text">
                        <h1>Steam</h1>
                        <h2>Hesap Merkezi</h2>
                        <div class="logo-line"></div>
                    </div>
                </div>
                
                <p class="subtitle">
                    Premium Steam hesaplarına anında erişim sağlayın
                </p>
                
                <!-- Status Indicators -->
                <div class="status-badges">
                    <div class="status-badge">
                        <div class="badge-dot green"></div>
                        <span>Anlık Teslimat</span>
                    </div>
                    <div class="status-badge">
                        <div class="badge-dot blue"></div>
                        <span>256-bit Güvenlik</span>
                    </div>
                    <div class="status-badge">
                        <div class="badge-dot purple"></div>
                        <span>7/24 Aktif</span>
                    </div>
                </div>
            </header>

            <!-- Key Input Form -->
            <div id="form-container" class="form-container">
                <div class="glass-card">
                    <form id="redeem-form">
                        <div class="form-group">
                            <label class="form-label">
                                <i class="fas fa-key"></i>
                                Delivery Key
                            </label>
                            
                            <div class="input-container">
                                <input
                                    type="text"
                                    id="key-input"
                                    class="form-input"
                                    placeholder="STEAM-KEY-2025-XXXX"
                                    maxlength="25"
                                    required
                                >
                                <div class="input-icon">
                                    <i class="fas fa-dice-d20"></i>
                                </div>
                            </div>
                        </div>
                        
                        <button
                            type="submit"
                            id="submit-btn"
                            class="btn btn-primary btn-shine"
                            style="width: 100%;"
                        >
                            <i class="fas fa-bolt"></i>
                            <span>HESABI AL</span>
                            <i class="fas fa-bolt"></i>
                        </button>
                    </form>
                </div>
            </div>

            <!-- Result Display -->
            <div id="result-container" class="result-container" style="display: none;">
                <div class="glass-card">
                    <div class="result-header">
                        <div class="result-icon">
                            <i class="fas fa-check"></i>
                        </div>
                        <h3 class="result-title">🎉 Başarılı!</h3>
                        <p class="result-message">Steam hesabınız başarıyla teslim edildi!</p>
                    </div>

                    <div id="account-display" class="account-display" style="display: none;">
                        <h4 class="account-title">
                            <i class="fas fa-gamepad"></i>
                            Steam Hesap Bilgileri
                        </h4>
                        
                        <div class="account-fields">
                            <!-- Username Field -->
                            <div class="account-field">
                                <div class="field-label">
                                    <i class="fas fa-user"></i>
                                    Kullanıcı Adı
                                </div>
                                <div class="field-container">
                                    <div class="field-value" id="account-username">steamuser123</div>
                                    <button class="copy-btn" id="username-copy" data-copy="" type="button">
                                        <i class="fas fa-copy"></i>
                                    </button>
                                </div>
                            </div>
                            
                            <!-- Password Field -->
                            <div class="account-field">
                                <div class="field-label">
                                    <i class="fas fa-lock"></i>
                                    Şifre
                                </div>
                                <div class="field-container">
                                    <div class="field-value" id="account-password">password123</div>
                                    <button class="copy-btn" id="password-copy" data-copy="" type="button">
                                        <i class="fas fa-copy"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Instructions -->
                        <div class="instructions">
                            <div class="instructions-content">
                                <div class="instructions-icon">
                                    <i class="fas fa-info-circle"></i>
                                </div>
                                <div class="instructions-text">
                                    <h4><i class="fas fa-rocket"></i> Giriş Talimatları</h4>
                                    <p>
                                        Steam'e giriş yapmak için yukarıdaki bilgileri kullanın. Hesap bilgilerinizi güvenli bir yerde saklayın.
                                        <br>
                                        <span class="warning-text">⚠️ Not: Kullanılan key otomatik olarak silindi.</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="action-buttons">
                        <button
                            type="button"
                            class="btn btn-secondary"
                            onclick="steamDelivery.resetToForm()"
                        >
                            <i class="fas fa-redo"></i>
                            Yeni Key Dene
                        </button>
                        <a
                            href="https://store.steampowered.com/login/"
                            target="_blank"
                            class="btn btn-success"
                        >
                            <i class="fas fa-rocket"></i>
                            Steam'e Git
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Scripts -->
    <script src="assets/script.js"></script>
</body>
</html>