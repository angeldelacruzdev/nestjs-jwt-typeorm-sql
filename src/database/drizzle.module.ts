import { Module } from '@nestjs/common';
import { drizzleProvider } from './drizzle.provider';

@Module({
  providers: [drizzleProvider],
  exports: [drizzleProvider],
})
export class DrizzleModule {}
