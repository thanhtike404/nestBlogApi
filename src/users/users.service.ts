import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { serializeBigInt } from 'src/utils/serialize';
import * as bcrypt from 'bcrypt';
import { ConflictException } from '@nestjs/common';
import { MongoPrismaService } from 'src/prisma/mongo-prisma.service';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService, private prismaMongo: MongoPrismaService) { }
  async create(createUserDto: CreateUserDto) {
    const { email, password, username, fullName, bio, githubUrl, twitterUrl } =
      createUserDto as any;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await this.prisma.users.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
    try {
      const newUser = await this.prisma.users.create({
        data: {
          email,
          password: hashedPassword,
          name: username,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });

      const safe = serializeBigInt(newUser);
      const { password: _, created_at, updated_at, name, id } = safe as any;
      return {
        id: Number(id),
        email: safe.email,
        username: name, // stored as name in DB
        fullName: fullName ?? null,
        bio: bio ?? null,
        githubUrl: githubUrl ?? null,
        twitterUrl: twitterUrl ?? null,
        createdAt: created_at ? new Date(created_at).toISOString() : null,
        deletedAt: null,
      };
    } catch (error) {
      throw new InternalServerErrorException('An unexpected error occurred.');
    }
  }

  async findAll() {
    const users = await this.prisma.users.findMany();
    const safe = serializeBigInt(users) as any[];
    return safe.map((user) => {
      const { password, created_at, updated_at, ...result } = user;
      return {
        ...result,
        created_at: created_at ? new Date(created_at).toISOString() : null,
        updated_at: updated_at ? new Date(updated_at).toISOString() : null,
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
    const safe = serializeBigInt(user) as any;
    const { password, created_at, name: dbName } = safe;
    const createdAtStr = created_at
      ? new Date(created_at).toISOString()
      : new Date().toISOString();
    return {
      id: Number(safe.id),
      email: safe.email,
      username: dbName,
      fullName: null,
      bio: null,
      githubUrl: null,
      twitterUrl: null,
      createdAt: createdAtStr,
      deletedAt: null,
    };
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    // Check if user exists
    const existingUser = await (this.prisma as any).users.findUnique({
      where: { id: BigInt(id) },
    });

    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Check for email uniqueness if email is being updated
    if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
      const emailExists = await (this.prisma as any).users.findUnique({
        where: { email: updateUserDto.email },
      });
      if (emailExists) {
        throw new ConflictException('Email is already in use by another user');
      }
    }

    try {
      const updatedUser = await (this.prisma as any).users.update({
        where: { id: BigInt(id) },
        data: updateUserDto,
      });

      const safe = serializeBigInt(updatedUser) as any;
      const { password, created_at, updated_at, ...result } = safe;
      return {
        ...result,
        created_at: created_at ? new Date(created_at).toISOString() : null,
        updated_at: updated_at ? new Date(updated_at).toISOString() : null,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'An unexpected error occurred while updating user',
      );
    }
  }

  async remove(id: number) {
    // Soft delete: set deletedAt if column exists, otherwise perform hard delete
    const existingUser2 = await (this.prisma as any).users.findUnique({
      where: { id: BigInt(id) },
    });
    if (!existingUser2)
      throw new NotFoundException(`User with ID ${id} not found`);

    try {
      // attempt soft delete if column exists
      if ('deletedAt' in existingUser2) {
        const softDeletedUser = await (this.prisma as any).users.update({
          where: { id: BigInt(id) },
          data: { deletedAt: new Date() },
        });
        const safe = serializeBigInt(softDeletedUser) as any;
        return {
          message: `User with ID ${id} has been successfully soft deleted`,
          deletedUserId: id,
          deletedAt: safe.deletedAt
            ? new Date(safe.deletedAt).toISOString()
            : null,
        };
      }

      // fallback: hard delete
      await (this.prisma as any).users.delete({ where: { id: BigInt(id) } });
      return { message: `User with ID ${id} deleted` };
    } catch (error) {
      throw new InternalServerErrorException(
        'An unexpected error occurred while deleting user',
      );
    }
  }

  async restore(id: number) {
    const existingUser3 = await (this.prisma as any).users.findUnique({
      where: { id: BigInt(id) },
    });
    if (!existingUser3)
      throw new NotFoundException(`User with ID ${id} not found`);
    if (!('deletedAt' in existingUser3))
      throw new ConflictException('Soft delete not supported for users');

    if (!existingUser3.deletedAt)
      throw new ConflictException(`User with ID ${id} is not deleted`);

    try {
      const restoredUser = await (this.prisma as any).users.update({
        where: { id: BigInt(id) },
        data: { deletedAt: null },
      });
      const safe = serializeBigInt(restoredUser) as any;
      const { password, created_at, deletedAt, ...result } = safe;
      return {
        ...result,
        created_at: created_at ? new Date(created_at).toISOString() : null,
        deletedAt: deletedAt ? new Date(deletedAt).toISOString() : null,
        message: `User with ID ${id} has been successfully restored`,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'An unexpected error occurred while restoring user',
      );
    }
  }

  async findDeleted() {
    // list soft deleted users if supported
    const usersWithDeleted = await (this.prisma as any).users.findMany({
      where: { deletedAt: { not: null } },
    });
    const safe = serializeBigInt(usersWithDeleted) as any[];
    return safe.map((user: any) => {
      const { password, created_at, deletedAt, ...result } = user;
      return {
        ...result,
        created_at: created_at ? new Date(created_at).toISOString() : null,
        deletedAt: deletedAt ? new Date(deletedAt).toISOString() : null,
      };
    });
  }
  async findByEmail(email: string) {
    const user = await this.prisma.users.findUnique({
      where: {
        email,
      },
    });
    console.log('User:', user);
    if (!user) {
      return null;
    }
    const safe = serializeBigInt(user) as any;
    const { password, created_at, name: dbName } = safe;
    console.log('Safe user:', safe);
    return {
      email: safe.email,
      password: safe.password,
    };
  }

    async findUserWithPosts(id: number) {
    // 1. Fetch the user and all their related post metadata from PostgreSQL
    const userWithPosts = await this.prisma.users.findUnique({
      where: { id: BigInt(id) },
      include: {
        blog_posts: true, // Include all posts related to this user
      },
    });

    if (!userWithPosts) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // If the user has no posts, we can return early
    if (userWithPosts.blog_posts.length === 0) {
      return serializeBigInt(userWithPosts);
    }

    // 2. Extract the IDs of all the user's posts
    const postIds = userWithPosts.blog_posts.map(post => Number(post.id));

    // 3. Fetch all corresponding content documents from MongoDB in a single, efficient query
    const blogContents = await this.prismaMongo.blog_content.findMany({
      where: {
        postId: {
          in: postIds, // Use the 'in' filter to find all content for the user's posts
        },
      },
    });

    console.log(blogContents)

    // 4. Create a Map for easy lookup of content by its postId
    const contentMap = new Map(
      blogContents.map(content => [content.postId, content]),
    );

    // 5. Combine the data: add the MongoDB content to each PostgreSQL post object
    const postsWithContent = userWithPosts.blog_posts.map(post => {
      const content = contentMap.get(Number(post.id)) || null;
      return {
        ...post,
        content_details: content, // Add the rich content here
      };
    });

   

    // 6. Construct the final response object
    const finalResponse = {
      ...userWithPosts,
      blog_posts: postsWithContent, // Replace the old posts with the enhanced version
    };

    return serializeBigInt(finalResponse);
  }

}
