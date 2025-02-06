import {Card, CardContent} from '@/components/card';
import {Input} from '@/components/input';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/select';
import {Button} from '@/components/button';
import {Filter} from 'lucide-react';
import React from 'react';
import {EventCommands} from '@/enums/event.enum';
import fetchWithCookie from '@/utilities/fetch';
import {FilterEventsDTO} from '@/models/event.model';
import {Pagination, PaginationContent,
  PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/pagination';
import {Skeleton} from '@/components/skeleton';

const EventFilter = () => {
  return (
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
  )
}

const EventList = async({searchParams}: {searchParams: Promise<{ [key: string]: string | string[] | undefined }>}) => {
  const params = await searchParams;
  const {page} = params;
  const payload: FilterEventsDTO = {
    searchParam: '',
    page: page ? Number(page) : 1,
    limit: 10,
    sortField: 'name',
    sortOrder: 'asc'
  }
  const body = JSON.stringify({
    payload,
    command: EventCommands.filterEvents
  });
  const data = await fetchWithCookie(`${process.env.NEXT_PUBLIC_API_URL}/events`, {
    method: 'POST',
    body,
  });
  const res = await data.json();
  const {totalCount, totalPages, currentPage, events} = res.payload;
  console.log(totalCount, totalPages, currentPage, events.length);
  console.log(events);
  return (
    <div className="h-full max-w-7xl mx-auto">
      <div className="w-full mb-6">
        <EventFilter></EventFilter>
      </div>
      {/*TODO : design and implement event list*/}
      <Skeleton className="h-[900px] w-full mb-6"></Skeleton>

      <div className="w-full flex">
        <Pagination className="justify-between">
          <p className="text-sm flex items-center justify-center">Showing {events.length} out of {totalCount} events</p>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#"/>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="/events/all?page=1">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="/events/all?page=2">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis/>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#"/>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
export default EventList;
