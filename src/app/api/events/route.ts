import { NextRequest, NextResponse } from 'next/server';
import {
  IRequestBody,
  IResponseBody,
} from '@/services/app/server/server-fetch';
import { EventCommands } from '@/enums/event.enum';
import { eventValidators } from '@/app/api/events/event.validator';
import { handleError } from '@/app/api/api-error-handler';
import { createServerClient } from '@supabase/ssr';
import { env } from '@env';

// Create a special client for API routes
const createApiClient = (req: NextRequest) => {
  return createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL!,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll() {
          // API routes don't need to set cookies
        },
      },
    }
  );
};

import type { SupabaseClient } from '@supabase/supabase-js';

const handleGetEvents = async (
  reqData: IRequestBody,
  supabase: SupabaseClient
) => {
  const validatedData = eventValidators.getEvents.safeParse(reqData);
  if (!validatedData.success) {
    return NextResponse.json(
      { message: 'Validation error', errors: validatedData.error.errors },
      { status: 400 }
    );
  }
  const payload = await supabase
    .from('events')
    .select('id, title, description, start_time, end_time')
    .in('id', (validatedData.data.payload.ids ?? []) as string[]);
  return { payload };
};

const handleCreateEvent = async (
  reqData: IRequestBody,
  userId: string,
  supabase: SupabaseClient
) => {
  const validatedData = eventValidators.createEvent.safeParse(reqData);
  if (!validatedData.success) {
    return NextResponse.json(
      { message: 'Validation error', errors: validatedData.error.errors },
      { status: 400 }
    );
  }
  // Create event directly with supabase instead of using eventService
  const payload = await supabase
    .from('events')
    .insert({
      ...validatedData.data.payload,
      id: Date.now().toString(),
      created_by: userId,
    })
    .select();
  return { payload };
};

const handleGetDashboardEvents = async (
  userId: string | undefined,
  supabase: SupabaseClient
) => {
  const newEventsPromise = supabase
    .from('events')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);

  const myEventsPromise = userId
    ? supabase
        .from('events')
        .select('*')
        .eq('created_by', userId)
        .order('created_at', { ascending: false })
        .limit(10)
    : Promise.resolve({ data: [] });

  const [newEventsRes, myEventsRes] = await Promise.all([
    newEventsPromise,
    myEventsPromise,
  ]);

  const payload = {
    newEvents: newEventsRes.data ?? [],
    myEvents: myEventsRes.data ?? [],
    hotEvents: [],
  };
  return { payload };
};

const handleFilterEvents = async (
  reqData: IRequestBody,
  userId: string,
  supabase: SupabaseClient
) => {
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
  const skip = (page - 1) * limit;

  const [events, totalCount] = await Promise.all([
    supabase
      .from('events')
      .select('id, title, description, start_time, end_time')
      .filter('title', 'ilike', `%${searchParam}%`)
      .filter('created_by', 'eq', userId)
      .order(sortField, { ascending: sortOrder === 'asc' })
      .range(skip, skip + limit - 1),
    supabase
      .from('events')
      .select('id', { count: 'exact' })
      .filter('title', 'ilike', `%${searchParam}%`)
      .filter('created_by', 'eq', userId),
  ]);

  const payload = {
    events: events.data ?? [],
    count: events.data?.length ?? 0,
    totalCount: totalCount.count ?? 0,
    totalPages: totalCount.count ? Math.ceil(totalCount.count / limit) : 0,
    currentPage: page,
  };

  return { payload };
};

const handleUpdateEventDetails = async (
  reqData: IRequestBody,
  supabase: SupabaseClient
) => {
  const validatedData = eventValidators.updateEventDetails.safeParse(reqData);
  if (!validatedData.success) {
    return NextResponse.json(
      { message: 'Validation error', errors: validatedData.error.errors },
      { status: 400 }
    );
  }
  const payload = await supabase
    .from('events')
    .update(validatedData.data.payload)
    .eq('id', validatedData.data.payload.id)
    .select();
  return { payload };
};

const handleGetParticipants = async (
  reqData: IRequestBody,
  supabase: SupabaseClient
) => {
  const validatedData = eventValidators.getParticipants.safeParse(reqData);
  if (!validatedData.success) {
    return NextResponse.json(
      { message: 'Validation error', errors: validatedData.error.errors },
      { status: 400 }
    );
  }
  const payload = await supabase
    .from('event_participants')
    .select('user_id, users(name, email)')
    .eq('event_id', validatedData.data.payload.eventId);
  return { payload };
};

const handleJoinEvent = async (
  reqData: IRequestBody,
  userId: string,
  supabase: SupabaseClient
) => {
  const validatedData = eventValidators.joinEvent.safeParse(reqData);
  if (!validatedData.success) {
    return NextResponse.json(
      { message: 'Validation error', errors: validatedData.error.errors },
      { status: 400 }
    );
  }
  const payload = await supabase
    .from('event_participants')
    .insert({
      event_id: validatedData.data.payload.eventId,
      user_id: userId,
    })
    .select();
  return { payload };
};

const handleInviteUsers = async (
  reqData: IRequestBody,
  supabase: SupabaseClient
) => {
  const validatedData = eventValidators.inviteUsers.safeParse(reqData);
  if (!validatedData.success) {
    return NextResponse.json(
      { message: 'Validation error', errors: validatedData.error.errors },
      { status: 400 }
    );
  }
  const invitations = validatedData.data.payload.userIds.map(
    (invitedUserId: string) => ({
      event_id: validatedData.data.payload.eventId,
      user_id: invitedUserId,
      status: 'pending',
    })
  );
  const payload = await supabase
    .from('event_invitations')
    .insert(invitations)
    .select();
  return { payload };
};

// const handleInviteEmails = async (reqData: IRequestBody, userId: string) => {
//   const validatedData = eventValidators.inviteEmails.safeParse(reqData);
//   if (!validatedData.success) {
//     return NextResponse.json(
//       { message: 'Validation error', errors: validatedData.error.errors },
//       { status: 400 }
//     );
//   }
//   const payload = await mailService.inviteEmails(
//     validatedData.data.payload.emails as string[],
//     validatedData.data.payload.eventId as string,
//     userId,
//   );
//   return { payload };
// };

export const GET = async (req: NextRequest) => {
  const supabase = createApiClient(req);
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
    const supabase = createApiClient(req);
    const { data } = await supabase.auth.getUser();
    const userId = data.user?.id;
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
    ];

    if (userRequiredCommands.includes(command as EventCommands) && !userId) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    let result;
    switch (command as EventCommands) {
      case EventCommands.getEvents:
        result = await handleGetEvents(reqData, supabase);
        break;
      case EventCommands.createEvent:
        result = await handleCreateEvent(reqData, userId as string, supabase);
        break;
      case EventCommands.getDashboardEvents:
        result = await handleGetDashboardEvents(userId, supabase);
        break;
      case EventCommands.filterEvents:
        result = await handleFilterEvents(reqData, userId as string, supabase);
        break;
      case EventCommands.updateEventDetails:
        result = await handleUpdateEventDetails(reqData, supabase);
        break;
      case EventCommands.getParticipants:
        result = await handleGetParticipants(reqData, supabase);
        break;
      case EventCommands.joinEvent:
        result = await handleJoinEvent(reqData, userId as string, supabase);
        break;
      case EventCommands.inviteUsers:
        result = await handleInviteUsers(reqData, supabase);
        break;
      // case EventCommands.inviteEmails:
      //   result = await handleInviteEmails(reqData, userId as string);
      //   break;
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
