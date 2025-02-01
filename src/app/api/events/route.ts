import {NextRequest, NextResponse} from 'next/server';
import dbConnect from '@/app/lib/dbConnect';
import Event, {EventDTO, GetEventsDTO} from "@/app/models/event.model";
import {IRequestBody, IResponseBody} from '@/app/models/fetch.model';
import {EventCommands} from '@/app/enums/event.enum';
import {v4} from 'uuid';

export const GET = async () => {
  await dbConnect();
  const events = await Event.find({});
  return NextResponse.json(events);
}

const getEvents = async(data: IRequestBody<GetEventsDTO>): Promise<IResponseBody> => {
  try {
    const {payload: {ids}, command} = data;
    const resPayload = ids?.length ? await Event.find().where('id').in(ids) : await Event.find({});
    return {payload: resPayload, command};
  } catch (err) {
    const dbError = err as Error;
    throw new Error(`Database error: ${dbError.message}`);
  }
}

const createEvent = async(data: IRequestBody<EventDTO>): Promise<IResponseBody> => {
  try {
    const id = v4();
    const active = true;
    const status = 'Pending';
    const {payload, command} = data;
    const resPayload = await Event.create({...payload, id, active, status});
    return {payload: resPayload, command};
  } catch (err) {
    const dbError = err as Error;
    throw new Error(`Database error: ${dbError.message}`);
  }
}

export const POST = async (req: NextRequest) => {
  try {
    await dbConnect();
    const data: IRequestBody = await req.json();
    let response: IResponseBody;
    switch (data.command) {
      case EventCommands.getEvents:
        response = await getEvents(data as IRequestBody<GetEventsDTO>);
        break;
      case EventCommands.createEvent:
        response = await createEvent(data as IRequestBody<EventDTO>);
        break;
      default:
        return NextResponse.json({message: 'Invalid command'}, {status: 400});
    }
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({message: error}, {status: 500});
  }
}
