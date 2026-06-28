'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProfileSidebar from '@/components/profile/ProfileSidebar';
import StarRating from '@/components/reviews/StarRating';

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
  _count: {
    listings: number;
    ordersAsBuyer: number;
    ordersAsSeller: number;
    favorites: number;
  };
  listings: any[];
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState({
    totalListings: 0,
    totalOrders: 0,
    totalFavorites: 0,
    totalReviews: 0,
    averageRating: 0,
    balance: 0,
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
      setIsAdmin(data.role === 'admin');
      
      setStats({
        totalListings: data._count.listings || 0,
        totalOrders: (data._count.ordersAsBuyer || 0) + (data._count.ordersAsSeller || 0),
        totalFavorites: data._count.favorites || 0,
        totalReviews: 0,
        averageRating: 0,
        balance: 1500, // временно
      });
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
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

  const getRoleLabel = () => {
    if (user.role === 'admin') return 'Администратор';
    if (user.role === 'employer') return 'Работодатель';
    if (user.role === 'performer') return 'Исполнитель';
    if (user.isSeller) return 'Продавец';
    return 'Покупатель';
  };

  const getRoleBadge = () => {
    if (user.role === 'admin') {
      return <span className="tag bg-purple-100 text-purple-700">Администратор</span>;
    }
    if (user.role === 'employer') {
      return <span className="tag bg-blue-100 text-blue-700">Работодатель</span>;
    }
    if (user.role === 'performer') {
      return <span className="tag bg-green-100 text-green-700">Исполнитель</span>;
    }
    if (user.isSeller) {
      return <span className={`tag ${user.sellerStatus === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
        {user.sellerStatus === 'approved' ? '✅ Продавец' : '⏳ На модерации'}
      </span>;
    }
    return <span className="tag bg-gray-100 text-gray-700">Покупатель</span>;
  };

  const statCards = [
    { label: 'Объявлений', value: stats.totalListings, icon: '📋' },
    { label: 'Заказов', value: stats.totalOrders, icon: '📦' },
    { label: 'В избранном', value: stats.totalFavorites, icon: '❤️' },
    { label: 'Отзывов', value: stats.totalReviews, icon: '⭐' },
    { label: 'Баланс', value: `${stats.balance} ₽`, icon: '💰' },
  ];

  return (
    <div className="container-custom py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#111827]">Личный кабинет</h1>
        <button onClick={handleLogout} className="btn-secondary text-sm">
          Выйти
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <ProfileSidebar role={user.role} isSeller={user.isSeller} />

        <div className="flex-1 space-y-6">
          {/* Карточка профиля с аватаром */}
          <div className="bg-white rounded-xl p-6 border border-[#E5E7EB]">
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 bg-[#F3F4F6] rounded-full flex items-center justify-center text-3xl flex-shrink-0 overflow-hidden">
                {user.avatar ? (
                  <img src={user.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span className="text-4xl">{user.name?.[0] || '👤'}</span>
                )}
                <button className="absolute bottom-0 right-0 bg-[#3B82F6] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-[#2563EB] transition-colors">
                  📷
                </button>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-xl font-semibold text-[#111827]">
                    {user.name || 'Без имени'}
                  </h2>
                  {getRoleBadge()}
                </div>
                <p className="text-sm text-[#6B7280] mt-1">{user.phone}</p>
                {user.email && (
                  <p className="text-sm text-[#6B7280]">{user.email}</p>
                )}
                {user.companyName && (
                  <p className="text-sm font-medium text-[#111827] mt-1">
                    {user.companyName}
                  </p>
                )}
              </div>
              <Link href="/profile/settings" className="btn-secondary text-sm">
                ✏️ Редактировать
              </Link>
            </div>
          </div>

          {/* Статистика */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {statCards.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl p-4 border border-[#E5E7EB] text-center hover:shadow-md transition-shadow">
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-xl font-bold text-[#111827]">{stat.value}</div>
                <div className="text-xs text-[#6B7280]">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Быстрые действия */}
          <div className="bg-white rounded-xl p-6 border border-[#E5E7EB]">
            <h3 className="font-semibold text-[#111827] mb-4">⚡ Быстрые действия</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Link href="/listings/create" className="btn-primary text-center text-sm py-2">
                📝 Создать объявление
              </Link>
              <Link href="/profile/listings" className="btn-secondary text-center text-sm py-2">
                📋 Мои объявления
              </Link>
              <Link href="/profile/orders" className="btn-secondary text-center text-sm py-2">
                📦 Заказы
              </Link>
              <Link href="/profile/balance" className="btn-secondary text-center text-sm py-2">
                💰 Баланс
              </Link>
            </div>
          </div>

          {/* Последние объявления */}
          {user.listings && user.listings.length > 0 && (
            <div className="bg-white rounded-xl p-6 border border-[#E5E7EB]">
              <h3 className="font-semibold text-[#111827] mb-4">📋 Мои объявления</h3>
              <div className="space-y-3">
                {user.listings.slice(0, 3).map((listing) => (
                  <div key={listing.id} className="flex items-center gap-4 p-3 border border-[#F3F4F6] rounded-lg hover:bg-[#F9FAFB] transition-colors">
                    {listing.images && listing.images.length > 0 ? (
                      <img src={listing.images[0].url} alt="" className="w-16 h-16 object-cover rounded-lg" />
                    ) : (
                      <div className="w-16 h-16 bg-[#F3F4F6] rounded-lg flex items-center justify-center text-2xl">📦</div>
                    )}
                    <div className="flex-1">
                      <Link href={`/listings/${listing.id}`} className="font-medium text-[#111827] hover:text-[#3B82F6]">
                        {listing.title}
                      </Link>
                      <p className="text-xs text-[#6B7280]">
                        {listing.price.toLocaleString('ru-RU')} ₽ • {listing.views} просмотров
                      </p>
                    </div>
                    <span className={`tag ${listing.status === 'active' ? '' : 'tag-gray'}`}>
                      {listing.status === 'active' ? '✅ Активно' : 
                       listing.status === 'pending' ? '⏳ На модерации' : 
                       listing.status === 'sold' ? '💸 Продано' : '📦 В архиве'}
                    </span>
                  </div>
                ))}
              </div>
              {user.listings.length > 3 && (
                <Link href="/profile/listings" className="text-sm text-[#3B82F6] hover:underline mt-3 inline-block">
                  Смотреть все ({user.listings.length})
                </Link>
              )}
            </div>
          )}

          {/* Ссылки на другие разделы */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link href="/profile/orders" className="bg-white rounded-xl p-4 border border-[#E5E7EB] hover:shadow-md transition-all text-center">
              <div className="text-2xl mb-1">📦</div>
              <div className="font-medium text-[#111827]">Мои заказы</div>
              <div className="text-xs text-[#6B7280]">История покупок</div>
            </Link>
            <Link href="/profile/favorites" className="bg-white rounded-xl p-4 border border-[#E5E7EB] hover:shadow-md transition-all text-center">
              <div className="text-2xl mb-1">❤️</div>
              <div className="font-medium text-[#111827]">Избранное</div>
              <div className="text-xs text-[#6B7280]">Сохраненные товары</div>
            </Link>
            <Link href="/profile/balance" className="bg-white rounded-xl p-4 border border-[#E5E7EB] hover:shadow-md transition-all text-center">
              <div className="text-2xl mb-1">💰</div>
              <div className="font-medium text-[#111827]">Баланс</div>
              <div className="text-xs text-[#6B7280]">Пополнить и вывести</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
