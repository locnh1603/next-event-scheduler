import {EventModel} from '@/models/event.model';
import {Card, CardContent} from '@/components/card';
import {Calendar, Clock, MapPin} from 'lucide-react';
import {Button} from '@/components/button';
import Link from 'next/link';
import React from 'react';
import {formatDate} from '@/utilities/date';
import {JoinEventDialog} from '@/app/events/join-event-dialog';

const EventCard = (props: { event: EventModel }) => {
  const {event} = props;
  return (
    <Card key={event.id}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{event.name}</h3>
            <div className="flex items-center gap-2 text-gray-600 mt-2">
              <Calendar className="w-4 h-4"/>
              <span>{event.name}</span>
              <Clock className="w-4 h-4 ml-2"/>
              <span>{formatDate(event.startDate)}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 mt-1">
              <MapPin className="w-4 h-4"/>
              <span>{event.location}</span>
            </div>
          </div>
          <span>
              <Button variant="outline" asChild>
                <Link href={`/events/${event.id}`}>View</Link>
              </Button>
            {
              event.type === 'public' ? (
                <JoinEventDialog event={event}></JoinEventDialog>
              ) : (<></>)
            }
            </span>
        </div>
      </CardContent>
    </Card>
  )
}

export default EventCard;
