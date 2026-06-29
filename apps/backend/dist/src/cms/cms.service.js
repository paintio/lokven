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
exports.CmsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let CmsService = class CmsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getPages() {
        return this.prisma.page.findMany({
            where: { isActive: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getPage(slug) {
        return this.prisma.page.findUnique({
            where: { slug },
        });
    }
    async createPage(data) {
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
    async updatePage(id, data) {
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
    async deletePage(id) {
        return this.prisma.page.delete({
            where: { id },
        });
    }
    async getFooterLinks() {
        return this.prisma.footerLink.findMany({
            where: { isActive: true },
            orderBy: [{ group: 'asc' }, { order: 'asc' }],
        });
    }
    async getFooterLinksByGroup(group) {
        return this.prisma.footerLink.findMany({
            where: { group, isActive: true },
            orderBy: { order: 'asc' },
        });
    }
    async createFooterLink(data) {
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
    async updateFooterLink(id, data) {
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
    async deleteFooterLink(id) {
        return this.prisma.footerLink.delete({
            where: { id },
        });
    }
    async getSettings() {
        return this.prisma.setting.findMany();
    }
    async getSetting(key) {
        return this.prisma.setting.findUnique({
            where: { key },
        });
    }
    async createSetting(data) {
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
    async updateSetting(key, data) {
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
    async deleteSetting(key) {
        return this.prisma.setting.delete({
            where: { key },
        });
    }
};
exports.CmsService = CmsService;
exports.CmsService = CmsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CmsService);
//# sourceMappingURL=cms.service.js.map