'use client';

import { useState } from 'react';
import BaseListingForm from './BaseListingForm';

interface MarketplaceFormProps {
  initialData?: any;
  isEdit?: boolean;
}

export default function MarketplaceForm({ initialData, isEdit }: MarketplaceFormProps) {
  const [attributes, setAttributes] = useState({
    category: initialData?.attributes?.category || '',
    brand: initialData?.attributes?.brand || '',
    model: initialData?.attributes?.model || '',
    condition: initialData?.attributes?.condition || '',
    color: initialData?.attributes?.color || '',
    size: initialData?.attributes?.size || '',
    material: initialData?.attributes?.material || '',
    warranty: initialData?.attributes?.warranty || '',
    inStock: initialData?.attributes?.inStock || true,
    delivery: initialData?.attributes?.delivery || false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setAttributes({
      ...attributes,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  return (
    <BaseListingForm type="product" initialData={{ ...initialData, attributes }} isEdit={isEdit}>
      <div className="border-t border-[#E5E7EB] pt-4 mt-4">
        <h3 className="font-semibold text-[#111827] mb-3">Характеристики товара</h3>
        
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
              <option value="garden">Для сада</option>
              <option value="sport">Спорт</option>
              <option value="toys">Игрушки</option>
              <option value="books">Книги</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#6B7280] mb-1">Бренд</label>
            <input
              type="text"
              name="brand"
              value={attributes.brand}
              onChange={handleChange}
              className="input-field"
              placeholder="Apple"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#6B7280] mb-1">Модель</label>
          <input
            type="text"
            name="model"
            value={attributes.model}
            onChange={handleChange}
            className="input-field"
            placeholder="iPhone 15 Pro"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
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
              <option value="used">Б/У</option>
              <option value="refurbished">Восстановленный</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#6B7280] mb-1">Цвет</label>
            <input
              type="text"
              name="color"
              value={attributes.color}
              onChange={handleChange}
              className="input-field"
              placeholder="Космический серый"
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
              placeholder="M / 42"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#6B7280] mb-1">Материал</label>
          <input
            type="text"
            name="material"
            value={attributes.material}
            onChange={handleChange}
            className="input-field"
            placeholder="Хлопок / Кожа"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#6B7280] mb-1">Гарантия</label>
          <select
            name="warranty"
            value={attributes.warranty}
            onChange={handleChange}
            className="input-field"
          >
            <option value="">Без гарантии</option>
            <option value="1">1 месяц</option>
            <option value="3">3 месяца</option>
            <option value="6">6 месяцев</option>
            <option value="12">1 год</option>
            <option value="24">2 года</option>
          </select>
        </div>

        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm text-[#6B7280]">
            <input
              type="checkbox"
              name="inStock"
              checked={attributes.inStock}
              onChange={handleChange}
              className="w-4 h-4"
            />
            В наличии
          </label>
          <label className="flex items-center gap-2 text-sm text-[#6B7280]">
            <input
              type="checkbox"
              name="delivery"
              checked={attributes.delivery}
              onChange={handleChange}
              className="w-4 h-4"
            />
            Доставка
          </label>
        </div>
      </div>
    </BaseListingForm>
  );
}
