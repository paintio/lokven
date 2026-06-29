'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [flashDriveDetected, setFlashDriveDetected] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkFlashDrive();
  }, []);

  const checkFlashDrive = async () => {
    try {
      const response = await fetch('/api/check-flash');
      const data = await response.json();
      setFlashDriveDetected(data.detected);
    } catch {
      setFlashDriveDetected(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const loginResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password }),
      });

      if (!loginResponse.ok) {
        throw new Error('Неверный логин или пароль');
      }

      const loginData = await loginResponse.json();
      
      if (loginData.user.role !== 'admin') {
        throw new Error('У вас нет прав доступа');
      }

      const tokenResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/generate-admin-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${loginData.token}`,
        },
        body: JSON.stringify({ userId: loginData.user.id }),
      });

      if (!tokenResponse.ok) {
        throw new Error('Не удалось записать токен на флешку');
      }

      const tokenData = await tokenResponse.json();
      
      // Сохраняем токен в cookies
      document.cookie = `adminToken=${tokenData.token}; path=/; max-age=${7 * 24 * 60 * 60}`;
      localStorage.setItem('adminToken', tokenData.token);
      
      router.push('/admin');
      
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA]">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full">
        <div className="text-center mb-6">
          <div className="flex justify-center">
            <img src="/logo.svg" alt="Локвен" className="h-16 w-auto" />
          </div>
          <h1 className="text-2xl font-bold mt-4">🔐 Административный доступ</h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Требуется флешка для входа
          </p>
        </div>

        <div className={`mb-4 p-3 rounded-lg text-center text-sm ${
          flashDriveDetected 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
        }`}>
          {flashDriveDetected 
            ? '✅ Флешка обнаружена' 
            : '⚠️ Вставьте флешку с ключом доступа'}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#6B7280] mb-1">
              Телефон
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="input-field"
              placeholder="+7 999 123-45-67"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#6B7280] mb-1">
              Пароль
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="Введите пароль"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || !flashDriveDetected}
            className="btn-primary w-full disabled:opacity-50"
          >
            {loading ? 'Проверка...' : 'Войти с флешкой'}
          </button>
        </form>

        <div className="mt-4 text-center text-xs text-[#9CA3AF]">
          <p>Токен действителен 7 дней</p>
          <p className="mt-1">После каждого входа обновляется</p>
        </div>
      </div>
    </div>
  );
}