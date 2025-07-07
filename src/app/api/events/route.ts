import { NextRequest, NextResponse } from 'next/server';
import {
  IRequestBody,
  IResponseBody,
} from '@/services/app/server/server-fetch';
import { EventCommands } from '@/enums/event.enum';
import { eventValidators } from '@/app/api/events/event.validator';
import { handleError } from '@/app/api/api-error-handler';
import { eventService } from '@/services/api/event.service';
import { createClient } from '@/lib/supabase/server';
import { mapEventToDTO } from '@/utilities/data-mapper';

const handleGetInvitation = async (reqData: IRequestBody) => {
  const validatedData = eventValidators.getInvitation.safeParse(reqData);
  if (!validatedData.success) {
    return NextResponse.json(
      { message: 'Validation error', errors: validatedData.error.errors },
      { status: 400 }
    );
  }
  const payload = await eventService.getEventInvitation(
    validatedData.data.payload.id
  );
  return { payload };
};

const handleGetEventByInvitationId = async (reqData: IRequestBody) => {
  const validatedData =
    eventValidators.getEventByInvitationId.safeParse(reqData);
  if (!validatedData.success) {
    return NextResponse.json(
      { message: 'Validation error', errors: validatedData.error.errors },
      { status: 400 }
    );
  }
  const payload = await eventService.getEventByInvitationId(
    validatedData.data.payload.token
  );
  return { payload };
};

const handleGetInvitationsByEventId = async (reqData: IRequestBody) => {
  const validatedData =
    eventValidators.getInvitationsByEventId.safeParse(reqData);
  if (!validatedData.success) {
    return NextResponse.json(
      { message: 'Validation error', errors: validatedData.error.errors },
      { status: 400 }
    );
  }
  const payload = await eventService.getEventInvitationsByEventId(
    validatedData.data.payload.eventId
  );
  return { payload };
};

const handleGetEvents = async (reqData: IRequestBody) => {
  const validatedData = eventValidators.getEvents.safeParse(reqData);
  if (!validatedData.success) {
    return NextResponse.json(
      { message: 'Validation error', errors: validatedData.error.errors },
      { status: 400 }
    );
  }
  const payload = await eventService.getEvents(validatedData.data.payload.ids);
  return { payload };
};

const handleCreateEvent = async (reqData: IRequestBody, userId: string) => {
  const validatedData = eventValidators.createEvent.safeParse(reqData);
  if (!validatedData.success) {
    return NextResponse.json(
      { message: 'Validation error', errors: validatedData.error.errors },
      { status: 400 }
    );
  }
  console.log('received data', validatedData.data.payload, userId);
  const dto = mapEventToDTO({
    ...validatedData.data.payload,
    createdBy: userId,
  });
  console.log('DTO:', dto);
  const payload = await eventService.createEvent(dto, userId);
  return { payload };
};

const handleGetDashboardEvents = async (userId: string | undefined) => {
  const payload = await eventService.getDashboardEvents(userId);
  return { payload };
};

const handleFilterEvents = async (reqData: IRequestBody, userId: string) => {
  const validatedData = eventValidators.filterEvents.safeParse(reqData);
  if (!validatedData.success) {
    return NextResponse.json(
      { message: 'Validation error', errors: validatedData.error.errors },
      { status: 400 }
    );
  }
  const {
    searchParam = '',
    page = 1,
    limit = 10,
    sortField = 'created_at',
    sortOrder = 'desc',
  } = validatedData.data.payload;
  const payload = await eventService.filterEvents({
    searchParam,
    page,
    limit,
    sortField,
    sortOrder,
    createdBy: userId,
  });
  return { payload };
};

const handleUpdateEventDetails = async (reqData: IRequestBody) => {
  const validatedData = eventValidators.updateEventDetails.safeParse(reqData);
  if (!validatedData.success) {
    return NextResponse.json(
      { message: 'Validation error', errors: validatedData.error.errors },
      { status: 400 }
    );
  }
  const { id, ...rest } = validatedData.data.payload;
  const dto = mapEventToDTO(rest);
  const payload = await eventService.updateEvent(id, dto);
  return { payload };
};

const handleGetParticipants = async (reqData: IRequestBody) => {
  const validatedData = eventValidators.getParticipants.safeParse(reqData);
  if (!validatedData.success) {
    return NextResponse.json(
      { message: 'Validation error', errors: validatedData.error.errors },
      { status: 400 }
    );
  }
  const payload = await eventService.getParticipants(
    validatedData.data.payload.eventId
  );
  return { payload };
};

