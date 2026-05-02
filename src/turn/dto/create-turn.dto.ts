import {
  IsNumber,
  IsDateString,
  IsString,
  IsOptional,
  IsIn,
  IsISO8601,
} from 'class-validator';

export class CreateTurnDto {
  @IsNumber()
  clienteId!: number;

  @IsNumber()
  profesionalId!: number;

  @IsDateString()
  fecha_hora!: string;

  @IsOptional()
  @IsString()
  @IsIn(['pendiente', 'confirmado', 'cancelado'])
  estado?: string;

  @IsOptional()
  @IsString()
  motivo?: string;
}