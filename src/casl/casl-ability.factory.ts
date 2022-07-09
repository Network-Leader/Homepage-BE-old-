import { Injectable } from '@nestjs/common';
import { Action } from './action.enum';
class EntityPolicy {
  can(action: Action.Modify, user: any, resource: any): boolean {
    //console.log(user);
    //console.log(resource);
    return user.id.toString() === resource.id.toString();
  }
}
@Injectable()
export class CaslAbilityFactory {
  createForEntity(): EntityPolicy {
    return new EntityPolicy();
  }
}
