import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminUsbService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  private hash(token: string) {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  async verifyUsbToken(token: string, deviceId: string, ip: string) {
    const tokenHash = this.hash(token);

    const record = await this.prisma.adminUsbToken.findUnique({
      where: { tokenHash },
    });

    if (!record) throw new UnauthorizedException('Invalid USB token');
    if (record.status !== 'APPROVED')
      throw new UnauthorizedException('Token not approved');
    if (record.expiresAt < new Date())
      throw new UnauthorizedException('Token expired');
    if (record.usedAt)
      throw new UnauthorizedException('Token already used');

    // device binding
    if (record.deviceId && record.deviceId !== deviceId) {
      throw new UnauthorizedException('Device mismatch');
    }

    const sessionId = crypto.randomUUID();

    await this.prisma.$transaction([
      this.prisma.adminUsbToken.update({
        where: { id: record.id },
        data: {
          usedAt: new Date(),
          deviceId,
        },
      }),

      this.prisma.adminSession.create({
        data: {
          token: sessionId,
          deviceId,
          ip,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      }),
    ]);

    return {
      token: this.jwt.sign({
        sub: 'usb-admin',
        role: 'admin',
        type: 'usb',
        sid: sessionId, // 🔥 КЛЮЧЕВОЕ ДОБАВЛЕНИЕ
      }),
    };
  }

  async createUsbToken() {
    const raw = crypto.randomBytes(32).toString('hex');

    const expires = new Date();
    expires.setDate(expires.getDate() + 7);

    const token = await this.prisma.adminUsbToken.create({
      data: {
        tokenHash: this.hash(raw),
        expiresAt: expires,
      },
    });

    // ⚠️ ВАЖНО: вернуть RAW токен, иначе его нельзя использовать
    return {
      token: raw,
      id: token.id,
      expiresAt: token.expiresAt,
    };
  }
}