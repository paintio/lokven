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

export default function JobsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    salaryMin: '',
    salaryMax: '',
    employment: '',
    experience: '',
    city: '',
  });

  useEffect(() => {
    fetchListings();
  }, [filters, page]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('type', 'job');
      if (filters.salaryMin) params.append('minPrice', filters.salaryMin);
      if (filters.salaryMax) params.append('maxPrice', filters.salaryMax);
      if (filters.employment) params.append('employment', filters.employment);
      if (filters.experience) params.append('experience', filters.experience);
      if (filters.city) params.append('address', filters.city);
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
      salaryMin: '',
      salaryMax: '',
      employment: '',
      experience: '',
      city: '',
    });
    setPage(1);
    fetchListings();
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('ru-RU') + ' ₽';
  };

  const totalPages = Math.ceil(total / 20);

  return (
    <div className="container-custom py-8">
      <h1 className="text-2xl font-bold text-[#111827] mb-6">💼 Работа и вакансии</h1>
      
      <div className="bg-white rounded-xl p-4 border border-[#E5E7EB] mb-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <div>
            <label className="block text-xs font-medium text-[#6B7280] mb-1">Зарплата от</label>
            <input
              type="number"
              name="salaryMin"
              value={filters.salaryMin}
              onChange={handleFilterChange}
              className="input-field"
              placeholder="0"
              min="0"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#6B7280] mb-1">Зарплата до</label>
            <input
              type="number"
              name="salaryMax"
              value={filters.salaryMax}
              onChange={handleFilterChange}
              className="input-field"
              placeholder="300000"
              min="0"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#6B7280] mb-1">Тип занятости</label>
            <select
              name="employment"
              value={filters.employment}
              onChange={handleFilterChange}
              className="input-field"
            >
              <option value="">Все</option>
              <option value="full">Полная занятость</option>
              <option value="part">Частичная занятость</option>
              <option value="project">Проектная работа</option>
              <option value="remote">Удалённая работа</option>
              <option value="internship">Стажировка</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#6B7280] mb-1">Опыт работы</label>
            <select
              name="experience"
              value={filters.experience}
              onChange={handleFilterChange}
              className="input-field"
            >
              <option value="">Не важен</option>
              <option value="none">Без опыта</option>
              <option value="1-3">1-3 года</option>
              <option value="3-6">3-6 лет</option>
              <option value="6+">Более 6 лет</option>
            </select>
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
          <div className="text-3xl mb-2">💼</div>
          <p className="text-[#6B7280]">Вакансий не найдено</p>
          <button onClick={clearFilters} className="btn-primary mt-4 inline-block">
            Сбросить фильтры
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {listings.map((listing) => (
            <Link href={`/listings/${listing.id}`} key={listing.id} className="block bg-white rounded-xl p-4 border border-[#E5E7EB] hover:border-[#3B82F6] transition-all">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-[#111827]">{listing.title}</h3>
                  <div className="text-sm text-[#6B7280] mt-1">
                    {listing.author.name || listing.author.phone}
                  </div>
                  {listing.attributes && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {listing.attributes.experience && (
                        <span className="tag">Опыт: {listing.attributes.experience}</span>
                      )}
                      {listing.attributes.employment && (
                        <span className="tag">{listing.attributes.employment}</span>
                      )}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-[#111827]">
                    {formatPrice(listing.price)}
                  </div>
                  <div className="text-xs text-[#6B7280] mt-1">
                    {new Date(listing.createdAt).toLocaleDateString('ru-RU')}
                  </div>
                </div>
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
