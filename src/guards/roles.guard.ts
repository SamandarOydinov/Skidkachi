import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if(!requiredRoles){
        return true
    }
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException({
        message: 'Headerda token berilmagan',
      });
    }

    const bearer = authHeader.split(' ')[0];
    const token = authHeader.split(' ')[1];
    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException({
        message: 'Bearer token berilmagan',
      });
    }
    let user: any;
    try {
      user = this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException({
        message: 'Token verifikation failed!',
      });
    }
    req.user = user; // eng muhim joyi
    console.log(user);
    console.log(requiredRoles);
    const permision = user.role.some((role: any) => {
        return requiredRoles.includes(role.value)})
    if(!permision){
        throw new ForbiddenException({
            message: 'sizga ruxsat etilmagan!'
        })
    }
    return true;
  }
}
