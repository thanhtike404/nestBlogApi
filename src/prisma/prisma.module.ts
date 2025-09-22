import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { MongoPrismaService } from './mongo-prisma.service';
@Module({
  providers: [PrismaService,MongoPrismaService],
  exports: [PrismaService,MongoPrismaService], // Export the service here
})
export class PrismaModule {}
