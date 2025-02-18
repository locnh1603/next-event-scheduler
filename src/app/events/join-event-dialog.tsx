import {
  Dialog, DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/dialog';
import {DialogBody} from 'next/dist/client/components/react-dev-overlay/internal/components/Dialog';
import {EventModel} from '@/models/event.model';
import {Button} from '@/components/button';
import {Card, CardContent} from '@/components/card';
import {Skeleton} from '@/components/skeleton';
import {formatDate} from '@/utilities/date';
import React from 'react';

const JoinEventDialog = (props: {event: EventModel}) => {
  const {event} = props;
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Join</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Join Event {event.name}</DialogTitle>
          <DialogDescription>Join an eligible event!</DialogDescription>
        </DialogHeader>
        <DialogBody>
          <p className="mb-4">Are you sure you want to join this event ?</p>
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p>{event.description}</p>
                  <p>From: {formatDate(event.startDate)}</p>
                  <p>To: {formatDate(event.endDate)}</p>
                  <p>Created By: {event.createdBy}</p>
                </div>
                <Skeleton className="w-full h-[300px]"></Skeleton>
              </div>
            </CardContent>
          </Card>
        </DialogBody>
        <DialogFooter>
          <Button>Join</Button>
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
