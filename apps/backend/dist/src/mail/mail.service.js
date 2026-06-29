"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = require("nodemailer");
let MailService = class MailService {
    constructor() {
        const dns = require('dns');
        const originalLookup = dns.lookup;
        dns.lookup = (hostname, options, callback) => {
            if (typeof options === 'function') {
                callback = options;
                options = { family: 4 };
            }
            else {
                options = { ...options, family: 4 };
            }
            return originalLookup(hostname, options, callback);
        };
        const transportOptions = {
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
            tls: {
                rejectUnauthorized: false,
            },
        };
        this.transporter = nodemailer.createTransport(transportOptions);
        dns.lookup = originalLookup;
    }
    async sendWelcomeEmail(email, name) {
        await this.transporter.sendMail({
            from: `"Локвен" <${process.env.SMTP_FROM || 'noreply@lokven.ru'}>`,
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
    async sendListingCreatedEmail(email, listingTitle, listingId) {
        await this.transporter.sendMail({
            from: `"Локвен" <${process.env.SMTP_FROM || 'noreply@lokven.ru'}>`,
            to: email,
            subject: 'Ваше объявление создано!',
            html: `
        <h1>Объявление "${listingTitle}" создано!</h1>
        <p>Оно будет опубликовано после проверки модератором.</p>
        <a href="${process.env.FRONTEND_URL || 'https://lokven-frontend.onrender.com'}/listings/${listingId}">Посмотреть объявление</a>
      `,
        });
    }
    async sendListingModeratedEmail(email, listingTitle, status, note) {
        await this.transporter.sendMail({
            from: `"Локвен" <${process.env.SMTP_FROM || 'noreply@lokven.ru'}>`,
            to: email,
            subject: `Объявление "${listingTitle}" ${status === 'active' ? 'одобрено' : 'отклонено'}`,
            html: `
        <h1>Объявление "${listingTitle}" ${status === 'active' ? 'одобрено ✅' : 'отклонено ❌'}</h1>
        ${note ? `<p><strong>Причина:</strong> ${note}</p>` : ''}
        <a href="${process.env.FRONTEND_URL || 'https://lokven-frontend.onrender.com'}/listings">Перейти к объявлениям</a>
      `,
        });
    }
    async sendPasswordResetEmail(email, token) {
        await this.transporter.sendMail({
            from: `"Локвен" <${process.env.SMTP_FROM || 'noreply@lokven.ru'}>`,
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
    async sendOrderNotificationEmail(email, orderId, total) {
        await this.transporter.sendMail({
            from: `"Локвен" <${process.env.SMTP_FROM || 'noreply@lokven.ru'}>`,
            to: email,
            subject: 'Новый заказ на Локвен',
            html: `
        <h1>Новый заказ #${orderId}</h1>
        <p>Сумма заказа: ${total.toLocaleString('ru-RU')} ₽</p>
        <a href="${process.env.FRONTEND_URL || 'https://lokven-frontend.onrender.com'}/profile/orders">Посмотреть заказы</a>
      `,
        });
    }
    async sendReviewNotificationEmail(email, reviewerName, rating) {
        const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
        await this.transporter.sendMail({
            from: `"Локвен" <${process.env.SMTP_FROM || 'noreply@lokven.ru'}>`,
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
};
exports.MailService = MailService;
exports.MailService = MailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], MailService);
//# sourceMappingURL=mail.service.js.map