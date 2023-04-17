import { Injectable } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { EntityManager } from 'typeorm';

@Injectable()
export class ProductosService {
  constructor(private readonly entityManager: EntityManager) {}

  async create(dto: CreateProductoDto) {
    try {
      await this.entityManager.query('call InsertarProductos(?,?,?,?,?)', [
        0,
        dto.imagen,
        dto.nombre,
        dto.description,
        dto.precio,
      ]);

      return dto;
    } catch (error) {
      console.log(error);
    }
  }

  async findAll() {
    const result = await this.entityManager.query('call getProductosAll()');

    if (result.length > 0) {
      return result.find((e: any) => e !== undefined) || null;
    }

    return null;
  }

  async findOne(id: number) {
    const result = await this.entityManager.query('call getProductosId(?)', [
      id,
    ]);

    if (result.length > 0) {
      return result.find((e: any) => e !== undefined)[0] || null;
    }

    return null;
  }

  async update(id: number, dto: UpdateProductoDto) {
    try {
      await this.entityManager.query('call InsertarProductos(?,?,?,?)', [
        id,
        dto.nombre,
        dto.description,
        dto.precio,
      ]);

      return dto;
    } catch (error) {
      console.log(error);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} producto`;
  }
}
