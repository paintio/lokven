'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Home,
  User,
  LogOut,
  Plus,
  Shield,
  Lock,
  Menu,
  X,
  LogIn,
  UserPlus,
  FileText,
} from 'lucide-react';

export function Navigation() {
  const { user, isAuthenticated, loading, logout, refreshUser } = useAuth();
  const router = useRouter();
  const [showUsbModal, setShowUsbModal] = useState(false);
  const [usbToken, setUsbToken] = useState('');
  const [usbError, setUsbError] = useState('');
  const [usbLoading, setUsbLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // При монтировании обновляем состояние
  useEffect(() => {
    refreshUser();
  }, []);

  // 👈 Слушаем изменения localStorage ТОЛЬКО для других вкладок
  useEffect(() => {
    const handleStorageChange = () => {
      refreshUser();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/');
    setIsMobileMenuOpen(false);
  };

  const handleAdminAccess = async () => {
    if (user?.role !== 'admin' && user?.role !== 'moderator') {
      router.push('/');
      return;
    }
    setShowUsbModal(true);
    setIsMobileMenuOpen(false);
  };

  const verifyUsbToken = async () => {
    if (!usbToken.trim()) {
      setUsbError('Введите USB-токен');
      return;
    }

    setUsbLoading(true);
    setUsbError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/usb-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: usbToken }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Неверный USB-токен');
      }

      const data = await response.json();

      document.cookie = `token=${data.token}; path=/; max-age=604800`;
      document.cookie = `user=${encodeURIComponent(JSON.stringify({ ...user, type: 'usb' }))}; path=/; max-age=604800`;
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({ ...user, type: 'usb' }));

      setShowUsbModal(false);
      setUsbToken('');
      refreshUser();
      router.push('/admin');
    } catch (error: any) {
      setUsbError(error.message || 'Ошибка проверки USB-токена');
    } finally {
      setUsbLoading(false);
    }
  };

  if (loading) {
    return (
      <nav className="flex items-center justify-between p-4 bg-white border-b border-[#E5E7EB]">
        <div className="text-2xl font-bold text-[#6366F1]">Lokven</div>
        <div className="text-[#9CA3AF]">Загрузка...</div>
      </nav>
    );
  }

  return (
    <>
      <nav className="flex items-center justify-between p-4 bg-white border-b border-[#E5E7EB] sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-[#6366F1]">
          <Home className="w-6 h-6" />
          <span>Lokven</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/listings" className="flex items-center gap-1 text-[#4B5563] hover:text-[#6366F1] transition-colors text-sm font-medium">
            <FileText className="w-4 h-4" />
            Объявления
          </Link>

          {isAuthenticated ? (
            <>
              <Link href="/listings/create" className="flex items-center gap-1 text-[#4B5563] hover:text-[#6366F1] transition-colors text-sm font-medium">
                <Plus className="w-4 h-4" />
                Подать
              </Link>
              {(user?.role === 'admin' || user?.role === 'moderator') && (
                <button onClick={handleAdminAccess} className="flex items-center gap-1 text-[#4B5563] hover:text-[#6366F1] transition-colors text-sm font-medium">
                  <Shield className="w-4 h-4" />
                  Админка
                </button>
              )}
              <Link href="/profile" className="flex items-center gap-1 text-[#4B5563] hover:text-[#6366F1] transition-colors text-sm font-medium">
                <User className="w-4 h-4" />
                {user?.name || 'Профиль'}
              </Link>
              <button onClick={handleLogout} className="flex items-center gap-1 text-red-500 hover:text-red-700 transition-colors text-sm font-medium">
                <LogOut className="w-4 h-4" />
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="flex items-center gap-1 text-[#4B5563] hover:text-[#6366F1] transition-colors text-sm font-medium">
                <LogIn className="w-4 h-4" />
                Войти
              </Link>
              <Link href="/auth/register" className="flex items-center gap-1 px-4 py-2 bg-[#6366F1] text-white rounded-lg hover:bg-[#4F46E5] transition-colors text-sm font-medium">
                <UserPlus className="w-4 h-4" />
                Регистрация
              </Link>
            </>
          )}
        </div>

        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 rounded-lg hover:bg-[#F3F4F6] transition-colors">
          {isMobileMenuOpen ? <X className="w-6 h-6 text-[#4B5563]" /> : <Menu className="w-6 h-6 text-[#4B5563]" />}
        </button>
      </nav>

      {/* Мобильное меню */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#E5E7EB] p-4 space-y-3">
          <Link href="/listings" className="flex items-center gap-2 text-[#4B5563] hover:text-[#6366F1] transition-colors text-sm font-medium" onClick={() => setIsMobileMenuOpen(false)}>
            <FileText className="w-4 h-4" />
            Объявления
          </Link>
          {isAuthenticated ? (
            <>
              <Link href="/listings/create" className="flex items-center gap-2 text-[#4B5563] hover:text-[#6366F1] transition-colors text-sm font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                <Plus className="w-4 h-4" />
                Подать
              </Link>
              {(user?.role === 'admin' || user?.role === 'moderator') && (
                <button onClick={handleAdminAccess} className="flex items-center gap-2 text-[#4B5563] hover:text-[#6366F1] transition-colors text-sm font-medium w-full">
                  <Shield className="w-4 h-4" />
                  Админка
                </button>
              )}
              <Link href="/profile" className="flex items-center gap-2 text-[#4B5563] hover:text-[#6366F1] transition-colors text-sm font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                <User className="w-4 h-4" />
                {user?.name || 'Профиль'}
              </Link>
              <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 hover:text-red-700 transition-colors text-sm font-medium w-full">
                <LogOut className="w-4 h-4" />
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="flex items-center gap-2 text-[#4B5563] hover:text-[#6366F1] transition-colors text-sm font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                <LogIn className="w-4 h-4" />
                Войти
              </Link>
              <Link href="/auth/register" className="flex items-center gap-2 px-4 py-2 bg-[#6366F1] text-white rounded-lg hover:bg-[#4F46E5] transition-colors text-sm font-medium text-center" onClick={() => setIsMobileMenuOpen(false)}>
                <UserPlus className="w-4 h-4" />
                Регистрация
              </Link>
            </>
          )}
        </div>
      )}

      {/* Модалка USB-токена */}
      {showUsbModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-2">
              <Lock className="w-6 h-6 text-[#6366F1]" />
              <h2 className="text-2xl font-bold text-[#111827]">Требуется USB-токен</h2>
            </div>
            <p className="text-[#6B7280] text-sm mb-6">Для доступа к админ-панели вставьте USB-носитель и введите токен</p>
            {usbError && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{usbError}</div>}
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#6B7280] mb-1">USB-токен</label>
              <input type="text" value={usbToken} onChange={(e) => setUsbToken(e.target.value)} placeholder="Введите USB-токен" className="input-field w-full" onKeyDown={(e) => e.key === 'Enter' && verifyUsbToken()} autoFocus />
              <p className="text-xs text-[#9CA3AF] mt-1">Вставьте USB-носитель с токеном или введите вручную</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setShowUsbModal(false); setUsbToken(''); setUsbError(''); }} className="btn-secondary flex-1">Отмена</button>
              <button onClick={verifyUsbToken} disabled={usbLoading} className="btn-primary flex-1">{usbLoading ? 'Проверка...' : 'Подтвердить'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}