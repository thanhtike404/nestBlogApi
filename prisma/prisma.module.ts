// src/prisma/prisma.module.ts
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // 👈 makes it available everywhere (optional, but handy)
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
