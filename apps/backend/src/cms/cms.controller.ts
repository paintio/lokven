import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CmsService } from './cms.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminAccessGuard } from '../admin/admin-access.guard';

@Controller('cms')
export class CmsController {
  constructor(private cmsService: CmsService) {}

  // ПУБЛИЧНЫЕ ЭНДПОИНТЫ (без авторизации)
  @Get('footer')
  async getFooterLinks() {
    return this.cmsService.getFooterLinks();
  }

  @Get('footer/group/:group')
  async getFooterLinksByGroup(@Param('group') group: string) {
    return this.cmsService.getFooterLinksByGroup(group);
  }

  @Get('pages/:slug')
  async getPage(@Param('slug') slug: string) {
    return this.cmsService.getPage(slug);
  }

  // АДМИНСКИЕ ЭНДПОИНТЫ (с авторизацией)
  @Get('pages')
  @UseGuards(JwtAuthGuard, AdminAccessGuard)
  async getPages() {
    return this.cmsService.getPages();
  }

  @Post('pages')
  @UseGuards(JwtAuthGuard, AdminAccessGuard)
  async createPage(@Body() data: any) {
    return this.cmsService.createPage(data);
  }

  @Put('pages/:id')
  @UseGuards(JwtAuthGuard, AdminAccessGuard)
  async updatePage(@Param('id') id: string, @Body() data: any) {
    return this.cmsService.updatePage(id, data);
  }

  @Delete('pages/:id')
  @UseGuards(JwtAuthGuard, AdminAccessGuard)
  async deletePage(@Param('id') id: string) {
    return this.cmsService.deletePage(id);
  }

  @Post('footer')
  @UseGuards(JwtAuthGuard, AdminAccessGuard)
  async createFooterLink(@Body() data: any) {
    return this.cmsService.createFooterLink(data);
  }

  @Put('footer/:id')
  @UseGuards(JwtAuthGuard, AdminAccessGuard)
  async updateFooterLink(@Param('id') id: string, @Body() data: any) {
    return this.cmsService.updateFooterLink(id, data);
  }

  @Delete('footer/:id')
  @UseGuards(JwtAuthGuard, AdminAccessGuard)
  async deleteFooterLink(@Param('id') id: string) {
    return this.cmsService.deleteFooterLink(id);
  }

  @Get('settings')
  @UseGuards(JwtAuthGuard, AdminAccessGuard)
  async getSettings() {
    return this.cmsService.getSettings();
  }

  @Get('settings/:key')
  @UseGuards(JwtAuthGuard, AdminAccessGuard)
  async getSetting(@Param('key') key: string) {
    return this.cmsService.getSetting(key);
  }

  @Post('settings')
  @UseGuards(JwtAuthGuard, AdminAccessGuard)
  async createSetting(@Body() data: any) {
    return this.cmsService.createSetting(data);
  }

  @Put('settings/:key')
  @UseGuards(JwtAuthGuard, AdminAccessGuard)
  async updateSetting(@Param('key') key: string, @Body() data: any) {
    return this.cmsService.updateSetting(key, data);
  }

  @Delete('settings/:key')
  @UseGuards(JwtAuthGuard)
  async deleteSetting(@Param('key') key: string) {
    return this.cmsService.deleteSetting(key);
  }
}
