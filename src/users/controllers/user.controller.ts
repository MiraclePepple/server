import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Req } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { JwtTenantGuard } from '../../auth/guards/jwt-tenant.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { ApiTags, ApiBearerAuth, ApiBody, ApiResponse, ApiHeader, ApiOperation } from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@Controller('users')
@UseGuards(JwtTenantGuard, RolesGuard) // Use JWT-based tenant guard
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Create New User', description: 'Create a new user account with roles and permissions' })
  @ApiBody({ 
    type: CreateUserDto,
    examples: {
      cashier: {
        summary: 'New Cashier',
        description: 'Create a cashier account for POS operations',
        value: {
          username: 'jane.cashier',
          email: 'jane@yourstore.com',
          password: 'CashierPass123!',
          full_name: 'Jane Smith',
          phone: '+1-555-987-6543',
          roleNames: ['cashier']
        }
      },
      manager: {
        summary: 'New Manager',
        description: 'Create a manager account with elevated permissions',
        value: {
          username: 'mike.manager',
          email: 'mike@yourstore.com',
          password: 'ManagerPass456!',
          full_name: 'Mike Johnson',
          phone: '+1-555-456-7890',
          roleNames: ['manager', 'cashier']
        }
      }
    }
  })
  @ApiResponse({ status: 201, description: 'User created.' })
  create(@Body() data: CreateUserDto, @Req() req) {
    return this.userService.create(data, req.tenantDbName);
  }

  @Get()
  @ApiOperation({ summary: 'List All Users', description: 'Retrieve paginated list of all users in tenant' })
  @ApiResponse({ status: 200, description: 'List users.' })
  findAll(@Req() req) {
    return this.userService.findAll(req.tenantDbName);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get User Details', description: 'Retrieve detailed information about a specific user' })
  @ApiResponse({ status: 200, description: 'User details.' })
  findOne(@Param('id') id: string, @Req() req) {
    return this.userService.findOne(id, req.tenantDbName);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update User', description: 'Update user profile information, roles, or status' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'User updated.' })
  update(@Param('id') id: string, @Body() data: UpdateUserDto, @Req() req) {
    return this.userService.update(id, data, req.tenantDbName);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete User', description: 'Permanently remove a user account from the system' })
  @ApiResponse({ status: 200, description: 'User removed.' })
  remove(@Param('id') id: string, @Req() req) {
    return this.userService.remove(id, req.tenantDbName);
  }
}
