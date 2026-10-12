import { PartialType } from '@nestjs/mapped-types';
import { CreateSnippetDto } from './create-snippet.dto.js';

export class UpdateSnippetDto extends PartialType(CreateSnippetDto) {}