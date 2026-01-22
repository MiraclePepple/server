import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';
import { SystemAdminService } from '../admin/system-admin.service';

class CreateSystemAdminDto {
  username: string;
  email: string;  
  password: string;
  full_name: string;
}

@ApiTags('Setup - System Administration')
@Controller('setup')
export class SetupController {
  constructor(private readonly systemAdminService: SystemAdminService) {}

  @Post('create-system-admin')
  @ApiBody({ type: CreateSystemAdminDto })
  @ApiResponse({ status: 201, description: 'System admin created successfully.' })
  @ApiResponse({ status: 400, description: 'System admin already exists or invalid data.' })
  async createSystemAdmin(@Body() data: CreateSystemAdminDto) {
    // Check if any system admin already exists
    const existingAdmins = await this.systemAdminService.findAll();
    if (existingAdmins.length > 0) {
      return {
        success: false,
        message: 'System admin already exists. Use the existing admin login.',
        existingAdmins: existingAdmins.length
      };
    }

    const admin = await this.systemAdminService.createSystemAdmin(data);
    return {
      success: true,
      message: 'System admin created successfully!',
      admin: {
        id: admin.admin_id,
        username: admin.username,
        email: admin.email,
        full_name: admin.full_name
      },
      loginInstructions: {
        endpoint: 'POST /auth/login',
        username: admin.username,
        message: 'Use these credentials to access system administration'
      }
    };
  }
}