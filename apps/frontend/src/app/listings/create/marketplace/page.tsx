'use client';

import MarketplaceForm from '@/components/forms/MarketplaceForm';

export default function CreateMarketplaceListing() {
  return (
    <div className="container-custom max-w-3xl py-8">
      <h1 className="text-2xl font-bold text-[#111827] mb-6">🛍️ Создать объявление в Маркетплейсе</h1>
      <div className="bg-white rounded-xl p-6 border border-[#E5E7EB]">
        <MarketplaceForm />
      </div>
    </div>
  );
}
