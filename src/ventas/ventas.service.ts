import { Injectable } from '@nestjs/common';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { EntityManager } from 'typeorm';

@Injectable()
export class VentasService {
  constructor(private readonly entityManager: EntityManager) {}

  async create(dto: CreateVentaDto) {
    const result = await this.entityManager.query(
      'call InsertarVentas(?,?,?)',
      [dto.usuarios_id, dto.monto, dto.id_venta_paypal],
    );

    console.log(result);
  }

  findAll() {
    return `This action returns all ventas`;
  }

  findOne(id: number) {
    return `This action returns a #${id} venta`;
  }

  update(id: number, updateVentaDto: UpdateVentaDto) {
    return `This action updates a #${id} venta`;
  }

  remove(id: number) {
    return `This action removes a #${id} venta`;
  }
}
