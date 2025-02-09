import { PartialType } from '@nestjs/swagger';
import { CreatePhotoDto } from './create-photo.dto';

export class UpdatePhotoDto extends PartialType(CreatePhotoDto) {
    url?: string | undefined;
    discount_id?: number | undefined;
}