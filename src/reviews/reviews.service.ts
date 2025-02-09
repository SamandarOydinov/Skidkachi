import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Review } from './models/review.model';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review) private readonly reviewsModel: typeof Review,
  ) {}
  create(createReviewDto: CreateReviewDto) {
    return this.reviewsModel.create(createReviewDto);
  }

  findAll() {
    return this.reviewsModel.findAll();
  }

  findOne(id: number) {
    return this.reviewsModel.findOne({ where: { id } });
  }

  update(id: number, updateReviewDto: UpdateReviewDto) {
    return this.reviewsModel.update(updateReviewDto, { where: { id } })[1][0];
  }

  remove(id: number) {
    return this.reviewsModel.destroy({ where: { id } });
  }
}
