'use client';

import { useState } from 'react';

export default function AdminNotifications() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('system');
  const [loading, setLoading] = useState(false);

  const sendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/notifications/send-all`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title, message, type }),
      });
      
      if (response.ok) {
        alert('✅ Уведомления отправлены');
        setTitle('');
        setMessage('');
      } else {
        alert('❌ Ошибка отправки');
      }
    } catch (error) {
      alert('❌ Ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-[#111827] mb-6">📨 Массовая рассылка</h1>
      
      <div className="bg-white rounded-xl p-6 border border-[#E5E7EB]">
        <form onSubmit={sendNotification} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#6B7280] mb-1">Заголовок *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="input-field"
              placeholder="Новое обновление платформы"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#6B7280] mb-1">Сообщение *</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={4}
              className="input-field"
              placeholder="Текст уведомления для всех пользователей..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#6B7280] mb-1">Тип</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="input-field"
            >
              <option value="system">Системное</option>
              <option value="moderation">Модерация</option>
              <option value="order">Заказы</option>
              <option value="promo">Промо</option>
            </select>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50"
          >
            {loading ? 'Отправка...' : '📨 Отправить всем'}
          </button>
          
          <p className="text-xs text-[#9CA3AF] text-center">
            Уведомление получат все пользователи платформы
          </p>
        </form>
      </div>
    </div>
  );
}
