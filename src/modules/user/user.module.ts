import { Module } from '@nestjs/common';
// import { DatabaseService } from 'src/db/database.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from 'src/db/database.service';
import { AuthService } from './auth.service';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService, AuthService, DatabaseService],
  exports: [UserService],
  imports: [TypeOrmModule.forFeature([User])],
})
export class UserModule {}
