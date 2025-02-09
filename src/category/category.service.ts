import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './models/category.model';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category) private readonly categoryModel: typeof Category,
  ) {}
  create(createCategoryDto: CreateCategoryDto) {
    return this.categoryModel.create(createCategoryDto);
  }

  findAll() {
    return this.categoryModel.findAll();
  }

  findOne(id: number) {
    return this.categoryModel.findOne({ where: { id } });
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return this.categoryModel.update(updateCategoryDto, { where: { id } })[1][0];
  }

  remove(id: number) {
    return this.categoryModel.destroy({where: {id}})
  }
}
