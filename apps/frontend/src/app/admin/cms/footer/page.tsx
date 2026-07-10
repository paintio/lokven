'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
} from 'lucide-react';

interface FooterLink {
  id: string;
  group: string;
  label: string;
  url: string;
  icon?: string;
  order: number;
  isActive: boolean;
}

// 👈 ТОЛЬКО ПРЕДОПРЕДЕЛЁННЫЕ ГРУППЫ (БЕЗ ИЗМЕНЕНИЙ)
const GROUP_LABELS: Record<string, string> = {
  about: 'О компании',
  buyers: 'Покупателям',
  sellers: 'Продавцам',
  help: 'Помощь',
  social: 'Социальные сети',
};

const GROUP_COLORS: Record<string, string> = {
  about: 'bg-blue-50 text-blue-700',
  buyers: 'bg-green-50 text-green-700',
  sellers: 'bg-purple-50 text-purple-700',
  help: 'bg-orange-50 text-orange-700',
  social: 'bg-pink-50 text-pink-700',
};

export default function AdminFooter() {
  const [links, setLinks] = useState<FooterLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<FooterLink | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    group: 'about',
    label: '',
    url: '',
    icon: '',
    order: 0,
    isActive: true,
  });

  useEffect(() => {
    setMounted(true);
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cms/footer`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      setLinks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching links:', error);
      setLinks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const url = editing 
        ? `${process.env.NEXT_PUBLIC_API_URL}/cms/footer/${editing.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/cms/footer`;
      const method = editing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchLinks();
        resetForm();
      } else {
        const error = await response.json();
        alert('Ошибка: ' + JSON.stringify(error));
      }
    } catch (error) {
      console.error('Error saving link:', error);
      alert('Ошибка при сохранении');
    }
  };

  const deleteLink = async (id: string) => {
    if (!confirm('Удалить ссылку?')) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cms/footer/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      fetchLinks();
    } catch (error) {
      console.error('Error deleting link:', error);
      alert('Ошибка при удалении');
    }
  };

  const resetForm = () => {
    setFormData({
      group: 'about',
      label: '',
      url: '',
      icon: '',
      order: 0,
      isActive: true,
    });
    setEditing(null);
    setIsAdding(false);
  };

  const editLink = (link: FooterLink) => {
    setEditing(link);
    setFormData({
      group: link.group,
      label: link.label,
      url: link.url,
      icon: link.icon || '',
      order: link.order,
      isActive: link.isActive,
    });
    setIsAdding(true);
  };

 // Группируем ссылки из БД
const groupedLinks = links.reduce((acc, link) => {
  const groupKey = link.group || 'other';
  if (!acc[groupKey]) acc[groupKey] = [];
  acc[groupKey].push(link);
  return acc;
}, {} as Record<string, FooterLink[]>);

// Получаем все уникальные группы
const allGroupKeys = Object.keys(groupedLinks).concat(Object.keys(GROUP_LABELS));
const allGroups = Array.from(new Set(allGroupKeys)).sort();

// Сортируем группы в нужном порядке
const groupOrder = [
  'Компании',
  'О компании',
  'Покупателям',
  'Продавцам',
  'Помощь',
  'Социальные сети',
];

const sortedGroups = allGroups.sort((a, b) => {
  const indexA = groupOrder.indexOf(a);
  const indexB = groupOrder.indexOf(b);
  if (indexA === -1 && indexB === -1) return a.localeCompare(b);
  if (indexA === -1) return 1;
  if (indexB === -1) return -1;
  return indexA - indexB;
});

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#111827]">Футер ссылки</h1>
        <button onClick={() => setIsAdding(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Добавить ссылку
        </button>
      </div>

      {isAdding && (
        <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] mb-6">
          <h3 className="font-semibold text-[#111827] mb-4">
            {editing ? 'Редактировать ссылку' : 'Новая ссылка'}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#6B7280] mb-1">Группа *</label>
              <select
                value={formData.group}
                onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                className="input-field"
              >
                {allGroups.map((group) => (
                  <option key={group} value={group}>
                    {GROUP_LABELS[group] || group}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#6B7280] mb-1">Порядок</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#6B7280] mb-1">Название *</label>
              <input
                type="text"
                required
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                className="input-field"
                placeholder="О нас"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#6B7280] mb-1">URL *</label>
              <input
                type="text"
                required
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="input-field"
                placeholder="/about"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#6B7280] mb-1">Иконка</label>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="input-field"
                placeholder="vk, telegram, youtube..."
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-[#6B7280]">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4"
                />
                Активно
              </label>
            </div>
            <div className="col-span-2 flex gap-3">
              <button type="submit" className="btn-primary flex items-center gap-2">
                <Save className="w-4 h-4" />
                {editing ? 'Сохранить' : 'Создать'}
              </button>
              <button type="button" onClick={resetForm} className="btn-secondary flex items-center gap-2">
                <X className="w-4 h-4" />
                Отмена
              </button>
            </div>
          </form>
        </div>
      )}

      {links.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center border border-[#E5E7EB]">
          <p className="text-[#6B7280]">Нет ссылок. Добавьте первую!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {allGroups.map((groupKey) => {
            const groupLinks = groupedLinks[groupKey] || [];
            const groupLabel = GROUP_LABELS[groupKey] || groupKey;
            const colorClass = GROUP_COLORS[groupKey] || 'bg-gray-50 text-gray-700';

            return (
              <div key={groupKey} className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
                <div className={`px-4 py-3 ${colorClass}`}>
                  <h3 className="font-semibold">{groupLabel}</h3>
                  <span className="text-xs opacity-75">{groupLinks.length} ссылок</span>
                </div>
                {groupLinks.length === 0 ? (
                  <div className="px-4 py-6 text-center text-[#9CA3AF] text-sm">
                    Нет ссылок в этой группе
                  </div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-[#6B7280] uppercase">Название</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-[#6B7280] uppercase">URL</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-[#6B7280] uppercase">Иконка</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-[#6B7280] uppercase">Статус</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-[#6B7280] uppercase">Действия</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F3F4F6]">
                      {groupLinks.map((link) => (
                        <tr key={link.id} className="hover:bg-[#F9FAFB]">
                          <td className="px-4 py-2 text-sm text-[#111827]">{link.label}</td>
                          <td className="px-4 py-2 text-sm text-[#6B7280]">{link.url}</td>
                          <td className="px-4 py-2 text-sm text-[#6B7280]">{link.icon || '—'}</td>
                          <td className="px-4 py-2">
                            <span className={`tag ${link.isActive ? '' : 'tag-gray'}`}>
                              {link.isActive ? 'Активно' : 'Неактивно'}
                            </span>
                          </td>
                          <td className="px-4 py-2">
                            <div className="flex gap-2">
                              <button
                                onClick={() => editLink(link)}
                                className="text-sm text-[#3B82F6] hover:underline flex items-center gap-1"
                              >
                                <Edit className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => deleteLink(link.id)}
                                className="text-sm text-[#EF4444] hover:underline flex items-center gap-1"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}