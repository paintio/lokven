import { Controller, Post, Body, Req } from '@nestjs/common';
import { AdminUsbService } from './admin-usb.service';

@Controller('admin-usb')
export class AdminUsbController {
  constructor(private service: AdminUsbService) {}

  @Post('verify')
  verify(
    @Body() body: { token: string; deviceId: string },
    @Req() req,
  ) {
    return this.service.verifyUsbToken(
      body.token,
      body.deviceId,
      req.ip,
    );
  }

  @Post('create')
  create() {
    return this.service.createUsbToken();
  }
}