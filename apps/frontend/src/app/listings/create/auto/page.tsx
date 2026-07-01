'use client';

import AutoForm from '@/components/forms/AutoForm';

export default function CreateAutoListing() {
  return (
    <div className="container-custom max-w-3xl py-8">
      <h1 className="text-2xl font-bold text-[#111827] mb-6">🚗 Продажа автомобиля</h1>
      <div className="bg-white rounded-xl p-6 border border-[#E5E7EB]">
        <AutoForm />
      </div>
    </div>
  );
}
