import { Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { PrismaService } from 'src/services/prisma.service';

@Module({
  controllers: [BlogsController],
  imports:[PrismaService],
  providers: [
    BlogsService,
    PrismaService,
  ],

})
export class BlogsModule {}
