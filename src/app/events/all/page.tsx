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
import {generateNumberArray} from '@/utilities/functions';

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
              <SelectValue placeholder="Type"/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="invite">Invite Only</SelectItem>
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
  let pageToDisplay: number[] = [];
  if (totalPages < currentPage) {
    pageToDisplay = generateNumberArray(1, currentPage).slice(-5);
  } else {
    if (totalPages <= 5) {
      pageToDisplay = generateNumberArray(1, totalPages);
    } else if (currentPage <= 2 && totalPages <= 5) {
      pageToDisplay = generateNumberArray(1, currentPage);
    } else {
      const isNearEnd = currentPage + 2 >= totalPages;
      const firstPage = isNearEnd ? totalPages - 4 : ((currentPage - 2) > 0 ? currentPage - 2 : currentPage);
      const lastPage = isNearEnd ? totalPages : ((currentPage + 2) >= 5 ? currentPage + 2 : 5);
      pageToDisplay = generateNumberArray(firstPage, lastPage);
    }
  }
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
            <PaginationItem className={ currentPage <= 1 ? 'disabled' : ''}>
              <PaginationPrevious href="#"/>
            </PaginationItem>
            {pageToDisplay.map(page =>
              (
                <PaginationItem key={page}>
                  <PaginationLink href={`/events/all?page=${page}`}>{page}</PaginationLink>
                </PaginationItem>
              ))
            }
            {totalPages > 5 ?
              (<PaginationItem>
                <PaginationEllipsis/>
              </PaginationItem>) : null
            }
            <PaginationItem className={ currentPage >= totalPages ? 'disabled' : ''}>
              <PaginationNext href="#"/>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
export default EventList;
