import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
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
      throw new ConflictException('Пользователь уже существует');
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
        ...(isSeller && sellerData),
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

    if (!user) throw new UnauthorizedException('Неверный логин или пароль');
    if (user.isBlocked) throw new UnauthorizedException('Заблокирован');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Неверный логин или пароль');

    const { password: _, ...result } = user;

    return {
      user: result,
      token: this.generateToken(user.id, user.role),
    };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new UnauthorizedException('User not found');

    const { password, ...result } = user;
    return result;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: dto,
    });

    const { password, ...result } = user;
    return result;
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new UnauthorizedException('User not found');

    const ok = await bcrypt.compare(oldPassword, user.password);
    if (!ok) throw new BadRequestException('Wrong password');

    const hash = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hash },
    });

    return { ok: true };
  }

  // =========================
  // USB ADMIN LOGIN
  // =========================
  async usbLogin(token: string, ip?: string) {
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
        ip: ip || null,
      }),
    };
  }

  private generateToken(userId: string, role: string) {
    return this.jwtService.sign({
      sub: userId,
      role,
    });
  }
}