import { PartialType } from '@nestjs/swagger';
import { CreateReviewDto } from './create-review.dto';

export class UpdateReviewDto extends PartialType(CreateReviewDto) {
    text?: string | undefined;
    raiting?: number | undefined;
    photo?: string | undefined;
    user_id?: number | undefined;
    discount_id?: number | undefined;
}
