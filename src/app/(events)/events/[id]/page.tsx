import { EventCommands } from '@/enums/event.enum';
import customFetch, { IResponseBody } from '@/services/app/server/server-fetch';
import { EventModel } from '@/models/event.model';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import React, { Suspense } from 'react';
import { Calendar, Map, Tag } from 'lucide-react';
import { Badge } from '@/components/badge';
import { Skeleton } from '@/components/skeleton';
import { redirect } from 'next/navigation';
import { Button } from '@/components/button';
import Link from 'next/link';
import { formatDate } from '@/utilities/date-util';
import { EditDetailDialog } from '@/app/(events)/events/[id]/edit-event-dialog';
import { auth } from '@/auth';
import InviteEventDialog from './invite-event-dialog';

const EventMainInfo = async (props: { event: EventModel }) => {
  const { event } = props;
  const session = await auth();
  if (!event) {
    redirect('/events');
  }
  return (
    <Card className="w-full h-[300px]">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex">
            <CardTitle className="text-2xl font-bold">
              {event.name || 'Untitled'}
            </CardTitle>
            <Badge
              variant={event.active ? 'default' : 'secondary'}
              className="pointer-events-none ml-2"
            >
              {event.active ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          {session?.user ? (
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
              {formatDate(event.startDate)} - {formatDate(event.endDate)}
            </span>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <Map size={20} />
            <span>{event.location || 'Location not specified'}</span>
          </div>

          <div className="flex items-center gap-2">
            {event.type && (
              <Badge variant="outline" className="lowercase">
                {event.type}
              </Badge>
            )}
            {event.status && (
              <Badge variant="outline" className="lowercase">
                {event.status}
              </Badge>
            )}
          </div>

          {event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {event.tags.map((tag, index) => (
                <div key={index} className="flex items-center gap-1">
                  <Tag size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-600">{tag}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const EventDetail = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
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
  const { payload }: IResponseBody<EventModel[]> = await data.json();
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
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-12 gap-4">
          <div className="grid col-span-4 gap-4">
            <div className="flex items-center justify-center text-lg font-bold">
              <Suspense
                fallback={<Skeleton className="w-full h-full"></Skeleton>}
              >
                <EventMainInfo event={payload[0]}></EventMainInfo>
              </Suspense>
            </div>
            <div className="flex items-center justify-center text-lg font-bold">
              <Skeleton className="w-full h-[600px]"></Skeleton>
            </div>
          </div>
          <div className="col-span-8 flex items-center justify-center text-lg font-bold h-full">
            <Skeleton className="w-full h-[915px]"></Skeleton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
