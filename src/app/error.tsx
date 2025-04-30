'use client';
import { useEffect } from 'react';
import { Button } from '@/components/button';
import { errorHandler } from '@/utilities/error-handler';
import { env } from '@env';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    errorHandler.error(error, {
      type: 'Global Error Handler',
      digest: error.digest,
      location: window.location.href,
    });
  }, [error]);

  const isDev = env.NEXT_PUBLIC_NODE_ENV === 'development';

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">
          Something went wrong!
        </h2>
        {isDev && (
          <div className="text-sm text-muted-foreground max-w-[500px] p-4 bg-muted rounded-lg">
            <p className="font-medium text-foreground">
              Error: {error.message}
            </p>
            {error.name && (
              <p className="text-xs mt-2">Name: {error.name}</p>
            )}
            {error.digest && (
              <p className="font-mono text-xs mt-2">Digest: {error.digest}</p>
            )}
            {error.stack && (
              <pre className="mt-2 text-xs overflow-x-auto">{error.stack}</pre>
            )}
          </div>
        )}
        <Button
          onClick={reset}
          variant="default"
          className="mt-4"
        >
          Try again
        </Button>
      </div>
    </div>
  );
}
