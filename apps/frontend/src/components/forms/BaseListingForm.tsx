'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ImageUploader from '@/components/ImageUploader';

// Карта соответствия типа -> slug категории
const CATEGORY_SLUGS: Record<string, string> = {
  ads: 'ads',
  auto: 'avto',
  realty: 'nedvizhimost',
  job: 'rabota',
  product: 'marketplace',
  service: 'uslugi',
};

interface BaseListingFormProps {
  type: string;
  children: React.ReactNode;
  initialData?: any;
  isEdit?: boolean;
}

export default function BaseListingForm({ type, children, initialData, isEdit }: BaseListingFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    currency: 'RUB',
    address: '',
    lat: '',
    lng: '',
    images: [] as string[],
    attributes: {},
    ...initialData,
  });

  // Получаем ID категории при монтировании
  useEffect(() => {
    const fetchCategoryId = async () => {
      try {
        const slug = CATEGORY_SLUGS[type];
        if (!slug) {
          console.warn(`No category slug for type: ${type}`);
          return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories?slug=${slug}`);
        
        if (!response.ok) {
          console.error(`Failed to fetch category: ${response.status}`);
          return;
        }

        const data = await response.json();
        
        // Обрабатываем ответ — если это объект, используем его, если массив — берём первый
        const category = Array.isArray(data) ? data[0] : data;
        
        if (category && category.id) {
          setCategoryId(category.id);
          console.log(`✅ Category found: ${category.name} (${category.id})`);
        } else {
          console.warn(`❌ Category not found for slug: ${slug}`);
        }
      } catch (error) {
        console.error('Error fetching category:', error);
      }
    };

    fetchCategoryId();
  }, [type]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImagesUpload = (urls: string[]) => {
    setFormData({ ...formData, images: urls });
  };

  useEffect(() => {
    if (initialData?.attributes) {
      setFormData((prev: any) => ({
        ...prev,
        attributes: initialData.attributes,
      }));
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        alert('Необходимо авторизоваться');
        router.push('/auth/login');
        return;
      }
      const user = JSON.parse(userStr);

      // Проверяем, что категория найдена
      if (!categoryId) {
        alert('Ошибка: категория не найдена. Попробуйте обновить страницу.');
        setLoading(false);
        return;
      }

      const data = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        lat: formData.lat ? parseFloat(formData.lat) : undefined,
        lng: formData.lng ? parseFloat(formData.lng) : undefined,
        type: type,
        authorId: user.id,
        categoryId: categoryId, // 👈 ДОБАВЛЯЕМ categoryId
        attributes: formData.attributes || {},
        images: formData.images,
      };

      console.log('📤 Sending data:', data);

      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/listings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Ошибка создания объявления');
      }

      const result = await response.json();
      console.log('✅ Listing created:', result);

      router.push('/profile?tab=listings');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[#6B7280] mb-1">Название *</label>
        <input
          type="text"
          name="title"
          required
          value={formData.title}
          onChange={handleChange}
          className="input-field w-full"
          placeholder="Введите название"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#6B7280] mb-1">Описание</label>
        <textarea
          name="description"
          rows={4}
          value={formData.description}
          onChange={handleChange}
          className="input-field w-full"
          placeholder="Подробное описание"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#6B7280] mb-1">Цена (₽) *</label>
          <input
            type="number"
            name="price"
            required
            min="0"
            step="1"
            value={formData.price}
            onChange={handleChange}
            className="input-field w-full"
            placeholder="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#6B7280] mb-1">Валюта</label>
          <select name="currency" value={formData.currency} onChange={handleChange} className="input-field w-full">
            <option value="RUB">₽</option>
            <option value="USD">$</option>
            <option value="EUR">€</option>
          </select>
        </div>
      </div>

      {children}

      <div>
        <label className="block text-sm font-medium text-[#6B7280] mb-2">Изображения</label>
        <ImageUploader
          onUpload={handleImagesUpload}
          existingImages={formData.images}
          maxFiles={10}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#6B7280] mb-1">Адрес</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="input-field w-full"
          placeholder="г. Москва, ул. Тверская, 1"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#6B7280] mb-1">Широта</label>
          <input
            type="number"
            name="lat"
            step="0.000001"
            value={formData.lat}
            onChange={handleChange}
            className="input-field w-full"
            placeholder="55.7558"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#6B7280] mb-1">Долгота</label>
          <input
            type="number"
            name="lng"
            step="0.000001"
            value={formData.lng}
            onChange={handleChange}
            className="input-field w-full"
            placeholder="37.6176"
          />
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button type="submit" disabled={loading} className="btn-primary flex-1 disabled:opacity-50">
          {loading ? 'Создание...' : isEdit ? 'Сохранить' : 'Опубликовать'}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-secondary">
          Отмена
        </button>
      </div>
    </form>
  );
}