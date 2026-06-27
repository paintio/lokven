import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadsService {
  private readonly logger = new Logger(UploadsService.name);
  private readonly uploadDir = path.join(process.cwd(), 'uploads');

  constructor() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
      this.logger.log(`Создана папка для загрузок: ${this.uploadDir}`);
    }
  }

  async saveFile(file: any): Promise<string> {
    this.logger.log(`Получен файл: ${file.originalname}, тип: ${file.mimetype}, размер: ${file.size}`);

    if (!file) {
      throw new BadRequestException('Файл не загружен');
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('Допустимы только изображения (JPEG, PNG, GIF, WEBP, SVG)');
    }

    if (file.size > 10 * 1024 * 1024) {
      throw new BadRequestException('Размер файла не должен превышать 10MB');
    }

    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}${ext}`;
    const filepath = path.join(this.uploadDir, filename);

    fs.writeFileSync(filepath, file.buffer);
    this.logger.log(`Файл сохранен: ${filepath}`);

    const url = `/uploads/${filename}`;
    return url;
  }

  async deleteFile(filename: string): Promise<void> {
    const filepath = path.join(this.uploadDir, path.basename(filename));
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      this.logger.log(`Файл удален: ${filepath}`);
    }
  }

  async saveMultiple(files: any[]): Promise<string[]> {
    const urls = [];
    for (const file of files) {
      const url = await this.saveFile(file);
      urls.push(url);
    }
    return urls;
  }
}
