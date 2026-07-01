// apps/backend/src/admin/admin.controller.ts
import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(private prisma: PrismaService) {}

  // Статистика
  @Get('stats')
  async getStats() {
    const [totalUsers, totalListings, totalOrders, pendingListings, activeListings, totalReviews] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.listing.count(),
      this.prisma.order.count(),
      this.prisma.listing.count({ where: { status: 'pending' } }),
      this.prisma.listing.count({ where: { status: 'active' } }),
      this.prisma.review.count(),
    ]);

    const revenue = await this.prisma.order.aggregate({
      _sum: { total: true },
      where: { status: 'completed' },
    });

    const ratingStats = await this.prisma.review.aggregate({
      _avg: { rating: true },
    });

    const newUsersToday = await this.prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    });

    const newListingsToday = await this.prisma.listing.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    });

    return {
      totalUsers,
      totalListings,
      totalOrders,
      totalRevenue: revenue._sum.total || 0,
      pendingListings,
      activeListings,
      newUsersToday,
      newListingsToday,
      totalReviews,
      averageRating: ratingStats._avg.rating || 0,
    };
  }

  // Пользователи
  @Get('users')
  async getUsers() {
    return this.prisma.user.findMany({
      include: {
        _count: {
          select: { listings: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Patch('users/:id/block')
  async toggleBlock(@Param('id') id: string, @Body() body: { isBlocked: boolean }) {
    return this.prisma.user.update({
      where: { id },
      data: { isBlocked: body.isBlocked },
    });
  }

  @Patch('users/:id/role')
  async changeRole(@Param('id') id: string, @Body() body: { role: string }) {
    return this.prisma.user.update({
      where: { id },
      data: { role: body.role },
    });
  }

  // Объявления
  @Get('listings')
  async getListings(@Query('status') status?: string, @Query('limit') limit?: string) {
    const where = status && status !== 'all' ? { status } : {};
    const take = limit ? parseInt(limit) : undefined;
    return this.prisma.listing.findMany({
      where,
      take,
      include: {
        author: {
          select: { id: true, name: true, phone: true, isSeller: true, companyName: true },
        },
        images: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Patch('listings/:id/moderate')
  async moderateListing(
    @Param('id') id: string,
    @Body() body: { status: string; moderationNote?: string; moderatorId: string }
  ) {
    const listing = await this.prisma.listing.update({
      where: { id },
      data: {
        status: body.status,
        moderationNote: body.moderationNote,
        moderationAt: new Date(),
        moderationBy: body.moderatorId,
      },
    });

    await this.prisma.notification.create({
      data: {
        userId: listing.authorId,
        type: 'moderation',
        title: body.status === 'active' ? '✅ Объявление одобрено' : '❌ Объявление отклонено',
        message: body.status === 'active' 
          ? `Ваше объявление "${listing.title}" прошло модерацию и опубликовано`
          : `Ваше объявление "${listing.title}" отклонено. Причина: ${body.moderationNote || 'Не указана'}`,
        link: `/listings/${listing.id}`,
      },
    });

    return listing;
  }

  // Категории
  @Get('categories')
  async getCategories() {
    return this.prisma.category.findMany({
      include: {
        _count: {
          select: { children: true },
        },
      },
      orderBy: { order: 'asc' },
    });
  }

  @Post('categories')
  async createCategory(@Body() data: any) {
    const slug = data.name.toLowerCase().replace(/[^a-zа-яё0-9]/g, '-');
    return this.prisma.category.create({
      data: { ...data, slug },
    });
  }

  @Patch('categories/:id')
  async updateCategory(@Param('id') id: string, @Body() data: any) {
    return this.prisma.category.update({
      where: { id },
      data,
    });
  }

  @Delete('categories/:id')
  async deleteCategory(@Param('id') id: string) {
    return this.prisma.category.delete({
      where: { id },
    });
  }

  // Налоги
  @Get('taxes')
  async getTaxes() {
    return this.prisma.tax.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  @Post('taxes')
  async createTax(@Body() data: any) {
    return this.prisma.tax.create({
      data,
    });
  }

  @Patch('taxes/:id/toggle')
  async toggleTax(@Param('id') id: string) {
    const tax = await this.prisma.tax.findUnique({ where: { id } });
    return this.prisma.tax.update({
      where: { id },
      data: { isActive: !tax.isActive },
    });
  }

  @Delete('taxes/:id')
  async deleteTax(@Param('id') id: string) {
    return this.prisma.tax.delete({
      where: { id },
    });
  }

  // Заказы
  @Get('orders')
  async getOrders() {
    return this.prisma.order.findMany({
      include: {
        buyer: {
          select: { name: true, phone: true },
        },
        seller: {
          select: { name: true, phone: true },
        },
        listing: {
          select: { title: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Платежи
  @Get('payments')
  async getPayments() {
    return this.prisma.payment.findMany({
      include: {
        user: {
          select: { name: true, phone: true },
        },
        order: {
          select: { id: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Отзывы
  @Get('reviews')
  async getReviews() {
    return this.prisma.review.findMany({
      include: {
        reviewer: {
          select: { id: true, name: true },
        },
        seller: {
          select: { id: true, name: true },
        },
        listing: {
          select: { id: true, title: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Delete('reviews/:id')
  async deleteReview(@Param('id') id: string) {
    return this.prisma.review.delete({
      where: { id },
    });
  }

  // Экспорт
  @Get('export/:type')
  async exportData(@Param('type') type: string) {
    let data = [];
    
    switch (type) {
      case 'listings':
        data = await this.prisma.listing.findMany({
          include: {
            author: { select: { name: true, phone: true } },
            images: true,
          },
        });
        break;
      case 'users':
        data = await this.prisma.user.findMany();
        break;
      case 'orders':
        data = await this.prisma.order.findMany({
          include: {
            buyer: { select: { name: true, phone: true } },
            seller: { select: { name: true, phone: true } },
            listing: { select: { title: true } },
          },
        });
        break;
      case 'reviews':
        data = await this.prisma.review.findMany({
          include: {
            reviewer: { select: { name: true } },
            seller: { select: { name: true } },
            listing: { select: { title: true } },
          },
        });
        break;
      default:
        return { error: 'Invalid type' };
    }
    
    return data;
  }

  // Настройки
  @Post('settings')
  async saveSettings(@Body() data: any) {
    for (const [key, value] of Object.entries(data)) {
      await this.prisma.siteSettings.upsert({
        where: { key },
        update: { value: value as any },
        create: { key, value: value as any, group: 'general' },
      });
    }
    return { success: true };
  }

  // Уведомления
  @Get('notifications')
  async getNotifications() {
    return this.prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  @Patch('notifications/:id/read')
  async markAsRead(@Param('id') id: string) {
    return this.prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }

  // Массовая рассылка
  @Post('notifications/send-all')
  async sendAllNotifications(@Body() body: { title: string; message: string; type: string }) {
    const users = await this.prisma.user.findMany({
      where: { isBlocked: false },
      select: { id: true },
    });

    const notifications = users.map(user => ({
      userId: user.id,
      type: body.type || 'system',
      title: body.title,
      message: body.message,
      link: '/profile',
    }));

    await this.prisma.notification.createMany({
      data: notifications,
    });

    return { success: true, sent: notifications.length };
  }

  // Аналитика
  @Get('analytics')
  async getAnalytics(@Query('period') period: string = 'week') {
    const now = new Date();
    let startDate = new Date();
    
    switch (period) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }

    const dailyStats: any[] = await this.prisma.$queryRaw`
      SELECT 
        DATE("createdAt") as date,
        COUNT(DISTINCT CASE WHEN "role" = 'user' THEN "id" END) as users,
        COUNT(CASE WHEN "status" = 'active' THEN 1 END) as listings,
        COUNT(CASE WHEN "status" = 'completed' THEN 1 END) as orders
      FROM (
        SELECT "id", "role", "createdAt", NULL as status FROM "User" WHERE "createdAt" >= ${startDate}
        UNION ALL
        SELECT NULL, NULL, "createdAt", "status" FROM "Listing" WHERE "createdAt" >= ${startDate}
        UNION ALL
        SELECT NULL, NULL, "createdAt", "status" FROM "Order" WHERE "createdAt" >= ${startDate}
      ) t
      GROUP BY DATE("createdAt")
      ORDER BY date ASC
    `;

    const categoryStats = await this.prisma.listing.groupBy({
      by: ['type'],
      where: { status: 'active' },
      _count: true,
    });

    const userActivity: any[] = await this.prisma.$queryRaw`
      SELECT 
        EXTRACT(HOUR FROM "createdAt") as hour,
        COUNT(*) as active
      FROM "User"
      WHERE "createdAt" >= ${startDate}
      GROUP BY EXTRACT(HOUR FROM "createdAt")
      ORDER BY hour ASC
    `;

    const revenueStats: any[] = await this.prisma.$queryRaw`
      SELECT 
        TO_CHAR("createdAt", 'YYYY-MM') as month,
        SUM("total") as revenue,
        COUNT(*) as orders
      FROM "Order"
      WHERE "status" = 'completed' AND "createdAt" >= ${startDate}
      GROUP BY TO_CHAR("createdAt", 'YYYY-MM')
      ORDER BY month ASC
    `;

    const topCategories = await this.prisma.listing.groupBy({
      by: ['type'],
      where: { status: 'active' },
      _count: true,
      orderBy: { _count: { type: 'desc' } },
      take: 5,
    });

    const statusStats = await this.prisma.listing.groupBy({
      by: ['status'],
      _count: true,
    });

    return {
      dailyStats: dailyStats.map((d: any) => ({
        date: d.date ? d.date.toISOString().split('T')[0] : '',
        users: Number(d.users) || 0,
        listings: Number(d.listings) || 0,
        orders: Number(d.orders) || 0,
      })),
      categoryStats: categoryStats.map(c => ({
        name: c.type,
        value: c._count,
      })),
      userActivity: userActivity.map((u: any) => ({
        hour: `${String(Math.floor(Number(u.hour))).padStart(2, '0')}:00`,
        active: Number(u.active),
      })),
      revenueStats: revenueStats.map((r: any) => ({
        month: r.month || '',
        revenue: Number(r.revenue) || 0,
        orders: Number(r.orders) || 0,
      })),
      topCategories: topCategories.map(c => ({
        name: c.type,
        count: c._count,
      })),
      statusStats: statusStats.map(s => ({
        name: s.status,
        value: s._count,
      })),
    };
  }
}