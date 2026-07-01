'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProfileSidebar from '@/components/profile/ProfileSidebar';

interface Order {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  listing: {
    title: string;
    price: number;
    images: { url: string }[];
  };
}

export default function ProfileOrders() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
    // TODO: Загрузить реальные заказы
    setOrders([
      {
        id: '1',
        status: 'completed',
        total: 2500,
        createdAt: new Date().toISOString(),
        listing: {
          title: 'iPhone 15 Pro Max',
          price: 2500,
          images: [{ url: '/images/placeholder.png' }],
        },
      },
      {
        id: '2',
        status: 'pending',
        total: 1200,
        createdAt: new Date().toISOString(),
        listing: {
          title: 'Наушники Sony WH-1000XM5',
          price: 1200,
          images: [{ url: '/images/placeholder.png' }],
        },
      },
    ]);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="container-custom py-12 text-center text-[#9CA3AF]">
        Загрузка...
      </div>
    );
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, { label: string; color: string }> = {
      pending: { label: '⏳ Ожидает', color: 'bg-yellow-100 text-yellow-700' },
      paid: { label: '✅ Оплачен', color: 'bg-green-100 text-green-700' },
      completed: { label: '📦 Завершен', color: 'bg-blue-100 text-blue-700' },
      cancelled: { label: '❌ Отменен', color: 'bg-red-100 text-red-700' },
    };
    return labels[status] || { label: status, color: 'bg-gray-100 text-gray-700' };
  };

  return (
    <div className="container-custom py-8">
      <h1 className="text-2xl font-bold text-[#111827] mb-6">📦 Мои заказы</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        <ProfileSidebar role={user?.role || 'user'} isSeller={user?.isSeller || false} />

        <div className="flex-1">
          {orders.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center border border-[#E5E7EB]">
              <div className="text-4xl mb-3">📭</div>
              <p className="text-[#6B7280]">У вас пока нет заказов</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const status = getStatusLabel(order.status);
                return (
                  <div key={order.id} className="bg-white rounded-xl p-4 border border-[#E5E7EB] flex items-center gap-4 hover:shadow-md transition-shadow">
                    <img
                      src={order.listing.images[0]?.url || '/images/placeholder.png'}
                      alt=""
                      className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-[#111827]">{order.listing.title}</h4>
                      <p className="text-sm font-medium text-[#111827]">
                        {order.listing.price} ₽
                      </p>
                      <p className="text-xs text-[#6B7280]">
                        {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
