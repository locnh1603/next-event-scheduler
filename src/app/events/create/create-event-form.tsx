'use client'
import {z} from 'zod';
import {useCookiesNext} from 'cookies-next';
import {useRouter} from 'next/navigation';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import React, {useState} from 'react';
import {EventCommands} from '@/enums/event.enum';
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from '@/components/card';
import {Form, FormControl, FormDescription, FormField, FormLabel, FormMessage} from '@/components/form';
import {Input} from '@/components/input';
import {Textarea} from '@/components/textarea';
import {Label} from '@/components/label';
import {DateTimePicker} from '@/components/date-time-picker';
import {RadioGroup, RadioGroupItem} from '@/components/radio-group';
import {Button} from '@/components/button';
import {sendEventRequest} from '@/app/events/event.service';

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
  }),
  limit: z.string(),
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
      limit: '0',
      type: 'public'
    },
  })
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const onSubmit = async (data: FormData) => {
    setLoading(true);
    const cookies = getCookies();
    const Cookie = cookies ? Object.entries(cookies)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value as string)}`)
      .join('; ') : '';
    const startDate = new Date(data.startDate).getTime();
    const endDate = new Date(data.endDate).getTime();
    const limit = parseInt(data.limit, 10);
    const body = {
      payload: {
        ...data,
        tags,
        startDate,
        endDate,
        limit
      },
      command: EventCommands.createEvent
    };
    try {
      const event = await sendEventRequest(body, Cookie);
      setLoading(false);
      router.push(`/events/${event.id}`);
    } catch (error) {
      setLoading(false);
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
            <div className="grid grid-cols-2 gap-2">
              <div>
                <FormField control={form.control} render={({field}) => (
                  <>
                    <FormLabel>Event Type</FormLabel>
                    <FormDescription>
                      Invite is sent through emails and permalink
                    </FormDescription>
                    <FormControl>
                      <RadioGroup className="flex gap-4 mt-2" {...field} onValueChange={field.onChange}>
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
              <div>
                <FormField control={form.control} render={({field}) => (
                  <>
                    <FormLabel>Participation Limit</FormLabel>
                    <FormDescription>
                      Set to 0 for unlimited
                    </FormDescription>
                    <FormControl>
                      <Input type="number" {...field}></Input>
                    </FormControl>
                  </>
                )} name="limit"/>
              </div>
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
                  {tag}
                    <button onClick={() => removeTag(index)} className="text-primary hover:text-primary/80">×</button>
                </span>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-4">
            <Button variant="outline">Cancel</Button>
            <Button type="submit" disabled={loading}>Create Event</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>)
};

export default CreateEventForm;
