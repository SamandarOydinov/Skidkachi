import { PartialType } from "@nestjs/swagger";
import { CreateUserDto } from "./create-user.dto";
import { IsEmail, IsOptional, IsPhoneNumber, IsString } from "class-validator";

export class findUserDto {
  @IsOptional()
  @IsString()
  name?: string;
  @IsOptional()
  @IsPhoneNumber("UZ")
  phone?: string;
  @IsOptional()
  @IsEmail()
  email?: string;
}
