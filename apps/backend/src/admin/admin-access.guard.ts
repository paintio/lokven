import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class AdminAccessGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const { user } = context.switchToHttp().getRequest();

    if (!user || !['admin', 'moderator'].includes(user.role)) {
      throw new ForbiddenException('Administrator access is required');
    }

    return true;
  }
}
