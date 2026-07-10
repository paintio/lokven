'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Send, Phone, Mail, MapPin, Globe } from 'lucide-react';

interface FooterLink {
  id: string;
  group: string;
  label: string;
  url: string;
  icon?: string;
  order: number;
  isActive: boolean;
}

// 👈 НОРМАЛИЗАЦИЯ НАЗВАНИЙ ГРУПП
const GROUP_LABELS: Record<string, string> = {
  // Правильные названия
  'Компании': 'Компании',
  'О компании': 'О компании',
  'Покупателям': 'Покупателям',
  'Продавцам': 'Продавцам',
  'Помощь': 'Помощь',
  'Социальные сети': 'Социальные сети',
  'Социальные сети': 'Социальные сети',
  'social': 'Социальные сети',
  'about': 'О компании',
  'buyers': 'Покупателям',
  'sellers': 'Продавцам',
  'help': 'Помощь',
};

// 👈 ПОРЯДОК ГРУПП
const GROUP_ORDER = [
  'Компании',
  'О компании',
  'Покупателям',
  'Продавцам',
  'Помощь',
  'Социальные сети',
];

// 👈 ИКОНКИ ДЛЯ СОЦСЕТЕЙ
const iconMap: Record<string, any> = {
  vk: Send,
  telegram: Send,
  youtube: Send,
  instagram: Send,
  phone: Phone,
  mail: Mail,
  map: MapPin,
  globe: Globe,
};

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

  // Группируем ссылки
  const groupedLinks = links.reduce((acc, link) => {
    // 👈 НОРМАЛИЗУЕМ НАЗВАНИЕ ГРУППЫ
    let groupKey = link.group || 'other';
    
    // Исправляем кодировку, если название содержит кракозябры
    if (groupKey.includes('Рћ') || groupKey.includes('Рџ') || groupKey.includes('РЎ')) {
      // Переопределяем по ключевым словам
      if (groupKey.includes('Рћ')) groupKey = 'О компании';
      else if (groupKey.includes('РџРѕРє')) groupKey = 'Покупателям';
      else if (groupKey.includes('РџСЂРѕ')) groupKey = 'Продавцам';
      else if (groupKey.includes('РџРѕРј')) groupKey = 'Помощь';
      else if (groupKey.includes('РЎРѕС†')) groupKey = 'Социальные сети';
    }
    
    // Если группа есть в GROUP_LABELS — используем её
    if (GROUP_LABELS[groupKey]) {
      groupKey = GROUP_LABELS[groupKey];
    }
    
    if (!acc[groupKey]) acc[groupKey] = [];
    acc[groupKey].push(link);
    return acc;
  }, {} as Record<string, FooterLink[]>);

  // Фильтруем только активные группы
  const visibleGroups = GROUP_ORDER.filter(group => 
    groupedLinks[group] && groupedLinks[group].some(link => link.isActive)
  );

  // Добавляем группы, которых нет в ORDER
  Object.keys(groupedLinks).forEach(group => {
    if (!visibleGroups.includes(group) && groupedLinks[group].some(link => link.isActive)) {
      visibleGroups.push(group);
    }
  });

  if (loading) {
    return (
      <footer className="bg-white border-t border-[#E5E7EB] py-8 mt-8">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-8 border-b border-[#E5E7EB]">
            {[1, 2, 3, 4].map((i) => (
              <div key={i}>
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-3"></div>
                <div className="space-y-2">
                  <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-white border-t border-[#E5E7EB] py-8 mt-8">
      <div className="container-custom">
        {/* 👈 РАВНОМЕРНОЕ РАСПРЕДЕЛЕНИЕ КОЛОНОК */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 pb-8 border-b border-[#E5E7EB]">
          {visibleGroups.map((groupKey) => {
            const groupLinks = groupedLinks[groupKey] || [];
            const isSocial = groupKey === 'Социальные сети' || groupKey === 'social';
            const label = GROUP_LABELS[groupKey] || groupKey;

            return (
              <div key={groupKey} className="col-span-1">
                <h3 className="text-sm font-semibold text-[#111827] mb-3">
                  {label}
                </h3>
                {groupLinks.length === 0 ? (
                  <p className="text-sm text-[#9CA3AF]">Нет ссылок</p>
                ) : (
                  <ul className="space-y-2 text-sm text-[#6B7280]">
                    {groupLinks
                      .filter(link => link.isActive)
                      .sort((a, b) => a.order - b.order)
                      .map((link) => {
                        const Icon = link.icon ? iconMap[link.icon] : null;
                        
                        if (isSocial && Icon) {
                          return (
                            <li key={link.id}>
                              <a
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-[#6366F1] transition-colors inline-flex items-center gap-2"
                              >
                                <Icon className="w-4 h-4" />
                                <span>{link.label}</span>
                              </a>
                            </li>
                          );
                        }
                        
                        return (
                          <li key={link.id}>
                            <Link
                              href={link.url}
                              className="hover:text-[#111827] transition-colors"
                            >
                              {link.label}
                            </Link>
                          </li>
                        );
                      })}
                  </ul>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 text-xs text-[#9CA3AF]">
          <span>© {new Date().getFullYear()} Локвен. Все права защищены.</span>
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