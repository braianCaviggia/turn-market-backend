import {
  IsString,
  IsEmail,
  MinLength,
  IsOptional,
} from 'class-validator';

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

  @IsOptional()
  @IsString()
  telefono?: string;
}
