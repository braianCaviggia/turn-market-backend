import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ProfessionalProfileService } from './professional-profile.service';
import { CreateProfessionalProfileDto } from './dto/create-professional-profile.dto';
import { UpdateProfessionalProfileDto } from './dto/update-professional-profile.dto';

@Controller('professional-profile')
export class ProfessionalProfileController {
  constructor(private readonly professionalProfileService: ProfessionalProfileService) {}

  @Post()
  create(@Body() createProfessionalProfileDto: CreateProfessionalProfileDto) {
    return this.professionalProfileService.create(createProfessionalProfileDto);
  }

  @Get()
  findAll() {
    return this.professionalProfileService.findAll();
  }

  // Traer perfil por id de perfil
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.professionalProfileService.findOne(id);
  }

  // Traer perfil por userId — usado al cargar el panel
  @Get('user/:userId')
  findByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.professionalProfileService.findByUserId(userId);
  }

  // Traer turnos del profesional separados por estado — usado por PanelProfesional
  @Get('user/:userId/turnos')
  findTurnos(@Param('userId', ParseIntPipe) userId: number) {
    return this.professionalProfileService.findTurnosByUserId(userId);
  }

  // Cambiar estado de un turno — aceptar/rechazar/restaurar
  @Patch('turnos/:turnoId/estado')
  actualizarEstado(
    @Param('turnoId', ParseIntPipe) turnoId: number,
    @Body('estado') estado: string,
  ) {
    return this.professionalProfileService.actualizarEstadoTurno(turnoId, estado);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateProfessionalProfileDto: UpdateProfessionalProfileDto) {
    return this.professionalProfileService.update(id, updateProfessionalProfileDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.professionalProfileService.remove(id);
  }
}