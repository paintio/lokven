export class ListingEntity {
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
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}
