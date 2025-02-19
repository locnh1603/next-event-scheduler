import React from 'react';
import { Button } from "@/components/button";
import fetchWithCookie from '@/utilities/fetch-server-action';
import {EventModel} from '@/models/event.model';
import {IResponseBody} from '@/models/fetch.model';
import {EventCommands} from '@/enums/event.enum';
import {auth} from '@/auth';
import Link from 'next/link';
import EventCard from '@/app/events/event-card';
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
              {myEvents.map((event: EventModel, index: number) => (<EventCard key={index} event={event}></EventCard>))}
            </div>
          </section>
        ) : <></>
      }
      <section className="max-w-7xl mx-auto mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Hot Events</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {hotEvents.map((event: EventModel, index: number) => (<EventCard key={index} event={event}></EventCard>))}
        </div>
      </section>
      <section className="max-w-7xl mx-auto mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Recent Events</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {recentEvents.map((event: EventModel, index: number) => (<EventCard key={index} event={event}></EventCard>))}
        </div>
      </section>
    </div>
  );
}
export default EventDashboard;
