import { PartialType } from '@nestjs/swagger';
import { CreateAdminDto } from './create-admin.dto';

export class UpdateAdminDto extends PartialType(CreateAdminDto) {
    name?: string | undefined;
    email?: string | undefined;
    login?: string | undefined;
    hashed_password?: string | undefined;
}