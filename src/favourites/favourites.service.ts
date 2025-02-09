import { Injectable } from '@nestjs/common';
import { CreateFavouriteDto } from './dto/create-favourite.dto';
import { UpdateFavouriteDto } from './dto/update-favourite.dto';
import { Favourites } from './models/favourite.model';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class FavouritesService {
  constructor(@InjectModel(Favourites) private readonly favouritesModel: typeof Favourites) {}
  create(createFavouriteDto: CreateFavouriteDto) {
    return this.favouritesModel.create(createFavouriteDto)
  }

  findAll() {
    return this.favouritesModel.findAll()
  }

  findOne(id: number) {
    return this.favouritesModel.findOne({where: {id}})
  }

  update(id: number, updateFavouriteDto: UpdateFavouriteDto) {
    return this.favouritesModel.update(updateFavouriteDto, {where: {id}})[1][0]
  }

  remove(id: number) {
    return this.favouritesModel.destroy({where: {id}})
  }
}
