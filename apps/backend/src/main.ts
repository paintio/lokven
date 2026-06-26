import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));
  
  // Статическая раздача из папки uploads (используем process.cwd())
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });
  
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Lokven Backend running on http://localhost:${port}`);
  console.log(`Static files from: ${join(process.cwd(), 'uploads')}`);
}
bootstrap();
