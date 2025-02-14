import {EventCommands} from '@/enums/event.enum';
import fetchWithCookie from '@/utilities/fetch';
import {IResponseBody} from '@/models/fetch.model';
import {EventModel} from '@/models/event.model';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/card';
import React from 'react';
import {Calendar, Map, Tag} from 'lucide-react';
import { Badge } from '@/components/badge';
import moment from 'moment';
import {Skeleton} from '@/components/skeleton';
import {redirect} from 'next/navigation';
import {Button} from '@/components/button';
import Link from 'next/link';

const EventMainInfo = (props: {data: EventModel}) => {
  const {data} = props;
  const formatDate = (timestamp: number) => {
    if (!timestamp) return 'Not set';
    return moment(timestamp).format('DD/MM/yyyy HH:mm');
  };
  if (!data) {
    redirect('/events');
  }
  return (
    <Card className="w-full h-[300px]">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold">{data.name || 'Untitled'}</CardTitle>
          <Badge variant={data.active ? "default" : "secondary"} className="pointer-events-none">
            {data.active ? "Active" : "Inactive"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/*{data.image && (*/}
        {/*  <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">*/}
        {/*    <div className="flex items-center justify-center h-full text-gray-400">*/}
        {/*      <Image src={data.image} height={48} width={48}  alt="event image"/>*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*)}*/}

        <div className="space-y-4">
          <p className="text-gray-600">{data.description || 'No description available'}</p>

          <div className="flex items-center gap-2 text-gray-600">
            <Calendar size={20} />
            <span>{formatDate(data.startDate)} - {formatDate(data.endDate)}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <Map size={20} />
            <span>{data.location || 'Location not specified'}</span>
          </div>

          <div className="flex items-center gap-2">
            {data.type && <Badge variant="outline" className="lowercase">{data.type}</Badge>}
            {data.status && <Badge variant="outline" className="lowercase">{data.status}</Badge>}
          </div>

          {data.tags && data.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {data.tags.map((tag, index) => (
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
}

const EventDetail = async(
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  const body = JSON.stringify({
    payload: {
      ids: [id]
    },
    command: EventCommands.getEvents
  });
  const data = await fetchWithCookie(`${process.env.NEXT_PUBLIC_API_URL}/events`, {
    method: 'POST',
    body,
  });
  const { payload }: IResponseBody<EventModel[]> = await data.json();
  return (
  <div>
    <div className="max-w-7xl mx-auto mb-6">
      <h1 className="text-4xl font-bold mb-2">Event Detail</h1>
      <p className="text-gray-600">Event details and additional information</p>
      <Button variant="outline" asChild>
        <Link href={`/events/${id}/edit`}>Manage</Link>
      </Button>
      <Button variant="outline" asChild>
        <Link href={`/events`}>Back</Link>
      </Button>
    </div>
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-12 gap-4">
        <div className="grid col-span-4 gap-4">
          <div className="flex items-center justify-center text-lg font-bold">
            <EventMainInfo data={payload[0]}></EventMainInfo>
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
