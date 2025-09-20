import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { PrismaService } from '../prisma/prisma.service';
import { serializeBigInt } from 'src/utils/serialize';

@Injectable()
export class TagsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createTagDto: CreateTagDto) {
    const { name, slug, color, description, official_url } = createTagDto;
    if (!name || !slug)
      throw new BadRequestException('name and slug are required');
    // check slug only if provided
    if (typeof slug === 'string' && slug.length > 0) {
      const existing = await this.prisma.tags.findUnique({ where: { slug } });
      if (existing)
        throw new ConflictException('Tag with this slug already exists');
    }
    try {
      const created = await this.prisma.tags.create({
        data: {
          name,
          slug,
          color,
          description,
          official_url,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });
      return serializeBigInt(created);
    } catch {
      throw new InternalServerErrorException('Failed to create tag');
    }
  }

  async findAll() {
    const rows = await this.prisma.tags.findMany();
    return serializeBigInt(rows);
  }

  async findOne(id: number) {
    const tag = await this.prisma.tags.findUnique({
      where: { id: BigInt(id) },
    });
    if (!tag) throw new NotFoundException(`Tag with ID ${id} not found`);
    return serializeBigInt(tag);
  }

  async update(id: number, updateTagDto: UpdateTagDto) {
    const existing = await this.prisma.tags.findUnique({
      where: { id: BigInt(id) },
    });
    if (!existing) throw new NotFoundException(`Tag with ID ${id} not found`);

    if (updateTagDto.slug && updateTagDto.slug !== existing.slug) {
      const slugExists = await this.prisma.tags.findUnique({
        where: { slug: updateTagDto.slug },
      });
      if (slugExists) throw new ConflictException('Tag slug already in use');
    }

    try {
      const updated = await this.prisma.tags.update({
        where: { id: BigInt(id) },
        data: {
          ...updateTagDto,
          updated_at: new Date(),
        },
      });
      return serializeBigInt(updated);
    } catch {
      throw new InternalServerErrorException('Failed to update tag');
    }
  }

  async remove(id: number) {
    const existing = await this.prisma.tags.findUnique({
      where: { id: BigInt(id) },
    });
    if (!existing) throw new NotFoundException(`Tag with ID ${id} not found`);
    try {
      await this.prisma.tags.delete({ where: { id: BigInt(id) } });
      return { message: `Tag with ID ${id} deleted` };
    } catch {
      throw new InternalServerErrorException('Failed to delete tag');
    }
  }
}
