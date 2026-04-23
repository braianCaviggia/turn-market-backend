import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { UserModule } from './user/user.module';
import { TurnModule } from './turn/turn.module';
import { ProfessionalProfileModule } from './professional-profile/professional-profile.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    UserModule,
    TurnModule,
    ProfessionalProfileModule,
  ],
})
export class AppModule {}