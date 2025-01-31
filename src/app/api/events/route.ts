import {NextResponse} from 'next/server';
import dbConnect from '@/app/lib/dbConnect';
import Event from "@/app/models/event.model";

export const GET = async () => {
  await dbConnect();
  const events = await Event.find({});
  return NextResponse.json(events);
}
