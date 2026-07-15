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
Route se phan hoi khi nguoi dung truy cap Get /hello
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
Giải thích:

`@Param()` lấy giá trị tham số từ URL.
### 5. Xử lý Query Parameters

**Query Parameters** được truyền trên URL dạng `?key=value`. Ví dụ: `/user?age=20`.

Ví dụ:

```javascript
import { Controller, Get, Query } from '@nestjs/common';

@Controller('user')
export class UserController {
  @Get()
  findByAge(@Query('age') age: string) {
    return `This action returns users with age: ${age}`;
  }
}

```
Giải thích:

`@Query()` lấy giá trị từ query parameters.

### 6. Xử lý Body với @Post()

Đối với HTTP POST, dữ liệu thường được truyền trong **body** của request.

Ví dụ:

```javascript
import { Controller, Post, Body } from '@nestjs/common';

@Controller('user')
export class UserController {
  @Post()
  createUser(@Body() createUserDto: any) {
    return `This action adds a new user: ${JSON.stringify(createUserDto)}`;
  }
}
```
Giải thích:

* `@Body()` lấy dữ liệu từ body của request.
* Trong thực tế, bạn nên sử dụng **DTO** để định nghĩa và validate dữ liệu truyền vào.
```
  create() {
  /*   1 test thu them
    return 'create'; */
    
  }
```
Giải thích:

* `@Body()` lấy dữ liệu từ body của request.
* Trong thực tế, bạn nên sử dụng **DTO** để định nghĩa và validate dữ liệu truyền vào.

### 7. Tổ chức Routes với Prefix

* `@Controller('user')` định nghĩa một **prefix** chung cho tất cả các route trong controller.
* Các route bên trong controller sẽ được nối với prefix này.

Ví dụ:

```javascript
@Controller('user') // Prefix: /user
export class UserController {
  @Get()
  findAll() {
    return 'GET /user';
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return `GET /user/${id}`;
  }
}
```
### 8. Kết hợp Service và Controller

Controller gọi **Service** để xử lý logic nghiệp vụ thay vì viết trực tiếp trong Controller.

Ví dụ:

`user.service.ts`:

```javascript
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  findAll() {
    return ['User 1', 'User 2', 'User 3'];
  }

  findOne(id: string) {
    return { id, name: 'John Doe' };
  }
}
```
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