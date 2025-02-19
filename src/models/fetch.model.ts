export interface IRequestBody<T = unknown> {
  payload: T;
  command: string;
}

export interface IResponseBody<T = unknown> {
  payload: T;
  command: string;
}

export class ApiError extends Error {
  constructor(
    public status?: number,
    public data?: unknown
  ) {
    super();
    this.name = 'ApiError';
  }
}
