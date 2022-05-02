import { RtStrategiest } from './../strategies/rt.strategies';
import { AtStrategiest } from './../strategies/at.strategies';

import { jwtConstants } from './constants';
import { JwtModule, JwtService } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { UsersModule } from './../users/users.module';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';

@Module({
  controllers: [AuthController],
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [AuthService, AtStrategiest, RtStrategiest],
  exports: [AuthService],
})
export class AuthModule {}
