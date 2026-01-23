import { Controller, Post, Body, UnauthorizedException, Req } from '@nestjs/common';
import { ApiTags, ApiBody, ApiResponse, ApiHeader } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { TenantLoginDto } from '../dto/tenant-login.dto';
import { DomainLoginDto } from '../dto/domain-login.dto';
import type { Request } from 'express';

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

  @Post('domain-login')
  @ApiBody({ type: DomainLoginDto })
  @ApiHeader({ 
    name: 'Host', 
    description: 'The domain of the tenant (e.g., company1.intellisales.com)',
    required: true 
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Domain-based login successful. Tenant automatically detected from domain.' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Invalid credentials, domain, or tenant not found.' 
  })
  async domainLogin(@Body() body: DomainLoginDto, @Req() req: Request) {
    const host = req.get('host') || req.hostname;
    
    if (!host) {
      throw new UnauthorizedException('Host header is required for domain-based login');
    }
    
    return this.authService.domainLogin(host, body.usernameOrEmail, body.password);
  }
}
