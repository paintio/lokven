'use client';

import { useState, useEffect } from 'react';

interface Payment {
  id: string;
  amount: number;
  status: string;
  method: string;
  transactionId: string | null;
  createdAt: string;
  user: {
    name: string | null;
    phone: string;
  };
  order: {
    id: string;
  };
}

export default function AdminPayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/payments`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch payments');
      }
      
      const data = await response.json();
      setPayments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching payments:', error);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => price.toLocaleString('ru-RU') + ' ₽';

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    refunded: 'bg-gray-100 text-gray-800',
  };

  const statusLabels: Record<string, string> = {
    pending: '⏳ Ожидает',
    completed: '✅ Завершён',
    failed: '❌ Ошибка',
    refunded: '🔄 Возврат',
  };

  if (loading) {
    return <div className="text-[#9CA3AF]">Загрузка...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#111827] mb-6">💳 Платежи</h1>

      {payments.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center border border-[#E5E7EB]">
          <p className="text-[#6B7280]">Платежей пока нет</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Платеж</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Пользователь</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Сумма</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Метод</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Статус</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F6]">
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-[#F9FAFB]">
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-[#111827]">#{payment.id.slice(0, 8)}</div>
                    <div className="text-xs text-[#9CA3AF]">
                      {new Date(payment.createdAt).toLocaleDateString('ru-RU')}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-[#111827]">{payment.user.name || payment.user.phone}</div>
                  </td>
                  <td className="px-4 py-3 font-medium text-[#111827]">{formatPrice(payment.amount)}</td>
                  <td className="px-4 py-3 text-sm text-[#6B7280]">
                    {payment.method === 'card' ? '💳 Карта' : 
                     payment.method === 'cash' ? '💰 Наличные' : 
                     payment.method === 'bank' ? '🏦 Банк' : payment.method}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[payment.status]}`}>
                      {statusLabels[payment.status]}
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
