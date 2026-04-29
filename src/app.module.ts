import { Module } from '@nestjs/common';
<<<<<<< HEAD
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TurnosModule } from './turnos/turnos.module';
import { ProfesionalesModule } from './profesionales/profesionales.module';
import { UsuariosModule } from './usuarios/usuarios.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 3306,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    TurnosModule,
    ProfesionalesModule,
    UsuariosModule,
=======
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { UserModule } from './user/user.module';
import { TurnModule } from './turn/turn.module';
import { ProfessionalProfileModule } from './professional-profile/professional-profile.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Carga las variables
    TypeOrmModule.forRootAsync(databaseConfig), // Usa la configuración asíncrona
    UserModule,
    TurnModule,
    ProfessionalProfileModule,
>>>>>>> d44bc5f0d9a57a525d86932112edf0e0486e8ec8
  ],
})
export class AppModule {}