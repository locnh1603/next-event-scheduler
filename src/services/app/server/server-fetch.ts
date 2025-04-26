'use server';
import {redirect} from 'next/navigation';
import {AppError} from '@/utilities/error-handler';
import { cookies } from 'next/headers';
import { showError } from '@/services/app/client/toaster.service';
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
    showError('You dont have permission for this action');
    redirect('/events');
  } else {
    throw new AppError(response.status)
  }
}
export default customFetch;
