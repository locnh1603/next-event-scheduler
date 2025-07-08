import React, { Suspense } from 'react';
import { Button } from '@/components/shadcn-ui/button';
import customFetch from '@/services/app/server/server-fetch';
import { EventCommands } from '@/enums/event.enum';
import Link from 'next/link';
import EventCard from '@/app/(events)/events/event-card';
import { env } from '@env';
import { Event } from '@/models/event.model';
import { createClient } from '@/lib/supabase/server';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Events Dashboard | Next Event Scheduler',
  description:
    'Your personalized dashboard for managing, discovering, and joining events.',
  openGraph: {
    title: 'Events Dashboard | Next Event Scheduler',
    description:
      'Your personalized dashboard for managing, discovering, and joining events.',
    url: `${env.APP_URL}/events`,
    siteName: 'Next Event Scheduler',
    type: 'website',
  },
};

const DashboardSkeleton = () => {
  return (
    <div className="h-full animate-pulse">
      <div className="max-w-7xl mx-auto mb-6 h-32 bg-gray-100 rounded" />
      <div className="max-w-7xl mx-auto mb-8">
        <div className="h-10 bg-gray-100 rounded mb-4 w-1/3" />
        <div className="grid md:grid-cols-2 gap-4">
          <div className="h-32 bg-gray-100 rounded" />
          <div className="h-32 bg-gray-100 rounded" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto mb-8">
        <div className="h-10 bg-gray-100 rounded mb-4 w-1/3" />
        <div className="grid md:grid-cols-2 gap-4">
          <div className="h-32 bg-gray-100 rounded" />
          <div className="h-32 bg-gray-100 rounded" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto mb-6">
        <div className="h-10 bg-gray-100 rounded mb-4 w-1/3" />
        <div className="grid md:grid-cols-2 gap-4">
          <div className="h-32 bg-gray-100 rounded" />
          <div className="h-32 bg-gray-100 rounded" />
        </div>
      </div>
    </div>
  );
};

const DashboardContent = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let eventDisplayData: {
    myEvents: Event[];
    hotEvents: Event[];
    newEvents: Event[];
  } = {
    myEvents: [],
    hotEvents: [],
    newEvents: [],
  };

  const body = JSON.stringify({
    payload: {},
    command: EventCommands.getDashboardEvents,
  });

  const eventResponse = await customFetch(`${env.NEXT_PUBLIC_API_URL}/events`, {
    method: 'POST',
    body,
  });

  const eventData = await eventResponse.json();
  const { myEvents, hotEvents, newEvents } = eventData.payload;
  eventDisplayData = {
    myEvents: myEvents ?? [],
    hotEvents: hotEvents ?? [],
    newEvents: newEvents ?? [],
  };
  return (
    <div className="h-full">
      <div className="max-w-7xl mx-auto mb-6">
        <h1 className="text-4xl font-bold mb-2">Events Dashboard</h1>
        <p className="text-gray-600">View Events happening</p>
      </div>

      {user ? (
        <section className="max-w-7xl mx-auto mb-8">
          <div className="flex items-center mb-4">
            <h2 className="text-2xl font-semibold">My Events</h2>
            <Button variant="outline" asChild>
              <Link href="/events/create" className="ml-auto">
                Create
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/events/all" className="ml-2">
                View All
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/my-center" className="ml-2">
                My Event Center
              </Link>
            </Button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {eventDisplayData.myEvents.map((event: Event) => (
              <EventCard key={event.id} event={event}></EventCard>
            ))}
          </div>
        </section>
      ) : null}
      <section className="max-w-7xl mx-auto mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Hot Events</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {eventDisplayData.hotEvents.map((event: Event) => (
            <EventCard key={event.id} event={event}></EventCard>
          ))}
        </div>
      </section>
      <section className="max-w-7xl mx-auto mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Recent Events</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {eventDisplayData.newEvents.map((event: Event) => (
            <EventCard key={event.id} event={event}></EventCard>
          ))}
        </div>
      </section>
    </div>
  );
};

const EventDashboard = () => (
  <Suspense fallback={<DashboardSkeleton />}>
    <DashboardContent />
  </Suspense>
);

export default EventDashboard;
