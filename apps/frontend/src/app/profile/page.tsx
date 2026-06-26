'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import StarRating from '@/components/reviews/StarRating';
import ReviewList from '@/components/reviews/ReviewList';

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
  const [activeTab, setActiveTab] = useState('profile');

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
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Unauthorized');
      }

      const data = await response.json();
      setUser(data);
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

  const handleDeleteListing = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить это объявление?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/listings/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const token = localStorage.getItem('token');
        fetchProfile(token!);
      }
    } catch (error) {
      console.error('Error deleting listing:', error);
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

  const tabs = [
    { id: 'profile', label: 'Профиль' },
    { id: 'listings', label: 'Мои объявления' },
    { id: 'orders', label: 'Заказы' },
    { id: 'favorites', label: 'Избранное' },
    { id: 'reviews', label: 'Отзывы' },
  ];

  return (
    <div className="container-custom py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#111827]">Личный кабинет</h1>
        <button onClick={handleLogout} className="btn-secondary">
          Выйти
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-4">
            <div className="text-center mb-4">
              <div className="w-20 h-20 bg-[#F3F4F6] rounded-full mx-auto flex items-center justify-center text-3xl">
                {user.avatar ? (
                  <img src={user.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                ) : (
                  user.name?.[0] || '👤'
                )}
              </div>
              <h3 className="font-semibold mt-2">{user.name || 'Без имени'}</h3>
              <p className="text-xs text-[#6B7280]">{user.phone}</p>
              {user.isSeller && (
                <span className={`tag text-xs mt-1 ${user.sellerStatus === 'approved' ? '' : 'tag-gray'}`}>
                  {user.sellerStatus === 'approved' ? '✅ Продавец' : '⏳ На модерации'}
                </span>
              )}
            </div>

            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-[#F3F4F6] text-[#111827] font-medium'
                      : 'text-[#6B7280] hover:bg-[#F9FAFB]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 mt-4">
            <div className="grid grid-cols-2 gap-2 text-center">
              <div>
                <div className="text-xl font-bold text-[#111827]">{user._count.listings}</div>
                <div className="text-xs text-[#6B7280]">Объявлений</div>
              </div>
              <div>
                <div className="text-xl font-bold text-[#111827]">{user._count.ordersAsBuyer + user._count.ordersAsSeller}</div>
                <div className="text-xs text-[#6B7280]">Заказов</div>
              </div>
              <div>
                <div className="text-xl font-bold text-[#111827]">{user._count.favorites}</div>
                <div className="text-xs text-[#6B7280]">Избранное</div>
              </div>
              <div>
                <div className="text-xl font-bold text-[#111827]">{user.role}</div>
                <div className="text-xs text-[#6B7280]">Роль</div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          {activeTab === 'profile' && (
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-[#111827]">Профиль</h2>
                <Link href="/profile/edit" className="btn-primary text-sm">
                  Редактировать
                </Link>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-[#F3F4F6]">
                  <span className="text-sm text-[#6B7280]">Имя</span>
                  <span className="text-sm font-medium">{user.name || 'Не указано'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#F3F4F6]">
                  <span className="text-sm text-[#6B7280]">Телефон</span>
                  <span className="text-sm font-medium">{user.phone}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#F3F4F6]">
                  <span className="text-sm text-[#6B7280]">Email</span>
                  <span className="text-sm font-medium">{user.email || 'Не указан'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#F3F4F6]">
                  <span className="text-sm text-[#6B7280]">Роль</span>
                  <span className="text-sm font-medium">
                    {user.role === 'admin' ? 'Администратор' : 
                     user.role === 'moderator' ? 'Модератор' : 
                     user.isSeller ? 'Продавец' : 'Покупатель'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'listings' && (
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-[#111827]">Мои объявления</h2>
                <Link href="/listings/create" className="btn-primary text-sm">
                  + Создать
                </Link>
              </div>
              {user.listings.length === 0 ? (
                <p className="text-[#6B7280] text-sm text-center py-8">У вас пока нет объявлений</p>
              ) : (
                <div className="space-y-3">
                  {user.listings.map((listing) => (
                    <div key={listing.id} className="flex items-center gap-4 p-3 border border-[#F3F4F6] rounded-lg hover:bg-[#F9FAFB] transition-colors">
                      {listing.images && listing.images.length > 0 ? (
                        <img src={listing.images[0].url} alt="" className="w-16 h-16 object-cover rounded-lg" />
                      ) : (
                        <div className="w-16 h-16 bg-[#F3F4F6] rounded-lg flex items-center justify-center text-2xl">📦</div>
                      )}
                      <div className="flex-1">
                        <Link href={`/listings/${listing.id}`} className="font-medium text-[#111827] hover:text-[#3B82F6] transition-colors">
                          {listing.title}
                        </Link>
                        <p className="text-xs text-[#6B7280]">
                          {listing.price.toLocaleString('ru-RU')} ₽ • {listing.views} просмотров
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`tag ${listing.status === 'active' ? '' : 'tag-gray'}`}>
                          {listing.status === 'active' ? 'Активно' : 
                           listing.status === 'pending' ? 'На модерации' : 
                           listing.status === 'sold' ? 'Продано' : 'В архиве'}
                        </span>
                        {listing.status === 'active' && (
                          <Link
                            href={`/listings/${listing.id}/edit`}
                            className="text-xs text-[#3B82F6] hover:underline"
                          >
                            ✏️ Редактировать
                          </Link>
                        )}
                        <button
                          onClick={() => handleDeleteListing(listing.id)}
                          className="text-xs text-red-500 hover:underline"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
              <h2 className="font-semibold text-[#111827] mb-4">Заказы</h2>
              <p className="text-[#6B7280] text-sm text-center py-8">История заказов будет здесь</p>
            </div>
          )}

          {activeTab === 'favorites' && (
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
              <h2 className="font-semibold text-[#111827] mb-4">Избранное</h2>
              <p className="text-[#6B7280] text-sm text-center py-8">Здесь будут избранные объявления</p>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
              <h2 className="font-semibold text-[#111827] mb-4">⭐ Отзывы</h2>
              {user.isSeller ? (
                <ReviewList sellerId={user.id} />
              ) : (
                <p className="text-[#6B7280] text-sm text-center py-8">
                  Вы пока не можете оставлять отзывы<br />
                  <span className="text-xs text-[#9CA3AF]">Отзывы доступны после завершения заказов</span>
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
