'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getImageUrl } from '@/lib/api';
import {
  Search,
  Package,
  Car,
  Wrench,
  Megaphone,
  HomeIcon,
  Briefcase,
  Pin,
  X,
  MapPin,
  Inbox,
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  SlidersHorizontal,
} from 'lucide-react';

interface Listing {
  id: string;
  title: string;
  price: number;
  type: string;
  attributes: Record<string, any> | null;
  images: { url: string }[];
  author: {
    name: string | null;
    phone: string;
  };
  createdAt: string;
}

type Filters = Record<string, string>;

const categories = [
  { value: '', label: 'Все' },
  { value: 'product', label: 'Маркетплейс', icon: Package },
  { value: 'ads', label: 'Объявления', icon: Megaphone },
  { value: 'auto', label: 'Авто', icon: Car },
  { value: 'realty', label: 'Недвижимость', icon: HomeIcon },
  { value: 'job', label: 'Работа', icon: Briefcase },
  { value: 'service', label: 'Услуги', icon: Wrench },
];

const baseFilters: Filters = {
  search: '',
  type: '',
  category: '',
  minPrice: '',
  maxPrice: '',
  sort: 'new',
  address: '',

  // Авто
  brand: '',
  model: '',
  yearFrom: '',
  yearTo: '',
  mileageMax: '',
  bodyType: '',
  engine: '',
  engineVolumeFrom: '',
  engineVolumeTo: '',
  powerFrom: '',
  powerTo: '',
  transmission: '',
  drive: '',
  steeringWheel: '',
  color: '',
  condition: '',
  owners: '',
  pts: '',
  customsCleared: '',
  accident: '',

  // Недвижимость
  realtyType: '',
  dealType: '',
  rooms: '',
  areaMin: '',
  areaMax: '',
  kitchenAreaMin: '',
  floorFrom: '',
  floorTo: '',
  totalFloorsFrom: '',
  houseType: '',
  buildYearFrom: '',
  buildYearTo: '',
  renovation: '',
  bathroom: '',
  balcony: '',
  parking: '',

  // Участки
  areaUnit: '',
  electricity: '',
  gas: '',
  water: '',
  sewerage: '',
  roadType: '',
  landPurpose: '',
  cadastralNumber: '',

  // Маркетплейс
  productCategory: '',
  subcategory: '',
  storage: '',
  sellerType: '',

  // Объявления
  adsCategory: '',
  delivery: '',

  // Работа
  profession: '',
  industry: '',
  salaryFrom: '',
  salaryTo: '',
  employment: '',
  experience: '',
  schedule: '',
  education: '',
  remote: '',

  // Услуги
  serviceType: '',
  specialization: '',
  paymentType: '',
  experienceYearsFrom: '',
  homeVisit: '',
  online: '',
};

function Field({
  label,
  name,
  value,
  placeholder,
  type = 'text',
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  placeholder?: string;
  type?: string;
  onChange: (name: string, value: string) => void;
}) {
  return (
    <div>
      <label className="block mb-1.5 text-xs font-medium text-[#6B7280]">
        {label}
      </label>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(name, e.target.value)}
        className="w-full h-11 rounded-xl border border-[#E5E7EB] bg-white px-3.5 text-sm text-[#111827] outline-none transition focus:border-[#4F6BFF] focus:ring-4 focus:ring-[#4F6BFF]/10"
      />
    </div>
  );
}

