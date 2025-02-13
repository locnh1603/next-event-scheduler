import React from 'react';
import { Card, CardContent } from "@/components/card";
import { Button } from "@/components/button";
import { Calendar, Clock, MapPin } from "lucide-react";
import fetchWithCookie from '@/utilities/fetch';
import {EventModel} from '@/models/event.model';
import {IResponseBody} from '@/models/fetch.model';
import {EventCommands} from '@/enums/event.enum';
import {auth} from '@/auth';
import Link from 'next/link';
const EventDashboard = async () => {
  const session = await auth();
  const body = JSON.stringify({
    payload: {
      ids: []
    },
    command: EventCommands.getDashboardEvents
  });
  const data = await fetchWithCookie(`${process.env.NEXT_PUBLIC_API_URL}/events`, {
    method: 'POST',
    body,
  });
  const { payload }: IResponseBody<{
    myEvents: EventModel[];
    hotEvents: EventModel[];
    recentEvents: EventModel[];
  }> = await data.json();
  const { myEvents, hotEvents, recentEvents } = payload;
  const eventCard = (event: EventModel) => {
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
                <span>{event.name}</span>
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
                  <Button className="ml-2" asChild>
                    <Link href='/events'>Join</Link>
                  </Button>
                ) : (<></>)
              }
            </span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="h-full">
      <div className="max-w-7xl mx-auto mb-6">
        <h1 className="text-4xl font-bold mb-2">Events Dashboard</h1>
        <p className="text-gray-600">Discover and manage your events</p>
      </div>
      {
        session ? (
          <section className="max-w-7xl mx-auto mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">My Events</h2>
              <Button variant="outline" asChild>
                <Link href='/events/all'>View All</Link>
              </Button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {myEvents.map(event => eventCard(event))}
            </div>
          </section>
        ) : <></>
      }
      <section className="max-w-7xl mx-auto mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Hot Events</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {hotEvents.map(event => eventCard(event))}
        </div>
      </section>
      <section className="max-w-7xl mx-auto mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Recent Events</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {recentEvents.map(event => eventCard(event))}
        </div>
      </section>
    </div>
  );
}
export default EventDashboard;
