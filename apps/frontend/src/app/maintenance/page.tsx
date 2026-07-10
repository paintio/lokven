'use client';

import Link from 'next/link';
import { Wrench, Clock, Mail, Shield } from 'lucide-react';

export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] px-4">
      <div className="max-w-2xl w-full bg-white/95 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl text-center">
        <div className="w-20 h-20 bg-[#6366F1]/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Wrench className="w-10 h-10 text-[#6366F1]" />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-[#111827] mb-3">
          Скоро здесь будет что-то удивительное
        </h1>

        <p className="text-[#6B7280] text-lg mb-8">
          Мы работаем над улучшением платформы. Загляните позже!
        </p>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-[#F3F4F6] rounded-xl p-4">
            <div className="text-2xl font-bold text-[#6366F1]">24/7</div>
            <div className="text-xs text-[#6B7280]">Работаем над сайтом</div>
          </div>
          <div className="bg-[#F3F4F6] rounded-xl p-4">
            <div className="text-2xl font-bold text-[#6366F1]">🚀</div>
            <div className="text-xs text-[#6B7280]">Скоро запуск</div>
          </div>
          <div className="bg-[#F3F4F6] rounded-xl p-4">
            <div className="text-2xl font-bold text-[#6366F1]">✨</div>
            <div className="text-xs text-[#6B7280]">Новый дизайн</div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 text-sm text-[#6B7280]">
          <a
            href="mailto:support@lokven.store"
            className="flex items-center gap-2 hover:text-[#6366F1] transition"
          >
            <Mail className="w-4 h-4" />
            support@lokven.store
          </a>
          <span className="text-[#E5E7EB]">|</span>
          <Link
            href="/auth/login"
            className="flex items-center gap-2 hover:text-[#6366F1] transition"
          >
            <Shield className="w-4 h-4" />
            Вход для администраторов
          </Link>
        </div>

        <div className="mt-6 pt-6 border-t border-[#E5E7EB]">
          <div className="flex items-center justify-center gap-2 text-sm text-[#9CA3AF]">
            <Clock className="w-4 h-4" />
            <span>Обновление: скоро</span>
          </div>
        </div>
      </div>
    </div>
  );
}