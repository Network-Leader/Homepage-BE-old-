import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorator/Roles.decorator';
import { Role } from '../types/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndMerge<Role[]>(ROLES_KEY, [
      context.getHandler(), //context를 get (reference 형태). context = 현재 처리된 route handler에서 추출된 메타데이터(function)
      context.getClass(), //context를 get. context = 현재 처리된 컨트롤러에서 추출된 메타데이터
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    const checkRole = requiredRoles.some((role) => user.role == role);
    if (checkRole) {
      return true;
    } else {
      throw new ForbiddenException('당신은 이 정보를 볼 수 없는 Role 입니다.');
    }
  }
}
