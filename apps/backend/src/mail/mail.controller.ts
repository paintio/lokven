import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { MailService } from './mail.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('mail')
@UseGuards(JwtAuthGuard)
export class MailController {
  constructor(private mailService: MailService) {}

  @Post('test')
  async testEmail(@Body() body: { email: string }) {
    await this.mailService.sendWelcomeEmail(body.email, 'Тестовый пользователь');
    return { success: true, message: 'Письмо отправлено' };
  }

  @Post('test-listing')
  async testListingEmail(@Body() body: { email: string; title: string }) {
    await this.mailService.sendListingCreatedEmail(body.email, body.title, 'test-123');
    return { success: true, message: 'Письмо отправлено' };
  }
}
