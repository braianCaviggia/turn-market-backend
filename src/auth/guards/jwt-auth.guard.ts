import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

// Este archivo se usará si queremos proteger rutas específicas con JWT. Ejemplo: cuando tengamos: panel de profesional,turnos, datos privados. Vamos a necesitar sí o sí protección por JWT.


@Injectable()
export class JwtAuthGuard
  extends AuthGuard('jwt') {}