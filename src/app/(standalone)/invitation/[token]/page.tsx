import { Badge } from '@/components/shadcn-ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/shadcn-ui/card';
import customFetch, { IResponseBody } from '@/services/app/server/server-fetch';
import { formatDate } from '@/utilities/date-util';
import { env } from '@env';
import { Calendar, MapIcon, User } from 'lucide-react';
import { Metadata } from 'next';
import { Event } from '@/models/event.model';
import { InvitationFooter } from './invitation-footer';
import { Suspense } from 'react';
import { Skeleton } from '@/components/shadcn-ui/skeleton';
import { EventCommands } from '@/enums/event.enum';

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ token: string }>;
}): Promise<Metadata> => {
  const { token } = await params;
  return {
    title: `Event Invitation | Next Event Scheduler`,
    description: `Join the event by accepting the invitation and view event details.`,
    openGraph: {
      title: `Event Invitation | Next Event Scheduler`,
      description: `Join the event by accepting the invitation and view event details.`,
      url: `${env.APP_URL}/invitation/${token}`,
      siteName: 'Next Event Scheduler',
      type: 'website',
    },
  };
};

const EventInvitation = async ({
  params,
}: {
  params: Promise<{ token: string }>;
}) => {
  const { token } = await params;

  const body = {
    payload: { token },
    command: EventCommands.getEventByInvitationId,
  };
  const eventResponse = await customFetch(`${env.API_URL}/events`, {
    method: 'POST',
    body: JSON.stringify(body),
  });

  if (!eventResponse.ok) {
    throw new Error(`Failed to fetch event: ${eventResponse.status}`);
  }

  const eventData: IResponseBody<Event> = await eventResponse.json();
  if (!eventData.payload || !eventData.payload.invitationStatus) {
    throw new Error('Invalid event data received');
  }
  const event = eventData.payload;

  return (
    <div className="flex flex-col items-center p-4">
      <Card className="w-1/3 min-h-[300px]">
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
        <CardFooter>
          <Suspense fallback={<Skeleton className="w-full h-10" />}>
            <InvitationFooter
              token={token}
              status={event.invitationStatus ?? 'pending'}
            />
          </Suspense>
        </CardFooter>
      </Card>
    </div>
  );
};

export default EventInvitation;
