import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserRepository } from 'src/user/user.repository';

@Injectable()
export class ModifyByIdInterceptor implements NestInterceptor {
  constructor(private readonly userRepository: UserRepository) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const id = request.params.id;
    const entity = await this.userRepository.findOne(id);
    request.entity = entity;
    return next.handle();
  }
}