function SelectField({
  label,
  name,
  value,
  options,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (name: string, value: string) => void;
}) {
  return (
    <div>
      <label className="block mb-1.5 text-xs font-medium text-[#6B7280]">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        className="w-full h-11 rounded-xl border border-[#E5E7EB] bg-white px-3.5 text-sm text-[#111827] outline-none transition focus:border-[#4F6BFF] focus:ring-4 focus:ring-[#4F6BFF]/10"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

const yesNoOptions = [
  { value: '', label: 'Не важно' },
  { value: 'true', label: 'Да' },
  { value: 'false', label: 'Нет' },
];

function ListingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState<Filters>(() => {
    const initial = { ...baseFilters };

    Object.keys(initial).forEach((key) => {
      initial[key] = searchParams.get(key) || initial[key];
    });

    return initial;
  });

  useEffect(() => {
    fetchListings();
  }, [searchParams, page]);

  const fetchListings = async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams(searchParams.toString());

      params.set('page', page.toString());
      params.set('limit', '20');

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/listings?${params.toString()}`
      );

      const data = await response.json();

      setListings(data.items || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error('Error fetching listings:', error);
      setListings([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const changeFilter = (name: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const buildParams = (values: Filters) => {
    const params = new URLSearchParams();

    Object.entries(values).forEach(([key, value]) => {
      if (value !== '') {
        params.set(key, value);
      }
    });

    return params;
  };

  const applyFilters = () => {
    setPage(1);
    router.push(`/listings?${buildParams(filters).toString()}`);
  };

  const selectCategory = (type: string) => {
    const nextFilters = {
      ...baseFilters,
      search: filters.search,
      address: filters.address,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      sort: filters.sort,
      type,
    };

    setFilters(nextFilters);
    setPage(1);

    router.push(
      `/listings?${buildParams(nextFilters).toString()}`
    );
  };

  const clearFilters = () => {
    setFilters({ ...baseFilters });
    setPage(1);
    setShowFilters(false);
    router.push('/listings');
  };

  const formatPrice = (price: number) =>
    price.toLocaleString('ru-RU') + ' ₽';

  const getTypeIcon = (type: string) => {
    const icons: Record<string, any> = {
      product: Package,
      ads: Megaphone,
      auto: Car,
      realty: HomeIcon,
      job: Briefcase,
      service: Wrench,
    };

    return icons[type] || Pin;
  };

  const getCategoryTitle = () => {
    const category = categories.find(
      (item) => item.value === filters.type
    );

    return category?.label || 'Все объявления';
  };

  const autoBrands: Record<string, string[]> = {
    BMW: ['1 Series', '3 Series', '5 Series', '7 Series', 'X1', 'X3', 'X5', 'X6', 'X7'],
    Mercedes: ['A-Class', 'C-Class', 'E-Class', 'S-Class', 'CLA', 'GLA', 'GLC', 'GLE', 'GLS'],
    Audi: ['A1', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'Q3', 'Q5', 'Q7', 'Q8'],
    Ford: ['Focus', 'Fiesta', 'Mondeo', 'Kuga', 'Explorer', 'Mustang', 'Transit'],
    Toyota: ['Corolla', 'Camry', 'RAV4', 'Land Cruiser', 'Highlander', 'Prius', 'Yaris'],
    Volkswagen: ['Polo', 'Golf', 'Passat', 'Tiguan', 'Touareg', 'Jetta', 'Transporter'],
    Volvo: ['S60', 'S90', 'V60', 'V90', 'XC40', 'XC60', 'XC90'],
    Honda: ['Civic', 'Accord', 'CR-V', 'HR-V', 'Jazz'],
    Nissan: ['Qashqai', 'X-Trail', 'Juke', 'Patrol', 'Micra', 'Leaf'],
    Hyundai: ['Solaris', 'Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Creta'],
    Kia: ['Rio', 'Ceed', 'K5', 'Sportage', 'Sorento', 'Stinger'],
    Renault: ['Logan', 'Sandero', 'Duster', 'Kaptur', 'Megane', 'Arkana'],
    Skoda: ['Fabia', 'Rapid', 'Octavia', 'Superb', 'Karoq', 'Kodiaq'],
    Mazda: ['Mazda 2', 'Mazda 3', 'Mazda 6', 'CX-3', 'CX-5', 'CX-9'],
    Lexus: ['IS', 'ES', 'LS', 'NX', 'RX', 'GX', 'LX'],
    Porsche: ['718', '911', 'Panamera', 'Macan', 'Cayenne', 'Taycan'],
    Chevrolet: ['Aveo', 'Cruze', 'Malibu', 'Camaro', 'Tahoe', 'Trailblazer'],
    Opel: ['Corsa', 'Astra', 'Insignia', 'Mokka', 'Zafira'],
    Peugeot: ['208', '308', '408', '508', '2008', '3008', '5008'],
    Citroen: ['C3', 'C4', 'C5', 'Berlingo', 'C3 Aircross', 'C5 Aircross'],
    Fiat: ['500', 'Panda', 'Tipo', 'Doblo', 'Ducato'],
    Tesla: ['Model 3', 'Model S', 'Model X', 'Model Y'],
    Lada: ['Granta', 'Vesta', 'Niva', 'Largus', 'XRAY'],
  };

  const autoYears = Array.from(
    { length: new Date().getFullYear() - 1949 },
    (_, index) => String(new Date().getFullYear() - index)
  );

  const engineVolumes = [
    '0.6',
    '0.8',
    '1.0',
    '1.2',
    '1.3',
    '1.4',
    '1.5',
    '1.6',
    '1.8',
    '2.0',
    '2.2',
    '2.3',
    '2.4',
    '2.5',
    '2.7',
    '2.8',
    '3.0',
    '3.2',
    '3.5',
    '4.0',
    '4.2',
    '4.4',
    '4.5',
    '5.0',
    '5.5',
    '6.0',
    '6.5',
    '7.0',
  ];

  const renderAutoFilters = () => {
    const models = filters.brand
      ? autoBrands[filters.brand] || []
      : [];

    return (
      <>
        <SelectField
          label="Марка"
          name="brand"
          value={filters.brand}
          onChange={(name, value) => {
            changeFilter(name, value);
            changeFilter('model', '');
          }}
          options={[
            { value: '', label: 'Любая марка' },
            ...Object.keys(autoBrands)
              .sort()
              .map((brand) => ({
                value: brand,
                label: brand,
              })),
          ]}
        />

        <SelectField
          label="Модель"
          name="model"
          value={filters.model}
          onChange={changeFilter}
          options={[
            {
              value: '',
              label: filters.brand
                ? 'Любая модель'
                : 'Сначала выберите марку',
            },
            ...models.map((model) => ({
              value: model,
              label: model,
            })),
          ]}
        />

        <SelectField
          label="Год"
          name="yearFrom"
          value={filters.yearFrom}
          onChange={changeFilter}
          options={[
            { value: '', label: 'Любой год' },
            ...autoYears.map((year) => ({
              value: year,
              label: year,
            })),
          ]}
        />

        <Field
          label="Пробег км."
          name="mileageMax"
          value={filters.mileageMax}
          type="number"
          onChange={changeFilter}
        />

        <SelectField
          label="Кузов"
          name="bodyType"
          value={filters.bodyType}
          onChange={changeFilter}
          options={[
            { value: '', label: 'Любой' },
            { value: 'sedan', label: 'Седан' },
            { value: 'hatchback', label: 'Хэтчбек' },
            { value: 'wagon', label: 'Универсал' },
            { value: 'suv', label: 'Внедорожник / кроссовер' },
            { value: 'coupe', label: 'Купе' },
            { value: 'convertible', label: 'Кабриолет' },
            { value: 'minivan', label: 'Минивэн' },
            { value: 'pickup', label: 'Пикап' },
            { value: 'van', label: 'Фургон' },
          ]}
        />

        <SelectField
          label="Двигатель"
          name="engine"
          value={filters.engine}
          onChange={changeFilter}
          options={[
            { value: '', label: 'Любой' },
            { value: 'petrol', label: 'Бензин' },
            { value: 'diesel', label: 'Дизель' },
            { value: 'hybrid', label: 'Гибрид' },
            { value: 'electric', label: 'Электро' },
            { value: 'gas', label: 'Газ' },
          ]}
        />

        <SelectField
          label="Объем л."
          name="engineVolumeFrom"
          value={filters.engineVolumeFrom}
          onChange={changeFilter}
          options={[
            { value: '', label: 'Любой объем' },
            ...engineVolumes.map((volume) => ({
              value: volume,
              label: volume,
            })),
          ]}
        />

        <Field
          label="Мощность л.с."
          name="powerFrom"
          value={filters.powerFrom}
          type="number"
          onChange={changeFilter}
        />

        <SelectField
          label="Коробка передач"
          name="transmission"
          value={filters.transmission}
          onChange={changeFilter}
          options={[
            { value: '', label: 'Любая' },
            { value: 'manual', label: 'Механика' },
            { value: 'automatic', label: 'Автомат' },
            { value: 'robot', label: 'Робот' },
            { value: 'variator', label: 'Вариатор' },
          ]}
        />

        <SelectField
          label="Привод"
          name="drive"
          value={filters.drive}
          onChange={changeFilter}
          options={[
            { value: '', label: 'Любой' },
            { value: 'front', label: 'Передний' },
            { value: 'rear', label: 'Задний' },
            { value: 'awd', label: 'Полный' },
          ]}
        />

        <SelectField
          label="Руль"
          name="steeringWheel"
          value={filters.steeringWheel}
          onChange={changeFilter}
          options={[
            { value: '', label: 'Любой' },
            { value: 'left', label: 'Левый' },
            { value: 'right', label: 'Правый' },
          ]}
        />

        <Field
          label="Цвет"
          name="color"
          value={filters.color}
          placeholder="Белый, черный..."
          onChange={changeFilter}
        />

        <SelectField
          label="Состояние"
          name="condition"
          value={filters.condition}
          onChange={changeFilter}
          options={[
            { value: '', label: 'Любое' },
            { value: 'new', label: 'Новый' },
            { value: 'used', label: 'С пробегом' },
            { value: 'damaged', label: 'Поврежден' },
          ]}
        />

        <SelectField
          label="Владельцев"
          name="owners"
          value={filters.owners}
          onChange={changeFilter}
          options={[
            { value: '', label: 'Не важно' },
            { value: '1', label: '1 владелец' },
            { value: '2', label: '2 владельца' },
            { value: '3', label: '3 владельца' },
            { value: '4+', label: '4 и более' },
          ]}
        />

        <SelectField
          label="ПТС"
          name="pts"
          value={filters.pts}
          onChange={changeFilter}
          options={[
            { value: '', label: 'Не важно' },
            { value: 'original', label: 'Оригинал' },
            { value: 'duplicate', label: 'Дубликат' },
            { value: 'electronic', label: 'Электронный' },
          ]}
        />

        <SelectField
          label="Растаможен"
          name="customsCleared"
          value={filters.customsCleared}
          options={yesNoOptions}
          onChange={changeFilter}
        />

        <SelectField
          label="Участие в ДТП"
          name="accident"
          value={filters.accident}
          options={yesNoOptions}
          onChange={changeFilter}
        />
    </>
    );
  };

  const renderRealtyFilters = () => (
    <>
      <SelectField
        label="Тип недвижимости"
        name="realtyType"
        value={filters.realtyType}
        onChange={changeFilter}
        options={[
          { value: '', label: 'Любая' },
          { value: 'apartment', label: 'Квартира' },
          { value: 'house', label: 'Дом' },
          { value: 'room', label: 'Комната' },
          { value: 'land', label: 'Участок' },
          { value: 'commercial', label: 'Коммерческая' },
          { value: 'garage', label: 'Гараж' },
        ]}
      />

      <SelectField
        label="Тип сделки"
        name="dealType"
        value={filters.dealType}
        onChange={changeFilter}
        options={[
          { value: '', label: 'Любой' },
          { value: 'sale', label: 'Продажа' },
          { value: 'rent', label: 'Аренда' },
        ]}
      />

      <SelectField
        label="Комнаты"
        name="rooms"
        value={filters.rooms}
        onChange={changeFilter}
        options={[
          { value: '', label: 'Любое количество' },
          { value: '1', label: '1' },
          { value: '2', label: '2' },
          { value: '3', label: '3' },
          { value: '4', label: '4' },
          { value: '5', label: '5+' },
        ]}
      />

      <Field label="Площадь от, м²" name="areaMin" value={filters.areaMin} type="number" onChange={changeFilter} />
      <Field label="Площадь до, м²" name="areaMax" value={filters.areaMax} type="number" onChange={changeFilter} />
      <Field label="Кухня от, м²" name="kitchenAreaMin" value={filters.kitchenAreaMin} type="number" onChange={changeFilter} />

      <Field label="Этаж от" name="floorFrom" value={filters.floorFrom} type="number" onChange={changeFilter} />
      <Field label="Этаж до" name="floorTo" value={filters.floorTo} type="number" onChange={changeFilter} />
      <Field label="Этажей в доме от" name="totalFloorsFrom" value={filters.totalFloorsFrom} type="number" onChange={changeFilter} />

      <SelectField
        label="Тип дома"
        name="houseType"
        value={filters.houseType}
        onChange={changeFilter}
        options={[
          { value: '', label: 'Любой' },
          { value: 'brick', label: 'Кирпичный' },
          { value: 'panel', label: 'Панельный' },
          { value: 'monolith', label: 'Монолитный' },
          { value: 'block', label: 'Блочный' },
          { value: 'wood', label: 'Деревянный' },
        ]}
      />

      <Field label="Год постройки от" name="buildYearFrom" value={filters.buildYearFrom} type="number" onChange={changeFilter} />
      <Field label="Год постройки до" name="buildYearTo" value={filters.buildYearTo} type="number" onChange={changeFilter} />

      <SelectField
        label="Ремонт"
        name="renovation"
        value={filters.renovation}
        onChange={changeFilter}
        options={[
          { value: '', label: 'Любой' },
          { value: 'none', label: 'Без ремонта' },
          { value: 'cosmetic', label: 'Косметический' },
          { value: 'euro', label: 'Евроремонт' },
          { value: 'designer', label: 'Дизайнерский' },
        ]}
      />

      <SelectField
        label="Санузел"
        name="bathroom"
        value={filters.bathroom}
        onChange={changeFilter}
        options={[
          { value: '', label: 'Любой' },
          { value: 'combined', label: 'Совмещённый' },
          { value: 'separate', label: 'Раздельный' },
        ]}
      />

      <SelectField label="Балкон" name="balcony" value={filters.balcony} options={yesNoOptions} onChange={changeFilter} />
      <SelectField label="Парковка" name="parking" value={filters.parking} options={yesNoOptions} onChange={changeFilter} />
    </>
  );

  // 🏡 ФИЛЬТРЫ ДЛЯ УЧАСТКОВ
  const renderLandFilters = () => (
    <>
      <SelectField
        label="Тип участка"
        name="landPurpose"
        value={filters.landPurpose}
        onChange={changeFilter}
        options={[
          { value: '', label: 'Любой' },
          { value: 'ИЖС', label: 'ИЖС' },
          { value: 'ЛПХ', label: 'ЛПХ' },
          { value: 'СНТ', label: 'СНТ' },
          { value: 'ДНП', label: 'ДНП' },
          { value: 'КФХ', label: 'КФХ' },
          { value: 'коммерческое', label: 'Коммерческое' },
          { value: 'промышленное', label: 'Промышленное' },
        ]}
      />

      <div className="grid grid-cols-2 gap-3">
        <Field
          label="Площадь от"
          name="areaMin"
          value={filters.areaMin}
          type="number"
          onChange={changeFilter}
        />
        <Field
          label="Площадь до"
          name="areaMax"
          value={filters.areaMax}
          type="number"
          onChange={changeFilter}
        />
      </div>

      <SelectField
        label="Единица площади"
        name="areaUnit"
        value={filters.areaUnit}
        onChange={changeFilter}
        options={[
          { value: '', label: 'Любая' },
          { value: 'сотка', label: 'Сотки' },
          { value: 'гектар', label: 'Гектары' },
          { value: 'м²', label: 'м²' },
        ]}
      />

      <div className="col-span-1 sm:col-span-2">
        <p className="text-xs font-medium text-[#6B7280] mb-2">Коммуникации</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <SelectField
            label="Электричество"
            name="electricity"
            value={filters.electricity}
            options={yesNoOptions}
            onChange={changeFilter}
          />
          <SelectField
            label="Газ"
            name="gas"
            value={filters.gas}
            options={yesNoOptions}
            onChange={changeFilter}
          />
          <SelectField
            label="Вода"
            name="water"
            value={filters.water}
            options={yesNoOptions}
            onChange={changeFilter}
          />
          <SelectField
            label="Канализация"
            name="sewerage"
            value={filters.sewerage}
            options={yesNoOptions}
            onChange={changeFilter}
          />
        </div>
      </div>

      <SelectField
        label="Дорога"
        name="roadType"
        value={filters.roadType}
        onChange={changeFilter}
        options={[
          { value: '', label: 'Любая' },
          { value: 'асфальт', label: 'Асфальтированная' },
          { value: 'грунт', label: 'Грунтовая' },
          { value: 'щебень', label: 'Щебёночная' },
          { value: 'бетон', label: 'Бетонная' },
          { value: 'отсутствует', label: 'Отсутствует' },
        ]}
      />

      <Field
        label="Кадастровый номер"
        name="cadastralNumber"
        value={filters.cadastralNumber}
        placeholder="77:01:0000000:0000"
        onChange={changeFilter}
      />
    </>
  );

  const renderProductFilters = () => (
    <>
      <Field label="Категория товара" name="productCategory" value={filters.productCategory} placeholder="Электроника..." onChange={changeFilter} />
      <Field label="Подкатегория" name="subcategory" value={filters.subcategory} placeholder="Смартфоны..." onChange={changeFilter} />
      <Field label="Бренд" name="brand" value={filters.brand} placeholder="Apple, Samsung..." onChange={changeFilter} />
      <Field label="Модель" name="model" value={filters.model} onChange={changeFilter} />
      <Field label="Цвет" name="color" value={filters.color} onChange={changeFilter} />
      <Field label="Память" name="storage" value={filters.storage} placeholder="128 GB" onChange={changeFilter} />

      <SelectField
        label="Состояние"
        name="condition"
        value={filters.condition}
        onChange={changeFilter}
        options={[
          { value: '', label: 'Любое' },
          { value: 'new', label: 'Новое' },
          { value: 'used', label: 'Б/у' },
          { value: 'refurbished', label: 'Восстановленное' },
        ]}
      />

      <SelectField
        label="Продавец"
        name="sellerType"
        value={filters.sellerType}
        onChange={changeFilter}
        options={[
          { value: '', label: 'Любой' },
          { value: 'private', label: 'Частное лицо' },
          { value: 'company', label: 'Компания' },
        ]}
      />
    </>
  );

  const renderAdsFilters = () => (
    <>
      <Field label="Категория" name="adsCategory" value={filters.adsCategory} placeholder="Животные, хобби..." onChange={changeFilter} />
      <Field label="Подкатегория" name="subcategory" value={filters.subcategory} onChange={changeFilter} />

      <SelectField
        label="Состояние"
        name="condition"
        value={filters.condition}
        onChange={changeFilter}
        options={[
          { value: '', label: 'Любое' },
          { value: 'new', label: 'Новое' },
          { value: 'used', label: 'Б/у' },
        ]}
      />

      <SelectField
        label="Продавец"
        name="sellerType"
        value={filters.sellerType}
        onChange={changeFilter}
        options={[
          { value: '', label: 'Любой' },
          { value: 'private', label: 'Частное лицо' },
          { value: 'company', label: 'Компания' },
        ]}
      />

      <SelectField label="Доставка" name="delivery" value={filters.delivery} options={yesNoOptions} onChange={changeFilter} />
    </>
  );

  const renderJobFilters = () => (
    <>
      <Field label="Профессия / должность" name="profession" value={filters.profession} placeholder="Водитель, менеджер..." onChange={changeFilter} />
      <Field label="Отрасль" name="industry" value={filters.industry} onChange={changeFilter} />
      <Field label="Зарплата от" name="salaryFrom" value={filters.salaryFrom} type="number" onChange={changeFilter} />
      <Field label="Зарплата до" name="salaryTo" value={filters.salaryTo} type="number" onChange={changeFilter} />

      <SelectField
        label="Занятость"
        name="employment"
        value={filters.employment}
        onChange={changeFilter}
        options={[
          { value: '', label: 'Любая' },
          { value: 'full', label: 'Полная' },
          { value: 'part', label: 'Частичная' },
          { value: 'project', label: 'Проектная' },
          { value: 'internship', label: 'Стажировка' },
        ]}
      />

      <SelectField
        label="Опыт"
        name="experience"
        value={filters.experience}
        onChange={changeFilter}
        options={[
          { value: '', label: 'Любой' },
          { value: 'none', label: 'Без опыта' },
          { value: '1-3', label: '1–3 года' },
          { value: '3-6', label: '3–6 лет' },
          { value: '6+', label: 'Более 6 лет' },
        ]}
      />

      <SelectField
        label="График"
        name="schedule"
        value={filters.schedule}
        onChange={changeFilter}
        options={[
          { value: '', label: 'Любой' },
          { value: 'full_day', label: 'Полный день' },
          { value: 'shift', label: 'Сменный' },
          { value: 'flexible', label: 'Гибкий' },
          { value: 'remote', label: 'Удалённый' },
          { value: 'rotation', label: 'Вахта' },
        ]}
      />

      <SelectField
        label="Образование"
        name="education"
        value={filters.education}
        onChange={changeFilter}
        options={[
          { value: '', label: 'Не важно' },
          { value: 'secondary', label: 'Среднее' },
          { value: 'special', label: 'Среднее специальное' },
          { value: 'higher', label: 'Высшее' },
        ]}
      />

      <SelectField label="Удалённая работа" name="remote" value={filters.remote} options={yesNoOptions} onChange={changeFilter} />
    </>
  );

  const renderServiceFilters = () => (
    <>
      <Field label="Категория услуги" name="serviceType" value={filters.serviceType} placeholder="Ремонт, обучение..." onChange={changeFilter} />
      <Field label="Специализация" name="specialization" value={filters.specialization} onChange={changeFilter} />

      <SelectField
        label="Тип оплаты"
        name="paymentType"
        value={filters.paymentType}
        onChange={changeFilter}
        options={[
          { value: '', label: 'Любой' },
          { value: 'fixed', label: 'Фиксированная цена' },
          { value: 'hour', label: 'За час' },
          { value: 'service', label: 'За услугу' },
          { value: 'negotiable', label: 'Договорная' },
        ]}
      />

      <Field label="Опыт от, лет" name="experienceYearsFrom" value={filters.experienceYearsFrom} type="number" onChange={changeFilter} />
      <SelectField label="Выезд к клиенту" name="homeVisit" value={filters.homeVisit} options={yesNoOptions} onChange={changeFilter} />
      <SelectField label="Онлайн" name="online" value={filters.online} options={yesNoOptions} onChange={changeFilter} />
    </>
  );

  const renderCategoryFilters = () => {
    switch (filters.type) {
      case 'auto':
        return renderAutoFilters();
      case 'realty':
        if (filters.realtyType === 'land') {
          return renderLandFilters();
        }
        return renderRealtyFilters();
      case 'product':
        return renderProductFilters();
      case 'ads':
        return renderAdsFilters();
      case 'job':
        return renderJobFilters();
      case 'service':
        return renderServiceFilters();
      default:
        return null;
    }
  };

  const totalPages = Math.ceil(total / 20);

  return (
    <div className="container-custom py-5 md:py-7">
      <div className="flex items-end justify-between gap-4 mb-4">
        <div>
          <p className="text-xs font-semibold text-[#4F6BFF] mb-1">
            Каталог Lokven
          </p>

          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#111827]">
            {getCategoryTitle()}
          </h1>
        </div>

        <span className="hidden sm:block text-sm text-[#6B7280]">
          Найдено: {total}
        </span>
      </div>

      <div className="rounded-[22px] border border-white/70 bg-white/80 backdrop-blur-xl shadow-[0_12px_40px_rgba(15,23,42,0.08)] p-3 md:p-4 mb-5">
        <div className="flex flex-col lg:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#9CA3AF]" />

            <input
              value={filters.search}
              onChange={(e) => changeFilter('search', e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
              placeholder="Что вы ищете?"
              className="w-full h-12 rounded-xl border border-[#E5E7EB] bg-white/90 pl-11 pr-4 text-sm outline-none focus:border-[#4F6BFF]"
            />
          </div>

          <div className="relative lg:w-[220px]">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#9CA3AF]" />

            <input
              value={filters.address}
              onChange={(e) => changeFilter('address', e.target.value)}
              placeholder="Город"
              className="w-full h-12 rounded-xl border border-[#E5E7EB] bg-white/90 pl-11 pr-4 text-sm outline-none focus:border-[#4F6BFF]"
            />
          </div>

          <button
            onClick={applyFilters}
            className="h-12 px-6 rounded-xl bg-[#4F6BFF] text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(79,107,255,0.25)]"
          >
            <Search className="w-4 h-4" />
            Найти
          </button>

          <button
            onClick={() => setShowFilters((prev) => !prev)}
            className={`h-12 px-5 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 ${
              showFilters
                ? 'border-[#4F6BFF] bg-[#EEF1FF] text-[#4F6BFF]'
                : 'border-[#E5E7EB] bg-white text-[#374151]'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Фильтры
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto pt-3 pb-1">
          {categories.map((category) => {
            const Icon = category.icon;
            const active = filters.type === category.value;

            return (
              <button
                key={category.value}
                onClick={() => selectCategory(category.value)}
                className={`shrink-0 h-9 px-3.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition ${
                  active
                    ? 'bg-[#111827] border-[#111827] text-white'
                    : 'bg-white/80 border-[#E5E7EB] text-[#4B5563]'
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                {category.label}
              </button>
            );
          })}
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-[#E5E7EB]">
            <div className="mb-5">
              <p className="text-sm font-semibold text-[#111827] mb-3">
                Основные параметры
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <Field label="Цена от" name="minPrice" value={filters.minPrice} type="number" onChange={changeFilter} />
                <Field label="Цена до" name="maxPrice" value={filters.maxPrice} type="number" onChange={changeFilter} />

                <SelectField
                  label="Сортировка"
                  name="sort"
                  value={filters.sort}
                  onChange={changeFilter}
                  options={[
                    { value: 'new', label: 'Сначала новые' },
                    { value: 'price_asc', label: 'Сначала дешевле' },
                    { value: 'price_desc', label: 'Сначала дороже' },
                    { value: 'popular', label: 'По популярности' },
                  ]}
                />
              </div>
            </div>

            {filters.type && (
              <div>
                <p className="text-sm font-semibold text-[#111827] mb-3">
                  Параметры: {getCategoryTitle()}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {renderCategoryFilters()}
                </div>
              </div>
            )}

            {!filters.type && (
              <div className="rounded-xl bg-[#F5F7FF] border border-[#E0E7FF] px-4 py-3 text-sm text-[#5B6475]">
                Выберите раздел выше — появятся подробные параметры именно для него.
              </div>
            )}

            <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-[#E5E7EB]">
              <button
                onClick={applyFilters}
                className="h-10 px-5 rounded-xl bg-[#4F6BFF] text-white text-sm font-semibold"
              >
                Показать объявления
              </button>

              <button
                onClick={clearFilters}
                className="h-10 px-4 rounded-xl text-sm font-medium text-[#6B7280] flex items-center gap-2 hover:bg-[#F3F4F6]"
              >
                <X className="w-4 h-4" />
                Сбросить всё
              </button>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="text-center py-16 text-[#9CA3AF]">
          Загрузка...
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-16 bg-white/80 backdrop-blur-xl rounded-[24px] border border-white/70">
          <Inbox className="w-14 h-14 text-[#9CA3AF] mx-auto mb-3" />

          <p className="font-semibold text-[#374151]">
            Объявлений не найдено
          </p>

          <p className="text-sm text-[#9CA3AF] mt-1">
            Попробуйте изменить параметры поиска
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
          {listings.map((listing) => {
            const Icon = getTypeIcon(listing.type);

            return (
              <a
                href={`/listings/${listing.id}`}
                key={listing.id}
                className="group overflow-hidden rounded-[20px] border border-white/70 bg-white/90 backdrop-blur-xl shadow-[0_8px_24px_rgba(15,23,42,0.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.13)]"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[#F3F4F6]">
                  {listing.images?.length > 0 ? (
                    <img
                      src={getImageUrl(listing.images[0].url)}
                      alt={listing.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Icon className="w-14 h-14 text-[#9CA3AF]" />
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="text-[15px] font-semibold text-[#111827] line-clamp-2">
                    {listing.title}
                  </h3>

                  <div className="mt-2 text-lg font-bold text-[#111827]">
                    {formatPrice(listing.price)}
                  </div>

                  <div className="mt-3 pt-3 border-t border-[#F3F4F6] text-xs text-[#6B7280] truncate">
                    {listing.author.name || listing.author.phone}
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => setPage((value) => Math.max(1, value - 1))}
            disabled={page === 1}
            className="w-10 h-10 rounded-xl border border-[#E5E7EB] bg-white flex items-center justify-center disabled:opacity-40"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <span className="px-4 text-sm font-semibold text-[#374151]">
            {page} / {totalPages}
          </span>

          <button
            onClick={() =>
              setPage((value) => Math.min(totalPages, value + 1))
            }
            disabled={page === totalPages}
            className="w-10 h-10 rounded-xl border border-[#E5E7EB] bg-white flex items-center justify-center disabled:opacity-40"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export default function ListingsPage() {
  return (
    <Suspense
      fallback={
        <div className="container-custom py-12 text-center text-[#9CA3AF]">
          Загрузка...
        </div>
      }
    >
      <ListingsContent />
    </Suspense>
  );
}