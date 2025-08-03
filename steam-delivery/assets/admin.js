// Steam Delivery System - Admin Panel JavaScript
// PHP 7.4 Compatible

class AdminPanel {
    constructor() {
        this.apiBase = './api/';
        this.currentTab = 'dashboard';
        this.accounts = [];
        this.keys = [];
        this.filteredAccounts = [];
        this.filteredKeys = [];
        this.searchTerm = '';
        
        this.init();
    }

    init() {
        this.initEventListeners();
        this.loadData();
        this.switchTab('dashboard');
    }

    initEventListeners() {
        // Tab switching
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.currentTarget.dataset.tab;
                this.switchTab(tabName);
            });
        });

        // Search functionality
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchTerm = e.target.value.toLowerCase();
                this.filterData();
                this.renderCurrentTab();
            });
        }

        // Form submissions
        const addAccountForm = document.getElementById('add-account-form');
        if (addAccountForm) {
            addAccountForm.addEventListener('submit', (e) => this.handleAddAccount(e));
        }

        const addKeyForm = document.getElementById('add-key-form');
        if (addKeyForm) {
            addKeyForm.addEventListener('submit', (e) => this.handleAddKey(e));
        }

        // Auto uppercase for key input
        const keyInput = document.getElementById('key-value');
        if (keyInput) {
            keyInput.addEventListener('input', (e) => {
                e.target.value = e.target.value.toUpperCase();
            });
        }
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');

        // Update search visibility
        const searchContainer = document.getElementById('search-container');
        if (tabName === 'accounts' || tabName === 'keys') {
            searchContainer.style.display = 'block';
            document.getElementById('search-input').placeholder = 
                tabName === 'accounts' ? 'Hesap ara...' : 'Key ara...';
        } else {
            searchContainer.style.display = 'none';
        }

        this.currentTab = tabName;
        this.renderCurrentTab();
    }

    async loadData() {
        try {
            const [accountsResponse, keysResponse] = await Promise.all([
                fetch(this.apiBase + 'admin.php/accounts', {
                    headers: { 'Authorization': 'Bearer dummy-token' }
                }),
                fetch(this.apiBase + 'admin.php/keys', {
                    headers: { 'Authorization': 'Bearer dummy-token' }
                })
            ]);

            this.accounts = await accountsResponse.json();
            this.keys = await keysResponse.json();
            
            this.filterData();
            this.updateCounts();
            this.renderCurrentTab();
        } catch (error) {
            console.error('Error loading data:', error);
            window.steamDelivery.showToast('⚠️ Veri yüklenirken hata oluştu!', 'error');
        }
    }

    filterData() {
        this.filteredAccounts = this.accounts.filter(account =>
            account.username.toLowerCase().includes(this.searchTerm)
        );

        this.filteredKeys = this.keys.filter(key =>
            key.key_value.toLowerCase().includes(this.searchTerm)
        );
    }

    updateCounts() {
        const accountsCount = document.getElementById('accounts-count');
        const keysCount = document.getElementById('keys-count');
        
        if (accountsCount) accountsCount.textContent = this.filteredAccounts.length;
        if (keysCount) keysCount.textContent = this.filteredKeys.length;
    }

    renderCurrentTab() {
        switch(this.currentTab) {
            case 'accounts':
                this.renderAccountsTable();
                break;
            case 'keys':
                this.renderKeysTable();
                break;
        }
        this.updateCounts();
    }

    renderAccountsTable() {
        const tbody = document.getElementById('accounts-tbody');
        const emptyState = document.getElementById('accounts-empty');
        
        if (this.filteredAccounts.length === 0) {
            tbody.innerHTML = '';
            emptyState.style.display = 'block';
            emptyState.innerHTML = `
                <i class="fas fa-inbox"></i>
                <h4>${this.searchTerm ? 'Arama sonucu bulunamadı' : 'Henüz Steam hesabı eklenmemiş'}</h4>
                <p>${this.searchTerm ? `"${this.searchTerm}" için sonuç bulunamadı` : 'Yukarıdaki formu kullanarak hesap ekleyebilirsiniz'}</p>
            `;
            return;
        }

        emptyState.style.display = 'none';
        tbody.innerHTML = this.filteredAccounts.map(account => `
            <tr>
                <td>
                    <div class="account-value">${this.escapeHtml(account.username)}</div>
                </td>
                <td>
                    <div class="account-value">${this.escapeHtml(account.password)}</div>
                </td>
                <td>
                    <div class="date-text">${this.formatDate(account.created_at)}</div>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-sm btn-danger" onclick="adminPanel.deleteAccount('${account.id}', '${this.escapeHtml(account.username)}')">
                            <i class="fas fa-trash"></i>
                            Sil
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    renderKeysTable() {
        const tbody = document.getElementById('keys-tbody');
        const emptyState = document.getElementById('keys-empty');
        
        if (this.filteredKeys.length === 0) {
            tbody.innerHTML = '';
            emptyState.style.display = 'block';
            emptyState.innerHTML = `
                <i class="fas fa-key"></i>
                <h4>${this.searchTerm ? 'Arama sonucu bulunamadı' : 'Henüz delivery key oluşturulmamış'}</h4>
                <p>${this.searchTerm ? `"${this.searchTerm}" için sonuç bulunamadı` : 'Yukarıdaki formu kullanarak key ekleyebilirsiniz'}</p>
            `;
            return;
        }

        emptyState.style.display = 'none';
        tbody.innerHTML = this.filteredKeys.map(key => `
            <tr>
                <td>
                    <div class="key-value">${this.escapeHtml(key.key_value)}</div>
                </td>
                <td>
                    <div class="date-text">${this.formatDate(key.created_at)}</div>
                </td>
                <td>
                    <div class="status-badge">
                        <div class="status-dot"></div>
                        Aktif
                    </div>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-sm btn-danger" onclick="adminPanel.deleteKey('${key.id}', '${this.escapeHtml(key.key_value)}')">
                            <i class="fas fa-trash"></i>
                            Sil
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    async handleAddAccount(e) {
        e.preventDefault();
        
        const usernameInput = document.getElementById('account-username');
        const passwordInput = document.getElementById('account-password');
        const submitBtn = e.target.querySelector('button[type="submit"]');
        
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        
        if (!username || !password) {
            window.steamDelivery.showToast('Tüm alanları doldurun!', 'warning');
            return;
        }

        this.setButtonLoading(submitBtn, true);
        
        try {
            const response = await fetch(this.apiBase + 'admin.php/accounts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer dummy-token'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();
            
            if (response.ok) {
                window.steamDelivery.showToast('✅ Steam hesabı başarıyla eklendi!', 'success');
                usernameInput.value = '';
                passwordInput.value = '';
                this.loadData();
            } else {
                throw new Error(data.message || 'Hesap eklenirken hata oluştu');
            }
        } catch (error) {
            console.error('Error adding account:', error);
            window.steamDelivery.showToast('❌ Hesap eklenirken hata oluştu!', 'error');
        } finally {
            this.setButtonLoading(submitBtn, false);
        }
    }

    async handleAddKey(e) {
        e.preventDefault();
        
        const keyInput = document.getElementById('key-value');
        const submitBtn = e.target.querySelector('button[type="submit"]');
        
        const keyValue = keyInput.value.trim();
        
        if (!keyValue) {
            window.steamDelivery.showToast('Key değeri gerekli!', 'warning');
            return;
        }

        this.setButtonLoading(submitBtn, true);
        
        try {
            const response = await fetch(this.apiBase + 'admin.php/keys', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer dummy-token'
                },
                body: JSON.stringify({ key_value: keyValue })
            });

            const data = await response.json();
            
            if (response.ok) {
                window.steamDelivery.showToast('✅ Delivery key başarıyla eklendi!', 'success');
                keyInput.value = '';
                this.loadData();
            } else {
                if (data.message && data.message.includes('already exists')) {
                    window.steamDelivery.showToast('⚠️ Bu key zaten mevcut!', 'warning');
                } else {
                    throw new Error(data.message || 'Key eklenirken hata oluştu');
                }
            }
        } catch (error) {
            console.error('Error adding key:', error);
            window.steamDelivery.showToast('❌ Key eklenirken hata oluştu!', 'error');
        } finally {
            this.setButtonLoading(submitBtn, false);
        }
    }

    async deleteAccount(accountId, username) {
        if (!confirm(`"${username}" hesabını silmek istediğinizden emin misiniz?`)) {
            return;
        }
        
        try {
            const response = await fetch(this.apiBase + `admin.php/accounts/${accountId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer dummy-token'
                }
            });

            const data = await response.json();
            
            if (response.ok) {
                window.steamDelivery.showToast('🗑️ Hesap başarıyla silindi!', 'success');
                this.loadData();
            } else {
                throw new Error(data.message || 'Hesap silinirken hata oluştu');
            }
        } catch (error) {
            console.error('Error deleting account:', error);
            window.steamDelivery.showToast('❌ Hesap silinirken hata oluştu!', 'error');
        }
    }

    async deleteKey(keyId, keyValue) {
        if (!confirm(`"${keyValue}" key'ini silmek istediğinizden emin misiniz?`)) {
            return;
        }
        
        try {
            const response = await fetch(this.apiBase + `admin.php/keys/${keyId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer dummy-token'
                }
            });

            const data = await response.json();
            
            if (response.ok) {
                window.steamDelivery.showToast('🗑️ Key başarıyla silindi!', 'success');
                this.loadData();
            } else {
                throw new Error(data.message || 'Key silinirken hata oluştu');
            }
        } catch (error) {
            console.error('Error deleting key:', error);
            window.steamDelivery.showToast('❌ Key silinirken hata oluştu!', 'error');
        }
    }

    setButtonLoading(button, loading) {
        if (loading) {
            button.disabled = true;
            button.innerHTML = `
                <div class="loading-spinner-table"></div>
                İşleniyor...
            `;
        } else {
            button.disabled = false;
            // Restore original text based on button context
            if (button.closest('#add-account-form')) {
                button.innerHTML = '<i class="fas fa-plus"></i> Hesap Ekle';
            } else if (button.closest('#add-key-form')) {
                button.innerHTML = '<i class="fas fa-plus"></i> Key Ekle';
            }
        }
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Generate random key function
function generateRandomKey() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const segments = [];
    for (let i = 0; i < 4; i++) {
        let segment = '';
        for (let j = 0; j < 4; j++) {
            segment += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        segments.push(segment);
    }
    document.getElementById('key-value').value = `STEAM-${segments.join('-')}`;
}

// Global function to switch tabs (called from quick actions)
function switchTab(tabName) {
    if (window.adminPanel) {
        window.adminPanel.switchTab(tabName);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.adminPanel = new AdminPanel();
});