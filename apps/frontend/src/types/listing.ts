'use client';

/**
 * Типы для работы с объявлениями (listings)
 * Обеспечивает type-safety и правильную валидацию данных
 */

export type ListingType = 'product' | 'ads' | 'auto' | 'realty' | 'job' | 'service';
export type ListingStatus = 'active' | 'pending' | 'rejected' | 'sold' | 'archived';
export type ListingCondition = 'new' | 'used' | 'refurbished' | 'damaged';

export interface ListingImage {
  id?: string;
  url: string;
  order?: number;
}

export interface ListingAuthor {
  id: string;
  name: string | null;
  phone: string;
  avatar?: string | null;
  isSeller?: boolean;
  companyName?: string | null;
}

export interface ListingAttributes {
  [key: string]: string | number | boolean | null | undefined;
}

export interface Listing {
  id: string;
  title: string;
  description?: string | null;
  price: number;
  currency?: string;
  type: ListingType;
  status: ListingStatus;
  attributes?: ListingAttributes;
  images: ListingImage[];
  author: ListingAuthor;
  createdAt: string;
  updatedAt?: string;
  views?: number;
  address?: string | null;
  lat?: number | null;
  lng?: number | null;
  isPremium?: boolean;
  moderationNote?: string | null;
}

export interface ListingsResponse {
  items: Listing[];
  total: number;
  page?: number;
  limit?: number;
}

export interface ListingError {
  status: number;
  message: string;
  code?: string;
}
