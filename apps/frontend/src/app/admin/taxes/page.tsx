'use client';

import { useState, useEffect } from 'react';

interface Tax {
  id: string;
  name: string;
  rate: number;
  type: string;
  isActive: boolean;
  createdAt: string;
}

export default function AdminTaxes() {
  const [taxes, setTaxes] = useState<Tax[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newTax, setNewTax] = useState({
    name: '',
    rate: 0,
    type: 'vat',
  });

  useEffect(() => {
    fetchTaxes();
  }, []);

  const fetchTaxes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/taxes`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch taxes');
      }
      
      const data = await response.json();
      setTaxes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching taxes:', error);
      setTaxes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/taxes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newTax),
      });
      setIsAdding(false);
      setNewTax({ name: '', rate: 0, type: 'vat' });
      fetchTaxes();
    } catch (error) {
      console.error('Error adding tax:', error);
    }
  };

  const toggleActive = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/taxes/${id}/toggle`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      fetchTaxes();
    } catch (error) {
      console.error('Error toggling tax:', error);
    }
  };

  const deleteTax = async (id: string) => {
    if (!confirm('Удалить налог?')) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/taxes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      fetchTaxes();
    } catch (error) {
      console.error('Error deleting tax:', error);
    }
  };

  if (loading) {
    return <div className="text-[#9CA3AF]">Загрузка...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#111827]">💰 Налоги</h1>
        <button onClick={() => setIsAdding(true)} className="btn-primary">
          + Добавить налог
        </button>
      </div>

      {isAdding && (
        <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] mb-6">
          <h3 className="font-semibold text-[#111827] mb-4">Новый налог</h3>
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#6B7280] mb-1">Название *</label>
              <input
                type="text"
                required
                value={newTax.name}
                onChange={(e) => setNewTax({ ...newTax, name: e.target.value })}
                className="input-field"
                placeholder="НДС"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#6B7280] mb-1">Ставка (%) *</label>
              <input
                type="number"
                required
                step="0.01"
                value={newTax.rate}
                onChange={(e) => setNewTax({ ...newTax, rate: parseFloat(e.target.value) })}
                className="input-field"
                placeholder="20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#6B7280] mb-1">Тип</label>
              <select
                value={newTax.type}
                onChange={(e) => setNewTax({ ...newTax, type: e.target.value })}
                className="input-field"
              >
                <option value="vat">НДС</option>
                <option value="income">Подоходный</option>
                <option value="service">Услуги</option>
              </select>
            </div>
            <div className="col-span-full flex gap-3">
              <button type="submit" className="btn-primary">Создать</button>
              <button type="button" onClick={() => setIsAdding(false)} className="btn-secondary">Отмена</button>
            </div>
          </form>
        </div>
      )}

      {taxes.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center border border-[#E5E7EB]">
          <p className="text-[#6B7280]">Налогов пока нет</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Название</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Ставка</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Тип</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Статус</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F6]">
              {taxes.map((tax) => (
                <tr key={tax.id} className="hover:bg-[#F9FAFB]">
                  <td className="px-4 py-3 font-medium text-[#111827]">{tax.name}</td>
                  <td className="px-4 py-3 text-[#111827]">{tax.rate}%</td>
                  <td className="px-4 py-3 text-sm text-[#6B7280]">
                    {tax.type === 'vat' ? 'НДС' : tax.type === 'income' ? 'Подоходный' : 'Услуги'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`tag ${tax.isActive ? '' : 'tag-gray'}`}>
                      {tax.isActive ? '✅ Активен' : '⛔ Неактивен'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleActive(tax.id)}
                        className="text-sm hover:underline text-[#6B7280]"
                      >
                        {tax.isActive ? 'Деактивировать' : 'Активировать'}
                      </button>
                      <button
                        onClick={() => deleteTax(tax.id)}
                        className="text-sm text-[#EF4444] hover:underline"
                      >
                        Удалить
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
