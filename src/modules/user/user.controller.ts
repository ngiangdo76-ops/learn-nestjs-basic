import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
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
  index() {
    return this.userservice.findAll();
  }

  // 1 goi 1 cai decorator
  /*   @Get('/:id')
  find(@Param('id') id: string) {
    return 'User ' + id;
  } */

  // Tìm kiếm và trả về một người dùng duy nhất dựa vào id.
  @Get('/:id')
  find(@Param('id') id: string) {
    return this.userservice.find(+id);
  }

  @Post()
  create(@Body() body: any) {
    return this.userservice.create(body);
  }
  @Delete('/:id')
  delete(@Param('id') id: string) {
    return this.userservice.delete(+id);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    this.userservice.update(+id, body);
  }
}
