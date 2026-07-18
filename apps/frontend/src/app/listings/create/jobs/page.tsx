'use client';

import Link from 'next/link';
import {
  Briefcase,
  Shield,
  Users,
  Zap,
  Building2,
} from 'lucide-react';
import JobsForm from '@/components/forms/JobsForm';
import { useAuth } from '@/hooks/useAuth';

export default function CreateJobsListing() {
  const { user, isAuthenticated, loading } = useAuth();

  const isEmployer = user?.isSeller || user?.role === 'employer' || user?.role === 'admin';
  const isAdmin = user?.role === 'admin';

  // Если пользователь не работодатель и не админ — показываем баннер
  if (!loading && !isEmployer && !isAdmin) {
    return (
      <div className="container-custom py-8">
        {/* Хлебные крошки */}
        <div className="text-sm text-[#5E7A99] mb-4">
          Главная / <span className="text-[#0B1E33] font-medium">Создание вакансии</span>
        </div>

        {/* Герой-блок с картинкой как фон */}
        <div 
          className="relative rounded-3xl p-8 md:p-12 mb-8 border border-[#E2EDF7] overflow-hidden min-h-[320px] flex items-center"
          style={{
            backgroundImage: `url('https://res.cloudinary.com/qunkgqft/image/upload/v1784271762/hero-employer_pzn4sn.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center right',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {/* Затемнение для читаемости текста */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#EEF6FE] via-[#EEF6FE]/90 to-transparent" />
          
          <div className="relative z-10 flex-1 max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-bold text-[#0B1E33] leading-tight mb-3">
              Создавайте <span className="text-[#2B7BE4]">вакансии</span> на Lokven
            </h1>
            <p className="text-[#2E4A6E] text-base md:text-lg max-w-lg mb-5">
              Размещайте вакансии и находите лучших специалистов среди тысяч пользователей платформы.
            </p>

            <ul className="flex flex-wrap gap-4 md:gap-8 text-[#1A3452] mb-6">
              <li className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#2B7BE4]" />
                Проверенные работодатели
              </li>
              <li className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#2B7BE4]" />
                Быстрая публикация
              </li>
              <li className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#2B7BE4]" />
                Большая аудитория
              </li>
            </ul>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/profile/company"
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#2B7BE4] text-white font-semibold hover:bg-[#1A66C4] transition shadow-md"
              >
                <Building2 className="w-5 h-5" />
                Заполнить данные компании
              </Link>
              <Link
                href="/listings/create/resume"
                className="flex items-center gap-2 px-6 py-3 rounded-full border-2 border-[#C9D9EB] text-[#1E3A5F] font-semibold hover:bg-[#F0F6FE] hover:border-[#2B7BE4] transition"
              >
                <Briefcase className="w-5 h-5" />
                Разместить резюме
              </Link>
            </div>
          </div>
        </div>

        {/* Преимущества - 3 карточки */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-[#F9FCFF] p-6 rounded-2xl border border-[#E6EFF8] text-center hover:border-[#2B7BE4] hover:shadow-md transition">
            <Zap className="w-9 h-9 text-[#2B7BE4] mx-auto mb-2" />
            <h3 className="text-xl font-semibold text-[#0B1E33]">Быстрая публикация</h3>
            <p className="text-sm text-[#3C5B7C]">
              Разместите вакансию за несколько минут и получайте отклик.
            </p>
          </div>
          <div className="bg-[#F9FCFF] p-6 rounded-2xl border border-[#E6EFF8] text-center hover:border-[#2B7BE4] hover:shadow-md transition">
            <Shield className="w-9 h-9 text-[#2B7BE4] mx-auto mb-2" />
            <h3 className="text-xl font-semibold text-[#0B1E33]">Проверенные компании</h3>
            <p className="text-sm text-[#3C5B7C]">
              Все работодатели проходят проверку, повышая доверие соискателей.
            </p>
          </div>
          <div className="bg-[#F9FCFF] p-6 rounded-2xl border border-[#E6EFF8] text-center hover:border-[#2B7BE4] hover:shadow-md transition">
            <Users className="w-9 h-9 text-[#2B7BE4] mx-auto mb-2" />
            <h3 className="text-xl font-semibold text-[#0B1E33]">Тысячи соискателей</h3>
            <p className="text-sm text-[#3C5B7C]">
              Ваша вакансия будет доступна тысячам пользователей платформы.
            </p>
          </div>
        </div>

        {/* Футер */}
        <div className="text-center text-sm text-[#6B88A6] pt-4 border-t border-[#ECF2F8]">
          Lokven — создайте вакансию и найдите лучших специалистов.
        </div>
      </div>
    );
  }

  // Если пользователь — работодатель или админ, показываем форму
  return (
    <div className="container-custom max-w-3xl py-8">
      <div className="flex items-center gap-3 mb-6">
        <Briefcase className="w-8 h-8 text-[#6366F1]" />
        <h1 className="text-2xl font-bold text-[#111827]">Создать вакансию</h1>
      </div>
      <div className="bg-white rounded-xl p-6 border border-[#E5E7EB]">
        <JobsForm mode="vacancy" />
      </div>
    </div>
  );
}