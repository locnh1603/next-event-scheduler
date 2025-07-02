'use client';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { EventCommands } from '@/enums/event.enum';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/shadcn-ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormLabel,
  FormMessage,
} from '@/components/shadcn-ui/form';
import { Input } from '@/components/shadcn-ui/input';
import { Textarea } from '@/components/shadcn-ui/textarea';
import { Label } from '@/components/shadcn-ui/label';
import { DateTimePicker } from '@/components/shadcn-ui/date-time-picker';
import { RadioGroup, RadioGroupItem } from '@/components/shadcn-ui/radio-group';
import { Button } from '@/components/shadcn-ui/button';
import { customFetch } from '@/services/app/client/client-fetch';
import { env } from '@env';

const formSchema = z.object({
  title: z.string().min(2, {
    message: 'Title must be at least 2 characters.',
  }),
  description: z.string(),
  startTime: z.date(),
  endTime: z.date(),
  location: z.string().min(1, {
    message: 'Location is required.',
  }),
  hostName: z.string().optional(),
  allowSelfJoin: z.boolean().default(false),
  allowAnonymousJoin: z.boolean().default(false),
  maxParticipants: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const CreateEventForm = () => {
  const router = useRouter();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      startTime: new Date(),
      endTime: new Date(),
      location: '',
      hostName: '',
      allowSelfJoin: false,
      allowAnonymousJoin: false,
      maxParticipants: '',
    },
  });
  const [loading, setLoading] = useState<boolean>(false);
  const onSubmit = async (data: FormData) => {
    setLoading(true);
    const startTime = data.startTime.toISOString();
    const endTime = data.endTime.toISOString();
    const maxParticipants = data.maxParticipants
      ? parseInt(data.maxParticipants, 10)
      : undefined;
    const body = {
      payload: {
        title: data.title,
        description: data.description,
        startTime,
        endTime,
        location: data.location,
        hostName: data.hostName,
        allowSelfJoin: data.allowSelfJoin,
        allowAnonymousJoin: data.allowAnonymousJoin,
        maxParticipants,
      },
      command: EventCommands.createEvent,
    };
    try {
      const url = `${env.NEXT_PUBLIC_API_URL}/events`;
      const eventResponse = await customFetch(url, {
        body: JSON.stringify(body),
        method: 'POST',
      });
      const { payload } = await (eventResponse as Response).json();
      setLoading(false);
      router.push(`/events/${payload.id}`);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
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
              <FormField
                control={form.control}
                render={({ field }) => (
                  <>
                    <FormLabel htmlFor="title">Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter event title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </>
                )}
                name="title"
              />
            </div>

            <div className="space-y-2">
              <FormField
                control={form.control}
                render={({ field }) => (
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
                    <FormMessage />
                  </>
                )}
                name="description"
              />
            </div>

            <div className="space-y-2">
              <Label>Event Start and End Date</Label>
              <div className="border rounded-md p-2 flex-column gap-2">
                <div className="w-100 flex">
                  <p className="flex items-center w-1/6">Start On</p>
                  <FormField
                    control={form.control}
                    render={({ field }) => (
                      <FormControl>
                        <DateTimePicker
                          granularity="minute"
                          {...field}
                        ></DateTimePicker>
                      </FormControl>
                    )}
                    name="startTime"
                  />
                </div>
                <div className="w-100 flex mt-3">
                  <p className="flex items-center w-1/6">End On</p>
                  <FormField
                    control={form.control}
                    render={({ field }) => (
                      <FormControl>
                        <DateTimePicker
                          granularity="minute"
                          {...field}
                        ></DateTimePicker>
                      </FormControl>
                    )}
                    name="endTime"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <FormField
                control={form.control}
                render={({ field }) => (
                  <>
                    <FormLabel htmlFor="location">Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter event location" {...field} />
                    </FormControl>
                    <FormMessage />
                  </>
                )}
                name="location"
              />
            </div>

            <div className="space-y-2">
              <FormField
                control={form.control}
                render={({ field }) => (
                  <>
                    <FormLabel htmlFor="hostName">Host Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter host name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </>
                )}
                name="hostName"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  render={({ field }) => (
                    <>
                      <FormLabel>Allow Self Join</FormLabel>
                      <FormControl>
                        <RadioGroup
                          className="flex gap-4 mt-2"
                          {...field}
                          onValueChange={(value) =>
                            field.onChange(value === 'true')
                          }
                          value={String(field.value)}
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="true" id="self-join-yes" />
                            <Label htmlFor="self-join-yes">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="false" id="self-join-no" />
                            <Label htmlFor="self-join-no">No</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                    </>
                  )}
                  name="allowSelfJoin"
                />
              </div>
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  render={({ field }) => (
                    <>
                      <FormLabel>Allow Anonymous Join</FormLabel>
                      <FormControl>
                        <RadioGroup
                          className="flex gap-4 mt-2"
                          {...field}
                          onValueChange={(value) =>
                            field.onChange(value === 'true')
                          }
                          value={String(field.value)}
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="true"
                              id="anonymous-join-yes"
                            />
                            <Label htmlFor="anonymous-join-yes">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="false"
                              id="anonymous-join-no"
                            />
                            <Label htmlFor="anonymous-join-no">No</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                    </>
                  )}
                  name="allowAnonymousJoin"
                />
              </div>
            </div>

            <div className="space-y-2">
              <FormField
                control={form.control}
                render={({ field }) => (
                  <>
                    <FormLabel>Max Participants</FormLabel>
                    <FormDescription>Leave empty for unlimited</FormDescription>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                  </>
                )}
                name="maxParticipants"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-4">
            <Button variant="outline">Cancel</Button>
            <Button type="submit" disabled={loading}>
              Create Event
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default CreateEventForm;
