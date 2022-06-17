import { Module } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { SharedModule } from 'src/shared/shared.module';
import { UsersService } from './users.service';

@Module({
  imports: [SharedModule],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
