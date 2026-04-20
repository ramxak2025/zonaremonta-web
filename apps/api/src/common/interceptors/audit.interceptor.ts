import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * Логирует мутационные действия персонала в audit_log.
 * Только для методов POST / PUT / PATCH / DELETE и только если есть req.user.role MASTER|DIRECTOR.
 */
@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly prisma: PrismaService) {}

  intercept(ctx: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = ctx.switchToHttp().getRequest();
    const method: string = req.method;
    const shouldLog = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);

    return next.handle().pipe(
      tap(async () => {
        if (!shouldLog) return;
        const user = req.user;
        if (!user || (user.role !== 'MASTER' && user.role !== 'DIRECTOR')) return;
        try {
          await this.prisma.auditLog.create({
            data: {
              userId: user.id,
              action: `${method} ${req.route?.path ?? req.url}`,
              entity: req.params?.entity,
              entityId: req.params?.id,
              ip: req.ip ?? req.headers['x-forwarded-for']?.toString(),
              userAgent: req.headers['user-agent']?.toString(),
            },
          });
        } catch {
          // не роняем запрос из-за ошибок аудита
        }
      }),
    );
  }
}
