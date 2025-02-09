import { PartialType } from '@nestjs/swagger';
import { CreateStoreSubscribeDto } from './create-store_subscribe.dto';

export class UpdateStoreSubscribeDto extends PartialType(CreateStoreSubscribeDto) {
    user_id?: number | undefined;
    store_id?: number | undefined;
    created_at?: Date | undefined;
}