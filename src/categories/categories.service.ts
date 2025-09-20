import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from '../prisma/prisma.service';
import { serializeBigInt } from 'src/utils/serialize';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createCategoryDto: CreateCategoryDto) {
    const { name, slug } = createCategoryDto;
    if (!name || !slug)
      throw new BadRequestException('name and slug are required');
    // check unique slug only when provided
    if (typeof slug === 'string' && slug.length > 0) {
      const existing = await this.prisma.categories.findUnique({
        where: { slug },
      });
      if (existing)
        throw new ConflictException('Category with this slug already exists');
    }
    try {
      const created = await this.prisma.categories.create({
        data: {
          name,
          slug,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });
      return serializeBigInt(created);
    } catch {
      throw new InternalServerErrorException('Failed to create category');
    }
  }

  async findAll() {
    const categories = await this.prisma.categories.findMany();
    return serializeBigInt(categories);
  }

  async findOne(id: number) {
    const category = await this.prisma.categories.findUnique({
      where: { id: BigInt(id) },
    });
    if (!category)
      throw new NotFoundException(`Category with ID ${id} not found`);
    return serializeBigInt(category);
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const existing = await this.prisma.categories.findUnique({
      where: { id: BigInt(id) },
    });
    if (!existing)
      throw new NotFoundException(`Category with ID ${id} not found`);

    if (updateCategoryDto.slug && updateCategoryDto.slug !== existing.slug) {
      const slugExists = await this.prisma.categories.findUnique({
        where: { slug: updateCategoryDto.slug },
      });
      if (slugExists)
        throw new ConflictException('Category slug already in use');
    }

    try {
      const updated = await this.prisma.categories.update({
        where: { id: BigInt(id) },
        data: {
          ...updateCategoryDto,
          updated_at: new Date(),
        },
      });
      return serializeBigInt(updated);
    } catch {
      throw new InternalServerErrorException('Failed to update category');
    }
  }

  async remove(id: number) {
    const existing = await this.prisma.categories.findUnique({
      where: { id: BigInt(id) },
    });
    if (!existing)
      throw new NotFoundException(`Category with ID ${id} not found`);
    try {
      await this.prisma.categories.delete({ where: { id: BigInt(id) } });
      return { message: `Category with ID ${id} deleted` };
    } catch {
      throw new InternalServerErrorException('Failed to delete category');
    }
  }
}
