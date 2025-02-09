import { Injectable } from '@nestjs/common';
import { CreateStoreSubscribeDto } from './dto/create-store_subscribe.dto';
import { UpdateStoreSubscribeDto } from './dto/update-store_subscribe.dto';
import { InjectModel } from '@nestjs/sequelize';
import { StoreSubscribe } from './models/store_subscribe.model';

@Injectable()
export class StoreSubscribeService {
  constructor(@InjectModel(StoreSubscribe) private readonly storeSubscribeModel: typeof StoreSubscribe) {}
  create(createStoreSubscribeDto: CreateStoreSubscribeDto) {
    return this.storeSubscribeModel.create(createStoreSubscribeDto)
  }

  findAll() {
    return this.storeSubscribeModel.findAll()
  }

  findOne(id: number) {
    return this.storeSubscribeModel.findOne({where: {id}})
  }

  update(id: number, updateStoreSubscribeDto: UpdateStoreSubscribeDto) {
    return this.storeSubscribeModel.update(updateStoreSubscribeDto, {where: {id}})[1][0]
  }

  remove(id: number) {
    return this.storeSubscribeModel.destroy({where: {id}})
  }
}
