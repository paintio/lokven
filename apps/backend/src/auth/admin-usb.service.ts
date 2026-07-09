import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class AdminUsbService {
  constructor(private prisma: PrismaService) {}

  // Проверка USB-токена (используется в AuthService)
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

    if (token.deviceId && deviceId && token.deviceId !== deviceId) {
      throw new UnauthorizedException('Device mismatch');
    }

    return token;
  }

  // Создание нового USB-токена
  async createToken(rawToken: string, deviceId?: string) {
    const tokenHash = crypto
      .createHash('sha256')
      .update(rawToken)
      .digest('hex');

    return this.prisma.adminUsbToken.create({
      data: {
        tokenHash,
        status: 'PENDING',
        deviceId: deviceId || null,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });
  }

  // Генерация случайного токена
  async generateToken(deviceId?: string) {
    const rawToken = crypto.randomBytes(32).toString('hex');
    const token = await this.createToken(rawToken, deviceId);
    
    return {
      id: token.id,
      rawToken,
      status: token.status,
      expiresAt: token.expiresAt,
    };
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
      },
    });
  }

  // Обновление статуса токена
  async updateTokenStatus(tokenId: string, status: 'PENDING' | 'APPROVED' | 'REJECTED') {
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

  // Проверка существования токена
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
}