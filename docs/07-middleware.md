Tùy chọn thêm:
- `whitelist`: Xóa bỏ các trường không khai báo trong DTO.
- `forbidNonWhitelisted`: Trả lỗi nếu có các trường "thừa".
- `transform`: Tự động chuyển đổi dữ liệu sang kiểu tương ứng.

## 4. Middleware trong NestJS

### 4.1 Tổng quan về Middleware
Middleware là hàm trung gian chạy trước khi Request đến Controller. Middleware thường được dùng để:
- Ghi log.
- Kiểm tra request (ví dụ: xác thực token).
- Thêm thông tin vào request.

### 4.2 Tạo Middleware
`logger.middleware.ts`:

```typescript
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`Request... ${req.method} ${req.originalUrl}`);
    next(); // Chuyển sang middleware hoặc controller tiếp theo
  }
}
### 4.3 Sử dụng Middleware

Có hai cách để áp dụng Middleware:

1. Sử dụng cho toàn bộ ứng dụng.
2. Sử dụng cho từng route/module cụ thể.

**Sử dụng Middleware cho toàn bộ ứng dụng:**

Trong `main.ts`, áp dụng middleware bằng `app.use`:

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerMiddleware } from './logger.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(new LoggerMiddleware().use); // Sử dụng middleware

  await app.listen(3000);
}
bootstrap();
**Sử dụng Middleware cho Module cụ thể:**

Áp dụng Middleware vào module bằng cách ghi đè phương thức **configure**:

`app.module.ts`:

```typescript
import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { LoggerMiddleware } from './logger.middleware';
import { ProductModule } from './product/product.module';

@Module({
  imports: [ProductModule],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: 'products', method: RequestMethod.ALL }); // Middleware cho /products
  }
}

Hãy tạo một Middleware để can thiệp vào Request, gắn thông tin người dùng (req.user) trước khi truyền sang Controller, sau đó gọi Service để lấy danh sách sản phẩm từ Database.