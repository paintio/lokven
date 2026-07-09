import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('admin/usb-tokens')
@UseGuards(JwtAuthGuard)
export class UsbTokenController {
  constructor(private authService: AuthService) {}

  // Получение всех токенов
  @Get()
  async getAll() {
    return this.authService.getAllUsbTokens();
  }

  // Получение токена по ID
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.authService.getUsbTokenById(id);
  }

  // Генерация нового токена
  @Post('generate')
  async generate(@Request() req, @Body() body: { deviceId?: string }) {
    return this.authService.generateUsbToken(req.user.id, body.deviceId);
  }

  // Обновление статуса токена
  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: 'APPROVED' | 'REJECTED' | 'PENDING' },
  ) {
    return this.authService.updateUsbTokenStatus(id, body.status);
  }

  // Обновление deviceId токена
  @Put(':id/device')
  async updateDevice(
    @Param('id') id: string,
    @Body() body: { deviceId: string },
  ) {
    return this.authService.updateUsbTokenDevice(id, body.deviceId);
  }

  // Удаление токена
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.authService.deleteUsbToken(id);
  }

  // Проверка существования токена
  @Post('check')
  async check(@Body() body: { token: string }) {
    const exists = await this.authService.checkUsbTokenExists(body.token);
    return { valid: exists };
  }

  // Статистика по токенам
  @Get('stats')
  async getStats() {
    return this.authService.getUsbTokenStats();
  }

  // Создание одноразового токена
  @Post('one-time')
  async createOneTime(@Request() req) {
    return this.authService.createOneTimeUsbToken(req.user.id);
  }
}