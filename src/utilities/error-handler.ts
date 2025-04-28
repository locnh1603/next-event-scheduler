'use client'
import { toast } from 'sonner';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';
type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ErrorContext {
  type?: string;
  digest?: string;
  section?: string;
  [key: string]: unknown;
}

export class AppError extends Error {
  constructor(
    public status?: number,
    public data?: unknown,
    message?: string
  ) {
    super(message ?? undefined);
    this.name = 'AppError';
  }
}

class ErrorLogger {
  private logMessage(level: LogLevel, message: string, context?: ErrorContext) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...context,
      requestId: crypto.randomUUID(),
    };

    // Console logging with appropriate level and colors
    const logColors = {
      info: '\x1b[36m', // cyan
      warn: '\x1b[33m', // yellow
      error: '\x1b[31m', // red
      debug: '\x1b[35m', // magenta
    };

    console[level](`${logColors[level]}%s\x1b[0m`, JSON.stringify(logEntry, null, 2));

    return logEntry;
  }

  private showToast(type: ToastType, message: string) {
    toast[type](message, {
      duration: 5000,
      position: 'top-right',
      dismissible: true
    });
  }

  public error(error: unknown, context?: ErrorContext) {
    const errorMessage = error instanceof Error
      ? error.message
      : 'An unexpected error occurred';

    const errorContext = {
      ...(error instanceof Error && {
        name: error.name,
        stack: error.stack,
      }),
      ...context,
    };

    this.logMessage('error', errorMessage, errorContext);
    this.showToast('error', errorMessage);
  }

  public success(message: string, data?: ErrorContext) {
    this.logMessage('info', message, data);
    this.showToast('success', message);
  }

  public warning(message: string, data?: ErrorContext) {
    this.logMessage('warn', message, data);
    this.showToast('warning', message);
  }

  public info(message: string, data?: ErrorContext) {
    this.logMessage('info', message, data);
    this.showToast('info', message);
  }
}

export const errorHandler = new ErrorLogger();
