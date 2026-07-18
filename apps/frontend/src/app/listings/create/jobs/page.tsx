'use client';

import Link from 'next/link';
import {
  Briefcase,
  Shield,
  Users,
  Zap,
  ArrowRight,
  Building2,
  CheckCircle2,
} from 'lucide-react';
import JobsForm from '@/components/forms/JobsForm';
import { useAuth } from '@/hooks/useAuth';

export default function CreateJobsListing() {
  const { user, isAuthenticated, loading } = useAuth();

  // Проверяем, является ли пользователь работодателем или админом
  const isEmployer = user?.isSeller || user?.role === 'employer' || user?.role === 'admin';
  const isAdmin = user?.role === 'admin';

  // Если пользователь не работодатель и не админ — показываем баннер
  if (!loading && !isEmployer && !isAdmin) {
    return (
      <div className="min-h-[70vh] relative overflow-hidden rounded-[32px] border border-white/40 bg-white/70 backdrop-blur-xl shadow-[0_20px_80px_rgba(15,23,42,0.12)]">
        {/* Фоновое изображение из Cloudinary */}
        <div className="absolute inset-0">
          <img
            src="https://res.cloudinary.com/qunkgqft/image/upload/v1784271762/hero-employer_pzn4sn.png"
            alt="Работодатель"
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/88 to-white/55" />
        </div>

        <div className="relative z-10 px-6 py-10 md:px-10 md:py-14">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-8 items-center">
            {/* Левый контент */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#BFDBFE] bg-[#EFF6FF] px-4 py-2 text-sm font-medium text-[#1D4ED8] mb-6">
                <Briefcase className="w-4 h-4" />
                Для работодателей
              </div>

              <h1 className="text-3xl md:text-5xl font-bold text-[#111827] leading-tight mb-5">
                Размещайте вакансии
                <br />
                и находите лучших сотрудников
              </h1>

              <p className="text-lg text-[#4B5563] leading-relaxed mb-8 max-w-2xl">
                Создайте компанию в Lokven, публикуйте вакансии и получайте отклики от тысяч соискателей по всей стране. Интерфейс адаптирован под HR-команды и владельцев бизнеса.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                <div className="flex items-center gap-3 rounded-2xl border border-white/60 bg-white/80 px-4 py-3 shadow-sm">
                  <Shield className="w-5 h-5 text-[#2563EB]" />
                  <span className="font-medium text-[#111827]">Проверенные работодатели</span>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-white/60 bg-white/80 px-4 py-3 shadow-sm">
                  <Zap className="w-5 h-5 text-[#2563EB]" />
                  <span className="font-medium text-[#111827]">Публикация за несколько минут</span>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-white/60 bg-white/80 px-4 py-3 shadow-sm">
                  <Users className="w-5 h-5 text-[#2563EB]" />
                  <span className="font-medium text-[#111827]">Большая аудитория соискателей</span>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-white/60 bg-white/80 px-4 py-3 shadow-sm">
                  <Briefcase className="w-5 h-5 text-[#2563EB]" />
                  <span className="font-medium text-[#111827]">Удобное управление вакансиями</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/profile/company"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2563EB] text-white font-semibold hover:bg-[#1D4ED8] transition shadow-lg shadow-blue-500/20"
                >
                  Заполнить компанию
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/listings/create/resume"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[#D1D5DB] bg-white/80 text-[#111827] font-semibold hover:bg-white transition"
                >
                  Разместить резюме
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Правая карточка */}
            <div className="rounded-[28px] border border-white/60 bg-white/78 backdrop-blur-xl p-6 md:p-7 shadow-[0_18px_50px_rgba(15,23,42,0.14)]">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-[#2563EB]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#111827]">Что потребуется</h3>
                  <p className="text-sm text-[#6B7280]">Подготовьте данные компании перед публикацией вакансии.</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {[
                  'Название компании и описание деятельности',
                  'Контактный телефон и email',
                  'Город и адрес работы',
                  'Информация о зарплате и графике',
                  'Требования к кандидату',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-xl border border-[#E5E7EB] bg-white/80 px-4 py-3">
                    <CheckCircle2 className="w-5 h-5 text-[#16A34A] mt-0.5" />
                    <span className="text-[#111827]">{item}</span>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-[#DBEAFE] bg-[#EFF6FF] px-4 py-4">
                <div className="flex items-center gap-2 text-[#1D4ED8] font-semibold mb-1">
                  <Shield className="w-4 h-4" />
                  Проверка компании
                </div>
                <p className="text-sm text-[#1E3A8A] leading-relaxed">
                  После заполнения профиля компания получает статус работодателя и может публиковать вакансии без дополнительных ограничений.
                </p>
              </div>
            </div>
          </div>
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