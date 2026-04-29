import { IsOptional, IsString } from 'class-validator';

export class ActualizarProfesionalDto {
  @IsString()
  @IsOptional()
  especialidad?: string;
}