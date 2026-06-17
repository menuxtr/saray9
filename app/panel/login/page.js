'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, User, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [logoUrl, setLogoUrl] = useState('/menux500.png');



  // If already logged in, redirect straight to dashboard
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/check');
        const data = await res.json();
        if (data.authenticated) {
          router.push('/panel/dashboard');
        }
      } catch (err) {
        console.error(err);
      }
    }
    checkAuth();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push('/panel/dashboard');
      } else {
        setError(data.error || 'Giriş yapılamadı. Tekrar deneyin.');
      }
    } catch (err) {
      setError('Bağlantı hatası oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-950 px-4 relative overflow-hidden">
      
      {/* Background Ornaments */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-red-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-red-700/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Login Card */}
      <div className="relative w-full max-w-md bg-neutral-900/40 backdrop-blur-xl border border-neutral-800 rounded-3xl p-8 shadow-2xl z-10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={logoUrl} 
              alt="MenuX Logo" 
              className="h-16 max-w-[180px] object-contain"
              onError={() => setLogoUrl('/menux500.png')} 
            />
          </div>
          <h2 className="text-xl font-bold text-white tracking-wide">
            Yönetici Girişi
          </h2>
          <p className="text-xs text-neutral-400 mt-1.5">
            MenuX yönetim paneline erişim için bilgilerinizi girin.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2.5 p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-semibold">
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Username Input */}
          <div>
            <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
              Kullanıcı Adı
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Örn: admin"
                required
                className="w-full pl-11 pr-4 py-3 bg-neutral-950 border border-neutral-800 focus:border-red-600 rounded-2xl text-white placeholder-neutral-600 text-sm focus:outline-none focus:ring-2 focus:ring-red-600/10 transition-all duration-200"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
              Şifre
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-11 pr-12 py-3 bg-neutral-950 border border-neutral-800 focus:border-red-600 rounded-2xl text-white placeholder-neutral-600 text-sm focus:outline-none focus:ring-2 focus:ring-red-600/10 transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors duration-200"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-600/40 text-white font-bold text-sm rounded-2xl transition-all duration-300 shadow-lg shadow-red-600/10 active:scale-98"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              'Giriş Yap'
            )}
          </button>
          
        </form>

        <div className="text-center mt-6">
          <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-semibold">
            <span className="font-armstrong font-bold">MenuX</span> v1.0
          </p>
        </div>

      </div>
    </div>
  );
}
