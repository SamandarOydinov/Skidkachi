import { PartialType } from '@nestjs/swagger';
import { CreateDiscountTypeDto } from './create-discount_type.dto';

export class UpdateDiscountTypeDto extends PartialType(CreateDiscountTypeDto) {
    name?: string | undefined;
    description?: string | undefined;
}