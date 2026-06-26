import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { Listing, Prisma } from '@prisma/client';

@Injectable()
export class ListingsService {
  constructor(private prisma: PrismaService) {}

  async create(createListingDto: CreateListingDto): Promise<Listing> {
    const { images, authorId, ...listingData } = createListingDto;

    const user = await this.prisma.user.findUnique({
      where: { id: authorId },
    });

    if (!user) {
      throw new BadRequestException(`User with id ${authorId} not found`);
    }

    if (listingData.type === 'job' && !user.isSeller && user.role !== 'admin') {
      throw new BadRequestException('Для размещения вакансий необходимо быть работодателем');
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

  async findAll(query: any): Promise<{ items: Listing[]; total: number; page: number; limit: number }> {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const where: Prisma.ListingWhereInput = {
      status: query.status || 'active',
    };

    if (query.type && query.type !== 'all') {
      where.type = query.type;
    }

    if (query.minPrice) {
      where.price = { ...where.price as any, gte: parseFloat(query.minPrice) };
    }
    if (query.maxPrice) {
      where.price = { ...where.price as any, lte: parseFloat(query.maxPrice) };
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

    // Специфические фильтры для Авто - через фильтрацию после получения
    // В Prisma для JSON полей используем строковые условия
    const needPostFilter = !!(query.brand || query.yearFrom || query.yearTo || 
                              query.mileage || query.transmission || query.engine ||
                              query.realtyType || query.rooms || query.areaMin || query.areaMax ||
                              query.employment || query.experience || query.schedule ||
                              query.serviceType);

    let orderBy: any = { createdAt: 'desc' };
    if (query.sort === 'price_asc') {
      orderBy = { price: 'asc' };
    } else if (query.sort === 'price_desc') {
      orderBy = { price: 'desc' };
    } else if (query.sort === 'popular') {
      orderBy = { views: 'desc' };
    } else if (query.sort === 'rating') {
      orderBy = { views: 'desc' }; // временно
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

    // Пост-фильтрация для JSON полей
    let filteredItems = items;
    if (needPostFilter) {
      filteredItems = items.filter((item) => {
        const attrs = item.attributes as any || {};
        
        // Фильтры для Авто
        if (query.brand && attrs.brand !== query.brand) return false;
        if (query.yearFrom && attrs.year < parseInt(query.yearFrom)) return false;
        if (query.yearTo && attrs.year > parseInt(query.yearTo)) return false;
        if (query.mileage && attrs.mileage > parseInt(query.mileage)) return false;
        if (query.transmission && attrs.transmission !== query.transmission) return false;
        if (query.engine && attrs.engineType !== query.engine) return false;
        
        // Фильтры для Недвижимости
        if (query.realtyType && attrs.realtyType !== query.realtyType) return false;
        if (query.rooms && attrs.rooms !== parseInt(query.rooms)) return false;
        if (query.areaMin && attrs.area < parseFloat(query.areaMin)) return false;
        if (query.areaMax && attrs.area > parseFloat(query.areaMax)) return false;
        
        // Фильтры для Работы
        if (query.employment && attrs.employment !== query.employment) return false;
        if (query.experience && attrs.experience !== query.experience) return false;
        if (query.schedule && attrs.schedule !== query.schedule) return false;
        
        // Фильтры для Услуг
        if (query.serviceType && attrs.serviceType !== query.serviceType) return false;
        
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

  async search(query: any): Promise<{ items: Listing[]; total: number; page: number; limit: number }> {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 20;
    const skip = (page - 1) * limit;

    const lat = query.lat ? parseFloat(query.lat) : undefined;
    const lng = query.lng ? parseFloat(query.lng) : undefined;
    const radius = query.radius ? parseFloat(query.radius) : 10;

    const where: Prisma.ListingWhereInput = {
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
        if (item.lat === null || item.lng === null) return false;
        const dLat = ((item.lat - lat) * Math.PI) / 180;
        const dLng = ((item.lng - lng) * Math.PI) / 180;
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
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

  async findOne(id: string): Promise<Listing> {
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
      throw new NotFoundException(`Listing with id ${id} not found`);
    }

    return listing;
  }

  async update(id: string, updateListingDto: UpdateListingDto): Promise<Listing> {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
    });

    if (!listing) {
      throw new NotFoundException(`Listing with id ${id} not found`);
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

  async remove(id: string): Promise<void> {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
    });

    if (!listing) {
      throw new NotFoundException(`Listing with id ${id} not found`);
    }

    await this.prisma.listing.delete({
      where: { id },
    });
  }

  async incrementViews(id: string): Promise<{ views: number }> {
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

  async findByType(type: string): Promise<Listing[]> {
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

  async findByUser(userId: string): Promise<Listing[]> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException(`User with id ${userId} not found`);
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
}
