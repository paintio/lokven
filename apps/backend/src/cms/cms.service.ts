import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CmsService {
  constructor(private prisma: PrismaService) {}

  // Страницы
  async getPages() {
    return this.prisma.page.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
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
        content: data.content || '',
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        isActive: data.isActive !== undefined ? data.isActive : true,
      },
    });
  }

  async updatePage(id: string, data: any) {
    return this.prisma.page.update({
      where: { id },
      data: {
        slug: data.slug,
        title: data.title,
        content: data.content,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        isActive: data.isActive,
      },
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
      where: { isActive: true },
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
      data: {
        group: data.group,
        label: data.label,
        url: data.url,
        order: data.order || 0,
        isActive: data.isActive !== undefined ? data.isActive : true,
      },
    });
  }

  async updateFooterLink(id: string, data: any) {
    return this.prisma.footerLink.update({
      where: { id },
      data: {
        group: data.group,
        label: data.label,
        url: data.url,
        order: data.order,
        isActive: data.isActive,
      },
    });
  }

  async deleteFooterLink(id: string) {
    return this.prisma.footerLink.delete({
      where: { id },
    });
  }

  // Настройки
  async getSettings() {
    return this.prisma.setting.findMany();
  }

  async getSetting(key: string) {
    return this.prisma.setting.findUnique({
      where: { key },
    });
  }

  async createSetting(data: any) {
    return this.prisma.setting.create({
      data: {
        key: data.key,
        value: data.value,
        group: data.group || 'general',
        type: data.type || 'string',
        label: data.label,
        description: data.description,
      },
    });
  }

  async updateSetting(key: string, data: any) {
    return this.prisma.setting.update({
      where: { key },
      data: {
        value: data.value,
        group: data.group,
        type: data.type,
        label: data.label,
        description: data.description,
      },
    });
  }

  async deleteSetting(key: string) {
    return this.prisma.setting.delete({
      where: { key },
    });
  }
}
