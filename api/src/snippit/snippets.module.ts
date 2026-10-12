import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { SnippetsController } from './snippets.controller.js';
import { SnippetsService } from './snippets.service.js';

@Module({
  imports: [PrismaModule],
  controllers: [SnippetsController],
  providers: [SnippetsService],
})
export class SnippetsModule {}