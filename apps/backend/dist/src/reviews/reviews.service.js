"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let ReviewsService = class ReviewsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, createReviewDto) {
        const { orderId, sellerId, rating, text } = createReviewDto;
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: {
                buyer: true,
                seller: true,
                listing: true,
            },
        });
        if (!order) {
            throw new common_1.NotFoundException('Заказ не найден');
        }
        if (order.buyerId !== userId) {
            throw new common_1.BadRequestException('Вы не можете оставить отзыв на этот заказ');
        }
        if (order.status !== 'completed') {
            throw new common_1.BadRequestException('Заказ должен быть завершён');
        }
        const existingReview = await this.prisma.review.findUnique({
            where: { orderId },
        });
        if (existingReview) {
            throw new common_1.BadRequestException('Отзыв на этот заказ уже оставлен');
        }
        const review = await this.prisma.review.create({
            data: {
                rating,
                text,
                reviewerId: userId,
                sellerId,
                listingId: order.listingId,
                orderId,
            },
            include: {
                reviewer: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                    },
                },
                seller: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                    },
                },
                listing: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
        });
        await this.prisma.notification.create({
            data: {
                userId: sellerId,
                type: 'review',
                title: '⭐ Новый отзыв',
                message: `${review.reviewer.name || 'Пользователь'} оставил отзыв на ваш товар "${order.listing.title}"`,
                link: `/reviews/${review.id}`,
            },
        });
        return review;
    }
    async getSellerReviews(sellerId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [reviews, total] = await Promise.all([
            this.prisma.review.findMany({
                where: { sellerId },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    reviewer: {
                        select: {
                            id: true,
                            name: true,
                            avatar: true,
                        },
                    },
                    listing: {
                        select: {
                            id: true,
                            title: true,
                        },
                    },
                },
            }),
            this.prisma.review.count({ where: { sellerId } }),
        ]);
        const ratingStats = await this.prisma.review.aggregate({
            where: { sellerId },
            _avg: { rating: true },
            _count: true,
        });
        const ratingDistribution = await this.prisma.review.groupBy({
            by: ['rating'],
            where: { sellerId },
            _count: true,
        });
        const distribution = {
            1: 0, 2: 0, 3: 0, 4: 0, 5: 0,
        };
        ratingDistribution.forEach((item) => {
            distribution[item.rating] = item._count;
        });
        return {
            reviews,
            total,
            page,
            limit,
            stats: {
                average: ratingStats._avg.rating || 0,
                total: ratingStats._count,
                distribution,
            },
        };
    }
    async getUserReviewForOrder(userId, orderId) {
        return this.prisma.review.findFirst({
            where: {
                orderId,
                reviewerId: userId,
            },
            include: {
                seller: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                    },
                },
                listing: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
        });
    }
    async delete(id, userId) {
        const review = await this.prisma.review.findUnique({
            where: { id },
        });
        if (!review) {
            throw new common_1.NotFoundException('Отзыв не найден');
        }
        if (review.reviewerId !== userId) {
            throw new common_1.BadRequestException('Вы можете удалить только свои отзывы');
        }
        await this.prisma.review.delete({
            where: { id },
        });
        return { success: true };
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map