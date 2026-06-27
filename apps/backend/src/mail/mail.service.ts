import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendWelcomeEmail(email: string, name: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Добро пожаловать в Локвен!',
      html: `
        <h1>Добро пожаловать, ${name || 'Пользователь'}!</h1>
        <p>Вы успешно зарегистрировались на платформе Локвен.</p>
        <p>Теперь вы можете создавать объявления, покупать и продавать товары.</p>
        <a href="${process.env.FRONTEND_URL || 'https://lokven-frontend.onrender.com'}">Перейти на сайт</a>
      `,
    });
  }

  async sendListingCreatedEmail(email: string, listingTitle: string, listingId: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Ваше объявление создано!',
      html: `
        <h1>Объявление "${listingTitle}" создано!</h1>
        <p>Оно будет опубликовано после проверки модератором.</p>
        <a href="${process.env.FRONTEND_URL || 'https://lokven-frontend.onrender.com'}/listings/${listingId}">Посмотреть объявление</a>
      `,
    });
  }

  async sendListingModeratedEmail(email: string, listingTitle: string, status: string, note?: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: `Объявление "${listingTitle}" ${status === 'active' ? 'одобрено' : 'отклонено'}`,
      html: `
        <h1>Объявление "${listingTitle}" ${status === 'active' ? 'одобрено ✅' : 'отклонено ❌'}</h1>
        ${note ? `<p><strong>Причина:</strong> ${note}</p>` : ''}
        <a href="${process.env.FRONTEND_URL || 'https://lokven-frontend.onrender.com'}/listings">Перейти к объявлениям</a>
      `,
    });
  }

  async sendPasswordResetEmail(email: string, token: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Восстановление пароля',
      html: `
        <h1>Восстановление пароля</h1>
        <p>Для сброса пароля перейдите по ссылке:</p>
        <a href="${process.env.FRONTEND_URL || 'https://lokven-frontend.onrender.com'}/auth/reset-password?token=${token}">Сбросить пароль</a>
        <p>Ссылка действительна в течение 1 часа.</p>
      `,
    });
  }

  async sendOrderNotificationEmail(email: string, orderId: string, total: number) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Новый заказ на Локвен',
      html: `
        <h1>Новый заказ #${orderId}</h1>
        <p>Сумма заказа: ${total.toLocaleString('ru-RU')} ₽</p>
        <a href="${process.env.FRONTEND_URL || 'https://lokven-frontend.onrender.com'}/profile/orders">Посмотреть заказы</a>
      `,
    });
  }

  async sendReviewNotificationEmail(email: string, reviewerName: string, rating: number) {
    const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
    await this.mailerService.sendMail({
      to: email,
      subject: 'Новый отзыв на ваше объявление',
      html: `
        <h1>Новый отзыв</h1>
        <p>${reviewerName || 'Пользователь'} оставил отзыв с оценкой ${rating} ★</p>
        <p>${stars}</p>
        <a href="${process.env.FRONTEND_URL || 'https://lokven-frontend.onrender.com'}/profile/reviews">Посмотреть отзывы</a>
      `,
    });
  }
}
