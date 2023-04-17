import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTipoProductoDto } from './dto/create-tipo-producto.dto';
import { UpdateTipoProductoDto } from './dto/update-tipo-producto.dto';
import { EntityManager } from 'typeorm';
import { ResultSetHeader } from 'mysql2';

@Injectable()
export class TipoProductosService {
  constructor(private readonly entityManager: EntityManager) {}

  async create(dto: CreateTipoProductoDto) {
    try {
      const result: ResultSetHeader = await this.entityManager.query(
        'INSERT INTO tipo_productos (descripcion) VALUES (?)',
        [dto.description],
      );

      return await this.findOne(result.insertId);
    } catch (error) {
      console.log(error);
    }
  }

  async findAll(q: string) {
    try {
      const result: ResultSetHeader = await this.entityManager.query(
        'SELECT id, descripcion as description FROM tipo_productos WHERE descripcion like ?',
        [`%${q}%`],
      );

      return result;
    } catch (e) {
      throw new HttpException(
        'No aceptamos datos nulos',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOne(id: number) {
    if (!id) {
      return null;
    }

    try {
      const result: ResultSetHeader = await this.entityManager.query(
        'SELECT descripcion from tipo_productos WHERE id = ?',
        [id],
      );

      return result[0];
    } catch (error) {
      console.log(error);
    }
  }

  async update(id: number, dto: UpdateTipoProductoDto) {
    try {
      const result: ResultSetHeader = await this.entityManager.query(
        'UPDATE tipo_productos SET descripcion=? WHERE id=?',
        [dto.description, id],
      );

      if (result.affectedRows === 1) {
        return {
          ok: 200,
          message: 'Actualizado con éxito.',
        };
      }
      throw new HttpException(
        'No se pudo actualizar el tipo de producto.',
        HttpStatus.BAD_REQUEST,
      );
    } catch (error) {
      throw new HttpException(
        'No se pudo actualizar el tipo de producto.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: number) {
    try {
      const result: ResultSetHeader = await this.entityManager.query(
        'DELETE FROM tipo_productos WHERE id = ?',
        [id],
      );

      if (result.affectedRows === 1) {
        return {
          ok: 200,
          message: 'Actualizado con éxito.',
        };
      }
      throw new HttpException(
        'No se pudo eliminar el tipo de producto.',
        HttpStatus.BAD_REQUEST,
      );
    } catch (error) {
      throw new HttpException(
        'No se pudo eliminar el tipo de producto.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
