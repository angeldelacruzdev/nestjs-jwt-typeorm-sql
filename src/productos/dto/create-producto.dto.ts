import { IsOptional, IsString } from 'class-validator';

export class CreateProductoDto {
  @IsOptional()
  imagen?: string;

  @IsString()
  nombre: string;

  @IsString()
  description: string;

  @IsString()
  precio: number;
}
