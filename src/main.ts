import 'reflect-metadata';
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger';
import { MasterDataSource } from './database/master.datasource';
import { ValidationPipe } from '@nestjs/common';
import { SystemAdminService } from './admin/services/system-admin.service';

async function bootstrap() {
  await MasterDataSource.initialize();
  const app = await NestFactory.create(AppModule);

  setupSwagger(app); // Initialize Swagger

  app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
);

  // Create default system admin if none exists
  try {
    const systemAdminService = app.get(SystemAdminService);
    const existingAdmins = await systemAdminService.findAll();
    
    if (existingAdmins.length === 0) {
      await systemAdminService.createSystemAdmin({
        username: 'admin',
        email: 'admin@intellisales.com', 
        password: 'admin123',
        full_name: 'System Administrator'
      });
      console.log('🔧 Default system admin created:');
      console.log('   Username: admin');
      console.log('   Email: admin@intellisales.com');
      console.log('   Password: admin123');
      console.log('   ⚠️  CHANGE THIS PASSWORD IN PRODUCTION!');
    }
  } catch (error) {
    console.log('⚠️  Could not create default system admin:', error.message);
  }

  await app.listen(5000);
  console.log('🚀 App listening on http://localhost:5000');
  console.log('📚 Swagger docs: http://localhost:5000/api');
}

bootstrap();
