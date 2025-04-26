'use client'
import {AppError} from '@/utilities/error-handler';
import { showError } from '@/services/app/client/toaster.service';
const customFetch = async(url: string, options = {}) => {
  const response = await fetch(url, {
    ...options,
  });
  if (response.status === 200) {
    return response;
  } else if (response.status === 401) {
    showError('You dont have permission for this action');
  } else {
    throw new AppError(response.status)
  }
}

export { customFetch }
