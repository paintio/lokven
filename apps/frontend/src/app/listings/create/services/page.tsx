'use client';

import ServicesForm from '@/components/forms/ServicesForm';

export default function CreateServicesListing() {
  return (
    <div className="container-custom max-w-3xl py-8">
      <h1 className="text-2xl font-bold text-[#111827] mb-6">🔧 Создать услугу</h1>
      <div className="bg-white rounded-xl p-6 border border-[#E5E7EB]">
        <ServicesForm />
      </div>
    </div>
  );
}
