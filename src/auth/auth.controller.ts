
import {
    Body,
    Controller,
    Post,
    HttpCode,
    HttpStatus,
    UseGuards,
    Request
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
    ApiOperation,
    ApiBearerAuth,
    ApiTags
} from '@nestjs/swagger';
import { CreateLoginDto } from './dto/loginDto';
import { AuthGuard } from './auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @HttpCode(HttpStatus.OK)
    @Post()
    @ApiOperation({
        summary: 'Login a user',
        description: 'Authenticates user with email and password and returns JWT token',
    })
    signIn(@Body() signInDto: CreateLoginDto) {
        console.log(signInDto.email, signInDto.password, 'user ');
        return this.authService.signIn(signInDto.email, signInDto.password);
    }

    @Post('profile')
    @UseGuards(AuthGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({
        summary: 'Get user profile',
        description: 'Protected route that returns user profile information',
    })
    profile(@Request() req) {
        console.log('User from token:', req.user);
        return {
            message: 'Protected route accessed successfully',
            user: req.user
        };
    }
}