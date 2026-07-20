1. Sơ đồ 1: Cookie-Based Authentication (Phương pháp truyền thống)
Nguyên lý hoạt động:

Client gửi một yêu cầu đăng nhập (request) lên Server.

Server xác thực thông tin thành công và sẽ lưu dữ liệu phiên đăng nhập (Session) trên Server. Đồng thời, Server tạo ra một Session ID và gửi trả về cho Client dưới dạng Cookie.

Từ các request sau (Authorization request), trình duyệt sẽ tự động gửi kèm Cookie chứa Session ID đó lên Server.

Server lấy Session ID từ Cookie để đối chiếu với Session lưu trữ trên Server. Nếu khớp, Server trả dữ liệu về cho Client.

Đặc điểm/Ứng dụng: Thường áp dụng cho các ứng dụng web dạng Server-Side Rendering (SSR) (render giao diện trực tiếp từ server, không viết API riêng).

2. Sơ đồ 2: Token-Based Authentication / JWT (Phương pháp hiện đại)
Nguyên lý hoạt động:

Khi Client đăng nhập thành công, Server tạo ra một chuỗi Token (chứa dữ liệu đã mã hóa) và trả về cho Client.

Dữ liệu không được lưu trên Server (Stateless) mà nằm trực tiếp trong Token.

Đối với các request cần xác thực/ủy quyền, Client chủ động đính kèm Token này vào Header của Request dưới dạng:

Authorization: Bearer <token>

Server nhận được request sẽ tiến hành giải mã (decode) chuỗi Token đó để kiểm tra tính hợp lệ và truy vấn Database lấy thêm dữ liệu cần thiết trước khi trả kết quả về cho Client.
Dưới đây là toàn bộ nội dung lý thuyết được chép lại chính xác từ hình ảnh của bạn:

---

## Bài 8: Authentication với JWT trong NestJS

### 1. Tổng quan về Authentication và JWT

* **Authentication** là quá trình xác thực người dùng để cấp quyền truy cập vào hệ thống.
* **JWT (JSON Web Token)** là một tiêu chuẩn mở cho phép truyền thông tin an toàn giữa các bên dưới dạng token. JWT thường được sử dụng để xác thực người dùng trong các ứng dụng RESTful API.

**Mục tiêu bài học:**

* Cài đặt và cấu hình hệ thống xác thực sử dụng JWT trong NestJS.
* Tạo API **Login** để cấp token và API **Protected** chỉ cho phép người dùng đã xác thực truy cập.

---

### 2. Cài đặt các thư viện cần thiết

Cài đặt các package cho JWT và bcrypt để mã hóa mật khẩu:

```bash
npm install @nestjs/passport @nestjs/jwt passport passport-local passport-jwt bcrypt
npm install @types/passport-jwt @types/passport-local --save-dev

```

---

### 3. Tạo User Module

#### Bước 1: Tạo Module, Controller và Service

Chạy các lệnh sau để tạo UserModule: