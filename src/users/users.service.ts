import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as uuid from 'uuid';
import { MailService } from '../mail/mail.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async getTokens(user: User) {
    const payload = {
      id: user.id,
      is_active: user.is_active,
      is_owner: user.is_owner,
    };
    const [accesToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.ACCESS_TOKEN_KEY,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_TOKEN_KEY,
        expiresIn: process.env.REFRESH_TOKEN_TIME,
      }),
    ]);
    return {
      acces_token: accesToken,
      refresh_token: refreshToken,
    };
  }

  async create(createUserDto: CreateUserDto) {
    if (createUserDto.password !== createUserDto.confirm_password) {
      throw new BadRequestException('Parollar mos emas!');
    }
    const hashedPassword = await bcrypt.hash(createUserDto.password, 7);
    const activation_link = uuid.v4();
    const newUser = await this.userModel.create({
      ...createUserDto,
      hashedPassword,
      activation_link,
    });
    try {
      await this.mailService.sendMail(newUser);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Xat yuborishda xatolik');
    }

    return newUser;
  }

  async activate(link: string) {
    if (!link) {
      throw new BadRequestException('Activation link not found!');
    }
    const updateUser = await this.userModel.update(
      { is_active: true },
      { where: { activation_link: link, is_active: false }, returning: true },
    );
    if (!updateUser[1][0]) {
      throw new BadRequestException('User already activate!');
    }
    const response = {
      message: 'User activated succesfully',
      user: updateUser[1][0].is_active,
    };
    return response;
  }

  findAll() {
    return this.userModel.findAll({ include: { all: true } });
  }

  findByEmail(email: string) {
    return this.userModel.findOne({ where: { email } });
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async updateRefreshToken(id: number, hashedRefreshToken: string | null){
    const updateUser = await this.userModel.update({hashedRefreshToken}, { where: {id}})
    return updateUser
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return this.userModel.destroy({ where: { id } });
  }
}
