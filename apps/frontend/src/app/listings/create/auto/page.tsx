'use client';

import AutoForm from '@/components/forms/AutoForm';
import { Car } from 'lucide-react';

export default function CreateAutoListing() {
  return (
    <div className="container-custom max-w-3xl py-8">
      <div className="flex items-center gap-3 mb-6">
        <Car className="w-8 h-8 text-[#6366F1]" />
        <h1 className="text-2xl font-bold text-[#111827]">Продажа автомобиля</h1>
      </div>
      <div className="bg-white rounded-xl p-6 border border-[#E5E7EB]">
        <AutoForm />
      </div>
    </div>
  );
}