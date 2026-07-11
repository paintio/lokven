import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // =========================
  // 🔹 РЕГИСТРАЦИЯ (по телефону)
  // =========================
  async register(dto: {
    phone: string;
    password: string;
    email?: string;
    name?: string;
    isSeller?: boolean;
    inn?: string;
    ogrn?: string;
    companyName?: string;
    legalAddress?: string;
    bankAccount?: string;
    bik?: string;
    documents?: Record<string, any>;
  }) {
    const existingPhone = await this.prisma.user.findUnique({
      where: { phone: dto.phone },
    });
    if (existingPhone) {
      throw new ConflictException('Пользователь с таким телефоном уже существует');
    }

    if (dto.email) {
      const existingEmail = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });
      if (existingEmail) {
        throw new ConflictException('Пользователь с таким email уже существует');
      }
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        phone: dto.phone,
        email: dto.email,
        password: hashedPassword,
        name: dto.name || dto.phone,
        isSeller: dto.isSeller || false,
        inn: dto.inn,
        ogrn: dto.ogrn,
        companyName: dto.companyName,
        legalAddress: dto.legalAddress,
        bankAccount: dto.bankAccount,
        bik: dto.bik,
        documents: dto.documents || null,
        sellerStatus: dto.isSeller ? 'pending' : 'pending',
      },
    });

    const session = await this.createSession(user.id);
    const token = this.generateToken(user.id, user.phone);

    return {
      user: {
        id: user.id,
        phone: user.phone,
        email: user.email,
        name: user.name,
        role: user.role,
        isVerified: user.isVerified,
        isSeller: user.isSeller,
        sellerStatus: user.sellerStatus,
        avatar: user.avatar,
      },
      token,
      sessionId: session.id,
    };
  }

  // =========================
  // 🔹 ВХОД ПО ТЕЛЕФОНУ
  // =========================
  async loginByPhone(dto: { phone: string; password: string }) {
    const user = await this.prisma.user.findUnique({
      where: { phone: dto.phone },
    });

    if (!user) {
      throw new UnauthorizedException('Неверный телефон или пароль');
    }

    if (user.isBlocked) {
      throw new UnauthorizedException('Пользователь заблокирован');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверный телефон или пароль');
    }

    const session = await this.createSession(user.id);
    const token = this.generateToken(user.id, user.phone);

    return {
      user: {
        id: user.id,
        phone: user.phone,
        email: user.email,
        name: user.name,
        role: user.role,
        isVerified: user.isVerified,
        isSeller: user.isSeller,
        sellerStatus: user.sellerStatus,
        avatar: user.avatar,
      },
      token,
      sessionId: session.id,
    };
  }

  // =========================
  // 🔹 ПОЛУЧЕНИЕ ПРОФИЛЯ (ИСПРАВЛЕНО)
  // =========================
  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        listings: {
          where: { status: { not: 'archived' } },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            listings: {
              where: { status: { not: 'archived' } },
            },
            ordersAsBuyer: true,
            ordersAsSeller: true,
            favorites: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Пользователь не найден');
    }

    const { password, resetToken, resetTokenExpiry, ...result } = user;
    return result;
  }

  // =========================
  // 🔹 ОБНОВЛЕНИЕ ПРОФИЛЯ
  // =========================
  async updateProfile(userId: string, dto: UpdateProfileDto) {
    if (dto.email) {
      const existingUser = await this.prisma.user.findFirst({
        where: {
          email: dto.email,
          NOT: { id: userId },
        },
      });

      if (existingUser) {
        throw new ConflictException('Этот email уже используется');
      }
    }

    if (dto.phone) {
      const existingUser = await this.prisma.user.findFirst({
        where: {
          phone: dto.phone,
          NOT: { id: userId },
        },
      });

      if (existingUser) {
        throw new ConflictException('Этот телефон уже используется');
      }
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        avatar: dto.avatar,
        inn: dto.inn,
        ogrn: dto.ogrn,
        companyName: dto.companyName,
        legalAddress: dto.legalAddress,
        bankAccount: dto.bankAccount,
        bik: dto.bik,
        documents: dto.documents,
      },
      include: {
        listings: {
          where: { status: { not: 'archived' } },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            listings: {
              where: { status: { not: 'archived' } },
            },
            ordersAsBuyer: true,
            ordersAsSeller: true,
            favorites: true,
          },
        },
      },
    });

    const { password, resetToken, resetTokenExpiry, ...result } = user;
    return result;
  }

  // =========================
  // 🔹 СМЕНА ПАРОЛЯ
  // =========================
  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('Пользователь не найден');
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверный текущий пароль');
    }

    if (oldPassword === newPassword) {
      throw new BadRequestException('Новый пароль должен отличаться от старого');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: 'Пароль успешно изменён' };
  }

  // =========================
  // 🔹 USB ADMIN LOGIN
  // =========================
  async usbLogin(rawToken: string, deviceId?: string, ip?: string, userAgent?: string) {
    const tokenHash = crypto
      .createHash('sha256')
      .update(rawToken)
      .digest('hex');

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

    if (record.deviceId && deviceId && record.deviceId !== deviceId) {
      throw new UnauthorizedException('Device mismatch');
    }

    const sessionToken = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const session = await this.prisma.adminSession.create({
      data: {
        token: sessionToken,
        deviceId: deviceId || record.deviceId || 'unknown',
        ip: ip || null,
        userAgent: userAgent || null,
        expiresAt: expiresAt,
      },
    });

    await this.prisma.adminUsbToken.update({
      where: { tokenHash },
      data: {
        usedAt: new Date(),
        deviceId: deviceId || record.deviceId,
      },
    });

    const jwt = this.jwtService.sign({
      type: 'usb',
      sid: session.token,
      deviceId: deviceId || record.deviceId,
      role: 'admin',
    });

    return {
      token: jwt,
      sessionId: session.token,
      type: 'usb',
      expiresAt: expiresAt,
      deviceId: session.deviceId,
    };
  }

  // =========================
  // 🔹 ВЫХОД ИЗ СЕССИИ
  // =========================
  async logout(sessionId: string) {
    await this.prisma.session.deleteMany({
      where: { id: sessionId },
    });
    return { message: 'Logged out successfully' };
  }

  // =========================
  // 🔹 ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ
  // =========================
  
  private generateToken(userId: string, phoneOrEmail: string) {
    const payload = { sub: userId, phone: phoneOrEmail };
    return this.jwtService.sign(payload);
  }

  private async createSession(userId: string) {
    const token = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    return this.prisma.session.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    });
  }
}