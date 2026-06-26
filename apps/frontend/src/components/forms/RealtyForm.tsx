'use client';

import { useState } from 'react';
import BaseListingForm from './BaseListingForm';

interface RealtyFormProps {
  initialData?: any;
  isEdit?: boolean;
}

export default function RealtyForm({ initialData, isEdit }: RealtyFormProps) {
  const [attributes, setAttributes] = useState({
    realtyType: initialData?.attributes?.realtyType || '',
    rooms: initialData?.attributes?.rooms || '',
    area: initialData?.attributes?.area || '',
    kitchenArea: initialData?.attributes?.kitchenArea || '',
    floor: initialData?.attributes?.floor || '',
    totalFloors: initialData?.attributes?.totalFloors || '',
    ceilingHeight: initialData?.attributes?.ceilingHeight || '',
    wallMaterial: initialData?.attributes?.wallMaterial || '',
    condition: initialData?.attributes?.condition || '',
    furniture: initialData?.attributes?.furniture || false,
    appliances: initialData?.attributes?.appliances || false,
    internet: initialData?.attributes?.internet || false,
    parking: initialData?.attributes?.parking || false,
    yearBuilt: initialData?.attributes?.yearBuilt || '',
    cadastralNumber: initialData?.attributes?.cadastralNumber || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setAttributes({
      ...attributes,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  return (
    <BaseListingForm type="realty" initialData={{ ...initialData, attributes }} isEdit={isEdit}>
      <div className="border-t border-[#E5E7EB] pt-4 mt-4">
        <h3 className="font-semibold text-[#111827] mb-3">Характеристики недвижимости</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#6B7280] mb-1">Тип недвижимости *</label>
            <select
              name="realtyType"
              required
              value={attributes.realtyType}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Выберите</option>
              <option value="apartment">Квартира</option>
              <option value="house">Дом</option>
              <option value="land">Участок</option>
              <option value="commercial">Коммерческая</option>
              <option value="townhouse">Таунхаус</option>
              <option value="cottage">Коттедж</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#6B7280] mb-1">Количество комнат</label>
            <select
              name="rooms"
              value={attributes.rooms}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Выберите</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5+</option>
              <option value="studio">Студия</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#6B7280] mb-1">Общая площадь (м²)</label>
            <input
              type="number"
              name="area"
              min="0"
              step="0.1"
              value={attributes.area}
              onChange={handleChange}
              className="input-field"
              placeholder="85"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#6B7280] mb-1">Площадь кухни (м²)</label>
            <input
              type="number"
              name="kitchenArea"
              min="0"
              step="0.1"
              value={attributes.kitchenArea}
              onChange={handleChange}
              className="input-field"
              placeholder="15"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#6B7280] mb-1">Год постройки</label>
            <input
              type="number"
              name="yearBuilt"
              min="1900"
              max={new Date().getFullYear()}
              value={attributes.yearBuilt}
              onChange={handleChange}
              className="input-field"
              placeholder="2020"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#6B7280] mb-1">Этаж</label>
            <input
              type="number"
              name="floor"
              min="0"
              value={attributes.floor}
              onChange={handleChange}
              className="input-field"
              placeholder="5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#6B7280] mb-1">Этажей в доме</label>
            <input
              type="number"
              name="totalFloors"
              min="0"
              value={attributes.totalFloors}
              onChange={handleChange}
              className="input-field"
              placeholder="12"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#6B7280] mb-1">Высота потолков (м)</label>
            <input
              type="number"
              name="ceilingHeight"
              min="0"
              step="0.1"
              value={attributes.ceilingHeight}
              onChange={handleChange}
              className="input-field"
              placeholder="2.7"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#6B7280] mb-1">Материал стен</label>
            <select
              name="wallMaterial"
              value={attributes.wallMaterial}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Выберите</option>
              <option value="brick">Кирпич</option>
              <option value="concrete">Бетон</option>
              <option value="wood">Дерево</option>
              <option value="panel">Панель</option>
              <option value="monolith">Монолит</option>
              <option value="foam_block">Пеноблок</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#6B7280] mb-1">Состояние</label>
            <select
              name="condition"
              value={attributes.condition}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Выберите</option>
              <option value="new">Новостройка</option>
              <option value="renovated">Свежий ремонт</option>
              <option value="good">Хорошее</option>
              <option value="needs_repair">Требует ремонта</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#6B7280] mb-1">Кадастровый номер</label>
          <input
            type="text"
            name="cadastralNumber"
            value={attributes.cadastralNumber}
            onChange={handleChange}
            className="input-field"
            placeholder="77:01:0000000:0000"
          />
        </div>

        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm text-[#6B7280]">
            <input
              type="checkbox"
              name="furniture"
              checked={attributes.furniture}
              onChange={handleChange}
              className="w-4 h-4"
            />
            Мебель
          </label>
          <label className="flex items-center gap-2 text-sm text-[#6B7280]">
            <input
              type="checkbox"
              name="appliances"
              checked={attributes.appliances}
              onChange={handleChange}
              className="w-4 h-4"
            />
            Бытовая техника
          </label>
          <label className="flex items-center gap-2 text-sm text-[#6B7280]">
            <input
              type="checkbox"
              name="internet"
              checked={attributes.internet}
              onChange={handleChange}
              className="w-4 h-4"
            />
            Интернет
          </label>
          <label className="flex items-center gap-2 text-sm text-[#6B7280]">
            <input
              type="checkbox"
              name="parking"
              checked={attributes.parking}
              onChange={handleChange}
              className="w-4 h-4"
            />
            Парковка
          </label>
        </div>
      </div>
    </BaseListingForm>
  );
}
