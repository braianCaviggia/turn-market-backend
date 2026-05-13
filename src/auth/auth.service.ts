import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {

    // 1. Buscamos el usuario por email en la base de datos
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException(
        'Credenciales inválidas',
      );
    }

    // 2. Comparamos la contraseña ingresada con la hasheada en BD
    const isMatch = await bcrypt.compare(
      password,
      user.password,
    );

    if (!isMatch) {
      throw new UnauthorizedException(
        'Credenciales inválidas',
      );
    }

    // 3. Creamos el payload del JWT (lo que va dentro del token)
    const payload = {
      sub: user.id,
      email: user.email,
      rol: user.rol,
    };
    
    // 4. Devolvemos el token + datos básicos del usuario
    return {

      access_token:
        this.jwtService.sign(payload),

      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
      },
    };
  }
}