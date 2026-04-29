import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profesional } from './profesional.entity';
import { CrearProfesionalDto } from './dto/crear-profesional.dto';
import { ActualizarProfesionalDto } from './dto/actualizar-profesional.dto';

@Injectable()
export class ProfesionalesService {
  constructor(
    @InjectRepository(Profesional)
    private profesionalesRepository: Repository<Profesional>,
  ) {}

  async findAll(): Promise<Profesional[]> {
    return this.profesionalesRepository.find({
      relations: ['usuario'],
    });
  }

  async findOne(id: number): Promise<Profesional> {
    const profesional = await this.profesionalesRepository.findOne({
      where: { id },
      relations: ['usuario', 'turnos'],
    });
    if (!profesional) throw new NotFoundException(`Profesional ${id} no encontrado`);
    return profesional;
  }

  async crear(dto: CrearProfesionalDto): Promise<Profesional> {
    const profesional = this.profesionalesRepository.create({
      usuario: { id: dto.usuarioId },
      especialidad: dto.especialidad,
    });
    return this.profesionalesRepository.save(profesional);
  }

  async actualizar(id: number, dto: ActualizarProfesionalDto): Promise<Profesional> {
    const profesional = await this.findOne(id);
    Object.assign(profesional, dto);
    return this.profesionalesRepository.save(profesional);
  }

  async eliminar(id: number): Promise<void> {
    const profesional = await this.findOne(id);
    await this.profesionalesRepository.remove(profesional);
  }
}