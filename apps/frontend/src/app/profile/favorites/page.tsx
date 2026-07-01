'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProfileSidebar from '@/components/profile/ProfileSidebar';

interface Favorite {
  id: string;
  title: string;
  price: number;
  images: { url: string }[];
}

export default function ProfileFavorites() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
    // TODO: Загрузить реальные избранные
    setFavorites([
      {
        id: '1',
        title: 'BMW X5 2021',
        price: 4500000,
        images: [{ url: '/images/placeholder.png' }],
      },
      {
        id: '2',
        title: 'Квартира в центре',
        price: 15000000,
        images: [{ url: '/images/placeholder.png' }],
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

  return (
    <div className="container-custom py-8">
      <h1 className="text-2xl font-bold text-[#111827] mb-6">❤️ Избранное</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        <ProfileSidebar role={user?.role || 'user'} isSeller={user?.isSeller || false} />

        <div className="flex-1">
          {favorites.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center border border-[#E5E7EB]">
              <div className="text-4xl mb-3">❤️</div>
              <p className="text-[#6B7280]">У вас пока нет избранных объявлений</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {favorites.map((item) => (
                <Link key={item.id} href={`/listings/${item.id}`} className="card group">
                  <img
                    src={item.images[0]?.url || '/images/placeholder.png'}
                    alt=""
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-3">
                    <h4 className="text-sm font-medium text-[#111827] line-clamp-2">{item.title}</h4>
                    <p className="text-sm font-bold text-[#111827] mt-1">
                      {item.price.toLocaleString('ru-RU')} ₽
                    </p>
                    <button className="text-xs text-red-500 hover:text-red-700 mt-2">
                      ❌ Удалить
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
