import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Home Page Component
const Home = () => {
  const [key, setKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleKeySubmit = async (e) => {
    e.preventDefault();
    if (!key.trim()) return;

    setLoading(true);
    try {
      const response = await axios.post(`${API}/redeem-key`, { key });
      setResult(response.data);
    } catch (error) {
      setResult({
        success: false,
        message: "Bir hata oluştu. Lütfen tekrar deneyin."
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-steam-dark relative overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1511512578047-dfb367046420?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwxfHxnYW1pbmd8ZW58MHx8fGJsYWNrfDE3NTQyNDc1NzZ8MA&ixlib=rb-4.1.0&q=85')`
        }}
      />
      
      {/* Steam-like gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-steam-blue/30 via-steam-dark/90 to-steam-darker"></div>
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Steam Logo Area */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-steam-blue rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5h3V8h4v4h3l-5 5z"/>
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-steam-light">Steam Hesap Teslim</h1>
            </div>
            <p className="text-steam-gray text-sm">
              Key'inizi girin ve Steam hesabınızı alın
            </p>
          </div>

          {!result ? (
            /* Key Input Form */
            <div className="bg-steam-darker/80 backdrop-blur-sm border border-steam-blue/30 rounded-xl p-6 shadow-2xl">
              <form onSubmit={handleKeySubmit} className="space-y-4">
                <div>
                  <label className="block text-steam-light text-sm font-medium mb-2">
                    Delivery Key
                  </label>
                  <input
                    type="text"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    placeholder="Key'inizi buraya girin..."
                    className="w-full px-4 py-3 bg-steam-dark border border-steam-blue/50 rounded-lg text-steam-light placeholder-steam-gray focus:outline-none focus:border-steam-blue focus:ring-1 focus:ring-steam-blue transition-colors"
                    disabled={loading}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !key.trim()}
                  className="w-full bg-gradient-to-r from-steam-blue to-blue-600 hover:from-blue-600 hover:to-steam-blue text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-steam-blue/25"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      İşleniyor...
                    </div>
                  ) : (
                    "Hesabı Al"
                  )}
                </button>
              </form>
            </div>
          ) : (
            /* Result Display */
            <div className={`bg-steam-darker/80 backdrop-blur-sm border rounded-xl p-6 shadow-2xl ${
              result.success ? 'border-green-500/50' : 'border-red-500/50'
            }`}>
              <div className="text-center mb-4">
                <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
                  result.success ? 'bg-green-500/20' : 'bg-red-500/20'
                }`}>
                  {result.success ? (
                    <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  ) : (
                    <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  )}
                </div>
                <p className={`text-lg font-medium ${result.success ? 'text-green-400' : 'text-red-400'}`}>
                  {result.message}
                </p>
              </div>

              {result.success && result.account && (
                <div className="bg-steam-dark rounded-lg p-4 border border-steam-blue/30 space-y-3">
                  <div>
                    <label className="block text-steam-gray text-xs uppercase tracking-wider mb-1">
                      Kullanıcı Adı
                    </label>
                    <div className="flex items-center bg-steam-darker rounded px-3 py-2">
                      <span className="text-steam-light font-mono text-sm flex-1">
                        {result.account.username}
                      </span>
                      <button
                        onClick={() => navigator.clipboard.writeText(result.account.username)}
                        className="text-steam-blue hover:text-blue-400 ml-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-steam-gray text-xs uppercase tracking-wider mb-1">
                      Şifre
                    </label>
                    <div className="flex items-center bg-steam-darker rounded px-3 py-2">
                      <span className="text-steam-light font-mono text-sm flex-1">
                        {result.account.password}
                      </span>
                      <button
                        onClick={() => navigator.clipboard.writeText(result.account.password)}
                        className="text-steam-blue hover:text-blue-400 ml-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={() => {
                  setResult(null);
                  setKey("");
                }}
                className="w-full mt-4 bg-steam-dark hover:bg-steam-darker text-steam-light font-medium py-2 px-4 rounded-lg transition-colors border border-steam-blue/30"
              >
                Yeni Key Dene
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Admin Panel Component
const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("accounts");
  
  // Steam Accounts State
  const [accounts, setAccounts] = useState([]);
  const [newAccount, setNewAccount] = useState({ username: "", password: "" });
  
  // Keys State
  const [keys, setKeys] = useState([]);
  const [newKey, setNewKey] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${API}/admin/verify`, { password });
      if (response.data.success) {
        setIsAuthenticated(true);
        setToken("dummy-token"); // Simple token for demo
        loadData();
      }
    } catch (error) {
      alert("Geçersiz şifre!");
    }
    setLoading(false);
  };

  const loadData = async () => {
    try {
      const [accountsRes, keysRes] = await Promise.all([
        axios.get(`${API}/admin/accounts`, {
          headers: { Authorization: `Bearer dummy-token` }
        }),
        axios.get(`${API}/admin/keys`, {
          headers: { Authorization: `Bearer dummy-token` }
        })
      ]);
      setAccounts(accountsRes.data);
      setKeys(keysRes.data);
    } catch (error) {
      console.error("Veri yükleme hatası:", error);
    }
  };

  const addAccount = async (e) => {
    e.preventDefault();
    if (!newAccount.username || !newAccount.password) return;
    
    try {
      await axios.post(`${API}/admin/accounts`, newAccount, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewAccount({ username: "", password: "" });
      loadData();
    } catch (error) {
      alert("Hesap ekleme hatası!");
    }
  };

  const deleteAccount = async (accountId) => {
    try {
      await axios.delete(`${API}/admin/accounts/${accountId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      loadData();
    } catch (error) {
      alert("Hesap silme hatası!");
    }
  };

  const addKey = async (e) => {
    e.preventDefault();
    if (!newKey) return;
    
    try {
      await axios.post(`${API}/admin/keys`, { key_value: newKey }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewKey("");
      loadData();
    } catch (error) {
      alert("Key ekleme hatası!");
    }
  };

  const deleteKey = async (keyId) => {
    try {
      await axios.delete(`${API}/admin/keys/${keyId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      loadData();
    } catch (error) {
      alert("Key silme hatası!");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-steam-dark flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-steam-darker border border-steam-blue/30 rounded-xl p-6 shadow-2xl">
            <h2 className="text-2xl font-bold text-steam-light text-center mb-6">
              Admin Girişi
            </h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Admin şifresi..."
                className="w-full px-4 py-3 bg-steam-dark border border-steam-blue/50 rounded-lg text-steam-light placeholder-steam-gray focus:outline-none focus:border-steam-blue"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-steam-blue hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-steam-dark">
      <div className="bg-steam-darker border-b border-steam-blue/30 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-steam-light">Admin Panel</h1>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="text-steam-gray hover:text-steam-light"
          >
            Çıkış
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        {/* Tabs */}
        <div className="flex space-x-1 mb-6">
          <button
            onClick={() => setActiveTab("accounts")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "accounts"
                ? "bg-steam-blue text-white"
                : "bg-steam-darker text-steam-gray hover:text-steam-light"
            }`}
          >
            Steam Hesapları ({accounts.length})
          </button>
          <button
            onClick={() => setActiveTab("keys")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "keys"
                ? "bg-steam-blue text-white"
                : "bg-steam-darker text-steam-gray hover:text-steam-light"
            }`}
          >
            Delivery Keys ({keys.length})
          </button>
        </div>

        {activeTab === "accounts" && (
          <div className="space-y-6">
            {/* Add Account Form */}
            <div className="bg-steam-darker border border-steam-blue/30 rounded-xl p-6">
              <h3 className="text-lg font-bold text-steam-light mb-4">Yeni Steam Hesabı Ekle</h3>
              <form onSubmit={addAccount} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  value={newAccount.username}
                  onChange={(e) => setNewAccount({...newAccount, username: e.target.value})}
                  placeholder="Kullanıcı adı"
                  className="px-4 py-2 bg-steam-dark border border-steam-blue/50 rounded-lg text-steam-light placeholder-steam-gray focus:outline-none focus:border-steam-blue"
                />
                <input
                  type="text"
                  value={newAccount.password}
                  onChange={(e) => setNewAccount({...newAccount, password: e.target.value})}
                  placeholder="Şifre"
                  className="px-4 py-2 bg-steam-dark border border-steam-blue/50 rounded-lg text-steam-light placeholder-steam-gray focus:outline-none focus:border-steam-blue"
                />
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                  Hesap Ekle
                </button>
              </form>
            </div>

            {/* Accounts List */}
            <div className="bg-steam-darker border border-steam-blue/30 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-steam-blue/30">
                <h3 className="text-lg font-bold text-steam-light">Steam Hesapları</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-steam-dark">
                    <tr>
                      <th className="text-left p-4 text-steam-light font-medium">Kullanıcı Adı</th>
                      <th className="text-left p-4 text-steam-light font-medium">Şifre</th>
                      <th className="text-left p-4 text-steam-light font-medium">Ekleme Tarihi</th>
                      <th className="text-left p-4 text-steam-light font-medium">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accounts.map((account) => (
                      <tr key={account.id} className="border-t border-steam-blue/10">
                        <td className="p-4 text-steam-light font-mono">{account.username}</td>
                        <td className="p-4 text-steam-light font-mono">{account.password}</td>
                        <td className="p-4 text-steam-gray text-sm">
                          {new Date(account.created_at).toLocaleDateString('tr-TR')}
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => deleteAccount(account.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                          >
                            Sil
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "keys" && (
          <div className="space-y-6">
            {/* Add Key Form */}
            <div className="bg-steam-darker border border-steam-blue/30 rounded-xl p-6">
              <h3 className="text-lg font-bold text-steam-light mb-4">Yeni Delivery Key Ekle</h3>
              <form onSubmit={addKey} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  placeholder="Key değeri (örn: STEAM2024KEY)"
                  className="px-4 py-2 bg-steam-dark border border-steam-blue/50 rounded-lg text-steam-light placeholder-steam-gray focus:outline-none focus:border-steam-blue"
                />
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                  Key Ekle
                </button>
              </form>
            </div>

            {/* Keys List */}
            <div className="bg-steam-darker border border-steam-blue/30 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-steam-blue/30">
                <h3 className="text-lg font-bold text-steam-light">Delivery Keys</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-steam-dark">
                    <tr>
                      <th className="text-left p-4 text-steam-light font-medium">Key</th>
                      <th className="text-left p-4 text-steam-light font-medium">Oluşturma Tarihi</th>
                      <th className="text-left p-4 text-steam-light font-medium">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {keys.map((key) => (
                      <tr key={key.id} className="border-t border-steam-blue/10">
                        <td className="p-4 text-steam-light font-mono">{key.key_value}</td>
                        <td className="p-4 text-steam-gray text-sm">
                          {new Date(key.created_at).toLocaleDateString('tr-TR')}
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => deleteKey(key.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                          >
                            Sil
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/xenforce" element={<AdminPanel />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;