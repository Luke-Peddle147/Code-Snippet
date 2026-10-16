import { Controller, Get } from '@nestjs/common';
import { TagsService, type TagSummary } from './tags.service.js';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  findAll(): Promise<TagSummary[]> {
    return this.tagsService.findAll();
  }
}