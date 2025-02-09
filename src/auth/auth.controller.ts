import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() dto: SignUpDto) {
    return await this.authService.signup(dto);
  }

  @Post('signin')
  async signin(@Body() dto: SignInDto) {
    console.log(dto);
    return await this.authService.signin(dto);
  }
}
