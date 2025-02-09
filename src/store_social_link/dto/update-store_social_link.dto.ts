import { PartialType } from '@nestjs/swagger';
import { CreateStoreSocialLinkDto } from './create-store_social_link.dto';

export class UpdateStoreSocialLinkDto extends PartialType(CreateStoreSocialLinkDto) {
  url?: string | undefined;
  description?: string | undefined;
  social_link_id?: number | undefined;
}