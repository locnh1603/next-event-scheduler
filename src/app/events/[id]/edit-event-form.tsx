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
import React from 'react';
import {z} from 'zod';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {Form, FormControl, FormField, FormLabel, FormMessage} from '@/components/form';
import {Input} from '@/components/input';
import {Textarea} from '@/components/textarea';
const eventDetailFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters."
  }),
  description: z.string()
})
type EventDetailFormData = z.infer<typeof eventDetailFormSchema>;
const EditDetailForm = (props: {event: EventModel}) => {
  const {event} = props;
  const form = useForm<EventDetailFormData>({
    resolver: zodResolver(eventDetailFormSchema),
    defaultValues: {
      name: event.name,
      description: event.description
    },
  });
  const onSubmit = async(data: EventDetailFormData) => {
    console.log(data);
  }
  return (
    <Dialog>
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
            <DialogFooter className="mt-2">
              <Button type="submit">Save Changes</Button>
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

export {EditDetailForm}
