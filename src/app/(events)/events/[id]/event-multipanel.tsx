'use client';

import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from '@/components/shadcn-ui/carousel';
import Image from 'next/image';

const EventImages = () => {
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

const EventMultipanel = () => {
  return (
    <div className="flex flex-col h-full">
      <EventImages />
    </div>
  );
};

export default EventMultipanel;
