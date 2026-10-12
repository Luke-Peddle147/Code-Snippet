export interface HttpError {
  message: string;
  statusCode: number;
}

export type Result<T, E = HttpError> =
  | { data: T; error?: never }
  | { data?: never; error: E };