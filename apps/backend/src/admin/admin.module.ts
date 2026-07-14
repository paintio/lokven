import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminAccessGuard } from './admin-access.guard';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [AdminController],
  providers: [PrismaService, AdminAccessGuard],
})
export class AdminModule {}
