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

export default function AutoPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    brand: '',
    yearFrom: '',
    yearTo: '',
    priceMin: '',
    priceMax: '',
    mileage: '',
    transmission: '',
    engine: '',
  });

  useEffect(() => {
    fetchListings();
  }, [filters, page]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('type', 'auto');
      if (filters.brand) params.append('brand', filters.brand);
      if (filters.yearFrom) params.append('yearFrom', filters.yearFrom);
      if (filters.yearTo) params.append('yearTo', filters.yearTo);
      if (filters.priceMin) params.append('minPrice', filters.priceMin);
      if (filters.priceMax) params.append('maxPrice', filters.priceMax);
      if (filters.mileage) params.append('mileage', filters.mileage);
      if (filters.transmission) params.append('transmission', filters.transmission);
      if (filters.engine) params.append('engine', filters.engine);
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
      brand: '',
      yearFrom: '',
      yearTo: '',
      priceMin: '',
      priceMax: '',
      mileage: '',
      transmission: '',
      engine: '',
    });
    setPage(1);
    fetchListings();
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('ru-RU') + ' ₽';
  };

  const brands = ['Все', 'Toyota', 'BMW', 'Mercedes', 'Audi', 'Volkswagen', 'Hyundai', 'Kia', 'Lada', 'Nissan', 'Honda', 'Ford', 'Chevrolet', 'Skoda', 'Renault', 'Mitsubishi', 'Subaru', 'Mazda', 'Lexus', 'Porsche', 'Volvo'];

  const totalPages = Math.ceil(total / 20);

  return (
    <div className="container-custom py-8">
      <h1 className="text-2xl font-bold text-[#111827] mb-6">🚗 Автомобили</h1>
      
      <div className="bg-white rounded-xl p-4 border border-[#E5E7EB] mb-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-medium text-[#6B7280] mb-1">Марка</label>
            <select
              name="brand"
              value={filters.brand}
              onChange={handleFilterChange}
              className="input-field"
            >
              {brands.map((b) => (
                <option key={b} value={b === 'Все' ? '' : b}>{b}</option>
              ))}
            </select>
          </div>
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
            <label className="block text-xs font-medium text-[#6B7280] mb-1">Пробег (км)</label>
            <input
              type="number"
              name="mileage"
              value={filters.mileage}
              onChange={handleFilterChange}
              className="input-field"
              placeholder="50000"
              min="0"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#6B7280] mb-1">Коробка</label>
            <select
              name="transmission"
              value={filters.transmission}
              onChange={handleFilterChange}
              className="input-field"
            >
              <option value="">Все</option>
              <option value="automatic">Автомат</option>
              <option value="manual">Механика</option>
              <option value="robot">Робот</option>
              <option value="cvt">Вариатор</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#6B7280] mb-1">Двигатель</label>
            <select
              name="engine"
              value={filters.engine}
              onChange={handleFilterChange}
              className="input-field"
            >
              <option value="">Все</option>
              <option value="petrol">Бензин</option>
              <option value="diesel">Дизель</option>
              <option value="electric">Электро</option>
              <option value="hybrid">Гибрид</option>
              <option value="gas">Газ</option>
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
          <div className="text-3xl mb-2">🚗</div>
          <p className="text-[#6B7280]">Автомобилей не найдено</p>
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
                <div className="w-full h-40 bg-[#F3F4F6] flex items-center justify-center text-4xl">🚗</div>
              )}
              <div className="p-3">
                <h3 className="text-sm font-medium text-[#111827] line-clamp-2">{listing.title}</h3>
                <div className="mt-1">
                  <span className="text-base font-bold text-[#111827]">{formatPrice(listing.price)}</span>
                </div>
                {listing.attributes && (
                  <div className="mt-1 text-xs text-[#6B7280]">
                    {listing.attributes.year && `${listing.attributes.year} г.`}
                    {listing.attributes.mileage && ` • ${listing.attributes.mileage.toLocaleString()} км`}
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
