'use client';

import { useState, useEffect } from 'react';
import { getImageUrl } from '@/lib/api';

interface Listing {
  id: string;
  title: string;
  price: number;
  type: string;
  status: string;
  views: number;
  isPremium: boolean;
  createdAt: string;
  moderationNote?: string;
  author: {
    id: string;
    name: string | null;
    phone: string;
    isSeller: boolean;
    companyName: string | null;
  };
  images: { url: string }[];
}

export default function AdminListings() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [moderating, setModerating] = useState<string | null>(null);
  const [moderationNote, setModerationNote] = useState('');

  useEffect(() => {
    fetchListings();
  }, [filter]);

  const fetchListings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/listings?status=${filter}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch listings');
      }
      
      const data = await response.json();
      setListings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching listings:', error);
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  const moderateListing = async (id: string, status: string) => {
    try {
      setModerating(id);
      const userStr = localStorage.getItem('user');
      const user = JSON.parse(userStr || '{}');
      
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/listings/${id}/moderate`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          status,
          moderationNote: moderationNote || undefined,
          moderatorId: user.id,
        }),
      });

      if (response.ok) {
        fetchListings();
        setModerationNote('');
      }
    } catch (error) {
      console.error('Error moderating:', error);
    } finally {
      setModerating(null);
    }
  };

  const formatPrice = (price: number) => price.toLocaleString('ru-RU') + ' ₽';

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    active: 'bg-green-100 text-green-800',
    sold: 'bg-gray-100 text-gray-800',
    archived: 'bg-gray-200 text-gray-800',
    rejected: 'bg-red-100 text-red-800',
  };

  const statusLabels: Record<string, string> = {
    pending: '⏳ На модерации',
    active: '✅ Активно',
    sold: '💸 Продано',
    archived: '📦 В архиве',
    rejected: '❌ Отклонено',
  };

  const typeLabels: Record<string, string> = {
    product: 'Маркетплейс',
    ads: 'Объявление',
    auto: 'Авто',
    realty: 'Недвижимость',
    job: 'Работа',
    service: 'Услуга',
  };

  const filterOptions = [
    { value: 'pending', label: '⏳ На модерации' },
    { value: 'active', label: '✅ Активные' },
    { value: 'all', label: 'Все' },
    { value: 'rejected', label: '❌ Отклонено' },
  ];

  if (loading) {
    return <div className="text-[#9CA3AF]">Загрузка...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#111827]">📋 Модерация объявлений</h1>
        <div className="flex gap-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="input-field w-48"
          >
            {filterOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {listings.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center border border-[#E5E7EB]">
          <p className="text-[#6B7280]">Объявлений не найдено</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Объявление</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Тип</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Цена</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Автор</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Статус</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F6]">
              {listings.map((listing) => (
                <tr key={listing.id} className="hover:bg-[#F9FAFB]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {listing.images && listing.images.length > 0 ? (
                        <img
                          src={getImageUrl(listing.images[0].url)}
                          alt=""
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-[#F3F4F6] rounded-lg flex items-center justify-center text-xl">
                          📦
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-[#111827] text-sm">{listing.title}</div>
                        <div className="text-xs text-[#9CA3AF]">
                          {new Date(listing.createdAt).toLocaleDateString('ru-RU')}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#6B7280]">{typeLabels[listing.type] || listing.type}</td>
                  <td className="px-4 py-3 font-medium text-[#111827]">{formatPrice(listing.price)}</td>
                  <td className="px-4 py-3 text-sm text-[#6B7280]">
                    {listing.author.name || listing.author.phone}
                    {listing.author.isSeller && (
                      <span className="ml-1 text-xs text-[#3B82F6]">(продавец)</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[listing.status]}`}>
                      {statusLabels[listing.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {listing.status === 'pending' && (
                      <div className="space-y-2">
                        <div>
                          <input
                            type="text"
                            placeholder="Причина отклонения (опционально)"
                            value={moderating === listing.id ? moderationNote : ''}
                            onChange={(e) => setModerationNote(e.target.value)}
                            className="input-field text-xs w-48"
                            disabled={moderating === listing.id}
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => moderateListing(listing.id, 'active')}
                            disabled={moderating === listing.id}
                            className="text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg transition-colors disabled:opacity-50"
                          >
                            {moderating === listing.id ? '...' : '✅ Одобрить'}
                          </button>
                          <button
                            onClick={() => moderateListing(listing.id, 'rejected')}
                            disabled={moderating === listing.id}
                            className="text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition-colors disabled:opacity-50"
                          >
                            {moderating === listing.id ? '...' : '❌ Отклонить'}
                          </button>
                        </div>
                      </div>
                    )}
                    {listing.status === 'active' && (
                      <button
                        onClick={() => moderateListing(listing.id, 'archived')}
                        className="text-xs text-[#6B7280] hover:underline"
                      >
                        📦 В архив
                      </button>
                    )}
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
