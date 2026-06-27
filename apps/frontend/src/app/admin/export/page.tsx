'use client';

import { useState } from 'react';

export default function AdminExport() {
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState('listings');

  const handleExport = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/export/${type}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      const data = await response.json();
      
      if (data.length > 0) {
        const headers = Object.keys(data[0]);
        const csv = [
          headers.join(','),
          ...data.map((row: any) => headers.map(h => JSON.stringify(row[h] || '')).join(','))
        ].join('\n');
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${type}_export_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        alert('Нет данных для экспорта');
      }
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Ошибка при экспорте данных');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-[#111827] mb-6">📥 Экспорт данных</h1>
      
      <div className="bg-white rounded-xl p-6 border border-[#E5E7EB]">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#6B7280] mb-1">Тип данных</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="input-field"
            >
              <option value="listings">Объявления</option>
              <option value="users">Пользователи</option>
              <option value="orders">Заказы</option>
              <option value="reviews">Отзывы</option>
            </select>
          </div>
          
          <button
            onClick={handleExport}
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50"
          >
            {loading ? 'Экспорт...' : '📥 Экспортировать в CSV'}
          </button>
          
          <p className="text-xs text-[#9CA3AF] text-center">
            Данные будут экспортированы в формате CSV
          </p>
        </div>
      </div>
    </div>
  );
}
