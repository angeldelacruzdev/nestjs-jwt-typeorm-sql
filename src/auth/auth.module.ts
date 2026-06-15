import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AtStrategiest } from './../strategies/at.strategies';
import { RtStrategiest } from './../strategies/rt.strategies';
import { UsersModule } from './../users/users.module';

@Module({
  controllers: [AuthController],
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({}),
  ],
  providers: [AuthService, AtStrategiest, RtStrategiest],
  exports: [AuthService],
})
export class AuthModule {}
