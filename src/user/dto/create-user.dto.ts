import { IsString, IsEmail, MinLength, IsOptional, IsNumber} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @IsString()
  nombre!: string;

  @IsString()
  apellido!: string;

  @IsEmail()
  email!: string;

  @MinLength(6)
  password!: string;

  @IsString()
  rol!: string;

  
  @IsString()
  @IsOptional()
  profesion?: string;

  
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  precio_min?: number;

  
  @Type(() => Number)
  @IsNumber()
  @IsOptional() 
  precio_max?: number;

  @IsString()
  @IsOptional() 
  direccion?: string;

  @IsString()
  telefono!: string;
}