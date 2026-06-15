import { Module } from '@nestjs/common';
import { DrizzleModule } from './drizzle.module';

@Module({
  imports: [DrizzleModule],
})
export class DatabaseModule {}
