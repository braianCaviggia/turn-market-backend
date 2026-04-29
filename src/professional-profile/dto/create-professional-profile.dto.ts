
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
export class CreateProfessionalProfileDto {
    @IsNotEmpty()
    userId!: number;

    @IsNotEmpty()
    profesion!: string;

    @IsNumber()
    precio_min!: number;

    @IsNumber()
    precio_max!: number;

    @IsOptional()
    descripcion?: string;
}
