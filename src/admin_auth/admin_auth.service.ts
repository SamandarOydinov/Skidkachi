import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { CreateUserDto } from "../users/dto/create-user.dto";
import * as bcrypt from "bcrypt";
import { Response } from "express";
import { AdminService } from "../admin/admin.service";
import { CreateAdminDto } from "../admin/dto/create-admin.dto";
import { SignInDto } from "./dto/signIn.dto";

@Injectable()
export class AdminAuthService {
  constructor(private readonly adminService: AdminService) {}

  async signUp(createAdminDto: CreateAdminDto) {
    const admin = await this.adminService.findByEmail(createAdminDto.email);
    if (admin) {
      throw new BadRequestException("Bunday admin mavjud");
    }
    const newAdmin = await this.adminService.create(createAdminDto, "");

    return newAdmin;
  }

  async signIn(signInDto: SignInDto, res: Response) {
    const admin = await this.adminService.findByEmail(signInDto.email);
    if (!admin) {
      throw new UnauthorizedException("Eamil yoki password noto'g'ri");
    }
    const isvalidPassword = await bcrypt.compare(
      signInDto.password,
      admin.hashed_password
    );

    if (!isvalidPassword) {
      throw new UnauthorizedException("Eamil yoki password noto'g'ri");
    }
    const tokens = await this.adminService.getTokens(admin);

    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);
    const updatedAdmin = await this.adminService.updateRefreshToken(
      admin.id,
      hashed_refresh_token
    );
    if (!updatedAdmin) {
      throw new InternalServerErrorException("Tokenni saqlashda xatolik");
    }
    res.cookie("refresh_token", tokens.refresh_token, {
      maxAge: 15 * 24 * 60 * 60 * 1000, // process.env.COOKIE_TIME
      httpOnly: true,
    });
    const response = {
      message: "Admin logged in",
      adminId: admin.id,
      access_token: tokens.acces_token,
    };
    return response;
  }
}
