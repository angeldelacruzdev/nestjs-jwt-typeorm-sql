import { IsNumber, IsString } from 'class-validator';

export class CreatePerfilDto {
  @IsNumber()
  userId: number;

  @IsString()
  nombre: string;

  @IsNumber()
  edad: number;

  @IsString()
  sexo: string;

  @IsString()
  cedula: string;

  @IsString()
  fecha_nacimiento: string;

  @IsString()
  telefono: string;

  @IsString()
  email: string;

  @IsString()
  tipo_sangres: string;

  @IsString()
  encasodeemergencia: string;
}
