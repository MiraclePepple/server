import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { TenantLoginDto } from './dto/tenant-login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 201, description: 'Login successful.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  async login(@Body() body: LoginDto) {
    const user = await this.authService.validateUser(body.usernameOrEmail, body.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Post('tenant-login')
  @ApiBody({ type: TenantLoginDto })
  @ApiResponse({ status: 201, description: 'Tenant login successful.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials or tenant.' })
  async tenantLogin(@Body() body: TenantLoginDto) {
    return this.authService.tenantLogin(body.tenantIdentifier, body.usernameOrEmail, body.password);
  }
}
