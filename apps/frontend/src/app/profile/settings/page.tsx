'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProfileSidebar from '@/components/profile/ProfileSidebar';

interface User {
  id: string;
  phone: string;
  email: string | null;
  name: string | null;
  avatar: string | null;
  role: string;
  isSeller: boolean;
  sellerStatus: string;
  inn: string | null;
  companyName: string | null;
}

export default function ProfileSettings() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    fetchProfile(token);
  }, []);

  const fetchProfile = async (token: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Unauthorized');
      }

      const data = await response.json();
      setUser(data);
      setFormData({
        name: data.name || '',
        email: data.email || '',
      });
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Профиль обновлён');
        const token = localStorage.getItem('token');
        fetchProfile(token!);
      } else {
        alert('Ошибка обновления');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Пароли не совпадают');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (response.ok) {
        alert('Пароль изменён');
        setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        alert('Неверный текущий пароль');
      }
    } catch (error) {
      console.error('Error changing password:', error);
    }
  };

  if (loading) {
    return (
      <div className="container-custom py-12 text-center text-[#9CA3AF]">
        Загрузка...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container-custom py-8">
      <h1 className="text-2xl font-bold text-[#111827] mb-6">⚙️ Настройки</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        <ProfileSidebar role={user.role} isSeller={user.isSeller} />

        <div className="flex-1 space-y-6">
          {/* Личные данные */}
          <div className="bg-white rounded-xl p-6 border border-[#E5E7EB]">
            <h2 className="text-lg font-semibold text-[#111827] mb-4">Личные данные</h2>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#6B7280] mb-1">Имя</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  placeholder="Ваше имя"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#6B7280] mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field"
                  placeholder="example@mail.ru"
                />
              </div>
              <button type="submit" className="btn-primary">
                Сохранить изменения
              </button>
            </form>
          </div>

          {/* Смена пароля */}
          <div className="bg-white rounded-xl p-6 border border-[#E5E7EB]">
            <h2 className="text-lg font-semibold text-[#111827] mb-4">Смена пароля</h2>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#6B7280] mb-1">Текущий пароль</label>
                <input
                  type="password"
                  value={passwordData.oldPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                  className="input-field"
                  placeholder="Введите текущий пароль"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#6B7280] mb-1">Новый пароль</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="input-field"
                  placeholder="Введите новый пароль"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#6B7280] mb-1">Подтверждение пароля</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="input-field"
                  placeholder="Подтвердите новый пароль"
                />
              </div>
              <button type="submit" className="btn-primary">
                Сменить пароль
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
