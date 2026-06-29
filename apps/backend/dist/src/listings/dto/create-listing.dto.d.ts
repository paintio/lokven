export declare class CreateListingDto {
    title: string;
    description?: string;
    price: number;
    currency?: string;
    type: string;
    attributes: Record<string, any>;
    lat?: number;
    lng?: number;
    address?: string;
    images?: string[];
    authorId: string;
}
