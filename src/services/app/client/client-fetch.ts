'use client';
import { AppError } from '@/utilities/error-handler';
import { toast } from 'sonner';

const customFetch = async (url: string, options = {}) => {
  const response = await fetch(url, {
    credentials: 'include',
    ...options,
  });
  if (response.status === 200) {
    return response;
  } else if (response.status === 401) {
    toast.error('You dont have permission for this action');
    throw new AppError(
      401,
      undefined,
      'Unauthorized: You dont have permission for this action'
    );
  } else {
    throw new AppError(response.status);
  }
};

export { customFetch };