const handleJoinEvent = async (reqData: IRequestBody, userId: string) => {
  const validatedData = eventValidators.joinEvent.safeParse(reqData);
  if (!validatedData.success) {
    return NextResponse.json(
      { message: 'Validation error', errors: validatedData.error.errors },
      { status: 400 }
    );
  }
  const payload = await eventService.joinEvent(
    validatedData.data.payload.eventId,
    userId
  );
  return { payload };
};

const handleInviteUsers = async (reqData: IRequestBody) => {
  const validatedData = eventValidators.inviteUsers.safeParse(reqData);
  if (!validatedData.success) {
    return NextResponse.json(
      { message: 'Validation error', errors: validatedData.error.errors },
      { status: 400 }
    );
  }
  const payload = await eventService.inviteUsers(
    validatedData.data.payload.eventId,
    validatedData.data.payload.userIds
  );
  return { payload };
};

const handleInviteEmails = async (reqData: IRequestBody, userId: string) => {
  const validatedData = eventValidators.inviteEmails.safeParse(reqData);
  if (!validatedData.success) {
    return NextResponse.json(
      { message: 'Validation error', errors: validatedData.error.errors },
      { status: 400 }
    );
  }
  const payload = await eventService.inviteByEmails(
    validatedData.data.payload.eventId as string,
    userId,
    validatedData.data.payload.emails as string[]
  );
  return { payload };
};

const handleAcceptInvitation = async (reqData: IRequestBody) => {
  const validatedData = eventValidators.acceptInvitation.safeParse(reqData);
  if (!validatedData.success) {
    return NextResponse.json(
      { message: 'Validation error', errors: validatedData.error.errors },
      { status: 400 }
    );
  }
  const payload = await eventService.acceptInvitation(
    validatedData.data.payload.token
  );
  return { payload };
};

const handleDeclineInvitation = async (reqData: IRequestBody) => {
  const validatedData = eventValidators.declineInvitation.safeParse(reqData);
  if (!validatedData.success) {
    return NextResponse.json(
      { message: 'Validation error', errors: validatedData.error.errors },
      { status: 400 }
    );
  }
  const payload = await eventService.declineInvitation(
    validatedData.data.payload.token
  );
  return { payload };
};

export const GET = async (req: NextRequest) => {
  console.log('GET request received for events', req);
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const userId = data.user?.id;

  const events = await supabase
    .from('events')
    .select('id, title, description, start_time, end_time')
    .eq('created_by', userId);
  return NextResponse.json(events.data);
};

export const POST = async (req: NextRequest) => {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const userId = user?.id;
    const reqData: IRequestBody = await req.json();
    const { command } = reqData;
    const response: IResponseBody = {
      command,
      payload: null,
    };

    const userRequiredCommands: EventCommands[] = [
      EventCommands.getEvents,
      EventCommands.createEvent,
      EventCommands.getDashboardEvents,
      EventCommands.filterEvents,
      EventCommands.joinEvent,
      EventCommands.inviteUsers,
      EventCommands.inviteEmails,
      EventCommands.getEventByInvitationId,
    ];

    if (userRequiredCommands.includes(command as EventCommands) && !userId) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    let result;
    switch (command as EventCommands) {
      case EventCommands.getEvents:
        result = await handleGetEvents(reqData);
        break;
      case EventCommands.createEvent:
        result = await handleCreateEvent(reqData, userId as string);
        break;
      case EventCommands.getDashboardEvents:
        result = await handleGetDashboardEvents(userId);
        break;
      case EventCommands.filterEvents:
        result = await handleFilterEvents(reqData, userId as string);
        break;
      case EventCommands.updateEventDetails:
        result = await handleUpdateEventDetails(reqData);
        break;
      case EventCommands.getParticipants:
        result = await handleGetParticipants(reqData);
        break;
      case EventCommands.joinEvent:
        result = await handleJoinEvent(reqData, userId as string);
        break;
      case EventCommands.inviteUsers:
        result = await handleInviteUsers(reqData);
        break;
      case EventCommands.getInvitation:
        result = await handleGetInvitation(reqData);
        break;
      case EventCommands.inviteEmails:
        result = await handleInviteEmails(reqData, userId as string);
        break;
      case EventCommands.getEventByInvitationId:
        result = await handleGetEventByInvitationId(reqData);
        break;
      case EventCommands.getInvitationsByEventId:
        result = await handleGetInvitationsByEventId(reqData);
        break;
      case EventCommands.acceptInvitation:
        result = await handleAcceptInvitation(reqData);
        break;
      case EventCommands.declineInvitation:
        result = await handleDeclineInvitation(reqData);
        break;
      default:
        return NextResponse.json(
          { message: 'Invalid command' },
          { status: 400 }
        );
    }

    if (result instanceof NextResponse) {
      return result;
    }

    response.payload = result.payload;
    return NextResponse.json(response);
  } catch (error) {
    return handleError(error);
  }
};
