'use client';

import { useState } from 'react';
import BaseListingForm from './BaseListingForm';

interface ServicesFormProps {
  initialData?: any;
  isEdit?: boolean;
}

export default function ServicesForm({ initialData, isEdit }: ServicesFormProps) {
  const [attributes, setAttributes] = useState({
    serviceType: initialData?.attributes?.serviceType || '',
    experience: initialData?.attributes?.experience || '',
    education: initialData?.attributes?.education || '',
    workTime: initialData?.attributes?.workTime || '',
    guarantee: initialData?.attributes?.guarantee || false,
    documents: initialData?.attributes?.documents || false,
    homeVisit: initialData?.attributes?.homeVisit || false,
    portfolio: initialData?.attributes?.portfolio || '',
    certificates: initialData?.attributes?.certificates || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setAttributes({
      ...attributes,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  return (
    <BaseListingForm type="service" initialData={{ ...initialData, attributes }} isEdit={isEdit}>
      <div className="border-t border-[#E5E7EB] pt-4 mt-4">
        <h3 className="font-semibold text-[#111827] mb-3">Информация об услуге</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#6B7280] mb-1">Тип услуги *</label>
            <select
              name="serviceType"
              required
              value={attributes.serviceType}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Выберите</option>
              <option value="repair">Ремонт</option>
              <option value="cleaning">Клининг</option>
              <option value="moving">Перевозки</option>
              <option value="it">IT-услуги</option>
              <option value="education">Образование</option>
              <option value="beauty">Красота</option>
              <option value="photo">Фото/Видео</option>
              <option value="legal">Юридические услуги</option>
              <option value="accounting">Бухгалтерия</option>
              <option value="design">Дизайн</option>
              <option value="construction">Строительство</option>
              <option value="other">Другое</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#6B7280] mb-1">Опыт работы</label>
            <select
              name="experience"
              value={attributes.experience}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Выберите</option>
              <option value="1">1 год</option>
              <option value="2">2 года</option>
              <option value="3">3-5 лет</option>
              <option value="5">5-10 лет</option>
              <option value="10">Более 10 лет</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#6B7280] mb-1">Образование / Квалификация</label>
          <input
            type="text"
            name="education"
            value={attributes.education}
            onChange={handleChange}
            className="input-field"
            placeholder="Высшее техническое"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#6B7280] mb-1">Время выполнения</label>
          <input
            type="text"
            name="workTime"
            value={attributes.workTime}
            onChange={handleChange}
            className="input-field"
            placeholder="1-2 часа / 1 день"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#6B7280] mb-1">Портфолио</label>
          <textarea
            name="portfolio"
            rows={3}
            value={attributes.portfolio}
            onChange={handleChange}
            className="input-field"
            placeholder="Ссылки на работы или описание проектов"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#6B7280] mb-1">Сертификаты</label>
          <input
            type="text"
            name="certificates"
            value={attributes.certificates}
            onChange={handleChange}
            className="input-field"
            placeholder="Ссылки на сертификаты и дипломы"
          />
        </div>

        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm text-[#6B7280]">
            <input
              type="checkbox"
              name="guarantee"
              checked={attributes.guarantee}
              onChange={handleChange}
              className="w-4 h-4"
            />
            Гарантия на работу
          </label>
          <label className="flex items-center gap-2 text-sm text-[#6B7280]">
            <input
              type="checkbox"
              name="documents"
              checked={attributes.documents}
              onChange={handleChange}
              className="w-4 h-4"
            />
            Договор и закрывающие документы
          </label>
          <label className="flex items-center gap-2 text-sm text-[#6B7280]">
            <input
              type="checkbox"
              name="homeVisit"
              checked={attributes.homeVisit}
              onChange={handleChange}
              className="w-4 h-4"
            />
            Выезд на дом
          </label>
        </div>
      </div>
    </BaseListingForm>
  );
}
