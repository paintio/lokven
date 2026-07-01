'use client';

import { useState, useEffect } from 'react';

interface Settings {
  siteName: string;
  siteDescription: string;
  commissionRate: number;
  taxRate: number;
  moderationEnabled: boolean;
  premiumPrice: number;
  currency: string;
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<Settings>({
    siteName: 'Локвен',
    siteDescription: 'Маркетплейс, доска объявлений, авто и услуги',
    commissionRate: 5,
    taxRate: 20,
    moderationEnabled: true,
    premiumPrice: 1000,
    currency: 'RUB',
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      alert('Настройки сохранены!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#111827] mb-6">⚙️ Настройки</h1>

      <form onSubmit={handleSave} className="bg-white rounded-xl p-6 border border-[#E5E7EB] max-w-2xl space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#6B7280] mb-1">Название сайта</label>
          <input
            type="text"
            value={settings.siteName}
            onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#6B7280] mb-1">Описание сайта</label>
          <textarea
            value={settings.siteDescription}
            onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
            className="input-field"
            rows={2}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#6B7280] mb-1">Комиссия (%)</label>
            <input
              type="number"
              step="0.5"
              value={settings.commissionRate}
              onChange={(e) => setSettings({ ...settings, commissionRate: parseFloat(e.target.value) })}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#6B7280] mb-1">Налог (%)</label>
            <input
              type="number"
              step="0.5"
              value={settings.taxRate}
              onChange={(e) => setSettings({ ...settings, taxRate: parseFloat(e.target.value) })}
              className="input-field"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#6B7280} mb-1">Цена премиум (₽)</label>
            <input
              type="number"
              value={settings.premiumPrice}
              onChange={(e) => setSettings({ ...settings, premiumPrice: parseFloat(e.target.value) })}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#6B7280] mb-1">Валюта</label>
            <select
              value={settings.currency}
              onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
              className="input-field"
            >
              <option value="RUB">RUB (₽)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={settings.moderationEnabled}
            onChange={(e) => setSettings({ ...settings, moderationEnabled: e.target.checked })}
            className="w-4 h-4"
          />
          <label className="text-sm text-[#6B7280]">Включить модерацию объявлений</label>
        </div>

        <button type="submit" disabled={saving} className="btn-primary w-full">
          {saving ? 'Сохранение...' : 'Сохранить настройки'}
        </button>
      </form>
    </div>
  );
}
