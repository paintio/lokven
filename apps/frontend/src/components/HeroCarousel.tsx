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
    title: 'Покупайте товары',
    description: 'Миллионы товаров для дома, электроники, красоты, спорта и многое другое.',
    image: '/images/hero/hero-shopping.png',
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
    title: 'Находите работу',
    description: 'Тысячи вакансий от проверенных работодателей по всей стране.',
    image: '/images/hero/hero-career.png',
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
    title: 'Выбирайте автомобили',
    description: 'Новые и автомобили с пробегом от частных продавцов и дилеров.',
    image: '/images/hero/hero-driving.png',
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
    title: 'Покупайте и арендуйте недвижимость',
    description: 'Квартиры, дома, коммерческие помещения и земельные участки.',
    image: '/images/hero/hero-realty.png',
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
    title: 'Находите специалистов',
    description: 'Ремонт, строительство, перевозки, обучение и сотни других услуг.',
    image: '/images/hero/hero-services.png',
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
      <div className="
        h-[420px]
        md:h-[520px]
        rounded-2xl
        bg-[#F3F4F6]
        flex
        items-center
        justify-center
        mb-12
      ">
        <span className="text-[#9CA3AF]">Загрузка...</span>
      </div>
    );
  }

  return (
    <section className="
      relative
      rounded-3xl
      overflow-hidden
      mb-12
      shadow-sm
    ">
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
        }}
        navigation={{
          nextEl: '.hero-next',
          prevEl: '.hero-prev',
        }}
        loop={true}
        speed={700}
        className="h-[420px] md:h-[520px]"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full h-full bg-[#111827]">
              {/* Фоновое изображение */}
              <img
                src={slide.image}
                alt={slide.title}
                className="
                  absolute
                  inset-0
                  w-full
                  h-full
                  object-cover
                "
              />

              {/* Затемнение для текста */}
              <div className="
                absolute
                inset-0
                bg-gradient-to-r
                from-black/70
                via-black/40
                to-black/10
              " />

              {/* Контент */}
<div className="relative h-full flex items-center">
  <div className="container-custom">
    <div className="
      max-w-xl
      bg-white/10
      backdrop-blur-md
      rounded-3xl
      p-6
      md:p-8
      shadow-xl
      border
      border-white/10
    ">
      <h1 className="
        text-3xl
        md:text-5xl
        font-bold
        text-white
        leading-tight
        mb-4
      ">
        {slide.title}
      </h1>

      <p className="
        text-white/80
        text-base
        md:text-lg
        leading-relaxed
        mb-6
      ">
        {slide.description}
      </p>

      <div className="flex flex-wrap gap-3 mb-7">
        <Link
          href={slide.primaryLink}
          className="
            px-6
            py-3
            bg-white
            text-[#111827]
            rounded-xl
            font-medium
            hover:bg-white/90
            transition
          "
        >
          {slide.primaryText}
        </Link>

        <Link
          href={slide.secondaryLink}
          className="
            px-6
            py-3
            bg-white/20
            text-white
            rounded-xl
            font-medium
            hover:bg-white/30
            transition
            border
            border-white/20
          "
        >
          {slide.secondaryText}
        </Link>
      </div>

      {/* Статистика */}
      <div className="
        flex
        flex-wrap
        gap-5
        pt-5
        border-t
        border-white/20
      ">
        {slide.stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="
                flex
                items-center
                gap-2
                text-sm
                text-white/80
              "
            >
              <div className="
                w-8
                h-8
                rounded-lg
                bg-white/20
                flex
                items-center
                justify-center
              ">
                <Icon className="w-4 h-4 text-white" />
              </div>
              <span>{stat.value}</span>
            </div>
          );
        })}
      </div>
    </div>
  </div>
</div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Левая кнопка */}
      <button
        className="
          hero-prev
          absolute
          left-5
          top-1/2
          -translate-y-1/2
          z-10
          w-11
          h-11
          rounded-full
          bg-white/80
          backdrop-blur
          shadow-md
          flex
          items-center
          justify-center
          hover:bg-white
          transition
        "
      >
        <svg className="w-5 h-5 text-[#111827]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Правая кнопка */}
      <button
        className="
          hero-next
          absolute
          right-5
          top-1/2
          -translate-y-1/2
          z-10
          w-11
          h-11
          rounded-full
          bg-white/80
          backdrop-blur
          shadow-md
          flex
          items-center
          justify-center
          hover:bg-white
          transition
        "
      >
        <svg className="w-5 h-5 text-[#111827]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Кастомные стили для Swiper */}
      <style jsx global>{`
        .swiper-pagination {
          bottom: 24px !important;
          z-index: 20 !important;
        }

        .swiper-pagination-bullet {
          background: rgba(255, 255, 255, 0.4) !important;
          opacity: 1 !important;
          width: 10px !important;
          height: 10px !important;
          border-radius: 50% !important;
          transition: all 0.3s ease !important;
          backdrop-filter: blur(4px);
        }

        .swiper-pagination-bullet-active {
          background: #ffffff !important;
          width: 28px !important;
          border-radius: 6px !important;
        }

        .swiper-pagination-bullet:hover {
          transform: scale(1.15);
        }

        @media (max-width: 768px) {
          .hero-prev,
          .hero-next {
            display: none !important;
          }
        }

        .swiper-fade .swiper-slide {
          transition: opacity 0.7s ease-in-out !important;
        }

        .swiper-fade .swiper-slide-prev,
        .swiper-fade .swiper-slide-next {
          opacity: 0 !important;
        }

        .swiper-fade .swiper-slide-active {
          opacity: 1 !important;
        }
      `}</style>
    </section>
  );
}