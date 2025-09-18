import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/user-local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AppConfig } from 'src/config/config.schema';

@Module({

  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: AppConfig.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    })],

  controllers: [AuthController],

  providers: [AuthService, LocalStrategy, JwtStrategy],

})

export class AuthModule { }
