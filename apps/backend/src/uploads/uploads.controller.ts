import { Controller, Post, Delete, UseInterceptors, UploadedFiles, UploadedFile, Query, UseGuards, BadRequestException, Logger } from '@nestjs/common';
import { FilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './uploads.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('uploads')
@UseGuards(JwtAuthGuard)
export class UploadsController {
  private readonly logger = new Logger(UploadsController.name);

  constructor(private uploadsService: UploadsService) {}

  @Post('multiple')
  @UseInterceptors(FilesInterceptor('files', 10))
  async uploadMultiple(@UploadedFiles() files: Express.Multer.File[]) {
    this.logger.log(`📤 Получено файлов: ${files?.length || 0}`);
    
    if (!files || files.length === 0) {
      this.logger.error('❌ Файлы не загружены');
      throw new BadRequestException('Файлы не загружены');
    }

    // Логируем информацию о файлах
    files.forEach((file, index) => {
      this.logger.log(`📁 Файл ${index + 1}: ${file.originalname}, ${file.size} байт, ${file.mimetype}`);
    });

    try {
      const urls = await this.uploadsService.uploadMultiple(files, 'listings');
      this.logger.log(`✅ Загружено файлов: ${urls.length}`);
      return { urls };
    } catch (error) {
      this.logger.error('❌ Ошибка загрузки:', error);
      throw new BadRequestException('Ошибка загрузки файлов: ' + error.message);
    }
  }

  @Post('avatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(@UploadedFile() file: Express.Multer.File) {
    this.logger.log(`📤 Загрузка аватара: ${file?.originalname || 'нет файла'}`);
    
    if (!file) {
      this.logger.error('❌ Файл не загружен');
      throw new BadRequestException('Файл не загружен');
    }

    try {
      const url = await this.uploadsService.uploadFile(file, 'avatars');
      this.logger.log(`✅ Аватар загружен: ${url}`);
      return { url };
    } catch (error) {
      this.logger.error('❌ Ошибка загрузки аватара:', error);
      throw new BadRequestException('Ошибка загрузки аватара: ' + error.message);
    }
  }

  @Delete()
  async deleteFile(@Query('url') url: string) {
    this.logger.log(`🗑️ Удаление файла: ${url}`);
    
    if (!url) {
      this.logger.error('❌ URL не указан');
      throw new BadRequestException('URL не указан');
    }

    try {
      await this.uploadsService.deleteFile(url);
      this.logger.log(`✅ Файл удалён: ${url}`);
      return { success: true };
    } catch (error) {
      this.logger.error('❌ Ошибка удаления:', error);
      throw new BadRequestException('Ошибка удаления файла');
    }
  }
}