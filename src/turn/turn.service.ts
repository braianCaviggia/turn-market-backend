import { Injectable } from '@nestjs/common';
import { CreateTurnDto } from './dto/create-turn.dto';
import { UpdateTurnDto } from './dto/update-turn.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Turn } from './entities/turn.entity';
import { Repository } from 'typeorm';
import { ProfessionalProfile } from '../professional-profile/entities/professional-profile.entity';
import { User } from '../user/entities/user.entity';
import { NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';

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
   const turnos = await this.turnRepository.find( {
      where:{ profesional: {id : profesionalId}},
      relations: ["cliente", "profesional"]
    })

     return {
      pendientes: turnos.filter(t => t.estado === 'pendiente'),
      confirmados: turnos.filter(t => t.estado === 'confirmado'),
      rechazados: turnos.filter(t => t.estado === 'rechazado'),
    };
  
  }

   async actualizarEstadoTurno(
    turnoId: number,
    estado: string,
    duracionEstimada?: number,
    bufferDescanso?: number,
    horaFin?: string,
  ): Promise<Turn> {
    const turno = await this.turnRepository.findOne({
      where: { id: turnoId },
      relations: ['cliente', 'profesional'],
    });
    if (!turno) throw new NotFoundException(`Turno ${turnoId} no encontrado`);

    // Si se está confirmando el turno y tenemos una hora de fin estimada,
    // validamos que no se superponga con otro turno ya confirmado del mismo profesional
    if (estado === 'confirmado' && horaFin) {
      await this.validarSolapamiento(turno, horaFin);
    }

    turno.estado = estado;
    if (duracionEstimada !== undefined) turno.duracionEstimada = duracionEstimada;
    if (bufferDescanso !== undefined) turno.bufferDescanso = bufferDescanso;
    if (horaFin !== undefined) turno.horaFin = horaFin;
    return this.turnRepository.save(turno);
  }

  // Combina la fecha de un turno (Date) con una hora "HH:MM" para obtener un Date completo
  private combinarFechaYHora(fecha: Date, horaStr: string): Date {
    const [h, m] = horaStr.split(':').map(Number);
    const resultado = new Date(fecha);
    resultado.setHours(h, m, 0, 0);
    return resultado;
  }

  // Verifica que el rango [inicio, horaFin) del turno a confirmar no se solape
  // con otro turno ya confirmado del mismo profesional, el mismo día
  private async validarSolapamiento(turno: Turn, horaFin: string): Promise<void> {
    const inicioNuevo = new Date(turno.fecha_hora);
    const finNuevo = this.combinarFechaYHora(turno.fecha_hora, horaFin);

    const inicioDia = new Date(turno.fecha_hora);
    inicioDia.setHours(0, 0, 0, 0);
    const finDia = new Date(inicioDia);
    finDia.setDate(finDia.getDate() + 1);

    const confirmadosDelProfesional = await this.turnRepository.find({
      where: {
        profesional: { id: turno.profesional.id },
        estado: 'confirmado',
      },
      relations: ['cliente', 'profesional'],
    });

    const conflicto = confirmadosDelProfesional.find((otro) => {
      if (otro.id === turno.id) return false;

      const inicioOtro = new Date(otro.fecha_hora);
      if (inicioOtro < inicioDia || inicioOtro >= finDia) return false; // distinto día

      // Si el otro turno no tiene horaFin guardada, lo tratamos como un instante puntual
      const finOtro = otro.horaFin
        ? this.combinarFechaYHora(otro.fecha_hora, otro.horaFin)
        : new Date(inicioOtro.getTime() + 1);

      // Dos rangos [inicioNuevo, finNuevo) y [inicioOtro, finOtro) se solapan si:
      return inicioNuevo < finOtro && inicioOtro < finNuevo;
    });

    if (conflicto) {
      const horaInicioConflicto = new Date(conflicto.fecha_hora).toLocaleTimeString('es-AR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      const horaFinConflicto = conflicto.horaFin || horaInicioConflicto;
      const nombreCliente = conflicto.cliente
        ? `${conflicto.cliente.nombre ?? ''} ${conflicto.cliente.apellido ?? ''}`.trim()
        : 'otro cliente';

      throw new ConflictException({
        message: `El horario elegido (hasta las ${horaFin}) se superpone con el turno de ${nombreCliente}, confirmado de ${horaInicioConflicto} a ${horaFinConflicto}.`,
        tipo: 'SOLAPAMIENTO_TURNO',
        turnoConflictoId: conflicto.id,
        horaInicioConflicto,
        horaFinConflicto,
      });
    }
  }


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
