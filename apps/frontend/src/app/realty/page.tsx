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

export default function RealtyPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    realtyType: '',
    rooms: '',
    priceMin: '',
    priceMax: '',
    areaMin: '',
    areaMax: '',
    city: '',
    floor: '',
  });

  useEffect(() => {
    fetchListings();
  }, [filters, page]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('type', 'realty');
      if (filters.realtyType) params.append('realtyType', filters.realtyType);
      if (filters.rooms) params.append('rooms', filters.rooms);
      if (filters.priceMin) params.append('minPrice', filters.priceMin);
      if (filters.priceMax) params.append('maxPrice', filters.priceMax);
      if (filters.areaMin) params.append('areaMin', filters.areaMin);
      if (filters.areaMax) params.append('areaMax', filters.areaMax);
      if (filters.city) params.append('address', filters.city);
      if (filters.floor) params.append('floor', filters.floor);
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
    fetchListings();
  };

  const clearFilters = () => {
    setFilters({
      realtyType: '',
      rooms: '',
      priceMin: '',
      priceMax: '',
      areaMin: '',
      areaMax: '',
      city: '',
      floor: '',
    });
    setPage(1);
    fetchListings();
  };

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return (price / 1000000).toFixed(1) + ' млн ₽';
    }
    return price.toLocaleString('ru-RU') + ' ₽';
  };

  const totalPages = Math.ceil(total / 20);

  return (
    <div className="container-custom py-8">
      <h1 className="text-2xl font-bold text-[#111827] mb-6">🏠 Недвижимость</h1>
      
      <div className="bg-white rounded-xl p-4 border border-[#E5E7EB] mb-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-medium text-[#6B7280] mb-1">Тип недвижимости</label>
            <select
              name="realtyType"
              value={filters.realtyType}
              onChange={handleFilterChange}
              className="input-field"
            >
              <option value="">Все</option>
              <option value="apartment">Квартира</option>
              <option value="house">Дом</option>
              <option value="land">Участок</option>
              <option value="commercial">Коммерческая</option>
              <option value="townhouse">Таунхаус</option>
              <option value="cottage">Коттедж</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#6B7280] mb-1">Комнат</label>
            <select
              name="rooms"
              value={filters.rooms}
              onChange={handleFilterChange}
              className="input-field"
            >
              <option value="">Любое</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5+</option>
              <option value="studio">Студия</option>
            </select>
          </div>
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
          <div>
            <label className="block text-xs font-medium text-[#6B7280] mb-1">Цена до</label>
            <input
              type="number"
              name="priceMax"
              value={filters.priceMax}
              onChange={handleFilterChange}
              className="input-field"
              placeholder="10000000"
              min="0"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#6B7280] mb-1">Площадь от (м²)</label>
            <input
              type="number"
              name="areaMin"
              value={filters.areaMin}
              onChange={handleFilterChange}
              className="input-field"
              placeholder="0"
              min="0"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#6B7280] mb-1">Площадь до (м²)</label>
            <input
              type="number"
              name="areaMax"
              value={filters.areaMax}
              onChange={handleFilterChange}
              className="input-field"
              placeholder="200"
              min="0"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#6B7280] mb-1">Город</label>
            <input
              type="text"
              name="city"
              value={filters.city}
              onChange={handleFilterChange}
              className="input-field"
              placeholder="Москва"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#6B7280] mb-1">Этаж</label>
            <select
              name="floor"
              value={filters.floor}
              onChange={handleFilterChange}
              className="input-field"
            >
              <option value="">Любой</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5+</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 mt-3">
          <button onClick={applyFilters} className="btn-primary">
            Применить
          </button>
          <button onClick={clearFilters} className="btn-secondary">
            Сбросить
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-[#9CA3AF]">Загрузка...</div>
      ) : listings.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-[#E5E7EB]">
          <div className="text-3xl mb-2">🏠</div>
          <p className="text-[#6B7280]">Объявлений не найдено</p>
          <button onClick={clearFilters} className="btn-primary mt-4 inline-block">
            Сбросить фильтры
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {listings.map((listing) => (
            <Link href={`/listings/${listing.id}`} key={listing.id} className="card group">
              {listing.images && listing.images.length > 0 ? (
                <img src={getImageUrl(listing.images[0].url)} alt={listing.title} className="w-full h-40 object-cover" />
              ) : (
                <div className="w-full h-40 bg-[#F3F4F6] flex items-center justify-center text-4xl">🏠</div>
              )}
              <div className="p-3">
                <h3 className="text-sm font-medium text-[#111827] line-clamp-2">{listing.title}</h3>
                <div className="mt-1">
                  <span className="text-base font-bold text-[#111827]">{formatPrice(listing.price)}</span>
                </div>
                {listing.attributes && (
                  <div className="mt-1 text-xs text-[#6B7280]">
                    {listing.attributes.rooms && `${listing.attributes.rooms} комн.`}
                    {listing.attributes.area && ` • ${listing.attributes.area} м²`}
                    {listing.attributes.floor && ` • ${listing.attributes.floor} этаж`}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-1.5 mt-8">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="btn-outline px-3.5 py-1.5 disabled:opacity-50"
          >
            ←
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
            className="btn-outline px-3.5 py-1.5 disabled:opacity-50"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}
