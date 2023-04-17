import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { TipoProductosService } from './tipo-productos.service';
import { CreateTipoProductoDto } from './dto/create-tipo-producto.dto';
import { UpdateTipoProductoDto } from './dto/update-tipo-producto.dto';

@Controller('tipo-productos')
export class TipoProductosController {
  constructor(private readonly tipoProductosService: TipoProductosService) {}

  @Post()
  async create(@Body() createTipoProductoDto: CreateTipoProductoDto) {
    return await this.tipoProductosService.create(createTipoProductoDto);
  }

  @Get()
  findAll(@Query() query: { q: string }) {
    return this.tipoProductosService.findAll(query.q);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tipoProductosService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateTipoProductoDto: UpdateTipoProductoDto,
  ) {
    return this.tipoProductosService.update(+id, updateTipoProductoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tipoProductosService.remove(+id);
  }
}
