import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CmsService } from './cms.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('cms')
@UseGuards(JwtAuthGuard)
export class CmsController {
  constructor(private cmsService: CmsService) {}

  // Страницы
  @Get('pages')
  async getPages() {
    return this.cmsService.getPages();
  }

  @Get('pages/:slug')
  async getPage(@Param('slug') slug: string) {
    return this.cmsService.getPage(slug);
  }

  @Post('pages')
  async createPage(@Body() data: any) {
    return this.cmsService.createPage(data);
  }

  @Put('pages/:id')
  async updatePage(@Param('id') id: string, @Body() data: any) {
    return this.cmsService.updatePage(id, data);
  }

  @Delete('pages/:id')
  async deletePage(@Param('id') id: string) {
    return this.cmsService.deletePage(id);
  }

  // Footer ссылки
  @Get('footer-links')
  async getFooterLinks() {
    return this.cmsService.getFooterLinks();
  }

  @Get('footer-links/group/:group')
  async getFooterLinksByGroup(@Param('group') group: string) {
    return this.cmsService.getFooterLinksByGroup(group);
  }

  @Post('footer-links')
  async createFooterLink(@Body() data: any) {
    return this.cmsService.createFooterLink(data);
  }

  @Put('footer-links/:id')
  async updateFooterLink(@Param('id') id: string, @Body() data: any) {
    return this.cmsService.updateFooterLink(id, data);
  }

  @Delete('footer-links/:id')
  async deleteFooterLink(@Param('id') id: string) {
    return this.cmsService.deleteFooterLink(id);
  }
}
