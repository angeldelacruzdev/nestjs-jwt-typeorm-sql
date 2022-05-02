import { Public } from './../common/decorator/public.decorator';
import { JwtAuthGuard } from './../common/guards/jwt-auth.guard';
import { LocalAuthGuard } from './../common/guards/local-auth.guard';
import { AuthService } from './auth.service';
import { UsersService } from './../users/users.service';
import { Register } from './../inferfaces/register.interface';
import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  Get,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller({
  path: 'auth',
  version: '1.0',
})
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
  @Post('register')
  async register(@Body() body: Register) {
    return await this.usersService.register(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
