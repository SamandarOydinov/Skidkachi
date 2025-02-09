import { PartialType } from '@nestjs/swagger';
import { CreateCategoryDto } from './create-category.dto';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
    name?: string | undefined;
    description?: string | undefined;
    parent_category_id?: number | undefined;
}