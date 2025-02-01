import {NextRequest, NextResponse} from 'next/server';
import dbConnect from '@/app/lib/dbConnect';
import Event from "@/app/models/event.model";
import {IResponseBody} from '@/app/models/fetch.model';

export enum eventCommand {
  getEvents = 'getEvents'
}

export const GET = async () => {
  await dbConnect();
  const events = await Event.find({});
  return NextResponse.json(events);
}

export interface IEventDTO {
  ids?: string[];
}

export const POST = async (req: NextRequest) => {
  try {
    await dbConnect();
    const {command, payload}: {command: eventCommand, payload: IEventDTO} = await req.json();
    let response: IResponseBody;
    let responsePayload;
    switch (command) {
      case eventCommand.getEvents:
        const {ids} = payload;
        responsePayload = ids?.length ? await Event.find().where('id').in(ids) : await Event.find({});
        response = {payload: responsePayload, command};
        break;
      default:
        return NextResponse.json({message: 'Invalid command'}, {status: 400});
    }
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({message: error}, {status: 500});
  }
}
