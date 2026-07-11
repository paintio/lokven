'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Package, Plus, Edit, Trash2, Eye, Clock, CheckCircle, XCircle, Coins, ArrowLeft } from 'lucide-react';

interface Listing {
  id: string;
  title: string;
  price: number;
  status: string;
  views: number;
  images: { url: string }[];
  createdAt: string;
}

export default function MyListingsPage() {
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    fetchListings();
  }, []);

  const fetchListings = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      // 👈 ПРАВИЛЬНЫЙ ЭНДПОИНТ ДЛЯ ПОЛУЧЕНИЯ ОБЪЯВЛЕНИЙ ПОЛЬЗОВАТЕЛЯ
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/listings?authorId=me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Ошибка загрузки объявлений');
      }

      const data = await response.json();
      setListings(data.items || []);
    } catch (error) {
      console.error('Error fetching listings:', error);
      setError('Не удалось загрузить объявления');
    } finally {
      setLoading(false);
    }
  };

  const deleteListing = async (id: string) => {
    if (!confirm('Удалить объявление?')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/listings/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        fetchListings();
      } else {
        alert('Ошибка при удалении');
      }
    } catch (error) {
      console.error('Error deleting listing:', error);
      alert('Ошибка при удалении');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'sold': return <Coins className="w-4 h-4 text-blue-500" />;
      case 'archived': return <Package className="w-4 h-4 text-gray-500" />;
      default: return null;
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      active: 'Активно',
      pending: 'На модерации',
      sold: 'Продано',
      archived: 'В архиве',
      rejected: 'Отклонено',
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div className="container-custom py-12 text-center text-[#9CA3AF]">
        Загрузка...
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/profile" className="text-[#6B7280] hover:text-[#111827] transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-[#111827]">Мои объявления</h1>
        </div>
        <Link href="/listings/create" className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Создать объявление
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      {listings.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-[#E5E7EB]">
          <Package className="w-16 h-16 text-[#9CA3AF] mx-auto mb-3" />
          <p className="text-[#6B7280] font-medium">У вас пока нет объявлений</p>
          <Link href="/listings/create" className="btn-primary mt-4 inline-block">
            Создать первое объявление
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Объявление</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Цена</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Статус</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Просмотры</th>
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
                            src={listing.images[0].url} 
                            alt="" 
                            className="w-12 h-12 object-cover rounded-lg"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '';
                            }}
                          />
                        ) : (
                          <div className="w-12 h-12 bg-[#F3F4F6] rounded-lg flex items-center justify-center">
                            <Package className="w-6 h-6 text-[#6B7280]" />
                          </div>
                        )}
                        <div>
                          <Link href={`/listings/${listing.id}`} className="font-medium text-[#111827] hover:text-[#3B82F6] transition">
                            {listing.title}
                          </Link>
                          <div className="text-xs text-[#9CA3AF]">
                            {new Date(listing.createdAt).toLocaleDateString('ru-RU')}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-[#111827]">
                      {listing.price.toLocaleString('ru-RU')} ₽
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                        listing.status === 'active' ? 'bg-green-100 text-green-700' :
                        listing.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        listing.status === 'sold' ? 'bg-blue-100 text-blue-700' :
                        listing.status === 'archived' ? 'bg-gray-100 text-gray-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {getStatusIcon(listing.status)}
                        {getStatusLabel(listing.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#6B7280]">{listing.views}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link 
                          href={`/listings/${listing.id}`} 
                          className="text-[#6B7280] hover:text-[#3B82F6] transition"
                          title="Просмотр"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link 
                          href={`/listings/${listing.id}/edit`} 
                          className="text-[#6B7280] hover:text-[#3B82F6] transition"
                          title="Редактировать"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => deleteListing(listing.id)} 
                          className="text-[#6B7280] hover:text-red-500 transition"
                          title="Удалить"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}