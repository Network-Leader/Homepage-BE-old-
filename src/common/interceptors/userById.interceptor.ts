import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserRepository } from 'src/user/user.repository';

@Injectable()
export class UserByIdInterceptor implements NestInterceptor {
  constructor(private readonly userRepository: UserRepository) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const id = request.params.user_id;
    const entity = await this.userRepository.findOne(id);
    if (!entity) {
      throw new NotFoundException('User not found');
    }
    request.entity = entity;
    return next.handle();
  }
}
