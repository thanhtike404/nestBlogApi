import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { UserResponseDto } from './dto/user-response.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @ApiOperation({
    summary: 'Create a new user',
    description:
      'Creates a new user record in the database. The username and email must be unique.', // 3. Add a detailed description
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all users',
    description:
      'Retrieves a list of all registered users. Password information is excluded from the response for security.',
  })
  @ApiOkResponse({
    description: 'List of users retrieved successfully',
    type: [UserResponseDto],
  })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiResponse({
    status: 404,
    description: 'User not found',
    type: String,
  })
  @ApiOkResponse({
    description: 'Success',
    type: UserResponseDto,
  })
  async findOne(@Param('id') id: string): Promise<UserResponseDto | string> {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update user profile',
    description:
      'Updates user profile information. Only provided fields will be updated. Email and username must remain unique across all users. Password updates are not supported through this endpoint for security reasons.',
  })
  @ApiOkResponse({
    description: 'User successfully updated',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    type: String,
  })
  @ApiResponse({
    status: 409,
    description: 'Email or username already exists',
    type: String,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
    type: String,
  })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Soft delete user',
    description:
      'Soft deletes a user by marking them as deleted without removing from database. The user can be restored later. Soft deleted users will not appear in normal queries.',
  })
  @ApiOkResponse({
    description: 'User successfully soft deleted',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'User with ID 1 has been successfully soft deleted',
        },
        deletedUserId: {
          type: 'number',
          example: 1,
        },
        deletedAt: {
          type: 'string',
          format: 'date-time',
          example: '2024-01-15T10:30:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found or already deleted',
    type: String,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error - deletion failed',
    type: String,
  })
  async remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Patch(':id/restore')
  @ApiOperation({
    summary: 'Restore soft deleted user',
    description:
      'Restores a previously soft deleted user, making them active again. Only works on users that have been soft deleted.',
  })
  @ApiOkResponse({
    description: 'User successfully restored',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    type: String,
  })
  @ApiResponse({
    status: 409,
    description: 'User is not deleted',
    type: String,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error - restore failed',
    type: String,
  })
  async restore(@Param('id') id: string) {
    return this.usersService.restore(+id);
  }

  @Get('deleted/all')
  @ApiOperation({
    summary: 'Get all soft deleted users',
    description:
      'Retrieves a list of all soft deleted users. This is typically used for administrative purposes to review or restore deleted users.',
  })
  @ApiOkResponse({
    description: 'List of soft deleted users retrieved successfully',
    type: [UserResponseDto],
  })
  async findDeleted() {
    return this.usersService.findDeleted();
  }
  @Get('by-email/:email')
  @ApiOperation({
    summary: 'Find user by email',
    description: 'Retrieve a user by their email address.',
  })
  @ApiOkResponse({
    description: 'User found',
    type: UserResponseDto,
  })
  async findByEmail(@Param('email') email: string) {
    return this.usersService.findByEmail(email);
  }
}
