import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BullModule } from '@nestjs/bullmq';
import { QueueName } from 'src/app.interface';
import { User } from 'src/entities/User';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UsersConsumer } from './user.consumer';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    BullModule.registerQueue(
      {
        name: QueueName.EMAIL,
      },
      {
        name: QueueName.VIDEO,
      },
    ),
  ],
  controllers: [UserController],
  providers: [UserService, UsersConsumer],
  exports: [UserService],
})
export class UserModule {}
