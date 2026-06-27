import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendWelcomeEmail(email: string, name: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Добро пожаловать в Локвен!',
      template: 'welcome',
      context: {
        name: name || 'Пользователь',
        url: process.env.FRONTEND_URL || 'https://lokven-frontend.onrender.com',
      },
    });
  }

  async sendListingCreatedEmail(email: string, listingTitle: string, listingId: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Ваше объявление создано!',
      template: 'listing-created',
      context: {
        title: listingTitle,
        url: `${process.env.FRONTEND_URL || 'https://lokven-frontend.onrender.com'}/listings/${listingId}`,
      },
    });
  }

  async sendListingModeratedEmail(email: string, listingTitle: string, status: string, note?: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: `Объявление "${listingTitle}" ${status === 'active' ? 'одобрено' : 'отклонено'}`,
      template: 'listing-moderated',
      context: {
        title: listingTitle,
        status: status === 'active' ? 'одобрено ✅' : 'отклонено ❌',
        note: note || '',
        url: `${process.env.FRONTEND_URL || 'https://lokven-frontend.onrender.com'}/listings`,
      },
    });
  }

  async sendPasswordResetEmail(email: string, token: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Восстановление пароля',
      template: 'password-reset',
      context: {
        url: `${process.env.FRONTEND_URL || 'https://lokven-frontend.onrender.com'}/auth/reset-password?token=${token}`,
      },
    });
  }

  async sendOrderNotificationEmail(email: string, orderId: string, total: number) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Новый заказ на Локвен',
      template: 'order-notification',
      context: {
        orderId,
        total: total.toLocaleString('ru-RU'),
        url: `${process.env.FRONTEND_URL || 'https://lokven-frontend.onrender.com'}/profile/orders`,
      },
    });
  }

  async sendReviewNotificationEmail(email: string, reviewerName: string, rating: number) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Новый отзыв на ваше объявление',
      template: 'review-notification',
      context: {
        name: reviewerName || 'Пользователь',
        rating: rating,
        stars: '★'.repeat(rating) + '☆'.repeat(5 - rating),
        url: `${process.env.FRONTEND_URL || 'https://lokven-frontend.onrender.com'}/profile/reviews`,
      },
    });
  }
}
