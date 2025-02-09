import { Module } from '@nestjs/common';
import { DistrictService } from './district.service';
import { DistrictController } from './district.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { District } from './models/district.model';
import { FileModule } from '../file/file.module';

@Module({
  imports: [SequelizeModule.forFeature([District]), FileModule],
  controllers: [DistrictController],
  providers: [DistrictService],
})
export class DistrictModule {}
