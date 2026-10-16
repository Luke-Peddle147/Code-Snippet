import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateSnippetDto } from './dto/create-snippet.dto.js';
import { UpdateSnippetDto } from './dto/update-snippet.dto.js';
import type { SnippetResponse } from './snippet-response.js';
import { SnippetsService } from './snippets.service.js';

@Controller('snippets')
export class SnippetsController {
  constructor(private readonly snippetsService: SnippetsService) {}

  @Get()
  findAll(): Promise<SnippetResponse[]> {
    return this.snippetsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<SnippetResponse> {
    return this.snippetsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateSnippetDto): Promise<SnippetResponse> {
    return this.snippetsService.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSnippetDto,
  ): Promise<SnippetResponse> {
    return this.snippetsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.snippetsService.remove(id);
  }
}