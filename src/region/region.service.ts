import { Injectable } from '@nestjs/common';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { Region } from './models/region.model';
import { InjectModel } from '@nestjs/sequelize';
import { FileService } from '../file/file.service';

@Injectable()
export class RegionService {
  constructor(@InjectModel(Region) private regionModel: typeof Region,
  private readonly fileService: FileService
) {}

  async create(createRegionDto: CreateRegionDto, image: any): Promise<Region | null> {
    const fileName = await this.fileService.saveFile(image)
    const newRegion = await this.regionModel.create({...createRegionDto, image: fileName})
    return newRegion
  }

  async findAll(): Promise<Region[] | null> {
    return this.regionModel.findAll({ include: { all: true }})
  }

  async findOne(id: number): Promise<Region | string> {
    const region = await this.regionModel.findOne({where: {id}})
    if(region == null) return `${id} - ID lik region topilmadi`
    return region;
  }

  async update(id: number, updateRegionDto: UpdateRegionDto): Promise<Region | null | string> {
    const region = await this.regionModel.findOne({ where: { id } });
    if (region == null) return `${id} - ID lik region topilmadi`;
    const updatedRegion = await this.regionModel.update(updateRegionDto, {
      where: { id },
      returning: true,
    });
    console.log(updatedRegion);
    return updatedRegion[1][0];
  }

  async remove(id: number): Promise<string> {
    const deletedLang = await this.regionModel.destroy({ where: { id } });
    if (deletedLang) {
      return `${id} - ID lik region o'chirildi`;
    }
    return `${id} - ID lik region topilmadi`;
  }
}
