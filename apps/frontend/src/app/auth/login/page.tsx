'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser, user } = useAuth();
  const redirect = searchParams.get('redirect') || '/';
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
  });

  // Если уже авторизован — редирект
  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

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

      // 👈 ОБНОВЛЯЕМ СОСТОЯНИЕ
      refreshUser();

      // 👈 ФОРСИРУЕМ РЕДИРЕКТ
      window.location.href = redirect;
    } catch (error: any) {
      setError(error.message || 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  return (
    // ... остальной JSX без изменений
  );
}