'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Edit2, Plus, Trash2, X } from 'lucide-react';

type SettingType = 'string' | 'number' | 'boolean' | 'json';

interface CmsSetting {
  id: string;
  key: string;
  value: unknown;
  group: string;
  type: SettingType;
  label: string | null;
  description: string | null;
}

const emptyForm = {
  key: '',
  value: '',
  group: 'general',
  type: 'string' as SettingType,
  label: '',
  description: '',
};

function formatValue(value: unknown) {
  return typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value ?? '');
}

function parseValue(value: string, type: SettingType) {
  if (type === 'number') {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) throw new Error('Enter a valid number');
    return parsed;
  }
  if (type === 'boolean') return value === 'true';
  if (type === 'json') return JSON.parse(value);
  return value;
}

export default function CmsSettingsPage() {
  const [settings, setSettings] = useState<CmsSetting[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const requestHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
  });

  const loadSettings = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cms/settings`, { headers: requestHeaders() });
      if (!response.ok) throw new Error('Could not load settings');
      setSettings(await response.json());
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Loading error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadSettings(); }, []);

  const closeForm = () => {
    setForm(emptyForm);
    setEditingKey(null);
    setIsFormOpen(false);
    setError('');
  };

  const editSetting = (setting: CmsSetting) => {
    setEditingKey(setting.key);
    setForm({ key: setting.key, value: formatValue(setting.value), group: setting.group, type: setting.type, label: setting.label || '', description: setting.description || '' });
    setError('');
    setIsFormOpen(true);
  };

  const saveSetting = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    let value: unknown;
    try { value = parseValue(form.value, form.type); } catch { setError('Invalid value for the selected type'); return; }
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cms/settings${editingKey ? `/${editingKey}` : ''}`, {
      method: editingKey ? 'PUT' : 'POST', headers: requestHeaders(), body: JSON.stringify({ ...form, value }),
    });
    if (!response.ok) { setError('Could not save setting'); return; }
    await loadSettings();
    closeForm();
  };

  const deleteSetting = async (key: string) => {
    if (!window.confirm('Delete this setting?')) return;
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cms/settings/${key}`, { method: 'DELETE', headers: requestHeaders() });
    if (!response.ok) { setError('Could not delete setting'); return; }
    setSettings((current) => current.filter((setting) => setting.key !== key));
  };

  return <div className="space-y-6">
    <div className="flex items-center justify-between gap-4"><div><h1 className="text-2xl font-bold text-[#111827]">CMS settings</h1><p className="mt-1 text-sm text-[#6B7280]">Manage site content and integration values.</p></div><button type="button" onClick={() => setIsFormOpen(true)} className="btn-primary inline-flex items-center gap-2"><Plus className="h-4 w-4" /> Add</button></div>
    {error && <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
    {isFormOpen && <form onSubmit={saveSetting} className="space-y-4 rounded-lg border border-[#E5E7EB] bg-white p-5">
      <div className="grid gap-4 md:grid-cols-2"><label className="text-sm text-[#374151]">Key<input required disabled={Boolean(editingKey)} value={form.key} onChange={(event) => setForm({ ...form, key: event.target.value })} className="input-field mt-1 w-full" placeholder="support_email" /></label><label className="text-sm text-[#374151]">Group<input required value={form.group} onChange={(event) => setForm({ ...form, group: event.target.value })} className="input-field mt-1 w-full" placeholder="contacts" /></label><label className="text-sm text-[#374151]">Label<input value={form.label} onChange={(event) => setForm({ ...form, label: event.target.value })} className="input-field mt-1 w-full" /></label><label className="text-sm text-[#374151]">Type<select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value as SettingType })} className="input-field mt-1 w-full"><option value="string">Text</option><option value="number">Number</option><option value="boolean">Boolean</option><option value="json">JSON</option></select></label></div>
      <label className="block text-sm text-[#374151]">Value{form.type === 'boolean' ? <select value={form.value} onChange={(event) => setForm({ ...form, value: event.target.value })} className="input-field mt-1 w-full"><option value="true">True</option><option value="false">False</option></select> : <textarea required value={form.value} onChange={(event) => setForm({ ...form, value: event.target.value })} className="input-field mt-1 min-h-28 w-full font-mono" />}</label>
      <label className="block text-sm text-[#374151]">Description<input value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="input-field mt-1 w-full" /></label>
      <div className="flex gap-3"><button className="btn-primary" type="submit">Save</button><button className="btn-secondary" type="button" onClick={closeForm}><X className="h-4 w-4" /></button></div>
    </form>}
    <div className="overflow-hidden rounded-lg border border-[#E5E7EB] bg-white">{loading ? <div className="p-6 text-sm text-[#6B7280]">Loading...</div> : <table className="w-full text-left text-sm"><thead className="bg-[#F9FAFB] text-xs uppercase text-[#6B7280]"><tr><th className="px-4 py-3">Setting</th><th className="px-4 py-3">Value</th><th className="px-4 py-3">Group</th><th className="px-4 py-3" /></tr></thead><tbody>{settings.map((setting) => <tr key={setting.id} className="border-t border-[#E5E7EB]"><td className="px-4 py-3"><div className="font-medium text-[#111827]">{setting.label || setting.key}</div><code className="text-xs text-[#6B7280]">{setting.key}</code></td><td className="max-w-sm truncate px-4 py-3 text-[#4B5563]">{formatValue(setting.value)}</td><td className="px-4 py-3 text-[#6B7280]">{setting.group}</td><td className="px-4 py-3"><div className="flex justify-end gap-2"><button type="button" aria-label="Edit" title="Edit" onClick={() => editSetting(setting)} className="icon-button"><Edit2 className="h-4 w-4" /></button><button type="button" aria-label="Delete" title="Delete" onClick={() => deleteSetting(setting.key)} className="icon-button text-red-600"><Trash2 className="h-4 w-4" /></button></div></td></tr>)}</tbody></table>}</div>
  </div>;
}
