import { Module } from '@nestjs/common';
import { User } from './user.entity';
import { Role } from './role.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [], // Remove TypeOrmModule.forFeature since we use dynamic tenant connections
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
