'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getImageUrl } from '@/lib/api';
import {
  Package,
  Car,
  Wrench,
  Megaphone,
  HomeIcon,
  Briefcase,
  Pin,
  ShoppingBag,
  Smartphone,
  Shirt,
  Sofa,
  Dumbbell,
  TrendingUp,
  Users,
  Clock,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import HeroCarousel from '@/components/HeroCarousel';

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
  const [error, setError] = useState('');

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/listings?limit=20`);
      
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

  const formatPrice = (price: number) => {
    return price.toLocaleString('ru-RU') + ' ₽';
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, any> = {
      product: Package,
      auto: Car,
      service: Wrench,
      ads: Megaphone,
      realty: HomeIcon,
      job: Briefcase,
    };
    return icons[type] || Pin;
  };

  const stats = [
    { value: '2M+', label: 'Объявлений', icon: Package },
    { value: '500K+', label: 'Пользователей', icon: Users },
    { value: '50+', label: 'Категорий', icon: Sparkles },
    { value: '24/7', label: 'Поддержка', icon: Clock },
  ];

  const heroCards = [
    {
      id: 1,
      title: 'Недвижимость',
      description: 'Квартиры и дома для покупки и аренды',
      image: '/images/cards/card-realty.png',
      href: '/listings?category=realty',
      icon: HomeIcon,
    },
    {
      id: 2,
      title: 'Маркетплейс',
      description: 'Миллионы товаров для дома и жизни',
      image: '/images/cards/card-marketplace.png',
      href: '/listings?category=marketplace',
      icon: ShoppingBag,
    },
    {
      id: 3,
      title: 'Авто',
      description: 'Автомобили с пробегом от проверенных продавцов',
      image: '/images/cards/card-auto.png',
      href: '/listings?category=auto',
      icon: Car,
    },
    {
      id: 4,
      title: 'Объявления',
      description: 'Частные объявления на любой вкус',
      image: '/images/cards/card-ads.png',
      href: '/listings?category=ads',
      icon: Megaphone,
    },
    {
      id: 5,
      title: 'Работа',
      description: 'Вакансии и карьерные возможности',
      image: '/images/cards/card-jobs.png',
      href: '/listings?category=jobs',
      icon: Briefcase,
    },
    {
      id: 6,
      title: 'Услуги',
      description: 'Специалисты и сервисы рядом с вами',
      image: '/images/cards/card-services.png',
      href: '/listings?category=services',
      icon: Wrench,
    },
  ];

  const categories = [
    { name: 'Авто', count: '125 000+', icon: Car, slug: 'avto' },
    { name: 'Недвижимость', count: '31 000+', icon: HomeIcon, slug: 'nedvizhimost' },
    { name: 'Электроника', count: '80 000+', icon: Smartphone, slug: 'elektronika' },
    { name: 'Медиа и стиль', count: '75 000+', icon: Shirt, slug: 'media-i-stil' },
    { name: 'Для дома и сада', count: '42 000+', icon: Sofa, slug: 'dom-i-sad' },
    { name: 'Спорт и отдых', count: '45 000+', icon: Dumbbell, slug: 'sport-i-otdyh' },
  ];

  return (
    <div className="container-custom">
      {/* Херо-карусель */}
      <HeroCarousel />

      {/* Карточки категорий */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {heroCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.id}
              href={card.href}
              className="group relative block rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl h-[340px]"
            >
              <Image
                src={card.image}
                alt={card.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              
              <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/50 group-hover:to-black/60 transition-all duration-500" />
              
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center gap-2 mb-1">
                  <Icon className="w-5 h-5 text-white/80" />
                  <h3 className="text-xl font-semibold text-white tracking-tight">
                    {card.title}
                  </h3>
                </div>
                <p className="text-sm text-white/80">
                  {card.description}
                </p>
                <span className="btn-transparent btn-transparent-sm">
                   Смотреть →
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-2xl p-6 text-center border border-[#E5E7EB] hover:shadow-md transition-shadow">
              <Icon className="w-8 h-8 mx-auto mb-2 text-[#6366F1]" />
              <div className="text-2xl font-bold text-[#111827]">{stat.value}</div>
              <div className="text-sm text-[#6B7280]">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Популярные категории */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-[#111827]">Популярные категории</h2>
        <Link href="/listings" className="text-sm text-[#3B82F6] hover:underline flex items-center gap-1">
          Смотреть все <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-12">
        {categories.map((cat, index) => {
          const Icon = cat.icon;
          return (
            <Link 
              key={index} 
              href={`/listings?category=${cat.slug}`}
              className="bg-white rounded-2xl p-4 text-center border border-[#E5E7EB] hover:shadow-md transition-all hover:-translate-y-1"
            >
              <Icon className="w-8 h-8 mx-auto mb-2 text-[#6366F1]" />
              <div className="text-sm font-semibold text-[#111827]">{cat.name}</div>
              <div className="text-xs text-[#6B7280]">{cat.count}</div>
            </Link>
          );
        })}
      </div>

      {/* Рекомендуемые объявления */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-[#111827]">Рекомендуем для вас</h2>
        <Link href="/listings" className="text-sm text-[#3B82F6] hover:underline flex items-center gap-1">
          Смотреть все <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {error && (
        <div className="text-center py-12 text-red-500 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-[#9CA3AF] text-sm">Загрузка...</div>
      ) : listings.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-[#E5E7EB]">
          <Package className="w-12 h-12 text-[#9CA3AF] mx-auto mb-2" />
          <p className="text-[#6B7280] text-sm">Пока нет объявлений</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {listings.map((listing) => {
            const Icon = getTypeIcon(listing.type);
            return (
              <Link href={`/listings/${listing.id}`} key={listing.id} className="group bg-white rounded-2xl overflow-hidden border border-[#E5E7EB] hover:shadow-lg transition-all hover:-translate-y-1">
                {listing.images && listing.images.length > 0 ? (
                  <img
                    src={getImageUrl(listing.images[0].url)}
                    alt={listing.title}
                    className="w-full h-44 object-cover bg-[#F3F4F6] group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-44 bg-[#F3F4F6] flex items-center justify-center">
                    <Icon className="w-12 h-12 text-[#6B7280]" />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-sm font-medium text-[#111827] line-clamp-2">
                    {listing.title}
                  </h3>
                  <div className="mt-1">
                    <span className="text-lg font-bold text-[#111827]">
                      {formatPrice(listing.price)}
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-[#6B7280]">
                    {listing.author.name || listing.author.phone}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {listings.length > 0 && (
        <div className="flex justify-center gap-2 mt-8">
          <button className="px-4 py-2 border border-[#E5E7EB] rounded-lg hover:bg-[#F3F4F6] transition flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="px-4 py-2 bg-[#3B82F6] text-white rounded-lg text-sm font-medium">1</button>
          <button className="px-4 py-2 border border-[#E5E7EB] rounded-lg hover:bg-[#F3F4F6] transition text-sm">2</button>
          <button className="px-4 py-2 border border-[#E5E7EB] rounded-lg hover:bg-[#F3F4F6] transition text-sm">3</button>
          <button className="px-4 py-2 border border-[#E5E7EB] rounded-lg hover:bg-[#F3F4F6] transition text-sm">4</button>
          <button className="px-4 py-2 border border-[#E5E7EB] rounded-lg hover:bg-[#F3F4F6] transition text-sm">5</button>
          <button className="px-4 py-2 border border-[#E5E7EB] rounded-lg hover:bg-[#F3F4F6] transition flex items-center gap-1">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}