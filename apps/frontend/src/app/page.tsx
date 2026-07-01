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

  const setCookie = (name: string, value: string) => {
    document.cookie = `${name}=${value}; path=/; max-age=604800`;
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

      // ❗ ВАЖНО: middleware читает ТОЛЬКО cookies
      setCookie('token', data.token);
      setCookie('user', JSON.stringify(data.user));

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

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
        <h1 className="text-2xl font-bold mb-2">Вход</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Телефон"
            required
          />

          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Пароль"
            required
          />

          <button disabled={loading}>
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>

        <Link href="/auth/register">Регистрация</Link>
      </div>
    </div>
  );
}