import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
export declare class ReviewsController {
    private reviewsService;
    constructor(reviewsService: ReviewsService);
    create(req: any, createReviewDto: CreateReviewDto): Promise<{
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
    getSellerReviews(sellerId: string, page?: string, limit?: string): Promise<{
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
    getUserReviewForOrder(req: any, orderId: string): Promise<{
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
    delete(req: any, id: string): Promise<{
        success: boolean;
    }>;
}
