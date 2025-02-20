import {NextRequest, NextResponse} from 'next/server';
import Event, {EventDTO, FilterEventsDTO, GetEventsDTO, EditEventDetailsDTO} from "@/models/event.model";
import {IRequestBody, IResponseBody} from '@/models/fetch.model';
import {EventCommands} from '@/enums/event.enum';
import {v4} from 'uuid';
import dbConnect from '@/lib/dbConnect';
import {auth} from '@/auth';
import { subDays } from 'date-fns';
import {UserModel} from '@/models/user.model';
import { Types } from 'mongoose';

export const GET = async () => {
  await dbConnect();
  const events = await Event.find({});
  return NextResponse.json(events);
}

const getUserId = async() => {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error('User not authenticated');
  }
  const {user: {email}} = session;
  const user = await UserModel.findOne({email});
  if (!user) {
    throw new Error('User not authenticated');
  }
  return new Types.ObjectId(user._id);
}

const getEvents = async(data: IRequestBody<GetEventsDTO>): Promise<IResponseBody> => {
  try {
    const {payload: {ids}, command} = data;
    const active = true;
    const resPayload = ids?.length ?
      await Event.find({active}).where('id').in(ids) :
      await Event.find({active});
    return {payload: resPayload, command};
  } catch (err) {
    const dbError = err as Error;
    throw new Error(`Database error: ${dbError.message}`);
  }
}

const filterEvents = async(data: IRequestBody<FilterEventsDTO>): Promise<IResponseBody> => {
  try {
    const session = await auth();
    const createdBy = session?.user?.email;
    const {payload: {searchParam, page, limit, sortField, sortOrder, filter: {type}}, command} = data;
    const skip = (page - 1) * limit;
    const sortOptions = {
      [sortField]: sortOrder
    };
    const events = await Event
        .find({
          name:  {
            $regex: searchParam || '',
            $options: 'i'
          },
          type:  {
            $regex: type ? type === 'all' ? '' : type : '',
            $options: 'i'
          },
          createdBy
        })
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .lean();
    const totalCount = events.length;
    const totalPages = Math.ceil(totalCount / limit);
    const currentPage = page;
    const count = events.length;
    return {payload: {events, count, totalCount, totalPages, currentPage}, command};
  } catch (err) {
    const dbError = err as Error;
    throw new Error(`Database error: ${dbError.message}`);
  }
}

const createEvent = async(data: IRequestBody<EventDTO>): Promise<IResponseBody> => {
  try {
    const createdBy = await getUserId();
    const {payload, command} = data;
    const id = v4();
    const active = true;
    const status = 'Pending';
    const resPayload = await Event.create({...payload, id, active, status, createdBy});
    return {payload: resPayload, command};
  } catch (err) {
    const dbError = err as Error;
    throw new Error(`Database error: ${dbError.message}`);
  }
}

const getDashboardEvents = async(data: IRequestBody<GetEventsDTO>) => {
  try {
    const {command} = data;
    const createdBy = await getUserId();
    const yesterdayTimestamp = subDays(new Date(), 1).getTime();
    const [myEvents, hotEvents, recentEvents] = await Promise.all([
      Event.find({createdBy}).limit(6),
      Event.find({interested: {$gt: 10}}).limit(6),
      Event.find({startDate: {$gt: yesterdayTimestamp}}).limit(6)
    ]);
    return {
      command,
      payload: {
        myEvents,
        hotEvents,
        recentEvents
      }
    }
  } catch (err) {
    const dbError = err as Error;
    throw new Error(`Database error: ${dbError.message}`);
  }
}

const updateEventDetails = async(data: IRequestBody<EditEventDetailsDTO>) => {
  try {
    const {
      payload: { id, name, description },
      command,
    } = data;
    const event = await Event.findOneAndUpdate({ id }, {
      name,
      description
    }, {new: true})
    return {
      command,
      payload: {
        event
      }
    }
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
      case EventCommands.getDashboardEvents:
        response = await getDashboardEvents(data as IRequestBody<GetEventsDTO>);
        break;
      case EventCommands.filterEvents:
        response = await filterEvents(data as IRequestBody<FilterEventsDTO>);
        break;
      case EventCommands.updateEventDetails:
        response = await updateEventDetails(data as IRequestBody<EditEventDetailsDTO>);
        break;
      default:
        return NextResponse.json({message: 'Invalid command'}, {status: 400});
    }
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({message: error}, {status: 500});
  }
}
