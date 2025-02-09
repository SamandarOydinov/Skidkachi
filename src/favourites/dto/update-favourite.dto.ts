import { PartialType } from '@nestjs/swagger';
import { CreateFavouriteDto } from './create-favourite.dto';

export class UpdateFavouriteDto extends PartialType(CreateFavouriteDto) {
    user_id?: number | undefined;
    discount_id?: number | undefined;
}