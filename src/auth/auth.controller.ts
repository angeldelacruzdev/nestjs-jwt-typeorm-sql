import { GetCurrentUser } from './../common/decorator/get-current-user.decorator';
import { RtGuard } from './../common/guards/rt.guard';
import { GetCurrentUserId } from './../common/decorator/get-current-user-id.decorator';
import { Tokens } from './../types/tokens.type';
import { CreateUserDto } from './../users/dto/create-user.dto';
import { AuthDto } from './../dto/auth.dto';
import { Public } from './../common/decorator/public.decorator';
import { AuthService } from './auth.service';

import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  Get,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';

@Controller({
  path: 'auth',
  version: '1.0.2',
})
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: AuthDto) {
    return await this.authService.login(dto);
  }

  @Public()
  @Get('/register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: CreateUserDto): Promise<Tokens> {
    return await this.authService.register(dto);
  }

  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  async logout(@GetCurrentUserId() userId: number) {
    return await this.authService.logout(userId);
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @GetCurrentUser('refreshToken') refreshToken: string,
    @GetCurrentUserId() userId: number,
  ) {
    return await this.authService.refreshTokens(userId, refreshToken);
  }
}
