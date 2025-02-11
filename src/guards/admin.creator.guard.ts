import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class AdminCreatorGuard implements CanActivate {
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    console.log(req.admin);
    
    if (req.admin.is_creator !=="true") {
      console.log(21);
      
      throw new ForbiddenException({
        message: "Ruxsat etilmagan admin",
      });
    }
    console.log(35);
    
    return true;
  }
}
