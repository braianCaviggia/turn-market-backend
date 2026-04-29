import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { TurnosService } from './turnos.service';
import { CrearTurnoDto } from './dto/crear-turno.dto';
import { ActualizarEstadoDto } from './dto/actualizar-estado.dto';

@Controller('turnos')
export class TurnosController {
  constructor(private readonly turnosService: TurnosService) {}

  @Get()
  findAll() {
    return this.turnosService.findAll();
  }

  @Get('profesional/:id')
  findByProfesional(@Param('id', ParseIntPipe) id: number) {
    return this.turnosService.findByProfesional(id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.turnosService.findOne(id);
  }

  @Post()
  crear(@Body() dto: CrearTurnoDto) {
    return this.turnosService.crear(dto);
  }

  @Patch(':id/estado')
  actualizarEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ActualizarEstadoDto,
  ) {
    return this.turnosService.actualizarEstado(id, dto);
  }

  @Delete(':id')
  eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.turnosService.eliminar(id);
  }
}