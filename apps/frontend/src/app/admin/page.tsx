'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  Star,
  Settings,
  Key,
  Download,
  RefreshCw,
  ClipboardList,
  User,
  Clock,
  CheckCircle,
  XCircle,
  Coins,
  TrendingUp,
  Plus,
  FileText,
} from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  totalListings: number;
  totalOrders: number;
  totalRevenue: number;
  pendingListings: number;
  activeListings: number;
  newUsersToday: number;
  newListingsToday: number;
  totalReviews: number;
  averageRating: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentListings, setRecentListings] = useState<any[]>([]);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);

  useEffect(() => {
    fetchStats();
    fetchRecentData();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/stats`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [listingsRes, usersRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/listings?limit=5`, {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users?limit=5`, {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
      ]);
      
      const listingsData = await listingsRes.json();
      const usersData = await usersRes.json();
      
      setRecentListings(listingsData.slice(0, 5));
      setRecentUsers(usersData.slice(0, 5));
    } catch (error) {
      console.error('Error fetching recent data:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[#9CA3AF]">Загрузка...</div>
      </div>
    );
  }

  const statCards = [
    { 
      label: 'Всего пользователей', 
      value: stats?.totalUsers || 0, 
      icon: Users,
      change: stats?.newUsersToday || 0,
      changeLabel: 'новых сегодня',
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    { 
      label: 'Всего объявлений', 
      value: stats?.totalListings || 0, 
      icon: Package,
      change: stats?.newListingsToday || 0,
      changeLabel: 'новых сегодня',
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
    { 
      label: 'На модерации', 
      value: stats?.pendingListings || 0, 
      icon: Clock,
      change: 'ожидают проверки',
      changeLabel: '',
      color: 'text-yellow-600',
      bg: 'bg-yellow-50'
    },
    { 
      label: 'Всего заказов', 
      value: stats?.totalOrders || 0, 
      icon: ShoppingCart,
      change: '',
      changeLabel: '',
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    { 
      label: 'Выручка', 
      value: `${(stats?.totalRevenue || 0).toLocaleString('ru-RU')} ₽`, 
      icon: TrendingUp,
      change: '',
      changeLabel: '',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    },
    { 
      label: 'Отзывы', 
      value: stats?.totalReviews || 0, 
      icon: Star,
      change: stats?.averageRating ? `${stats.averageRating.toFixed(1)} ★` : 'Нет',
      changeLabel: 'средний рейтинг',
      color: 'text-amber-600',
      bg: 'bg-amber-50'
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#111827] flex items-center gap-2">
          <LayoutDashboard className="w-6 h-6 text-[#6366F1]" />
          Дашборд
        </h1>
        <div className="flex gap-3">
          <button className="btn-secondary text-sm flex items-center gap-1">
            <Download className="w-4 h-4" />
            Экспорт
          </button>
          <button className="btn-secondary text-sm flex items-center gap-1">
            <RefreshCw className="w-4 h-4" />
            Обновить
          </button>
        </div>
      </div>
      
      {/* Статистика */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-4 border border-[#E5E7EB] hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <Icon className="w-5 h-5 text-[#6B7280]" />
                {stat.change && (
                  <span className={`text-xs ${stat.color} ${stat.bg} px-2 py-0.5 rounded-full`}>
                    +{stat.change} {stat.changeLabel}
                  </span>
                )}
              </div>
              <div className={`text-2xl font-bold text-[#111827] ${stat.color}`}>{stat.value}</div>
              <div className="text-sm text-[#6B7280] mt-1">{stat.label}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Последние объявления */}
        <div className="bg-white rounded-xl p-6 border border-[#E5E7EB]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[#111827] flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-[#6366F1]" />
              Последние объявления
            </h3>
            <Link href="/admin/listings" className="text-sm text-[#3B82F6] hover:underline">
              Все →
            </Link>
          </div>
          <div className="space-y-3">
            {recentListings.length === 0 ? (
              <p className="text-[#9CA3AF] text-sm text-center py-4">Нет объявлений</p>
            ) : (
              recentListings.map((listing) => (
                <div key={listing.id} className="flex items-center justify-between py-2 border-b border-[#F3F4F6]">
                  <div>
                    <div className="text-sm font-medium text-[#111827]">{listing.title}</div>
                    <div className="text-xs text-[#9CA3AF]">
                      {listing.author?.name || 'Пользователь'} • 
                      {new Date(listing.createdAt).toLocaleDateString('ru-RU')}
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${
                    listing.status === 'active' ? 'bg-green-100 text-green-700' :
                    listing.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {listing.status === 'active' ? <CheckCircle className="w-3 h-3" /> :
                     listing.status === 'pending' ? <Clock className="w-3 h-3" /> :
                     listing.status === 'rejected' ? <XCircle className="w-3 h-3" /> : <Package className="w-3 h-3" />}
                    {listing.status === 'active' ? ' Активно' :
                     listing.status === 'pending' ? ' На модерации' :
                     listing.status === 'rejected' ? ' Отклонено' : ' В архиве'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Последние пользователи */}
        <div className="bg-white rounded-xl p-6 border border-[#E5E7EB]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[#111827] flex items-center gap-2">
              <Users className="w-5 h-5 text-[#6366F1]" />
              Новые пользователи
            </h3>
            <Link href="/admin/users" className="text-sm text-[#3B82F6] hover:underline">
              Все →
            </Link>
          </div>
          <div className="space-y-3">
            {recentUsers.length === 0 ? (
              <p className="text-[#9CA3AF] text-sm text-center py-4">Нет пользователей</p>
            ) : (
              recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between py-2 border-b border-[#F3F4F6]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#F3F4F6] rounded-full flex items-center justify-center text-sm">
                      {user.name?.[0] || <User className="w-4 h-4 text-[#6B7280]" />}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-[#111827]">{user.name || 'Без имени'}</div>
                      <div className="text-xs text-[#9CA3AF]">{user.phone}</div>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                    user.role === 'moderator' ? 'bg-blue-100 text-blue-700' :
                    user.isBlocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {user.role === 'admin' ? 'Админ' :
                     user.role === 'moderator' ? 'Модератор' :
                     user.isBlocked ? 'Заблокирован' : 'Пользователь'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Быстрые действия */}
      <div className="mt-6 bg-white rounded-xl p-6 border border-[#E5E7EB]">
        <h3 className="font-semibold text-[#111827] mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5 text-[#6366F1]" />
          Быстрые действия
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link href="/admin/listings?status=pending" className="btn-secondary text-center py-3 flex flex-col items-center">
            <ClipboardList className="w-5 h-5 text-[#6366F1] mb-1" />
            Модерация
            <span className="block text-xs text-[#9CA3AF] mt-1">
              {stats?.pendingListings || 0} ожидают
            </span>
          </Link>
          <Link href="/admin/users" className="btn-secondary text-center py-3 flex flex-col items-center">
            <Users className="w-5 h-5 text-[#6366F1] mb-1" />
            Пользователи
            <span className="block text-xs text-[#9CA3AF] mt-1">
              {stats?.totalUsers || 0} всего
            </span>
          </Link>
          <Link href="/admin/settings" className="btn-secondary text-center py-3 flex flex-col items-center">
            <Settings className="w-5 h-5 text-[#6366F1] mb-1" />
            Настройки
            <span className="block text-xs text-[#9CA3AF] mt-1">
              Общие настройки
            </span>
          </Link>
          <Link href="/admin/reviews" className="btn-secondary text-center py-3 flex flex-col items-center">
            <Star className="w-5 h-5 text-[#6366F1] mb-1" />
            Отзывы
            <span className="block text-xs text-[#9CA3AF] mt-1">
              {stats?.totalReviews || 0} всего
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}