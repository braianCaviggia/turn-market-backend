import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // elimina campos extra
      forbidNonWhitelisted: true, // error si mandan campos inválidos
    }),
  );
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:5174'], // ajusta esto a tu frontend
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
  }); // agrega esta línea para habilitar CORS
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
