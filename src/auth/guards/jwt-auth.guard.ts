import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { UserType } from 'src/common/enums';
import { IS_PUBLIC_KEY, ROLES_KEYS } from 'src/common/decorators';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) {
            return true;
        }

        // Call JWT authentication first (returns a Promise!)
        const isAuthenticated = await super.canActivate(context);
        if (!isAuthenticated) return false;

        // Now check roles after JWT validation is complete
        return this.checkRoles(context);
    }

    private checkRoles(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();

        // Debug: Show which route is being called
        const method = request.method;
        const url = request.url;
        const handler = context.getHandler();
        const handlerName = handler.name;

        console.log(`Route: ${method} ${url}`);
        console.log(`Handler: ${handlerName}`);

        // First check method level, then class level
        const requiredRoles = this.reflector.getAllAndOverride<UserType[]>(ROLES_KEYS, [context.getHandler(), context.getClass()]);


        // If no roles required, allow access (JWT already validated)
        if (!requiredRoles) {
            return true;
        }

        const user = request.user;

        if (!user) 
            return false;
        

        // Check if user has the required role
        return requiredRoles.includes(user.userType);
    }
}