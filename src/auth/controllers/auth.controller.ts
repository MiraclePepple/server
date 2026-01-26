import { Controller, Post, Body, UnauthorizedException, Req } from '@nestjs/common';
import { ApiTags, ApiBody, ApiResponse, ApiHeader, ApiOperation } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { AdminLoginDto } from '../dto/admin-login.dto';
import type { Request } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @Post('login')
  @ApiOperation({ 
    summary: 'User Login', 
    description: 'Login for business users (managers, cashiers, etc.). Enter your email and password. The system will automatically detect which business you belong to.' 
  })
  @ApiBody({ 
    type: LoginDto, 
    description: 'User login credentials. Enter the email/username and password you use for your business account.',
    examples: {
      manager: {
        summary: 'Manager Login',
        description: 'Example for a store manager',
        value: {
          usernameOrEmail: 'manager@acmestore.com',
          password: 'MyStorePassword123!'
        }
      },
      cashier: {
        summary: 'Cashier Login', 
        description: 'Example for a cashier',
        value: {
          usernameOrEmail: 'jane.cashier',
          password: 'CashierPass456!'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Login successful. You will receive a JWT token and your user profile.',
    example: {
      access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      user: {
        user_id: 'uuid',
        username: 'john.cashier',
        email: 'john@company.com',
        roles: ['Cashier'],
        tenant: {
          id: 'tenant-uuid',
          business_name: 'ACME Corporation',
          domain: 'acme-corp.intellisales.com'
        },
        isSystemAdmin: false
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Invalid email/password or user not found.' })
  async login(@Body() body: LoginDto) {
    return this.authService.login(body.usernameOrEmail, body.password);
  }

  @Post('admin/login')
  @ApiOperation({ 
    summary: 'System Admin Login', 
    description: 'Login for system administrators only. This is for IntelliSales platform admins who manage the entire system and all businesses.' 
  })
  @ApiBody({ 
    type: AdminLoginDto, 
    description: 'System administrator credentials. Only use this if you are a platform admin.',
    examples: {
      admin: {
        summary: 'System Admin Login',
        description: 'Example for system administrator',
        value: {
          username: 'superadmin',
          password: 'SuperSecureAdminPass123!'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Admin login successful. JWT token with system-wide privileges.',
    example: {
      access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      user: {
        admin_id: 'admin-uuid',
        username: 'superadmin',
        email: 'admin@intellisales.com',
        isSystemAdmin: true,
        created_at: '2024-01-01T00:00:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Invalid admin credentials.' })
  async adminLogin(@Body() body: AdminLoginDto) {
    return this.authService.adminLogin(body.username, body.password);
  }


}
