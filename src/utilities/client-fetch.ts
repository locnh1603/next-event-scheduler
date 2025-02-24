import {AppError} from '@/utilities/error-handler';
import { toast } from 'sonner';

const customFetch = async(url: string, options = {}) => {
  const response = await fetch(url, {
    ...options,
  });
  if (response.status === 200) {
    return response;
  } else if (response.status === 401) {
    toast['error']('You dont have permission for this action', {
      duration: 5000,
      position: 'top-right',
      dismissible: true
    });
  } else {
    throw new AppError(response.status)
  }
}

export { customFetch }
