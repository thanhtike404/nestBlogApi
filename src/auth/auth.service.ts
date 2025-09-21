import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private prisma: PrismaService,
    ) { }

    async signIn(email: string, password: string) {
        console.log(email, password, 'user');

        const user = await this.prisma.users.findUniqueOrThrow({
            where: { email },
        });
        console.log(user, 'user');

        // Compare hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return {
            access_token: await this.jwtService.signAsync({
                sub: user.id.toString(),
                email: user.email,
            }),
        };
    }
}
