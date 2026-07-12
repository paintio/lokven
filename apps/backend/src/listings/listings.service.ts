import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
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
      throw new BadRequestException(
        `User with id ${authorId} not found`,
      );
    }

    if (
      listingData.type === 'job' &&
      !user.isSeller &&
      user.role !== 'admin'
    ) {
      throw new BadRequestException(
        'Для размещения вакансий необходимо быть работодателем',
      );
    }

    return this.prisma.listing.create({
      data: {
        ...listingData,
        author: {
          connect: { id: authorId },
        },
        images:
          images && images.length > 0
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
  }

  async findAll(
    query: any,
  ): Promise<{
    items: Listing[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = Math.max(parseInt(query.page) || 1, 1);
    const limit = Math.min(
      Math.max(parseInt(query.limit) || 20, 1),
      100,
    );

    const where: Prisma.ListingWhereInput = {
      status: query.status || 'active',
    };

    if (query.type && query.type !== 'all') {
      where.type = query.type;
    }

    if (query.minPrice || query.maxPrice) {
      where.price = {};

      if (query.minPrice) {
        (where.price as Prisma.FloatFilter).gte = parseFloat(
          query.minPrice,
        );
      }

      if (query.maxPrice) {
        (where.price as Prisma.FloatFilter).lte = parseFloat(
          query.maxPrice,
        );
      }
    }

    if (query.search) {
      where.OR = [
        {
          title: {
            contains: query.search,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: query.search,
            mode: 'insensitive',
          },
        },
      ];
    }

    if (query.address) {
      where.address = {
        contains: query.address,
        mode: 'insensitive',
      };
    }

    let orderBy: Prisma.ListingOrderByWithRelationInput = {
      createdAt: 'desc',
    };

    if (query.sort === 'price_asc') {
      orderBy = { price: 'asc' };
    }

    if (query.sort === 'price_desc') {
      orderBy = { price: 'desc' };
    }

    if (query.sort === 'popular') {
      orderBy = { views: 'desc' };
    }

    const allItems = await this.prisma.listing.findMany({
      where,
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
    });

    const filteredItems = allItems.filter((item) =>
      this.matchesFilters(item, query),
    );

    const total = filteredItems.length;
    const skip = (page - 1) * limit;

    const items = filteredItems.slice(skip, skip + limit);

    return {
      items,
      total,
      page,
      limit,
    };
  }

  private matchesFilters(item: any, query: any): boolean {
    const attrs = (item.attributes || {}) as Record<string, any>;

    if (
      query.category &&
      !this.matchesString(attrs.category, query.category) &&
      !this.matchesString(attrs.categoryId, query.category) &&
      !this.matchesString(attrs.slug, query.category)
    ) {
      return false;
    }

    switch (item.type) {
      case 'auto':
        return this.matchesAutoFilters(attrs, query);

      case 'realty':
        return this.matchesRealtyFilters(attrs, query);

      case 'product':
        return this.matchesProductFilters(attrs, query);

      case 'ads':
        return this.matchesAdsFilters(attrs, query);

      case 'job':
        return this.matchesJobFilters(attrs, query);

      case 'service':
        return this.matchesServiceFilters(attrs, query);

      default:
        return true;
    }
  }

  private matchesAutoFilters(
    attrs: Record<string, any>,
    query: any,
  ): boolean {
    if (
      query.brand &&
      !this.matchesString(attrs.brand, query.brand)
    ) {
      return false;
    }

    if (
      query.model &&
      !this.matchesString(attrs.model, query.model)
    ) {
      return false;
    }

    if (!this.matchesMin(attrs.year, query.yearFrom)) {
      return false;
    }

    if (!this.matchesMax(attrs.year, query.yearTo)) {
      return false;
    }

    if (!this.matchesMax(attrs.mileage, query.mileageMax)) {
      return false;
    }

    if (
      query.bodyType &&
      !this.matchesAnyField(
        attrs,
        ['bodyType', 'body'],
        query.bodyType,
      )
    ) {
      return false;
    }

    if (
      query.engine &&
      !this.matchesAnyField(
        attrs,
        ['engine', 'engineType', 'fuelType'],
        query.engine,
      )
    ) {
      return false;
    }

    if (
      !this.matchesMin(
        this.firstValue(attrs, [
          'engineVolume',
          'volume',
          'engineCapacity',
        ]),
        query.engineVolumeFrom,
      )
    ) {
      return false;
    }

    if (
      !this.matchesMax(
        this.firstValue(attrs, [
          'engineVolume',
          'volume',
          'engineCapacity',
        ]),
        query.engineVolumeTo,
      )
    ) {
      return false;
    }

    if (
      !this.matchesMin(
        this.firstValue(attrs, ['power', 'horsePower']),
        query.powerFrom,
      )
    ) {
      return false;
    }

    if (
      !this.matchesMax(
        this.firstValue(attrs, ['power', 'horsePower']),
        query.powerTo,
      )
    ) {
      return false;
    }

    if (
      query.transmission &&
      !this.matchesString(
        attrs.transmission,
        query.transmission,
      )
    ) {
      return false;
    }

    if (
      query.drive &&
      !this.matchesAnyField(
        attrs,
        ['drive', 'driveType'],
        query.drive,
      )
    ) {
      return false;
    }

    if (
      query.steeringWheel &&
      !this.matchesAnyField(
        attrs,
        ['steeringWheel', 'steering'],
        query.steeringWheel,
      )
    ) {
      return false;
    }

    if (
      query.color &&
      !this.matchesString(attrs.color, query.color)
    ) {
      return false;
    }

    if (
      query.condition &&
      !this.matchesString(attrs.condition, query.condition)
    ) {
      return false;
    }

    if (
      query.owners &&
      !this.matchesNumber(attrs.owners, query.owners)
    ) {
      return false;
    }

    if (
      query.pts &&
      !this.matchesAnyField(
        attrs,
        ['pts', 'documentType'],
        query.pts,
      )
    ) {
      return false;
    }

    if (
      query.customsCleared !== undefined &&
      query.customsCleared !== '' &&
      !this.matchesBoolean(
        this.firstValue(attrs, [
          'customsCleared',
          'customs',
          'cleared',
        ]),
        query.customsCleared,
      )
    ) {
      return false;
    }

    if (
      query.accident !== undefined &&
      query.accident !== '' &&
      !this.matchesBoolean(
        this.firstValue(attrs, [
          'accident',
          'hasAccident',
          'wasInAccident',
        ]),
        query.accident,
      )
    ) {
      return false;
    }

    return true;
  }

  private matchesRealtyFilters(
    attrs: Record<string, any>,
    query: any,
  ): boolean {
    if (
      query.realtyType &&
      !this.matchesAnyField(
        attrs,
        ['realtyType', 'propertyType'],
        query.realtyType,
      )
    ) {
      return false;
    }

    if (
      query.dealType &&
      !this.matchesAnyField(
        attrs,
        ['dealType', 'offerType'],
        query.dealType,
      )
    ) {
      return false;
    }

    if (
      query.rooms &&
      !this.matchesNumber(attrs.rooms, query.rooms)
    ) {
      return false;
    }

    if (!this.matchesMin(attrs.area, query.areaMin)) {
      return false;
    }

    if (!this.matchesMax(attrs.area, query.areaMax)) {
      return false;
    }

    if (!this.matchesMin(attrs.kitchenArea, query.kitchenAreaMin)) {
      return false;
    }

    if (!this.matchesMin(attrs.floor, query.floorFrom)) {
      return false;
    }

    if (!this.matchesMax(attrs.floor, query.floorTo)) {
      return false;
    }

    if (
      !this.matchesMin(
        this.firstValue(attrs, [
          'totalFloors',
          'floors',
          'floorsCount',
        ]),
        query.totalFloorsFrom,
      )
    ) {
      return false;
    }

    if (
      query.houseType &&
      !this.matchesString(attrs.houseType, query.houseType)
    ) {
      return false;
    }

    if (!this.matchesMin(attrs.buildYear, query.buildYearFrom)) {
      return false;
    }

    if (!this.matchesMax(attrs.buildYear, query.buildYearTo)) {
      return false;
    }

    if (
      query.renovation &&
      !this.matchesAnyField(
        attrs,
        ['renovation', 'repair'],
        query.renovation,
      )
    ) {
      return false;
    }

    if (
      query.bathroom &&
      !this.matchesAnyField(
        attrs,
        ['bathroom', 'bathroomType'],
        query.bathroom,
      )
    ) {
      return false;
    }

    if (
      query.balcony &&
      !this.matchesBoolean(attrs.balcony, query.balcony)
    ) {
      return false;
    }

    if (
      query.parking &&
      !this.matchesBoolean(attrs.parking, query.parking)
    ) {
      return false;
    }

    return true;
  }

  private matchesProductFilters(
    attrs: Record<string, any>,
    query: any,
  ): boolean {
    if (
      query.productCategory &&
      !this.matchesAnyField(
        attrs,
        ['category', 'productCategory'],
        query.productCategory,
      )
    ) {
      return false;
    }

    if (
      query.subcategory &&
      !this.matchesAnyField(
        attrs,
        ['subcategory', 'subCategory'],
        query.subcategory,
      )
    ) {
      return false;
    }

    if (
      query.brand &&
      !this.matchesString(attrs.brand, query.brand)
    ) {
      return false;
    }

    if (
      query.model &&
      !this.matchesString(attrs.model, query.model)
    ) {
      return false;
    }

    if (
      query.condition &&
      !this.matchesString(attrs.condition, query.condition)
    ) {
      return false;
    }

    if (
      query.color &&
      !this.matchesString(attrs.color, query.color)
    ) {
      return false;
    }

    if (
      query.storage &&
      !this.matchesAnyField(
        attrs,
        ['storage', 'memory'],
        query.storage,
      )
    ) {
      return false;
    }

    if (
      query.sellerType &&
      !this.matchesString(attrs.sellerType, query.sellerType)
    ) {
      return false;
    }

    return true;
  }

  private matchesAdsFilters(
    attrs: Record<string, any>,
    query: any,
  ): boolean {
    if (
      query.adsCategory &&
      !this.matchesAnyField(
        attrs,
        ['category', 'adsCategory'],
        query.adsCategory,
      )
    ) {
      return false;
    }

    if (
      query.subcategory &&
      !this.matchesAnyField(
        attrs,
        ['subcategory', 'subCategory'],
        query.subcategory,
      )
    ) {
      return false;
    }

    if (
      query.condition &&
      !this.matchesString(attrs.condition, query.condition)
    ) {
      return false;
    }

    if (
      query.sellerType &&
      !this.matchesString(attrs.sellerType, query.sellerType)
    ) {
      return false;
    }

    if (
      query.delivery !== undefined &&
      query.delivery !== '' &&
      !this.matchesBoolean(attrs.delivery, query.delivery)
    ) {
      return false;
    }

    return true;
  }

  private matchesJobFilters(
    attrs: Record<string, any>,
    query: any,
  ): boolean {
    if (
      query.profession &&
      !this.matchesAnyField(
        attrs,
        ['profession', 'position', 'specialization'],
        query.profession,
      )
    ) {
      return false;
    }

    if (
      query.industry &&
      !this.matchesString(attrs.industry, query.industry)
    ) {
      return false;
    }

    if (
      !this.matchesMin(
        this.firstValue(attrs, [
          'salary',
          'salaryFrom',
          'salaryMin',
        ]),
        query.salaryFrom,
      )
    ) {
      return false;
    }

    if (
      !this.matchesMax(
        this.firstValue(attrs, [
          'salary',
          'salaryTo',
          'salaryMax',
        ]),
        query.salaryTo,
      )
    ) {
      return false;
    }

    if (
      query.employment &&
      !this.matchesString(attrs.employment, query.employment)
    ) {
      return false;
    }

    if (
      query.experience &&
      !this.matchesString(attrs.experience, query.experience)
    ) {
      return false;
    }

    if (
      query.schedule &&
      !this.matchesString(attrs.schedule, query.schedule)
    ) {
      return false;
    }

    if (
      query.education &&
      !this.matchesString(attrs.education, query.education)
    ) {
      return false;
    }

    if (
      query.remote !== undefined &&
      query.remote !== '' &&
      !this.matchesBoolean(attrs.remote, query.remote)
    ) {
      return false;
    }

    return true;
  }

  private matchesServiceFilters(
    attrs: Record<string, any>,
    query: any,
  ): boolean {
    if (
      query.serviceType &&
      !this.matchesAnyField(
        attrs,
        ['serviceType', 'category', 'specialization'],
        query.serviceType,
      )
    ) {
      return false;
    }

    if (
      query.specialization &&
      !this.matchesAnyField(
        attrs,
        ['specialization', 'profession'],
        query.specialization,
      )
    ) {
      return false;
    }

    if (
      query.paymentType &&
      !this.matchesAnyField(
        attrs,
        ['paymentType', 'priceType'],
        query.paymentType,
      )
    ) {
      return false;
    }

    if (
      !this.matchesMin(
        this.firstValue(attrs, [
          'experienceYears',
          'yearsExperience',
        ]),
        query.experienceYearsFrom,
      )
    ) {
      return false;
    }

    if (
      query.homeVisit !== undefined &&
      query.homeVisit !== '' &&
      !this.matchesBoolean(
        this.firstValue(attrs, ['homeVisit', 'visit']),
        query.homeVisit,
      )
    ) {
      return false;
    }

    if (
      query.online !== undefined &&
      query.online !== '' &&
      !this.matchesBoolean(attrs.online, query.online)
    ) {
      return false;
    }

    return true;
  }

  private firstValue(
    attrs: Record<string, any>,
    keys: string[],
  ): any {
    for (const key of keys) {
      if (
        attrs[key] !== undefined &&
        attrs[key] !== null &&
        attrs[key] !== ''
      ) {
        return attrs[key];
      }
    }

    return undefined;
  }

  private matchesAnyField(
    attrs: Record<string, any>,
    keys: string[],
    expected: any,
  ): boolean {
    return keys.some((key) =>
      this.matchesString(attrs[key], expected),
    );
  }

  private matchesString(
    actual: any,
    expected: any,
  ): boolean {
    if (
      expected === undefined ||
      expected === null ||
      expected === ''
    ) {
      return true;
    }

    if (
      actual === undefined ||
      actual === null ||
      actual === ''
    ) {
      return false;
    }

    return (
      String(actual).trim().toLowerCase() ===
      String(expected).trim().toLowerCase()
    );
  }

  private matchesNumber(
    actual: any,
    expected: any,
  ): boolean {
    if (
      expected === undefined ||
      expected === null ||
      expected === ''
    ) {
      return true;
    }

    const actualNumber = Number(actual);
    const expectedNumber = Number(expected);

    if (
      Number.isNaN(actualNumber) ||
      Number.isNaN(expectedNumber)
    ) {
      return false;
    }

    return actualNumber === expectedNumber;
  }

  private matchesMin(
    actual: any,
    minimum: any,
  ): boolean {
    if (
      minimum === undefined ||
      minimum === null ||
      minimum === ''
    ) {
      return true;
    }

    const actualNumber = Number(actual);
    const minimumNumber = Number(minimum);

    if (
      Number.isNaN(actualNumber) ||
      Number.isNaN(minimumNumber)
    ) {
      return false;
    }

    return actualNumber >= minimumNumber;
  }

  private matchesMax(
    actual: any,
    maximum: any,
  ): boolean {
    if (
      maximum === undefined ||
      maximum === null ||
      maximum === ''
    ) {
      return true;
    }

    const actualNumber = Number(actual);
    const maximumNumber = Number(maximum);

    if (
      Number.isNaN(actualNumber) ||
      Number.isNaN(maximumNumber)
    ) {
      return false;
    }

    return actualNumber <= maximumNumber;
  }

  private matchesBoolean(
    actual: any,
    expected: any,
  ): boolean {
    if (
      expected === undefined ||
      expected === null ||
      expected === ''
    ) {
      return true;
    }

    const normalizeBoolean = (value: any): boolean | null => {
      if (typeof value === 'boolean') {
        return value;
      }

      const normalized = String(value)
        .trim()
        .toLowerCase();

      if (
        ['true', '1', 'yes', 'да', 'есть'].includes(normalized)
      ) {
        return true;
      }

      if (
        ['false', '0', 'no', 'нет', 'без'].includes(normalized)
      ) {
        return false;
      }

      return null;
    };

    const actualBoolean = normalizeBoolean(actual);
    const expectedBoolean = normalizeBoolean(expected);

    if (
      actualBoolean === null ||
      expectedBoolean === null
    ) {
      return false;
    }

    return actualBoolean === expectedBoolean;
  }

  async search(
    query: any,
  ): Promise<{
    items: Listing[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = Math.max(parseInt(query.page) || 1, 1);
    const limit = Math.min(
      Math.max(parseInt(query.limit) || 20, 1),
      100,
    );

    const lat =
      query.lat !== undefined
        ? parseFloat(query.lat)
        : undefined;

    const lng =
      query.lng !== undefined
        ? parseFloat(query.lng)
        : undefined;

    const radius = query.radius
      ? parseFloat(query.radius)
      : 10;

    const where: Prisma.ListingWhereInput = {
      status: 'active',
    };

    if (query.type && query.type !== 'all') {
      where.type = query.type;
    }

    if (query.search) {
      where.OR = [
        {
          title: {
            contains: query.search,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: query.search,
            mode: 'insensitive',
          },
        },
      ];
    }

    let items = await this.prisma.listing.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
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

    if (lat !== undefined && lng !== undefined) {
      const earthRadius = 6371;

      items = items.filter((item) => {
        if (item.lat === null || item.lng === null) {
          return false;
        }

        const dLat =
          ((item.lat - lat) * Math.PI) / 180;

        const dLng =
          ((item.lng - lng) * Math.PI) / 180;

        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos((lat * Math.PI) / 180) *
            Math.cos((item.lat * Math.PI) / 180) *
            Math.sin(dLng / 2) *
            Math.sin(dLng / 2);

        const c =
          2 *
          Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a),
          );

        const distance = earthRadius * c;

        return distance <= radius;
      });
    }

    items = items.filter((item) =>
      this.matchesFilters(item, query),
    );

    const total = items.length;
    const skip = (page - 1) * limit;

    return {
      items: items.slice(skip, skip + limit),
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<Listing> {
    const listing =
      await this.prisma.listing.findUnique({
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
      throw new NotFoundException(
        `Listing with id ${id} not found`,
      );
    }

    return listing;
  }

  async update(
    id: string,
    updateListingDto: UpdateListingDto,
  ): Promise<Listing> {
    const listing =
      await this.prisma.listing.findUnique({
        where: { id },
      });

    if (!listing) {
      throw new NotFoundException(
        `Listing with id ${id} not found`,
      );
    }

    const { images, ...updateData } =
      updateListingDto;

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

    return this.prisma.listing.update({
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
  }

  async remove(id: string): Promise<void> {
    const listing =
      await this.prisma.listing.findUnique({
        where: { id },
      });

    if (!listing) {
      throw new NotFoundException(
        `Listing with id ${id} not found`,
      );
    }

    await this.prisma.listing.delete({
      where: { id },
    });
  }

  async incrementViews(
    id: string,
  ): Promise<{ views: number }> {
    const listing =
      await this.prisma.listing.update({
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

    return {
      views: listing.views,
    };
  }

  async findByType(type: string): Promise<Listing[]> {
    return this.prisma.listing.findMany({
      where: {
        type,
        status: 'active',
      },
      orderBy: {
        createdAt: 'desc',
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
  }

  async findByUser(
    userId: string,
  ): Promise<Listing[]> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException(
        `User with id ${userId} not found`,
      );
    }

    return this.prisma.listing.findMany({
      where: {
        authorId: userId,
      },
      orderBy: {
        createdAt: 'desc',
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
  }
}