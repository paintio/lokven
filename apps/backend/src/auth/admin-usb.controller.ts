import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AdminUsbService } from './admin-usb.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('admin/usb')
@UseGuards(JwtAuthGuard)
export class AdminUsbController {
  constructor(private adminUsbService: AdminUsbService) {}

  // Получение всех токенов
  @Get('tokens')
  async getAllTokens() {
    return this.adminUsbService.getAllTokens();
  }

  // Генерация нового токена
  @Post('tokens/generate')
  async generateToken(@Body() body: { deviceId?: string }) {
    return this.adminUsbService.generateToken(body.deviceId);
  }

  // Обновление статуса токена
  @Put('tokens/:id/status')
  async updateTokenStatus(
    @Param('id') id: string,
    @Body() body: { status: 'PENDING' | 'APPROVED' | 'REJECTED' },
  ) {
    return this.adminUsbService.updateTokenStatus(id, body.status);
  }

  // Удаление токена
  @Delete('tokens/:id')
  async deleteToken(@Param('id') id: string) {
    return this.adminUsbService.deleteToken(id);
  }

  // Проверка токена
  @Post('tokens/check')
  async checkToken(@Body() body: { token: string }) {
    const exists = await this.adminUsbService.tokenExists(body.token);
    return { valid: exists };
  }
}