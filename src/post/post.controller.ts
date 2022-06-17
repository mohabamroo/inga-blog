import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CurrentUser } from '../auth/auth.decorator';
import { Post as PostModel, User } from '@prisma/client';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto, @CurrentUser() user: User) {
    createPostDto.authorId = user.id;

    return this.postService.create(createPostDto);
  }

  @Get()
  async findAll(
    @Query('take') take?: number,
    @Query('skip') skip?: number,
    @Query('search') searchString?: string,
    @Query('orderBy') orderBy?: 'asc' | 'desc',
  ) {
    const posts = await this.postService.findAll({
      skip,
      take,
      searchString,
      orderBy,
    });
    const count = await this.postService.count();
    return {
      results: posts,
      count,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @CurrentUser() user: User,
  ) {
    return this.postService.updateUserPost(+id, user.id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.postService.removeUserPost(+id, user.id);
  }

  @Patch(':id/publish')
  async publishPost(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<PostModel> {
    const postData = await this.postService.updateUserPost(
      Number(id),
      user.id,
      {
        published: true,
      },
    );

    return postData;
  }
}
