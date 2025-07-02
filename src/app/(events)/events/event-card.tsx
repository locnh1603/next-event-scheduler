import { Card, CardContent } from '@/components/shadcn-ui/card';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/shadcn-ui/button';
import Link from 'next/link';
import React from 'react';
import { formatDate } from '@/utilities/date-util';
import { Event } from '@/models/event.model';
const EventCard = (props: { event: Event }) => {
  const { event } = props;
  return (
    <Card key={event.id}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{event.title}</h3>
            <div className="flex items-center gap-2 text-gray-600 mt-2">
              <Calendar className="w-4 h-4" />
              <span>{event.title}</span>
              <Clock className="w-4 h-4 ml-2" />
              <span>{formatDate(event.startTime)}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 mt-1">
              <MapPin className="w-4 h-4" />
              <span>{event.location}</span>
            </div>
          </div>
          <span>
            <Button variant="outline" asChild>
              <Link href={`/events/${event.id}`}>View</Link>
            </Button>
            {/* {event.type === 'public' && !isParticipant ? (
              <JoinEventDialog event={event} user={user}></JoinEventDialog>
            ) : (
              <></>
            )} */}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;
