import { Injectable } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Store } from './models/store.model';

@Injectable()
export class StoreService {
  constructor(@InjectModel(Store) private readonly storeModel: typeof Store) {}
  create(createStoreDto: CreateStoreDto) {
    return this.storeModel.create(createStoreDto)
  }

  findAll() {
    return this.storeModel.findAll()
  }

  findOne(id: number) {
    return this.storeModel.findOne({where: {id}})
  }

  update(id: number, updateStoreDto: UpdateStoreDto) {
    return this.storeModel.update(updateStoreDto, {where: {id}})[1][0]
  }

  remove(id: number) {
    return this.storeModel.destroy({where: {id}})
  }
}
