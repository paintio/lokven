'use client';

import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

// Стили Swiper
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const slides = [
  {
    id: 1,
    title: 'Найдите всё, что вам нужно',
    description: 'Покупайте товары, находите работу, выбирайте автомобили, недвижимость и услуги на одной современной платформе.',
    bgImage: '/images/hero/hero-1.jpg',
    ctaText: 'Начать',
    ctaLink: '/auth/register',
  },
  {
    id: 2,
    title: 'Покупайте товары',
    description: 'Миллионы товаров от проверенных продавцов. От электроники до товаров для дома.',
    bgImage: '/images/hero/hero-2.jpg',
    ctaText: 'В маркетплейс',
    ctaLink: '/listings?category=marketplace',
  },
  {
    id: 3,
    title: 'Находите работу',
    description: 'Вакансии и карьерные возможности. Работайте в лучших компаниях.',
    bgImage: '/images/hero/hero-3.jpg',
    ctaText: 'Найти работу',
    ctaLink: '/listings?category=jobs',
  },
  {
    id: 4,
    title: 'Выбирайте автомобили',
    description: 'Автомобили с пробегом от проверенных продавцов. Любые марки и модели.',
    bgImage: '/images/hero/hero-4.jpg',
    ctaText: 'Подобрать авто',
    ctaLink: '/listings?category=auto',
  },
  {
    id: 5,
    title: 'Недвижимость и услуги',
    description: 'Квартиры, дома, коммерческая недвижимость. А также любые услуги рядом с вами.',
    bgImage: '/images/hero/hero-5.jpg',
    ctaText: 'Смотреть объекты',
    ctaLink: '/listings?category=realty',
  },
];

export default function HeroCarousel() {
  const { isAuthenticated } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="relative rounded-2xl overflow-hidden bg-[#F3F4F6] h-[400px] md:h-[500px] flex items-center justify-center">
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
          delay: 5000,
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
        className="h-[400px] md:h-[500px]"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full h-full">
              {/* Фоновое изображение */}
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105"
                style={{ backgroundImage: `url(${slide.bgImage})` }}
              />
              
              {/* Градиентное затемнение */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
              
              {/* Дополнительное затемнение снизу */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

              {/* Контент */}
              <div className="relative h-full flex items-center">
                <div className="container-custom">
                  <div className="max-w-2xl text-white">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
                      {slide.title}
                    </h1>
                    <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
                      {slide.description}
                    </p>
                    <Link
                      href={slide.ctaLink}
                      className="inline-block px-8 py-3 bg-white text-[#6366F1] font-semibold rounded-lg hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                    >
                      {slide.ctaText}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Кастомные кнопки навигации */}
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

      {/* Стили для пагинации */}
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