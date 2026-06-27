import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createReviewDto: CreateReviewDto) {
    const { orderId, sellerId, rating, text } = createReviewDto;

    // Проверяем, что заказ существует и принадлежит пользователю
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        buyer: true,
        seller: true,
        listing: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Заказ не найден');
    }

    if (order.buyerId !== userId) {
      throw new BadRequestException('Вы не можете оставить отзыв на этот заказ');
    }

    if (order.status !== 'completed') {
      throw new BadRequestException('Заказ должен быть завершён');
    }

    // Проверяем, что отзыв ещё не оставлен
    const existingReview = await this.prisma.review.findUnique({
      where: { orderId },
    });

    if (existingReview) {
      throw new BadRequestException('Отзыв на этот заказ уже оставлен');
    }

    // Создаём отзыв
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

    // Создаём уведомление для продавца
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

  async getSellerReviews(sellerId: string, page: number = 1, limit: number = 10) {
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

    // Распределение рейтинга
    const ratingDistribution = await this.prisma.review.groupBy({
      by: ['rating'],
      where: { sellerId },
      _count: true,
    });

    const distribution = {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0,
    };
    ratingDistribution.forEach((item) => {
      distribution[item.rating as keyof typeof distribution] = item._count;
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

  async getUserReviewForOrder(userId: string, orderId: string) {
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

  async delete(id: string, userId: string) {
    const review = await this.prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      throw new NotFoundException('Отзыв не найден');
    }

    if (review.reviewerId !== userId) {
      throw new BadRequestException('Вы можете удалить только свои отзывы');
    }

    await this.prisma.review.delete({
      where: { id },
    });

    return { success: true };
  }
}
