import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CrearProfesionalDto {
  @IsNumber()
  usuarioId: number;

  @IsString()
  @IsNotEmpty()
  especialidad: string;
}