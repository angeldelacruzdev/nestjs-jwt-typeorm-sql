import { CreateUserDto } from './../users/dto/create-user.dto';
import { UsersService } from './../users/users.service';
import { ForbiddenException, HttpException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Tokens } from './../types';
import { AuthDto } from './../dto/auth.dto';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private jwtService: JwtService,
  ) {}

  //iniciar sesión
  async login(dto: AuthDto) {
    const user = await this.userService.findOneByEmail(dto.email);

    if (!user) throw new ForbiddenException('Access Denied.');

    const passwordMatches = await bcrypt.compare(dto.password, user.contrasena);

    if (!passwordMatches) throw new ForbiddenException('Access Denied.');

    const tokens = await this.getTokens(user.id, user.email);

    return { name: user.nombre, id: user.id, tipo: user.tipo, ...tokens };
  }

  //Cerrar sesión
  async logout(userId: number) {
    await this.userService.update(userId, { hashdRt: null });
  }

  //Refrescar sesión
  async refreshTokens(userId: number, rt: string) {
    const user = await this.userService.findOne(userId);

    if (!user || !user.hashdRt) throw new ForbiddenException('Access Denied.');

    const rtMatches = await bcrypt.compare(rt, user.hashdRt);

    if (!rtMatches) throw new ForbiddenException('Access Denied.');

    const tokens = await this.getTokens(user.id, user.email);

    return { name: user.nombre, id: user.id, tipo: user.tipo, ...tokens };
  }

  //Registro de usuario
  async register(dto: CreateUserDto) {
    try {
      const user = await this.userService.findOneByEmail(dto.email);

      if (user?.email === dto.email) {
        return new HttpException('Ya existe esta cuenta.', 401);
      }

      await this.userService.create(dto);

      const tokens = await this.getTokens(user.id, user.email);

      return tokens;
    } catch (error) {}
  }

  //Generar tokens de acceso y de refrescar.
  async getTokens(userId: number, email: string) {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: 'at-secret',
          expiresIn: '24h',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: 'rt-secret',
          expiresIn: '30d',
        },
      ),
    ]);

    return {
      access_token: at,
    };
  }

  //Encriptación de la copntraseña
  async hashPassword(data: string) {
    return bcrypt.hash(data, 10);
  }
}
