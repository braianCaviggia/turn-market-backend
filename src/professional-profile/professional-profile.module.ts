import { Module } from '@nestjs/common';
import { ProfessionalProfileService } from './professional-profile.service';
import { ProfessionalProfileController } from './professional-profile.controller';
import { ProfessionalProfile } from './entities/professional-profile.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ProfessionalProfile])],
  controllers: [ProfessionalProfileController],
  providers: [ProfessionalProfileService],
})
export class ProfessionalProfileModule {}
