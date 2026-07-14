 ## Bài 3: Routing và Controller trong NestJS

### 1. Routing là gì?

* **Routing** trong NestJS là quá trình định nghĩa và xử lý các **endpoint API** để nhận và phản hồi yêu cầu HTTP.
* Mỗi **route** được định nghĩa trong một **controller**.

Ví dụ một route đơn giản:
de dinh nghia 1 route: xac dinh 3 yeu to: 1 http method la gi, 2 ,3 ham xy ly?
```javascript
@Get('hello')
getHello() {
  return 'Hello World!';
}
```
### 2. Controller trong NestJS là gì?

**Controller** chịu trách nhiệm:

* Xử lý các yêu cầu HTTP từ client.
* Gọi các **Service** để thực thi logic nghiệp vụ.
* Trả về dữ liệu hoặc thông báo kết quả.

Controller sử dụng **decorators** để xác định các route và phương thức HTTP:

| Decorator   | HTTP Method |
| :---------- | :---------- |
| `@Get()`    | GET         |
| `@Post()`   | POST        |
| `@Put()`    | PUT         |
| `@Delete()` | DELETE      |
| `@Patch()`  | PATCH       |

### 4. Định nghĩa Route động và Tham số (Params)

**Route động** cho phép truyền tham số trên URL, ví dụ: `/user/:id`.

Ví dụ:

```javascript
import { Controller, Get, Param } from '@nestjs/common';

@Controller('user')
export class UserController {
  @Get(':id') // Route động
  findOne(@Param('id') id: string) {
    return `This action returns user with id: ${id}`;
  }
}

```