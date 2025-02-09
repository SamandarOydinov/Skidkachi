import { Injectable } from '@nestjs/common';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Discount } from './models/discount.model';

@Injectable()
export class DiscountService {
  constructor(@InjectModel(Discount) private readonly discountModel: typeof Discount) {}
  create(createDiscountDto: CreateDiscountDto) {
    return this.discountModel.create(createDiscountDto)
  }

  findAll() {
    return this.discountModel.findAll()
  }

  findOne(id: number) {
    return this.discountModel.findOne({where: {id}});
  }

  update(id: number, updateDiscountDto: UpdateDiscountDto) {
    return this.discountModel.update(updateDiscountDto, {where: {id}})[1][0]
  }

  remove(id: number) {
    return this.discountModel.destroy({ where: {id}})
  }
}
