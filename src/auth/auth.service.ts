import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { SignInDto } from './dto/signin.dto';
import { Response } from 'express';
import  * as bcrypt from "bcrypt"
import { AdminService } from '../admin/admin.service';
import { CreateAdminDto } from '../admin/dto/create-admin.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly adminService: AdminService,
  ) {}
  async signUp(createUserDto: CreateUserDto) {
    const candidate = await this.usersService.findByEmail(createUserDto.email);
    if (candidate) {
      throw new BadRequestException('Bunday foydalanuvchi mavjud');
    }

    const newUser = await this.usersService.create(createUserDto);
    const response = {
      message:
        "Tabriklayman tizimga qo'shildingiz!. Accountingizni activatsiya qilish uchun emailingizga xat yuborildi",
      userId: newUser.id,
    };
    return response;
  }

  async signIn(signInDto: SignInDto, res: Response) {
    const { email, password } = signInDto;
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    if (!user.is_active) {
      throw new BadRequestException('User is not active');
    }
    const isMatchPass = await bcrypt.compare(password, user.hashedPassword);
    if (!isMatchPass) {
      throw new BadRequestException("Email yoki password noto'g'ri");
    }

    const tokens = await this.usersService.getTokens(user);

    const hashedRefreshToken = await bcrypt.hash(tokens.refresh_token, 7);
    const updateUser = await this.usersService.updateRefreshToken(
      user.id,
      hashedRefreshToken,
    );
    if (!updateUser) {
      throw new InternalServerErrorException('Token not found');
    }

    res.cookie('refreshToken', await tokens.refresh_token, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    const response = {
      message: 'User logged in',
      userId: user.id,
      accessToken: tokens.acces_token,
    };
    return response;
  }

  ///////////admin uchun sign IN and UP

  async adminSignUp(createAdminDto: CreateAdminDto) {
    const candidate = await this.adminService.findByEmail(createAdminDto.email);
    if (candidate) {
      throw new BadRequestException('Bunday foydalanuvchi mavjud');
    }

    let image: any = ""
    const newAdmin = await this.adminService.create(createAdminDto, image);
    const response = {
      message:
        "Tabriklayman tizimga qo'shildingiz!. Accountingizni activatsiya qilish uchun emailingizga xat yuborildi",
      AdminId: newAdmin?.id,
    };
    return response;
  }

  async adminSignIn(signInDto: SignInDto, res: Response) {
    const { email, password } = signInDto;
    const admin = await this.adminService.findByEmail(email);
    if (!admin) {
      throw new BadRequestException('Admin not found');
    }
    if (!admin.is_active) {
      throw new BadRequestException('admin is not active');
    }
    const isMatchPass = await bcrypt.compare(password, admin.hashed_password);
    if (!isMatchPass) {
      throw new BadRequestException("Email yoki password noto'g'ri");
    }

    const tokens = await this.adminService.getTokens(admin);

    const hashedRefreshToken = await bcrypt.hash(tokens.refresh_token, 7);
    const updateAdmin = await this.adminService.updateRefreshToken(
      admin.id,
      hashedRefreshToken,
    );
    if (!updateAdmin) {
      throw new InternalServerErrorException('Token not found');
    }

    res.cookie('refreshToken', await tokens.refresh_token, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    const response = {
      message: 'Admin logged in',
      adminId: admin.id,
      accessToken: tokens.acces_token,
    };
    return response;
  }
}