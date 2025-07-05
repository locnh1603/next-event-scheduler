import React from 'react';
import '../globals.css';
import { Metadata } from 'next';
import NavBar from '@/components/navbar';
export const metadata: Metadata = {
  title: 'Event Scheduler',
};
const EventsLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div>
      <div className="main m-0">
        <NavBar />
        <div className="min-h-[95vh] p-4">{children}</div>
      </div>
    </div>
  );
};

export default EventsLayout;
