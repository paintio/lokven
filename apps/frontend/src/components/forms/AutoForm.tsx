'use client';

import { useState } from 'react';
import BaseListingForm from './BaseListingForm';

interface AutoFormProps {
  initialData?: any;
  isEdit?: boolean;
}

export default function AutoForm({ initialData, isEdit }: AutoFormProps) {
  const [attributes, setAttributes] = useState({
    brand: initialData?.attributes?.brand || '',
    model: initialData?.attributes?.model || '',
    year: initialData?.attributes?.year || '',
    mileage: initialData?.attributes?.mileage || '',
    engineVolume: initialData?.attributes?.engineVolume || '',
    enginePower: initialData?.attributes?.enginePower || '',
    engineType: initialData?.attributes?.engineType || '',
    transmission: initialData?.attributes?.transmission || '',
    drive: initialData?.attributes?.drive || '',
    bodyType: initialData?.attributes?.bodyType || '',
    color: initialData?.attributes?.color || '',
    condition: initialData?.attributes?.condition || '',
    owners: initialData?.attributes?.owners || '',
    accident: initialData?.attributes?.accident || false,
    customs: initialData?.attributes?.customs || false,
    pts: initialData?.attributes?.pts || '',
    vin: initialData?.attributes?.vin || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setAttributes({
      ...attributes,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  return (
    <BaseListingForm type="auto" initialData={{ ...initialData, attributes }} isEdit={isEdit}>
      <div className="border-t border-[#E5E7EB] pt-4 mt-4">
        <h3 className="font-semibold text-[#111827] mb-3">Характеристики автомобиля</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#6B7280] mb-1">Марка *</label>
            <select
              name="brand"
              required
              value={attributes.brand}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Выберите марку</option>
              <option value="Toyota">Toyota</option>
              <option value="BMW">BMW</option>
              <option value="Mercedes-Benz">Mercedes-Benz</option>
              <option value="Audi">Audi</option>
              <option value="Volkswagen">Volkswagen</option>
              <option value="Hyundai">Hyundai</option>
              <option value="Kia">Kia</option>
              <option value="Lada">Lada</option>
              <option value="Nissan">Nissan</option>
              <option value="Honda">Honda</option>
              <option value="Ford">Ford</option>
              <option value="Chevrolet">Chevrolet</option>
              <option value="Skoda">Skoda</option>
              <option value="Renault">Renault</option>
              <option value="Mitsubishi">Mitsubishi</option>
              <option value="Subaru">Subaru</option>
              <option value="Mazda">Mazda</option>
              <option value="Lexus">Lexus</option>
              <option value="Porsche">Porsche</option>
              <option value="Volvo">Volvo</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#6B7280] mb-1">Модель *</label>
            <input
              type="text"
              name="model"
              required
              value={attributes.model}
              onChange={handleChange}
              className="input-field"
              placeholder="Camry"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#6B7280] mb-1">Год выпуска *</label>
            <input
              type="number"
              name="year"
              required
              min="1900"
              max={new Date().getFullYear()}
              value={attributes.year}
              onChange={handleChange}
              className="input-field"
              placeholder="2020"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#6B7280] mb-1">Пробег (км)</label>
            <input
              type="number"
              name="mileage"
              min="0"
              value={attributes.mileage}
              onChange={handleChange}
              className="input-field"
              placeholder="45000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#6B7280] mb-1">Количество владельцев</label>
            <input
              type="number"
              name="owners"
              min="0"
              value={attributes.owners}
              onChange={handleChange}
              className="input-field"
              placeholder="1"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#6B7280] mb-1">Объем двигателя (л)</label>
            <select
              name="engineVolume"
              value={attributes.engineVolume}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Выберите</option>
              <option value="1.0">1.0</option>
              <option value="1.2">1.2</option>
              <option value="1.4">1.4</option>
              <option value="1.6">1.6</option>
              <option value="1.8">1.8</option>
              <option value="2.0">2.0</option>
              <option value="2.4">2.4</option>
              <option value="2.5">2.5</option>
              <option value="3.0">3.0</option>
              <option value="3.5">3.5</option>
              <option value="4.0">4.0</option>
              <option value="5.0">5.0</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#6B7280] mb-1">Мощность (л.с.)</label>
            <input
              type="number"
              name="enginePower"
              min="0"
              value={attributes.enginePower}
              onChange={handleChange}
              className="input-field"
              placeholder="150"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#6B7280] mb-1">Тип двигателя</label>
            <select
              name="engineType"
              value={attributes.engineType}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Выберите</option>
              <option value="petrol">Бензин</option>
              <option value="diesel">Дизель</option>
              <option value="electric">Электро</option>
              <option value="hybrid">Гибрид</option>
              <option value="gas">Газ</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#6B7280] mb-1">Коробка передач</label>
            <select
              name="transmission"
              value={attributes.transmission}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Выберите</option>
              <option value="automatic">Автомат</option>
              <option value="manual">Механика</option>
              <option value="robot">Робот</option>
              <option value="cvt">Вариатор</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#6B7280] mb-1">Привод</label>
            <select
              name="drive"
              value={attributes.drive}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Выберите</option>
              <option value="front">Передний</option>
              <option value="rear">Задний</option>
              <option value="full">Полный</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#6B7280] mb-1">Кузов</label>
            <select
              name="bodyType"
              value={attributes.bodyType}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Выберите</option>
              <option value="sedan">Седан</option>
              <option value="hatchback">Хэтчбек</option>
              <option value="universal">Универсал</option>
              <option value="suv">Внедорожник</option>
              <option value="coupe">Купе</option>
              <option value="cabriolet">Кабриолет</option>
              <option value="minivan">Минивэн</option>
              <option value="pickup">Пикап</option>
              <option value="limousine">Лимузин</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#6B7280] mb-1">Цвет</label>
            <input
              type="text"
              name="color"
              value={attributes.color}
              onChange={handleChange}
              className="input-field"
              placeholder="Белый"
            />
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
              <option value="new">Новый</option>
              <option value="excellent">Отличное</option>
              <option value="good">Хорошее</option>
              <option value="satisfactory">Удовлетворительное</option>
              <option value="need_repair">Требует ремонта</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#6B7280] mb-1">ПТС</label>
            <select
              name="pts"
              value={attributes.pts}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Выберите</option>
              <option value="original">Оригинал</option>
              <option value="duplicate">Дубликат</option>
              <option value="electronic">Электронный</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#6B7280] mb-1">VIN номер</label>
            <input
              type="text"
              name="vin"
              value={attributes.vin}
              onChange={handleChange}
              className="input-field"
              placeholder="WDB12345678901234"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm text-[#6B7280]">
            <input
              type="checkbox"
              name="accident"
              checked={attributes.accident}
              onChange={handleChange}
              className="w-4 h-4"
            />
            Был в ДТП
          </label>
          <label className="flex items-center gap-2 text-sm text-[#6B7280]">
            <input
              type="checkbox"
              name="customs"
              checked={attributes.customs}
              onChange={handleChange}
              className="w-4 h-4"
            />
            Растаможен
          </label>
        </div>
      </div>
    </BaseListingForm>
  );
}
