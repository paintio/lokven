import { Controller, Post, Get, Param } from '@nestjs/common';
import { AdminUsbService } from './admin-usb.service';

@Controller('admin-usb')
export class AdminUsbController {
  constructor(private service: AdminUsbService) {}

  @Post('create')
  create() {
    return this.service.createToken(7);
  }

  @Post('approve/:id')
  approve(@Param('id') id: string) {
    return this.service.approveToken(id);
  }

  @Get('list')
  list() {
    return this.service.listTokens();
  }
}