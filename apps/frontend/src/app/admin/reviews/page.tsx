'use client';

import { useState, useEffect } from 'react';

interface Review {
  id: string;
  rating: number;
  text: string | null;
  createdAt: string;
  reviewer: {
    id: string;
    name: string | null;
  };
  seller: {
    id: string;
    name: string | null;
  };
  listing: {
    id: string;
    title: string;
  };
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchReviews();
  }, [filter]);

  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/reviews`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (id: string) => {
    if (!confirm('Удалить этот отзыв?')) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/reviews/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      fetchReviews();
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (loading) {
    return <div className="text-[#9CA3AF]">Загрузка...</div>;
  }

  const renderStars = (rating: number) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#111827]">⭐ Отзывы</h1>
        <div className="flex gap-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="input-field w-48"
          >
            <option value="all">Все отзывы</option>
            <option value="5">5 ★</option>
            <option value="4">4 ★</option>
            <option value="3">3 ★</option>
            <option value="2">2 ★</option>
            <option value="1">1 ★</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Отзыв</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Оценка</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Товар</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Покупатель</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Дата</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F3F4F6]">
            {reviews.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-[#6B7280]">
                  Отзывов пока нет
                </td>
              </tr>
            ) : (
              reviews.map((review) => (
                <tr key={review.id} className="hover:bg-[#F9FAFB]">
                  <td className="px-4 py-3">
                    <div className="max-w-xs">
                      <div className="text-sm text-[#111827]">{review.text || 'Без текста'}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-yellow-400 text-sm font-medium">
                      {renderStars(review.rating)}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#111827]">{review.listing.title}</td>
                  <td className="px-4 py-3 text-sm text-[#6B7280]">
                    {review.reviewer.name || 'Пользователь'}
                  </td>
                  <td className="px-4 py-3 text-sm text-[#6B7280]">
                    {formatDate(review.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => deleteReview(review.id)}
                      className="text-red-500 hover:text-red-700 text-sm transition-colors"
                    >
                      🗑️ Удалить
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
