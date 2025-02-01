export interface IRequestBody<T> {
  payload: T;
  command: string;
}

export interface IResponseBody<T> {
  payload: T;
  message: string;
}
