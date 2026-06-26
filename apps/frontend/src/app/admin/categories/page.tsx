'use client';

import { useState, useEffect } from 'react';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  parentId: string | null;
  order: number;
  isActive: boolean;
  _count?: {
    children: number;
  };
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    icon: '📂',
    color: '#3B82F6',
    parentId: '',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/categories`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      
      const data = await response.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newCategory),
      });
      setIsAdding(false);
      setNewCategory({ name: '', description: '', icon: '📂', color: '#3B82F6', parentId: '' });
      fetchCategories();
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/categories/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive: !isActive }),
      });
      fetchCategories();
    } catch (error) {
      console.error('Error toggling category:', error);
    }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm('Удалить категорию?')) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  if (loading) {
    return <div className="text-[#9CA3AF]">Загрузка...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#111827]">📂 Категории</h1>
        <button onClick={() => setIsAdding(true)} className="btn-primary">
          + Добавить категорию
        </button>
      </div>

      {isAdding && (
        <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] mb-6">
          <h3 className="font-semibold text-[#111827] mb-4">Новая категория</h3>
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#6B7280] mb-1">Название *</label>
              <input
                type="text"
                required
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#6B7280] mb-1">Иконка</label>
              <input
                type="text"
                value={newCategory.icon || ''}
                onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
                className="input-field"
                placeholder="📦"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-[#6B7280] mb-1">Описание</label>
              <input
                type="text"
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#6B7280] mb-1">Родительская категория</label>
              <select
                value={newCategory.parentId}
                onChange={(e) => setNewCategory({ ...newCategory, parentId: e.target.value })}
                className="input-field"
              >
                <option value="">Нет (корневая)</option>
                {categories.filter(c => !c.parentId).map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end gap-3">
              <button type="submit" className="btn-primary">Создать</button>
              <button type="button" onClick={() => setIsAdding(false)} className="btn-secondary">Отмена</button>
            </div>
          </form>
        </div>
      )}

      {categories.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center border border-[#E5E7EB]">
          <p className="text-[#6B7280]">Категорий пока нет</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Категория</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Slug</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Дочерних</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Статус</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F6]">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-[#F9FAFB]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{category.icon || '📂'}</span>
                      <div>
                        <div className="font-medium text-[#111827]">{category.name}</div>
                        <div className="text-xs text-[#9CA3AF]">{category.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#6B7280]">{category.slug}</td>
                  <td className="px-4 py-3 text-sm text-[#6B7280]">{category._count?.children || 0}</td>
                  <td className="px-4 py-3">
                    <span className={`tag ${category.isActive ? '' : 'tag-gray'}`}>
                      {category.isActive ? '✅ Активна' : '⛔ Неактивна'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleActive(category.id, category.isActive)}
                        className="text-sm hover:underline text-[#6B7280]"
                      >
                        {category.isActive ? 'Деактивировать' : 'Активировать'}
                      </button>
                      <button
                        onClick={() => deleteCategory(category.id)}
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
