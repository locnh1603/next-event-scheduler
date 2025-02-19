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
import {DialogBody} from 'next/dist/client/components/react-dev-overlay/internal/components/Dialog';
import { getCookies } from 'cookies-next';
import { EventCommands } from '@/enums/event.enum';
import { ApiError, IRequestBody, IResponseBody } from '@/models/fetch.model';
import { useRouter } from 'next/navigation';
const eventDetailFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters."
  }),
  description: z.string()
})
type EventDetailFormData = z.infer<typeof eventDetailFormSchema>;

const updateEventDetails = async(body: IRequestBody, cookie?: string): Promise<EventModel> => {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error('API URL not configured');
  }
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(cookie && { Cookie: cookie })
      },
      body: JSON.stringify(body)
    });
    if (!response.ok) {
      throw new ApiError(
        'Failed to create event',
        response.status,
        await response.json().catch(() => null)
      );
    }
    const data: IResponseBody<EventModel> = await response.json();
    if (!data.payload) {
      throw new ApiError('Failed to create event', 400, data);
    }
    return data.payload;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'An unexpected error occurred'
    );
  }
}

const EditDetailDialog = (props: {event: EventModel}) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const {event} = props;
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
    const cookies = getCookies();
    const Cookie = cookies ? Object.entries(cookies)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value as string)}`)
      .join('; ') : '';
    const body ={
      payload: {
        name,
        description,
        id: event.id
      },
      command: EventCommands.updateEventDetails
    };

    try {
      const event = await updateEventDetails(body, Cookie)
      console.log(event);
      setLoading(false);
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error('Event creation failed:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Event Details</DialogTitle>
          <DialogDescription>
            Change Event minor details.
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
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
        </DialogBody>
      </DialogContent>
    </Dialog>
  )
}

export {EditDetailDialog}
