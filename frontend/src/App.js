import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Advanced Particle System
const ParticleSystem = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
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
        
        // Add glow effect
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
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);
  
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};

// Modern Toast Notification System
const Toast = ({ message, type, onClose, progress }) => (
  <div className={`fixed top-4 right-4 z-50 transform transition-all duration-500 ease-out animate-slide-in-right`}>
    <div className={`relative overflow-hidden rounded-2xl backdrop-blur-xl shadow-2xl max-w-sm ${
      type === 'success' 
        ? 'bg-green-600/10 border border-green-400/30 shadow-green-400/20' 
        : type === 'error'
        ? 'bg-red-600/10 border border-red-400/30 shadow-red-400/20'
        : 'bg-blue-600/10 border border-blue-400/30 shadow-blue-400/20'
    }`}>
      {/* Progress bar */}
      <div className="absolute top-0 left-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-60 transition-all duration-100" 
           style={{ width: `${progress}%` }} />
      
      <div className="p-4 flex items-center">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 ${
          type === 'success' ? 'bg-green-400/20' : type === 'error' ? 'bg-red-400/20' : 'bg-blue-400/20'
        }`}>
          {type === 'success' ? (
            <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          ) : type === 'error' ? (
            <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          ) : (
            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          )}
        </div>
        <div className="flex-1">
          <p className="text-white font-medium text-sm leading-relaxed">{message}</p>
        </div>
        <button 
          onClick={onClose}
          className="ml-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4 text-white/70 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
);

// Modern Loading Component with 3D Effect
const ModernLoader = ({ text = "İşleniyor..." }) => (
  <div className="flex items-center justify-center space-x-3">
    <div className="relative">
      <div className="w-8 h-8 border-2 border-steam-blue/20 rounded-full animate-spin-slow"></div>
      <div className="absolute top-0 left-0 w-8 h-8 border-2 border-transparent border-t-steam-blue border-r-steam-blue rounded-full animate-spin"></div>
      <div className="absolute top-1 left-1 w-6 h-6 border border-blue-300/40 rounded-full animate-ping"></div>
    </div>
    <span className="text-steam-light font-medium animate-pulse-slow">{text}</span>
  </div>
);

// Glassmorphism Card Component
const GlassCard = ({ children, className = "", hover = true, ...props }) => (
  <div 
    className={`
      bg-white/5 backdrop-blur-xl border border-white/10 
      shadow-2xl shadow-black/20 rounded-2xl
      ${hover ? 'hover:bg-white/10 hover:border-white/20 hover:shadow-3xl hover:scale-105 transform transition-all duration-500 ease-out' : ''}
      ${className}
    `}
    {...props}
  >
    {children}
  </div>
);

// Modern Stats Card with 3D Effects
const StatsCard3D = ({ title, value, icon, color = "blue", trend = null }) => (
  <GlassCard className="p-6 group relative overflow-hidden">
    {/* Background gradient */}
    <div className={`absolute inset-0 bg-gradient-to-br opacity-5 group-hover:opacity-10 transition-opacity duration-500 ${
      color === 'green' ? 'from-green-400 to-emerald-600' : 
      color === 'orange' ? 'from-orange-400 to-red-500' : 
      'from-blue-400 to-indigo-600'
    }`} />
    
    <div className="relative z-10 flex items-center justify-between">
      <div className="space-y-2">
        <p className="text-steam-gray text-sm font-medium uppercase tracking-wider">{title}</p>
        <div className="flex items-baseline space-x-2">
          <p className={`text-3xl font-bold ${
            color === 'green' ? 'text-green-400' : 
            color === 'orange' ? 'text-orange-400' : 
            'text-blue-400'
          }`}>
            {value}
          </p>
          {trend && (
            <span className={`text-xs px-2 py-1 rounded-full ${
              trend > 0 ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'
            }`}>
              {trend > 0 ? '+' : ''}{trend}%
            </span>
          )}
        </div>
      </div>
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center relative group-hover:scale-110 transition-transform duration-500 ${
        color === 'green' ? 'bg-green-500/20 shadow-green-500/25' : 
        color === 'orange' ? 'bg-orange-500/20 shadow-orange-500/25' : 
        'bg-blue-500/20 shadow-blue-500/25'
      } shadow-lg`}>
        {icon}
        {/* Pulse ring */}
        <div className={`absolute inset-0 rounded-2xl animate-ping opacity-20 ${
          color === 'green' ? 'bg-green-400' : 
          color === 'orange' ? 'bg-orange-400' : 
          'bg-blue-400'
        }`} />
      </div>
    </div>
  </GlassCard>
);

