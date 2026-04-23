import { Module } from '@nestjs/common';
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
  ],
})
export class AppModule {}
