import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Admin } from './models/admin.model';
import { FileService } from '../file/file.service';
import { MailService } from '../mail/mail.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin) private adminModel: typeof Admin,
    private readonly fileService: FileService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async getTokens(admin: Admin) {
    const payload = {
      id: admin.id,
      is_active: admin.is_active,
      is_owner: admin.is_creator,
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
  async create(
    createAdminDto: CreateAdminDto,
    image: any,
  ): Promise<Admin | null> {
    const fileName = await this.fileService.saveFile(image);
    const newAdmin = await this.adminModel.create({
      ...createAdminDto,
      image: fileName,
      is_creator: false,
    });
    return newAdmin;
  }

  async findAll(): Promise<Admin[] | null> {
    return this.adminModel.findAll({ include: { all: true } });
  }

  async findOne(id: number): Promise<Admin | null> {
    return this.adminModel.findOne({ where: { id }, include: { all: true } });
  }

  findByEmail(email: string) {
    return this.adminModel.findOne({ where: { email } });
  }

  async update(
    id: number,
    updateAdminDto: UpdateAdminDto,
  ): Promise<Admin | null> {
    return this.adminModel.update(updateAdminDto, { where: { id } })[1][0];
  }

  async updateRefreshToken(id: number, hashed_refreshtoken: string) {
    const updateUser = await this.adminModel.update(
      { hashed_refreshtoken },
      { where: { id } },
    );
    return updateUser;
  }

  async remove(id: number): Promise<number> {
    return this.adminModel.destroy({ where: { id } });
  }

  async addCreator(
    createAdminDto: CreateAdminDto,
    image: any,
  ): Promise<Admin | null> {
    const fileName = await this.fileService.saveFile(image);
    const creator = await this.adminModel.create({
      ...createAdminDto,
      image: fileName,
      is_creator: true,
    });
    await creator.save();
    return creator;
  }
}
