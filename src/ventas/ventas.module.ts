import { Module } from '@nestjs/common';
import { VentasService } from './ventas.service';
import { VentasController } from './ventas.controller';

@Module({
  controllers: [VentasController],
  providers: [VentasService]
})
export class VentasModule {}
