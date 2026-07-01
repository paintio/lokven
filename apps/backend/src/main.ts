import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // =========================
  // CORS (ВАЖНО ДЛЯ COOKIES)
  // =========================
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://lokven.onrender.com',
    ],
    credentials: true,
  });

  // =========================
  // COOKIES SUPPORT (КРИТИЧНО)
  // =========================
  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // =========================
  // STATIC FILES
  // =========================
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });

  const port = process.env.PORT || 3001;

  await app.listen(port);

  console.log(`Lokven Backend running on port ${port}`);
  console.log(`Uploads: ${join(process.cwd(), 'uploads')}`);
}

bootstrap();