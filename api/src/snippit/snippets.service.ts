import { Injectable, NotFoundException } from '@nestjs/common';
import type { Snippet } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateSnippetDto } from './dto/create-snippet.dto.js';
import { UpdateSnippetDto } from './dto/update-snippet.dto.js';

@Injectable()
export class SnippetsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<Snippet[]> {
    return this.prisma.snippet.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: number): Promise<Snippet> {
    const snippet = await this.prisma.snippet.findUnique({ where: { id } });
    if (!snippet) {
      throw new NotFoundException(`Snippet ${id} not found`);
    }
    return snippet;
  }

  create(dto: CreateSnippetDto): Promise<Snippet> {
    return this.prisma.snippet.create({ data: dto });
  }

  async update(id: number, dto: UpdateSnippetDto): Promise<Snippet> {
    await this.findOne(id);
    return this.prisma.snippet.update({ where: { id }, data: dto });
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.prisma.snippet.delete({ where: { id } });
  }
}