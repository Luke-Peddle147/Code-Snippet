import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import {
  SNIPPET_LANGUAGES,
  type SnippetLanguage,
} from '../snippet-languages.js';

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
}