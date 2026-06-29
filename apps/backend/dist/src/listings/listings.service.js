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
exports.ListingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let ListingsService = class ListingsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createListingDto) {
        const { images, authorId, ...listingData } = createListingDto;
        const user = await this.prisma.user.findUnique({
            where: { id: authorId },
        });
        if (!user) {
            throw new common_1.BadRequestException(`User with id ${authorId} not found`);
        }
        if (listingData.type === 'job' && !user.isSeller && user.role !== 'admin') {
            throw new common_1.BadRequestException('Для размещения вакансий необходимо быть работодателем');
        }
        const listing = await this.prisma.listing.create({
            data: {
                ...listingData,
                author: {
                    connect: { id: authorId },
                },
                images: images && images.length > 0
                    ? {
                        create: images.map((url) => ({ url })),
                    }
                    : undefined,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                        avatar: true,
                        isSeller: true,
                        companyName: true,
                    },
                },
                images: true,
            },
        });
        return listing;
    }
    async findAll(query) {
        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 20;
        const skip = (page - 1) * limit;
        const where = {
            status: query.status || 'active',
        };
        if (query.type && query.type !== 'all') {
            where.type = query.type;
        }
        if (query.minPrice) {
            where.price = { ...where.price, gte: parseFloat(query.minPrice) };
        }
        if (query.maxPrice) {
            where.price = { ...where.price, lte: parseFloat(query.maxPrice) };
        }
        if (query.search) {
            where.OR = [
                { title: { contains: query.search, mode: 'insensitive' } },
                { description: { contains: query.search, mode: 'insensitive' } },
            ];
        }
        if (query.address) {
            where.address = { contains: query.address, mode: 'insensitive' };
        }
        const needPostFilter = !!(query.brand || query.yearFrom || query.yearTo ||
            query.mileage || query.transmission || query.engine ||
            query.realtyType || query.rooms || query.areaMin || query.areaMax ||
            query.employment || query.experience || query.schedule ||
            query.serviceType);
        let orderBy = { createdAt: 'desc' };
        if (query.sort === 'price_asc') {
            orderBy = { price: 'asc' };
        }
        else if (query.sort === 'price_desc') {
            orderBy = { price: 'desc' };
        }
        else if (query.sort === 'popular') {
            orderBy = { views: 'desc' };
        }
        else if (query.sort === 'rating') {
            orderBy = { views: 'desc' };
        }
        const [items, total] = await Promise.all([
            this.prisma.listing.findMany({
                where,
                skip,
                take: limit,
                orderBy,
                include: {
                    author: {
                        select: {
                            id: true,
                            name: true,
                            phone: true,
                            avatar: true,
                        },
                    },
                    images: true,
                },
            }),
            this.prisma.listing.count({ where }),
        ]);
        let filteredItems = items;
        if (needPostFilter) {
            filteredItems = items.filter((item) => {
                const attrs = item.attributes || {};
                if (query.brand && attrs.brand !== query.brand)
                    return false;
                if (query.yearFrom && attrs.year < parseInt(query.yearFrom))
                    return false;
                if (query.yearTo && attrs.year > parseInt(query.yearTo))
                    return false;
                if (query.mileage && attrs.mileage > parseInt(query.mileage))
                    return false;
                if (query.transmission && attrs.transmission !== query.transmission)
                    return false;
                if (query.engine && attrs.engineType !== query.engine)
                    return false;
                if (query.realtyType && attrs.realtyType !== query.realtyType)
                    return false;
                if (query.rooms && attrs.rooms !== parseInt(query.rooms))
                    return false;
                if (query.areaMin && attrs.area < parseFloat(query.areaMin))
                    return false;
                if (query.areaMax && attrs.area > parseFloat(query.areaMax))
                    return false;
                if (query.employment && attrs.employment !== query.employment)
                    return false;
                if (query.experience && attrs.experience !== query.experience)
                    return false;
                if (query.schedule && attrs.schedule !== query.schedule)
                    return false;
                if (query.serviceType && attrs.serviceType !== query.serviceType)
                    return false;
                return true;
            });
        }
        return {
            items: filteredItems,
            total: filteredItems.length,
            page,
            limit,
        };
    }
    async search(query) {
        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 20;
        const skip = (page - 1) * limit;
        const lat = query.lat ? parseFloat(query.lat) : undefined;
        const lng = query.lng ? parseFloat(query.lng) : undefined;
        const radius = query.radius ? parseFloat(query.radius) : 10;
        const where = {
            status: 'active',
            ...(query.type && query.type !== 'all' && { type: query.type }),
            ...(query.search && {
                OR: [
                    { title: { contains: query.search, mode: 'insensitive' } },
                    { description: { contains: query.search, mode: 'insensitive' } },
                ],
            }),
        };
        let items = await this.prisma.listing.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                        avatar: true,
                    },
                },
                images: true,
            },
        });
        if (lat !== undefined && lng !== undefined) {
            const earthRadius = 6371;
            items = items.filter((item) => {
                if (item.lat === null || item.lng === null)
                    return false;
                const dLat = ((item.lat - lat) * Math.PI) / 180;
                const dLng = ((item.lng - lng) * Math.PI) / 180;
                const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos((lat * Math.PI) / 180) *
                        Math.cos((item.lat * Math.PI) / 180) *
                        Math.sin(dLng / 2) *
                        Math.sin(dLng / 2);
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                const distance = earthRadius * c;
                return distance <= radius;
            });
        }
        return {
            items,
            total: items.length,
            page,
            limit,
        };
    }
    async findOne(id) {
        const listing = await this.prisma.listing.findUnique({
            where: { id },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                        avatar: true,
                        isSeller: true,
                        companyName: true,
                    },
                },
                images: true,
            },
        });
        if (!listing) {
            throw new common_1.NotFoundException(`Listing with id ${id} not found`);
        }
        return listing;
    }
    async update(id, updateListingDto) {
        const listing = await this.prisma.listing.findUnique({
            where: { id },
        });
        if (!listing) {
            throw new common_1.NotFoundException(`Listing with id ${id} not found`);
        }
        const { images, ...updateData } = updateListingDto;
        if (images) {
            await this.prisma.image.deleteMany({
                where: { listingId: id },
            });
            if (images.length > 0) {
                await this.prisma.image.createMany({
                    data: images.map((url) => ({
                        url,
                        listingId: id,
                    })),
                });
            }
        }
        const updated = await this.prisma.listing.update({
            where: { id },
            data: {
                ...updateData,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                        avatar: true,
                    },
                },
                images: true,
            },
        });
        return updated;
    }
    async remove(id) {
        const listing = await this.prisma.listing.findUnique({
            where: { id },
        });
        if (!listing) {
            throw new common_1.NotFoundException(`Listing with id ${id} not found`);
        }
        await this.prisma.listing.delete({
            where: { id },
        });
    }
    async incrementViews(id) {
        const listing = await this.prisma.listing.update({
            where: { id },
            data: {
                views: {
                    increment: 1,
                },
            },
            select: {
                views: true,
            },
        });
        return { views: listing.views };
    }
    async findByType(type) {
        return this.prisma.listing.findMany({
            where: {
                type,
                status: 'active',
            },
            orderBy: { createdAt: 'desc' },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                        avatar: true,
                    },
                },
                images: true,
            },
        });
    }
    async findByUser(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.BadRequestException(`User with id ${userId} not found`);
        }
        return this.prisma.listing.findMany({
            where: {
                authorId: userId,
            },
            orderBy: { createdAt: 'desc' },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                        avatar: true,
                    },
                },
                images: true,
            },
        });
    }
};
exports.ListingsService = ListingsService;
exports.ListingsService = ListingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ListingsService);
//# sourceMappingURL=listings.service.js.map