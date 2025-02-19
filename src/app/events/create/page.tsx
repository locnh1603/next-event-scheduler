import CreateEventForm from '@/app/events/create/create-event-form';
import {redirect} from 'next/navigation';
import {auth} from '@/auth';

const CreateEvent = async () => {
  const session = await auth();
  if (!session?.user) {
    redirect('/unauthorized');
  }
  return (
    <div>
      <div className="max-w-2xl mx-auto mb-6">
        <h1 className="text-4xl font-bold mb-2">Create Event</h1>
        <p className="text-gray-600">Create new event</p>
      </div>
      <CreateEventForm></CreateEventForm>
    </div>
  );
};

export default CreateEvent;
