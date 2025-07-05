import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Event Calendar | Next Event Scheduler',
  description:
    'View all upcoming events in a beautiful calendar view. Powered by FullCalendar and Next.js.',
  openGraph: {
    title: 'Event Calendar | Next Event Scheduler',
    description:
      'View all upcoming events in a beautiful calendar view. Powered by FullCalendar and Next.js.',
    url: 'https://yourdomain.com/calendar',
    siteName: 'Next Event Scheduler',
    type: 'website',
  },
};

('use client');
import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

const EventCalendar = () => {
  return (
    <div className="max-w-full">
      <FullCalendar plugins={[dayGridPlugin]} initialView="dayGridMonth" />
    </div>
  );
};

export default EventCalendar;
