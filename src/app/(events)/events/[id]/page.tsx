import { EventCommands } from '@/enums/event.enum';
import customFetch, { IResponseBody } from '@/services/app/server/server-fetch';
import { Event } from '@/models/event.model';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/shadcn-ui/card';
import React, { Suspense } from 'react';
import {
  Calendar,
  Map as MapIcon,
  SquareArrowOutUpRight,
  User,
} from 'lucide-react';
import { Badge } from '@/components/shadcn-ui/badge';
import { Skeleton } from '@/components/shadcn-ui/skeleton';
import { redirect } from 'next/navigation';
import { Button } from '@/components/shadcn-ui/button';
import Link from 'next/link';
import { formatDate } from '@/utilities/date-util';
import { createClient } from '@/lib/supabase/server';
import InviteEventDialog from './invite-event-dialog';
import { ChatBox } from '@/components/chatbox';

import EventMultipanel from './event-multipanel';
const EventDetailHeader = () => (
  <div className="max-w-7xl mx-auto mb-6">
    <h1 className="text-4xl font-bold mb-2">Event Detail</h1>
    <p className="text-gray-600">Event details and additional information</p>
    <Button variant="outline" asChild>
      <Link href={`/events`}>Back</Link>
    </Button>
  </div>
);
// Existing component with minor modifications
const EventMainInfo = async (props: { event: Event }) => {
  const { event } = props;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const ownEvent = user && user.id === event.createdBy;
  if (!event) {
    redirect('/events');
  }
  return (
    <Card className="w-full h-[300px]">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex">
            <CardTitle className="font-semibold text-lg">
              {event.title || 'Untitled'}
            </CardTitle>
            <Badge variant="secondary" className="pointer-events-none ml-2">
              Active
            </Badge>
          </div>
          {ownEvent ? (
            <>
              <InviteEventDialog eventId={event.id}>
                <Button variant="outline">Invite</Button>
              </InviteEventDialog>
              <form
                action={async () => {
                  'use server';
                  redirect(`/events/update/${event.id}`);
                }}
              >
                <Button variant="outline" className="ml-2">
                  Edit
                  <SquareArrowOutUpRight size={16} strokeWidth={1.5} />
                </Button>
              </form>
            </>
          ) : (
            <></>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <p className="text-gray-600">
            {event.description || 'No description available'}
          </p>

          <div className="flex items-center gap-2 text-gray-600">
            <Calendar size={20} />
            <span>
              {formatDate(event.startTime)} - {formatDate(event.endTime)}
            </span>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <MapIcon size={20} />
            <span>{event.location || 'Location not specified'}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <User size={20} />
            <span>{event.hostName || ''}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const EventDetailBody = async ({ id }: { id: string }) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const body = JSON.stringify({
    payload: {
      ids: [id],
    },
    command: EventCommands.getEvents,
  });
  const data = await customFetch(`${process.env.NEXT_PUBLIC_API_URL}/events`, {
    method: 'POST',
    body,
    cache: 'no-store',
  });
  const { payload }: IResponseBody<Event[]> = await data.json();
  const event = payload[0];
  if (!user || !event) {
    redirect('/unauthorized');
  }
  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-12 gap-4">
        <div className="grid col-span-4 gap-4">
          <div className="flex items-center justify-center text-lg font-bold">
            <EventMainInfo event={event} />
          </div>
          <div className="flex items-center justify-center text-lg font-bold">
            <ChatBox
              readOnly
              title="Announcements"
              messages={[]}
              currentUserId={user.id}
            />
          </div>
        </div>
        <div className="col-span-8 flex items-center justify-center text-lg font-bold h-full">
          <EventMultipanel event={event} />
        </div>
      </div>
    </div>
  );
};

// Refactored main component
const EventDetail = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return (
    <div>
      <EventDetailHeader />
      <Suspense fallback={<Skeleton className="w-full h-[915px]" />}>
        <EventDetailBody id={id} />
      </Suspense>
    </div>
  );
};

export default EventDetail;
