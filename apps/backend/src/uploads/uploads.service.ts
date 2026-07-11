import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class UploadsService {
  private readonly logger = new Logger(UploadsService.name);

  constructor() {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    this.logger.log(`☁️ Cloudinary настройка: cloud_name=${cloudName}, api_key=${apiKey ? '***' : 'не задан'}`);

    if (!cloudName || !apiKey || !apiSecret) {
      this.logger.error('❌ Cloudinary переменные не заданы!');
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });
  }

  async uploadFile(file: Express.Multer.File, folder: string = 'listings'): Promise<string> {
    this.logger.log(`📤 Загрузка файла: ${file.originalname}, размер: ${file.size}, папка: ${folder}`);

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { 
          folder,
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) {
            this.logger.error('❌ Cloudinary ошибка:', error);
            reject(new BadRequestException('Ошибка загрузки в Cloudinary: ' + error.message));
          } else {
            this.logger.log(`✅ Файл загружен: ${result.secure_url}`);
            resolve(result.secure_url);
          }
        }
      );
      const readable = Readable.from(file.buffer);
      readable.pipe(uploadStream);
    });
  }

  async uploadMultiple(files: Express.Multer.File[], folder: string = 'listings'): Promise<string[]> {
    this.logger.log(`📤 Загрузка ${files.length} файлов в папку ${folder}`);
    const urls = [];
    for (const file of files) {
      const url = await this.uploadFile(file, folder);
      urls.push(url);
    }
    this.logger.log(`✅ Загружено ${urls.length} файлов`);
    return urls;
  }

  async deleteFile(url: string): Promise<void> {
    try {
      const parts = url.split('/');
      const filename = parts[parts.length - 1];
      const publicId = filename.split('.')[0];
      const folder = url.includes('/listings/') ? 'listings' : 'avatars';
      
      this.logger.log(`🗑️ Удаление файла: ${folder}/${publicId}`);
      await cloudinary.uploader.destroy(`${folder}/${publicId}`);
      this.logger.log(`✅ Файл удалён: ${folder}/${publicId}`);
    } catch (error) {
      this.logger.error('❌ Ошибка удаления из Cloudinary:', error);
    }
  }
}