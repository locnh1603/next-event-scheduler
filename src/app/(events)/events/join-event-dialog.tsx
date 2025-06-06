'use client'
import {
  Dialog, DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/dialog';
import {EventModel} from '@/models/event.model';
import {Button} from '@/components/button';
import {Card, CardContent} from '@/components/card';
import {Skeleton} from '@/components/skeleton';
import {formatDate} from '@/utilities/date-util';
import React from 'react';
import {UserModel} from '@/models/user.model';
import { customFetch } from '@/services/app/client/client-fetch';
import { env } from '@env';
import { showSuccess } from '@/services/app/client/toaster.service';

const JoinEventDialog = (props: {event: EventModel, user: UserModel}) => {
  const {event, user} = props;
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const joinEvent = async () => {
    try {
      const url = `${env.NEXT_PUBLIC_API_URL}/events`;
      const response = await customFetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payload: { eventId: event.id }, command: 'joinEvent' }),
      });
      const jsonResponse = await response?.json();
      if (jsonResponse) {
        setDialogOpen(false);
        showSuccess('You have successfully registered for an event');
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="ml-2">Join</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Join Event {event.name}</DialogTitle>
          <DialogDescription>Join an eligible event!</DialogDescription>
        </DialogHeader>
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p>{event.description}</p>
                <p>From: {formatDate(event.startDate)}</p>
                <p>To: {formatDate(event.endDate)}</p>
                {
                  user?.name ? (<p>Created By: {user.name}</p>) : (<></>)
                }
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
  )
}
export { JoinEventDialog }
