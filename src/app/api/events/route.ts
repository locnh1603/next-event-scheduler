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
    switch (command) {
      case EventCommands.getEvents:
        validatedData = eventValidators.getEvents.parse(reqData);
        response.payload = await supabase
          .from('events')
          .select('id, name, description, start_date, end_date')
          .in('id', validatedData.payload.ids || []);
        break;
      case EventCommands.createEvent:
        validatedData = eventValidators.createEvent.parse(reqData);
        response.payload = await eventService.createEvent(
          validatedData.payload,
          userId || ''
        );
        break;
      case EventCommands.getDashboardEvents:
        try {
          response.payload = await eventService.getDashboardEvents(userId);
        } catch {
          response.payload = await eventService.getDashboardEvents();
        }
        break;
      case EventCommands.filterEvents:
        validatedData = eventValidators.filterEvents.parse(reqData);
        response.payload = await eventService.filterEvents({
          ...validatedData.payload,
          searchParam: validatedData.payload.searchParam || '',
          createdBy: userId || '',
        });
        break;
      case EventCommands.updateEventDetails:
        validatedData = eventValidators.updateEventDetails.parse(reqData);
        response.payload = await eventService.updateEventDetails(
          validatedData.payload
        );
        break;
      case EventCommands.getParticipants:
        validatedData = eventValidators.getParticipants.parse(reqData);
        response.payload = await eventService.getParticipants(
          validatedData.payload.eventId
        );
        break;
      case EventCommands.joinEvent:
        validatedData = eventValidators.joinEvent.parse(reqData);
        response.payload = await eventService.joinEvent(
          validatedData.payload.eventId,
          userId
        );
        break;
      case EventCommands.inviteUsers:
        validatedData = eventValidators.inviteUsers.parse(reqData);
        response.payload = await eventService.inviteUsers(
          validatedData.payload.userIds,
          validatedData.payload.eventId
        );
        break;
      case EventCommands.inviteEmails:
        validatedData = eventValidators.inviteEmails.parse(reqData);
        response.payload = await mailService.inviteEmails(
          validatedData.payload.emails,
          validatedData.payload.eventId,
          userId
        );
        break;
      default:
        return NextResponse.json(
          { message: 'Invalid command' },
          { status: 400 }
        );
    }
    return NextResponse.json(response);
  } catch (error) {
    return handleError(error);
  }
};
