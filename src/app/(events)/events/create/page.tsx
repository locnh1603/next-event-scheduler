import CreateEventForm from '@/app/(events)/events/create/create-event-form';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Suspense } from 'react';

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

const CreateEvent = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/unauthorized');
  }

  return (
    <div>
      <div className="max-w-2xl mx-auto mb-6">
        <h1 className="text-4xl font-bold mb-2">Create Event</h1>
        <p className="text-gray-600">Create new event</p>
      </div>
      <Suspense fallback={<CreateEventSkeleton />}>
        <CreateEventForm />
      </Suspense>
    </div>
  );
};

export default CreateEvent;
