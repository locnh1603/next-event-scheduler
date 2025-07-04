import EventForm from '@/app/(events)/events/event-form';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Suspense } from 'react';
import { EventCommands } from '@/enums/event.enum';
import customFetch, { IResponseBody } from '@/services/app/server/server-fetch';
import { Event } from '@/models/event.model';

const CreateEventSkeleton = () => (
  <div>
    <div className="max-w-2xl mx-auto mb-6">
      <div className="animate-pulse space-y-4">
        <div className="h-10 bg-gray-200 rounded w-2/3 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-1/3" />
      </div>
    </div>
    <div className="max-w-2xl mx-auto">
      <div className="animate-pulse space-y-4">
        <div className="h-12 bg-gray-200 rounded w-full" />
        <div className="h-12 bg-gray-200 rounded w-full" />
        <div className="h-12 bg-gray-200 rounded w-1/2" />
        <div className="h-10 bg-gray-200 rounded w-1/3 mt-4" />
      </div>
    </div>
  </div>
);

const CreateEvent = async ({ params }: { params: Promise<{ id: string }> }) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/unauthorized');
  }

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
  });
  const { payload }: IResponseBody<Event[]> = await data.json();
  const event = payload[0];
  return (
    <div>
      <div className="max-w-2xl mx-auto mb-6">
        <h1 className="text-4xl font-bold mb-2">Create Event</h1>
        <p className="text-gray-600">Create new event</p>
      </div>
      <Suspense fallback={<CreateEventSkeleton />}>
        <EventForm event={event} />
      </Suspense>
    </div>
  );
};

export default CreateEvent;
