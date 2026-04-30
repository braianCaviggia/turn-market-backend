
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
export class CreateProfessionalProfileDto {
    @IsNotEmpty()
    userId!: number;

    @IsNotEmpty()
    profesion!: string;

    @IsNumber()
    @IsNotEmpty()
    precio_min!: number;

    @IsNumber()
    @IsNotEmpty()
    precio_max!: number;

    // @IsOptional()
    // descripcion?: string;
}
