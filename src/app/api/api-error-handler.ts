import { ZodError } from 'zod';
import { NextResponse } from 'next/server';

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message?: string
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

  // Generic DB error handling for Supabase/Postgres
  return NextResponse.json(
    {
      message: 'Internal Server Error',
      error: (error as Error).message,
    },
    { status: 500 }
  );
}
