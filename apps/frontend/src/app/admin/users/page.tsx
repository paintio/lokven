'use client';

import { useState, useEffect } from 'react';

interface User {
  id: string;
  phone: string;
  email: string | null;
  name: string | null;
  role: string;
  isBlocked: boolean;
  isVerified: boolean;
  createdAt: string;
  _count: {
    listings: number;
  };
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const data = await response.json();
      // Убеждаемся, что data - это массив
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleBlock = async (userId: string, isBlocked: boolean) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/${userId}/block`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ isBlocked: !isBlocked }),
      });
      fetchUsers();
    } catch (error) {
      console.error('Error toggling block:', error);
    }
  };

  const changeRole = async (userId: string, role: string) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ role }),
      });
      fetchUsers();
    } catch (error) {
      console.error('Error changing role:', error);
    }
  };

  // Безопасная фильтрация
  const filteredUsers = Array.isArray(users) ? users.filter(user =>
    user.name?.toLowerCase().includes(search.toLowerCase()) ||
    user.phone.includes(search) ||
    user.email?.toLowerCase().includes(search.toLowerCase())
  ) : [];

  if (loading) {
    return <div className="text-[#9CA3AF]">Загрузка...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#111827]">👥 Пользователи</h1>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Поиск..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field w-64"
          />
          <button className="btn-primary">+ Добавить</button>
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center border border-[#E5E7EB]">
          <p className="text-[#6B7280]">Пользователей не найдено</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Пользователь</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Телефон</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Роль</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Объявлений</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Статус</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F6]">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-[#F9FAFB]">
                  <td className="px-4 py-3">
                    <div className="font-medium text-[#111827]">{user.name || 'Без имени'}</div>
                    <div className="text-xs text-[#9CA3AF]">{user.email || 'Нет email'}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#6B7280]">{user.phone}</td>
                  <td className="px-4 py-3">
                    <select
                      value={user.role}
                      onChange={(e) => changeRole(user.id, e.target.value)}
                      className="text-sm border rounded px-2 py-1 bg-white"
                    >
                      <option value="user">Пользователь</option>
                      <option value="moderator">Модератор</option>
                      <option value="admin">Админ</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#6B7280]">{user._count?.listings || 0}</td>
                  <td className="px-4 py-3">
                    <span className={`tag ${user.isBlocked ? 'tag-gray' : ''}`}>
                      {user.isBlocked ? '🔒 Заблокирован' : '✅ Активен'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleBlock(user.id, user.isBlocked)}
                      className={`text-sm ${user.isBlocked ? 'text-[#10B981]' : 'text-[#EF4444]'} hover:underline`}
                    >
                      {user.isBlocked ? 'Разблокировать' : 'Заблокировать'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
