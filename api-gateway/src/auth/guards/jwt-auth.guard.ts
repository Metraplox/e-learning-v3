import { Injectable, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    getRequest(context: ExecutionContext) {
        const ctx = GqlExecutionContext.create(context);
        const req = ctx.getContext().req;
        // Almacenar el token original para uso en microservicios
        if (req.headers.authorization) {
            req.originalToken = req.headers.authorization.split(' ')[1];
        }
        return req;
    }
}