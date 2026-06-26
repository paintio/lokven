'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getImageUrl } from '@/lib/api';

interface Listing {
  id: string;
  title: string;
  price: number;
  type: string;
  attributes: any;
  images: { url: string }[];
  author: {
    name: string | null;
    phone: string;
  };
  createdAt: string;
}

export default function Home() {
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/listings?limit=20`);
      const data = await response.json();
      setListings(data.items || []);
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('ru-RU') + ' ₽';
  };

  const getTypeEmoji = (type: string) => {
    const types: Record<string, string> = {
      product: '📦',
      auto: '🚗',
      service: '🔧',
    };
    return types[type] || '📌';
  };

  const stats = [
    { value: '2M+', label: 'Объявлений' },
    { value: '500K+', label: 'Пользователей' },
    { value: '50+', label: 'Категорий' },
    { value: '24/7', label: 'Поддержка' },
  ];

  const heroCards = [
    {
      id: 1,
      title: 'Недвижимость',
      description: 'Квартиры, дома, коммерческая недвижимость',
      tags: ['Покупка и аренда', 'Проверенные варианты', 'Удобный поиск'],
      button: 'Смотреть объекты →',
      image: '/images/cards/card-realty.png',
      href: '/realty',
    },
    {
      id: 2,
      title: 'Маркетплейс',
      description: 'Товары, электроника, одежда, всё для дома',
      tags: ['Покупка и продажа', 'Гарантия качества', 'Быстрая доставка'],
      button: 'Перейти в маркетплейс →',
      image: '/images/cards/card-marketplace.png',
      href: '/marketplace',
    },
    {
      id: 3,
      title: 'Авто',
      description: 'Автомобили с пробегом, новые, коммерческий транспорт',
      tags: ['Продажа и покупка', 'Проверка авто', 'Выгодные цены'],
      button: 'Подобрать авто →',
      image: '/images/cards/card-auto.png',
      href: '/auto',
    },
    {
      id: 4,
      title: 'Объявления',
      description: 'Частные объявления, б/у товары, услуги и другое',
      tags: ['Бесплатные объявления', 'Быстрый поиск', 'По всей России'],
      button: 'Смотреть объявления →',
      image: '/images/cards/card-ads.png',
      href: '/ads',
    },
    {
      id: 5,
      title: 'Работа',
      description: 'Вакансии, резюме, стажировки, работа в IT',
      tags: ['Поиск работы', 'Размещение вакансий', 'Карьерный рост'],
      button: 'Найти работу →',
      image: '/images/cards/card-jobs.png',
      href: '/jobs',
    },
    {
      id: 6,
      title: 'Услуги',
      description: 'Специалисты, сервисы, ремонт, клининг, доставка',
      tags: ['Поиск специалистов', 'Рейтинг и отзывы', 'Безопасные сделки'],
      button: 'Найти специалиста →',
      image: '/images/cards/card-services.png',
      href: '/services',
    },
  ];

  const categories = [
    { name: 'Авто', count: '125 000+', icon: '/icons/auto.svg', slug: 'avto' },
    { name: 'Недвижимость', count: '31 000+', icon: '/icons/realty.svg', slug: 'nedvizhimost' },
    { name: 'Электроника', count: '80 000+', icon: '/icons/electronics.svg', slug: 'elektronika' },
    { name: 'Медиа и стиль', count: '75 000+', icon: '/icons/fashion.svg', slug: 'media-i-stil' },
    { name: 'Для дома и сада', count: '42 000+', icon: '/icons/home.svg', slug: 'dom-i-sad' },
    { name: 'Спорт и отдых', count: '45 000+', icon: '/icons/sport.svg', slug: 'sport-i-otdyh' },
  ];

  return (
    <div className="container-custom">
      <div className="hero-block p-6 mb-5">
        <h1 className="text-2xl font-bold text-[#111827] mb-1.5">
          Найдите всё, что вам нужно
        </h1>
        <p className="text-[#4B5563] text-sm font-medium mb-4">
          Товары + Авто + Недвижимость + Работа + Услуги
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {heroCards.map((card) => (
            <a
              key={card.id}
              href={card.href}
              className="group relative block rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-48"
            >
              <Image
                src={card.image}
                alt={card.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/5 group-hover:from-black/70 group-hover:via-black/30 transition-all duration-300" />
              
              <div className="absolute inset-0 p-5 flex flex-col justify-end">
                <h3 className="text-xl font-bold text-white drop-shadow-lg mb-1">
                  {card.title}
                </h3>
                
                <p className="text-sm text-white/90 leading-relaxed drop-shadow-md mb-2">
                  {card.description}
                </p>
                
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {card.tags.slice(0, 2).map((tag, idx) => (
                    <span key={idx} className="text-[10px] px-2.5 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white border border-white/10 font-medium">
                      {tag}
                    </span>
                  ))}
                  {card.tags.length > 2 && (
                    <span className="text-[10px] px-2.5 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white border border-white/10 font-medium">
                      +{card.tags.length - 2}
                    </span>
                  )}
                </div>
                
                <span className="text-sm font-semibold text-white group-hover:text-white transition-colors drop-shadow-lg inline-flex items-center gap-1">
                  {card.button}
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="text-xl font-bold text-[#111827]">{stat.value}</div>
            <div className="text-xs text-[#6B7280] font-medium">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-[#111827]">Популярные категории</h2>
        <a href="/listings" className="btn-link">Смотреть все →</a>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        {categories.map((cat, index) => (
          <a 
            key={index} 
            href={`/listings?category=${cat.slug}`}
            className="category-item flex flex-col items-center"
          >
            <img src={cat.icon} alt={cat.name} className="w-8 h-8 mb-1 text-[#111827]" />
            <div className="text-sm font-semibold text-[#111827]">{cat.name}</div>
            <div className="text-xs text-[#6B7280]">{cat.count}</div>
          </a>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-[#111827]">Рекомендуем для вас</h2>
        <a href="/listings" className="btn-link">Смотреть все →</a>
      </div>

      {loading ? (
        <div className="text-center py-12 text-[#9CA3AF] text-sm">Загрузка...</div>
      ) : listings.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-[24px] border border-[#E5E7EB]">
          <div className="text-3xl mb-2">📭</div>
          <p className="text-[#6B7280] text-sm">Пока нет объявлений</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {listings.map((listing) => (
            <a href={`/listings/${listing.id}`} key={listing.id} className="card group">
              {listing.images && listing.images.length > 0 ? (
                <img
                  src={getImageUrl(listing.images[0].url)}
                  alt={listing.title}
                  className="w-full h-40 object-cover bg-[#F3F4F6]"
                />
              ) : (
                <div className="w-full h-40 bg-[#F3F4F6] flex items-center justify-center text-4xl">
                  {getTypeEmoji(listing.type)}
                </div>
              )}
              <div className="p-3">
                <h3 className="text-sm font-medium text-[#111827] line-clamp-2">
                  {listing.title}
                </h3>
                <div className="mt-1">
                  <span className="text-base font-bold text-[#111827]">
                    {formatPrice(listing.price)}
                  </span>
                </div>
                <div className="mt-2 text-xs text-[#6B7280]">
                  {listing.author.name || listing.author.phone}
                </div>
              </div>
            </a>
          ))}
        </div>
      )}

      {listings.length > 0 && (
        <div className="flex justify-center gap-1.5 mt-8">
          <button className="btn-outline px-3.5 py-1.5">←</button>
          <button className="btn-primary px-3.5 py-1.5 text-sm">1</button>
          <button className="btn-outline px-3.5 py-1.5">2</button>
          <button className="btn-outline px-3.5 py-1.5">3</button>
          <button className="btn-outline px-3.5 py-1.5">4</button>
          <button className="btn-outline px-3.5 py-1.5">5</button>
          <button className="btn-outline px-3.5 py-1.5">→</button>
        </div>
      )}
    </div>
  );
}
