import { PartialType } from '@nestjs/swagger';
import { CreateStoreDto } from './create-store.dto';

export class UpdateStoreDto extends PartialType(CreateStoreDto) {
    name?: string | undefined;
    location?: string | undefined;
    phone?: string | undefined;
    created_at?: Date | undefined;
    owner_id?: number | undefined;
    store_social_link_id?: number | undefined;
    since?: string | undefined;
    district_id?: number | undefined;
    region_id?: number | undefined;
}