'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

interface PageData {
  id: string;
  slug: string;
  title: string;
  content: string;
  metaTitle: string | null;
  metaDescription: string | null;
  isActive: boolean;
}

export default function DynamicPage() {
  const params = useParams();
  const [page, setPage] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (params.slug) {
      fetchPage();
    }
  }, [params.slug]);

  const fetchPage = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cms/pages/${params.slug}`);
      
      if (response.status === 404) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      
      const data = await response.json();
      setPage(data);
    } catch (error) {
      console.error('Error fetching page:', error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container-custom py-12 text-center text-[#9CA3AF]">
        Загрузка...
      </div>
    );
  }

  if (notFound || !page) {
    return (
      <div className="container-custom py-12 text-center">
        <div className="text-6xl mb-4"><Search className="w-16 h-16 text-[#9CA3AF] mx-auto mb-4" /></div>
        <h1 className="text-2xl font-bold text-[#111827] mb-2">Страница не найдена</h1>
        <p className="text-[#6B7280] mb-4">Запрашиваемая страница не существует</p>
        <a href="/" className="btn-primary">Вернуться на главную</a>
      </div>
    );
  }

  return (
    <div className="container-custom py-8 max-w-4xl">
      <div className="bg-white rounded-xl p-8 border border-[#E5E7EB]">
        <h1 className="text-3xl font-bold text-[#111827] mb-6">{page.title}</h1>
        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: page.content || '' }}
        />
      </div>
    </div>
  );
}
