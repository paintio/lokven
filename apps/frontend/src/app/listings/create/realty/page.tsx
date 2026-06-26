'use client';

import RealtyForm from '@/components/forms/RealtyForm';

export default function CreateRealtyListing() {
  return (
    <div className="container-custom max-w-3xl py-8">
      <h1 className="text-2xl font-bold text-[#111827] mb-6">🏠 Продажа/Аренда недвижимости</h1>
      <div className="bg-white rounded-xl p-6 border border-[#E5E7EB]">
        <RealtyForm />
      </div>
    </div>
  );
}
