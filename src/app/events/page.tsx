import React from 'react';
import { Card, CardContent } from "@/components/card";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Calendar, Clock, MapPin, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/select";
import fetchWithCookie from '@/utilities/fetch';
import {EventModel} from '@/models/event.model';
import {IResponseBody} from '@/models/fetch.model';
import {EventCommands} from '@/enums/event.enum';
import {auth} from '@/auth';
const Events = async () => {
  const session = await auth();
  const body = JSON.stringify({
    payload: {
      ids: []
    },
    command: EventCommands.getDashboardEvents
  });
  const data = await fetchWithCookie(`${process.env.NEXT_PUBLIC_API_URL}/events`, {
    method: 'POST',
    body,
  });
  const { payload }: IResponseBody<{
    myEvents: EventModel[];
    hotEvents: EventModel[];
    recentEvents: EventModel[];
  }> = await data.json();
  const { myEvents, hotEvents, recentEvents } = payload;
  const eventCard = (event: EventModel) => {
    return (
      <Card key={event.id}>
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg">{event.name}</h3>
              <div className="flex items-center gap-2 text-gray-600 mt-2">
                <Calendar className="w-4 h-4"/>
                <span>{event.name}</span>
                <Clock className="w-4 h-4 ml-2"/>
                <span>{event.name}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 mt-1">
                <MapPin className="w-4 h-4"/>
                <span>{event.location}</span>
              </div>
            </div>
            <Button>Manage</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="h-full">
      <div className="max-w-7xl mx-auto mb-6">
        <h1 className="text-4xl font-bold mb-2">Events Dashboard</h1>
        <p className="text-gray-600">Discover and manage your events</p>
      </div>
      {
        session ? (
          <section className="max-w-7xl mx-auto mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">My Events</h2>
              <Button variant="outline">View All</Button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {myEvents.map(event => eventCard(event))}
            </div>
          </section>
        ) : <></>
      }
      <section className="max-w-7xl mx-auto mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Hot Events</h2>
          <Button variant="outline">View All</Button>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {hotEvents.map(event => eventCard(event))}
        </div>
      </section>
      <section className="max-w-7xl mx-auto mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Recent Events</h2>
        </div>
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <Input placeholder="Search events..." className="w-full"/>
              </div>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="tech">Technology</SelectItem>
                  <SelectItem value="music">Music</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Location"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="sf">San Francisco</SelectItem>
                  <SelectItem value="ny">New York</SelectItem>
                  <SelectItem value="la">Los Angeles</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="w-4 h-4"/>
                More Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
      <section className="max-w-7xl mx-auto mb-6">
        <div className="grid md:grid-cols-2 gap-4">
          {recentEvents.map(event => eventCard(event))}
        </div>
      </section>
      <div className="max-w-7xl mx-auto flex justify-center gap-2">
        <Button variant="outline" size="icon">
          <ChevronLeft className="w-4 h-4"/>
        </Button>
        <Button variant="outline">1</Button>
        <Button>2</Button>
        <Button variant="outline">3</Button>
        <Button variant="outline">4</Button>
        <Button variant="outline" size="icon">
          <ChevronRight className="w-4 h-4"/>
        </Button>
      </div>
    </div>
  );
}
export default Events;
