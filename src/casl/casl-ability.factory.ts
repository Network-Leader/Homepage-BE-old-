import { UpdateUserDto } from './../user/dto/update-user.dto';
import { Injectable } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
class UserPolicy {
  checkUserId(user: User, resource: User): boolean {
    return user.id === resource.id;
  }
  checkAdminModifyRole(user: User, dto: UpdateUserDto): boolean {
    return !dto.role || user.admin;
  }
}
@Injectable()
export class CaslAbilityFactory {
  createForUser(): UserPolicy {
    return new UserPolicy();
  }
}
