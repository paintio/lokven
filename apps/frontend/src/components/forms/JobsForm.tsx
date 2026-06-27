'use client';

import { useState, useEffect } from 'react';
import BaseListingForm from './BaseListingForm';

interface JobsFormProps {
  initialData?: any;
  isEdit?: boolean;
}

export default function JobsForm({ initialData, isEdit }: JobsFormProps) {
  const [isEmployer, setIsEmployer] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [attributes, setAttributes] = useState({
    employment: initialData?.attributes?.employment || '',
    experience: initialData?.attributes?.experience || '',
    schedule: initialData?.attributes?.schedule || '',
    education: initialData?.attributes?.education || '',
    skills: initialData?.attributes?.skills || '',
    responsibilities: initialData?.attributes?.responsibilities || '',
    requirements: initialData?.attributes?.requirements || '',
    conditions: initialData?.attributes?.conditions || '',
    companyName: initialData?.attributes?.companyName || '',
    companyDescription: initialData?.attributes?.companyDescription || '',
    contactPerson: initialData?.attributes?.contactPerson || '',
  });

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setIsEmployer(user.isSeller || user.role === 'seller' || user.role === 'employer');
        setIsAdmin(user.role === 'admin');
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAttributes({
      ...attributes,
      [name]: value,
    });
  };

  if (!isEmployer && !isAdmin) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
        <div className="text-4xl mb-3">⚠️</div>
        <h3 className="font-semibold text-[#111827] mb-2">Только для работодателей</h3>
        <p className="text-sm text-[#6B7280]">
          Для размещения вакансий необходимо зарегистрироваться как работодатель.
        </p>
        <p className="text-sm text-[#6B7280] mt-1">
          Перейдите в <a href="/profile" className="text-[#3B82F6] hover:underline">личный кабинет</a> и заполните данные компании.
        </p>
      </div>
    );
  }

  return (
    <BaseListingForm type="job" initialData={{ ...initialData, attributes }} isEdit={isEdit}>
      <div className="border-t border-[#E5E7EB] pt-4 mt-4">
        <h3 className="font-semibold text-[#111827] mb-3">Информация о вакансии</h3>
        
        {isAdmin && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-sm text-blue-700">
            ⚡ Вы администратор, поэтому можете создавать вакансии
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#6B7280] mb-1">Тип занятости *</label>
            <select
              name="employment"
              required
              value={attributes.employment}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Выберите</option>
              <option value="full">Полная занятость</option>
              <option value="part">Частичная занятость</option>
              <option value="project">Проектная работа</option>
              <option value="remote">Удалённая работа</option>
              <option value="internship">Стажировка</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#6B7280] mb-1">График работы</label>
            <select
              name="schedule"
              value={attributes.schedule}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Выберите</option>
              <option value="5_2">5/2</option>
              <option value="2_2">2/2</option>
              <option value="3_3">3/3</option>
              <option value="flexible">Гибкий</option>
              <option value="shift">Сменный</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#6B7280] mb-1">Опыт работы</label>
            <select
              name="experience"
              value={attributes.experience}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Не важен</option>
              <option value="none">Без опыта</option>
              <option value="1-3">1-3 года</option>
              <option value="3-6">3-6 лет</option>
              <option value="6+">Более 6 лет</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#6B7280] mb-1">Образование</label>
            <select
              name="education"
              value={attributes.education}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Не важно</option>
              <option value="secondary">Среднее</option>
              <option value="special">Среднее специальное</option>
              <option value="higher">Высшее</option>
              <option value="postgraduate">Послевузовское</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#6B7280] mb-1">Ключевые навыки</label>
          <input
            type="text"
            name="skills"
            value={attributes.skills}
            onChange={handleChange}
            className="input-field"
            placeholder="JavaScript, React, TypeScript, Node.js"
          />
          <p className="text-xs text-[#9CA3AF] mt-1">Перечислите через запятую</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#6B7280] mb-1">Обязанности</label>
          <textarea
            name="responsibilities"
            rows={3}
            value={attributes.responsibilities}
            onChange={handleChange}
            className="input-field"
            placeholder="Что предстоит делать сотруднику"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#6B7280] mb-1">Требования</label>
          <textarea
            name="requirements"
            rows={3}
            value={attributes.requirements}
            onChange={handleChange}
            className="input-field"
            placeholder="Какие требования к кандидату"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#6B7280] mb-1">Условия работы</label>
          <textarea
            name="conditions"
            rows={2}
            value={attributes.conditions}
            onChange={handleChange}
            className="input-field"
            placeholder="Что мы предлагаем"
          />
        </div>

        <div className="border-t border-[#E5E7EB] pt-4 mt-4">
          <h4 className="font-semibold text-[#111827] mb-3">Информация о компании</h4>
          
          <div>
            <label className="block text-sm font-medium text-[#6B7280] mb-1">Название компании *</label>
            <input
              type="text"
              name="companyName"
              required
              value={attributes.companyName}
              onChange={handleChange}
              className="input-field"
              placeholder="ООО Ромашка"
            />
          </div>

          <div className="mt-3">
            <label className="block text-sm font-medium text-[#6B7280] mb-1">Описание компании</label>
            <textarea
              name="companyDescription"
              rows={2}
              value={attributes.companyDescription}
              onChange={handleChange}
              className="input-field"
              placeholder="Расскажите о компании"
            />
          </div>

          <div className="mt-3">
            <label className="block text-sm font-medium text-[#6B7280] mb-1">Контактное лицо</label>
            <input
              type="text"
              name="contactPerson"
              value={attributes.contactPerson}
              onChange={handleChange}
              className="input-field"
              placeholder="Иван Иванов"
            />
          </div>
        </div>
      </div>
    </BaseListingForm>
  );
}
