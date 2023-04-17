import { IsDateString, IsNumber, IsString } from 'class-validator';

export class CreateVentaDto {
  @IsNumber()
  usuarios_id: number;

  @IsNumber()
  monto: number;

  @IsNumber()
  estado: number;

  @IsString()
  id_venta_paypal: string;
}
