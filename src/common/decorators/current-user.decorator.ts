import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { JwtPayload } from "src/auth/common";

export const CurrentUser = createParamDecorator((data: unknown, ctx: ExecutionContext): JwtPayload => {
    const request = ctx.switchToHttp().getRequest();
    console.log('Current user:', request.user);
    return request.user as JwtPayload;
});