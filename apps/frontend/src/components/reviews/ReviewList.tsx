'use client';

import { useState, useEffect } from 'react';
import StarRating from './StarRating';

interface Review {
  id: string;
  rating: number;
  text: string | null;
  createdAt: string;
  reviewer: {
    id: string;
    name: string | null;
    avatar: string | null;
  };
  listing: {
    id: string;
    title: string;
  };
}

interface ReviewListProps {
  sellerId: string;
}

export default function ReviewList({ sellerId }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState({
    average: 0,
    total: 0,
    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchReviews();
  }, [sellerId, page]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/reviews/seller/${sellerId}?page=${page}&limit=10`
      );
      const data = await response.json();
      setReviews(data.reviews || []);
      setStats(data.stats || { average: 0, total: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } });
      setTotalPages(Math.ceil(data.total / 10));
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
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
    return <div className="text-center py-8 text-[#9CA3AF]">Загрузка...</div>;
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-2">📝</div>
        <p className="text-[#6B7280]">Пока нет отзывов</p>
        <p className="text-sm text-[#9CA3AF] mt-1">Будьте первым, кто оставит отзыв</p>
      </div>
    );
  }

  return (
    <div>
      {/* Статистика */}
      <div className="bg-[#F9FAFB] rounded-xl p-4 mb-6">
        <div className="flex items-center gap-6 flex-wrap">
          <div>
            <div className="text-3xl font-bold text-[#111827]">{stats.average.toFixed(1)}</div>
            <StarRating rating={stats.average} size="lg" />
            <div className="text-sm text-[#6B7280] mt-1">{stats.total} отзывов</div>
          </div>
          <div className="flex-1">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center gap-2 text-sm">
                <span className="w-4 text-[#6B7280]">{star}</span>
                <div className="flex-1 h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full"
                    style={{
                      width: stats.total > 0
                        ? `${(stats.distribution[star as keyof typeof stats.distribution] / stats.total) * 100}%`
                        : '0%',
                    }}
                  />
                </div>
                <span className="w-8 text-xs text-[#9CA3AF]">
                  {stats.distribution[star as keyof typeof stats.distribution]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Список отзывов */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-[#F3F4F6] pb-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-[#F3F4F6] rounded-full flex items-center justify-center text-lg flex-shrink-0">
                {review.reviewer.avatar ? (
                  <img src={review.reviewer.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                ) : (
                  review.reviewer.name?.[0] || '👤'
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-[#111827]">
                    {review.reviewer.name || 'Пользователь'}
                  </span>
                  <StarRating rating={review.rating} size="sm" />
                  <span className="text-xs text-[#9CA3AF]">{formatDate(review.createdAt)}</span>
                </div>
                <p className="text-sm text-[#6B7280] mt-1">{review.text}</p>
                <p className="text-xs text-[#9CA3AF] mt-1">
                  Товар: {review.listing.title}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Пагинация */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-1.5 mt-6">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="btn-outline px-3 py-1 text-sm disabled:opacity-50"
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
                className={page === pageNum ? 'btn-primary px-3 py-1 text-sm' : 'btn-outline px-3 py-1 text-sm'}
              >
                {pageNum}
              </button>
            );
          })}
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="btn-outline px-3 py-1 text-sm disabled:opacity-50"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}
