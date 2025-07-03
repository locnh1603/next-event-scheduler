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
import { Calendar, Map } from 'lucide-react';
import { Badge } from '@/components/shadcn-ui/badge';
import { Skeleton } from '@/components/shadcn-ui/skeleton';
import { redirect } from 'next/navigation';
import { Button } from '@/components/shadcn-ui/button';
import Link from 'next/link';
import { formatDate } from '@/utilities/date-util';
import { EditDetailDialog } from '@/app/(events)/events/[id]/edit-event-dialog';
import { createClient } from '@/lib/supabase/server';
import InviteEventDialog from './invite-event-dialog';

const EventMainInfo = async (props: { event: Event }) => {
  const { event } = props;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!event) {
    redirect('/events');
  }
  return (
    <Card className="w-full h-[300px]">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex">
            <CardTitle className="text-2xl font-bold">
              {event.title || 'Untitled'}
            </CardTitle>
            <Badge variant="default" className="pointer-events-none ml-2">
              Active
            </Badge>
          </div>
          {user ? (
            <EditDetailDialog event={event}>
              <Button variant="outline">Edit</Button>
            </EditDetailDialog>
          ) : (
            <></>
          )}
          <InviteEventDialog eventId={event.id}>
            <Button variant="outline">Invite</Button>
          </InviteEventDialog>
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
            <Map size={20} />
            <span>{event.location || 'Location not specified'}</span>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="lowercase">
              Event
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const EventDetailContent = async ({ id }: { id: string }) => {
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
  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-12 gap-4">
        <div className="grid col-span-4 gap-4">
          <div className="flex items-center justify-center text-lg font-bold">
            <EventMainInfo event={event} />
          </div>
          <div className="flex items-center justify-center text-lg font-bold">
            <Skeleton className="w-full h-[600px]" />
          </div>
        </div>
        <div className="col-span-8 flex items-center justify-center text-lg font-bold h-full">
          <Skeleton className="w-full h-[915px]" />
        </div>
      </div>
    </div>
  );
};

const EventDetail = ({ params }: { params: Promise<{ id: string }> }) => {
  return (
    <div>
      <div className="max-w-7xl mx-auto mb-6">
        <h1 className="text-4xl font-bold mb-2">Event Detail</h1>
        <p className="text-gray-600">
          Event details and additional information
        </p>
        <Button variant="outline" asChild>
          <Link href={`/events`}>Back</Link>
        </Button>
      </div>
      <Suspense fallback={<Skeleton className="w-full h-[915px]" />}>
        <EventDetailContentPromise params={params} />
      </Suspense>
    </div>
  );
};

// Helper to unwrap params promise for server component
const EventDetailContentPromise = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  return <EventDetailContent id={id} />;
};

export default EventDetail;
