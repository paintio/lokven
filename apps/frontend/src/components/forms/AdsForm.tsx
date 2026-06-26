'use client';

import { useState } from 'react';
import BaseListingForm from './BaseListingForm';

interface AdsFormProps {
  initialData?: any;
  isEdit?: boolean;
}

export default function AdsForm({ initialData, isEdit }: AdsFormProps) {
  const [attributes, setAttributes] = useState({
    category: initialData?.attributes?.category || '',
    condition: initialData?.attributes?.condition || '',
    brand: initialData?.attributes?.brand || '',
    model: initialData?.attributes?.model || '',
    year: initialData?.attributes?.year || '',
    color: initialData?.attributes?.color || '',
    size: initialData?.attributes?.size || '',
    material: initialData?.attributes?.material || '',
    reason: initialData?.attributes?.reason || '',
    exchange: initialData?.attributes?.exchange || false,
    bargain: initialData?.attributes?.bargain || false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setAttributes({
      ...attributes,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  return (
    <BaseListingForm type="ads" initialData={{ ...initialData, attributes }} isEdit={isEdit}>
      <div className="border-t border-[#E5E7EB] pt-4 mt-4">
        <h3 className="font-semibold text-[#111827] mb-3">Информация об объявлении</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#6B7280] mb-1">Категория *</label>
            <select
              name="category"
              required
              value={attributes.category}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Выберите</option>
              <option value="electronics">Электроника</option>
              <option value="phones">Смартфоны</option>
              <option value="computers">Компьютеры</option>
              <option value="clothing">Одежда</option>
              <option value="shoes">Обувь</option>
              <option value="accessories">Аксессуары</option>
              <option value="home">Для дома</option>
              <option value="furniture">Мебель</option>
              <option value="sport">Спорт</option>
              <option value="toys">Игрушки</option>
              <option value="books">Книги</option>
              <option value="music">Музыка</option>
              <option value="other">Другое</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#6B7280] mb-1">Состояние</label>
            <select
              name="condition"
              value={attributes.condition}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Выберите</option>
              <option value="new">Новый</option>
              <option value="excellent">Отличное</option>
              <option value="good">Хорошее</option>
              <option value="satisfactory">Удовлетворительное</option>
              <option value="needs_repair">Требует ремонта</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#6B7280] mb-1">Бренд</label>
            <input
              type="text"
              name="brand"
              value={attributes.brand}
              onChange={handleChange}
              className="input-field"
              placeholder="Samsung"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#6B7280] mb-1">Модель</label>
            <input
              type="text"
              name="model"
              value={attributes.model}
              onChange={handleChange}
              className="input-field"
              placeholder="Galaxy S24"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#6B7280] mb-1">Год</label>
            <input
              type="number"
              name="year"
              min="1900"
              max={new Date().getFullYear()}
              value={attributes.year}
              onChange={handleChange}
              className="input-field"
              placeholder="2023"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#6B7280] mb-1">Цвет</label>
            <input
              type="text"
              name="color"
              value={attributes.color}
              onChange={handleChange}
              className="input-field"
              placeholder="Черный"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#6B7280] mb-1">Размер</label>
            <input
              type="text"
              name="size"
              value={attributes.size}
              onChange={handleChange}
              className="input-field"
              placeholder="M"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#6B7280] mb-1">Причина продажи</label>
          <input
            type="text"
            name="reason"
            value={attributes.reason}
            onChange={handleChange}
            className="input-field"
            placeholder="Не подошёл размер"
          />
        </div>

        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm text-[#6B7280]">
            <input
              type="checkbox"
              name="exchange"
              checked={attributes.exchange}
              onChange={handleChange}
              className="w-4 h-4"
            />
            Возможен обмен
          </label>
          <label className="flex items-center gap-2 text-sm text-[#6B7280]">
            <input
              type="checkbox"
              name="bargain"
              checked={attributes.bargain}
              onChange={handleChange}
              className="w-4 h-4"
            />
            Торг уместен
          </label>
        </div>
      </div>
    </BaseListingForm>
  );
}
