'use client';
import { AppError } from '@/utilities/error-handler';
import { toast } from 'sonner';

/**
 * A custom fetch wrapper for client-side requests.
 * It includes credentials and handles errors gracefully.
 * @param url - The URL to fetch.
 * @param options - The options for the fetch request.
 * @returns A promise that resolves to the response.
 * @throws An AppError if the request fails.
 */
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
    const errorData = await response.json();
    throw new AppError(response.status, errorData, errorData.error || errorData.message || 'Unknown error');
  }
};

export { customFetch };
