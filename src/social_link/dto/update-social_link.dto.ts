import { PartialType } from '@nestjs/swagger';
import { CreateSocialLinkDto } from './create-social_link.dto';

export class UpdateSocialLinkDto extends PartialType(CreateSocialLinkDto) {
    name?: string | undefined;
    icon?: string | undefined;
}