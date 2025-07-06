'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/shadcn-ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from '@/components/shadcn-ui/carousel';
import Image from 'next/image';
import { Event } from '@/models/event.model';
import './event-multipanel.scss';

const EventImages = ({ event }: { event: Event }) => {
  console.log('Event Images:', event);
  return (
    <Carousel>
      <CarouselContent>
        <Image
          src="/images/default-event.jpg"
          alt="event-images"
          width={800}
          height={600}
          className="w-full h-auto object-cover"
        />
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

const EventMultipanel = ({ event }: { event: Event }) => {
  return (
    <Card className="event-multipanel">
      <CardHeader>
        <CardTitle>Event Images</CardTitle>
      </CardHeader>
      <CardContent>
        <EventImages event={event} />
      </CardContent>
    </Card>
  );
};

export default EventMultipanel;
