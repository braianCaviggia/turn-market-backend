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
  profesion!: string;

  
  @Type(() => Number)
  @IsNumber()
  precio_min!: number;

  
  @Type(() => Number)
  @IsNumber()
  precio_max!: number;

  @IsString()
  telefono!: string;
}