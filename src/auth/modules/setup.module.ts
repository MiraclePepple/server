import { Module } from '@nestjs/common';
import { SetupController } from '../controllers/setup.controller';
import { AdminModule } from '../../admin/modules/admin.module';

@Module({
  imports: [AdminModule],
  controllers: [SetupController],
})
export class SetupModule {}