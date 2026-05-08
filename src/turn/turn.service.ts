import { Injectable } from '@nestjs/common';
import { CreateTurnDto } from './dto/create-turn.dto';
import { UpdateTurnDto } from './dto/update-turn.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Turn } from './entities/turn.entity';
import { Repository } from 'typeorm';
import { ProfessionalProfile } from '../professional-profile/entities/professional-profile.entity';
import { User } from '../user/entities/user.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

@Injectable()
export class TurnService {

  constructor(
    @InjectRepository(Turn)
    private turnRepository: Repository<Turn>,

    @InjectRepository(ProfessionalProfile)
    private professionalProfileRepository: Repository<ProfessionalProfile>,

    @InjectRepository(User)
    private userRepository: Repository<User>
  ) { }
  async create(createTurnDto: CreateTurnDto): Promise<Turn> {
  
    //validar si existe el profesional y cliente

    const profesional = await this.professionalProfileRepository.findOne({
      where: { id: createTurnDto.profesionalId },
      relations: ['user']
    })

    if (!profesional) {
      throw new NotFoundException('Profesional no encontrado');
    }

     if (!profesional.user) {
    throw new BadRequestException('Profesional inválido');
  }

    const cliente = await this.userRepository.findOne({
      where: { id: createTurnDto.clienteId }
    })

    if (!cliente) {
      throw new NotFoundException("Cliente no encontrado")
    }

    //validar si la fecha esta bien y es actual

   const fechaHora = new Date(createTurnDto.fecha_hora);

  if (isNaN(fechaHora.getTime())) {
    throw new BadRequestException('Fecha u hora inválida'); //verifica que no sea una fecha que no exista
  }
    const fechaActual = new Date()

    if (fechaHora < fechaActual) {
      throw new BadRequestException("La fecha elegida no puede ser en el pasado");
    }

    //validar turno duplicado

    const turnoExistente = await this.turnRepository.findOne({
      where: {
        profesional: { id: createTurnDto.profesionalId },
        fecha_hora: fechaHora
      }
    })

    if (turnoExistente) {
      throw new BadRequestException("El profesional ya tiene un turno programado para esa fecha y hora");
    }
 
    
    const turn = this.turnRepository.create({
      profesional: profesional.user,
      cliente,
      fecha_hora: fechaHora,
      estado: "pendiente",
      motivo: createTurnDto.motivo || ""
    })
    return this.turnRepository.save(turn);
  }

  //funcion para traer los turnos de un cliente especifico, se le pasa el id del cliente y devuelve un array con los turnos asociados a ese cliente

  async getTurnClient(clienteId: number) {
    
    return this.turnRepository.find( {
      where:{ cliente: {id : clienteId}},

      relations: ["cliente", "profesional"]
    })}

  
  async getTurnProfessional(profesionalId: number) {
    return this.turnRepository.find( {
      where:{ profesional: {id : profesionalId}},
      relations: ["cliente", "profesional"]
    })}


  find() {
    return this.turnRepository.find({
      relations: ['cliente', 'profesional']
    });
  }

  findOne(id: number) {
      return this.turnRepository.findOne({
      where: { id },
      relations: ['cliente', 'profesional']
    });
  }

  // update(id: number, updateTurnDto: UpdateTurnDto) {
  //   return `This action updates a #${id} turn`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} turn`;
  // }
}
