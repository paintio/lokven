'use client';

import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

interface AnalyticsData {
  dailyStats: { date: string; users: number; listings: number; orders: number }[];
  categoryStats: { name: string; value: number }[];
  userActivity: { hour: string; active: number }[];
  revenueStats: { month: string; revenue: number; orders: number }[];
  topCategories: { name: string; count: number }[];
  statusStats: { name: string; value: number }[];
}

export default function AdminAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('week');

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/analytics?period=${period}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#EF4444', '#6366F1', '#14B8A6'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[#9CA3AF]">Загрузка данных...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-[#6B7280]">Нет данных для отображения</p>
      </div>
    );
  }

  // Безопасное получение данных с значениями по умолчанию
  const dailyStats = data.dailyStats || [];
  const categoryStats = data.categoryStats || [];
  const userActivity = data.userActivity || [];
  const revenueStats = data.revenueStats || [];
  const topCategories = data.topCategories || [];
  const statusStats = data.statusStats || [];

  const totalUsers = dailyStats.reduce((sum, d) => sum + (d.users || 0), 0);
  const totalListings = dailyStats.reduce((sum, d) => sum + (d.listings || 0), 0);
  const totalOrders = dailyStats.reduce((sum, d) => sum + (d.orders || 0), 0);
  const totalRevenue = revenueStats.reduce((sum, d) => sum + (d.revenue || 0), 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#111827]">📊 Аналитика</h1>
        <div className="flex gap-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="input-field w-40"
          >
            <option value="week">За неделю</option>
            <option value="month">За месяц</option>
            <option value="year">За год</option>
          </select>
          <button onClick={fetchAnalytics} className="btn-secondary text-sm">
            🔄 Обновить
          </button>
        </div>
      </div>

      {/* Общая статистика */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-[#E5E7EB]">
          <div className="text-sm text-[#6B7280]">Всего пользователей</div>
          <div className="text-2xl font-bold text-[#111827]">{totalUsers}</div>
          <div className="text-xs text-[#10B981]">+12.5% за период</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-[#E5E7EB]">
          <div className="text-sm text-[#6B7280]">Всего объявлений</div>
          <div className="text-2xl font-bold text-[#111827]">{totalListings}</div>
          <div className="text-xs text-[#10B981]">+8.3% за период</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-[#E5E7EB]">
          <div className="text-sm text-[#6B7280]">Всего заказов</div>
          <div className="text-2xl font-bold text-[#111827]">{totalOrders}</div>
          <div className="text-xs text-[#10B981]">+15.7% за период</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-[#E5E7EB]">
          <div className="text-sm text-[#6B7280]">Выручка</div>
          <div className="text-2xl font-bold text-[#111827]">{totalRevenue.toLocaleString()} ₽</div>
          <div className="text-xs text-[#10B981]">+22.1% за период</div>
        </div>
      </div>

      {/* График активности */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl p-6 border border-[#E5E7EB]">
          <h3 className="font-semibold text-[#111827] mb-4">📈 Активность пользователей</h3>
          {dailyStats.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dailyStats}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorListings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="users" stroke="#3B82F6" fillOpacity={1} fill="url(#colorUsers)" />
                <Area type="monotone" dataKey="listings" stroke="#8B5CF6" fillOpacity={1} fill="url(#colorListings)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-[#9CA3AF]">Нет данных для графика</div>
          )}
        </div>

        <div className="bg-white rounded-xl p-6 border border-[#E5E7EB]">
          <h3 className="font-semibold text-[#111827] mb-4">📊 Распределение по категориям</h3>
          {categoryStats.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryStats.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-[#9CA3AF]">Нет данных для диаграммы</div>
          )}
        </div>
      </div>

      {/* Еще графики */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl p-6 border border-[#E5E7EB]">
          <h3 className="font-semibold text-[#111827] mb-4">💰 Выручка по месяцам</h3>
          {revenueStats.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={revenueStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#10B981" name="Выручка (₽)" />
                <Bar dataKey="orders" fill="#3B82F6" name="Заказы" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-[#9CA3AF]">Нет данных для графика</div>
          )}
        </div>

        <div className="bg-white rounded-xl p-6 border border-[#E5E7EB]">
          <h3 className="font-semibold text-[#111827] mb-4">🕐 Активность по часам</h3>
          {userActivity.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={userActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="active" stroke="#8B5CF6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-[#9CA3AF]">Нет данных для графика</div>
          )}
        </div>
      </div>

      {/* Статистика по статусам и топ категориям */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-[#E5E7EB]">
          <h3 className="font-semibold text-[#111827] mb-4">📌 Статусы объявлений</h3>
          {statusStats.length > 0 ? (
            <div className="space-y-2">
              {statusStats.map((item, index) => {
                const total = statusStats.reduce((s, i) => s + (i.value || 0), 0);
                return (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-[#6B7280]">{item.name}</span>
                    <div className="flex items-center gap-4">
                      <div className="w-32 h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: total > 0 ? `${(item.value / total) * 100}%` : '0%',
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium text-[#111827]">{item.value}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-[#9CA3AF]">Нет данных</div>
          )}
        </div>

        <div className="bg-white rounded-xl p-6 border border-[#E5E7EB]">
          <h3 className="font-semibold text-[#111827] mb-4">🏆 Топ категории</h3>
          {topCategories.length > 0 ? (
            <div className="space-y-2">
              {topCategories.map((item, index) => (
                <div key={index} className="flex items-center justify-between py-1 border-b border-[#F3F4F6] last:border-0">
                  <span className="text-sm text-[#111827]">
                    <span className="text-[#9CA3AF] mr-2">{index + 1}.</span>
                    {item.name}
                  </span>
                  <span className="text-sm font-medium text-[#3B82F6]">{item.count}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-[#9CA3AF]">Нет данных</div>
          )}
        </div>
      </div>
    </div>
  );
}
