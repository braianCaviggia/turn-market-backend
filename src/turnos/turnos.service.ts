import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Turno } from './turno.entity';
import { CrearTurnoDto } from './dto/crear-turno.dto';
import { ActualizarEstadoDto } from './dto/actualizar-estado.dto';

@Injectable()
export class TurnosService {
  constructor(
    @InjectRepository(Turno)
    private turnosRepository: Repository<Turno>,
  ) {}

  async findAll(): Promise<Turno[]> {
    return this.turnosRepository.find({
      relations: ['profesional', 'profesional.usuario', 'cliente'],
    });
  }

  async findByProfesional(profesionalId: number): Promise<Turno[]> {
    return this.turnosRepository.find({
      where: { profesional: { id: profesionalId } },
      relations: ['profesional', 'profesional.usuario', 'cliente'],
    });
  }

  async findOne(id: number): Promise<Turno> {
    const turno = await this.turnosRepository.findOne({
      where: { id },
      relations: ['profesional', 'profesional.usuario', 'cliente'],
    });
    if (!turno) throw new NotFoundException(`Turno ${id} no encontrado`);
    return turno;
  }

  async crear(dto: CrearTurnoDto): Promise<Turno> {
    const turno = this.turnosRepository.create({
      profesional: { id: dto.profesionalId },
      cliente: { id: dto.clienteId },
      fecha: dto.fecha,
      horario: dto.horario,
      mensaje: dto.mensaje,
    });
    return this.turnosRepository.save(turno);
  }

  async actualizarEstado(id: number, dto: ActualizarEstadoDto): Promise<Turno> {
    const turno = await this.findOne(id);
    turno.estado = dto.estado;
    return this.turnosRepository.save(turno);
  }

  async eliminar(id: number): Promise<void> {
    const turno = await this.findOne(id);
    await this.turnosRepository.remove(turno);
  }
}