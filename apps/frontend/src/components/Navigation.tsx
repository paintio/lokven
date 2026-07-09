'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function Navigation() {
  const { user, isAuthenticated, loading, logout, refreshUser } = useAuth();
  const router = useRouter();
  const [showUsbModal, setShowUsbModal] = useState(false);
  const [usbToken, setUsbToken] = useState('');
  const [usbError, setUsbError] = useState('');
  const [usbLoading, setUsbLoading] = useState(false);

  useEffect(() => {
    refreshUser();
  }, []);

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
  };

  const handleAdminAccess = async () => {
    if (user?.role !== 'admin' && user?.role !== 'moderator') {
      router.push('/');
      return;
    }

    setShowUsbModal(true);
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
      <nav className="flex items-center justify-between p-4 bg-white border-b border-[#E5E7EB]">
        <Link href="/" className="text-2xl font-bold text-[#6366F1]">
          Lokven
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/listings" className="text-[#4B5563] hover:text-[#6366F1] transition-colors">
            Объявления
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                href="/listings/create"
                className="text-[#4B5563] hover:text-[#6366F1] transition-colors"
              >
                Подать
              </Link>
              
              {(user?.role === 'admin' || user?.role === 'moderator') && (
                <button
                  onClick={handleAdminAccess}
                  className="text-[#4B5563] hover:text-[#6366F1] transition-colors"
                >
                  Админка
                </button>
              )}
              
              <Link
                href="/profile"
                className="text-[#4B5563] hover:text-[#6366F1] transition-colors"
              >
                {user?.name || 'Профиль'}
              </Link>
              <button
                onClick={handleLogout}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-[#4B5563] hover:text-[#6366F1] transition-colors"
              >
                Войти
              </Link>
              <Link
                href="/auth/register"
                className="px-4 py-2 bg-[#6366F1] text-white rounded-lg hover:bg-[#4F46E5] transition-colors"
              >
                Регистрация
              </Link>
            </>
          )}
        </div>
      </nav>

      {showUsbModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-[#111827] mb-2">🔐 Требуется USB-токен</h2>
            <p className="text-[#6B7280] text-sm mb-6">
              Для доступа к админ-панели вставьте USB-носитель и введите токен
            </p>

            {usbError && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                {usbError}
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-[#6B7280] mb-1">
                USB-токен
              </label>
              <input
                type="text"
                value={usbToken}
                onChange={(e) => setUsbToken(e.target.value)}
                placeholder="Введите USB-токен"
                className="input-field w-full"
                onKeyDown={(e) => e.key === 'Enter' && verifyUsbToken()}
                autoFocus
              />
              <p className="text-xs text-[#9CA3AF] mt-1">
                Вставьте USB-носитель с токеном или введите вручную
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowUsbModal(false);
                  setUsbToken('');
                  setUsbError('');
                }}
                className="btn-secondary flex-1"
              >
                Отмена
              </button>
              <button
                onClick={verifyUsbToken}
                disabled={usbLoading}
                className="btn-primary flex-1"
              >
                {usbLoading ? 'Проверка...' : 'Подтвердить'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}