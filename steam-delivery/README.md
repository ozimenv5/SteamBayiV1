# Steam Hesap Teslim Sistemi - PHP/MySQL Version

Modern ve güvenli Steam hesap teslim sistemi. PHP 7.4+ ve MySQL uyumlu.

## 🚀 Özellikler

- **Ana Sayfa**: Modern particle efektli tasarım ile key redemption
- **Admin Panel**: Hesap ve key yönetimi
- **Güvenlik**: Session tabanlı admin authentication
- **Responsive**: Mobile-first tasarım
- **Modern UI**: Glassmorphism efektler ve animasyonlar

## 📋 Gereksinimler

- PHP 7.4 veya üzeri
- MySQL 5.7 veya üzeri
- Apache/Nginx web server
- PDO extension
- mod_rewrite (Apache için)

## 🛠️ Kurulum

### 1. Dosyaları Yükleme
```bash
# Tüm dosyaları cPanel File Manager veya FTP ile public_html klasörüne yükleyin
```

### 2. Veritabanı Kurulumu
1. cPanel'de MySQL Database oluşturun
2. `database.sql` dosyasını phpMyAdmin'de çalıştırın
3. Veritabanı kullanıcısını oluşturun ve yetkileri verin

### 3. Yapılandırma
`config.php` dosyasını düzenleyin:

```php
// Veritabanı ayarları - Bu bilgileri cPanel'den alın
define('DB_HOST', 'localhost');
define('DB_NAME', 'your_database_name');     // Veritabanı adınız
define('DB_USER', 'your_database_user');     // Kullanıcı adınız  
define('DB_PASS', 'your_database_password'); // Şifreniz

// Admin şifresi (değiştirin!)
define('ADMIN_PASSWORD', 'xenforce123');

// Site URL'i
define('SITE_URL', 'https://yourdomain.com/steam-delivery/');
```

### 4. Dosya İzinleri
```bash
# Linux/Unix sistemlerde:
chmod 755 .
chmod 644 *.php
chmod 644 assets/*
chmod 600 config.php
```

## 🎯 Kullanım

### Ana Sayfa
- `https://yourdomain.com/` - Key redemption sayfası
- Kullanıcılar delivery key girerek Steam hesabı alabilir

### Admin Panel
- `https://yourdomain.com/xenforce` - Admin girişi
- Varsayılan şifre: `xenforce123` (değiştirin!)
- Steam hesapları ve delivery key'leri yönetebilirsiniz

## 🗂️ Dosya Yapısı

```
steam-delivery/
├── index.php              # Ana sayfa
├── admin-login.php         # Admin giriş sayfası
├── admin.php              # Admin panel
├── config.php             # Yapılandırma dosyası
├── database.sql           # Veritabanı şeması
├── .htaccess             # Apache yapılandırması
├── README.md             # Bu dosya
├── api/                  # API endpoints
│   ├── admin.php         # Admin API'ları
│   └── redeem.php        # Key redemption API
└── assets/               # CSS, JS ve diğer dosyalar
    ├── style.css         # Ana stylesheet
    ├── admin.css         # Admin panel CSS
    ├── script.js         # Ana JavaScript
    └── admin.js          # Admin panel JavaScript
```

## 🔧 API Endpoints

### Public Endpoints
- `POST /api/redeem-key` - Key redemption

### Admin Endpoints (Authentication Required)
- `POST /api/admin/verify` - Admin login
- `GET /api/admin/accounts` - List accounts
- `POST /api/admin/accounts` - Add account
- `DELETE /api/admin/accounts/{id}` - Delete account
- `GET /api/admin/keys` - List keys
- `POST /api/admin/keys` - Add key
- `DELETE /api/admin/keys/{id}` - Delete key

## 🛡️ Güvenlik

- SQL injection koruması (PDO prepared statements)
- XSS koruması (input sanitization)
- CSRF koruması
- Session timeout
- Rate limiting önerisi
- Secure headers (.htaccess)

## 🎨 Özelleştirme

### Renk Temaları
`assets/style.css` dosyasında CSS değişkenlerini düzenleyin:

```css
:root {
  --primary-color: #1e90ff;    # Ana renk
  --success-color: #10b981;    # Başarı rengi
  --error-color: #ef4444;      # Hata rengi
  --bg-primary: #0f172a;       # Arka plan
}
```

### Admin Şifresi
`config.php` dosyasında `ADMIN_PASSWORD` değerini değiştirin.

## 🚨 Önemli Notlar

1. **config.php** dosyasındaki veritabanı bilgilerini mutlaka güncelleyin
2. **Admin şifresini** varsayılan değerden değiştirin
3. **HTTPS** kullanın (SSL sertifikası)
4. **Backup** alın düzenli olarak
5. **PHP error reporting** production'da kapatın

## 📱 Browser Desteği

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🐛 Sorun Giderme

### Veritabanı Bağlantı Hatası
- `config.php` dosyasındaki DB bilgilerini kontrol edin
- MySQL kullanıcısının yetkileri olduğundan emin olun

### 404 Hataları
- `.htaccess` dosyasının yüklendiğinden emin olun
- Apache mod_rewrite'ın aktif olduğunu kontrol edin

### Permission Denied
- Dosya izinlerini kontrol edin (755/644)
- Web server'ın dosyalara erişebildiğinden emin olun

## 📞 Destek

Herhangi bir sorun yaşarsanız:

1. `error_log` dosyasını kontrol edin
2. Browser developer tools'u kullanın
3. PHP error log'larını inceleyin

## 📄 Lisans

Bu proje MIT lisansı altında dağıtılmaktadır.

---

**🎮 Steam Hesap Merkezi - Modern & Güvenli Teslimat Sistemi**