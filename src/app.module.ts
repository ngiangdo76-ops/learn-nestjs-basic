import { BullModule } from '@nestjs/bullmq';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import Product from './entities/Product';
import { User } from './entities/User';
import { LoggingMiddleware } from './middleware/logging/logging.middleware';

import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,

    ProductModule,
    TypeOrmModule.forRoot({
      type: process.env.DB_DRIVER as any,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT as any,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Product],
      synchronize: true,
    }),
    AuthModule,
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT as any),
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggingMiddleware)
      .forRoutes({ path: 'product', method: RequestMethod.GET });
  }
}
