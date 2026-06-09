import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';  
import * as nodemailer from 'nodemailer';


@Injectable()
export class AuthService {

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

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

  async forgotPassword(email: string) {

    // Buscar usuario
    const user = await this.userRepository.findOne({
      where: { email }
    });

    // Si no existe
    if (!user) {
      throw new UnauthorizedException(
        'No existe un usuario con ese email'
      );
    }

    // Generar código de 6 dígitos
    const code = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // Expira en 10 minutos
    const expires = Date.now() + 1000 * 60 * 10;

    // Guardar en DB
    user.resetCode = code;
    user.resetCodeExpires = expires;

    await this.userRepository.save(user);

    // Enviar email
    await this.sendRecoveryEmail(user.email, code);

    return {
      message: 'Código enviado al email'
    };
  }

  async resetPassword(body: {
    email: string;
    code: string;
    password: string;
  }) {

    const user = await this.userRepository.findOne({
      where: { email: body.email }
    });

    if (!user) {
      throw new UnauthorizedException(
        'Usuario no encontrado'
      );
    }

    // Verifica código
    if (user.resetCode !== body.code) {
      throw new UnauthorizedException(
        'Código inválido'
      );
    }

    // Verifica expiración
    if (Date.now() > user.resetCodeExpires) {
      throw new UnauthorizedException(
        'El código expiró'
      );
    }

    // Hashear password
    const hashedPassword = await bcrypt.hash(
      body.password,
      10
    );

    // Guardar nueva password
    user.password = hashedPassword;

    // Limpiar código
    user.resetCode = null;
    user.resetCodeExpires = null;

    await this.userRepository.save(user);

    return {
      message: 'Contraseña actualizada'
    };
  }

  async sendRecoveryEmail(
    email: string,
    code: string
  ) {

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Recuperación de contraseña',
      text: `Tu código de recuperación es: ${code}`,
    });
  }
}