import { env } from '@env';
import React from 'react';
import CalendarMain from './calendar-main';
import CalendarFilter from './calendar-filter';

export const metadata = {
  title: 'Event Calendar | Next Event Scheduler',
  description:
    'View and manage your events on the calendar. Easily navigate through dates and find events.',
  openGraph: {
    title: 'Event Calendar | Next Event Scheduler',
    description:
      'View and manage your events on the calendar. Easily navigate through dates and find events.',
    url: `${env.APP_URL}/calendar`,
    siteName: 'Next Event Scheduler',
    type: 'website',
  },
};

const EventCalendar = () => {
  return (
    <>
      <div className="max-w-full">
        <CalendarMain></CalendarMain>
        <CalendarFilter></CalendarFilter>
      </div>
    </>
  );
};

export default EventCalendar;
