import { NextRequest, NextResponse } from 'next/server';
import {
  IRequestBody,
  IResponseBody,
} from '@/services/app/server/server-fetch';
import { EventCommands } from '@/enums/event.enum';
import { eventValidators } from '@/app/api/events/event.validator';
import { handleError } from '@/app/api/api-error-handler';
import { eventService } from '@/services/api/event.service';
import { mailService } from '@/services/api/mail.service';
import { createClient } from '@/lib/supabase/server';

const supabase = await createClient();

export const GET = async () => {
  const { data } = await supabase.auth.getUser();
  const userId = data.user?.id;
  const events = await supabase
    .from('events')
    .select('id, name, description, start_date, end_date')
    .eq('user_id', userId);
  return NextResponse.json(events.data);
};

export const POST = async (req: NextRequest) => {
  try {
    const { data } = await supabase.auth.getUser();
    const userId = data.user?.id;
    const reqData: IRequestBody = await req.json();
    const { command } = reqData;
    const response: IResponseBody = {
      command,
      payload: null,
    };
    let validatedData;
    // Commands that require userId
    const userRequiredCommands: EventCommands[] = [
      EventCommands.getEvents,
      EventCommands.createEvent,
      EventCommands.getDashboardEvents,
      EventCommands.filterEvents,
      EventCommands.joinEvent,
      EventCommands.inviteUsers,
      EventCommands.inviteEmails,
    ];

    // Type guard for userId
    if (userRequiredCommands.includes(command as EventCommands) && !userId) {
      return NextResponse.json(
      { message: 'Not authorized' },
      { status: 401 }
      );
    }

    // Type-safe switch block
    switch (command as EventCommands) {
      case EventCommands.getEvents: {
      validatedData = eventValidators.getEvents.safeParse(reqData);
      if (!validatedData.success) {
        return NextResponse.json(
        { message: 'Validation error', errors: validatedData.error.errors },
        { status: 400 }
        );
      }
      response.payload = await supabase
        .from('events')
        .select('id, name, description, start_date, end_date')
        .in('id', (validatedData.data.payload.ids ?? []) as string[]);
      break;
      }
      case EventCommands.createEvent: {
      validatedData = eventValidators.createEvent.safeParse(reqData);
      if (!validatedData.success) {
        return NextResponse.json(
        { message: 'Validation error', errors: validatedData.error.errors },
        { status: 400 }
        );
      }
      response.payload = await eventService.createEvent(
        validatedData.data.payload,
        userId as string
      );
      break;
      }
      case EventCommands.getDashboardEvents: {
      try {
        response.payload = await eventService.getDashboardEvents(userId as string);
      } catch {
        response.payload = await eventService.getDashboardEvents();
      }
      break;
      }
      case EventCommands.filterEvents: {
      validatedData = eventValidators.filterEvents.safeParse(reqData);
      if (!validatedData.success) {
        return NextResponse.json(
        { message: 'Validation error', errors: validatedData.error.errors },
        { status: 400 }
        );
      }
      response.payload = await eventService.filterEvents({
        ...validatedData.data.payload,
        searchParam: validatedData.data.payload.searchParam || '',
        createdBy: (userId ?? '').toString(),
      });
      break;
      }
      case EventCommands.updateEventDetails: {
      validatedData = eventValidators.updateEventDetails.safeParse(reqData);
      if (!validatedData.success) {
        return NextResponse.json(
        { message: 'Validation error', errors: validatedData.error.errors },
        { status: 400 }
        );
      }
      response.payload = await eventService.updateEventDetails(
        validatedData.data.payload
      );
      break;
      }
      case EventCommands.getParticipants: {
      validatedData = eventValidators.getParticipants.safeParse(reqData);
      if (!validatedData.success) {
        return NextResponse.json(
        { message: 'Validation error', errors: validatedData.error.errors },
        { status: 400 }
        );
      }
      response.payload = await eventService.getParticipants(
        validatedData.data.payload.eventId as string
      );
      break;
      }
      case EventCommands.joinEvent: {
      validatedData = eventValidators.joinEvent.safeParse(reqData);
      if (!validatedData.success) {
        return NextResponse.json(
        { message: 'Validation error', errors: validatedData.error.errors },
        { status: 400 }
        );
      }
      response.payload = await eventService.joinEvent(
        validatedData.data.payload.eventId as string,
        userId as string
      );
      break;
      }
      case EventCommands.inviteUsers: {
      validatedData = eventValidators.inviteUsers.safeParse(reqData);
      if (!validatedData.success) {
        return NextResponse.json(
        { message: 'Validation error', errors: validatedData.error.errors },
        { status: 400 }
        );
      }
      response.payload = await eventService.inviteUsers(
        validatedData.data.payload.userIds as string[],
        validatedData.data.payload.eventId as string
      );
      break;
      }
      case EventCommands.inviteEmails: {
      validatedData = eventValidators.inviteEmails.safeParse(reqData);
      if (!validatedData.success) {
        return NextResponse.json(
        { message: 'Validation error', errors: validatedData.error.errors },
        { status: 400 }
        );
      }
      response.payload = await mailService.inviteEmails(
        validatedData.data.payload.emails as string[],
        validatedData.data.payload.eventId as string,
        userId as string
      );
      break;
      }
      default:
      return NextResponse.json(
        { message: 'Invalid command' },
        { status: 400 }
      );
    }
    }
    return NextResponse.json(response);
  } catch (error) {
    return handleError(error);
  }
};
