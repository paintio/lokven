'use client';

import AdsForm from '@/components/forms/AdsForm';
import { Megaphone } from 'lucide-react';

export default function CreateAdsListing() {
  return (
    <div className="container-custom max-w-3xl py-8">
      <div className="flex items-center gap-3 mb-6">
        <Megaphone className="w-8 h-8 text-[#6366F1]" />
        <h1 className="text-2xl font-bold text-[#111827]">Создать частное объявление</h1>
      </div>
      <div className="bg-white rounded-xl p-6 border border-[#E5E7EB]">
        <AdsForm />
      </div>
    </div>
  );
}