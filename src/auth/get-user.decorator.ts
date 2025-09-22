import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// This decorator will extract the user object from the request.
export const GetUser = createParamDecorator(
    (data: string | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        // The user object was attached by the validate() method in JwtStrategy
        const user = request.user;

        // If a property is specified (e.g., @GetUser('id')), return that property.
        // Otherwise, return the whole user object.
        return data ? user?.[data] : user;
    },
);