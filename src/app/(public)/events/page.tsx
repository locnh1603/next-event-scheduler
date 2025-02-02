import React from 'react';
import { Card, CardContent } from "@/app/components/card";
import { Button } from "@/app/components/button";
import { Input } from "@/app/components/input";
import { Calendar, Clock, MapPin, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/select";
const Events = async () => {
  // const body = JSON.stringify({
  //   payload: {
  //     ids: []
  //   },
  //   command: 'getEvents'
  // });
  // const data = await fetchWithCookie(`${process.env.NEXT_PUBLIC_API_URL}/events`, {
  //   method: 'POST',
  //   body,
  // });
  // const { payload }: IResponseBody<EventModel[]> = await data.json();
  const myEvents = [
    { id: 1, title: "Tech Conference 2025", date: "Mar 15", location: "San Francisco", time: "9:00 AM" },
    { id: 2, title: "Design Workshop", date: "Mar 20", location: "New York", time: "2:00 PM" },
  ];

  const hotEvents = [
    { id: 3, title: "Music Festival", date: "Mar 25", location: "Los Angeles", time: "7:00 PM" },
    { id: 4, title: "Food & Wine Expo", date: "Mar 30", location: "Chicago", time: "11:00 AM" },
  ];

  const allEvents = [
    { id: 5, title: "Startup Meetup", date: "Apr 5", location: "Seattle", time: "6:00 PM" },
    { id: 6, title: "Art Exhibition", date: "Apr 10", location: "Miami", time: "3:00 PM" },
    { id: 7, title: "Sports Tournament", date: "Apr 15", location: "Boston", time: "10:00 AM" },
    { id: 8, title: "Comedy Night", date: "Apr 20", location: "Austin", time: "8:00 PM" },
  ];
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-6">
        <h1 className="text-4xl font-bold mb-2">Events Dashboard</h1>
        <p className="text-gray-600">Discover and manage your events</p>
      </div>

      {/* My Events Section */}
      <section className="max-w-7xl mx-auto mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">My Events</h2>
          <Button variant="outline">View All</Button>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {myEvents.map(event => (
            <Card key={event.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{event.title}</h3>
                    <div className="flex items-center gap-2 text-gray-600 mt-2">
                      <Calendar className="w-4 h-4"/>
                      <span>{event.date}</span>
                      <Clock className="w-4 h-4 ml-2"/>
                      <span>{event.time}</span>
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
          ))}
        </div>
      </section>

      {/* Hot Events Section */}
      <section className="max-w-7xl mx-auto mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Hot Events</h2>
          <Button variant="outline">View All</Button>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {hotEvents.map(event => (
            <Card key={event.id} className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-100">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{event.title}</h3>
                    <div className="flex items-center gap-2 text-gray-600 mt-2">
                      <Calendar className="w-4 h-4"/>
                      <span>{event.date}</span>
                      <Clock className="w-4 h-4 ml-2"/>
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 mt-1">
                      <MapPin className="w-4 h-4"/>
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <Button variant="secondary">Register</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Filter Bar */}
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

      {/* All Events Section */}
      <section className="max-w-7xl mx-auto mb-6">
        <div className="grid md:grid-cols-2 gap-4">
          {allEvents.map(event => (
            <Card key={event.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{event.title}</h3>
                    <div className="flex items-center gap-2 text-gray-600 mt-2">
                      <Calendar className="w-4 h-4"/>
                      <span>{event.date}</span>
                      <Clock className="w-4 h-4 ml-2"/>
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 mt-1">
                      <MapPin className="w-4 h-4"/>
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <div>
                    <Button variant="secondary">View Details</Button>
                    <Button variant="secondary" className="ml-2">Register</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Pagination */}
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
