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
  Check,
  ChevronDown,
  ChevronUp,
  MapPin,
  Calendar,
  DollarSign,
  Grid,
  List,
  Sliders,
  Inbox,
  ArrowLeft,
  ArrowRight,
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

function ListingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
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
  }, [searchParams, page, filters]);

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

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/listings?${params.toString()}`);
      const data = await response.json();
      setListings(data.items || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
    setPage(1);
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
        'avto': 'Авто',
        'nedvizhimost': 'Недвижимость',
        'elektronika': 'Электроника',
        'media-i-stil': 'Медиа и стиль',
        'dom-i-sad': 'Для дома и сада',
        'sport-i-otdyh': 'Спорт и отдых',
      };
      return names[filters.category] || filters.category;
    }
    if (filters.search) return `Результаты поиска: "${filters.search}"`;
    if (filters.type) {
      const types: Record<string, string> = {
        'product': 'Товары',
        'ads': 'Объявления',
        'auto': 'Авто',
        'realty': 'Недвижимость',
        'job': 'Работа',
        'service': 'Услуги',
      };
      return types[filters.type] || filters.type;
    }
    return 'Все объявления';
  };

  const totalPages = Math.ceil(total / 20);

  return (
    <div className="container-custom">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#111827]">
          {getCategoryTitle()}
        </h1>
        <span className="text-sm text-[#6B7280]">
          Найдено: {total} объявлений
        </span>
      </div>

      {/* Фильтры */}
      <div className="bg-white rounded-xl p-4 border border-[#E5E7EB] mb-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-medium text-[#6B7280] mb-1">Поиск</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                className="input-field pl-9"
                placeholder="Поиск..."
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#6B7280] mb-1">Категория</label>
            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="input-field"
            >
              <option value="">Все</option>
              <option value="product">Маркетплейс</option>
              <option value="ads">Объявления</option>
              <option value="auto">Авто</option>
              <option value="realty">Недвижимость</option>
              <option value="job">Работа</option>
              <option value="service">Услуги</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#6B7280] mb-1">Цена от</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
              <input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                className="input-field pl-9"
                placeholder="0"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#6B7280] mb-1">Цена до</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                className="input-field pl-9"
                placeholder="999999"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#6B7280] mb-1">Город</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
              <input
                type="text"
                name="address"
                value={filters.address}
                onChange={handleFilterChange}
                className="input-field pl-9"
                placeholder="Москва"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#6B7280] mb-1">Сортировка</label>
            <select
              name="sort"
              value={filters.sort}
              onChange={handleFilterChange}
              className="input-field"
            >
              <option value="new">Сначала новые</option>
              <option value="price_asc">По возрастанию цены</option>
              <option value="price_desc">По убыванию цены</option>
              <option value="popular">По популярности</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 mt-3">
          <button onClick={applyFilters} className="btn-primary flex items-center gap-2">
            <Search className="w-4 h-4" />
            Применить
          </button>
          <button onClick={clearFilters} className="btn-secondary flex items-center gap-2">
            <X className="w-4 h-4" />
            Сбросить
          </button>
        </div>
      </div>

      {/* Результаты */}
      {loading ? (
        <div className="text-center py-12 text-[#9CA3AF] text-sm">Загрузка...</div>
      ) : listings.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-[24px] border border-[#E5E7EB]">
          <Inbox className="w-16 h-16 text-[#9CA3AF] mx-auto mb-3" />
          <p className="text-[#6B7280] text-sm">Объявлений не найдено</p>
          <p className="text-[#9CA3AF] text-xs mt-1">Попробуйте изменить параметры поиска</p>
          <button onClick={clearFilters} className="btn-primary mt-4 inline-block">
            Сбросить фильтры
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {listings.map((listing) => {
            const Icon = getTypeIcon(listing.type);
            return (
              <a href={`/listings/${listing.id}`} key={listing.id} className="card group">
                {listing.images && listing.images.length > 0 ? (
                  <img
                    src={getImageUrl(listing.images[0].url)}
                    alt={listing.title}
                    className="w-full h-40 object-cover bg-[#F3F4F6]"
                  />
                ) : (
                  <div className="w-full h-40 bg-[#F3F4F6] flex items-center justify-center">
                    <Icon className="w-12 h-12 text-[#6B7280]" />
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
            );
          })}
        </div>
      )}

      {/* Пагинация */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-1.5 mt-8">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="btn-outline px-3.5 py-1.5 disabled:opacity-50 flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
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
                className={page === pageNum ? 'btn-primary px-3.5 py-1.5 text-sm' : 'btn-outline px-3.5 py-1.5'}
              >
                {pageNum}
              </button>
            );
          })}
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="btn-outline px-3.5 py-1.5 disabled:opacity-50 flex items-center gap-1"
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
    <Suspense fallback={<div className="container-custom py-12 text-center text-[#9CA3AF]">Загрузка...</div>}>
      <ListingsContent />
    </Suspense>
  );
}