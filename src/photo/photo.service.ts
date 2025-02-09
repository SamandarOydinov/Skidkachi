import { Injectable } from '@nestjs/common';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Photo } from './models/photo.model';

@Injectable()
export class PhotoService {
  constructor(@InjectModel(Photo) private readonly photoModel: typeof Photo) {}
  create(createPhotoDto: CreatePhotoDto) {
    return this.photoModel.create(createPhotoDto);
  }

  findAll() {
    return this.photoModel.findAll();
  }

  findOne(id: number) {
    return this.photoModel.findOne({ where: { id } });
  }

  update(id: number, updatePhotoDto: UpdatePhotoDto) {
    return this.photoModel.update(updatePhotoDto, { where: { id } })[1][0];
  }

  remove(id: number) {
    return this.photoModel.destroy({ where: { id } });
  }
}
