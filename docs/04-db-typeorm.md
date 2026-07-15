## Bài 5: Làm việc với Database (TypeORM) trong NestJS

### 1. Tổng quan về TypeORM

* **TypeORM** là một **ORM** (Object Relational Mapping) cho phép tương tác với cơ sở dữ liệu thông qua các **class** và **object** thay vì viết trực tiếp câu lệnh SQL.
* Hỗ trợ nhiều loại cơ sở dữ liệu như **PostgreSQL, MySQL, SQLite, SQL Server, v.v.**

Lợi ích của TypeORM:
* Tự động ánh xạ bảng (table) vào các entity (class).
* Dễ dàng thực hiện CRUD mà không cần viết SQL thủ công.
* Tương thích tốt với NestJS.
## Bài 5: Làm việc với Database (TypeORM) trong NestJS

### 1. Tổng quan về TypeORM

* **TypeORM** là một **ORM** (Object Relational Mapping) cho phép tương tác với cơ sở dữ liệu thông qua các **class** và **object** thay vì viết trực tiếp câu lệnh SQL.
* Hỗ trợ nhiều loại cơ sở dữ liệu như **PostgreSQL, MySQL, SQLite, SQL Server, v.v.**

Lợi ích của TypeORM:
* Tự động ánh xạ bảng (table) vào các entity (class).
* Dễ dàng thực hiện CRUD mà không cần viết SQL thủ công.
* Tương thích tốt với NestJS.

### 2. Cài đặt TypeORM trong dự án NestJS

#### Cài đặt thư viện cần thiết

Sử dụng npm hoặc yarn để cài TypeORM và driver cho database:

```bash
npm install @nestjs/typeorm typeorm mysql2
```


* `@nestjs/typeorm` : Module TypeORM cho NestJS.
* `typeorm` : Thư viện TypeORM.
* `mysql2` : Driver cho MySQL (nếu dùng MySQL).

> ⚠️ **Lưu ý:** Nếu dự án của bạn dùng PostgreSQL, hãy thay thế `mysql2` bằng `pg`.
### 3. Cấu hình kết nối TypeORM

#### Import TypeORMModule vào AppModule

`app.module.ts`:

```javascript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'nestjs_demo',
      entities: [],
      synchronize: true, // Tự động đồng bộ database (Không nên dùng ở Production)
    }),
  ],
})
export class AppModule {}
```
### 4. Tạo Entity (Model)

Entity là các class ánh xạ với bảng trong database.

#### Bước 1: Tạo Entity

Sử dụng NestJS CLI để tạo nhanh Module, Service và Controller cho `user`:

```bash
nest generate module user
nest generate service user
nest generate controller user
```
#### Bước 2: Định nghĩa Entity User
user.entity.ts:
```typescript
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ default: true })
  isActive: boolean;
}
```
### 5. Import Entity vào Module

Import entity vào TypeOrmModule để TypeORM quản lý.

user.module.ts:

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}

```

### 6. Repository trong TypeORM

**Repository** là nơi thực hiện các thao tác với database như **CRUD**.

#### Inject Repository vào Service


user.service.ts:

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(id: number): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }

  create(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  async update(id: number, userData: Partial<User>): Promise<User> {
    await this.userRepository.update(id, userData);
    return this.findOne(id);
  }

}

```
### 7. Controller gọi Service để thực hiện CRUD

user.controller.ts:

```typescript
import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(Number(id));
  }

  @Post()
  create(@Body() userData: Partial<User>): Promise<User> {
    return this.userService.create(userData);
  }
  @Put(':id')
update(@Param('id') id: string, @Body() userData: Partial): Promise {
return this.userService.update(Number(id), userData);
}

@Delete(':id')
remove(@Param('id') id: string): Promise {
return this.userService.remove(Number(id));
}
}

```
### 8. Chạy ứng dụng và kiểm tra

Khởi động ứng dụng bằng lệnh:

```bash
npm run start:dev

```

Sử dụng công cụ như **Postman** hoặc **cURL** để gọi API:

* **GET /users**: Lấy danh sách tất cả users.
* **GET /users/:id**: Lấy thông tin user theo ID.
* **POST /users**: Tạo user mới (truyền dữ liệu trong body).
* **PUT /users/:id**: Cập nhật user theo ID.
* **DELETE /users/:id**: Xóa user theo ID.

### 9. Tổng k ết

* **TypeORM** giúp làm việc với database dễ dàng bằng cách sử dụng các class và object.
* **Entity** ánh xạ với các bảng trong database.

 