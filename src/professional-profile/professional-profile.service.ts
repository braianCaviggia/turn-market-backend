import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfessionalProfile } from './entities/professional-profile.entity';
import { Turn } from '../turn/entities/turn.entity';
import { CreateProfessionalProfileDto } from './dto/create-professional-profile.dto';
import { UpdateProfessionalProfileDto } from './dto/update-professional-profile.dto';

@Injectable()
export class ProfessionalProfileService {
  constructor(
    @InjectRepository(ProfessionalProfile)
    private profileRepository: Repository<ProfessionalProfile>,
    @InjectRepository(Turn)
    private turnRepository: Repository<Turn>,
  ) {}

  // Crear perfil profesional
  async create(dto: CreateProfessionalProfileDto): Promise<ProfessionalProfile> {
  const profile = new ProfessionalProfile();
  profile.user = { id: dto.userId } as any;
  profile.profesion = dto.profesion;
  profile.precio_min = dto.precio_min;
  profile.precio_max = dto.precio_max;
  profile.descripcion = dto.descripcion ?? '';
  return this.profileRepository.save(profile);
}

  // Traer todos los perfiles
  async findAll(): Promise<ProfessionalProfile[]> {
    return this.profileRepository.find({
      relations: ['user'],
    });
  }

  // Traer perfil por id de perfil
  async findOne(id: number): Promise<ProfessionalProfile> {
    const profile = await this.profileRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!profile) throw new NotFoundException(`Perfil ${id} no encontrado`);
    return profile;
  }

  // Traer perfil por userId — lo usa el panel para identificar al profesional
  async findByUserId(userId: number): Promise<ProfessionalProfile> {
    const profile = await this.profileRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });
    if (!profile) throw new NotFoundException(`Perfil del usuario ${userId} no encontrado`);
    return profile;
  }

  // Traer los turnos del profesional separados por estado — lo usa el PanelProfesional
  async findTurnosByUserId(userId: number) {
    const turnos = await this.turnRepository.find({
      where: { profesional: { id: userId } },
      relations: ['cliente', 'profesional'],
    });

    return {
      pendientes: turnos.filter(t => t.estado === 'pendiente'),
      confirmados: turnos.filter(t => t.estado === 'confirmado'),
      rechazados: turnos.filter(t => t.estado === 'rechazado'),
    };
  }

  // Actualizar estado de un turno — aceptar/rechazar/restaurar
  async actualizarEstadoTurno(turnoId: number, estado: string): Promise<Turn> {
    const turno = await this.turnRepository.findOne({
      where: { id: turnoId },
      relations: ['cliente', 'profesional'],
    });
    if (!turno) throw new NotFoundException(`Turno ${turnoId} no encontrado`);
    turno.estado = estado;
    return this.turnRepository.save(turno);
  }

  // Actualizar perfil
  async update(id: number, dto: UpdateProfessionalProfileDto): Promise<ProfessionalProfile> {
    const profile = await this.findOne(id);
    Object.assign(profile, dto);
    return this.profileRepository.save(profile);
  }

  // Eliminar perfil
  async remove(id: number): Promise<void> {
    const profile = await this.findOne(id);
    await this.profileRepository.remove(profile);
  }
}