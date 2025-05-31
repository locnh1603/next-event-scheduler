'use client'
import {EventModel} from '@/models/event.model';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter, DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/dialog';
import {Button} from '@/components/button';
import React, { useState } from 'react';
import {z} from 'zod';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {Form, FormControl, FormField, FormLabel, FormMessage} from '@/components/form';
import {Input} from '@/components/input';
import {Textarea} from '@/components/textarea';
import { EventCommands } from '@/enums/event.enum';
import { useRouter } from 'next/navigation';
import {AppError} from '@/utilities/error-handler';
import { customFetch } from '@/services/app/client/client-fetch';
import { env } from '@env';
const eventDetailFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters."
  }),
  description: z.string()
});
type EventDetailFormData = z.infer<typeof eventDetailFormSchema>;
const EditDetailDialog = (props: {event: EventModel, children: React.ReactNode}) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const {event, children} = props;
  const form = useForm<EventDetailFormData>({
    resolver: zodResolver(eventDetailFormSchema),
    defaultValues: {
      name: event.name,
      description: event.description
    },
  });
  const onSubmit = async(data: EventDetailFormData) => {
    setLoading(true);
    const {name, description} = data;
    const body ={
      payload: {
        name,
        description,
        id: event.id
      },
      command: EventCommands.updateEventDetails
    };

    try {
      const url = `${env.NEXT_PUBLIC_API_URL}/events`;
      await customFetch(url, {
        body: JSON.stringify(body),
        method: 'POST'
      });
      setLoading(false);
      setOpen(false);
      router.refresh();
    } catch (error) {
      throw new AppError(500, error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Event Details</DialogTitle>
          <DialogDescription>
            Change Event minor details.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <FormField control={form.control} render={({field}) => (
                <>
                  <FormLabel htmlFor="name">Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter event name" {...field}/>
                  </FormControl>
                  <FormMessage/>
                </>
              )} name="name"/>
            </div>

            <div className="space-y-2 mt-2">
              <FormField control={form.control} render={({field}) => (
                <>
                  <FormLabel htmlFor="description">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      id="description"
                      placeholder="Enter event description"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage/>
                </>
              )} name="description"/>
            </div>
            <DialogFooter className="mt-4">
              <Button type="submit" className={`${loading ? 'disabled' : ''}`}>Save Changes</Button>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export {EditDetailDialog}
