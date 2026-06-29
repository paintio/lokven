import { PrismaService } from '../prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
export declare class ReviewsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, createReviewDto: CreateReviewDto): Promise<{
        listing: {
            id: string;
            title: string;
        };
        seller: {
            id: string;
            name: string;
            avatar: string;
        };
        reviewer: {
            id: string;
            name: string;
            avatar: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        listingId: string;
        rating: number;
        sellerId: string;
        orderId: string;
        text: string | null;
        reviewerId: string;
    }>;
    getSellerReviews(sellerId: string, page?: number, limit?: number): Promise<{
        reviews: ({
            listing: {
                id: string;
                title: string;
            };
            reviewer: {
                id: string;
                name: string;
                avatar: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            listingId: string;
            rating: number;
            sellerId: string;
            orderId: string;
            text: string | null;
            reviewerId: string;
        })[];
        total: number;
        page: number;
        limit: number;
        stats: {
            average: number;
            total: number;
            distribution: {
                1: number;
                2: number;
                3: number;
                4: number;
                5: number;
            };
        };
    }>;
    getUserReviewForOrder(userId: string, orderId: string): Promise<{
        listing: {
            id: string;
            title: string;
        };
        seller: {
            id: string;
            name: string;
            avatar: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        listingId: string;
        rating: number;
        sellerId: string;
        orderId: string;
        text: string | null;
        reviewerId: string;
    }>;
    delete(id: string, userId: string): Promise<{
        success: boolean;
    }>;
}
