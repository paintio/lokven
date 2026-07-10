'use client';

import MarketplaceForm from '@/components/forms/MarketplaceForm';
import { ShoppingBag } from 'lucide-react';

export default function CreateMarketplaceListing() {
  return (
    <div className="container-custom max-w-3xl py-8">
      <div className="flex items-center gap-3 mb-6">
        <ShoppingBag className="w-8 h-8 text-[#6366F1]" />
        <h1 className="text-2xl font-bold text-[#111827]">Создать объявление в Маркетплейсе</h1>
      </div>
      <div className="bg-white rounded-xl p-6 border border-[#E5E7EB]">
        <MarketplaceForm />
      </div>
    </div>
  );
}