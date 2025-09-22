import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient as PrismaMongoClient } from '@prisma-mongo/prisma/client'

@Injectable()
export class MongoPrismaService extends PrismaMongoClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}