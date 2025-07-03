'use client';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/shadcn-ui/dialog';
import { Event } from '@/models/event.model';
import { Button } from '@/components/shadcn-ui/button';
import { Card, CardContent } from '@/components/shadcn-ui/card';
import { Skeleton } from '@/components/shadcn-ui/skeleton';
import { formatDate } from '@/utilities/date-util';
import React from 'react';
import { customFetch } from '@/services/app/client/client-fetch';
import { env } from '@env';

const JoinEventDialog = (props: { event: Event }) => {
  const { event } = props;
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const joinEvent = async () => {
    try {
      const url = `${env.NEXT_PUBLIC_API_URL}/events`;
      const response = await customFetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payload: { eventId: event.id },
          command: 'joinEvent',
        }),
      });
      const jsonResponse = await response?.json();
      if (jsonResponse) {
        setDialogOpen(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="ml-2">
          Join
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Join Event {event.title}</DialogTitle>
          <DialogDescription>Join an eligible event!</DialogDescription>
        </DialogHeader>
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p>{event.description}</p>
                <p>From: {formatDate(event.startTime)}</p>
                <p>To: {formatDate(event.endTime)}</p>
              </div>
              <Skeleton className="w-full h-[300px]"></Skeleton>
            </div>
          </CardContent>
        </Card>
        <DialogFooter>
          <Button onClick={joinEvent}>Join</Button>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export { JoinEventDialog };
