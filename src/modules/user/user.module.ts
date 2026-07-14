import { Module } from '@nestjs/common';
// import { DatabaseService } from 'src/db/database.service';

import { DatabaseService } from 'src/db/database.service';
import { AuthService } from './auth.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService, AuthService, DatabaseService],
})
export class UserModule {}
