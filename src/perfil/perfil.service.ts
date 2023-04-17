import { HttpException, Injectable } from '@nestjs/common';
import { CreatePerfilDto } from './dto/create-perfil.dto';
import { UpdatePerfilDto } from './dto/update-perfil.dto';
import { EntityManager } from 'typeorm';

@Injectable()
export class PerfilService {
  constructor(private readonly entityManager: EntityManager) {}

  async create(dto: CreatePerfilDto) {
    try {
      await this.entityManager.query(
        'call InsertarPerfil(?,?,?,?,?,?,?,?,?,?)',
        [
          dto.userId,
          dto.nombre,
          dto.edad,
          dto.sexo,
          dto.cedula,
          dto.fecha_nacimiento,
          dto.telefono,
          dto.email,
          dto.tipo_sangres,
          dto.encasodeemergencia,
        ],
      );
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }

  findAll() {
    return `This action returns all perfil`;
  }

  async findOne(id: number) {
    try {
      const result = await this.entityManager.query(
        'call  getPerfilUsuariosId(?)',
        [id],
      );

      if (result.length > 0) {
        return result.find((e: any) => e !== undefined)[0] || null;
      }
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }

  async update(id: number, dto: UpdatePerfilDto) {
    const result = await this.entityManager.query(
      'UPDATE perfil SET nombre = ?, edad =?, sexo=?, cedula =?, fecha_nacimiento =?, telefono =?, email=?, tipo_sangres =?, encasodeemergencia =? WHERE usuarios_id =?',
      [
        dto.nombre,
        dto.edad,
        dto.sexo,
        dto.cedula,
        dto.fecha_nacimiento,
        dto.telefono,
        dto.email,
        dto.tipo_sangres,
        dto.encasodeemergencia,
      ],
    );

    console.log(result);
  }

  remove(id: number) {
    return `This action removes a #${id} perfil`;
  }
}
