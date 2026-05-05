import {
  IsNumber,
  IsDateString,
  IsString,
  IsOptional,
  IsIn,
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