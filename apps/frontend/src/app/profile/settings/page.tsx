'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import ProfileSidebar from '@/components/profile/ProfileSidebar';
import { Camera, User, Loader2 } from 'lucide-react';

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
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  // 👈 ЗАГРУЗКА АВАТАРА
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Проверка размера (максимум 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Файл слишком большой. Максимум 5MB.');
      return;
    }

    // Проверка типа
    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите изображение.');
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/uploads/avatar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Ошибка загрузки аватара');
      }

      const data = await response.json();
      
      // Обновляем профиль с новым аватаром
      const updateResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ avatar: data.url }),
      });

      if (updateResponse.ok) {
        setUser(prev => prev ? { ...prev, avatar: data.url } : null);
        alert('Аватар обновлён!');
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert('Ошибка загрузки аватара');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
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

    if (passwordData.newPassword.length < 6) {
      alert('Пароль должен быть не менее 6 символов');
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
        const error = await response.json();
        alert(error.message || 'Неверный текущий пароль');
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
      <h1 className="text-2xl font-bold text-[#111827] mb-6 flex items-center gap-2">
        <span>Настройки</span>
      </h1>

      <div className="flex flex-col lg:flex-row gap-6">
        <ProfileSidebar role={user.role} isSeller={user.isSeller} />

        <div className="flex-1 space-y-6">
          {/* Аватар */}
          <div className="bg-white rounded-xl p-6 border border-[#E5E7EB]">
            <h2 className="text-lg font-semibold text-[#111827] mb-4">Аватар</h2>
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 bg-[#F3F4F6] rounded-full flex items-center justify-center overflow-hidden">
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt="Аватар" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <User className="w-12 h-12 text-[#6B7280]" />
                  )}
                </div>
                {uploading && (
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  </div>
                )}
              </div>
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  id="avatar-upload"
                  disabled={uploading}
                />
                <label
                  htmlFor="avatar-upload"
                  className={`btn-secondary flex items-center gap-2 cursor-pointer ${
                    uploading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <Camera className="w-4 h-4" />
                  {uploading ? 'Загрузка...' : 'Загрузить фото'}
                </label>
                <p className="text-xs text-[#9CA3AF] mt-1">
                  JPG, PNG, GIF. Максимум 5MB
                </p>
              </div>
            </div>
          </div>

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