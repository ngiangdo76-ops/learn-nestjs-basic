

---

# Lưu ý:

Trong TypeORM, Repository là 1 class trung gian giúp thực hiện các thao tác tương tác với database mà không cần viết câu lệnh SQL thô.

**Bước 1:** Tạo Module, Controller và Service

**Bước 2:** Tạo Entity Product

**3. Cấu hình TypeORMModule cho Product**

**Import Entity vào ProductModule**

**`product.module.ts:`**

```javascript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}

```

**4. Tạo Service thực hiện CRUD**

**5. Tạo controller để tạo các Endpoint**
 6. Xac thuc kiem tra du lieu
 - Sử dụng DTO trong Controller