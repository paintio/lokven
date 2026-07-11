import { Injectable, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class UploadsService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadFile(file: Express.Multer.File, folder: string = 'listings'): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { 
          folder,
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary error:', error);
            reject(new BadRequestException('Ошибка загрузки в Cloudinary'));
          } else {
            resolve(result.secure_url);
          }
        }
      );
      const readable = Readable.from(file.buffer);
      readable.pipe(uploadStream);
    });
  }

  async uploadMultiple(files: Express.Multer.File[], folder: string = 'listings'): Promise<string[]> {
    const urls = [];
    for (const file of files) {
      const url = await this.uploadFile(file, folder);
      urls.push(url);
    }
    return urls;
  }

  async deleteFile(url: string): Promise<void> {
    try {
      // Извлекаем public_id из URL
      const parts = url.split('/');
      const filename = parts[parts.length - 1];
      const publicId = filename.split('.')[0];
      
      // Определяем папку по URL
      const folder = url.includes('/listings/') ? 'listings' : 'avatars';
      
      await cloudinary.uploader.destroy(`${folder}/${publicId}`);
    } catch (error) {
      console.error('Error deleting from Cloudinary:', error);
    }
  }
}