'use client';

import RealtyForm from '@/components/forms/RealtyForm';
import { HomeIcon } from 'lucide-react';

export default function CreateRealtyListing() {
  return (
    <div className="container-custom max-w-3xl py-8">
      <div className="flex items-center gap-3 mb-6">
        <HomeIcon className="w-8 h-8 text-[#6366F1]" />
        <h1 className="text-2xl font-bold text-[#111827]">Продажа/Аренда недвижимости</h1>
      </div>
      <div className="bg-white rounded-xl p-6 border border-[#E5E7EB]">
        <RealtyForm />
      </div>
    </div>
  );
}