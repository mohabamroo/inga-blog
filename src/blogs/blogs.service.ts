import { Injectable } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

import { PrismaService } from './../services/prisma.service';
import { Blog, Prisma } from '@prisma/client';
@Injectable()
export class BlogsService {
  constructor(private prisma: PrismaService) {}

  create(createBlogDto: CreateBlogDto): Promise<Blog> {
    return this.prisma.blog.create({
      data: createBlogDto,
    });
  }

  findAll(): Promise<Blog[]> {
    return this.prisma.blog.findMany({});
  }

  findOne(id: number) {
    return `This action returns a #${id} blog`;
  }

  update(id: number, updateBlogDto: UpdateBlogDto) {
    return `This action updates a #${id} blog`;
  }

  remove(id: number) {
    return `This action removes a #${id} blog`;
  }
}
