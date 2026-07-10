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
        const categories = await response.json();
        
        // Находим категорию по slug
        const category = categories.find((c: any) => c.slug === slug);
        if (category) {
          setCategoryId(category.id);
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

      router.push('/profile?tab=listings');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* ... остальной код без изменений ... */}
    </form>
  );
}