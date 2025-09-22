import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateBlogPostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from '../prisma/prisma.service';
import { serializeBigInt } from '../utils/serialize';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createPostDto: CreateBlogPostDto) {
    const {
      title,
      slug,
      user_id,
      category_id,
      excerpt,
      featured_image,
      content_blocks,
      seo_meta,
      reading_time,
      is_featured,
      content,
      is_published,
      published_at,
    } = createPostDto;
    // check slug uniqueness only when slug is provided (Prisma requires at least one unique field)
    if (typeof slug === 'string' && slug.length > 0) {
      const existing = await this.prisma.blog_posts.findUnique({
        where: { slug },
      });
      if (existing)
        throw new ConflictException('Post with this slug already exists');
    }

    try {
      const created = await this.prisma.blog_posts.create({
        data: {
          title,
          slug,
          user_id: BigInt(user_id as any),
          category_id: BigInt(category_id as any),
          excerpt,
          featured_image,
          content_blocks,
          seo_meta,
          reading_time,
          is_featured,
          content,
          is_published,
          published_at: published_at ? new Date(published_at) : null,
          created_at: new Date(),
          updated_at: new Date(),
        } as any,
      });
      return serializeBigInt(created);
    } catch {
      throw new InternalServerErrorException('Failed to create post');
    }
  }

  async findAll() {
    const rows = await this.prisma.blog_posts.findMany({
      include: { categories: true, users: true },
    });
    return serializeBigInt(rows);
  }

  async findOne(id: number) {
    const post = await this.prisma.blog_posts.findUnique({
      where: { id: BigInt(id) },
      include: { categories: true, users: true },
    });
    if (!post) throw new NotFoundException(`Post with ID ${id} not found`);
    return serializeBigInt(post);
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const existing = await this.prisma.blog_posts.findUnique({
      where: { id: BigInt(id) },
    });
    if (!existing) throw new NotFoundException(`Post with ID ${id} not found`);

    if (
      (updatePostDto as any).slug &&
      (updatePostDto as any).slug !== existing.slug
    ) {
      const slugExists = await this.prisma.blog_posts.findUnique({
        where: { slug: (updatePostDto as any).slug },
      });
      if (slugExists) throw new ConflictException('Post slug already in use');
    }

    try {
      const updated = await this.prisma.blog_posts.update({
        where: { id: BigInt(id) },
        data: {
          ...updatePostDto,
          updated_at: new Date(),
        } as any,
      });
      return serializeBigInt(updated);
    } catch {
      throw new InternalServerErrorException('Failed to update post');
    }
  }

  async remove(id: number) {
    const existing = await this.prisma.blog_posts.findUnique({
      where: { id: BigInt(id) },
    });
    if (!existing) throw new NotFoundException(`Post with ID ${id} not found`);
    try {
      await this.prisma.blog_posts.delete({ where: { id: BigInt(id) } });
      return { message: `Post with ID ${id} deleted` };
    } catch {
      throw new InternalServerErrorException('Failed to delete post');
    }
  }
}
