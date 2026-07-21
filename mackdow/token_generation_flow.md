# Luồng Sinh Token (Token Generation Flow) trong NestJS

Tài liệu này mô tả chi tiết luồng xử lý từ lúc Client gửi request đăng nhập cho tới khi nhận được Access Token trong dự án NestJS.

## 1. Bức tranh toàn cảnh luồng đăng nhập & sinh Token

**Giai đoạn 1: Chặn và Trích xuất dữ liệu (Guard & Strategy)**
1. **Client gửi Request:** Client gửi một `POST` request tới `/auth/login` chứa body data là `{ "email": "...", "password": "..." }`.
2. **Chạm trán Guard:** Request bị chặn lại bởi `@UseGuards(LocalAuthGuard)` tại `AuthController`.
3. **Kích hoạt Strategy:** `LocalAuthGuard` kích hoạt `LocalStrategy` (nhờ cơ chế liên kết của Passport). `LocalStrategy` tự động "moi" `email` và `password` từ body data và chạy hàm `validate()`.

**Giai đoạn 2: Xác thực (Database & Bcrypt)**
4. **Gọi hàm xác thực:** Hàm `validate()` trong `LocalStrategy` gọi sang `AuthService.validateUser(email, password)`.
5. **Kiểm tra DB:** 
   - `AuthService` gọi `UserService.findByEmail(email)` tìm user trong database.
   - Dùng `bcrypt.compare` so sánh mật khẩu gửi lên với mật khẩu đã mã hóa.
6. **Trả về kết quả:** Nếu đúng mật khẩu, trả về thông tin `user` (đã bỏ trường `password`). Nếu sai, quăng lỗi `401 Unauthorized`.

**Giai đoạn 3: Vào Controller và Tạo Token (JWT)**
7. **Gắn thông tin User:** Hàng rào Passport tự động lấy thông tin `user` gắn vào request: `req.user`.
8. **Vào Controller:** Lúc này code mới chạy vào hàm `@Post('login')` của `AuthController`. Controller lấy `req.user` ném qua cho `AuthService.login(req.user)`.
9. **Ký JWT Token:** 
   - `AuthService.login` đóng gói payload (chứa `email`, `sub`).
   - Dùng `JwtService.sign(payload)` để tạo chuỗi JWT Token.
10. **Hoàn thành:** Trả chuỗi Token về cho Client (vd: `{"access_token": "..."}`).

---

## 2. Đi sâu vào mã nguồn: `local.strategy.ts`

File `local.strategy.ts` đóng vai trò như "Người gác cổng" của toàn bộ luồng đăng nhập. Dưới đây là giải thích từng dòng code trong file này:

### 2.1. Khởi tạo và Cấu hình Strategy
```typescript
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from 'src/auth/auth.service';

// Đánh dấu class này là một Provider để NestJS có thể inject (tiêm) nó đi khắp nơi
@Injectable()
// Kế thừa hàm PassportStrategy và truyền Strategy của 'passport-local' vào. 
// Hành động này tự động đăng ký class này với Passport dưới cái tên mặc định là 'local'.
export class LocalStrategy extends PassportStrategy(Strategy) {
  
  // Hàm khởi tạo: Tiêm AuthService vào để sử dụng các hàm kiểm tra Database.
  constructor(private authService: AuthService) {
    // Gọi hàm super() của class cha (PassportStrategy).
    // `{ usernameField: 'email' }` là cấu hình báo cho thư viện Passport biết: 
    // "Thay vì tìm trường 'username' trong body gửi lên như mặc định, hãy lấy trường 'email'".
    super({ usernameField: 'email' });
  }
```

### 2.2. Hàm `validate` (Xử lý xác thực cốt lõi)
Thư viện Passport sau khi trích xuất được `email` (gán vào biến `username`) và `password` từ body request, nó sẽ tự động ném vào hàm này.

```typescript
  async validate(username: string, password: string): Promise<any> {

    // Bước 1: Giao việc kiểm tra DB cho AuthService
    // Gọi hàm validateUser() và chờ (await) kết quả trả về. 
    // Hàm này sẽ vào Database tìm email và so khớp password (bằng bcrypt).
    const user = await this.authService.validateUser(username, password);

    // Bước 2: Xử lý trường hợp thất bại (Sai email hoặc sai mật khẩu)
    // Nếu AuthService trả về null/undefined, tức là đăng nhập sai.
    if (!user) {
      // Ném ra lỗi HTTP 401 (Unauthorized) kèm thông báo 'Invalid credentials'.
      // Dòng code này chặn đứng mọi thứ lại, request không thể đi tiếp vào Controller.
      throw new UnauthorizedException('Invalid credentials');
    }

    // Bước 3: Xử lý trường hợp thành công
    // Nếu vượt qua được câu lệnh if trên, tức là user đã hợp lệ.
    // Lệnh return này KHÔNG trả trực tiếp về cho Client, 
    // mà trả về cho hệ thống lõi của thư viện Passport.
    // Passport sẽ nhận lấy object `user` này và tự động nhét nó vào `req.user`.
    return user;
  }
}
```

---

