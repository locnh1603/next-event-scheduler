import {auth} from '@/auth';
import {NextResponse} from 'next/server';
import dbConnect from '@/app/lib/dbConnect';
import Event from "@/app/models/event.model";

export const GET = auth(async () => {
  await dbConnect();
  const events = await Event.find({});
  return NextResponse.json(events);
})
