import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register({
      phone: dto.phone,
      password: dto.password,
      email: dto.email,
      name: dto.name,
      isSeller: dto.isSeller,
      inn: dto.inn,
      ogrn: dto.ogrn,
      companyName: dto.companyName,
      legalAddress: dto.legalAddress,
      bankAccount: dto.bankAccount,
      bik: dto.bik,
      documents: dto.documents,
    });
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: { phone: string; password: string }) {
    return this.authService.loginByPhone(body);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async profile(@Request() req) {
    return this.authService.getProfile(req.user.id);
  }

  @Put('profile')
  @UseGuards(JwtAuthGuard)
  async update(@Request() req, @Body() dto: UpdateProfileDto) {
    return this.authService.updateProfile(req.user.id, dto);
  }

  @Put('change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(@Request() req, @Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(
      req.user.id,
      dto.oldPassword,
      dto.newPassword,
    );
  }

  @Post('usb-login')
  @HttpCode(HttpStatus.OK)
  async usbLogin(
    @Body() body: { token: string; deviceId?: string },
    @Request() req,
  ) {
    console.log('📍 USB login request received:', body.token);
    
    const result = await this.authService.usbLogin(
      body.token,
      body.deviceId,
      req.ip,
      req.headers['user-agent'],
    );
    
    console.log('📍 USB login result:', result);
    
    if (!result) {
      throw new UnauthorizedException('Login failed - no result');
    }
    
    return result;
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Request() req) {
    const sessionId = req.body?.sessionId || req.user?.sessionId;
    if (sessionId) {
      return this.authService.logout(sessionId);
    }
    return { message: 'Logged out successfully' };
  }
}