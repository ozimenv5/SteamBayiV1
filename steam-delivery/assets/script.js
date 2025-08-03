// Steam Delivery System - Modern JavaScript
// PHP 7.4 Compatible

class SteamDelivery {
    constructor() {
        this.apiBase = './api/';
        this.initParticles();
        this.initEventListeners();
        this.initToast();
    }

    // Particle System
    initParticles() {
        const canvas = document.getElementById('particles-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const particles = [];
        
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.radius = Math.random() * 2 + 1;
                this.opacity = Math.random() * 0.5 + 0.2;
                this.color = `rgba(30, 144, 255, ${this.opacity})`;
            }
            
            update() {
                this.x += this.vx;
                this.y += this.vy;
                
                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            }
            
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
                
                // Glow effect
                ctx.shadowBlur = 10;
                ctx.shadowColor = this.color;
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }
        
        const initParticles = () => {
            for (let i = 0; i < 100; i++) {
                particles.push(new Particle());
            }
        };
        
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            
            // Connect particles
            particles.forEach((particle, index) => {
                particles.slice(index + 1).forEach(otherParticle => {
                    const dx = particle.x - otherParticle.x;
                    const dy = particle.y - otherParticle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(otherParticle.x, otherParticle.y);
                        ctx.strokeStyle = `rgba(30, 144, 255, ${0.1 * (100 - distance) / 100})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                });
            });
            
            requestAnimationFrame(animate);
        };
        
        resizeCanvas();
        initParticles();
        animate();
        
        window.addEventListener('resize', resizeCanvas);
    }

    // Event Listeners
    initEventListeners() {
        // Key redemption form
        const redeemForm = document.getElementById('redeem-form');
        if (redeemForm) {
            redeemForm.addEventListener('submit', (e) => this.handleKeySubmit(e));
        }

        // Admin login form
        const adminForm = document.getElementById('admin-form');
        if (adminForm) {
            adminForm.addEventListener('submit', (e) => this.handleAdminLogin(e));
        }

        // Copy buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('copy-btn') || e.target.closest('.copy-btn')) {
                const btn = e.target.classList.contains('copy-btn') ? e.target : e.target.closest('.copy-btn');
                const text = btn.dataset.copy;
                this.copyToClipboard(text);
            }
        });

        // Auto uppercase for key input
        const keyInput = document.getElementById('key-input');
        if (keyInput) {
            keyInput.addEventListener('input', (e) => {
                e.target.value = e.target.value.toUpperCase();
            });
        }
    }

    // Toast System
    initToast() {
        this.toastContainer = document.createElement('div');
        this.toastContainer.className = 'toast-container';
        this.toastContainer.style.cssText = `
            position: fixed;
            top: 24px;
            right: 24px;
            z-index: 1000;
            pointer-events: none;
        `;
        document.body.appendChild(this.toastContainer);
    }

    showToast(message, type = 'info', duration = 5000) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: 'fas fa-check',
            error: 'fas fa-times',
            info: 'fas fa-info',
            warning: 'fas fa-exclamation-triangle'
        };

        toast.innerHTML = `
            <div class="toast-progress" style="width: 100%; color: var(--${type === 'success' ? 'success' : type === 'error' ? 'error' : 'primary'}-color);"></div>
            <div class="toast-content">
                <div class="toast-icon">
                    <i class="${icons[type] || icons.info}"></i>
                </div>
                <div class="toast-message">${message}</div>
                <button class="toast-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        this.toastContainer.appendChild(toast);
        toast.style.pointerEvents = 'auto';

        // Progress animation
        const progress = toast.querySelector('.toast-progress');
        let width = 100;
        const interval = setInterval(() => {
            width -= (100 / duration) * 100;
            if (width <= 0) {
                clearInterval(interval);
                this.removeToast(toast);
            }
            progress.style.width = Math.max(0, width) + '%';
        }, 100);

        // Close button
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            clearInterval(interval);
            this.removeToast(toast);
        });

        return toast;
    }

    removeToast(toast) {
        toast.style.animation = 'slideOutRight 0.3s ease-in forwards';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }

    // Key Redemption
    async handleKeySubmit(e) {
        e.preventDefault();
        
        const keyInput = document.getElementById('key-input');
        const submitBtn = document.getElementById('submit-btn');
        const key = keyInput.value.trim();

        if (!key) {
            this.showToast('Lütfen bir key girin!', 'warning');
            return;
        }

        // Show loading
        this.setLoading(submitBtn, true, 'Hesap hazırlanıyor...');
        
        try {
            const response = await fetch(this.apiBase + 'redeem.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ key: key })
            });

            const data = await response.json();
            
            if (data.success) {
                this.showToast('🎉 Steam hesabınız başarıyla teslim edildi!', 'success');
                this.showResult(data);
            } else {
                this.showToast(data.message, 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            this.showToast('⚠️ Bir hata oluştu. Lütfen tekrar deneyin.', 'error');
        } finally {
            this.setLoading(submitBtn, false);
        }
    }

    // Admin Login
    async handleAdminLogin(e) {
        e.preventDefault();
        
        const passwordInput = document.getElementById('admin-password');
        const submitBtn = document.getElementById('admin-submit');
        const password = passwordInput.value.trim();

        if (!password) {
            this.showToast('Lütfen şifrenizi girin!', 'warning');
            return;
        }

        this.setLoading(submitBtn, true, 'Giriş yapılıyor...');
        
        try {
            const response = await fetch(this.apiBase + 'admin.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password: password })
            });

            const data = await response.json();
            
            if (data.success) {
                this.showToast('🎉 Admin paneline başarıyla giriş yapıldı!', 'success');
                setTimeout(() => {
                    window.location.href = 'admin.php';
                }, 1500);
            } else {
                this.showToast('❌ Geçersiz şifre! Lütfen tekrar deneyin.', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            this.showToast('⚠️ Giriş sırasında hata oluştu.', 'error');
        } finally {
            this.setLoading(submitBtn, false);
        }
    }

    // Show Result
    showResult(data) {
        const formContainer = document.getElementById('form-container');
        const resultContainer = document.getElementById('result-container');
        
        if (formContainer) formContainer.style.display = 'none';
        if (resultContainer) {
            resultContainer.style.display = 'block';
            
            // Update result content
            const resultIcon = resultContainer.querySelector('.result-icon');
            const resultTitle = resultContainer.querySelector('.result-title');
            const resultMessage = resultContainer.querySelector('.result-message');
            const accountDisplay = resultContainer.querySelector('.account-display');
            
            if (data.success) {
                resultIcon.className = 'result-icon success';
                resultIcon.innerHTML = '<i class="fas fa-check"></i>';
                resultTitle.className = 'result-title success';
                resultTitle.textContent = '🎉 Başarılı!';
                resultMessage.textContent = data.message;
                
                if (data.account && accountDisplay) {
                    accountDisplay.style.display = 'block';
                    
                    const usernameField = document.getElementById('account-username');
                    const passwordField = document.getElementById('account-password');
                    const usernameCopy = document.getElementById('username-copy');
                    const passwordCopy = document.getElementById('password-copy');
                    
                    if (usernameField) usernameField.textContent = data.account.username;
                    if (passwordField) passwordField.textContent = data.account.password;
                    if (usernameCopy) usernameCopy.dataset.copy = data.account.username;
                    if (passwordCopy) passwordCopy.dataset.copy = data.account.password;
                }
            } else {
                resultIcon.className = 'result-icon error';
                resultIcon.innerHTML = '<i class="fas fa-times"></i>';
                resultTitle.className = 'result-title error';
                resultTitle.textContent = '❌ Hata Oluştu';
                resultMessage.textContent = data.message;
                
                if (accountDisplay) accountDisplay.style.display = 'none';
            }
        }
    }

    // Reset to form
    resetToForm() {
        const formContainer = document.getElementById('form-container');
        const resultContainer = document.getElementById('result-container');
        const keyInput = document.getElementById('key-input');
        
        if (formContainer) formContainer.style.display = 'block';
        if (resultContainer) resultContainer.style.display = 'none';
        if (keyInput) keyInput.value = '';
    }

    // Copy to clipboard
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showToast('📋 Panoya kopyalandı!', 'success', 2000);
        } catch (err) {
            console.error('Copy failed:', err);
            this.showToast('Kopyalama başarısız!', 'error');
        }
    }

    // Loading state
    setLoading(button, loading, text = '') {
        if (loading) {
            button.disabled = true;
            button.innerHTML = `
                <div class="loading-container">
                    <div class="loading-spinner">
                        <div class="spinner-ring"></div>
                        <div class="spinner-ring"></div>
                        <div class="spinner-ring"></div>
                    </div>
                    <span class="loading-text">${text}</span>
                </div>
            `;
        } else {
            button.disabled = false;
            // Restore original content based on button ID
            if (button.id === 'submit-btn') {
                button.innerHTML = `
                    <i class="fas fa-bolt"></i>
                    <span>HESABI AL</span>
                    <i class="fas fa-bolt"></i>
                `;
            } else if (button.id === 'admin-submit') {
                button.innerHTML = `🚀 Giriş Yap`;
            }
        }
    }

    // Utility: Generate random key
    generateRandomKey() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const segments = [];
        for (let i = 0; i < 4; i++) {
            let segment = '';
            for (let j = 0; j < 4; j++) {
                segment += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            segments.push(segment);
        }
        return `STEAM-${segments.join('-')}`;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.steamDelivery = new SteamDelivery();
});

// Additional CSS animations
const additionalStyles = `
@keyframes slideOutRight {
    to {
        opacity: 0;
        transform: translateX(100%);
    }
}

.toast-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

@media (max-width: 480px) {
    .toast-container {
        left: 16px;
        right: 16px;
        top: 16px;
    }
    
    .toast {
        max-width: none;
    }
}
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);