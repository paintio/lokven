'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProfileSidebar from '@/components/profile/ProfileSidebar';

interface Listing {
  id: string;
  title: string;
  price: number;
  type: string;
  status: string;
  views: number;
  createdAt: string;
  images: { url: string }[];
}

export default function ProfileListings() {
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    fetchUserAndListings(token);
  }, []);

  const fetchUserAndListings = async (token: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Unauthorized');
      }

      const data = await response.json();
      setUser(data);
      setListings(data.listings || []);
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/auth/login');
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
        setListings(listings.filter(l => l.id !== id));
      }
    } catch (error) {
      console.error('Error deleting listing:', error);
    }
  };

  if (loading) {
    return (
      <div className="container-custom py-12 text-center text-[#9CA3AF]">
        Загрузка...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      active: '✅ Активно',
      pending: '⏳ На модерации',
      sold: '💸 Продано',
      archived: '📦 В архиве',
      rejected: '❌ Отклонено',
    };
    return labels[status] || status;
  };

  return (
    <div className="container-custom py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#111827]">📋 Мои объявления</h1>
        <Link href="/listings/create" className="btn-primary">
          + Создать
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <ProfileSidebar role={user.role} isSeller={user.isSeller} />

        <div className="flex-1">
          {listings.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center border border-[#E5E7EB]">
              <div className="text-4xl mb-3">📭</div>
              <p className="text-[#6B7280]">У вас пока нет объявлений</p>
              <Link href="/listings/create" className="btn-primary mt-4 inline-block">
                Создать первое объявление
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {listings.map((listing) => (
                <div key={listing.id} className="bg-white rounded-xl p-4 border border-[#E5E7EB] flex items-center gap-4 hover:shadow-md transition-shadow">
                  {listing.images && listing.images.length > 0 ? (
                    <img src={listing.images[0].url} alt="" className="w-20 h-20 object-cover rounded-lg flex-shrink-0" />
                  ) : (
                    <div className="w-20 h-20 bg-[#F3F4F6] rounded-lg flex items-center justify-center text-2xl flex-shrink-0">📦</div>
                  )}
                  <div className="flex-1 min-w-0">
                    <Link href={`/listings/${listing.id}`} className="font-medium text-[#111827] hover:text-[#3B82F6]">
                      {listing.title}
                    </Link>
                    <p className="text-sm text-[#111827] font-medium">
                      {listing.price.toLocaleString('ru-RU')} ₽
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-[#6B7280]">{listing.views} просмотров</span>
                      <span className="text-xs text-[#6B7280]">•</span>
                      <span className="text-xs text-[#6B7280]">
                        {new Date(listing.createdAt).toLocaleDateString('ru-RU')}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      listing.status === 'active' ? 'bg-green-100 text-green-700' :
                      listing.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      listing.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {getStatusLabel(listing.status)}
                    </span>
                    <div className="flex gap-2">
                      {listing.status === 'active' && (
                        <Link
                          href={`/listings/${listing.id}/edit`}
                          className="text-xs text-[#3B82F6] hover:underline"
                        >
                          ✏️ Редактировать
                        </Link>
                      )}
                      <button
                        onClick={() => deleteListing(listing.id)}
                        className="text-xs text-red-500 hover:underline"
                      >
                        🗑️ Удалить
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
