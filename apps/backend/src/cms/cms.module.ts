import { Module } from '@nestjs/common';
import { CmsController } from './cms.controller';
import { CmsService } from './cms.service';
import { AdminAccessGuard } from '../admin/admin-access.guard';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [CmsController],
  providers: [CmsService, PrismaService, AdminAccessGuard],
  exports: [CmsService],
})
export class CmsModule {}
