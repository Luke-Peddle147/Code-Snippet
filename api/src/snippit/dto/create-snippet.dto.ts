import { Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import {
  SNIPPET_LANGUAGES,
  type SnippetLanguage,
} from '../snippet-languages.js';
import {
  MAX_TAG_LENGTH,
  MAX_TAGS,
  normalizeTags,
  TAG_PATTERN,
} from '../tag-rules.js';

export const MAX_CODE_LENGTH = 512 * 1024;

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

const trimToNull = ({ value }: { value: unknown }) => {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  return trimmed === '' ? null : trimmed;
};

export class CreateSnippetDto {
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  title!: string;

  @Transform(trimToNull)
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string | null;

  @IsIn(SNIPPET_LANGUAGES, {
    message: `language must be one of: ${SNIPPET_LANGUAGES.join(', ')}`,
  })
  language!: SnippetLanguage;

  @IsString()
  @IsNotEmpty()
  @MaxLength(MAX_CODE_LENGTH, {
    message: 'code must be 512 KB or smaller',
  })
  code!: string;

  @IsOptional()
  @IsBoolean()
  isFavorite?: boolean;

  @Transform(({ value }) => normalizeTags(value))
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(MAX_TAGS, { message: `a snippet can have at most ${MAX_TAGS} tags` })
  @IsString({ each: true })
  @MaxLength(MAX_TAG_LENGTH, {
    each: true,
    message: `each tag must be ${MAX_TAG_LENGTH} characters or fewer`,
  })
  @Matches(TAG_PATTERN, {
    each: true,
    message:
      'tags may only contain letters, numbers and + # . - and must start with a letter or number',
  })
  tags?: string[];
}