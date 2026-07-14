import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { ListingsModule } from './listings/listings.module';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { UploadsModule } from './uploads/uploads.module';
import { CmsModule } from './cms/cms.module';
import { MailModule } from './mail/mail.module';
import { ReviewsModule } from './reviews/reviews.module';
import { CategoriesModule } from './categories/categories.module'; // 👈 ДОБАВИТЬ

@Module({
  imports: [
    ListingsModule,
    AdminModule,
    AuthModule,
    UploadsModule,
    CmsModule,
    MailModule,
    ReviewsModule,
    CategoriesModule, // 👈 ДОБАВИТЬ
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
