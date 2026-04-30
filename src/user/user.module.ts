import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfessionalProfile } from '../professional-profile/entities/professional-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, ProfessionalProfile])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
