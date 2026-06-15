import { ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { HashService } from '../common/hash.service';
import { UsersService } from './../users/users.service';
import { CreateUserDto } from './../users/dto/create-user.dto';
import { AuthDto } from './../dto/auth.dto';
import { Tokens } from './../types';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private jwtService: JwtService,
    private hashService: HashService,
  ) {}

  async login(dto: AuthDto): Promise<Tokens> {
    const user = await this.userService.findOneByEmail(dto.email);
    if (!user) throw new ForbiddenException('Access Denied.');

    const passwordMatches = await this.hashService.compare(dto.password, user.password);
    if (!passwordMatches) throw new ForbiddenException('Access Denied.');

    const tokens = await this.getTokens(user.id, user.email);
    await this.userService.update(user.id, {
      hashdRt: await this.hashData(tokens.refresh_token),
    });
    return tokens;
  }

  async logout(userId: number) {
    await this.userService.update(userId, { hashdRt: null });
  }

  async refreshTokens(userId: number, rt: string) {
    const user = await this.userService.findOne(userId);
    if (!user || !user.hashdRt) throw new ForbiddenException('Access Denied.');

    const rtMatches = await this.hashService.compare(rt, user.hashdRt);
    if (!rtMatches) throw new ForbiddenException('Access Denied.');

    const tokens = await this.getTokens(user.id, user.email);
    await this.userService.update(user.id, {
      hashdRt: await this.hashData(tokens.refresh_token),
    });
    return tokens;
  }

  async register(dto: CreateUserDto): Promise<Tokens> {
    const existing = await this.userService.findOneByEmail(dto.email);
    if (existing) {
      throw new ConflictException('El email ya está registrado.');
    }

    const created = await this.userService.create(dto);

    const tokens = await this.getTokens(created.id, created.email);
    await this.userService.update(created.id, {
      hashdRt: await this.hashData(tokens.refresh_token),
    });
    return tokens;
  }

  async getTokens(userId: number, email: string) {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email },
        {
          secret: process.env.JWT_SECRET,
          expiresIn: '24h',
        },
      ),
      this.jwtService.signAsync(
        { sub: userId, email },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: '30d',
        },
      ),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async hashData(data: string) {
    return this.hashService.hash(data);
  }
}
