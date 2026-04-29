import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CrearTurnoDto {
  @IsNumber()
  profesionalId: number;

  @IsNumber()
  clienteId: number;

  @IsString()
  @IsNotEmpty()
  fecha: string;

  @IsString()
  @IsNotEmpty()
  horario: string;

  @IsString()
  @IsOptional()
  mensaje?: string;
}