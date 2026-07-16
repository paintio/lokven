'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Package,
  Car,
  Wrench,
  Megaphone,
  Home,
  Briefcase,
  Pin,
  ShoppingBag,
  Phone,
  MessageSquare,
  Heart,
  Edit,
  Eye,
  Calendar,
  MapPin,
  Building,
  User,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowLeft,
  Star,
  Share2,
  ExternalLink,
} from 'lucide-react';
import { attributeLabels } from '@/lib/attribute-labels';
import VehicleCheck from '@/components/listing/VehicleCheck';
import RealtyCheck from '@/components/listing/RealtyCheck';

interface Listing {
  id: string;
  title: string;
  description: string | null;
  price: number;
  currency: string;
  type: string;
  attributes: any;
  lat: number | null;
  lng: number | null;
  address: string | null;
  status: string;
  views: number;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string | null;
    phone: string;
    avatar: string | null;
    isSeller: boolean;
    companyName: string | null;
  };
  images: { url: string }[];
}

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [isAuthor, setIsAuthor] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchListing();
    }
  }, [params.id]);

  const fetchListing = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/listings/${params.id}`);
      if (!response.ok) {
        throw new Error('Объявление не найдено');
      }
      const data = await response.json();
      setListing(data);
      
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        setIsAuthor(user.id === data.author.id);
      }
      
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/listings/${params.id}/views`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Error fetching listing:', error);
      router.push('/404');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('ru-RU') + ' ₽';
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      product: 'Маркетплейс',
      ads: 'Объявление',
      auto: 'Авто',
      realty: 'Недвижимость',
      job: 'Работа',
      service: 'Услуга',
    };
    return types[type] || type;
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, any> = {
      product: ShoppingBag,
      ads: Megaphone,
      auto: Car,
      realty: Home,
      job: Briefcase,
      service: Wrench,
    };
    return icons[type] || Pin;
  };

  const renderAttributes = () => {
    if (!listing?.attributes) return null;
    const attrs = listing.attributes;
    const keys = Object.keys(attrs).filter(k => 
      attrs[k] !== '' && attrs[k] !== null && attrs[k] !== undefined
    );
    if (keys.length === 0) return null;

    return (
      <div className="mt-6">
        <h3 className="font-semibold text-[#111827] mb-3">Характеристики</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {keys.map((key) => {
            const label = attributeLabels[key] || key;
            const value = typeof attrs[key] === 'boolean' 
              ? (attrs[key] ? 'Да' : 'Нет') 
              : attrs[key];
            
            return (
              <div key={key} className="flex justify-between py-2 px-3 bg-[#F9FAFB] rounded-lg">
                <span className="text-sm text-[#6B7280]">{label}</span>
                <span className="text-sm font-medium text-[#111827]">{value}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container-custom py-12 text-center text-[#9CA3AF]">
        Загрузка...
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="container-custom py-12 text-center">
        <AlertCircle className="w-16 h-16 text-[#9CA3AF] mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-[#111827] mb-2">Объявление не найдено</h1>
        <p className="text-[#6B7280] mb-4">Возможно, оно было удалено или перемещено</p>
        <Link href="/" className="btn-primary">Вернуться на главную</Link>
      </div>
    );
  }

  const TypeIcon = getTypeIcon(listing.type);

  return (
    <div className="container-custom py-8">
      <div className="flex items-center gap-2 text-sm text-[#6B7280] mb-4">
        <Link href="/" className="hover:text-[#111827]">Главная</Link>
        <span>/</span>
        <Link href="/listings" className="hover:text-[#111827]">Объявления</Link>
        <span>/</span>
        <span className="text-[#111827]">{listing.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
            <div className="relative w-full h-[400px] bg-[#F3F4F6]">
              {listing.images && listing.images.length > 0 ? (
                <img
                  src={listing.images[activeImage].url}
                  alt={listing.title}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <TypeIcon className="w-20 h-20 text-[#9CA3AF]" />
                </div>
              )}
            </div>
            
            {listing.images && listing.images.length > 1 && (
              <div className="flex gap-2 p-4 overflow-x-auto">
                {listing.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      activeImage === index ? 'border-[#6366F1]' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`Фото ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* =========================
              🔹 БЛОК ПРОВЕРКИ
              ========================= */}
          <div className="mt-6 space-y-4">
            {listing.type === 'auto' && listing.attributes?.vin && (
              <VehicleCheck vin={listing.attributes.vin} />
            )}
            
            {listing.type === 'realty' && listing.attributes?.cadastralNumber && (
              <RealtyCheck cadastralNumber={listing.attributes.cadastralNumber} />
            )}
            
            {listing.type === 'auto' && !listing.attributes?.vin && (
              <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] text-center">
                <Car className="w-8 h-8 text-[#9CA3AF] mx-auto mb-2" />
                <p className="text-sm text-[#6B7280]">VIN номер не указан</p>
                <p className="text-xs text-[#9CA3AF]">Проверка автомобиля недоступна</p>
              </div>
            )}
            
            {listing.type === 'realty' && !listing.attributes?.cadastralNumber && (
              <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] text-center">
                <Home className="w-8 h-8 text-[#9CA3AF] mx-auto mb-2" />
                <p className="text-sm text-[#6B7280]">Кадастровый номер не указан</p>
                <p className="text-xs text-[#9CA3AF]">Проверка недвижимости недоступна</p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 sticky top-20">
            <div className="flex items-center gap-2 mb-2">
              <TypeIcon className="w-4 h-4 text-[#6B7280]" />
              <span className="text-xs px-2 py-1 bg-[#F3F4F6] rounded-full text-[#6B7280]">
                {getTypeLabel(listing.type)}
              </span>
              <span className="text-xs text-[#9CA3AF]">•</span>
              <span className="text-xs text-[#9CA3AF] flex items-center gap-1">
                <Eye className="w-3 h-3" /> {listing.views}
              </span>
            </div>

            <h1 className="text-2xl font-bold text-[#111827] mb-2">{listing.title}</h1>
            
            <div className="text-3xl font-bold text-[#111827] mb-4">
              {formatPrice(listing.price)}
            </div>

            <div className="space-y-3 text-sm">
              {listing.description && (
                <div>
                  <h3 className="font-semibold text-[#111827]">Описание</h3>
                  <div className="text-[#6B7280] mt-1 whitespace-pre-wrap">
                    {listing.description}
                  </div>
                </div>
              )}

              {listing.address && (
                <div>
                  <h3 className="font-semibold text-[#111827] flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> Адрес
                  </h3>
                  <p className="text-[#6B7280] mt-1">{listing.address}</p>
                </div>
              )}

              {renderAttributes()}

              <div>
                <h3 className="font-semibold text-[#111827] flex items-center gap-1">
                  <User className="w-4 h-4" /> Продавец
                </h3>
                <p className="text-[#6B7280] mt-1">
                  {listing.author.name || listing.author.phone}
                  {listing.author.isSeller && (
                    <span className="ml-2 text-xs text-[#6366F1]">Продавец</span>
                  )}
                </p>
                {listing.author.companyName && (
                  <p className="text-xs text-[#9CA3AF]">{listing.author.companyName}</p>
                )}
              </div>

              <div>
                <h3 className="font-semibold text-[#111827] flex items-center gap-1">
                  <Calendar className="w-4 h-4" /> Дата публикации
                </h3>
                <p className="text-[#6B7280] mt-1">{formatDate(listing.createdAt)}</p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-[#E5E7EB] flex flex-col gap-3">
              {isAuthor ? (
                <Link href={`/listings/${listing.id}/edit`} className="btn-primary w-full text-center flex items-center justify-center gap-2">
                  <Edit className="w-4 h-4" />
                  Редактировать
                </Link>
              ) : (
                <>
                  <button className="btn-primary w-full flex items-center justify-center gap-2">
                    <Phone className="w-4 h-4" />
                    Показать телефон
                  </button>
                  <button className="btn-secondary w-full flex items-center justify-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Написать сообщение
                  </button>
                  <button className="btn-outline w-full flex items-center justify-center gap-2">
                    <Heart className="w-4 h-4" />
                    В избранное
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}