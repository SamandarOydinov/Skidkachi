import { PartialType } from '@nestjs/swagger';
import { CreateDiscountDto } from './create-discount.dto';

export class UpdateDiscountDto extends PartialType(CreateDiscountDto) {
    store_id?: number | undefined;
    title?: string | undefined;
    description?: string | undefined;
    discount_percent?: number | undefined;
    start_date?: Date | undefined;
    end_date?: Date | undefined;
    category_id?: number | undefined;
    discount_type_id?: number | undefined;
    special_link?: string | undefined;
    discount_value?: string | undefined;
}
