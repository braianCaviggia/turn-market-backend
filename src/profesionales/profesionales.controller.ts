import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ProfesionalesService } from './profesionales.service';
import { CrearProfesionalDto } from './dto/crear-profesional.dto';
import { ActualizarProfesionalDto } from './dto/actualizar-profesional.dto';

@Controller('profesionales')
export class ProfesionalesController {
  constructor(private readonly profesionalesService: ProfesionalesService) {}

  @Get()
  findAll() {
    return this.profesionalesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.profesionalesService.findOne(id);
  }

  @Post()
  crear(@Body() dto: CrearProfesionalDto) {
    return this.profesionalesService.crear(dto);
  }

  @Patch(':id')
  actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ActualizarProfesionalDto,
  ) {
    return this.profesionalesService.actualizar(id, dto);
  }

  @Delete(':id')
  eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.profesionalesService.eliminar(id);
  }
}