import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CmsService {
  constructor(private prisma: PrismaService) {}

  // Страницы
  async getPages() {
    return this.prisma.page.findMany({
      orderBy: { order: 'asc' },
    });
  }

  async getPage(slug: string) {
    return this.prisma.page.findUnique({
      where: { slug },
    });
  }

  async createPage(data: any) {
    return this.prisma.page.create({
      data: {
        slug: data.slug,
        title: data.title,
        content: data.content,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        isPublished: data.isPublished,
        order: data.order || 0,
      },
    });
  }

  async updatePage(id: string, data: any) {
    return this.prisma.page.update({
      where: { id },
      data,
    });
  }

  async deletePage(id: string) {
    return this.prisma.page.delete({
      where: { id },
    });
  }

  // Footer ссылки
  async getFooterLinks() {
    return this.prisma.footerLink.findMany({
      orderBy: [{ group: 'asc' }, { order: 'asc' }],
    });
  }

  async getFooterLinksByGroup(group: string) {
    return this.prisma.footerLink.findMany({
      where: { group, isActive: true },
      orderBy: { order: 'asc' },
    });
  }

  async createFooterLink(data: any) {
    return this.prisma.footerLink.create({
      data,
    });
  }

  async updateFooterLink(id: string, data: any) {
    return this.prisma.footerLink.update({
      where: { id },
      data,
    });
  }

  async deleteFooterLink(id: string) {
    return this.prisma.footerLink.delete({
      where: { id },
    });
  }
}
