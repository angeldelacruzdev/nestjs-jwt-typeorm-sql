import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'Juan Pérez', description: 'Nombre del usuario' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'Juan Pérez García', description: 'Nombre completo' })
  @IsString()
  @IsOptional()
  full_name?: string;

  @ApiProperty({ example: 'juan@ejemplo.com', description: 'Correo electrónico' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'miClave123', description: 'Contraseña (mín. 8 caracteres)' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
