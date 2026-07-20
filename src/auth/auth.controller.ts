import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';

import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userservice: UserService,
  ) {}

  @Post('/register')
  register(@Body() userData: any) {
    return this.userservice.createUser(userData);
  }
  // @Post('/login')
  // login(@Body() dataLogin: any) {
  //   const { email, password } = dataLogin;
  //   return this.userservice.validateUser(email, password);
  // }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  // @Get()
  // findAll() {
  //   return this.authService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.authService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
  //   return this.authService.update(+id, updateAuthDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.authService.remove(+id);
  // }
}
