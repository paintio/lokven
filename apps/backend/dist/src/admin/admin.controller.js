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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let AdminController = class AdminController {
    constructor(prisma) {
        this.prisma = prisma;
    }
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
    async toggleBlock(id, body) {
        return this.prisma.user.update({
            where: { id },
            data: { isBlocked: body.isBlocked },
        });
    }
    async changeRole(id, body) {
        return this.prisma.user.update({
            where: { id },
            data: { role: body.role },
        });
    }
    async getListings(status, limit) {
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
    async moderateListing(id, body) {
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
    async createCategory(data) {
        const slug = data.name.toLowerCase().replace(/[^a-zа-яё0-9]/g, '-');
        return this.prisma.category.create({
            data: { ...data, slug },
        });
    }
    async updateCategory(id, data) {
        return this.prisma.category.update({
            where: { id },
            data,
        });
    }
    async deleteCategory(id) {
        return this.prisma.category.delete({
            where: { id },
        });
    }
    async getTaxes() {
        return this.prisma.tax.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }
    async createTax(data) {
        return this.prisma.tax.create({
            data,
        });
    }
    async toggleTax(id) {
        const tax = await this.prisma.tax.findUnique({ where: { id } });
        return this.prisma.tax.update({
            where: { id },
            data: { isActive: !tax.isActive },
        });
    }
    async deleteTax(id) {
        return this.prisma.tax.delete({
            where: { id },
        });
    }
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
    async deleteReview(id) {
        return this.prisma.review.delete({
            where: { id },
        });
    }
    async exportData(type) {
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
    async saveSettings(data) {
        for (const [key, value] of Object.entries(data)) {
            await this.prisma.siteSettings.upsert({
                where: { key },
                update: { value: value },
                create: { key, value: value, group: 'general' },
            });
        }
        return { success: true };
    }
    async getNotifications() {
        return this.prisma.notification.findMany({
            orderBy: { createdAt: 'desc' },
            take: 50,
        });
    }
    async markAsRead(id) {
        return this.prisma.notification.update({
            where: { id },
            data: { isRead: true },
        });
    }
    async sendAllNotifications(body) {
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
    async getAnalytics(period = 'week') {
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
        const dailyStats = await this.prisma.$queryRaw `
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
        const userActivity = await this.prisma.$queryRaw `
      SELECT 
        EXTRACT(HOUR FROM "createdAt") as hour,
        COUNT(*) as active
      FROM "User"
      WHERE "createdAt" >= ${startDate}
      GROUP BY EXTRACT(HOUR FROM "createdAt")
      ORDER BY hour ASC
    `;
        const revenueStats = await this.prisma.$queryRaw `
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
            dailyStats: dailyStats.map((d) => ({
                date: d.date ? d.date.toISOString().split('T')[0] : '',
                users: Number(d.users) || 0,
                listings: Number(d.listings) || 0,
                orders: Number(d.orders) || 0,
            })),
            categoryStats: categoryStats.map(c => ({
                name: c.type,
                value: c._count,
            })),
            userActivity: userActivity.map((u) => ({
                hour: `${String(Math.floor(Number(u.hour))).padStart(2, '0')}:00`,
                active: Number(u.active),
            })),
            revenueStats: revenueStats.map((r) => ({
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
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('users'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Patch)('users/:id/block'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "toggleBlock", null);
__decorate([
    (0, common_1.Patch)('users/:id/role'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "changeRole", null);
__decorate([
    (0, common_1.Get)('listings'),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getListings", null);
__decorate([
    (0, common_1.Patch)('listings/:id/moderate'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "moderateListing", null);
__decorate([
    (0, common_1.Get)('categories'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getCategories", null);
__decorate([
    (0, common_1.Post)('categories'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createCategory", null);
__decorate([
    (0, common_1.Patch)('categories/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateCategory", null);
__decorate([
    (0, common_1.Delete)('categories/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteCategory", null);
__decorate([
    (0, common_1.Get)('taxes'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getTaxes", null);
__decorate([
    (0, common_1.Post)('taxes'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createTax", null);
__decorate([
    (0, common_1.Patch)('taxes/:id/toggle'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "toggleTax", null);
__decorate([
    (0, common_1.Delete)('taxes/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteTax", null);
__decorate([
    (0, common_1.Get)('orders'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getOrders", null);
__decorate([
    (0, common_1.Get)('payments'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getPayments", null);
__decorate([
    (0, common_1.Get)('reviews'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getReviews", null);
__decorate([
    (0, common_1.Delete)('reviews/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteReview", null);
__decorate([
    (0, common_1.Get)('export/:type'),
    __param(0, (0, common_1.Param)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "exportData", null);
__decorate([
    (0, common_1.Post)('settings'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "saveSettings", null);
__decorate([
    (0, common_1.Get)('notifications'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getNotifications", null);
__decorate([
    (0, common_1.Patch)('notifications/:id/read'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "markAsRead", null);
__decorate([
    (0, common_1.Post)('notifications/send-all'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "sendAllNotifications", null);
__decorate([
    (0, common_1.Get)('analytics'),
    __param(0, (0, common_1.Query)('period')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAnalytics", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)('admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map