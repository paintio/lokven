'use client';

import ServicesForm from '@/components/forms/ServicesForm';
import { Wrench } from 'lucide-react';

export default function CreateServicesListing() {
  return (
    <div className="container-custom max-w-3xl py-8">
      <div className="flex items-center gap-3 mb-6">
        <Wrench className="w-8 h-8 text-[#6366F1]" />
        <h1 className="text-2xl font-bold text-[#111827]">Предложить услугу</h1>
      </div>
      <div className="bg-white rounded-xl p-6 border border-[#E5E7EB]">
        <ServicesForm />
      </div>
    </div>
  );
}