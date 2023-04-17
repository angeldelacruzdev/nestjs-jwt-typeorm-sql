import { HttpException, Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { Register } from './../inferfaces/register.interface';

import { EntityManager } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(private readonly entityManager: EntityManager) {}

  async create(dto: CreateUserDto) {
    const hash = await this.hashPassword(dto.password);
    dto.password = hash;

    let result = await this.entityManager.query(
      'call InsertarUsuarios(?,?,?,?,?)',
      [0, dto.nombre, dto.email, dto.password, 2],
    );

    return result;
  }

  async register(createUserDto: Register) {
    const hash = await this.hashPassword(createUserDto.password);
    createUserDto.password = hash;

    // return await this.usersRepository.save(createUserDto);
  }

  async findOneByEmail(email: string) {
    try {
      let result = await this.entityManager.query('call findByCuenta(?)', [
        email,
      ]);

      return result[0][0];
    } catch (error) {
      return new HttpException(`Error en el servidor: ${error.message}`, 401);
    }
  }

  async findMany() {
    const result = await this.entityManager.query('call getUsuariosAll()');

    if (result.length > 0) {
      return result.find((e: any) => e !== undefined) || [];
    }

    return [];
  }

  async findOne(id: number) {
    let result = await this.entityManager.query(
      `	SELECT
    a.id,
    a.nombre,
    a.email,
    a.contrasena,
    b.id as tipo,
    b.descripcion
  FROM
    usuarios a INNER JOIN tipo b ON a.tipo_id=b.id
    WHERE a.id =? AND a.estado=1;`,
      [id],
    );

    if (result.length > 0) {
      return result.find((e: any) => e !== undefined) || null;
    }

    return null;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    // return await this.usersRepository.update(id, updateUserDto);
  }

  async remove(id: number) {
    try {
      await this.entityManager.query('call BloquearUsuarios(?)', [id]);
      return {
        ok: 200,
        message: 'Eliminado con éxito.',
      };
    } catch (error) {}
  }

  async hashPassword(password: string) {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);
    return hash;
  }
}
