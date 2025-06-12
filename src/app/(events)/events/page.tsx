import React, { Suspense } from 'react';
import { Button } from '@/components/shadcn-ui/button';
import customFetch, { IResponseBody } from '@/services/app/server/server-fetch';
import { EventModel } from '@/models/event.model';
import { EventCommands } from '@/enums/event.enum';
import { auth } from '@/auth';
import Link from 'next/link';
import EventCard from '@/app/(events)/events/event-card';
import { generateUniqueArray } from '@/utilities/array-util';
import { UserModel } from '@/models/user.model';
import { env } from '@env';

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
  const session = await auth();
  const body = JSON.stringify({
    payload: {},
    command: EventCommands.getDashboardEvents,
  });
  const eventResponse = await customFetch(`${env.NEXT_PUBLIC_API_URL}/events`, {
    method: 'POST',
    body,
  });
  const eventData: IResponseBody<{
    myEvents: EventModel[];
    hotEvents: EventModel[];
    recentEvents: EventModel[];
  }> = await eventResponse.json();
  const { myEvents, hotEvents, recentEvents } = eventData.payload;
  const userIds = generateUniqueArray([
    myEvents.map((event: EventModel) => event.createdBy.toString()),
    hotEvents.map((event: EventModel) => event.createdBy.toString()),
    recentEvents.map((event: EventModel) => event.createdBy.toString()),
  ]);
  const userResponse = await customFetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users`,
    {
      method: 'POST',
      body: JSON.stringify({ payload: { ids: userIds }, command: 'getUsers' }),
    }
  );
  const usersData: IResponseBody<UserModel[]> = await userResponse.json();
  const users: UserModel[] = usersData.payload;
  return (
    <div className="h-full">
      <div className="max-w-7xl mx-auto mb-6">
        <h1 className="text-4xl font-bold mb-2">Events Dashboard</h1>
        <p className="text-gray-600">Discover and manage your events</p>
      </div>
      {session ? (
        <section className="max-w-7xl mx-auto mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">My Events</h2>
            <Button variant="outline" asChild>
              <Link href="/events/all">View All</Link>
            </Button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {myEvents.map((event: EventModel) => (
              <EventCard
                key={event.id}
                event={event}
                user={
                  users.find(
                    (user: UserModel) => user.id === event.createdBy.toString()
                  ) ?? ({} as UserModel)
                }
              ></EventCard>
            ))}
          </div>
        </section>
      ) : null}
      <section className="max-w-7xl mx-auto mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Hot Events</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {hotEvents.map((event: EventModel) => (
            <EventCard
              key={event.id}
              event={event}
              user={
                users.find(
                  (user: UserModel) => user.id === event.createdBy.toString()
                ) ?? ({} as UserModel)
              }
            ></EventCard>
          ))}
        </div>
      </section>
      <section className="max-w-7xl mx-auto mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Recent Events</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {recentEvents.map((event: EventModel) => (
            <EventCard
              key={event.id}
              event={event}
              user={
                users.find(
                  (user: UserModel) => user.id === event.createdBy.toString()
                ) ?? ({} as UserModel)
              }
            ></EventCard>
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
