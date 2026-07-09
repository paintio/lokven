import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class UsbTokenService {
  constructor(private prisma: PrismaService) {}

  // Генерация нового USB-токена
  async generateToken(userId: string, deviceId?: string) {
    // Генерируем сырой токен
    const rawToken = crypto.randomBytes(32).toString('hex');
    
    // Хешируем для хранения в БД
    const tokenHash = crypto
      .createHash('sha256')
      .update(rawToken)
      .digest('hex');

    // Сохраняем в БД
    const token = await this.prisma.adminUsbToken.create({
      data: {
        tokenHash,
        status: 'PENDING',
        deviceId: deviceId || null,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 дней
      },
    });

    // Возвращаем сырой токен (только для показа пользователю)
    return {
      id: token.id,
      rawToken, // ⚠️ ПОКАЗЫВАЕМ ТОЛЬКО ОДИН РАЗ!
      expiresAt: token.expiresAt,
      status: token.status,
      deviceId: token.deviceId,
    };
  }

  // Проверка USB-токена
  async verifyToken(rawToken: string, deviceId?: string) {
    const tokenHash = crypto
      .createHash('sha256')
      .update(rawToken)
      .digest('hex');

    const token = await this.prisma.adminUsbToken.findUnique({
      where: { tokenHash },
    });

    if (!token) {
      throw new UnauthorizedException('Invalid USB token');
    }

    if (token.status !== 'APPROVED') {
      throw new UnauthorizedException('Token not approved');
    }

    if (token.expiresAt < new Date()) {
      throw new UnauthorizedException('Token expired');
    }

    // Проверка deviceId, если он был привязан
    if (token.deviceId && deviceId && token.deviceId !== deviceId) {
      throw new UnauthorizedException('Device mismatch');
    }

    return token;
  }

  // Получение всех токенов
  async getAllTokens() {
    return this.prisma.adminUsbToken.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        status: true,
        deviceId: true,
        usedAt: true,
        expiresAt: true,
        createdAt: true,
        // Не возвращаем tokenHash в списке
      },
    });
  }

  // Обновление статуса токена
  async updateTokenStatus(tokenId: string, status: 'APPROVED' | 'REJECTED' | 'PENDING') {
    return this.prisma.adminUsbToken.update({
      where: { id: tokenId },
      data: { status },
    });
  }

  // Удаление токена
  async deleteToken(tokenId: string) {
    return this.prisma.adminUsbToken.delete({
      where: { id: tokenId },
    });
  }

  // Проверка, существует ли токен
  async tokenExists(rawToken: string): Promise<boolean> {
    const tokenHash = crypto
      .createHash('sha256')
      .update(rawToken)
      .digest('hex');

    const token = await this.prisma.adminUsbToken.findUnique({
      where: { tokenHash },
    });

    return !!token;
  }

  // Создание одноразового токена для входа
  async createOneTimeToken(userId: string) {
    const rawToken = crypto.randomBytes(16).toString('hex');
    const tokenHash = crypto
      .createHash('sha256')
      .update(rawToken)
      .digest('hex');

    const token = await this.prisma.adminUsbToken.create({
      data: {
        tokenHash,
        status: 'APPROVED',
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 минут
      },
    });

    return {
      token: rawToken,
      expiresIn: 300, // 5 минут в секундах
    };
  }
}