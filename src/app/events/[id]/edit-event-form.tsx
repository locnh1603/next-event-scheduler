'use client'
import {EventModel} from '@/models/event.model';
import {Dialog, DialogContent, DialogTitle, DialogTrigger} from '@/components/dialog';
import {Button} from '@/components/button';
import React from 'react';

const EditDetailForm = (props: {event: EventModel}) => {
  const {event} = props
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Event Details</DialogTitle>
        <div>{event.name}</div>
      </DialogContent>
    </Dialog>
  )
}

export {EditDetailForm}
