import { Controller, Get, Query } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Controller('categories')
export class CategoriesController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async getCategories(@Query('slug') slug?: string) {
    const where: any = {};
    
    if (slug) {
      where.slug = slug;
    }

    const categories = await this.prisma.category.findMany({
      where,
      orderBy: { order: 'asc' },
    });

    // Если ищем по slug, возвращаем одну категорию
    if (slug) {
      return categories.length > 0 ? categories[0] : null;
    }

    return categories;
  }
}