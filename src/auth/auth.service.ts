import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    const refreshtoken = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRE as any,
    });
    this.userService.saveRefreshToken(refreshtoken, user.id);
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: refreshtoken,
    };
  }
  /*   async verfiyRefreshToken(refreshToken: string) {
const decoded = this.jwtService.decode(refreshToken);
if (!decoded) {
  // throw new UnauthorizedException('Invalid refresh token');
}
return decoded;
  } */
  async verfiyRefreshToken(refreshToken: string) {
    const decoded = this.jwtService.decode(refreshToken);
    console.log(decoded);

    if (decoded) {
      return this.userService.verifyRefreshToken(refreshToken, decoded.sub);
    }

    return false;
  }
}
