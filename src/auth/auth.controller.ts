import { Controller, Post, Body, Patch, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { Public } from 'src/common/decorators';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtPayload } from './common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';


@Controller('auth')
@UseGuards(JwtAuthGuard)

export class AuthController {
  constructor(private readonly authService: AuthService,
  ) { }

  @Public()

  @Post('signup')
  create(@Body() createAuthDto: SignupDto) {
    return this.authService.signup(createAuthDto);
  }

  @Public()
  @UseGuards(AuthGuard('local-user'), ThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 attempts per minute
  @Post('login')
  login(@Request() req: any) {
    return {
      message: 'Logged in successfully',
      data: req.user
    }

  }

  @Patch('me')
  updateMe(@CurrentUser() user: JwtPayload, @Body() updateAuthDto: UpdateUserDto) {
    return this.authService.update(user.id, updateAuthDto);
  }

}
