import {ZodError} from 'zod';
import {MongooseError} from 'mongoose';
import { NextResponse } from 'next/server';

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function handleError(error: unknown) {
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        message: error.message,
        code: error.statusCode,
      },
      { status: error.statusCode }
    );
  }

  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        message: 'Validation Error',
        errors: error.errors,
      },
      { status: 400 }
    );
  }

  if (error instanceof MongooseError) {
    return NextResponse.json(
      {
        message: 'Database Error',
        error: error.message,
      },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { message: 'Internal Server Error' },
    { status: 500 }
  );
}
