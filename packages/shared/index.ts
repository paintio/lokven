export interface User {
  id: string;
  phone: string;
  name: string | null;
  avatar: string | null;
  createdAt: string;
}

export interface Image {
  id: string;
  url: string;
  listingId: string;
  createdAt: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string | null;
  price: number;
  currency: string;
  type: 'product' | 'auto' | 'service';
  attributes: Record<string, any>;
  lat: number | null;
  lng: number | null;
  address: string | null;
  status: 'active' | 'sold' | 'archived';
  views: number;
  authorId: string;
  author: User;
  images: Image[];
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  text: string;
  isRead: boolean;
  senderId: string;
  receiverId: string;
  listingId: string;
  createdAt: string;
}

export interface Favorite {
  id: string;
  userId: string;
  listingId: string;
}

export interface CreateListingData {
  title: string;
  description?: string;
  price: number;
  currency?: string;
  type: 'product' | 'auto' | 'service';
  attributes: Record<string, any>;
  lat?: number;
  lng?: number;
  address?: string;
  images?: string[];
  authorId: string;
}

export interface ListingsResponse {
  items: Listing[];
  total: number;
  page: number;
  limit: number;
}
