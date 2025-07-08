'use server';
import { cookies } from 'next/headers';

export interface IRequestBody<T = unknown> {
  payload: T;
  command: string;
}

export interface IResponseBody<T = unknown> {
  payload: T;
  command: string;
}

type CustomFetchOptions = RequestInit & { headers?: Record<string, string> };

/**
 * A custom fetch wrapper for server-side requests.
 * It includes credentials from cookies and handles errors gracefully.
 * @param url - The URL to fetch.
 * @param options - The options for the fetch request.
 * @returns A promise that resolves to the response.
 * @throws An Error if the request fails.
 */
const customFetch = async (url: string, options: CustomFetchOptions = {}) => {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const response = await fetch(url, {
    credentials: 'include',
    headers: {
      Cookie: cookieHeader,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (response.status === 200) {
    return response;
  } else if (response.status === 401) {
    // Only throw, do not call redirect after throw
    throw new Error("You don't have permission for this action");
  } else {
    const { status, statusText } = response;
    const errorMessage = `API error: ${status} ${statusText || ''}`.trim();
    throw new Error(errorMessage);
  }
};

export default customFetch;
