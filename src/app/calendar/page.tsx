import {redirect} from 'next/navigation';
import {auth} from '@/auth';

const EventCalendar = async () => {
  const session = await auth()
  if (!session?.user) {
    redirect('/unauthorized')
  }
  return <div>Event Calendar</div>
};

export default EventCalendar;
