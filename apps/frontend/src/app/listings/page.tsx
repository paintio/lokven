'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getImageUrl } from '@/lib/image-utils';
import { handleImageError } from '@/lib/image-utils';
import { sanitizeText } from '@/lib/sanitize-utils';
import { useListings } from '@/hooks/useListings';
import {
  Search,
  Package,
  Car,
  Wrench,
  Megaphone,
  HomeIcon,
  Briefcase,
  Pin,
  X,
  MapPin,
  Inbox,
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  SlidersHorizontal,
} from 'lucide-react';
import type { Listing, ListingType } from '@/types/listing';

type Filters = Record<string, string>;

const categories = [
  { value: '', label: 'Все' },
  { value: 'product', label: 'Маркетплейс', icon: Package },
  { value: 'ads', label: 'Объявления', icon: Megaphone },
  { value: 'auto', label: 'Авто', icon: Car },
  { value: 'realty', label: 'Недвижимость', icon: HomeIcon },
  { value: 'job', label: 'Работа', icon: Briefcase },
  { value: 'service', label: 'Услуги', icon: Wrench },
];

const baseFilters = {
  search: '',
  type: '',
  address: '',
  minPrice: '',
  maxPrice: '',
  sort: 'new',
};

function Field({
  label,
  name,
  value,
  placeholder,
  type = 'text',
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  placeholder?: string;
  type?: string;
  onChange: (name: string, value: string) => void;
}) {
  return (
    <div>
      <label className="block mb-1.5 text-xs font-medium text-[#6B7280]">
        {label}
      </label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(name, e.target.value)}
        className="w-full h-11 rounded-xl border border-[#E5E7EB] bg-white px-3.5 text-sm text-[#111827] outline-none transition focus:border-[#4F6BFF] focus:ring-4 focus:ring-[#4F6BFF]/10"
      />
    </div>
  );
}

