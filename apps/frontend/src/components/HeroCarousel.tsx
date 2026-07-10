'use client';

import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import Link from 'next/link';
import { Package, Shield, Truck, Users, Briefcase, Car, Home, Wrench } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const slides = [
  {
    id: 1,
    number: '01',
    title: 'Покупайте товары',
    description: 'Миллионы товаров для дома, электроники, красоты, спорта и многое другое.',
    gradient: 'from-[#6366F1] to-[#8B5CF6]',
    primaryLink: '/listings?category=marketplace',
    primaryText: 'Смотреть товары →',
    secondaryLink: '/listings/create',
    secondaryText: 'Подать объявление',
    stats: [
      { value: 'Миллионы товаров', icon: Package },
      { value: 'Проверенные продавцы', icon: Shield },
      { value: 'Быстрая доставка', icon: Truck },
    ],
  },
  {
    id: 2,
    number: '02',
    title: 'Находите работу',
    description: 'Тысячи вакансий от проверенных работодателей по всей стране.',
    gradient: 'from-[#3B82F6] to-[#60A5FA]',
    primaryLink: '/listings?category=jobs',
    primaryText: 'Найти работу →',
    secondaryLink: '/listings/create',
    secondaryText: 'Разместить вакансию',
    stats: [
      { value: 'Тысячи вакансий', icon: Briefcase },
      { value: 'Проверенные компании', icon: Shield },
      { value: 'Быстрый отклик', icon: Users },
    ],
  },
  {
    id: 3,
    number: '03',
    title: 'Выбирайте автомобили',
    description: 'Новые и автомобили с пробегом от частных продавцов и дилеров.',
    gradient: 'from-[#10B981] to-[#34D399]',
    primaryLink: '/listings?category=auto',
    primaryText: 'Смотреть авто →',
    secondaryLink: '/listings/create',
    secondaryText: 'Продать автомобиль',
    stats: [
      { value: 'Любые марки', icon: Car },
      { value: 'Проверенные продавцы', icon: Shield },
      { value: 'Быстрая сделка', icon: Truck },
    ],
  },
  {
    id: 4,
    number: '04',
    title: 'Покупайте и арендуйте недвижимость',
    description: 'Квартиры, дома, коммерческие помещения и земельные участки.',
    gradient: 'from-[#8B5CF6] to-[#A78BFA]',
    primaryLink: '/listings?category=realty',
    primaryText: 'Смотреть объекты →',
    secondaryLink: '/listings/create',
    secondaryText: 'Разместить объект',
    stats: [
      { value: 'Тысячи объектов', icon: Home },
      { value: 'Проверенные агенты', icon: Shield },
      { value: 'Быстрый поиск', icon: Users },
    ],
  },
  {
    id: 5,
    number: '05',
    title: 'Находите специалистов',
    description: 'Ремонт, строительство, перевозки, обучение и сотни других услуг.',
    gradient: 'from-[#F59E0B] to-[#FBBF24]',
    primaryLink: '/listings?category=services',
    primaryText: 'Найти специалиста →',
    secondaryLink: '/listings/create',
    secondaryText: 'Предложить услугу',
    stats: [
      { value: 'Сотни услуг', icon: Wrench },
      { value: 'Проверенные мастера', icon: Shield },
      { value: 'Быстрый заказ', icon: Truck },
    ],
  },
];

export default function HeroCarousel() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="relative rounded-2xl overflow-hidden bg-[#F3F4F6] h-[400px] md:h-[500px] flex items-center justify-center mb-12">
        <div className="text-[#9CA3AF]">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="relative rounded-2xl overflow-hidden mb-12">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect="fade"
        autoplay={{
          delay: 6000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{
          clickable: true,
          bulletActiveClass: 'swiper-pagination-bullet-active',
        }}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        loop={true}
        speed={800}
        className="h-[420px] md:h-[520px]"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full h-full">
              {/* Градиентный фон */}
              <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient}`} />
              
              {/* Декоративные круги */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 right-10 w-64 h-64 bg-white rounded-full blur-3xl" />
                <div className="absolute bottom-10 left-10 w-48 h-48 bg-white rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/20 rounded-full blur-2xl" />
              </div>

              {/* Контент */}
              <div className="relative h-full flex items-center">
                <div className="container-custom">
                  <div className="max-w-3xl text-white">
                    {/* Номер */}
                    <span className="text-4xl md:text-5xl font-bold text-white/20 mb-2 block">
                      {slide.number}
                    </span>

                    {/* Заголовок */}
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-3">
                      {slide.title}
                    </h1>

                    {/* Описание */}
                    <p className="text-base md:text-lg text-white/90 mb-6 leading-relaxed max-w-xl">
                      {slide.description}
                    </p>

                    {/* Кнопки */}
                    <div className="flex flex-wrap gap-4 mb-8">
                      <Link
                        href={slide.primaryLink}
                        className="px-6 py-2.5 bg-white text-[#6366F1] font-medium rounded-lg hover:shadow-lg hover:scale-[1.02] transition-all duration-300 text-sm md:text-base"
                      >
                        {slide.primaryText}
                      </Link>
                      <Link
                        href={slide.secondaryLink}
                        className="px-6 py-2.5 bg-white/20 backdrop-blur-sm text-white font-medium rounded-lg hover:bg-white/30 transition-all duration-300 text-sm md:text-base border border-white/10"
                      >
                        {slide.secondaryText}
                      </Link>
                    </div>

                    {/* Статистика */}
                    <div className="flex flex-wrap gap-6 md:gap-8 pt-4 border-t border-white/20">
                      {slide.stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                          <div key={index} className="flex items-center gap-2 text-sm md:text-base text-white/80">
                            <Icon className="w-4 h-4 text-white/60" />
                            <span>{stat.value}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Кнопки навигации */}
      <button className="swiper-button-prev absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 border border-white/10">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button className="swiper-button-next absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 border border-white/10">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <style jsx global>{`
        .swiper-pagination-bullet {
          background: rgba(255, 255, 255, 0.5);
          opacity: 1;
          width: 10px;
          height: 10px;
          transition: all 0.3s ease;
        }
        .swiper-pagination-bullet-active {
          background: #ffffff;
          width: 24px;
          border-radius: 5px;
        }
        .swiper-pagination {
          bottom: 24px !important;
        }
        .swiper-button-prev,
        .swiper-button-next {
          display: flex !important;
        }
        @media (max-width: 768px) {
          .swiper-button-prev,
          .swiper-button-next {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}