// Ultra Modern Home Page
const Home = () => {
  const [key, setKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [toast, setToast] = useState(null);
  const [progress, setProgress] = useState(100);

  const showToast = (message, type) => {
    setToast({ message, type });
    setProgress(100);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev <= 0) {
          clearInterval(interval);
          setToast(null);
          return 100;
        }
        return prev - 2;
      });
    }, 100);
  };

  const handleKeySubmit = async (e) => {
    e.preventDefault();
    if (!key.trim()) return;

    setLoading(true);
    try {
      const response = await axios.post(`${API}/redeem-key`, { key });
      setResult(response.data);
      if (response.data.success) {
        showToast("🎉 Steam hesabınız başarıyla teslim edildi!", "success");
      } else {
        showToast(response.data.message, "error");
      }
    } catch (error) {
      const errorMsg = "⚠️ Bir hata oluştu. Lütfen tekrar deneyin.";
      setResult({
        success: false,
        message: errorMsg
      });
      showToast(errorMsg, "error");
    }
    setLoading(false);
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast("📋 Panoya kopyalandı!", "success");
    } catch (err) {
      console.error('Kopyalama hatası:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Advanced Particle System */}
      <ParticleSystem />
      
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-1">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1511512578047-dfb367046420?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwxfHxnYW1pbmd8ZW58MHx8fGJsYWNrfDE3NTQyNDc1NzZ8MA&ixlib=rb-4.1.0&q=85')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-purple-600/10 animate-gradient-shift" />
      </div>
      
      {/* Toast Notification */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          progress={progress}
          onClose={() => setToast(null)} 
        />
      )}
      
      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {/* Ultra Modern Header */}
          <div className="text-center mb-12 animate-fade-in-up">
            <div className="relative mb-8">
              {/* Main Logo */}
              <div className="inline-flex items-center space-x-6">
                <div className="relative group">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/30 transform group-hover:scale-110 transition-all duration-500">
                    <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
                    </svg>
                  </div>
                  {/* Floating rings */}
                  <div className="absolute inset-0 rounded-3xl border-2 border-blue-400/30 animate-ping"></div>
                  <div className="absolute -inset-2 rounded-3xl border border-blue-300/20 animate-pulse"></div>
                  
                  {/* Status indicator */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/50">
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse-fast"></div>
                  </div>
                </div>
                
                <div className="text-left space-y-2">
                  <h1 className="text-5xl font-black bg-gradient-to-r from-white via-blue-200 to-blue-400 bg-clip-text text-transparent leading-tight">
                    Steam
                  </h1>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                    Hesap Merkezi
                  </h2>
                  <div className="h-1 w-32 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
            
            <p className="text-xl text-slate-300 font-medium mb-6 max-w-md mx-auto leading-relaxed">
              Premium Steam hesaplarına anında erişim sağlayın
            </p>
            
            {/* Status Indicators */}
            <div className="flex items-center justify-center space-x-8 mb-8">
              <div className="flex items-center text-green-400 space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse-fast shadow-lg shadow-green-400/50"></div>
                <span className="text-sm font-semibold">Anlık Teslimat</span>
              </div>
              <div className="flex items-center text-blue-400 space-x-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse-fast shadow-lg shadow-blue-400/50"></div>
                <span className="text-sm font-semibold">256-bit Güvenlik</span>
              </div>
              <div className="flex items-center text-purple-400 space-x-2">
                <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse-fast shadow-lg shadow-purple-400/50"></div>
                <span className="text-sm font-semibold">7/24 Aktif</span>
              </div>
            </div>
          </div>

          {!result ? (
            /* Ultra Modern Key Input */
            <GlassCard className="p-8 animate-slide-up">
              <form onSubmit={handleKeySubmit} className="space-y-8">
                <div className="space-y-4">
                  <label className="block text-white text-xl font-bold mb-4 flex items-center">
                    <span className="text-2xl mr-3">🔑</span>
                    Delivery Key
                  </label>
                  
                  <div className="relative group">
                    <input
                      type="text"
                      value={key}
                      onChange={(e) => setKey(e.target.value.toUpperCase())}
                      placeholder="STEAM-KEY-2025-XXXX"
                      className="w-full px-8 py-6 bg-white/5 border-2 border-white/10 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-400/50 focus:ring-4 focus:ring-blue-400/20 transition-all duration-300 text-xl font-mono tracking-wider backdrop-blur-xl group-hover:border-white/20"
                      disabled={loading}
                    />
                    
                    {/* Input decorations */}
                    <div className="absolute right-6 top-1/2 transform -translate-y-1/2">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m0 0a2 2 0 012 2 2 2 0 01-2 2m-2-2h.01M9 12h.01M12 17h.01M7 7l2-2M7 7l-2 2M7 7v6a2 2 0 002 2h6a2 2 0 002-2V7z"/>
                        </svg>
                      </div>
                    </div>
                    
                    {/* Focus indicator */}
                    <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-focus-within:border-blue-400/30 group-focus-within:shadow-lg group-focus-within:shadow-blue-400/10 transition-all duration-300 pointer-events-none"></div>
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={loading || !key.trim()}
                  className="w-full relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-600 text-white font-bold py-6 px-8 rounded-2xl transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl shadow-blue-500/30 hover:shadow-blue-400/40 hover:scale-105 transform group"
                >
                  {loading ? (
                    <ModernLoader text="Hesap hazırlanıyor..." />
                  ) : (
                    <div className="flex items-center justify-center space-x-4">
                      <svg className="w-7 h-7 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                      </svg>
                      <span className="text-2xl font-black">HESABI AL</span>
                      <svg className="w-7 h-7 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                      </svg>
                    </div>
                  )}
                  
                  {/* Button shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </button>
              </form>
            </GlassCard>
          ) : (
            /* Ultra Modern Result Display */
            <GlassCard className={`p-8 animate-slide-up border-2 ${
              result.success 
                ? 'border-green-400/30 shadow-green-400/20' 
                : 'border-red-400/30 shadow-red-400/20'
            }`}>
              <div className="text-center mb-8">
                <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 relative ${
                  result.success 
                    ? 'bg-green-500/20 shadow-green-400/30' 
                    : 'bg-red-500/20 shadow-red-400/30'
                } shadow-2xl`}>
                  {result.success ? (
                    <>
                      <svg className="w-12 h-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <div className="absolute inset-0 rounded-full border-4 border-green-400/30 animate-ping"></div>
                      <div className="absolute -inset-2 rounded-full border-2 border-green-300/20 animate-pulse"></div>
                    </>
                  ) : (
                    <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  )}
                </div>
                
                <h3 className={`text-3xl font-bold mb-4 ${result.success ? 'text-green-400' : 'text-red-400'}`}>
                  {result.success ? '🎉 Başarılı!' : '❌ Hata Oluştu'}
                </h3>
                <p className="text-slate-300 text-lg leading-relaxed max-w-md mx-auto">
                  {result.message}
                </p>
              </div>

              {result.success && result.account && (
                <div className="space-y-6 mb-8">
                  <h4 className="text-white text-2xl font-bold text-center mb-6 flex items-center justify-center">
                    <span className="text-3xl mr-3">🎮</span>
                    Steam Hesap Bilgileri
                  </h4>
                  
                  {/* Username Card */}
                  <GlassCard className="p-6 hover:bg-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <label className="block text-slate-400 text-sm font-semibold uppercase tracking-wider mb-3 flex items-center">
                          <span className="text-lg mr-2">👤</span>
                          Kullanıcı Adı
                        </label>
                        <div className="bg-slate-800/50 rounded-xl px-6 py-4 border border-white/10">
                          <span className="text-white font-mono text-xl font-bold">
                            {result.account.username}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => copyToClipboard(result.account.username)}
                        className="ml-6 p-4 bg-blue-500/20 hover:bg-blue-500/30 rounded-xl text-blue-400 hover:text-blue-300 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-blue-400/25"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                        </svg>
                      </button>
                    </div>
                  </GlassCard>
                  
                  {/* Password Card */}
                  <GlassCard className="p-6 hover:bg-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <label className="block text-slate-400 text-sm font-semibold uppercase tracking-wider mb-3 flex items-center">
                          <span className="text-lg mr-2">🔐</span>
                          Şifre
                        </label>
                        <div className="bg-slate-800/50 rounded-xl px-6 py-4 border border-white/10">
                          <span className="text-white font-mono text-xl font-bold">
                            {result.account.password}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => copyToClipboard(result.account.password)}
                        className="ml-6 p-4 bg-blue-500/20 hover:bg-blue-500/30 rounded-xl text-blue-400 hover:text-blue-300 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-blue-400/25"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                        </svg>
                      </button>
                    </div>
                  </GlassCard>
                  
                  {/* Instructions */}
                  <GlassCard className="p-6 bg-gradient-to-r from-green-600/10 to-blue-600/10 border-green-400/20">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg className="w-7 h-7 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-green-400 font-bold text-lg mb-2">🚀 Giriş Talimatları</h4>
                        <p className="text-slate-300 leading-relaxed">
                          Steam'e giriş yapmak için yukarıdaki bilgileri kullanın. Hesap bilgilerinizi güvenli bir yerde saklayın.
                          <br />
                          <span className="text-amber-400 font-semibold">⚠️ Not: Kullanılan key otomatik olarak silindi.</span>
                        </p>
                      </div>
                    </div>
                  </GlassCard>
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setResult(null);
                    setKey("");
                  }}
                  className="flex-1 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/30 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 hover:scale-105 backdrop-blur-xl"
                >
                  🔄 Yeni Key Dene
                </button>
                {result.success && (
                  <button
                    onClick={() => window.open('https://store.steampowered.com/login/', '_blank')}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg shadow-green-500/25"
                  >
                    🚀 Steam'e Git
                  </button>
                )}
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
};

// Ultra Modern Admin Panel
const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [toast, setToast] = useState(null);
  const [progress, setProgress] = useState(100);
  
  // State
  const [accounts, setAccounts] = useState([]);
  const [keys, setKeys] = useState([]);
  const [newAccount, setNewAccount] = useState({ username: "", password: "" });
  const [newKey, setNewKey] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const showToast = (message, type) => {
    setToast({ message, type });
    setProgress(100);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev <= 0) {
          clearInterval(interval);
          setToast(null);
          return 100;
        }
        return prev - 2;
      });
    }, 100);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${API}/admin/verify`, { password });
      if (response.data.success) {
        setIsAuthenticated(true);
        showToast("🎉 Admin paneline başarıyla giriş yapıldı!", "success");
        loadData();
      }
    } catch (error) {
      showToast("❌ Geçersiz şifre! Lütfen tekrar deneyin.", "error");
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
      showToast("⚠️ Veri yüklenirken hata oluştu!", "error");
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
      showToast("✅ Steam hesabı başarıyla eklendi!", "success");
      loadData();
    } catch (error) {
      showToast("❌ Hesap eklenirken hata oluştu!", "error");
    }
  };

  const deleteAccount = async (accountId, username) => {
    if (!window.confirm(`"${username}" hesabını silmek istediğinizden emin misiniz?`)) return;
    
    try {
      await axios.delete(`${API}/admin/accounts/${accountId}`, {
        headers: { Authorization: `Bearer dummy-token` }
      });
      showToast("🗑️ Hesap başarıyla silindi!", "success");
      loadData();
    } catch (error) {
      showToast("❌ Hesap silinirken hata oluştu!", "error");
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
      showToast("🔑 Delivery key başarıyla eklendi!", "success");
      loadData();
    } catch (error) {
      showToast("❌ Key eklenirken hata oluştu!", "error");
    }
  };

  const deleteKey = async (keyId, keyValue) => {
    if (!window.confirm(`"${keyValue}" key'ini silmek istediğinizden emin misiniz?`)) return;
    
    try {
      await axios.delete(`${API}/admin/keys/${keyId}`, {
        headers: { Authorization: `Bearer dummy-token` }
      });
      showToast("🗑️ Key başarıyla silindi!", "success");
      loadData();
    } catch (error) {
      showToast("❌ Key silinirken hata oluştu!", "error");
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

  const filteredAccounts = accounts.filter(account =>
    account.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredKeys = keys.filter(key =>
    key.key_value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden flex items-center justify-center p-4">
        {/* Particle System */}
        <ParticleSystem />
        
        {/* Background */}
        <div className="absolute inset-0 z-1">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1520347869523-5a7911be9fca?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHwzfHxzdGVhbSUyMGdhbWluZ3xlbnwwfHx8YmxhY2t8MTc1NDI0NzU3MHww&ixlib=rb-4.1.0&q=85')`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 via-transparent to-purple-600/10" />
        </div>

        {/* Toast */}
        {toast && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            progress={progress}
            onClose={() => setToast(null)} 
          />
        )}

        <div className="relative z-10 w-full max-w-lg">
          <GlassCard className="p-10">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-rose-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-red-500/30 relative">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
                <div className="absolute inset-0 rounded-3xl border-2 border-red-400/30 animate-ping"></div>
              </div>
              <h2 className="text-4xl font-black text-white mb-3">Admin Panel</h2>
              <p className="text-slate-400 text-lg">Güvenli giriş gerekli</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-8">
              <div>
                <label className="block text-white text-lg font-bold mb-4 flex items-center">
                  <span className="text-xl mr-3">🔐</span>
                  Admin Şifresi
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Şifrenizi girin..."
                    className="w-full px-6 py-4 bg-white/5 border-2 border-white/10 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:border-red-400/50 focus:ring-4 focus:ring-red-400/20 transition-all duration-300 text-lg backdrop-blur-xl"
                    disabled={loading}
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={loading || !password}
                className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl shadow-red-500/30 hover:shadow-red-400/40 hover:scale-105 transform relative overflow-hidden group"
              >
                {loading ? <ModernLoader text="Giriş yapılıyor..." /> : "🚀 Giriş Yap"}
                
                {/* Button shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/10 text-center">
              <p className="text-slate-400 text-sm flex items-center justify-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse-fast"></div>
                256-bit SSL Şifreli Güvenli Bağlantı
              </p>
            </div>
          </GlassCard>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <ParticleSystem />
      
      {/* Toast */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          progress={progress}
          onClose={() => setToast(null)} 
        />
      )}

      {/* Ultra Modern Header */}
      <div className="relative z-10 bg-gradient-to-r from-slate-900/80 to-slate-800/80 backdrop-blur-xl border-b border-white/10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-black text-white">Steam Admin Panel</h1>
                <p className="text-slate-400 text-sm font-medium">Hesap ve Key Yönetim Merkezi</p>
              </div>
              
              {/* Search */}
              {(activeTab === "accounts" || activeTab === "keys") && (
                <div className="relative ml-8">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={`${activeTab === "accounts" ? "Hesap" : "Key"} ara...`}
                    className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300 backdrop-blur-xl"
                  />
                  <svg className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
              )}
            </div>
            
            <button
              onClick={() => setIsAuthenticated(false)}
              className="flex items-center space-x-3 text-slate-400 hover:text-red-400 transition-colors group"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
              <span className="font-semibold">Çıkış</span>
            </button>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6">
        {/* Ultra Modern Navigation */}
        <div className="flex space-x-2 mb-8 p-2 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
          {[
            { id: "dashboard", label: "📊 Dashboard", icon: "chart" },
            { id: "accounts", label: `🎮 Steam Hesapları`, count: filteredAccounts.length },
            { id: "keys", label: `🔑 Delivery Keys`, count: filteredKeys.length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-6 py-4 rounded-xl font-bold text-lg transition-all duration-500 relative overflow-hidden group ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-2xl shadow-blue-500/25 scale-105"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className="relative z-10 flex items-center justify-center space-x-2">
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                    activeTab === tab.id 
                      ? 'bg-white/20 text-white' 
                      : 'bg-slate-700 text-slate-300'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </span>
              
              {activeTab === tab.id && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              )}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="space-y-8 animate-fade-in-up">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatsCard3D
                title="Toplam Steam Hesabı"
                value={accounts.length}
                color="blue"
                trend={12}
                icon={
                  <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
                  </svg>
                }
              />
              <StatsCard3D
                title="Aktif Delivery Keyler"
                value={keys.length}
                color="green"
                trend={8}
                icon={
                  <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="15 7a2 2 0 012 2m0 0a2 2 0 012 2 2 2 0 01-2 2m-2-2h.01M9 12h.01M12 17h.01M7 7l2-2M7 7l-2 2M7 7v6a2 2 0 002 2h6a2 2 0 002-2V7z"/>
                  </svg>
                }
              />
              <StatsCard3D
                title="Sistem Durumu"
                value="Aktif"
                color="green"
                icon={
                  <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                }
              />
            </div>

            {/* Quick Actions */}
            <GlassCard className="p-8">
              <h3 className="text-2xl font-bold text-white mb-8 flex items-center">
                <svg className="w-8 h-8 mr-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
                Hızlı İşlemler
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GlassCard
                  className="p-6 cursor-pointer group hover:scale-105 transition-all duration-300"
                  onClick={() => setActiveTab("accounts")}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-bold text-xl mb-2">Steam Hesabı Ekle</h4>
                      <p className="text-slate-400">Yeni hesap bilgilerini sisteme ekleyin</p>
                    </div>
                    <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                      <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                      </svg>
                    </div>
                  </div>
                </GlassCard>
                
                <GlassCard
                  className="p-6 cursor-pointer group hover:scale-105 transition-all duration-300"
                  onClick={() => setActiveTab("keys")}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-bold text-xl mb-2">Delivery Key Oluştur</h4>
                      <p className="text-slate-400">Yeni teslimat anahtarı oluşturun</p>
                    </div>
                    <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                      <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="15 7a2 2 0 012 2m0 0a2 2 0 012 2 2 2 0 01-2 2m-2-2h.01M9 12h.01M12 17h.01M7 7l2-2M7 7l-2 2M7 7v6a2 2 0 002 2h6a2 2 0 002-2V7z"/>
                      </svg>
                    </div>
                  </div>
                </GlassCard>
              </div>
            </GlassCard>
          </div>
        )}

        {/* Accounts Tab */}
        {activeTab === "accounts" && (
          <div className="space-y-8 animate-fade-in-up">
            {/* Add Account Form */}
            <GlassCard className="p-8">
              <h3 className="text-2xl font-bold text-white mb-8 flex items-center">
                <svg className="w-8 h-8 mr-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
                Yeni Steam Hesabı Ekle
              </h3>
              <form onSubmit={addAccount} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-slate-300 text-sm font-bold mb-3 flex items-center">
                    <span className="text-lg mr-2">👤</span>
                    Kullanıcı Adı
                  </label>
                  <input
                    type="text"
                    value={newAccount.username}
                    onChange={(e) => setNewAccount({...newAccount, username: e.target.value})}
                    placeholder="Steam kullanıcı adı"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300 backdrop-blur-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-sm font-bold mb-3 flex items-center">
                    <span className="text-lg mr-2">🔐</span>
                    Şifre
                  </label>
                  <input
                    type="text"
                    value={newAccount.password}
                    onChange={(e) => setNewAccount({...newAccount, password: e.target.value})}
                    placeholder="Steam şifresi"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300 backdrop-blur-xl"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-green-500/25 relative overflow-hidden group"
                  >
                    <span className="relative z-10">➕ Hesap Ekle</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </button>
                </div>
              </form>
            </GlassCard>

            {/* Accounts Table */}
            <GlassCard className="overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <h3 className="text-2xl font-bold text-white flex items-center">
                  <svg className="w-8 h-8 mr-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
                  </svg>
                  Steam Hesapları ({filteredAccounts.length})
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="text-left p-6 text-white font-bold">👤 Kullanıcı Adı</th>
                      <th className="text-left p-6 text-white font-bold">🔐 Şifre</th>
                      <th className="text-left p-6 text-white font-bold">📅 Ekleme Tarihi</th>
                      <th className="text-left p-6 text-white font-bold">⚙️ İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAccounts.map((account, index) => (
                      <tr key={account.id} className={`border-t border-white/5 hover:bg-white/5 transition-colors ${index % 2 === 0 ? 'bg-white/2' : ''}`}>
                        <td className="p-6 text-white font-mono font-bold">{account.username}</td>
                        <td className="p-6">
                          <span className="bg-slate-800/50 text-white font-mono px-4 py-2 rounded-lg border border-white/10">
                            {account.password}
                          </span>
                        </td>
                        <td className="p-6 text-slate-300 text-sm">
                          {new Date(account.created_at).toLocaleDateString('tr-TR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td className="p-6">
                          <button
                            onClick={() => deleteAccount(account.id, account.username)}
                            className="bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 hover:border-red-500/50 text-red-400 hover:text-red-300 px-4 py-2 rounded-lg text-sm transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-red-500/25 flex items-center space-x-2"
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
                {filteredAccounts.length === 0 && (
                  <div className="p-12 text-center text-slate-400">
                    <svg className="w-20 h-20 mx-auto mb-6 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
                    </svg>
                    <p className="text-2xl font-bold mb-2">
                      {searchTerm ? "Arama sonucu bulunamadı" : "Henüz Steam hesabı eklenmemiş"}
                    </p>
                    <p className="text-lg">
                      {searchTerm ? `"${searchTerm}" için sonuç bulunamadı` : "Yukarıdaki formu kullanarak hesap ekleyebilirsiniz"}
                    </p>
                  </div>
                )}
              </div>
            </GlassCard>
          </div>
        )}

        {/* Keys Tab */}
        {activeTab === "keys" && (
          <div className="space-y-8 animate-fade-in-up">
            {/* Add Key Form */}
            <GlassCard className="p-8">
              <h3 className="text-2xl font-bold text-white mb-8 flex items-center">
                <svg className="w-8 h-8 mr-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
                Yeni Delivery Key Ekle
              </h3>
              <form onSubmit={addKey} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-slate-300 text-sm font-bold mb-3 flex items-center">
                    <span className="text-lg mr-2">🔑</span>
                    Key Değeri
                  </label>
                  <input
                    type="text"
                    value={newKey}
                    onChange={(e) => setNewKey(e.target.value.toUpperCase())}
                    placeholder="STEAM-XXXX-XXXX-XXXX"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-green-400/50 focus:ring-2 focus:ring-green-400/20 transition-all duration-300 font-mono backdrop-blur-xl"
                  />
                </div>
                <div className="flex items-end space-x-3">
                  <button
                    type="button"
                    onClick={generateRandomKey}
                    className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 hover:border-blue-400/50 text-blue-400 font-bold py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105"
                  >
                    🎲 Rastgele
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-green-500/25 relative overflow-hidden group"
                  >
                    <span className="relative z-10">➕ Ekle</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </button>
                </div>
              </form>
            </GlassCard>

            {/* Keys Table */}
            <GlassCard className="overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <h3 className="text-2xl font-bold text-white flex items-center">
                  <svg className="w-8 h-8 mr-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLin ecap="round" strokeLinejoin="round" strokeWidth="2" d="15 7a2 2 0 012 2m0 0a2 2 0 012 2 2 2 0 01-2 2m-2-2h.01M9 12h.01M12 17h.01M7 7l2-2M7 7l-2 2M7 7v6a2 2 0 002 2h6a2 2 0 002-2V7z"/>
                  </svg>
                  Delivery Keys ({filteredKeys.length})
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="text-left p-6 text-white font-bold">🔑 Key</th>
                      <th className="text-left p-6 text-white font-bold">📅 Oluşturma Tarihi</th>
                      <th className="text-left p-6 text-white font-bold">📊 Durum</th>
                      <th className="text-left p-6 text-white font-bold">⚙️ İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredKeys.map((key, index) => (
                      <tr key={key.id} className={`border-t border-white/5 hover:bg-white/5 transition-colors ${index % 2 === 0 ? 'bg-white/2' : ''}`}>
                        <td className="p-6">
                          <span className="bg-slate-800/50 text-white font-mono font-bold px-4 py-2 rounded-lg border border-white/10">
                            {key.key_value}
                          </span>
                        </td>
                        <td className="p-6 text-slate-300 text-sm">
                          {new Date(key.created_at).toLocaleDateString('tr-TR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td className="p-6">
                          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-green-400/20 text-green-400 border border-green-400/30">
                            <div className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse-fast"></div>
                            Aktif
                          </span>
                        </td>
                        <td className="p-6">
                          <button
                            onClick={() => deleteKey(key.id, key.key_value)}
                            className="bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 hover:border-red-500/50 text-red-400 hover:text-red-300 px-4 py-2 rounded-lg text-sm transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-red-500/25 flex items-center space-x-2"
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
                {filteredKeys.length === 0 && (
                  <div className="p-12 text-center text-slate-400">
                    <svg className="w-20 h-20 mx-auto mb-6 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="15 7a2 2 0 012 2m0 0a2 2 0 012 2 2 2 0 01-2 2m-2-2h.01M9 12h.01M12 17h.01M7 7l2-2M7 7l-2 2M7 7v6a2 2 0 002 2h6a2 2 0 002-2V7z"/>
                    </svg>
                    <p className="text-2xl font-bold mb-2">
                      {searchTerm ? "Arama sonucu bulunamadı" : "Henüz delivery key oluşturulmamış"}
                    </p>
                    <p className="text-lg">
                      {searchTerm ? `"${searchTerm}" için sonuç bulunamadı` : "Yukarıdaki formu kullanarak key ekleyebilirsiniz"}
                    </p>
                  </div>
                )}
              </div>
            </GlassCard>
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