'use client';

import Link from 'next/link';
import Image from 'next/image';

const categories = [
  {
    id: 'marketplace',
    title: 'Маркетплейс',
    description: 'Товары и электроника',
    icon: '/icons/marketplace.svg',
    image: '/images/cards/card-marketplace.png',
    href: '/listings/create/marketplace',
    color: 'from-blue-500/20 to-blue-600/10',
    border: 'hover:border-blue-500'
  },
  {
    id: 'ads',
    title: 'Объявления',
    description: 'Частные объявления',
    icon: '/icons/ads.svg',
    image: '/images/cards/card-ads.png',
    href: '/listings/create/ads',
    color: 'from-emerald-500/20 to-emerald-600/10',
    border: 'hover:border-emerald-500'
  },
  {
    id: 'auto',
    title: 'Авто',
    description: 'Автомобили с пробегом',
    icon: '/icons/auto.svg',
    image: '/images/cards/card-auto.png',
    href: '/listings/create/auto',
    color: 'from-purple-500/20 to-purple-600/10',
    border: 'hover:border-purple-500'
  },
  {
    id: 'realty',
    title: 'Недвижимость',
    description: 'Квартиры и дома',
    icon: '/icons/realty.svg',
    image: '/images/cards/card-realty.png',
    href: '/listings/create/realty',
    color: 'from-amber-500/20 to-amber-600/10',
    border: 'hover:border-amber-500'
  },
  {
    id: 'jobs',
    title: 'Работа',
    description: 'Вакансии и резюме',
    icon: '/icons/jobs.svg',
    image: '/images/cards/card-jobs.png',
    href: '/listings/create/jobs',
    color: 'from-orange-500/20 to-orange-600/10',
    border: 'hover:border-orange-500'
  },
  {
    id: 'services',
    title: 'Услуги',
    description: 'Специалисты и сервисы',
    icon: '/icons/services.svg',
    image: '/images/cards/card-services.png',
    href: '/listings/create/services',
    color: 'from-rose-500/20 to-rose-600/10',
    border: 'hover:border-rose-500'
  },
];

export default function CreateListing() {
  return (
    <div className="container-custom py-8">
      <h1 className="text-2xl font-bold text-[#111827] mb-2">Создать объявление</h1>
      <p className="text-[#6B7280] mb-6">Выберите категорию для размещения</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={cat.href}
            className={`group relative block rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-48 border-2 border-transparent ${cat.border}`}
          >
            <Image
              src={cat.image}
              alt={cat.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            
            <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} from-black/40 to-black/5 group-hover:from-black/50 group-hover:to-black/10 transition-all duration-300`} />
            
            <div className="absolute inset-0 p-5 flex flex-col justify-end">
              <div className="flex items-center gap-2 mb-1">
                <img src={cat.icon} alt="" className="w-5 h-5 text-white" />
                <h3 className="text-xl font-bold text-white drop-shadow-lg">
                  {cat.title}
                </h3>
              </div>
              
              <p className="text-sm text-white/90 leading-relaxed drop-shadow-md mb-2">
                {cat.description}
              </p>
              
              <span className="text-sm font-semibold text-white group-hover:text-white transition-colors drop-shadow-lg inline-flex items-center gap-1">
                Создать →
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
