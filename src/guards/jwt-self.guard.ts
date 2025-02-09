import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";



@Injectable()
export class JwtSelfGuard implements CanActivate{
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        // throw new Error("Salom");
        const req = context.switchToHttp().getRequest()
        if(req.user.id != req.params.id){
            throw new ForbiddenException({
                message: "Not allowed"
            })
        }
        //logic
        return true
    }
}