'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getImageUrl } from '@/lib/api';

interface Listing {
  id: string;
  title: string;
  description: string | null;
  price: number;
  currency: string;
  type: string;
  attributes: any;
  lat: number | null;
  lng: number | null;
  address: string | null;
  status: string;
  views: number;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string | null;
    phone: string;
    avatar: string | null;
    isSeller: boolean;
    companyName: string | null;
  };
  images: { url: string }[];
}

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (params.id) {
      fetchListing();
    }
  }, [params.id]);

  const fetchListing = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/listings/${params.id}`);
      if (!response.ok) {
        throw new Error('Объявление не найдено');
      }
      const data = await response.json();
      setListing(data);
      
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/listings/${params.id}/views`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Error fetching listing:', error);
      router.push('/404');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('ru-RU') + ' ₽';
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      product: 'Маркетплейс',
      ads: 'Объявление',
      auto: 'Авто',
      realty: 'Недвижимость',
      job: 'Работа',
      service: 'Услуга',
    };
    return types[type] || type;
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      product: '🛍️',
      ads: '📋',
      auto: '🚗',
      realty: '🏠',
      job: '💼',
      service: '🔧',
    };
    return icons[type] || '📌';
  };

  if (loading) {
    return (
      <div className="container-custom py-12 text-center text-[#9CA3AF]">
        Загрузка...
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="container-custom py-12 text-center">
        <div className="text-4xl mb-4">🔍</div>
        <h1 className="text-2xl font-bold text-[#111827] mb-2">Объявление не найдено</h1>
        <p className="text-[#6B7280] mb-4">Возможно, оно было удалено или перемещено</p>
        <Link href="/" className="btn-primary">Вернуться на главную</Link>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <div className="text-sm text-[#6B7280] mb-4">
        <Link href="/" className="hover:text-[#111827]">Главная</Link>
        {' / '}
        <Link href="/listings" className="hover:text-[#111827]">Объявления</Link>
        {' / '}
        <span className="text-[#111827]">{listing.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
            <div className="relative w-full h-[400px] bg-[#F3F4F6]">
              {listing.images && listing.images.length > 0 ? (
                <img
                  src={getImageUrl(listing.images[activeImage].url)}
                  alt={listing.title}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl">
                  {getTypeIcon(listing.type)}
                </div>
              )}
            </div>
            
            {listing.images && listing.images.length > 1 && (
              <div className="flex gap-2 p-4 overflow-x-auto">
                {listing.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      activeImage === index ? 'border-[#3B82F6]' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={getImageUrl(image.url)}
                      alt={`Фото ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 sticky top-20">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-[#6B7280]">{getTypeIcon(listing.type)}</span>
              <span className="text-xs px-2 py-1 bg-[#F3F4F6] rounded-full text-[#6B7280]">
                {getTypeLabel(listing.type)}
              </span>
              <span className="text-xs text-[#9CA3AF]">•</span>
              <span className="text-xs text-[#9CA3AF]">{listing.views} просмотров</span>
            </div>

            <h1 className="text-2xl font-bold text-[#111827] mb-2">{listing.title}</h1>
            
            <div className="text-3xl font-bold text-[#111827] mb-4">
              {formatPrice(listing.price)}
            </div>

            <div className="space-y-3 text-sm">
              {listing.description && (
                <div>
                  <h3 className="font-semibold text-[#111827]">Описание</h3>
                  <p className="text-[#6B7280] mt-1 whitespace-pre-wrap">{listing.description}</p>
                </div>
              )}

              {listing.address && (
                <div>
                  <h3 className="font-semibold text-[#111827]">Адрес</h3>
                  <p className="text-[#6B7280] mt-1">{listing.address}</p>
                </div>
              )}

              <div>
                <h3 className="font-semibold text-[#111827]">Продавец</h3>
                <p className="text-[#6B7280] mt-1">
                  {listing.author.name || listing.author.phone}
                  {listing.author.isSeller && (
                    <span className="ml-2 text-xs text-[#3B82F6]">(Продавец)</span>
                  )}
                </p>
                {listing.author.companyName && (
                  <p className="text-xs text-[#9CA3AF]">{listing.author.companyName}</p>
                )}
              </div>

              <div>
                <h3 className="font-semibold text-[#111827]">Дата публикации</h3>
                <p className="text-[#6B7280] mt-1">{formatDate(listing.createdAt)}</p>
              </div>

              {listing.attributes && Object.keys(listing.attributes).length > 0 && (
                <div>
                  <h3 className="font-semibold text-[#111827]">Характеристики</h3>
                  <div className="mt-1 space-y-1">
                    {Object.entries(listing.attributes).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="text-[#6B7280]">{key}</span>
                        <span className="text-[#111827] font-medium">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-[#E5E7EB] flex flex-col gap-3">
              <button className="btn-primary w-full">
                📞 Показать телефон
              </button>
              <button className="btn-secondary w-full">
                💬 Написать сообщение
              </button>
              <button className="btn-outline w-full">
                ❤️ В избранное
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
