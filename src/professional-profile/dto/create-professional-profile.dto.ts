
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProfessionalProfileDto {
  @IsNotEmpty()
  userId!: number;

  @IsNotEmpty()
  @IsString()
  profesion!: string;

  @IsNumber()
  precio_min!: number;

  @IsNumber()
  precio_max!: number;

  @IsOptional()
  @IsString()
  descripcion?: string;
}
