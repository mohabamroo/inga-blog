import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post, Prisma } from '@prisma/client';
import { AirtableService } from 'src/shared/airtable/airtable.service';

@Injectable()
export class PostService {
  constructor(
    private prisma: PrismaService,
    private airtableService: AirtableService,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const post = await this.prisma.post.create({
      data: createPostDto,
    });
    try {
      const airtableRes = await this.airtableService.createPostRecord(post);

      console.log('saved in airtable');
    } catch (err) {
      console.error('Failed to save on airtable');
    }

    return post;
  }

  findAll(params: {
    skip?: number;
    take?: number;
    searchString?: string;
    cursor?: Prisma.PostWhereUniqueInput;
    orderBy?: 'asc' | 'desc';
  }): Promise<Post[]> {
    const { skip, take, cursor, orderBy, searchString } = params;
    const or = searchString
      ? {
          OR: [
            { title: { contains: searchString } },
            { content: { contains: searchString } },
          ],
        }
      : {};
    return this.prisma.post.findMany({
      where: {
        ...or,
      },
      take: Number(take) || 10,
      skip: Number(skip) || undefined,
      cursor,
      include: {
        author: true,
      },
      orderBy: {
        createdAt: orderBy,
      },
    });
  }

  count(): Promise<number> {
    return this.prisma.post.count();
  }

  findOne(id: number) {
    // TODO handle if empty
    return this.prisma.post.findUnique({
      where: { id },
    });
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return this.prisma.post.update({
      data: updatePostDto,
      where: {
        id,
      },
    });
  }

  updateUserPost(id: number, user_id: number, updatePostDto: UpdatePostDto) {
    return this.prisma.post.update({
      data: updatePostDto,
      where: {
        authId_idx: {
          authorId: user_id,
          id,
        },
      },
    });
  }

  remove(id: number) {
    return this.prisma.post.delete({
      where: {
        id,
      },
    });
  }

  removeUserPost(id: number, user_id: number) {
    return this.prisma.post.delete({
      where: {
        authId_idx: {
          authorId: user_id,
          id,
        },
      },
    });
  }
}
