import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/app/components/card';
import { Input } from '@/app/components/input';
import { Label } from '@/app/components/label';
import { Textarea } from '@/app/components/textarea';
import { RadioGroup, RadioGroupItem } from '@/app/components/radio-group';
import { Button } from '@/app/components/button';
import { Calendar } from '@/app/components/calendar';
import {Popover, PopoverContent, PopoverTrigger} from '@/app/components/popover';
import { cn } from '@/app/lib/utils';
import moment from 'moment';
import {CalendarIcon} from 'lucide-react';

const CreateEventForm = () => {
  const tags = ['test'];
  const date = new Date();
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Event Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Event Name</Label>
          <Input id="name" placeholder="Enter event name" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Enter event description"
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <Label>Event Start and End Date</Label>
          <p className="text-sm text-muted-foreground m-0 p-0">can be the same day will indicate an all day event</p>
          <div className="border rounded-md p-2 flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-1/2 justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon/>
                  {date ? moment(date).format("DD/MM/yyyy") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-1/2 justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon/>
                  {date ? moment(date).format("DD-MM-yyyy") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" placeholder="Enter event location" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">Image URL</Label>
          <Input id="image" placeholder="Enter image URL" />
        </div>

        <div className="space-y-2">
          <Label>Event Type</Label>
          <RadioGroup defaultValue="public" className="flex gap-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="public" id="public" />
              <Label htmlFor="public">Public</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="invite" id="invite" />
              <Label htmlFor="invite">Invite Only</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label>Tags</Label>
          <Input
            placeholder="Type and press Enter to add tags"
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm flex items-center gap-1"
              >
                {tag}
                <button
                  className="text-primary hover:text-primary/80"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-4">
        <Button variant="outline">Cancel</Button>
        <Button>Create Event</Button>
      </CardFooter>
    </Card>
  )
};

const CreateEvent = () => {
  return (
    <div className="mt-4">
      <CreateEventForm></CreateEventForm>
    </div>
  );
};

export default CreateEvent;