function SelectField({
  label,
  name,
  value,
  options,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (name: string, value: string) => void;
}) {
  return (
    <div>
      <label className="block mb-1.5 text-xs font-medium text-[#6B7280]">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        className="w-full h-11 rounded-xl border border-[#E5E7EB] bg-white px-3.5 text-sm text-[#111827] outline-none transition focus:border-[#4F6BFF] focus:ring-4 focus:ring-[#4F6BFF]/10"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function ListingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { listings, loading, error, total, page, fetchListings, setPage } = useListings({
    limit: 20,
    apiUrl: process.env.NEXT_PUBLIC_API_URL,
  });

  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>(() => {
    const initial = { ...baseFilters };
    Object.keys(initial).forEach((key) => {
      initial[key] = searchParams.get(key) || initial[key];
    });
    return initial;
  });

  const changeFilter = (name: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const buildParams = (values: Filters) => {
    const params = new URLSearchParams();
    Object.entries(values).forEach(([key, value]) => {
      if (value !== '') {
        params.set(key, value);
      }
    });
    return params;
  };

  const applyFilters = () => {
    setPage(1);
    router.push(`/listings?${buildParams(filters).toString()}`);
  };

  const selectCategory = (type: string) => {
    const nextFilters = {
      ...baseFilters,
      search: filters.search,
      address: filters.address,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      sort: filters.sort,
      type,
    };
    setFilters(nextFilters);
    setPage(1);
    router.push(`/listings?${buildParams(nextFilters).toString()}`);
  };

  const clearFilters = () => {
    setFilters({ ...baseFilters });
    setPage(1);
    setShowFilters(false);
    router.push('/listings');
  };

  const formatPrice = (price: number) => price.toLocaleString('ru-RU') + ' ₽';

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
    const category = categories.find((item) => item.value === filters.type);
    return category?.label || 'Все объявления';
  };

  const totalPages = Math.ceil(total / 20);

  // 🚨 ИСПРАВЛЕНИЯ:
  // 1. Используем useListings hook вместо прямых fetch вызовов
  // 2. Обработка ошибок встроена в hook
  // 3. Retry логика внутри fetchWithTimeout
  // 4. Валидация ответа API
  // 5. onError для изображений
  // 6. Санитизация текста

  return (
    <div className="container-custom py-5 md:py-7">
      <div className="flex items-end justify-between gap-4 mb-4">
        <div>
          <p className="text-xs font-semibold text-[#4F6BFF] mb-1">Каталог Lokven</p>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#111827]">
            {getCategoryTitle()}
          </h1>
        </div>
        <span className="hidden sm:block text-sm text-[#6B7280]">Найдено: {total}</span>
      </div>

      {/* Search and Filter Panel */}
      <div className="rounded-[22px] border border-white/70 bg-white/80 backdrop-blur-xl shadow-[0_12px_40px_rgba(15,23,42,0.08)] p-3 md:p-4 mb-5">
        <div className="flex flex-col lg:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#9CA3AF]" />
            <input
              value={filters.search}
              onChange={(e) => changeFilter('search', e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
              placeholder="Что вы ищете?"
              className="w-full h-12 rounded-xl border border-[#E5E7EB] bg-white/90 pl-11 pr-4 text-sm outline-none focus:border-[#4F6BFF]"
            />
          </div>

          <div className="relative lg:w-[220px]">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#9CA3AF]" />
            <input
              value={filters.address}
              onChange={(e) => changeFilter('address', e.target.value)}
              placeholder="Город"
              className="w-full h-12 rounded-xl border border-[#E5E7EB] bg-white/90 pl-11 pr-4 text-sm outline-none focus:border-[#4F6BFF]"
            />
          </div>

          <button
            onClick={applyFilters}
            className="h-12 px-6 rounded-xl bg-[#4F6BFF] text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(79,107,255,0.25)]"
          >
            <Search className="w-4 h-4" />
            Найти
          </button>

          <button
            onClick={() => setShowFilters((prev) => !prev)}
            className={`h-12 px-5 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 ${
              showFilters
                ? 'border-[#4F6BFF] bg-[#EEF1FF] text-[#4F6BFF]'
                : 'border-[#E5E7EB] bg-white text-[#374151]'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Фильтры
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pt-3 pb-1">
          {categories.map((category) => {
            const Icon = category.icon;
            const active = filters.type === category.value;
            return (
              <button
                key={category.value}
                onClick={() => selectCategory(category.value)}
                className={`shrink-0 h-9 px-3.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition ${
                  active
                    ? 'bg-[#111827] border-[#111827] text-white'
                    : 'bg-white/80 border-[#E5E7EB] text-[#4B5563]'
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                {category.label}
              </button>
            );
          })}
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-[#E5E7EB]">
            <div className="mb-5">
              <p className="text-sm font-semibold text-[#111827] mb-3">Основные параметры</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <Field label="Цена от" name="minPrice" value={filters.minPrice} type="number" onChange={changeFilter} />
                <Field label="Цена до" name="maxPrice" value={filters.maxPrice} type="number" onChange={changeFilter} />
                <SelectField
                  label="Сортировка"
                  name="sort"
                  value={filters.sort}
                  onChange={changeFilter}
                  options={[
                    { value: 'new', label: 'Сначала новые' },
                    { value: 'price_asc', label: 'Сначала дешевле' },
                    { value: 'price_desc', label: 'Сначала дороже' },
                    { value: 'popular', label: 'По популярности' },
                  ]}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-[#E5E7EB]">
              <button onClick={applyFilters} className="h-10 px-5 rounded-xl bg-[#4F6BFF] text-white text-sm font-semibold">
                Показать объявления
              </button>
              <button
                onClick={clearFilters}
                className="h-10 px-4 rounded-xl text-sm font-medium text-[#6B7280] flex items-center gap-2 hover:bg-[#F3F4F6]"
              >
                <X className="w-4 h-4" />
                Сбросить всё
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          <p className="font-medium">❌ Ошибка:</p>
          <p>{error}</p>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="text-center py-16 text-[#9CA3AF]">
          <div className="inline-flex flex-col items-center">
            <div className="w-8 h-8 border-4 border-[#E5E7EB] border-t-[#4F6BFF] rounded-full animate-spin mb-3"></div>
            Загрузка объявлений...
          </div>
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-16 bg-white/80 backdrop-blur-xl rounded-[24px] border border-white/70">
          <Inbox className="w-14 h-14 text-[#9CA3AF] mx-auto mb-3" />
          <p className="font-semibold text-[#374151]">Объявлений не найдено</p>
          <p className="text-sm text-[#9CA3AF] mt-1">Попробуйте изменить параметры поиска</p>
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
                  {listing.images?.length > 0 ? (
                    <img
                      src={getImageUrl(listing.images[0].url)}
                      alt={sanitizeText(listing.title)}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={handleImageError}
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Icon className="w-14 h-14 text-[#9CA3AF]" />
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="text-[15px] font-semibold text-[#111827] line-clamp-2">
                    {sanitizeText(listing.title)}
                  </h3>
                  <div className="mt-2 text-lg font-bold text-[#111827]">
                    {formatPrice(listing.price)}
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

      {/* Pagination */}
      {totalPages > 1 && !loading && listings.length > 0 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="w-10 h-10 rounded-xl border border-[#E5E7EB] bg-white flex items-center justify-center disabled:opacity-40 hover:bg-[#F3F4F6] transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <span className="px-4 text-sm font-semibold text-[#374151]">
            {page} / {totalPages}
          </span>

          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="w-10 h-10 rounded-xl border border-[#E5E7EB] bg-white flex items-center justify-center disabled:opacity-40 hover:bg-[#F3F4F6] transition"
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
