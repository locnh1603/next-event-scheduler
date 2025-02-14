import {Card, CardContent} from '@/components/card';
import {Input} from '@/components/input';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/select';
import {Button} from '@/components/button';
import React from 'react';
import {EventCommands} from '@/enums/event.enum';
import fetchWithCookie from '@/utilities/fetch';
import {EventModel, FilterEventsDTO} from '@/models/event.model';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/pagination';
import {Skeleton} from '@/components/skeleton';
import {generateNumberArray} from '@/utilities/functions';
import {redirect} from 'next/navigation';
import EventCard from '@/app/events/event-card';

const EventList = async({searchParams}: {searchParams: Promise<{ [key: string]: string | string[] | undefined }>}) => {
  const params = await searchParams;
  const {page, type, search} = params;
  const payload: FilterEventsDTO = {
    searchParam: search as string || '',
    page: page ? Number(page) : 1,
    limit: 10,
    sortField: 'name',
    sortOrder: 'asc',
    filter: {
      type: type as string || ''
    }
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
  } else if (totalPages <= 5) {
    pageToDisplay = generateNumberArray(1, totalPages);
  } else if (currentPage <= 2) {
    pageToDisplay = generateNumberArray(1, 5);
  } else if (currentPage + 2 >= totalPages) {
    const firstPage = totalPages - 4;
    pageToDisplay = generateNumberArray(firstPage, totalPages);
  } else {
    const firstPage = currentPage - 2;
    const lastPage = currentPage + 2;
    pageToDisplay = generateNumberArray(firstPage, lastPage);
  }
  const filterEvents = async(formData: FormData) => {
    'use server'
    const searchInput = formData.get('search');
    const typeInput = formData.get('type');
    const searchParam = searchInput ? `&search=${searchInput || search || ''}` : '';
    const typeParam = `&type=${typeInput || type || 'all'}`;
    const url = `/events/all?page=${page || 1}${searchParam}${typeParam}`
    redirect(url);
  }
  return (
    <div className="h-full max-w-7xl mx-auto">
      <div className="w-full mb-6">
        <Card>
          <CardContent className="p-4">
            <form action={filterEvents}>
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <Input placeholder={'Search events...'} defaultValue={search} className="w-full" name="search"/>
                </div>
                <Select name="type" defaultValue={type as string || 'all'}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Type"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="invite">Invite Only</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="flex items-center gap-2" type="submit">
                  Apply
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      {/*TODO : design and implement event list*/}
      <div className="w-full">
        {events.map((event: EventModel, index: number) => (<EventCard event={event} key={index}></EventCard>))}
      </div>

      <div className="w-full flex">
        <Pagination className="justify-between">
          <p className="text-sm flex items-center justify-center">Showing {events.length} out of {totalCount} events</p>
          <PaginationContent>
            <PaginationItem className={ currentPage <= 1 ? 'disabled' : ''}>
              <PaginationPrevious href="#"/>
            </PaginationItem>
            {pageToDisplay.map(page => {
              const pageUrl = `/events/all?page=${page}&type=${type || ''}&search=${search || ''}`;
              return ((
                <PaginationItem key={page}>
                  <PaginationLink href={pageUrl}>{page}</PaginationLink>
                </PaginationItem>
              ))})
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
