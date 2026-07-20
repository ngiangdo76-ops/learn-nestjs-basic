import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from 'src/passport/local.strategy';

import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy],
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: 'superSecretKey',
      signOptions: { expiresIn: '1h' },
    }),
  ],
})
export class AuthModule {}
