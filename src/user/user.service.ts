import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { ProfessionalProfile } from '../professional-profile/entities/professional-profile.entity';

@Injectable()
export class UserService {
  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    if (user.password !== password) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    return user;
  }
  remove(arg0: number) {
    throw new Error('Method not implemented.');
  }
  update(arg0: number, updateUserDto: UpdateUserDto) {
    throw new Error('Method not implemented.');
  }
  findOne(arg0: number) {
    throw new Error('Method not implemented.');
  }
  findAll() {
    throw new Error('Method not implemented.');
  }

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(ProfessionalProfile)
    private professionalRepository: Repository<ProfessionalProfile>,
  ) { }

  async create(dto: CreateUserDto) {

    //Envuelvo toda la lógica del create en un try/catch para capturar específicamente los errores de MySQL/TypeORM
    try {
      // 1. Crear usuario base
      const user = await this.userRepository.save({
        nombre: dto.nombre,
        apellido: dto.apellido,
        telefono: dto.telefono,
        email: dto.email,
        password: dto.password,
        rol: dto.rol,
      });

      // 2. Si es profesional → crear perfil
      if (dto.rol === "profesional") {
        if (!dto.profesion) {
          throw new Error("Falta la profesión");
        }

        await this.professionalRepository.save({
          user: user,
          profesion: dto.profesion,
          precio_min: dto.precio_min || 0,
          precio_max: dto.precio_max || 0,
          // descripcion: dto.descripcion,
        });
      }

      return user;
    } catch (error: any) {

      // Si alguien intenta registrarse con un email repetido MySQL lanza: ER_DUP_ENTRY y el backend responde con el mensaje: "El email ya está registrado",

      if (error.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('El email ya está registrado');
      }

      console.error(error);

      throw new InternalServerErrorException(
        'Error al crear el usuario',
      );
    }
  }
}
