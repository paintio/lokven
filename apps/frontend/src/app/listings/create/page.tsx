'use client';

import Link from 'next/link';
import Image from 'next/image';

const categories = [
  {
    id: 'marketplace',
    title: 'Маркетплейс',
    description: 'Товары и электроника',
    icon: '/icons/marketplace.svg',
    image: 'https://res.cloudinary.com/qunkgqft/image/upload/f_auto/q_auto/v1783863135/card-marketplace_cup83z.png',
    href: '/listings/create/marketplace',
    color: 'hover:border-blue-500',
    gradient: 'from-blue-500/20 to-blue-600/10'
  },
  {
    id: 'ads',
    title: 'Объявления',
    description: 'Частные объявления',
    icon: '/icons/ads.svg',
    image: 'https://res.cloudinary.com/qunkgqft/image/upload/f_auto/q_auto/v1783863122/card-ads_cslguk.png',
    href: '/listings/create/ads',
    color: 'hover:border-emerald-500',
    gradient: 'from-emerald-500/20 to-emerald-600/10'
  },
  {
    id: 'auto',
    title: 'Авто',
    description: 'Автомобили с пробегом',
    icon: '/icons/auto.svg',
    image: 'https://res.cloudinary.com/qunkgqft/image/upload/f_auto/q_auto/v1783863128/card-auto_g5rtmc.png',
    href: '/listings/create/auto',
    color: 'hover:border-purple-500',
    gradient: 'from-purple-500/20 to-purple-600/10'
  },
  {
    id: 'realty',
    title: 'Недвижимость',
    description: 'Квартиры и дома',
    icon: '/icons/realty.svg',
    image: 'https://res.cloudinary.com/qunkgqft/image/upload/f_auto/q_auto/v1783863141/card-realty_r3veyt.png',
    href: '/listings/create/realty',
    color: 'hover:border-amber-500',
    gradient: 'from-amber-500/20 to-amber-600/10'
  },
  {
    id: 'jobs',
    title: 'Работа',
    description: 'Вакансии и резюме',
    icon: '/icons/jobs.svg',
    image: 'https://res.cloudinary.com/qunkgqft/image/upload/f_auto/q_auto/v1783863132/card-jobs_m5mscy.png',
    href: '/listings/create/jobs',
    color: 'hover:border-orange-500',
    gradient: 'from-orange-500/20 to-orange-600/10'
  },
  {
    id: 'services',
    title: 'Услуги',
    description: 'Специалисты и сервисы',
    icon: '/icons/services.svg',
    image: 'https://res.cloudinary.com/qunkgqft/image/upload/f_auto/q_auto/v1783863146/card-services_cxgkxk.png',
    href: '/listings/create/services',
    color: 'hover:border-rose-500',
    gradient: 'from-rose-500/20 to-rose-600/10'
  },
];

export default function CreateListing() {
  return (
    <div className="relative overflow-hidden min-h-[80vh]">
      {/* Фон */}
      <Image
        src="https://res.cloudinary.com/qunkgqft/image/upload/v1784366546/crate-hero_vcuqqi.png"
        alt=""
        fill
        priority
        className="object-cover -z-20"
      />

      <div className="absolute inset-0 bg-white/65 backdrop-blur-[2px] -z-10" />

      <div className="container-custom py-10 relative">
        {/* Заголовок */}
        <div className="mb-10">
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[#111827] mb-3">
            Создать объявление
          </h1>
          <p className="text-lg text-[#6B7280] max-w-2xl">
            Выберите направление и начните публикацию объявления всего за несколько минут.
          </p>
        </div>

        {/* Карточки категорий */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={cat.href}
              className={`
                group
                relative
                block
                overflow-hidden
                rounded-[26px]
                h-[220px]
                border
                border-white/40
                bg-white/30
                backdrop-blur-md
                shadow-[0_10px_40px_rgba(15,23,42,0.10)]
                transition-all
                duration-500
                hover:-translate-y-2
                hover:shadow-[0_20px_60px_rgba(37,99,235,0.18)]
                ${cat.color}
              `}
            >
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                className="
                  object-cover
                  transition-all
                  duration-700
                  group-hover:scale-110
                  group-hover:brightness-105
                "
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />

              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-black/70
                  via-black/20
                  to-transparent
                  group-hover:from-black/80
                  transition-all
                  duration-500
                "
              />

              <div className="absolute inset-0 p-5 flex flex-col justify-end">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center flex-shrink-0">
                    <img
                      src={cat.icon}
                      className="w-5 h-5"
                      alt=""
                    />
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight text-white drop-shadow-lg">
                    {cat.title}
                  </h3>
                </div>

                <p className="text-sm text-white/90 leading-relaxed drop-shadow-md mb-3">
                  {cat.description}
                </p>

                <span className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  bg-white/20
                  backdrop-blur
                  px-4
                  py-2
                  font-semibold
                  text-white
                  group-hover:bg-[#2563EB]
                  transition-all
                  duration-300
                  w-fit
                ">
                  Создать
                  <svg
                    className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}