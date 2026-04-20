import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { AuthUser } from '@05auto/shared';

export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): AuthUser | undefined => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
