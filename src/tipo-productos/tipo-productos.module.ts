import { Module } from '@nestjs/common';
import { TipoProductosService } from './tipo-productos.service';
import { TipoProductosController } from './tipo-productos.controller';

@Module({
  controllers: [TipoProductosController],
  providers: [TipoProductosService]
})
export class TipoProductosModule {}
