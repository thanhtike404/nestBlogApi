
// auth.guard.ts - Fixed version
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        console.log('Full request headers:', request.headers);

        const token = this.extractTokenFromHeader(request);
        if (!token) {
            console.log('No token found in request');
            throw new UnauthorizedException('Token not found');
        }

        console.log('Extracted token:', token);

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: jwtConstants.secret
            });
            console.log('JWT payload:', payload);

            // Assign the payload to the request object
            request['user'] = payload;
        } catch (error) {
            console.log('JWT verification failed:', error.message);
            throw new UnauthorizedException('Invalid token');
        }

        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        console.log('Authorization header:', request.headers.authorization);

        // Check if authorization header exists
        if (!request.headers.authorization) {
            return undefined;
        }

        const [type, token] = request.headers.authorization.split(' ');
        console.log('Token type:', type, 'Token:', token);

        return type === 'Bearer' ? token : undefined;
    }
}