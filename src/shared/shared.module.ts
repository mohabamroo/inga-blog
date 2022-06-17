import { Module } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { AirtableService } from './airtable/airtable.service';

@Module({
  imports: [PrismaService, AirtableService],
  providers: [PrismaService, AirtableService],
  exports: [PrismaService, AirtableService],
})
export class SharedModule {}
