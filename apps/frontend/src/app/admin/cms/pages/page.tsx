'use client';

import { useState, useEffect } from 'react';

interface Page {
  id: string;
  slug: string;
  title: string;
  content: string;
  metaTitle: string | null;
  metaDescription: string | null;
  isActive: boolean;
}

export default function AdminPages() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Page | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    content: '',
    metaTitle: '',
    metaDescription: '',
    isActive: true,
  });

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cms/pages`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      setPages(data);
    } catch (error) {
      console.error('Error fetching pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const url = editing 
        ? `${process.env.NEXT_PUBLIC_API_URL}/cms/pages/${editing.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/cms/pages`;
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
        fetchPages();
        resetForm();
      }
    } catch (error) {
      console.error('Error saving page:', error);
    }
  };

  const deletePage = async (id: string) => {
    if (!confirm('Удалить страницу?')) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cms/pages/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      fetchPages();
    } catch (error) {
      console.error('Error deleting page:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      slug: '',
      title: '',
      content: '',
      metaTitle: '',
      metaDescription: '',
      isActive: true,
    });
    setEditing(null);
    setIsAdding(false);
  };

  const editPage = (page: Page) => {
    setEditing(page);
    setFormData({
      slug: page.slug,
      title: page.title,
      content: page.content,
      metaTitle: page.metaTitle || '',
      metaDescription: page.metaDescription || '',
      isActive: page.isActive,
    });
    setIsAdding(true);
  };

  if (loading) {
    return <div className="text-[#9CA3AF]">Загрузка...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#111827]">📄 Страницы</h1>
        <button onClick={() => setIsAdding(true)} className="btn-primary">
          + Добавить страницу
        </button>
      </div>

      {isAdding && (
        <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] mb-6">
          <h3 className="font-semibold text-[#111827] mb-4">
            {editing ? 'Редактировать страницу' : 'Новая страница'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#6B7280] mb-1">Slug *</label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="input-field"
                  placeholder="o-nas"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#6B7280] mb-1">Название *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input-field"
                  placeholder="О нас"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#6B7280] mb-1">Контент (HTML)</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={10}
                className="input-field font-mono"
                placeholder="<h1>О нас</h1><p>Текст...</p>"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#6B7280] mb-1">Meta Title</label>
                <input
                  type="text"
                  value={formData.metaTitle}
                  onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                  className="input-field"
                  placeholder="SEO заголовок"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#6B7280] mb-1">Meta Description</label>
                <input
                  type="text"
                  value={formData.metaDescription}
                  onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                  className="input-field"
                  placeholder="SEO описание"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-[#6B7280]">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4"
                />
                Опубликовано
              </label>
            </div>

            <div className="flex gap-3">
              <button type="submit" className="btn-primary">
                {editing ? 'Сохранить' : 'Создать'}
              </button>
              <button type="button" onClick={resetForm} className="btn-secondary">
                Отмена
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Страница</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Slug</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Статус</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F3F4F6]">
            {pages.map((page) => (
              <tr key={page.id} className="hover:bg-[#F9FAFB]">
                <td className="px-4 py-3 font-medium text-[#111827]">{page.title}</td>
                <td className="px-4 py-3 text-sm text-[#6B7280]">/{page.slug}</td>
                <td className="px-4 py-3">
                  <span className={`tag ${page.isActive ? '' : 'tag-gray'}`}>
                    {page.isActive ? '✅ Опубликовано' : '⛔ Черновик'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => editPage(page)} className="text-sm text-[#3B82F6] hover:underline">
                      ✏️ Редактировать
                    </button>
                    <button onClick={() => deletePage(page.id)} className="text-sm text-[#EF4444] hover:underline">
                      🗑️ Удалить
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
