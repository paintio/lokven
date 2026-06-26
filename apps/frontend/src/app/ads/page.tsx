'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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

export default function AdsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    condition: '',
    priceMin: '',
    priceMax: '',
    location: '',
    sort: 'new',
    brand: '',
    yearFrom: '',
    yearTo: '',
    color: '',
    size: '',
    material: '',
    exchange: '',
    bargain: '',
  });

  useEffect(() => {
    fetchListings();
  }, [filters, page]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('type', 'ads');
      if (filters.search) params.append('search', filters.search);
      if (filters.category) params.append('category', filters.category);
      if (filters.condition) params.append('condition', filters.condition);
      if (filters.priceMin) params.append('minPrice', filters.priceMin);
      if (filters.priceMax) params.append('maxPrice', filters.priceMax);
      if (filters.location) params.append('address', filters.location);
      if (filters.sort) params.append('sort', filters.sort);
      if (filters.brand) params.append('brand', filters.brand);
      if (filters.yearFrom) params.append('yearFrom', filters.yearFrom);
      if (filters.yearTo) params.append('yearTo', filters.yearTo);
      if (filters.color) params.append('color', filters.color);
      if (filters.size) params.append('size', filters.size);
      if (filters.material) params.append('material', filters.material);
      if (filters.exchange) params.append('exchange', filters.exchange);
      if (filters.bargain) params.append('bargain', filters.bargain);
      params.append('page', page.toString());
      params.append('limit', '24');

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
    fetchListings();
    setShowFilters(false);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      condition: '',
      priceMin: '',
      priceMax: '',
      location: '',
      sort: 'new',
      brand: '',
      yearFrom: '',
      yearTo: '',
      color: '',
      size: '',
      material: '',
      exchange: '',
      bargain: '',
    });
    setPage(1);
    fetchListings();
    setShowFilters(false);
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('ru-RU') + ' ₽';
  };

  const totalPages = Math.ceil(total / 24);

  // Категории для фильтра
  const categories = [
    'Все',
    'Электроника',
    'Смартфоны',
    'Компьютеры',
    'Одежда',
    'Обувь',
    'Аксессуары',
    'Для дома',
    'Мебель',
    'Спорт',
    'Игрушки',
    'Книги',
    'Музыка',
    'Другое'
  ];

  const conditions = [
    { value: '', label: 'Любое' },
    { value: 'new', label: 'Новый' },
    { value: 'excellent', label: 'Отличное' },
    { value: 'good', label: 'Хорошее' },
    { value: 'satisfactory', label: 'Удовлетворительное' },
    { value: 'needs_repair', label: 'Требует ремонта' }
  ];

  const sortOptions = [
    { value: 'new', label: 'Сначала новые' },
    { value: 'price_asc', label: 'По возрастанию цены' },
    { value: 'price_desc', label: 'По убыванию цены' },
    { value: 'popular', label: 'По популярности' }
  ];

  const colors = ['Все', 'Белый', 'Черный', 'Красный', 'Синий', 'Зеленый', 'Желтый', 'Серый', 'Коричневый', 'Розовый', 'Фиолетовый', 'Оранжевый'];

  return (
    <div className="container-custom py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#111827]">📋 Частные объявления</h1>
        <span className="text-sm text-[#6B7280]">Найдено: {total} объявлений</span>
      </div>
      
      {/* Компактная панель фильтров */}
      <div className="bg-white rounded-xl p-4 border border-[#E5E7EB] mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="text-sm font-medium text-[#3B82F6] hover:text-[#2563EB] transition-colors flex items-center gap-1"
          >
            🔍 Фильтры {showFilters ? '▲' : '▼'}
          </button>
          <span className="text-[#E5E7EB]">|</span>
          <div className="flex flex-wrap gap-2">
            {filters.category && (
              <span className="text-xs px-2 py-1 bg-[#F3F4F6] rounded-full">📂 {filters.category}</span>
            )}
            {filters.condition && (
              <span className="text-xs px-2 py-1 bg-[#F3F4F6] rounded-full">📦 {filters.condition}</span>
            )}
            {(filters.priceMin || filters.priceMax) && (
              <span className="text-xs px-2 py-1 bg-[#F3F4F6] rounded-full">
                💰 {filters.priceMin || '0'} - {filters.priceMax || '∞'} ₽
              </span>
            )}
            {filters.brand && (
              <span className="text-xs px-2 py-1 bg-[#F3F4F6] rounded-full">🏷️ {filters.brand}</span>
            )}
            {(filters.yearFrom || filters.yearTo) && (
              <span className="text-xs px-2 py-1 bg-[#F3F4F6] rounded-full">
                📅 {filters.yearFrom || '1900'} - {filters.yearTo || '2024'}
              </span>
            )}
          </div>
          <button onClick={clearFilters} className="text-sm text-[#6B7280] hover:text-[#111827] transition-colors">
            ✕ Сбросить
          </button>
        </div>
      </div>

      {/* Развернутые фильтры */}
      {showFilters && (
        <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Поиск */}
            <div>
              <label className="block text-xs font-medium text-[#6B7280] mb-1">Поиск</label>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                className="input-field"
                placeholder="Поиск по объявлениям..."
              />
            </div>

            {/* Категория */}
            <div>
              <label className="block text-xs font-medium text-[#6B7280] mb-1">Категория</label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="input-field"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat === 'Все' ? '' : cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Состояние */}
            <div>
              <label className="block text-xs font-medium text-[#6B7280] mb-1">Состояние</label>
              <select
                name="condition"
                value={filters.condition}
                onChange={handleFilterChange}
                className="input-field"
              >
                {conditions.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            {/* Цена от */}
            <div>
              <label className="block text-xs font-medium text-[#6B7280] mb-1">Цена от</label>
              <input
                type="number"
                name="priceMin"
                value={filters.priceMin}
                onChange={handleFilterChange}
                className="input-field"
                placeholder="0"
                min="0"
              />
            </div>

            {/* Цена до */}
            <div>
              <label className="block text-xs font-medium text-[#6B7280] mb-1">Цена до</label>
              <input
                type="number"
                name="priceMax"
                value={filters.priceMax}
                onChange={handleFilterChange}
                className="input-field"
                placeholder="999999"
                min="0"
              />
            </div>

            {/* Город */}
            <div>
              <label className="block text-xs font-medium text-[#6B7280] mb-1">Город</label>
              <input
                type="text"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                className="input-field"
                placeholder="Москва"
              />
            </div>

            {/* Бренд */}
            <div>
              <label className="block text-xs font-medium text-[#6B7280] mb-1">Бренд</label>
              <input
                type="text"
                name="brand"
                value={filters.brand}
                onChange={handleFilterChange}
                className="input-field"
                placeholder="Samsung, Apple и т.д."
              />
            </div>

            {/* Год от */}
            <div>
              <label className="block text-xs font-medium text-[#6B7280] mb-1">Год от</label>
              <input
                type="number"
                name="yearFrom"
                value={filters.yearFrom}
                onChange={handleFilterChange}
                className="input-field"
                placeholder="2000"
                min="1900"
                max="2025"
              />
            </div>

            {/* Год до */}
            <div>
              <label className="block text-xs font-medium text-[#6B7280] mb-1">Год до</label>
              <input
                type="number"
                name="yearTo"
                value={filters.yearTo}
                onChange={handleFilterChange}
                className="input-field"
                placeholder="2025"
                min="1900"
                max="2025"
              />
            </div>

            {/* Цвет */}
            <div>
              <label className="block text-xs font-medium text-[#6B7280] mb-1">Цвет</label>
              <select
                name="color"
                value={filters.color}
                onChange={handleFilterChange}
                className="input-field"
              >
                {colors.map((c) => (
                  <option key={c} value={c === 'Все' ? '' : c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Размер */}
            <div>
              <label className="block text-xs font-medium text-[#6B7280] mb-1">Размер</label>
              <input
                type="text"
                name="size"
                value={filters.size}
                onChange={handleFilterChange}
                className="input-field"
                placeholder="M / 42 / XL"
              />
            </div>

            {/* Материал */}
            <div>
              <label className="block text-xs font-medium text-[#6B7280] mb-1">Материал</label>
              <input
                type="text"
                name="material"
                value={filters.material}
                onChange={handleFilterChange}
                className="input-field"
                placeholder="Хлопок, Кожа и т.д."
              />
            </div>

            {/* Возможен обмен */}
            <div>
              <label className="block text-xs font-medium text-[#6B7280] mb-1">Возможен обмен</label>
              <select
                name="exchange"
                value={filters.exchange}
                onChange={handleFilterChange}
                className="input-field"
              >
                <option value="">Любой</option>
                <option value="true">Да</option>
                <option value="false">Нет</option>
              </select>
            </div>

            {/* Торг уместен */}
            <div>
              <label className="block text-xs font-medium text-[#6B7280] mb-1">Торг уместен</label>
              <select
                name="bargain"
                value={filters.bargain}
                onChange={handleFilterChange}
                className="input-field"
              >
                <option value="">Любой</option>
                <option value="true">Да</option>
                <option value="false">Нет</option>
              </select>
            </div>

            {/* Сортировка */}
            <div>
              <label className="block text-xs font-medium text-[#6B7280] mb-1">Сортировка</label>
              <select
                name="sort"
                value={filters.sort}
                onChange={handleFilterChange}
                className="input-field"
              >
                {sortOptions.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button onClick={applyFilters} className="btn-primary px-8">
              Применить
            </button>
            <button onClick={clearFilters} className="btn-secondary">
              Сбросить все
            </button>
          </div>
        </div>
      )}

      {/* Результаты */}
      {loading ? (
        <div className="text-center py-12 text-[#9CA3AF]">Загрузка...</div>
      ) : listings.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-[#E5E7EB]">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-[#6B7280] font-medium">Объявлений не найдено</p>
          <p className="text-sm text-[#9CA3AF] mt-1">Попробуйте изменить параметры поиска</p>
          <button onClick={clearFilters} className="btn-primary mt-4 inline-block">
            Сбросить фильтры
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {listings.map((listing) => (
              <Link href={`/listings/${listing.id}`} key={listing.id} className="card group">
                {listing.images && listing.images.length > 0 ? (
                  <img
                    src={getImageUrl(listing.images[0].url)}
                    alt={listing.title}
                    className="w-full h-44 object-cover bg-[#F3F4F6]"
                  />
                ) : (
                  <div className="w-full h-44 bg-[#F3F4F6] flex items-center justify-center text-4xl">📦</div>
                )}
                <div className="p-3">
                  <h3 className="text-sm font-medium text-[#111827] line-clamp-2">{listing.title}</h3>
                  <div className="mt-1">
                    <span className="text-base font-bold text-[#111827]">{formatPrice(listing.price)}</span>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {listing.attributes?.condition && (
                      <span className="text-[10px] px-2 py-0.5 bg-[#F3F4F6] rounded-full text-[#6B7280]">
                        {listing.attributes.condition}
                      </span>
                    )}
                    {listing.attributes?.color && (
                      <span className="text-[10px] px-2 py-0.5 bg-[#F3F4F6] rounded-full text-[#6B7280]">
                        {listing.attributes.color}
                      </span>
                    )}
                  </div>
                  <div className="mt-2 text-xs text-[#6B7280]">
                    {listing.author.name || listing.author.phone}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Пагинация */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-1.5 mt-8">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-outline px-3.5 py-1.5 disabled:opacity-50"
              >
                ←
              </button>
              {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 7) {
                  pageNum = i + 1;
                } else if (page <= 4) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 3) {
                  pageNum = totalPages - 6 + i;
                } else {
                  pageNum = page - 3 + i;
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
                className="btn-outline px-3.5 py-1.5 disabled:opacity-50"
              >
                →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
