import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {

  @IsOptional()
  @IsString()
  nombre?: string

  @IsOptional()
  @IsString()
  apellido?: string

  @IsOptional()
  @IsEmail()
  email?: string

  @IsOptional()
  @IsString()
  telefono?: string
}
