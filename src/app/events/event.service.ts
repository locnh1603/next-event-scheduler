import {IRequestBody, IResponseBody} from '@/utilities/fetch-util';
import {EventModel} from '@/models/event.model';
import {AppError} from '@/utilities/error-handler';

const sendEventRequest = async(body: IRequestBody, cookie?: string): Promise<EventModel> => {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new AppError(500, {}, 'API URL not configured');
  }
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(cookie && { Cookie: cookie })
      },
      body: JSON.stringify(body)
    });
    if (!response.ok) {
      throw new AppError(response.status, await response.json().catch(() => null));
    }
    const data: IResponseBody<EventModel> = await response.json();
    if (!data.payload) {throw new AppError(400, data);}
    return data.payload;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(500 , error);
  }
}

export {sendEventRequest}
