'use client';

import { useState } from 'react';

interface ReviewFormProps {
  orderId: string;
  sellerId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ReviewForm({ orderId, sellerId, onSuccess, onCancel }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Пожалуйста, поставьте оценку');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          rating,
          text: text.trim() || undefined,
          orderId,
          sellerId,
        }),
      });

      if (!response.ok) {
        throw new Error('Ошибка при отправке отзыва');
      }

      onSuccess();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[#6B7280] mb-2">Ваша оценка</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="focus:outline-none"
            >
              <svg
                className={`w-8 h-8 transition-colors ${
                  star <= (hoverRating || rating) ? 'text-yellow-400' : 'text-gray-300'
                }`}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            </button>
          ))}
        </div>
        {rating > 0 && (
          <p className="text-xs text-[#6B7280] mt-1">
            {rating === 5 && 'Отлично! 👍'}
            {rating === 4 && 'Хорошо'}
            {rating === 3 && 'Нормально'}
            {rating === 2 && 'Плохо'}
            {rating === 1 && 'Ужасно! 👎'}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-[#6B7280] mb-1">Текст отзыва</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          className="input-field"
          placeholder="Расскажите о своём опыте..."
          maxLength={1000}
        />
        <p className="text-xs text-[#9CA3AF] mt-1">{text.length}/1000</p>
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="btn-primary flex-1 disabled:opacity-50">
          {loading ? 'Отправка...' : 'Оставить отзыв'}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">
          Отмена
        </button>
      </div>
    </form>
  );
}
