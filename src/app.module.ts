import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { UserModule } from './user/user.module';
import { TurnModule } from './turn/turn.module';
import { ProfessionalProfileModule } from './professional-profile/professional-profile.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(databaseConfig),
    UserModule,
    TurnModule,
    ProfessionalProfileModule,
    AuthModule,
  ],
})
export class AppModule {}