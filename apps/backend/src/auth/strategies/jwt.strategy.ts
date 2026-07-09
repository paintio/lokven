import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma.service';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          const authHeader = req?.headers?.authorization;

          if (authHeader?.startsWith('Bearer ')) {
            return authHeader.replace('Bearer ', '');
          }

          const cookieToken = req?.cookies?.token;
          if (cookieToken) return cookieToken;

          return null;
        },
      ]),
      secretOrKey: process.env.JWT_SECRET || 'lokven-secret-key',
    });
  }

  async validate(payload: any) {
    // =========================
    // USB ADMIN CHECK
    // =========================
    if (payload.type === 'usb') {
      if (!payload.sid) {
        throw new UnauthorizedException('Invalid USB session');
      }

      const session = await this.prisma.adminSession.findUnique({
        where: { token: payload.sid },
      });

      if (!session) {
        throw new UnauthorizedException('USB session not found');
      }

      if (session.expiresAt < new Date()) {
        throw new UnauthorizedException('USB session expired');
      }

      return {
        id: 'usb-admin',
        role: 'admin',
        type: 'usb',
        deviceId: session.deviceId,
        sessionId: session.id,
      };
    }

    // =========================
    // NORMAL USER CHECK
    // =========================
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        _count: {
          select: {
            listings: true,
            ordersAsBuyer: true,
            ordersAsSeller: true,
            reviewsAsSeller: true,
            reviewsAsBuyer: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user.isBlocked) {
      throw new UnauthorizedException('User is blocked');
    }

    const { password, resetToken, resetTokenExpiry, ...result } = user;
    return result;
  }
}