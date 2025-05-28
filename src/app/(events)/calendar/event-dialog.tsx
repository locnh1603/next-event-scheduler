'use client';
import Loading from '@/app/loading';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/dialog';
import { EventModel } from '@/models/event.model';
import { customFetch } from '@/services/app/client/client-fetch';
import { useEffect, useState } from 'react';

const EventDetails = ({ event }: { event: EventModel }) => {
  return (
    <>
      <DialogTitle>{event?.name}</DialogTitle>
      {event?.description}
    </>
  );
};

const EventViewDialog = ({
  eventId,
  children,
}: {
  eventId: string;
  children: React.ReactNode;
}) => {
  const [event, setEvent] = useState<EventModel>();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!dialogOpen) {
      setEvent(undefined);
    }
  }, [dialogOpen]);
  const handleDialogOpenChange = (isOpen: boolean) => {
    setDialogOpen(isOpen);
    if (isOpen && eventId && !event) {
      setLoading(true);
      const getEvent = async () => {
        try {
          const body = JSON.stringify({
            payload: { ids: [eventId] },
            command: 'getEvents',
          });
          const response = await customFetch(
            `${process.env.NEXT_PUBLIC_API_URL}/events`,
            { method: 'POST', body }
          );
          if (response) {
            const eventData = await response.json();
            setEvent(eventData.payload[0]);
          }
        } finally {
          setLoading(false);
        }
      };
      getEvent();
    }
    if (!isOpen) {
      setEvent(undefined);
      setLoading(false);
    }
  };
  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent>
          {loading ? <Loading /> : event && <EventDetails event={event} />}
        </DialogContent>
      </Dialog>
    </>
  );
};
export default EventViewDialog;
