import { Body, Controller, HttpCode, Post, Res } from "@nestjs/common";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { Response } from "express";
import { AdminAuthService } from "./admin_auth.service";
import { CreateAdminDto } from "../admin/dto/create-admin.dto";
import { SignInDto } from "./dto/signIn.dto";

@Controller("admin-auth")
export class AdminAuthController {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  @ApiOperation({ summary: "Yangi adminni ro'yxatdan o'tkazish" })
  @ApiResponse({
    status: 201,
    description: "Ro'yxatdan o'tgan admin",
    type: String,
  })
  @Post("signup")
  async signUp(@Body() createAdminDto: CreateAdminDto) {
    return this.adminAuthService.signUp(createAdminDto);
  }

  @ApiOperation({ summary: "Tizimga kirish" })
  @HttpCode(200)
  @Post("signin")
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.adminAuthService.signIn(signInDto, res);
  }
}
