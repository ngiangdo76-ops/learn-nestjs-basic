@Injectable() là decorator đánh dấu class này có thể được inject vào nơi khác.

### 3. Inject Service vào Controller

Controller gọi các method trong Service để xử lý logic.

Ví dụ: Controller sử dụng Service

`user.controller.ts`:

```javascript
import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }
}
```
Giải thích:

* `constructor(private readonly userService: UserService)`:
    * Tự động inject **UserService** vào **UserController**.
    * **Dependency Injection** giúp NestJS khởi tạo service và quản lý vòng đời của nó.

### 4. Dependency Injection là gì?

**Dependency Injection (DI)** là kỹ thuật mà một class **nhận phụ thuộc** từ bên ngoài thay vì tự tạo.

* NestJS tự động quản lý **dependency** thông qua **IoC Container** (Inversion of Control).
* DI giúp:
    * **Giảm sự phụ thuộc** giữa các class.
    * **Dễ dàng mở rộng** và test code.

### 5. Tạo nhiều Service và Inject lẫn nhau

Ví dụ, `UserService` phụ thuộc vào `DatabaseService`:

#### Bước 1: Tạo DatabaseService