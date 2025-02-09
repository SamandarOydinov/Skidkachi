import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Admin } from './models/admin.model';
import { FileModule } from '../file/file.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [SequelizeModule.forFeature([Admin]), FileModule, MailModule],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService]
})
export class AdminModule {}
