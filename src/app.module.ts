import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { BlogsModule } from './blogs/blogs.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { PrismaService } from './services/prisma.service';
import { PostModule } from './post/post.module';
import { SharedModule } from './shared/shared.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    BlogsModule,
    AuthModule,
    UsersModule,
    PostModule,
    SharedModule,
    AuthModule,
    CommentsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    // global authentication
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  exports:[PrismaService]
})
export class AppModule {}
