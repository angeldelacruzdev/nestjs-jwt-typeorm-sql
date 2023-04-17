import { Module } from '@nestjs/common';
import { PaypalController } from './paypal.controller';
import { PaypalService } from './paypal.service';

@Module({
  controllers: [PaypalController],
  providers: [PaypalService],
  exports: [PaypalService],
})
export class PayPalModule {}
