import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreateBlogPostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiBearerAuth,ApiOperation } from '@nestjs/swagger';
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Post()
   @ApiOperation({
    summary: 'Create a new blog post (Protected)',
    description: 'This endpoint creates a new blog post. A valid JWT token is required for authorization.'
  })
  create(@Body() CreateBlogPostDto: CreateBlogPostDto) {
    return this.postsService.create(CreateBlogPostDto);
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }
 @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Patch(':id')

   @ApiOperation({
    summary: 'Update a blog post (Protected)',
    description: 'This endpoint update a blog post. A valid JWT token is required for authorization.'
  })
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