## 3. Ý nghĩa của providers: [AuthService, LocalStrategy] trong AuthModule

Khai báo này trong `auth.module.ts` nhằm 3 mục đích:
1. **Khởi tạo (IoC Container):** Yêu cầu NestJS tự động tạo và quản lý instance của `AuthService` và `LocalStrategy`.
2. **Tiêm phụ thuộc (Dependency Injection):** NestJS tự động hiểu `LocalStrategy` cần `AuthService` nên nó sẽ "tiêm" `AuthService` vào constructor của `LocalStrategy` giúp bạn.
3. **Đăng ký với hệ thống Passport:** Do có import `PassportModule`, NestJS sẽ quét mảng `providers` và tự động đăng ký `LocalStrategy` vào lõi của Passport với định danh là `'local'`. Nhờ đó Guard `@UseGuards(LocalAuthGuard)` mới có thể tìm và gọi được chiến lược xác thực này.

---

## 4. Chi tiết code trong `auth.service.ts`

File `auth.service.ts` chứa các logic nghiệp vụ quan trọng về xác thực DB và sinh chuỗi Token.

### 4.1. Hàm `validateUser` (Xác minh thông tin đăng nhập)
Được gọi bởi `LocalStrategy` để đối chiếu email và mật khẩu.

```typescript
  async validateUser(email: string, pass: string): Promise<any> {
    
    // Gọi UserService chui xuống Database tìm xem có bản ghi nào trùng với email không.
    const user = await this.userService.findByEmail(email);
    
    // Đảm bảo user có tồn tại VÀ dùng thuật toán Bcrypt so sánh mật khẩu gửi lên (`pass`) 
    // xem có khớp với mật khẩu đã mã hóa băm lưu trong DB (`user.password`) hay không.
    if (user && (await bcrypt.compare(pass, user.password))) {
      
      // Bóc tách object (Destructuring). Nhặt riêng trường `password` ra, 
      // gom chung các trường còn lại (id, email, tên...) vào biến tên là `result`. 
      // Mục đích: LỌC BỎ password để bảo mật.
      const { password, ...result } = user;
      
      // Trả về thông tin user (đã sạch sẽ không còn password) cho LocalStrategy.
      return result;
    }
    
    // Nếu email không tồn tại, hoặc sai password, lọt xuống đây và trả về `null`.
    return null;
  }
```

### 4.2. Hàm `login` (Sinh JWT Token)
Được gọi từ `AuthController` sau khi quá trình xác thực ở trên đã thành công.

```typescript
  // Nhận vào object `user` (đã được Passport gán vào `req.user`).
  async login(user: any) {
    
    // Tạo một object `payload` (Gói hàng).
    // Chứa những thông tin CÔNG KHAI sẽ được mã hóa vào bên trong Token.
    const payload = { email: user.email, sub: user.id };

    return {
      // jwtService lấy gói hàng `payload`, đóng dấu bằng khóa bí mật (secret key),
      // xuất ra chuỗi Access Token để trả về cho Client.
      access_token: this.jwtService.sign(payload),
    };
  }
```

---

## 5. Tóm tắt đường đi qua các file (File Flow)

Để dễ hình dung, luồng chạy thực tế đi qua các file từ lúc bấm "Đăng nhập" đến khi có Token diễn ra theo thứ tự như sau:

1. **`src/auth/auth.controller.ts` (Điểm đón khách):** Client gửi request tới `/auth/login`. Request vừa chạm đến cửa thì bị chặn lại bởi `@UseGuards(LocalAuthGuard)`.
2. **`src/guards/local-auth.guard.ts` (Trạm trung chuyển):** Guard này ra lệnh cho Passport gọi chiến lược `'local'`.
3. **`src/passport/local.strategy.ts` (Người lấy cung):** Chiến lược `'local'` tự động moi `email` và `password` từ body request và gọi hàm `validate(email, password)`.
4. **`src/auth/auth.service.ts` (Hàm `validateUser`):** `local.strategy.ts` gọi hàm này để chui xuống DB kiểm tra mật khẩu. Nhận về `user` hợp lệ thì quăng lại cho `local.strategy.ts`.
*(Đến đây, Passport đóng dấu hợp lệ, nhét `user` vào `req.user` và mở barie cho đi tiếp).*
5. **Quay lại `src/auth/auth.controller.ts` (Xử lý chính):** Barie đã mở, code chính thức chạy vào hàm `login(@Request() req)` của Controller. Controller cầm `req.user` ném sang cho Service tạo Token.
6. **`src/auth/auth.service.ts` (Hàm `login`):** Nhận lệnh từ Controller, nó lấy `email` và `id` gói lại, ký thành **JWT Token**.
7. **Quay lại `src/auth/auth.controller.ts` (Trả hàng):** Token in xong được ném về Controller. Controller gói nó vào cục JSON `{"access_token": "..."}` và trả về cho Client.

**💡 Luồng ngắn gọn:**
`Controller` ➡️ `Guard` ➡️ `Strategy` ➡️ `Service (validateUser)` ➡️ `Controller` ➡️ `Service (login)` ➡️ `Client`.
