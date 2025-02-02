'use client'
import React, {useState} from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/app/components/card';
import { Input } from '@/app/components/input';
import { Label } from '@/app/components/label';
import { Textarea } from '@/app/components/textarea';
import { RadioGroup, RadioGroupItem } from '@/app/components/radio-group';
import { Button } from '@/app/components/button';
import {DateTimePicker} from '@/app/components/date-time-picker';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {Form, FormControl, FormField, FormLabel, FormMessage} from '@/app/components/form';
import {useCookiesNext} from 'cookies-next';
import {EventCommands} from '@/app/enums/event.enum';
import moment from 'moment';
import {IResponseBody} from '@/app/models/fetch.model';
import {EventModel} from '@/app/models/event.model';
import {useRouter} from 'next/navigation';

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters."
  }),
  description: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  location: z.string().min(1, {
    message: "Location is required."
  }),
  image: z.string(),
  type: z.string().min(1, {
    message: "Type is required."
  })
})

type FormData = z.infer<typeof formSchema>;

const CreateEventForm = () => {
  const { getCookies } = useCookiesNext();
  const router = useRouter();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      startDate: new Date(),
      endDate: new Date(),
      location: '',
      image: '',
      type: 'public'
    },
  })
  const [tags, setTags] = useState<string[]>([]);
  const onSubmit = async (data: FormData) => {
    const Cookie = JSON.stringify(getCookies());
    const startDate = moment(data.startDate).valueOf();
    const endDate = moment(data.endDate).valueOf();
    const body = JSON.stringify({
      payload: {
        ...data,
        tags,
        startDate,
        endDate
      },
      command: EventCommands.createEvent
    });
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie
        },
        body
      });
      if (!response.ok) {
        throw new Error('Failed to submit form');
      }
      const responseData: IResponseBody<EventModel> = await response.json();
      if (responseData.payload?.id) {
        router.push(`/events/${responseData.payload.id}`);
      } else {
        throw new Error('Failed to submit form');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const target:  HTMLInputElement = e.target as HTMLInputElement;
    if (e.key === 'Enter' && target.value) {
      setTags([...tags, target.value]);
      target.value = '';
      e.preventDefault();
    }
  };

  const removeTag = (indexToRemove: number) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Event Details</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
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

            <div className="space-y-2">
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

            <div className="space-y-2">
              <Label>Event Start and End Date</Label>
              <div className="border rounded-md p-2 flex-column gap-2">
                <div className="w-100 flex">
                  <p className="flex items-center w-1/6">Start On</p>
                  <FormField control={form.control} render={({field}) => (
                    <FormControl>
                      <DateTimePicker granularity="minute" {...field}></DateTimePicker>
                    </FormControl>
                  )} name="startDate"/>
                </div>
                <div className="w-100 flex mt-3">
                  <p className="flex items-center w-1/6">End On</p>
                  <FormField control={form.control} render={({field}) => (
                    <FormControl>
                      <DateTimePicker granularity="minute" {...field}></DateTimePicker>
                    </FormControl>
                  )} name="endDate"/>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <FormField control={form.control} render={({field}) => (
                <>
                  <FormLabel htmlFor="location">Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter event location" {...field}/>
                  </FormControl>
                  <FormMessage/>
                </>
              )} name="location"/>
            </div>

            <div className="space-y-2">
              <FormField control={form.control} render={({field}) => (
                <>
                  <FormLabel htmlFor="image">Image</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter event image URL" {...field}/>
                  </FormControl>
                  <FormMessage/>
                </>
              )} name="image"/>
            </div>
            <div className="space-y-2">
              <FormField control={form.control} render={({field}) => (
                <>
                  <FormLabel>Event Type</FormLabel>
                  <FormControl>
                    <RadioGroup className="flex gap-4" {...field}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="public" id="public"/>
                        <Label htmlFor="public">Public</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="invite" id="invite"/>
                        <Label htmlFor="invite">Invite Only</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                </>
              )} name="type"/>
            </div>

            <div className="space-y-2">
              <Label>Tags</Label>
              <Input
                placeholder="Type and press Enter to add tags"
                onKeyDown={handleTagInput}
                maxLength={10}
              />
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm flex items-center gap-1"
                >
                  {tag}<button onClick={() => removeTag(index)} className="text-primary hover:text-primary/80">×</button>
                </span>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-4">
          <Button variant="outline">Cancel</Button>
          <Button type="submit">Create Event</Button>
        </CardFooter>
      </form>
    </Form>
  </Card>)
};

const CreateEvent = () => {
  return (
    <div className="mt-4">
      <CreateEventForm></CreateEventForm>
    </div>
  );
};

export default CreateEvent;
