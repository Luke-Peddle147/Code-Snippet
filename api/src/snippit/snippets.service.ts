import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateSnippetDto } from './dto/create-snippet.dto.js';
import { UpdateSnippetDto } from './dto/update-snippet.dto.js';
import {
  SNIPPET_INCLUDE,
  toSnippetResponse,
  type SnippetResponse,
} from './snippet-response.js';

const connectTags = (names: string[]) =>
  names.map((name) => ({ where: { name }, create: { name } }));

@Injectable()
export class SnippetsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<SnippetResponse[]> {
    const snippets = await this.prisma.snippet.findMany({
      orderBy: { createdAt: 'desc' },
      include: SNIPPET_INCLUDE,
    });
    return snippets.map(toSnippetResponse);
  }

  async findOne(id: number): Promise<SnippetResponse> {
    const snippet = await this.prisma.snippet.findUnique({
      where: { id },
      include: SNIPPET_INCLUDE,
    });
    if (!snippet) {
      throw new NotFoundException(`Snippet ${id} not found`);
    }
    return toSnippetResponse(snippet);
  }

  async create({ tags = [], ...data }: CreateSnippetDto): Promise<SnippetResponse> {
    const snippet = await this.prisma.snippet.create({
      data: { ...data, tags: { connectOrCreate: connectTags(tags) } },
      include: SNIPPET_INCLUDE,
    });
    return toSnippetResponse(snippet);
  }

  async update(id: number, { tags, ...data }: UpdateSnippetDto): Promise<SnippetResponse> {
    await this.findOne(id);
    const snippet = await this.prisma.snippet.update({
      where: { id },
      data: {
        ...data,
        ...(tags && { tags: { set: [], connectOrCreate: connectTags(tags) } }),
      },
      include: SNIPPET_INCLUDE,
    });
    if (tags) await this.removeUnusedTags();
    return toSnippetResponse(snippet);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.prisma.snippet.delete({ where: { id } });
    await this.removeUnusedTags();
  }

  private removeUnusedTags() {
    return this.prisma.tag.deleteMany({ where: { snippets: { none: {} } } });
  }
}