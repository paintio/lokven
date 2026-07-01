import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PrismaService } from '../prisma.service';

import { AdminUsbService } from './admin-usb.service';
import { AdminUsbController } from './admin-usb.controller';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'lokven-secret-key',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [
    AuthController,
    AdminUsbController,
  ],
  providers: [
    AuthService,
    JwtStrategy,
    PrismaService,
    AdminUsbService,
  ],
  exports: [AuthService],
})
export class AuthModule {}