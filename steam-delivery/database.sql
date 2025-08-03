-- Steam Hesap Teslim Sistemi - MySQL Veritabanı
-- PHP 7.4 Uyumlu

CREATE DATABASE IF NOT EXISTS steam_delivery CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE steam_delivery;

-- Steam hesapları tablosu
CREATE TABLE steam_accounts (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Delivery keys tablosu
CREATE TABLE delivery_keys (
    id VARCHAR(36) PRIMARY KEY,
    key_value VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_key_value (key_value),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Admin oturumları tablosu (güvenlik için)
CREATE TABLE admin_sessions (
    id VARCHAR(36) PRIMARY KEY,
    session_token VARCHAR(64) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    INDEX idx_token (session_token),
    INDEX idx_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Örnek veri ekleme
INSERT INTO steam_accounts (id, username, password) VALUES 
('550e8400-e29b-41d4-a716-446655440001', 'steamuser1', 'password123'),
('550e8400-e29b-41d4-a716-446655440002', 'steamuser2', 'password456'),
('550e8400-e29b-41d4-a716-446655440003', 'steamuser3', 'password789');

INSERT INTO delivery_keys (id, key_value) VALUES 
('650e8400-e29b-41d4-a716-446655440001', 'STEAM-ABCD-EFGH-IJKL'),
('650e8400-e29b-41d4-a716-446655440002', 'STEAM-MNOP-QRST-UVWX'),
('650e8400-e29b-41d4-a716-446655440003', 'STEAM-YZ12-3456-789A');