import { Controller, Post, Delete, UseInterceptors, UploadedFiles, UploadedFile, Query, UseGuards, BadRequestException } from '@nestjs/common';
import { FilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './uploads.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('uploads')
@UseGuards(JwtAuthGuard)
export class UploadsController {
  constructor(private uploadsService: UploadsService) {}

  @Post('multiple')
  @UseInterceptors(FilesInterceptor('files', 10))
  async uploadMultiple(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Файлы не загружены');
    }
    const urls = await this.uploadsService.uploadMultiple(files, 'listings');
    return { urls };
  }

  @Post('avatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Файл не загружен');
    }
    const url = await this.uploadsService.uploadFile(file, 'avatars');
    return { url };
  }

  @Delete()
  async deleteFile(@Query('url') url: string) {
    if (!url) {
      throw new BadRequestException('URL не указан');
    }
    await this.uploadsService.deleteFile(url);
    return { success: true };
  }
}