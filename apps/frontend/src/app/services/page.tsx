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

export default function ServicesPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    priceMin: '',
    priceMax: '',
    city: '',
    rating: '',
  });

  useEffect(() => {
    fetchListings();
  }, [filters]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('type', 'service');
      if (filters.priceMin) params.append('minPrice', filters.priceMin);
      if (filters.priceMax) params.append('maxPrice', filters.priceMax);
      if (filters.city) params.append('address', filters.city);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/listings?${params.toString()}`);
      const data = await response.json();
      setListings(data.items || []);
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('ru-RU') + ' ₽';
  };

  const categories = ['Все', 'Ремонт', 'Клининг', 'Перевозки', 'IT-услуги', 'Образование', 'Красота', 'Фото'];

  return (
    <div className="container-custom py-8">
      <h1 className="text-2xl font-bold text-[#111827] mb-6">🔧 Услуги</h1>
      
      <div className="bg-white rounded-xl p-4 border border-[#E5E7EB] mb-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <div>
            <label className="block text-xs font-medium text-[#6B7280] mb-1">Категория</label>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="input-field"
            >
              {categories.map((c) => (
                <option key={c} value={c === 'Все' ? '' : c}>{c}</option>
              ))}
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
              placeholder="100000"
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
            <label className="block text-xs font-medium text-[#6B7280] mb-1">Рейтинг</label>
            <select
              name="rating"
              value={filters.rating}
              onChange={handleFilterChange}
              className="input-field"
            >
              <option value="">Любой</option>
              <option value="4.5">★ 4.5+</option>
              <option value="4.0">★ 4.0+</option>
              <option value="3.5">★ 3.5+</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-[#9CA3AF]">Загрузка...</div>
      ) : listings.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-[#E5E7EB]">
          <div className="text-3xl mb-2">🔧</div>
          <p className="text-[#6B7280]">Услуг не найдено</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {listings.map((listing) => (
            <Link href={`/listings/${listing.id}`} key={listing.id} className="card group">
              {listing.images && listing.images.length > 0 ? (
                <img src={getImageUrl(listing.images[0].url)} alt={listing.title} className="w-full h-40 object-cover" />
              ) : (
                <div className="w-full h-40 bg-[#F3F4F6] flex items-center justify-center text-4xl">🔧</div>
              )}
              <div className="p-3">
                <h3 className="text-sm font-medium text-[#111827] line-clamp-2">{listing.title}</h3>
                <div className="mt-1">
                  <span className="text-base font-bold text-[#111827]">{formatPrice(listing.price)}</span>
                </div>
                <div className="mt-1 text-xs text-[#6B7280]">{listing.author.name || listing.author.phone}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
