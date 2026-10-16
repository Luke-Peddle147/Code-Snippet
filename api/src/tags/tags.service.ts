import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

export interface TagSummary {
  name: string;
  count: number;
}

@Injectable()
export class TagsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<TagSummary[]> {
    const tags = await this.prisma.tag.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { snippets: true } } },
    });
    return tags.map((tag) => ({ name: tag.name, count: tag._count.snippets }));
  }
}