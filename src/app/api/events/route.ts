import {NextRequest, NextResponse} from 'next/server';
import dbConnect from '@/app/lib/dbConnect';
import Event from "@/app/models/event.model";
import {IResponseBody} from '@/app/models/fetch.model';

export const GET = async () => {
  await dbConnect();
  const events = await Event.find({});
  return NextResponse.json(events);
}

export const POST = async (req: NextRequest) => {
  try {
    await dbConnect();
    const {command} = await req.json();
    const payload = await Event.find({});
    const res: IResponseBody<Event[]> = {
      message: command,
      payload
    };
    return NextResponse.json(res);
  } catch (error) {
    return NextResponse.json({message: error}, {status: 500});
  }
}
