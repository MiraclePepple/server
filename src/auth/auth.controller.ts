import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { usernameOrEmail: string; password: string }) {
    const user = await this.authService.validateUser(body.usernameOrEmail, body.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Post('tenant-login')
  async tenantLogin(@Body() body: { tenantIdentifier: string; usernameOrEmail: string; password: string }) {
    return this.authService.tenantLogin(body.tenantIdentifier, body.usernameOrEmail, body.password);
  }
}
