import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { phone, email, password, name, isSeller, ...sellerData } = registerDto;

    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ phone }, { email: email || undefined }],
      },
    });

    if (existingUser) {
      throw new ConflictException('Пользователь с таким телефоном или email уже существует');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        phone,
        email,
        password: hashedPassword,
        name,
        isSeller: isSeller || false,
        role: isSeller ? 'seller' : 'user',
        sellerStatus: isSeller ? 'pending' : 'approved',
        ...(isSeller && {
          inn: sellerData.inn,
          ogrn: sellerData.ogrn,
          companyName: sellerData.companyName,
          legalAddress: sellerData.legalAddress,
          bankAccount: sellerData.bankAccount,
          bik: sellerData.bik,
          documents: sellerData.documents,
        }),
      },
    });

    const { password: _, ...result } = user;
    return {
      user: result,
      token: this.generateToken(user.id, user.role),
    };
  }

  async login(loginDto: LoginDto) {
    const { phone, password } = loginDto;

    const user = await this.prisma.user.findUnique({
      where: { phone },
    });

    if (!user) {
      throw new UnauthorizedException('Неверный телефон или пароль');
    }

    if (user.isBlocked) {
      throw new UnauthorizedException('Ваш аккаунт заблокирован');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверный телефон или пароль');
    }

    const { password: _, ...result } = user;
    return {
      user: result,
      token: this.generateToken(user.id, user.role),
    };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        _count: {
          select: {
            listings: true,
            ordersAsBuyer: true,
            ordersAsSeller: true,
            favorites: true,
          },
        },
        listings: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            images: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const { password, resetToken, resetTokenExpiry, ...result } = user;
    return result;
  }

  async updateProfile(userId: string, updateDto: UpdateProfileDto) {
    const { phone, email, ...data } = updateDto;

    if (phone || email) {
      const existing = await this.prisma.user.findFirst({
        where: {
          OR: [{ phone: phone || undefined }, { email: email || undefined }],
          NOT: { id: userId },
        },
      });

      if (existing) {
        throw new ConflictException('Телефон или email уже используются');
      }
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...data,
        phone,
        email,
      },
    });

    const { password, resetToken, resetTokenExpiry, ...result } = user;
    return result;
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Неверный текущий пароль');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: 'Пароль успешно изменен' };
  }

  private generateToken(userId: string, role: string): string {
    return this.jwtService.sign({ sub: userId, role });
  }
  async usbLogin(token: string) {
  const record = await this.prisma.adminUsbToken.findUnique({
    where: { token },
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

  return {
    token: this.jwtService.sign({
      sub: 'admin-usb',
      role: 'admin',
    }),
  };
}
}
