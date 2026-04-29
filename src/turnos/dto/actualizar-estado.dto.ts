import { IsIn, IsNotEmpty } from 'class-validator';

export class ActualizarEstadoDto {
  @IsIn(['pendiente', 'confirmado', 'rechazado'])
  @IsNotEmpty()
  estado: string;
}