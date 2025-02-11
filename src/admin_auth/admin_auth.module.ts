import { Module } from "@nestjs/common";
import { AdminAuthService } from "./admin_auth.service";
import { AdminAuthController } from "./admin_auth.controller";
import { AdminModule } from "../admin/admin.module";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [AdminModule, JwtModule.register({ global: true })],
  controllers: [AdminAuthController],
  providers: [AdminAuthService],
})
export class AdminAuthModule {}
