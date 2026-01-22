import 'reflect-metadata';
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger';
import { MasterDataSource } from './database/master.datasource';
import { ValidationPipe } from '@nestjs/common';

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

  await app.listen(5000);
  console.log('App listening on http://localhost:5000');
}

bootstrap();
