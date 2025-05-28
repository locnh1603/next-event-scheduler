'use client';
import React, { useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import EventTile from './event-tile';
import { customFetch } from '@/services/app/client/client-fetch';
import { EventModel } from '@/models/event.model';

const EventCalendar = () => {
  const [events, setEvents] = React.useState<
    Array<{ title: string; date: string; color?: string }>
  >([]);
  useEffect(() => {
    const getEvents = async () => {
      const body = JSON.stringify({
        payload: {},
        command: 'getEvents',
      });
      const response = await customFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/events`,
        { method: 'POST', body }
      );
      if (response) {
        const eventsData = await response.json();
        setEvents(
          eventsData.payload.map((event: EventModel) => ({
            title: event.name,
            date: new Date(event.startDate),
            id: event.id,
          }))
        );
      }
    };
    getEvents();
  }, []);
  const handleDateClick = (event: DateClickArg) => {
    setEvents([...events, { title: 'new event', date: event.dateStr }]);
  };
  return (
    <div className="max-w-full">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        dateClick={handleDateClick}
        events={events}
        eventContent={(eventInfo) => <EventTile eventInfo={eventInfo} />}
        dayMaxEventRows={4}
        eventColor=""
      />
    </div>
  );
};

export default EventCalendar;
