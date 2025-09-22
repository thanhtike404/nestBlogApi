import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { MongoPrismaService } from 'src/prisma/mongo-prisma.service';

@Injectable()
export class CommentsService {
    constructor(private mongoPrisma: MongoPrismaService) { }
  

  create(createCommentDto: CreateCommentDto) {
    return 'This action adds a new comment';
  }

  async findAll() {
    const comments=await this.mongoPrisma.blog_content.findMany();
    return comments
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
