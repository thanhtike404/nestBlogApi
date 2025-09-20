import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { ConflictException } from '@nestjs/common';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }
  async create(createUserDto: CreateUserDto) {
    const { email, password, name } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await this.prisma.users.findUnique({
      where: {
        email: email
      }
    })
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
    try {
      const newUser = await this.prisma.users.create({
        data: {
          email,
          password: hashedPassword,
          name,
          created_at: new Date(),
          updated_at: new Date()
        }
      })

      const { password: _, created_at, updated_at, ...result } = newUser;
      return {
        ...result,
        created_at: created_at?.toISOString(),
        updated_at: updated_at?.toISOString()
      };
    } catch (error) {
      throw new InternalServerErrorException('An unexpected error occurred.');
    }
  }

  async findAll() {
    const users = await this.prisma.users.findMany();
    return users.map(user => {
      const { password, created_at, updated_at, ...result } = user;
      return {
        ...result,
        created_at: created_at?.toISOString(),
        updated_at: updated_at?.toISOString()
      };
    });
  }


  async findOne(id: number) {
    const user = await this.prisma.users.findUnique({
      where: {
        id: BigInt(id),
      },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const { password, created_at, updated_at, ...result } = user;
    return {
      ...result,
      id: Number(result.id),
      created_at: created_at?.toISOString(),
      updated_at: updated_at?.toISOString()
    };
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    // Check if user exists and is not soft deleted
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser || existingUser.deletedAt) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Check for email uniqueness if email is being updated
    if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
      const emailExists = await this.prisma.user.findUnique({
        where: { email: updateUserDto.email },
      });
      if (emailExists && !emailExists.deletedAt) {
        throw new ConflictException('Email is already in use by another user');
      }
    }

    // Check for username uniqueness if username is being updated
    if (updateUserDto.username && updateUserDto.username !== existingUser.username) {
      const usernameExists = await this.prisma.user.findUnique({
        where: { username: updateUserDto.username },
      });
      if (usernameExists && !usernameExists.deletedAt) {
        throw new ConflictException('Username is already in use by another user');
      }
    }

    try {
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: updateUserDto,
      });

      const { passwordHash, createdAt, deletedAt, ...result } = updatedUser;
      return {
        ...result,
        createdAt: createdAt.toISOString(),
        deletedAt: deletedAt ? (deletedAt as Date).toISOString() : null
      };
    } catch (error) {
      throw new InternalServerErrorException('An unexpected error occurred while updating user');
    }
  }

  async remove(id: number) {
    // Check if user exists and is not already soft deleted
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser || existingUser.deletedAt) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    try {
      const softDeletedUser = await this.prisma.user.update({
        where: { id },
        data: {
          deletedAt: new Date()
        }
      });

      return {
        message: `User with ID ${id} has been successfully soft deleted`,
        deletedUserId: id,
        deletedAt: softDeletedUser.deletedAt ? (softDeletedUser.deletedAt as Date).toISOString() : null
      };
    } catch (error) {
      throw new InternalServerErrorException('An unexpected error occurred while deleting user');
    }
  }

  async restore(id: number) {
    // Check if user exists and is soft deleted
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (!existingUser.deletedAt) {
      throw new ConflictException(`User with ID ${id} is not deleted`);
    }

    try {
      const restoredUser = await this.prisma.user.update({
        where: { id },
        data: {
          deletedAt: null
        }
      });

      const { passwordHash, createdAt, deletedAt, ...result } = restoredUser;
      return {
        ...result,
        createdAt: createdAt.toISOString(),
        deletedAt: deletedAt ? (deletedAt as Date).toISOString() : null,
        message: `User with ID ${id} has been successfully restored`
      };
    } catch (error) {
      throw new InternalServerErrorException('An unexpected error occurred while restoring user');
    }
  }

  async findDeleted() {
    const deletedUsers = await this.prisma.user.findMany({
      where: {
        deletedAt: {
          not: null
        }
      }
    });
    return deletedUsers.map(user => {
      const { passwordHash, createdAt, deletedAt, ...result } = user;
      return {
        ...result,
        createdAt: createdAt.toISOString(),
        deletedAt: deletedAt ? (deletedAt as Date).toISOString() : null
      };
    });
  }
}
