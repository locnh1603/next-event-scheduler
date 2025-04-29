'use server';
import {redirect} from 'next/navigation';
import { cookies } from 'next/headers';
import { toast } from 'sonner';
export interface IRequestBody<T = unknown> {
  payload: T;
  command: string;
}

export interface IResponseBody<T = unknown> {
  payload: T;
  command: string;
}
const customFetch = async (url: string, options = {}) => {
  const cookieStore = await cookies();
  const Cookie = cookieStore.toString();
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(Cookie && { Cookie })
    }
  });
  if (response.status === 200) {
    return response;
  } else if (response.status === 401) {
    toast.error('You dont have permission for this action', {
      duration: 5000,
      position: 'top-right',
      dismissible: true
    });
    redirect('/events');
  } else {
    const { status, statusText } = response;
    const errorMessage = `API error: ${status} ${statusText || ''}`.trim();
    throw new Error(errorMessage);
  }
}
export default customFetch;
