import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'https://lokven.onrender.com',
    'https://lokven-frontend.onrender.com',  // 👈 ДОБАВЬТЕ ЭТОТ URL
    /\.onrender\.com$/,  // 👈 ИЛИ РАЗРЕШИТЕ ВСЕ ПОДДОМЕНЫ onrender.com
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Cookie'],
});

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });

  const port = process.env.PORT || 5000;

  await app.listen(port);

  console.log(`Lokven Backend running on port ${port}`);
  console.log(`Uploads: ${join(process.cwd(), 'uploads')}`);
}

bootstrap();