'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth'; // 👈 ДОБАВЛЯЕМ

export default function LoginPage() {
  const router = useRouter();
  const { refreshUser } = useAuth(); // 👈 ДОБАВЛЯЕМ
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const setCookie = (name: string, value: string) => {
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=604800; SameSite=Lax`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            phone: formData.phone, 
            password: formData.password 
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Ошибка входа');
      }

      const data = await response.json();

      setCookie('token', data.token);
      setCookie('user', JSON.stringify(data.user));

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // 👈 ОБНОВЛЯЕМ СОСТОЯНИЕ ХУКА
      refreshUser();

      router.push('/');
    } catch (error: any) {
      setError(error.message || 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-custom max-w-md py-12">
      <div className="bg-white rounded-xl p-8 border border-[#E5E7EB]">
        <h1 className="text-2xl font-bold text-[#111827] mb-2">Вход</h1>
        <p className="text-[#6B7280] text-sm mb-6">
          Войдите, чтобы размещать объявления
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#6B7280] mb-1">
              Телефон
            </label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="+7 (XXX) XXX-XX-XX"
              className="input-field w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#6B7280] mb-1">
              Пароль
            </label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="input-field w-full"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-[#6B7280]">
          Нет аккаунта?{' '}
          <Link href="/auth/register" className="text-[#6366F1] hover:underline">
            Зарегистрироваться
          </Link>
        </div>
      </div>
    </div>
  );
}