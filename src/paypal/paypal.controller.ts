import { Body, Controller, Get, Post } from '@nestjs/common';
import { PaypalService } from './paypal.service';
import { Public } from './../common/decorator';

@Controller({
  path: 'paypal',
  version: '1.0',
})
export class PaypalController {
  constructor(private readonly paypalService: PaypalService) {}

  @Public()
  @Post('createOrder')
  async createOrder(@Body() dto: { amount: string; description: string }) {
    return await this.paypalService.createOrder(dto);
  }

  @Public()
  @Post('saveOrder')
  async saveOrder(@Body() dto: { amount: string; description: string }) {
    return await this.paypalService.createOrder(dto);
  }

  @Post('returnUrl')
  async returnUrl(@Body() dto: any) {
    console.log(dto);
  }
}
