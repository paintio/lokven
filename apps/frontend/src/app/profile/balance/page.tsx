'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProfileSidebar from '@/components/profile/ProfileSidebar';

export default function ProfileBalance() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(1500);

  // Временно, пока нет реального пользователя
  useState(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="container-custom py-12 text-center text-[#9CA3AF]">
        Загрузка...
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <h1 className="text-2xl font-bold text-[#111827] mb-6">💰 Баланс</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        <ProfileSidebar role={user?.role || 'user'} isSeller={user?.isSeller || false} />

        <div className="flex-1 space-y-6">
          {/* Баланс */}
          <div className="bg-white rounded-xl p-6 border border-[#E5E7EB]">
            <div className="text-center">
              <p className="text-sm text-[#6B7280]">Доступный баланс</p>
              <p className="text-4xl font-bold text-[#111827] mt-2">{balance} ₽</p>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-6">
              <button className="btn-primary">Пополнить</button>
              <button className="btn-secondary">Вывести</button>
            </div>
          </div>

          {/* История операций */}
          <div className="bg-white rounded-xl p-6 border border-[#E5E7EB]">
            <h3 className="font-semibold text-[#111827] mb-4">📊 История операций</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-[#F3F4F6]">
                <div>
                  <p className="text-sm font-medium text-[#111827]">Пополнение баланса</p>
                  <p className="text-xs text-[#6B7280]">24 июня 2026, 14:30</p>
                </div>
                <span className="text-sm font-medium text-green-600">+500 ₽</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-[#F3F4F6]">
                <div>
                  <p className="text-sm font-medium text-[#111827]">Оплата заказа #12345</p>
                  <p className="text-xs text-[#6B7280]">23 июня 2026, 10:15</p>
                </div>
                <span className="text-sm font-medium text-red-600">-1 200 ₽</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-[#F3F4F6]">
                <div>
                  <p className="text-sm font-medium text-[#111827]">Возврат заказа #12340</p>
                  <p className="text-xs text-[#6B7280]">22 июня 2026, 16:45</p>
                </div>
                <span className="text-sm font-medium text-green-600">+2 500 ₽</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
