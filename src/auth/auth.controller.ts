import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService,
  ) {}

  // Endpoint: POST /auth/login
  @Post('login')
  login(
    @Body()
    body: {
      email: string;
      password: string;
    },
  ) {
    
    // Llamamos al service que hace toda la lógica de login
    return this.authService.login(
      body.email,
      body.password,
    );
  }
}