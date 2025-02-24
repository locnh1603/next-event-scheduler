import {NextRequest, NextResponse} from 'next/server';
import Event from "@/models/event.model";
import {IRequestBody, IResponseBody} from '@/utilities/server-fetch';
import {EventCommands} from '@/enums/event.enum';
import dbConnect from '@/lib/dbConnect';
import {auth} from '@/auth';
import {User} from '@/models/user.model';
import { Types } from 'mongoose';
import { eventService } from '@/app/api/events/event.service';
import {eventValidators} from '@/app/api/events/event.validator';
import {ApiError, handleError} from '@/app/api/api-error-handler';

export const GET = async () => {
  await dbConnect();
  const events = await Event.find({});
  return NextResponse.json(events);
}

const getUserId = async() => {
  const AUTH_ERROR = new ApiError(401, 'Unauthorized');
  try {
    const session = await auth();
    if (!session?.user?.email) throw AUTH_ERROR;
    const user = await User.findOne({ email: session.user.email });
    if (!user) throw AUTH_ERROR;
    return new Types.ObjectId(user._id);
  } catch (error) {
    throw error instanceof ApiError ? error : AUTH_ERROR;
  }
}

export const POST = async (req: NextRequest) => {
  try {
    await dbConnect();
    const data: IRequestBody = await req.json();
    const {command} = data;
    const response: IResponseBody = {
      command,
      payload: null
    }
    let validatedData;
    let userId: Types.ObjectId;
    switch (command) {
      case EventCommands.getEvents:
        validatedData = eventValidators.getEvents.parse(data);
        response.payload = await eventService.getEvents(validatedData.payload.ids);
        break;
      case EventCommands.createEvent:
        validatedData = eventValidators.createEvent.parse(data);
        userId = await getUserId();
        response.payload = await eventService.createEvent(validatedData.payload, userId);
        break;
      case EventCommands.getDashboardEvents:
        try {
          userId = await getUserId();
          response.payload = await eventService.getDashboardEvents(userId);
        } catch {
          response.payload = await eventService.getDashboardEvents();
        }
        break;
      case EventCommands.filterEvents:
        validatedData = eventValidators.filterEvents.parse(data);
        userId = await getUserId();
        response.payload = await eventService.filterEvents({
          ...validatedData.payload,
          searchParam: validatedData.payload.searchParam || '',
          createdBy: userId.toString(),
        });
        break;
      case EventCommands.updateEventDetails:
        validatedData = eventValidators.updateEventDetails.parse(data);
        response.payload = await eventService.updateEventDetails(validatedData.payload);
        break;
      default:
        return NextResponse.json({message: 'Invalid command'}, {status: 400});
    }
    return NextResponse.json(response);
  } catch (error) {
    return handleError(error);
  }
}
