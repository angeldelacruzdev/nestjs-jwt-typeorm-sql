import { IsString } from 'class-validator';

export class CreateTipoProductoDto {
  @IsString()
  description: string;
}
