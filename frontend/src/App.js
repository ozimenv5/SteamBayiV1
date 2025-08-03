import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Modern Loading Component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center">
    <div className="relative">
      <div className="w-8 h-8 border-4 border-steam-blue/30 rounded-full animate-spin"></div>
      <div className="absolute top-0 left-0 w-8 h-8 border-4 border-transparent border-t-steam-blue rounded-full animate-spin"></div>
    </div>
    <span className="ml-3 text-steam-light font-medium">İşleniyor...</span>
  </div>
);

// Modern Stats Card Component
const StatsCard = ({ title, value, icon, color = "blue" }) => (
  <div className="bg-gradient-to-br from-steam-darker/80 to-steam-dark/80 backdrop-blur-sm border border-steam-blue/20 rounded-xl p-6 hover:border-steam-blue/40 transition-all duration-300 hover:scale-105">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-steam-gray text-sm font-medium uppercase tracking-wider">{title}</p>
        <p className={`text-2xl font-bold ${color === 'green' ? 'text-green-400' : color === 'orange' ? 'text-orange-400' : 'text-steam-blue'} mt-1`}>{value}</p>
      </div>
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color === 'green' ? 'bg-green-500/20' : color === 'orange' ? 'bg-orange-500/20' : 'bg-steam-blue/20'}`}>
        {icon}
      </div>
    </div>
  </div>
);

// Animated Success/Error Message
const AnimatedMessage = ({ message, type, onClose }) => (
  <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-2xl max-w-sm animate-slide-in ${
    type === 'success' ? 'bg-green-600/90 border border-green-400/50' : 'bg-red-600/90 border border-red-400/50'
  } backdrop-blur-sm`}>
    <div className="flex items-center">
      <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
        type === 'success' ? 'bg-green-400' : 'bg-red-400'
      }`}>
        {type === 'success' ? (
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        ) : (
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        )}
      </div>
      <span className="text-white font-medium">{message}</span>
      <button onClick={onClose} className="ml-auto text-white/70 hover:text-white">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
  </div>
);

// Modern Home Page Component
const Home = () => {
  const [key, setKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleKeySubmit = async (e) => {
    e.preventDefault();
    if (!key.trim()) return;

    setLoading(true);
    try {
      const response = await axios.post(`${API}/redeem-key`, { key });
      setResult(response.data);
      if (response.data.success) {
        showNotification("Steam hesabınız başarıyla teslim edildi!", "success");
      }
    } catch (error) {
      setResult({
        success: false,
        message: "Bir hata oluştu. Lütfen tekrar deneyin."
      });
      showNotification("Bir hata oluştu. Lütfen tekrar deneyin.", "error");
    }
    setLoading(false);
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      showNotification("Panoya kopyalandı!", "success");
    } catch (err) {
      console.error('Kopyalama hatası:', err);
    }
  };

  return (
    <div className="min-h-screen bg-steam-dark relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Primary background image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1511512578047-dfb367046420?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwxfHxnYW1pbmd8ZW58MHx8fGJsYWNrfDE3NTQyNDc1NzZ8MA&ixlib=rb-4.1.0&q=85')`
          }}
        />
        
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-steam-blue/20 via-steam-dark/95 to-steam-darker animate-gradient-shift"></div>
        
        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-steam-blue/30 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Notification */}
      {notification && (
        <AnimatedMessage 
          message={notification.message} 
          type={notification.type} 
          onClose={() => setNotification(null)} 
        />
      )}
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          {/* Header Section */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center space-x-4 mb-6">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-steam-blue to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-steam-blue/30">
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
                  </svg>
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
              <div className="text-left">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-steam-light to-steam-blue bg-clip-text text-transparent">
                  Steam Hesap
                </h1>
                <h2 className="text-2xl font-bold text-steam-blue">Teslim Merkezi</h2>
              </div>
            </div>
            <p className="text-steam-gray text-lg font-medium">
              Premium Steam hesaplarına anında erişim
            </p>
            <div className="flex items-center justify-center space-x-6 mt-4">
              <div className="flex items-center text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                <span className="text-sm font-medium">Anlık Teslimat</span>
              </div>
              <div className="flex items-center text-steam-blue">
                <div className="w-2 h-2 bg-steam-blue rounded-full mr-2 animate-pulse"></div>
                <span className="text-sm font-medium">Güvenli Sistem</span>
              </div>
            </div>
          </div>

          {!result ? (
            /* Enhanced Key Input Form */
            <div className="bg-gradient-to-br from-steam-darker/90 to-steam-dark/90 backdrop-blur-xl border border-steam-blue/30 rounded-2xl p-8 shadow-2xl shadow-steam-blue/10 animate-slide-up">
              <form onSubmit={handleKeySubmit} className="space-y-6">
                <div className="space-y-3">
                  <label className="block text-steam-light text-lg font-semibold mb-3">
                    🔑 Delivery Key
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={key}
                      onChange={(e) => setKey(e.target.value.toUpperCase())}
                      placeholder="STEAM-KEY-2025-XXX"
                      className="w-full px-6 py-4 bg-steam-dark/80 border-2 border-steam-blue/40 rounded-xl text-steam-light placeholder-steam-gray/60 focus:outline-none focus:border-steam-blue focus:ring-2 focus:ring-steam-blue/30 transition-all duration-300 text-lg font-mono tracking-wider"
                      disabled={loading}
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <div className="w-6 h-6 bg-steam-blue/20 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-steam-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m0 0a2 2 0 012 2 2 2 0 01-2 2m-2-2h.01M9 12h.01M12 17h.01M7 7l2-2M7 7l-2 2M7 7v6a2 2 0 002 2h6a2 2 0 002-2V7z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={loading || !key.trim()}
                  className="w-full relative overflow-hidden bg-gradient-to-r from-steam-blue via-blue-600 to-steam-blue hover:from-blue-600 hover:via-steam-blue hover:to-blue-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl shadow-steam-blue/30 hover:shadow-steam-blue/50 hover:scale-105 transform"
                >
                  {loading ? (
                    <LoadingSpinner />
                  ) : (
                    <div className="flex items-center justify-center space-x-3">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                      </svg>
                      <span className="text-xl">Hesabı Al</span>
                    </div>
                  )}
                  
                  {/* Button shine effect */}
                  <div className="absolute inset-0 -top-2 -left-2 bg-gradient-to-r from-transparent via-white/20 to-transparent transform rotate-12 translate-x-full transition-transform duration-1000 hover:translate-x-[-200%]"></div>
                </button>
              </form>
              
              {/* Security Badge */}
              <div className="mt-6 flex items-center justify-center text-steam-gray">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
                <span className="text-sm">256-bit SSL Şifreli Güvenli Bağlantı</span>
              </div>
            </div>
          ) : (
            /* Enhanced Result Display */
            <div className={`bg-gradient-to-br from-steam-darker/90 to-steam-dark/90 backdrop-blur-xl border-2 rounded-2xl p-8 shadow-2xl animate-slide-up ${
              result.success ? 'border-green-400/50 shadow-green-400/20' : 'border-red-400/50 shadow-red-400/20'
            }`}>
              <div className="text-center mb-6">
                <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 relative ${
                  result.success ? 'bg-green-500/20 shadow-green-400/30' : 'bg-red-500/20 shadow-red-400/30'
                } shadow-2xl`}>
                  {result.success ? (
                    <>
                      <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <div className="absolute inset-0 rounded-full border-4 border-green-400/30 animate-ping"></div>
                    </>
                  ) : (
                    <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  )}
                </div>
                <h3 className={`text-2xl font-bold mb-2 ${result.success ? 'text-green-400' : 'text-red-400'}`}>
                  {result.success ? '🎉 Başarılı!' : '❌ Hata'}
                </h3>
                <p className="text-steam-gray text-lg">
                  {result.message}
                </p>
              </div>

              {result.success && result.account && (
                <div className="space-y-4 mb-6">
                  <h4 className="text-steam-light text-xl font-bold text-center mb-4">
                    🎮 Steam Hesap Bilgileri
                  </h4>
                  
                  {/* Username */}
                  <div className="bg-steam-dark/80 rounded-xl p-4 border border-steam-blue/20 hover:border-steam-blue/40 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <label className="block text-steam-gray text-sm font-medium uppercase tracking-wider mb-2">
                          👤 Kullanıcı Adı
                        </label>
                        <div className="text-steam-light font-mono text-lg font-bold bg-steam-darker/50 rounded-lg px-4 py-2">
                          {result.account.username}
                        </div>
                      </div>
                      <button
                        onClick={() => copyToClipboard(result.account.username)}
                        className="ml-4 p-3 bg-steam-blue/20 hover:bg-steam-blue/30 rounded-lg text-steam-blue hover:text-blue-300 transition-all duration-200 hover:scale-110"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  {/* Password */}
                  <div className="bg-steam-dark/80 rounded-xl p-4 border border-steam-blue/20 hover:border-steam-blue/40 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <label className="block text-steam-gray text-sm font-medium uppercase tracking-wider mb-2">
                          🔐 Şifre
                        </label>
                        <div className="text-steam-light font-mono text-lg font-bold bg-steam-darker/50 rounded-lg px-4 py-2">
                          {result.account.password}
                        </div>
                      </div>
                      <button
                        onClick={() => copyToClipboard(result.account.password)}
                        className="ml-4 p-3 bg-steam-blue/20 hover:bg-steam-blue/30 rounded-lg text-steam-blue hover:text-blue-300 transition-all duration-200 hover:scale-110"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  {/* Steam Login Info */}
                  <div className="bg-gradient-to-r from-green-600/10 to-steam-blue/10 border border-green-400/20 rounded-xl p-4 mt-4">
                    <div className="flex items-start">
                      <svg className="w-6 h-6 text-green-400 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      <div>
                        <h4 className="text-green-400 font-semibold mb-1">Giriş Talimatları</h4>
                        <p className="text-steam-gray text-sm">
                          Steam'e giriş yapmak için yukarıdaki bilgileri kullanın. Hesap bilgilerinizi güvenli bir yerde saklayın.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setResult(null);
                    setKey("");
                  }}
                  className="flex-1 bg-steam-dark/80 hover:bg-steam-darker/80 text-steam-light font-bold py-3 px-6 rounded-xl transition-all duration-200 border border-steam-blue/30 hover:border-steam-blue/50 hover:scale-105"
                >
                  🔄 Yeni Key Dene
                </button>
                {result.success && (
                  <button
                    onClick={() => window.open('https://store.steampowered.com/login/', '_blank')}
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg"
                  >
                    🚀 Steam'e Git
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Enhanced Admin Panel Component
const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [notification, setNotification] = useState(null);
  
  // State
  const [accounts, setAccounts] = useState([]);
  const [keys, setKeys] = useState([]);
  const [newAccount, setNewAccount] = useState({ username: "", password: "" });
  const [newKey, setNewKey] = useState("");

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${API}/admin/verify`, { password });
      if (response.data.success) {
        setIsAuthenticated(true);
        showNotification("Admin paneline başarıyla giriş yapıldı!", "success");
        loadData();
      }
    } catch (error) {
      showNotification("Geçersiz şifre! Lütfen tekrar deneyin.", "error");
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
      showNotification("Veri yüklenirken hata oluştu!", "error");
    }
  };

  const addAccount = async (e) => {
    e.preventDefault();
    if (!newAccount.username || !newAccount.password) return;
    
    try {
      await axios.post(`${API}/admin/accounts`, newAccount, {
        headers: { Authorization: `Bearer dummy-token` }
      });
      setNewAccount({ username: "", password: "" });
      showNotification("Steam hesabı başarıyla eklendi!", "success");
      loadData();
    } catch (error) {
      showNotification("Hesap eklenirken hata oluştu!", "error");
    }
  };

  const deleteAccount = async (accountId) => {
    try {
      await axios.delete(`${API}/admin/accounts/${accountId}`, {
        headers: { Authorization: `Bearer dummy-token` }
      });
      showNotification("Hesap başarıyla silindi!", "success");
      loadData();
    } catch (error) {
      showNotification("Hesap silinirken hata oluştu!", "error");
    }
  };

  const addKey = async (e) => {
    e.preventDefault();
    if (!newKey) return;
    
    try {
      await axios.post(`${API}/admin/keys`, { key_value: newKey }, {
        headers: { Authorization: `Bearer dummy-token` }
      });
      setNewKey("");
      showNotification("Delivery key başarıyla eklendi!", "success");
      loadData();
    } catch (error) {
      showNotification("Key eklenirken hata oluştu!", "error");
    }
  };

  const deleteKey = async (keyId) => {
    try {
      await axios.delete(`${API}/admin/keys/${keyId}`, {
        headers: { Authorization: `Bearer dummy-token` }
      });
      showNotification("Key başarıyla silindi!", "success");
      loadData();
    } catch (error) {
      showNotification("Key silinirken hata oluştu!", "error");
    }
  };

  const generateRandomKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const segments = [];
    for (let i = 0; i < 4; i++) {
      let segment = '';
      for (let j = 0; j < 4; j++) {
        segment += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      segments.push(segment);
    }
    setNewKey(`STEAM-${segments.join('-')}`);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-steam-dark relative overflow-hidden flex items-center justify-center p-4">
        {/* Background */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1520347869523-5a7911be9fca?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHwzfHxzdGVhbSUyMGdhbWluZ3xlbnwwfHx8YmxhY2t8MTc1NDI0NzU3MHww&ixlib=rb-4.1.0&q=85')`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-steam-blue/20 via-steam-dark/95 to-steam-darker"></div>
        </div>

        {/* Notification */}
        {notification && (
          <AnimatedMessage 
            message={notification.message} 
            type={notification.type} 
            onClose={() => setNotification(null)} 
          />
        )}

        <div className="relative z-10 w-full max-w-md">
          <div className="bg-gradient-to-br from-steam-darker/90 to-steam-dark/90 backdrop-blur-xl border border-steam-blue/30 rounded-2xl p-8 shadow-2xl shadow-steam-blue/20">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-red-500/30">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-steam-light mb-2">Admin Paneli</h2>
              <p className="text-steam-gray">Güvenli giriş gerekli</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-steam-light text-sm font-medium mb-2">
                  🔐 Admin Şifresi
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Şifrenizi girin..."
                  className="w-full px-4 py-3 bg-steam-dark/80 border border-steam-blue/50 rounded-xl text-steam-light placeholder-steam-gray focus:outline-none focus:border-steam-blue focus:ring-2 focus:ring-steam-blue/30 transition-all duration-300"
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                disabled={loading || !password}
                className="w-full bg-gradient-to-r from-steam-blue to-blue-600 hover:from-blue-600 hover:to-steam-blue text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-steam-blue/30 hover:scale-105"
              >
                {loading ? <LoadingSpinner /> : "🚀 Giriş Yap"}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-steam-blue/20 text-center">
              <p className="text-steam-gray text-sm">
                <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                Güvenli Bağlantı Aktif
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-steam-dark">
      {/* Notification */}
      {notification && (
        <AnimatedMessage 
          message={notification.message} 
          type={notification.type} 
          onClose={() => setNotification(null)} 
        />
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-steam-darker to-steam-dark border-b border-steam-blue/30 p-4 shadow-xl">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-steam-blue to-blue-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-steam-light">Steam Admin Panel</h1>
              <p className="text-steam-gray text-sm">Hesap ve Key Yönetim Merkezi</p>
            </div>
          </div>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="flex items-center space-x-2 text-steam-gray hover:text-red-400 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            <span>Çıkış</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-steam-darker/50 p-1 rounded-2xl">
          {[
            { id: "dashboard", label: "📊 Dashboard", icon: "chart" },
            { id: "accounts", label: `🎮 Steam Hesapları (${accounts.length})`, icon: "users" },
            { id: "keys", label: `🔑 Delivery Keys (${keys.length})`, icon: "key" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-steam-blue to-blue-600 text-white shadow-lg scale-105"
                  : "text-steam-gray hover:text-steam-light hover:bg-steam-dark/50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatsCard
                title="Toplam Hesap"
                value={accounts.length}
                color="blue"
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
                  </svg>
                }
              />
              <StatsCard
                title="Aktif Keyler"
                value={keys.length}
                color="green"
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m0 0a2 2 0 012 2 2 2 0 01-2 2m-2-2h.01M9 12h.01M12 17h.01M7 7l2-2M7 7l-2 2M7 7v6a2 2 0 002 2h6a2 2 0 002-2V7z"/>
                  </svg>
                }
              />
              <StatsCard
                title="Sistem Durumu"
                value="Aktif"
                color="green"
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                }
              />
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-steam-darker/80 to-steam-dark/80 backdrop-blur-sm border border-steam-blue/20 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-steam-light mb-6 flex items-center">
                <svg className="w-6 h-6 mr-3 text-steam-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
                Hızlı İşlemler
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setActiveTab("accounts")}
                  className="p-4 bg-steam-dark/50 hover:bg-steam-blue/10 border border-steam-blue/20 hover:border-steam-blue/40 rounded-xl transition-all duration-300 text-left"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-steam-light font-semibold">Steam Hesabı Ekle</h4>
                      <p className="text-steam-gray text-sm">Yeni hesap bilgilerini ekle</p>
                    </div>
                    <svg className="w-8 h-8 text-steam-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                    </svg>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab("keys")}
                  className="p-4 bg-steam-dark/50 hover:bg-green-500/10 border border-green-400/20 hover:border-green-400/40 rounded-xl transition-all duration-300 text-left"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-steam-light font-semibold">Delivery Key Oluştur</h4>
                      <p className="text-steam-gray text-sm">Yeni teslimat anahtarı ekle</p>
                    </div>
                    <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="15 7a2 2 0 012 2m0 0a2 2 0 012 2 2 2 0 01-2 2m-2-2h.01M9 12h.01M12 17h.01M7 7l2-2M7 7l-2 2M7 7v6a2 2 0 002 2h6a2 2 0 002-2V7z"/>
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Accounts Tab */}
        {activeTab === "accounts" && (
          <div className="space-y-6">
            {/* Add Account Form */}
            <div className="bg-gradient-to-br from-steam-darker/80 to-steam-dark/80 backdrop-blur-sm border border-steam-blue/20 rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-steam-light mb-6 flex items-center">
                <svg className="w-7 h-7 mr-3 text-steam-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
                Yeni Steam Hesabı Ekle
              </h3>
              <form onSubmit={addAccount} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-steam-gray text-sm font-medium mb-2">👤 Kullanıcı Adı</label>
                  <input
                    type="text"
                    value={newAccount.username}
                    onChange={(e) => setNewAccount({...newAccount, username: e.target.value})}
                    placeholder="Steam kullanıcı adı"
                    className="w-full px-4 py-3 bg-steam-dark/80 border border-steam-blue/40 rounded-xl text-steam-light placeholder-steam-gray focus:outline-none focus:border-steam-blue focus:ring-2 focus:ring-steam-blue/30 transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-steam-gray text-sm font-medium mb-2">🔐 Şifre</label>
                  <input
                    type="text"
                    value={newAccount.password}
                    onChange={(e) => setNewAccount({...newAccount, password: e.target.value})}
                    placeholder="Steam şifresi"
                    className="w-full px-4 py-3 bg-steam-dark/80 border border-steam-blue/40 rounded-xl text-steam-light placeholder-steam-gray focus:outline-none focus:border-steam-blue focus:ring-2 focus:ring-steam-blue/30 transition-all duration-300"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
                  >
                    ➕ Hesap Ekle
                  </button>
                </div>
              </form>
            </div>

            {/* Accounts Table */}
            <div className="bg-gradient-to-br from-steam-darker/80 to-steam-dark/80 backdrop-blur-sm border border-steam-blue/20 rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-steam-blue/20">
                <h3 className="text-2xl font-bold text-steam-light flex items-center">
                  <svg className="w-7 h-7 mr-3 text-steam-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
                  </svg>
                  Steam Hesapları ({accounts.length})
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-steam-dark/50">
                    <tr>
                      <th className="text-left p-4 text-steam-light font-semibold">👤 Kullanıcı Adı</th>
                      <th className="text-left p-4 text-steam-light font-semibold">🔐 Şifre</th>
                      <th className="text-left p-4 text-steam-light font-semibold">📅 Ekleme Tarihi</th>
                      <th className="text-left p-4 text-steam-light font-semibold">⚙️ İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accounts.map((account, index) => (
                      <tr key={account.id} className={`border-t border-steam-blue/10 hover:bg-steam-blue/5 transition-colors ${index % 2 === 0 ? 'bg-steam-dark/20' : ''}`}>
                        <td className="p-4 text-steam-light font-mono font-bold">{account.username}</td>
                        <td className="p-4 text-steam-light font-mono">
                          <span className="bg-steam-dark/50 px-3 py-1 rounded-lg">{account.password}</span>
                        </td>
                        <td className="p-4 text-steam-gray text-sm">
                          {new Date(account.created_at).toLocaleDateString('tr-TR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => deleteAccount(account.id)}
                            className="bg-red-600/80 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-all duration-200 hover:scale-105 shadow-lg flex items-center space-x-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>
                            <span>Sil</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {accounts.length === 0 && (
                  <div className="p-8 text-center text-steam-gray">
                    <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
                    </svg>
                    <p className="text-lg">Henüz Steam hesabı eklenmemiş</p>
                    <p className="text-sm">Yukarıdaki formu kullanarak hesap ekleyebilirsiniz</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Keys Tab */}
        {activeTab === "keys" && (
          <div className="space-y-6">
            {/* Add Key Form */}
            <div className="bg-gradient-to-br from-steam-darker/80 to-steam-dark/80 backdrop-blur-sm border border-steam-blue/20 rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-steam-light mb-6 flex items-center">
                <svg className="w-7 h-7 mr-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
                Yeni Delivery Key Ekle
              </h3>
              <form onSubmit={addKey} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-steam-gray text-sm font-medium mb-2">🔑 Key Değeri</label>
                  <input
                    type="text"
                    value={newKey}
                    onChange={(e) => setNewKey(e.target.value.toUpperCase())}
                    placeholder="STEAM-XXXX-XXXX-XXXX"
                    className="w-full px-4 py-3 bg-steam-dark/80 border border-steam-blue/40 rounded-xl text-steam-light placeholder-steam-gray focus:outline-none focus:border-steam-blue focus:ring-2 focus:ring-steam-blue/30 transition-all duration-300 font-mono"
                  />
                </div>
                <div className="flex items-end space-x-2">
                  <button
                    type="button"
                    onClick={generateRandomKey}
                    className="flex-1 bg-steam-blue/20 hover:bg-steam-blue/30 text-steam-blue border border-steam-blue/40 font-medium py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105"
                  >
                    🎲 Rastgele
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
                  >
                    ➕ Ekle
                  </button>
                </div>
              </form>
            </div>

            {/* Keys Table */}
            <div className="bg-gradient-to-br from-steam-darker/80 to-steam-dark/80 backdrop-blur-sm border border-steam-blue/20 rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-steam-blue/20">
                <h3 className="text-2xl font-bold text-steam-light flex items-center">
                  <svg className="w-7 h-7 mr-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="15 7a2 2 0 012 2m0 0a2 2 0 012 2 2 2 0 01-2 2m-2-2h.01M9 12h.01M12 17h.01M7 7l2-2M7 7l-2 2M7 7v6a2 2 0 002 2h6a2 2 0 002-2V7z"/>
                  </svg>
                  Delivery Keys ({keys.length})
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-steam-dark/50">
                    <tr>
                      <th className="text-left p-4 text-steam-light font-semibold">🔑 Key</th>
                      <th className="text-left p-4 text-steam-light font-semibold">📅 Oluşturma Tarihi</th>
                      <th className="text-left p-4 text-steam-light font-semibold">📊 Durum</th>
                      <th className="text-left p-4 text-steam-light font-semibold">⚙️ İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {keys.map((key, index) => (
                      <tr key={key.id} className={`border-t border-steam-blue/10 hover:bg-steam-blue/5 transition-colors ${index % 2 === 0 ? 'bg-steam-dark/20' : ''}`}>
                        <td className="p-4 text-steam-light font-mono font-bold">
                          <span className="bg-steam-dark/50 px-3 py-2 rounded-lg">{key.key_value}</span>
                        </td>
                        <td className="p-4 text-steam-gray text-sm">
                          {new Date(key.created_at).toLocaleDateString('tr-TR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-400/20 text-green-400 border border-green-400/30">
                            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                            Aktif
                          </span>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => deleteKey(key.id)}
                            className="bg-red-600/80 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-all duration-200 hover:scale-105 shadow-lg flex items-center space-x-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>
                            <span>Sil</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {keys.length === 0 && (
                  <div className="p-8 text-center text-steam-gray">
                    <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="15 7a2 2 0 012 2m0 0a2 2 0 012 2 2 2 0 01-2 2m-2-2h.01M9 12h.01M12 17h.01M7 7l2-2M7 7l-2 2M7 7v6a2 2 0 002 2h6a2 2 0 002-2V7z"/>
                    </svg>
                    <p className="text-lg">Henüz delivery key oluşturulmamış</p>
                    <p className="text-sm">Yukarıdaki formu kullanarak key ekleyebilirsiniz</p>
                  </div>
                )}
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