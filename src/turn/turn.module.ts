import { Module } from '@nestjs/common';
import { TurnService } from './turn.service';
import { TurnController } from './turn.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Turn} from "./entities/turn.entity";
import { User } from '../user/entities/user.entity';
import { ProfessionalProfile } from '../professional-profile/entities/professional-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Turn, ProfessionalProfile, User])],
  controllers: [TurnController],
  providers: [TurnService],
})
export class TurnModule { }
