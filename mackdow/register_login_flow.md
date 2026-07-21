# Luồng Đăng ký và Đăng nhập (Register & Login Flow)

Tài liệu này mô tả chi tiết luồng xử lý của tính năng Đăng ký (Register) và Đăng nhập (Login) trong hệ thống NestJS.

## 1. Luồng Đăng ký (Registration Flow)

Khi một người dùng mới muốn tạo tài khoản, luồng hoạt động diễn ra như sau:

1. **Client gửi Request:**
   Client gửi request `POST /auth/register` với body chứa thông tin người dùng (ví dụ: `email`, `password`, `name`,...).
   Request này được tiếp nhận bởi hàm `register` trong `AuthController`.

2. **Gọi Service Xử lý:**
   `AuthController` gọi hàm `createUser(userData)` của `UserService` (tại file `src/user/user.service.ts`).

3. **Khởi tạo và Xử lý Dữ liệu User:**
   Trong `UserService.createUser`:
   * Sử dụng `this.userRepository.create(userData)` để khởi tạo một thực thể (entity) `User` mới từ dữ liệu gửi lên.
   * Gán thời gian tạo và cập nhật: `user.create_at = new Date()` và `user.update_at = new Date()`.

4. **Mã hóa Mật khẩu (Hashing):**
   * Sử dụng thư viện `bcrypt` để băm (hash) mật khẩu người dùng truyền lên: `await bcrypt.hash(userData.password, 10)`. Số `10` là salt rounds, giúp quá trình băm an toàn hơn.
   * Gán mật khẩu đã mã hóa trở lại cho đối tượng user: `user.password = hashedPassword`.

5. **Lưu vào Database:**
   * Gọi `this.userRepository.save(user)` để lưu thông tin người dùng vào cơ sở dữ liệu (MySQL).
   * Trả về thông tin user vừa được lưu thành công cho Client.

## 2. Luồng Đăng nhập (Login Flow)

*(Luồng này kết hợp việc xác thực và sinh Access Token)*

1. **Client gửi Request:**
   Client gửi request `POST /auth/login` với body chứa `email` và `password`. Request đi tới `AuthController.login`.

2. **Kích hoạt Guard xác thực (`LocalAuthGuard`):**
   Decorator `@UseGuards(LocalAuthGuard)` chặn request. `LocalAuthGuard` kích hoạt `LocalStrategy` của thư viện Passport.

3. **Xác thực Credentials trong `LocalStrategy`:**
   * `LocalStrategy` trích xuất `email` và `password` từ request.
   * Gọi `AuthService.validateUser(email, password)` để kiểm tra.
   * Trong `AuthService.validateUser`:
     * Tìm user theo email bằng `UserService.findByEmail(email)`.
     * So sánh mật khẩu truyền lên với mật khẩu mã hóa trong DB bằng `bcrypt.compare`.
     * Trả về đối tượng `user` nếu hợp lệ, ngược lại trả về `null` (gây ra lỗi `UnauthorizedException`).

4. **Gán User vào Request Context:**
   Passport tự động gán thông tin user hợp lệ vào `req.user`.

5. **Tạo JWT Token:**
   * `AuthController` gọi `AuthService.login(req.user)`.
   * Khởi tạo `payload` chứa thông tin công khai (ví dụ: `email`, `sub: user.id`).
   * Dùng `jwtService.sign(payload)` để ký và sinh ra JWT Access Token (cấu hình trong `AuthModule`).
   * Trả về `{ access_token: <chuỗi_token> }` cho Client.

## Các file chính tham gia

* `src/auth/auth.controller.ts`: Tiếp nhận request `/register` và `/login`.
* `src/user/user.service.ts`: Xử lý logic tạo mới user, mã hóa mật khẩu, tương tác với bảng User trong DB.
* `src/auth/auth.service.ts`: Xử lý logic xác thực mật khẩu (validateUser) và tạo JWT token.
* `src/guards/local-auth.guard.ts` & `src/passport/local.strategy.ts`: Bảo vệ route login và định nghĩa cách xác thực thông tin đăng nhập.

> **Lưu ý:** Lớp `LocalStrategy` cần được đảm bảo đã thêm vào mảng `providers` của `AuthModule` để luồng đăng nhập không bị lỗi runtime như đã phân tích trước đó.
