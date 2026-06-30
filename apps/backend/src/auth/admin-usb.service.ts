import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { randomUUID } from 'crypto';

@Injectable()
export class AdminUsbService {
  constructor(private prisma: PrismaService) {}

  async createToken(days = 7) {
    const token = randomUUID();

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + days);

    return this.prisma.adminUsbToken.create({
      data: {
        token,
        status: 'PENDING',
        expiresAt,
      },
    });
  }

  async approveToken(id: string) {
    return this.prisma.adminUsbToken.update({
      where: { id },
      data: {
        status: 'APPROVED',
      },
    });
  }

  async listTokens() {
    return this.prisma.adminUsbToken.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}