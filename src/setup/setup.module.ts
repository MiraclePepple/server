import { Module } from '@nestjs/common';
import { SetupController } from './setup.controller';
import { AdminModule } from '../admin/admin.module';

@Module({
  imports: [AdminModule],
  controllers: [SetupController],
})
export class SetupModule {}