import { Injectable } from '@nestjs/common';
import { CreateDistrictDto } from './dto/create-district.dto';
import { UpdateDistrictDto } from './dto/update-district.dto';
import { InjectModel } from '@nestjs/sequelize';
import { District } from './models/district.model';
import { FileService } from '../file/file.service';

@Injectable()
export class DistrictService {
  constructor(
    @InjectModel(District) private districtModel: typeof District,
    private readonly fileService: FileService
  ) {}
  async create(createDistrictDto: CreateDistrictDto, image: any): Promise<District | null> {
    const fileName = await this.fileService.saveFile(image)
    return this.districtModel.create({...createDistrictDto, image: fileName});
  }

  async findAll(): Promise<District[] | null> {
    return this.districtModel.findAll({ include: { all: true } });
  }

  async findOne(id: number):Promise<District | null> {
    return this.districtModel.findOne({where: {id}, include: {all: true}})
  }

  async update(id: number, updateDistrictDto: UpdateDistrictDto):Promise<District | null> {
    return this.districtModel.update(updateDistrictDto, { where: {id}})[0][1]
  }

  async remove(id: number):Promise<number> {
    return this.districtModel.destroy({where: {id}})
  }
}
