import { Module } from '@nestjs/common';
import { CommonXService } from './common-x.service';

@Module({
  providers: [CommonXService],
  exports: [CommonXService],
})
export class CommonXModule {}
