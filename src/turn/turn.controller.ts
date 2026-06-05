import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { TurnService } from './turn.service';
import { CreateTurnDto } from './dto/create-turn.dto';
import { UpdateTurnDto } from './dto/update-turn.dto';

@Controller('turn')
export class TurnController {
  constructor(private readonly turnService: TurnService) {}

   @Post()
  create(@Body() createTurnDto: CreateTurnDto) {
    return this.turnService.create(createTurnDto);
  }

  @Get("user/:id")
  findClient(@Param("id") id: string) {
    return this.turnService.getTurnClient(+id);
  }

   @Get("professional/:id")
  findProfessional(@Param("id") id: string) {
    return this.turnService.getTurnProfessional(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.turnService.findOne(+id);
    }

     @Patch('turnos/:turnoId/estado')
      actualizarEstado(
        @Param('turnoId', ParseIntPipe) turnoId: number,
        @Body('estado') estado: string,
        @Body('duracionEstimada') duracionEstimada?: number,
        @Body('bufferDescanso') bufferDescanso?: number,
        @Body('horaFin') horaFin?: string,
      ) {
        return this.turnService.actualizarEstadoTurno(turnoId, estado, duracionEstimada, bufferDescanso, horaFin);
      }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTurnDto: UpdateTurnDto) {
  //   return this.turnService.update(+id, updateTurnDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.turnService.remove(+id);
  // }
}
