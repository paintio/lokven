'use client';

import { useState, useEffect } from 'react';

interface Order {
  id: string;
  status: string;
  total: number;
  tax: number;
  commission: number;
  netTotal: number;
  createdAt: string;
  buyer: {
    name: string | null;
    phone: string;
  };
  seller: {
    name: string | null;
    phone: string;
  };
  listing: {
    title: string;
  };
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      
      const data = await response.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => price.toLocaleString('ru-RU') + ' ₽';

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  const statusLabels: Record<string, string> = {
    pending: '⏳ Ожидает',
    paid: '✅ Оплачено',
    completed: '📦 Завершено',
    cancelled: '❌ Отменено',
  };

  if (loading) {
    return <div className="text-[#9CA3AF]">Загрузка...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#111827] mb-6">📦 Заказы</h1>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center border border-[#E5E7EB]">
          <p className="text-[#6B7280]">Заказов пока нет</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Заказ</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Товар</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Сумма</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Налог</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Комиссия</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Статус</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F6]">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-[#F9FAFB]">
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-[#111827]">#{order.id.slice(0, 8)}</div>
                    <div className="text-xs text-[#9CA3AF]">
                      {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-[#111827]">{order.listing.title}</div>
                    <div className="text-xs text-[#9CA3AF]">
                      Продавец: {order.seller.name || order.seller.phone}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-[#111827]">{formatPrice(order.total)}</td>
                  <td className="px-4 py-3 text-sm text-[#6B7280]">{formatPrice(order.tax)}</td>
                  <td className="px-4 py-3 text-sm text-[#6B7280]">{formatPrice(order.commission)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[order.status]}`}>
                      {statusLabels[order.status]}
                    </span>
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
