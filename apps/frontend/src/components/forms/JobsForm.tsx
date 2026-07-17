'use client';

import { useState, useEffect } from 'react';
import BaseListingForm from './BaseListingForm';
import { Briefcase, User, AlertCircle } from 'lucide-react';

interface JobsFormProps {
  initialData?: any;
  isEdit?: boolean;
  mode?: 'resume' | 'vacancy'; // 👈 ДОБАВЛЯЕМ РЕЖИМ
}

export default function JobsForm({ initialData, isEdit, mode = 'vacancy' }: JobsFormProps) {
  const [isEmployer, setIsEmployer] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [attributes, setAttributes] = useState({
    // Общие поля
    employment: initialData?.attributes?.employment || '',
    experience: initialData?.attributes?.experience || '',
    schedule: initialData?.attributes?.schedule || '',
    education: initialData?.attributes?.education || '',
    skills: initialData?.attributes?.skills || '',
    
    // Для вакансий
    companyName: initialData?.attributes?.companyName || '',
    companyDescription: initialData?.attributes?.companyDescription || '',
    contactPerson: initialData?.attributes?.contactPerson || '',
    responsibilities: initialData?.attributes?.responsibilities || '',
    requirements: initialData?.attributes?.requirements || '',
    conditions: initialData?.attributes?.conditions || '',
    
    // Для резюме
    about: initialData?.attributes?.about || '',
    portfolio: initialData?.attributes?.portfolio || '',
    desiredSalary: initialData?.attributes?.desiredSalary || '',
    readyToRelocate: initialData?.attributes?.readyToRelocate || false,
    readyForBusinessTrips: initialData?.attributes?.readyForBusinessTrips || false,
  });

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          setIsEmployer(user.isSeller || user.role === 'employer' || user.role === 'admin');
          setIsAdmin(user.role === 'admin');
        }
      } catch (e) {
        console.error('Error parsing user data:', e);
      } finally {
        setLoading(false);
      }
    };
    checkUserRole();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setAttributes({
      ...attributes,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  // =========================
  // 🔹 БАНЕР ДЛЯ НЕ-РАБОТОДАТЕЛЕЙ (только для вакансий)
  // =========================
  if (!loading && mode === 'vacancy' && !isEmployer && !isAdmin) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center">
        <div className="flex justify-center mb-4">
          <Briefcase className="w-16 h-16 text-yellow-600" />
        </div>
        <h3 className="font-semibold text-[#111827] text-lg mb-2">
          Только для работодателей
        </h3>
        <p className="text-sm text-[#6B7280] max-w-md mx-auto">
          Для размещения вакансий необходимо зарегистрироваться как работодатель.
        </p>
        <p className="text-sm text-[#6B7280] mt-2">
          Перейдите в{' '}
          <a href="/profile" className="text-[#3B82F6] hover:underline">
            личный кабинет
          </a>
          {' '}и заполните данные компании.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <a href="/profile" className="btn-primary text-sm">
            Заполнить данные компании
          </a>
          <a href="/listings/create/resume" className="btn-secondary text-sm flex items-center gap-2">
            <User className="w-4 h-4" />
            Разместить резюме
          </a>
        </div>
      </div>
    );
  }

  // =========================
  // 🔹 ФОРМА СОЗДАНИЯ РАБОТЫ
  // =========================
  const isResume = mode === 'resume';

  // Передаём attributes в BaseListingForm
  const formData = {
    ...initialData,
    attributes: attributes,
  };

  return (
    <BaseListingForm type="job" initialData={formData} isEdit={isEdit}>
      <div className="border-t border-[#E5E7EB] pt-4 mt-4">
        <div className="flex items-center gap-3 mb-4">
          {isResume ? (
            <User className="w-5 h-5 text-[#6366F1]" />
          ) : (
            <Briefcase className="w-5 h-5 text-[#6366F1]" />
          )}
          <h3 className="font-semibold text-[#111827]">
            {isResume ? 'Информация о соискателе' : 'Информация о вакансии'}
          </h3>
        </div>

        {isAdmin && !isResume && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-sm text-blue-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Вы администратор, поэтому можете создавать вакансии
          </div>
        )}

        {/* ========================= */}
        {/* 🔹 ОБЩИЕ ПОЛЯ */}
        {/* ========================= */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#6B7280] mb-1">Тип занятости *</label>
            <select
              name="employment"
              required
              value={attributes.employment}
              onChange={handleChange}
              className="input-field w-full"
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
              className="input-field w-full"
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
              className="input-field w-full"
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
              className="input-field w-full"
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
            className="input-field w-full"
            placeholder="JavaScript, React, TypeScript, Node.js"
          />
          <p className="text-xs text-[#9CA3AF] mt-1">Перечислите через запятую</p>
        </div>

        {/* ========================= */}
        {/* 🔹 ПОЛЯ ДЛЯ РЕЗЮМЕ */}
        {/* ========================= */}
        {isResume && (
          <>
            <div>
              <label className="block text-sm font-medium text-[#6B7280] mb-1">О себе</label>
              <textarea
                name="about"
                rows={3}
                value={attributes.about}
                onChange={handleChange}
                className="input-field w-full"
                placeholder="Расскажите о себе, своих целях и ожиданиях..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#6B7280] mb-1">Портфолио / Ссылки</label>
              <input
                type="text"
                name="portfolio"
                value={attributes.portfolio}
                onChange={handleChange}
                className="input-field w-full"
                placeholder="Ссылки на GitHub, Behance, сайт..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#6B7280] mb-1">Желаемая зарплата</label>
                <input
                  type="number"
                  name="desiredSalary"
                  value={attributes.desiredSalary}
                  onChange={handleChange}
                  className="input-field w-full"
                  placeholder="100 000 ₽"
                />
              </div>
              <div className="flex flex-col gap-2 justify-end">
                <label className="flex items-center gap-2 text-sm text-[#6B7280]">
                  <input
                    type="checkbox"
                    name="readyToRelocate"
                    checked={attributes.readyToRelocate}
                    onChange={handleChange}
                    className="w-4 h-4"
                  />
                  Готов к переезду
                </label>
                <label className="flex items-center gap-2 text-sm text-[#6B7280]">
                  <input
                    type="checkbox"
                    name="readyForBusinessTrips"
                    checked={attributes.readyForBusinessTrips}
                    onChange={handleChange}
                    className="w-4 h-4"
                  />
                  Готов к командировкам
                </label>
              </div>
            </div>
          </>
        )}

        {/* ========================= */}
        {/* 🔹 ПОЛЯ ДЛЯ ВАКАНСИЙ */}
        {/* ========================= */}
        {!isResume && (
          <>
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
                  className="input-field w-full"
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
                  className="input-field w-full"
                  placeholder="Расскажите о компании"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#6B7280] mb-1">Обязанности</label>
              <textarea
                name="responsibilities"
                rows={3}
                value={attributes.responsibilities}
                onChange={handleChange}
                className="input-field w-full"
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
                className="input-field w-full"
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
                className="input-field w-full"
                placeholder="Что мы предлагаем"
              />
            </div>

            <div className="mt-3">
              <label className="block text-sm font-medium text-[#6B7280] mb-1">Контактное лицо</label>
              <input
                type="text"
                name="contactPerson"
                value={attributes.contactPerson}
                onChange={handleChange}
                className="input-field w-full"
                placeholder="Иван Иванов"
              />
            </div>
          </>
        )}
      </div>
    </BaseListingForm>
  );
}