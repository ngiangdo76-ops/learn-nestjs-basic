import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    // muon co them trang thai
    let isAuth = false;
    if (!isAuth) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: 'Unauthorized',
      });
    }

    // ví dụ để minh họa rằng middleware có thể thêm dữ liệu vào req trước khi request đi tới Controller
    req.user = ' nhat giag';
    next();
  }
}
