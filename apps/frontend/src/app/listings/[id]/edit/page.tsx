'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import AutoForm from '@/components/forms/AutoForm';
import RealtyForm from '@/components/forms/RealtyForm';
import JobsForm from '@/components/forms/JobsForm';
import MarketplaceForm from '@/components/forms/MarketplaceForm';
import AdsForm from '@/components/forms/AdsForm';
import ServicesForm from '@/components/forms/ServicesForm';

export default function EditListingPage() {
  const params = useParams();
  const router = useRouter();
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (params.id) {
      fetchListing();
    }
  }, [params.id]);

  const fetchListing = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/listings/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Объявление не найдено');
      }

      const data = await response.json();
      
      // Проверяем, что пользователь - владелец
      const userStr = localStorage.getItem('user');
      const user = JSON.parse(userStr || '{}');
      if (data.author.id !== user.id && user.role !== 'admin') {
        setError('У вас нет прав на редактирование этого объявления');
        return;
      }

      setListing(data);
    } catch (error) {
      console.error('Error fetching listing:', error);
      setError('Ошибка загрузки объявления');
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => {
    if (!listing) return null;

    const props = {
      initialData: listing,
      isEdit: true,
    };

    switch (listing.type) {
      case 'auto':
        return <AutoForm {...props} />;
      case 'realty':
        return <RealtyForm {...props} />;
      case 'job':
        return <JobsForm {...props} />;
      case 'product':
        return <MarketplaceForm {...props} />;
      case 'ads':
        return <AdsForm {...props} />;
      case 'service':
        return <ServicesForm {...props} />;
      default:
        return <AutoForm {...props} />;
    }
  };

  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      product: 'Маркетплейс',
      ads: 'Объявление',
      auto: 'Авто',
      realty: 'Недвижимость',
      job: 'Работа',
      service: 'Услуга',
    };
    return types[type] || type;
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      product: '🛍️',
      ads: '📋',
      auto: '🚗',
      realty: '🏠',
      job: '💼',
      service: '🔧',
    };
    return icons[type] || '📌';
  };

  if (loading) {
    return (
      <div className="container-custom py-12 text-center text-[#9CA3AF]">
        Загрузка...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-custom py-12 text-center">
        <div className="text-4xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-[#111827] mb-2">Ошибка</h1>
        <p className="text-[#6B7280] mb-4">{error}</p>
        <Link href="/profile" className="btn-primary">Вернуться в профиль</Link>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="container-custom py-12 text-center">
        <div className="text-4xl mb-4">🔍</div>
        <h1 className="text-2xl font-bold text-[#111827] mb-2">Объявление не найдено</h1>
        <Link href="/profile" className="btn-primary">Вернуться в профиль</Link>
      </div>
    );
  }

  return (
    <div className="container-custom max-w-3xl py-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">{getTypeIcon(listing.type)}</span>
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Редактирование объявления</h1>
          <p className="text-sm text-[#6B7280]">
            {getTypeLabel(listing.type)} • {listing.title}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 border border-[#E5E7EB]">
        {renderForm()}
      </div>
    </div>
  );
}
