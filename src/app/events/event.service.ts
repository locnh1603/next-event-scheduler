import {ApiError, IRequestBody, IResponseBody} from '@/models/fetch.model';
import {EventModel} from '@/models/event.model';

const sendEventRequest = async(body: IRequestBody, cookie?: string): Promise<EventModel> => {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error('API URL not configured');
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
      throw new ApiError(response.status, await response.json().catch(() => null));
    }
    const data: IResponseBody<EventModel> = await response.json();
    if (!data.payload) {throw new ApiError(400, data);}
    return data.payload;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500 , error);
  }
}

export {sendEventRequest}
