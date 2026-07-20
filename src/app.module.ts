import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import Product from './entities/Product';
import { LoggingMiddleware } from './middleware/logging/logging.middleware';

import { AuthModule } from './auth/auth.module';
import { User } from './entities/User';
import { UserModule } from './modules/user/user.module';
import { ProductModule } from './product/product.module';
@Module({
  imports: [
    UserModule,
    ProductModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: '04-nestjs-type',
      entities: [User, Product],
      synchronize: true,
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggingMiddleware)
      .forRoutes({ path: 'product', method: RequestMethod.GET }); // Middleware cho /products
  }
}
