import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Req } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { JwtTenantGuard } from '../../auth/guards/jwt-tenant.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { ApiTags, ApiBearerAuth, ApiBody, ApiResponse, ApiHeader } from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@Controller('users')
@UseGuards(JwtTenantGuard, RolesGuard) // Use JWT-based tenant guard
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles('admin')
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User created.' })
  create(@Body() data: CreateUserDto, @Req() req) {
    return this.userService.create(data, req.tenantDbName);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'List users.' })
  findAll(@Req() req) {
    return this.userService.findAll(req.tenantDbName);
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'User details.' })
  findOne(@Param('id') id: string, @Req() req) {
    return this.userService.findOne(id, req.tenantDbName);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'User updated.' })
  update(@Param('id') id: string, @Body() data: UpdateUserDto, @Req() req) {
    return this.userService.update(id, data, req.tenantDbName);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'User removed.' })
  remove(@Param('id') id: string, @Req() req) {
    return this.userService.remove(id, req.tenantDbName);
  }
}
