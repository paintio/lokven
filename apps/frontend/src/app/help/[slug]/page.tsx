'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function HelpPage() {
  const params = useParams();
  // 👈 ПРЕОБРАЗУЕМ slug в строку (если массив — склеиваем через /)
  const slug = params?.slug ? (Array.isArray(params.slug) ? params.slug.join('/') : params.slug) : '';
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchContent();
    }
  }, [slug]);

  const fetchContent = async () => {
    try {
      // 👈 ПЫТАЕМСЯ ПОЛУЧИТЬ ИЗ CMS
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cms/pages/${slug}`);
      if (response.ok) {
        const data = await response.json();
        setContent(data);
        setLoading(false);
        return;
      }
    } catch (error) {
      console.error('Error fetching page:', error);
    }

    // 👈 ЕСЛИ НЕ НАШЛИ — ИСПОЛЬЗУЕМ СТАТИЧНУЮ ЗАГЛУШКУ
    const slugParts = slug.split('/');
    const lastSlug = slugParts[slugParts.length - 1];
    
    const staticPages: Record<string, { title: string; content: string }> = {
      'buyer': {
        title: 'Как покупать',
        content: 'Инструкция по покупке товаров на Lokven...',
      },
      'delivery': {
        title: 'Доставка',
        content: 'Информация о доставке...',
      },
      'seller': {
        title: 'Как продавать',
        content: 'Инструкция по продаже товаров на Lokven...',
      },
      'faq': {
        title: 'FAQ',
        content: 'Часто задаваемые вопросы...',
      },
      'payment': {
        title: 'Оплата',
        content: 'Способы оплаты...',
      },
      'return': {
        title: 'Возврат',
        content: 'Условия возврата...',
      },
      'security': {
        title: 'Безопасность',
        content: 'Информация о безопасности...',
      },
      'promotion': {
        title: 'Продвижение',
        content: 'Как продвигать объявления...',
      },
      'warranty': {
        title: 'Гарантии',
        content: 'Информация о гарантиях...',
      },
      'seller-faq': {
        title: 'Помощь продавцу',
        content: 'Часто задаваемые вопросы для продавцов...',
      },
    };

    const page = staticPages[lastSlug] || { 
      title: 'Страница не найдена', 
      content: 'Информация отсутствует' 
    };
    
    setContent(page);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="container-custom py-12 text-center text-[#9CA3AF]">
        Загрузка...
      </div>
    );
  }

  if (!content) {
    return (
      <div className="container-custom py-12 text-center">
        <h1 className="text-2xl font-bold text-[#111827] mb-2">Страница не найдена</h1>
        <Link href="/" className="btn-primary">Вернуться на главную</Link>
      </div>
    );
  }

  return (
    <div className="container-custom py-12 max-w-3xl">
      <Link href="/" className="inline-flex items-center gap-2 text-[#6B7280] hover:text-[#111827] transition mb-6">
        <ArrowLeft className="w-4 h-4" />
        Назад
      </Link>
      <h1 className="text-3xl font-bold text-[#111827] mb-4">{content.title}</h1>
      <div className="prose prose-lg text-[#4B5563]">
        <p>{content.content}</p>
      </div>
    </div>
  );
}