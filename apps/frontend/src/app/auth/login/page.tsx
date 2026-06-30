'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Ошибка входа');
      }

      const data = await response.json();

      // ✅ ВАЖНО: теперь используем cookies (middleware их читает)
      document.cookie = `token=${data.token}; path=/; max-age=604800`;

      document.cookie = `user=${encodeURIComponent(
        JSON.stringify(data.user)
      )}; path=/; max-age=604800`;

      router.push('/');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-custom max-w-md py-12">
      <div className="bg-white rounded-xl p-8 border border-[#E5E7EB]">
        <h1 className="text-2xl font-bold text-[#111827] mb-2">Вход</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="tel"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            placeholder="Телефон"
            className="input-field"
          />

          <input
            type="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            placeholder="Пароль"
            className="input-field"
          />

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          Нет аккаунта? <Link href="/auth/register">Регистрация</Link>
        </div>
      </div>
    </div>
  );
}