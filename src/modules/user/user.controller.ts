import { Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userservice: UserService,
    private readonly authservice: AuthService,
  ) {}
  //LAM S de user tuy cap vao index khi vo duong dan ?
  // can co 1 route
  @Get() // -> /users
  index(@Query() query: any) {
    // return [this.userservice.getUsers(), this.authservice.login()];
    // return 'index';
    //2 cach thong thuong khoi tao new
    // const userservice = new UserService();
    // return userservice.getUsers();
    return {
      keyword: query.keyword,
    };
  }

  // 1 goi 1 cai decorator
  @Get('/:id')
  find(@Param('id') id: string) {
    return 'User ' + id;
  }
  @Post()
  create() {
    return 'create';
  }
  @Delete()
  delete() {
    return 'delete';
  }
}
