import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';
import {toast} from 'sonner';
import {AppError} from '@/utilities/error-handler';
export interface IRequestBody<T = unknown> {
  payload: T;
  command: string;
}

export interface IResponseBody<T = unknown> {
  payload: T;
  command: string;
}
const fetchWithCookie = async (url: string, options = {}) => {
  const cookieStore = await cookies();
  const Cookie = cookieStore.toString();
  const response = await fetch(url, {
    ...options,
    headers: {
      Cookie
    },
  });
  if (response.status === 200) {
    return response;
  } else if (response.status === 401) {
    toast['error']('You dont have permission for this action', {
      duration: 5000,
      position: 'top-right',
      dismissible: true
    });
    redirect('/events');
  } else {
    throw new AppError(response.status)
  }
}
export default fetchWithCookie;
