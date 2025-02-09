import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SignInDto } from './dto/signin.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: "Yangi foydalanuvchini ro'yxatdan o'tkazish" })
  @ApiResponse({
    status: 201,
    description: "Ro'yxatdan o'tgan Foydalanuvchi",
    type: String,
  })
  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @ApiOperation({ summary: "Tizimga kirish" })
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signIn(@Body() signInDto: SignInDto,
  @Res({ passthrough: true }) res: Response) {
    return this.authService.signIn(signInDto, res);
  }
}
