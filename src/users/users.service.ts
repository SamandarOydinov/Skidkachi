import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as uuid from 'uuid';
import { MailService } from '../mail/mail.service';
import { findUserDto } from './dto/find-user.dto';
import { Op, where } from 'sequelize';
import { BotService } from '../bot/bot.service';
import * as otpGenerator from 'otp-generator';
import { PhoneUserDto } from './dto/phone-user.dto';
import { Otp } from '../otp/models/otp.model';
import { AddMinutesToDate } from '../helpers/addMinutes';
import { timestamp } from 'rxjs';
import { decode, encode } from '../helpers/crypto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { SmsService } from '../sms/sms.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(Otp) private otpModel: typeof Otp,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly botService: BotService,
    private readonly smsService: SmsService,
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
    return this.userModel.findOne({ where: { id } });
  }

  async updateRefreshToken(id: number, hashedRefreshToken: string | null) {
    const updateUser = await this.userModel.update(
      { hashedRefreshToken },
      { where: { id } },
    );
    return updateUser;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userModel.update(updateUserDto, { where: { id } })[1][0];
  }

  remove(id: number) {
    return this.userModel.destroy({ where: { id } });
  }

  async findUser(findUserDto: findUserDto) {
    const { name, email, phone } = findUserDto;
    const where = {};
    if (name) {
      where['name'] = {
        [Op.iLike]: `%${name}`,
      };
    }
    if (email) {
      where['email'] = {
        [Op.iLike]: `%${email}`,
      };
    }
    if (phone) {
      where['phone'] = {
        [Op.like]: `%${phone}`,
      };
    }
    console.log(where);
    const users = await this.userModel.findAll({ where });
    if (!users) {
      throw new NotFoundException('User not found');
    }
    return users;
  }

  async newOtp(phoneUserDto: PhoneUserDto) {
    const phone_number = phoneUserDto.phone;

    const otp = otpGenerator.generate(7, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    const isSend = await this.botService.sendOtp(phone_number, otp);
    if (!isSend) {
      throw new BadRequestException("Avval botttdan ro'yxatdan o'ting");
    }
    const response = await this.smsService.sendSms(phone_number, otp);

    const message =
      `OTP code has been send to ****` +
      phone_number.slice(phone_number.length - 4);
    const now = new Date();
    const expiration_time = AddMinutesToDate(now, 5);
    await this.otpModel.destroy({ where: { phone_number } });
    const newOtpData = await this.otpModel.create({
      id: uuid.v4(),
      otp,
      phone_number,
      expiration_time,
    });

    const details = {
      timestamp: now,
      phone_number,
      otp_id: newOtpData.id,
    };
    const encodedData = await encode(JSON.stringify(details));
    return {
      message: 'OTP botga yuborildi',
      verification_key: encodedData,
      smsMessage: message,
    };
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    const { verification_key, phone: phone_number, otp } = verifyOtpDto;

    const currentDate = new Date();

    const decodedData = await decode(verification_key);
    const details = JSON.parse(decodedData);
    if (details.phone_number != phone_number) {
      throw new BadRequestException('Otp bu raqamga yuborilmagan');
    }
    const resultOtp = await this.otpModel.findByPk(details.otp_id);
    if (resultOtp == null) {
      throw new BadRequestException("Bunday otp yo'q");
    }
    if (resultOtp.verified) {
      throw new BadRequestException('Bu otp avval tekshirilgan');
    }
    if (resultOtp.expiration_time < currentDate) {
      throw new BadRequestException('Bu otpning vaqti tugagan');
    }
    if (resultOtp.otp != otp) {
      throw new BadRequestException('Otp mos emas');
    }
    const user = await this.userModel.update(
      { is_owner: true },
      { where: { phone: phone_number }, returning: true },
    );
    if (!user[1][0]) {
      throw new BadRequestException('Bunday foydalanuvchi mavjud emas');
    }
    await this.otpModel.update(
      { verified: true },
      { where: { id: details.otp_id } },
    );
    return {
      message: "Tabriklayman! siz owner bo'ldingiz",
    };
  }
}
