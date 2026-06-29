import { Controller, Post, Get, Put, Body, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    return this.authService.getProfile(req.user.id);
  }

  @Put('profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(@Request() req, @Body() updateDto: UpdateProfileDto) {
    return this.authService.updateProfile(req.user.id, updateDto);
  }

  @Put('change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Request() req,
    @Body() body: { oldPassword: string; newPassword: string },
  ) {
    return this.authService.changePassword(req.user.id, body.oldPassword, body.newPassword);
  }

  @Post('generate-admin-token')
  @UseGuards(JwtAuthGuard)
  async generateAdminToken(@Request() req, @Body() body: { userId: string }) {
    const user = await this.authService.validateAdmin(body.userId);
    if (!user) {
      throw new UnauthorizedException('Недостаточно прав');
    }

    const token = this.authService.generateAdminToken(body.userId);
    await this.authService.saveAdminToken(body.userId, token);
    
    return { token };
  }

  @Post('verify-admin-token')
  async verifyAdminToken(@Body() body: { token: string }) {
    const isValid = await this.authService.verifyAdminToken(body.token);
    return { valid: isValid };
  }
}