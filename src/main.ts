import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MasterDataSource } from './database/master.datasource';

async function bootstrap() {
  await MasterDataSource.initialize();
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  console.log('App listening on http://localhost:3000');
}
bootstrap();
