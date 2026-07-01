import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // =========================
  // USB ADMIN LOGIN (FIXED)
  // =========================
  async usbLogin(rawToken: string, ip?: string) {
    // 1. hash incoming token
    const tokenHash = crypto
      .createHash('sha256')
      .update(rawToken)
      .digest('hex');

    // 2. search by hash (NOT raw token)
    const record = await this.prisma.adminUsbToken.findUnique({
      where: { tokenHash },
    });

    if (!record) {
      throw new UnauthorizedException('Invalid USB token');
    }

    if (record.status !== 'APPROVED') {
      throw new UnauthorizedException('Token not approved');
    }

    if (record.expiresAt.getTime() < Date.now()) {
      throw new UnauthorizedException('Token expired');
    }

    // 3. optional: one-time use protection
    await this.prisma.adminUsbToken.update({
      where: { tokenHash },
      data: {
        usedAt: new Date(),
      },
    });

    // 4. create admin JWT
    const jwt = this.jwtService.sign({
      sub: 'admin-usb',
      role: 'admin',
      ip: ip || null,
    });

    return {
      token: jwt,
      type: 'usb',
    };
  }
}