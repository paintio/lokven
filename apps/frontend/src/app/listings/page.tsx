'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getImageUrl } from '@/lib/api';
import {
  Search,
  Filter,
  Package,
  Car,
  Wrench,
  Megaphone,
  HomeIcon,
  Briefcase,
  Pin,
  X,
  MapPin,
  DollarSign,
  Inbox,
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  SlidersHorizontal,
} from 'lucide-react';

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

const categories = [
  { value: '', label: 'Все' },
  { value: 'product', label: 'Маркетплейс', icon: Package },
  { value: 'ads', label: 'Объявления', icon: Megaphone },
  { value: 'auto', label: 'Авто', icon: Car },
  { value: 'realty', label: 'Недвижимость', icon: HomeIcon },
  { value: 'job', label: 'Работа', icon: Briefcase },
  { value: 'service', label: 'Услуги', icon: Wrench },
];

function ListingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    type: searchParams.get('type') || '',
    category: searchParams.get('category') || '',
    minPrice: '',
    maxPrice: '',
    sort: 'new',
    address: '',
  });

  useEffect(() => {
    fetchListings();
  }, [searchParams, page]);

  const fetchListings = async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams();

      if (filters.search) params.append('search', filters.search);
      if (filters.type) params.append('type', filters.type);
      if (filters.category) params.append('category', filters.category);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.sort) params.append('sort', filters.sort);
      if (filters.address) params.append('address', filters.address);

      params.append('page', page.toString());
      params.append('limit', '20');

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/listings?${params.toString()}`
      );

      const data = await response.json();

      setListings(data.items || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const applyFilters = () => {
    const params = new URLSearchParams();

    if (filters.search) params.append('search', filters.search);
    if (filters.type) params.append('type', filters.type);
    if (filters.category) params.append('category', filters.category);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    if (filters.sort) params.append('sort', filters.sort);
    if (filters.address) params.append('address', filters.address);

    setPage(1);
    router.push(`/listings?${params.toString()}`);
  };

  const selectCategory = (type: string) => {
    const nextFilters = {
      ...filters,
      type,
    };

    setFilters(nextFilters);
    setPage(1);

    const params = new URLSearchParams();

    if (nextFilters.search) params.append('search', nextFilters.search);
    if (nextFilters.type) params.append('type', nextFilters.type);
    if (nextFilters.category) {
      params.append('category', nextFilters.category);
    }
    if (nextFilters.minPrice) {
      params.append('minPrice', nextFilters.minPrice);
    }
    if (nextFilters.maxPrice) {
      params.append('maxPrice', nextFilters.maxPrice);
    }
    if (nextFilters.sort) params.append('sort', nextFilters.sort);
    if (nextFilters.address) {
      params.append('address', nextFilters.address);
    }

    router.push(`/listings?${params.toString()}`);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      type: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      sort: 'new',
      address: '',
    });

    setPage(1);
    setShowFilters(false);
    router.push('/listings');
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('ru-RU') + ' ₽';
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, any> = {
      product: Package,
      ads: Megaphone,
      auto: Car,
      realty: HomeIcon,
      job: Briefcase,
      service: Wrench,
    };

    return icons[type] || Pin;
  };

  const getCategoryTitle = () => {
    if (filters.category) {
      const names: Record<string, string> = {
        avto: 'Авто',
        nedvizhimost: 'Недвижимость',
        elektronika: 'Электроника',
        'media-i-stil': 'Медиа и стиль',
        'dom-i-sad': 'Для дома и сада',
        'sport-i-otdyh': 'Спорт и отдых',
      };

      return names[filters.category] || filters.category;
    }

    if (filters.search) {
      return `Результаты поиска: "${filters.search}"`;
    }

    if (filters.type) {
      const types: Record<string, string> = {
        product: 'Маркетплейс',
        ads: 'Объявления',
        auto: 'Авто',
        realty: 'Недвижимость',
        job: 'Работа',
        service: 'Услуги',
      };

      return types[filters.type] || filters.type;
    }

    return 'Все объявления';
  };

  const totalPages = Math.ceil(total / 20);

  return (
    <div className="container-custom py-5 md:py-7">
      <div className="flex items-end justify-between gap-4 mb-4">
        <div>
          <p className="text-xs font-semibold text-[#4F6BFF] mb-1">
            Каталог Lokven
          </p>

          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#111827]">
            {getCategoryTitle()}
          </h1>
        </div>

        <span className="hidden sm:block text-sm text-[#6B7280]">
          Найдено: {total}
        </span>
      </div>

      <div className="relative z-10 rounded-[22px] border border-white/70 bg-white/80 backdrop-blur-xl shadow-[0_12px_40px_rgba(15,23,42,0.08)] p-3 md:p-4 mb-5">
        <div className="flex flex-col lg:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#9CA3AF]" />

            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  applyFilters();
                }
              }}
              placeholder="Что вы ищете?"
              className="w-full h-12 rounded-xl border border-[#E5E7EB] bg-white/90 pl-11 pr-4 text-sm text-[#111827] outline-none transition focus:border-[#4F6BFF] focus:ring-4 focus:ring-[#4F6BFF]/10"
            />
          </div>

          <div className="relative lg:w-[220px]">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#9CA3AF]" />

            <input
              type="text"
              name="address"
              value={filters.address}
              onChange={handleFilterChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  applyFilters();
                }
              }}
              placeholder="Город"
              className="w-full h-12 rounded-xl border border-[#E5E7EB] bg-white/90 pl-11 pr-4 text-sm text-[#111827] outline-none transition focus:border-[#4F6BFF] focus:ring-4 focus:ring-[#4F6BFF]/10"
            />
          </div>

          <button
            onClick={applyFilters}
            className="h-12 px-6 rounded-xl bg-[#4F6BFF] text-white text-sm font-semibold flex items-center justify-center gap-2 transition hover:bg-[#4059E8] hover:-translate-y-0.5 shadow-[0_8px_20px_rgba(79,107,255,0.25)]"
          >
            <Search className="w-4 h-4" />
            Найти
          </button>

          <button
            onClick={() => setShowFilters((prev) => !prev)}
            className={`h-12 px-5 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 transition ${
              showFilters
                ? 'border-[#4F6BFF] bg-[#EEF1FF] text-[#4F6BFF]'
                : 'border-[#E5E7EB] bg-white/90 text-[#374151] hover:border-[#C7D2FE]'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Фильтры

            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                showFilters ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto pt-3 pb-1 scrollbar-hide">
          {categories.map((category) => {
            const Icon = category.icon;
            const active = filters.type === category.value;

            return (
              <button
                key={category.value}
                onClick={() => selectCategory(category.value)}
                className={`shrink-0 h-9 px-3.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition ${
                  active
                    ? 'bg-[#111827] border-[#111827] text-white shadow-sm'
                    : 'bg-white/80 border-[#E5E7EB] text-[#4B5563] hover:border-[#A5B4FC] hover:text-[#4F6BFF]'
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                {category.label}
              </button>
            );
          })}
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3 pt-3 border-t border-[#E5E7EB]/80">
            <div>
              <label className="block text-xs font-medium text-[#6B7280] mb-1.5">
                Цена от
              </label>

              <div className="relative">
                <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />

                <input
                  type="number"
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  placeholder="0"
                  className="w-full h-11 rounded-xl border border-[#E5E7EB] bg-white pl-10 pr-3 text-sm outline-none focus:border-[#4F6BFF]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#6B7280] mb-1.5">
                Цена до
              </label>

              <div className="relative">
                <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />

                <input
                  type="number"
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  placeholder="Любая"
                  className="w-full h-11 rounded-xl border border-[#E5E7EB] bg-white pl-10 pr-3 text-sm outline-none focus:border-[#4F6BFF]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#6B7280] mb-1.5">
                Сортировка
              </label>

              <select
                name="sort"
                value={filters.sort}
                onChange={handleFilterChange}
                className="w-full h-11 rounded-xl border border-[#E5E7EB] bg-white px-3 text-sm outline-none focus:border-[#4F6BFF]"
              >
                <option value="new">Сначала новые</option>
                <option value="price_asc">Сначала дешевле</option>
                <option value="price_desc">Сначала дороже</option>
                <option value="popular">По популярности</option>
              </select>
            </div>

            <div className="sm:col-span-3 flex flex-wrap gap-2 pt-1">
              <button
                onClick={applyFilters}
                className="h-10 px-5 rounded-xl bg-[#4F6BFF] text-white text-sm font-semibold hover:bg-[#4059E8] transition"
              >
                Применить
              </button>

              <button
                onClick={clearFilters}
                className="h-10 px-4 rounded-xl text-sm font-medium text-[#6B7280] flex items-center gap-2 hover:bg-[#F3F4F6] transition"
              >
                <X className="w-4 h-4" />
                Сбросить
              </button>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="text-center py-16 text-[#9CA3AF] text-sm">
          Загрузка...
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-16 bg-white/80 backdrop-blur-xl rounded-[24px] border border-white/70 shadow-sm">
          <Inbox className="w-14 h-14 text-[#9CA3AF] mx-auto mb-3" />

          <p className="text-[#374151] font-semibold">
            Объявлений не найдено
          </p>

          <p className="text-[#9CA3AF] text-sm mt-1">
            Попробуйте изменить параметры поиска
          </p>

          <button
            onClick={clearFilters}
            className="mt-5 h-10 px-5 rounded-xl bg-[#4F6BFF] text-white text-sm font-semibold"
          >
            Сбросить фильтры
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
          {listings.map((listing) => {
            const Icon = getTypeIcon(listing.type);

            return (
              <a
                href={`/listings/${listing.id}`}
                key={listing.id}
                className="group overflow-hidden rounded-[20px] border border-white/70 bg-white/90 backdrop-blur-xl shadow-[0_8px_24px_rgba(15,23,42,0.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.13)]"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[#F3F4F6]">
                  {listing.images && listing.images.length > 0 ? (
                    <img
                      src={getImageUrl(listing.images[0].url)}
                      alt={listing.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Icon className="w-14 h-14 text-[#9CA3AF]" />
                    </div>
                  )}

                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <div className="p-4">
                  <h3 className="text-[15px] font-semibold text-[#111827] line-clamp-2 leading-snug">
                    {listing.title}
                  </h3>

                  <div className="mt-2">
                    <span className="text-lg font-bold tracking-tight text-[#111827]">
                      {formatPrice(listing.price)}
                    </span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-[#F3F4F6] text-xs text-[#6B7280] truncate">
                    {listing.author.name || listing.author.phone}
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="w-10 h-10 rounded-xl border border-[#E5E7EB] bg-white flex items-center justify-center disabled:opacity-40 transition hover:border-[#A5B4FC]"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          {Array.from(
            { length: Math.min(5, totalPages) },
            (_, i) => {
              let pageNum;

              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`w-10 h-10 rounded-xl text-sm font-semibold transition ${
                    page === pageNum
                      ? 'bg-[#4F6BFF] text-white shadow-[0_6px_16px_rgba(79,107,255,0.25)]'
                      : 'border border-[#E5E7EB] bg-white text-[#4B5563] hover:border-[#A5B4FC]'
                  }`}
                >
                  {pageNum}
                </button>
              );
            }
          )}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="w-10 h-10 rounded-xl border border-[#E5E7EB] bg-white flex items-center justify-center disabled:opacity-40 transition hover:border-[#A5B4FC]"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export default function ListingsPage() {
  return (
    <Suspense
      fallback={
        <div className="container-custom py-12 text-center text-[#9CA3AF]">
          Загрузка...
        </div>
      }
    >
      <ListingsContent />
    </Suspense>
  );
}