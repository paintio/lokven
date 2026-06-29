import { PrismaService } from '../prisma.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { Listing } from '@prisma/client';
export declare class ListingsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createListingDto: CreateListingDto): Promise<Listing>;
    findAll(query: any): Promise<{
        items: Listing[];
        total: number;
        page: number;
        limit: number;
    }>;
    search(query: any): Promise<{
        items: Listing[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<Listing>;
    update(id: string, updateListingDto: UpdateListingDto): Promise<Listing>;
    remove(id: string): Promise<void>;
    incrementViews(id: string): Promise<{
        views: number;
    }>;
    findByType(type: string): Promise<Listing[]>;
    findByUser(userId: string): Promise<Listing[]>;
}
