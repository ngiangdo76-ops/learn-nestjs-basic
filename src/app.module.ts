import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // Thêm dòng import này
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './modules/user/user.entity';
import { UserModule } from './modules/user/user.module';
@Module({
  imports: [
    UserModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: '04-nestjs-type',
      entities: [User],
      synchronize: true, // Tự động đồng bộ database (Không nên dùng ở Production)
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
