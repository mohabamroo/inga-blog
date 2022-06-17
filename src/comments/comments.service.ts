import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from 'src/services/prisma.service';

import { Comment } from '@prisma/client';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  create(createCommentDto: CreateCommentDto) {
    return this.prisma.comment.create({
      data: createCommentDto,
    });
  }

  findAll(params: {
    skip?: number;
    take?: number;
    postId?: number;
    orderBy?: 'asc' | 'desc';
  }): Promise<Comment[]> {
    const { skip, take, orderBy, postId } = params;
    const or = postId
      ? {
          postId: Number(postId),
        }
      : {};
    return this.prisma.comment.findMany({
      where: {
        ...or,
      },
      take: Number(take) || 10,
      include: {
        author: true,
      },
      skip: Number(skip) || undefined,
      orderBy: {
        createdAt: orderBy,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.comment.findUnique({
      where: { id },
    });
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return this.prisma.comment.update({
      data: updateCommentDto,
      where: {
        id,
      },
    });
  }

  updateUserComment(
    id: number,
    user_id: number,
    updateCommentDto: UpdateCommentDto,
  ) {
    return this.prisma.comment.update({
      data: updateCommentDto,
      where: {
        authId_idx: {
          authorId: user_id,
          id,
        },
      },
    });
  }

  remove(id: number) {
    return this.prisma.comment.delete({
      where: {
        id,
      },
    });
  }

  removeUserComment(id: number, user_id: number) {
    return this.prisma.comment.delete({
      where: {
        authId_idx: {
          authorId: user_id,
          id,
        },
      },
    });
  }
}
