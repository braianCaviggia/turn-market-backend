import {
  IsNumber,
  IsDateString,
  IsString,
  IsOptional,
  IsIn,
} from 'class-validator';

export class CreateTurnoDto {
  @IsNumber()
  clienteId!: number;

  @IsNumber()
  profesionalId!: number;

  @IsDateString()
  fecha!: string;

  @IsString()
  hora!: string;

  @IsOptional()
  @IsString()
  @IsIn(['pendiente', 'confirmado', 'cancelado'])
  estado?: string;

  @IsOptional()
  @IsString()
  observaciones?: string;
}