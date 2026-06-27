import { Controller, Post, UseInterceptors, UploadedFiles, UploadedFile, Delete, Query, Logger } from '@nestjs/common';
import { FilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './uploads.service';

@Controller('uploads')
export class UploadsController {
  private readonly logger = new Logger(UploadsController.name);

  constructor(private uploadsService: UploadsService) {}

  @Post('single')
  @UseInterceptors(FileInterceptor('file'))
  async uploadSingle(@UploadedFile() file: any) {
    this.logger.log('Запрос на загрузку одного файла');
    const url = await this.uploadsService.saveFile(file);
    return { url };
  }

  @Post('multiple')
  @UseInterceptors(FilesInterceptor('files', 10))
  async uploadMultiple(@UploadedFiles() files: any[]) {
    this.logger.log(`Запрос на загрузку ${files?.length || 0} файлов`);
    if (!files || files.length === 0) {
      throw new Error('Файлы не переданы');
    }
    const urls = await this.uploadsService.saveMultiple(files);
    return { urls };
  }

  @Delete()
  async deleteFile(@Query('url') url: string) {
    this.logger.log(`Запрос на удаление файла: ${url}`);
    await this.uploadsService.deleteFile(url);
    return { success: true };
  }
}
