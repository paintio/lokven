'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface FooterLink {
  id: string;
  group: string;
  label: string;
  url: string;
  order: number;
  isActive: boolean;
}

const GROUP_LABELS: Record<string, string> = {
  about: 'О компании',
  buyers: 'Покупателям',
  sellers: 'Продавцам',
  help: 'Помощь',
};

const GROUP_ORDER = ['about', 'buyers', 'sellers', 'help'];

export default function Footer() {
  const [links, setLinks] = useState<FooterLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cms/footer`);
      const data = await response.json();
      setLinks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching footer links:', error);
      setLinks([]);
    } finally {
      setLoading(false);
    }
  };

  const groupedLinks = links.reduce((acc, link) => {
    if (!acc[link.group]) acc[link.group] = [];
    acc[link.group].push(link);
    return acc;
  }, {} as Record<string, FooterLink[]>);

  if (loading) {
    return (
      <footer className="bg-white border-t border-[#E5E7EB] py-8 mt-8">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-8 border-b border-[#E5E7EB]">
            {GROUP_ORDER.map((groupKey) => (
              <div key={groupKey}>
                <h3 className="text-sm font-semibold text-[#111827] mb-3">
                  {GROUP_LABELS[groupKey] || groupKey}
                </h3>
                <div className="space-y-2">
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 text-xs text-[#9CA3AF]">
            <span>© 2026 Локвен. Все права защищены.</span>
            <div className="flex items-center gap-6">
              <span className="h-3 w-20 bg-gray-200 rounded"></span>
              <span className="h-3 w-24 bg-gray-200 rounded"></span>
              <span className="h-3 w-16 bg-gray-200 rounded"></span>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-white border-t border-[#E5E7EB] py-8 mt-8">
      <div className="container-custom">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-8 border-b border-[#E5E7EB]">
          {GROUP_ORDER.map((groupKey) => {
            const groupLinks = groupedLinks[groupKey] || [];
            return (
              <div key={groupKey}>
                <h3 className="text-sm font-semibold text-[#111827] mb-3">
                  {GROUP_LABELS[groupKey] || groupKey}
                </h3>
                {groupLinks.length === 0 ? (
                  <p className="text-sm text-[#9CA3AF]">Нет ссылок</p>
                ) : (
                  <ul className="space-y-2 text-sm text-[#6B7280]">
                    {groupLinks
                      .filter(link => link.isActive)
                      .sort((a, b) => a.order - b.order)
                      .map((link) => (
                        <li key={link.id}>
                          <Link href={link.url} className="hover:text-[#111827] transition-colors">
                            {link.label}
                          </Link>
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 text-xs text-[#9CA3AF]">
          <span>© 2026 Локвен. Все права защищены.</span>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-[#4B5563] transition-colors">
              Пользовательское соглашение
            </Link>
            <Link href="/privacy" className="hover:text-[#4B5563] transition-colors">
              Политика конфиденциальности
            </Link>
            <Link href="/rules" className="hover:text-[#4B5563] transition-colors">
              Правила использования
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
