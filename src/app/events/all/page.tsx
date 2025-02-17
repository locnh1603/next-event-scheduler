'use client';
import {Card, CardContent} from '@/components/card';
import {Input} from '@/components/input';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/select';
import {Button} from '@/components/button';
import React, {useCallback, useEffect, useState} from 'react';
import {EventCommands} from '@/enums/event.enum';
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
import {generateNumberArray} from '@/utilities/functions';
import {useRouter, useSearchParams} from 'next/navigation';
import EventCard from '@/app/events/event-card';
import {useCookiesNext} from 'cookies-next';
import {Spinner} from '@/components/spinner';

const Loading = () => {
  return (
    <div className="w-full flex items-center justify-center mt-6">
      <Spinner size="small" className="mr-2 text-gray-600" /><p className="font-sans font-medium text-gray-600">Loading...</p>
    </div>
  )
}

const EventList = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getCookies } = useCookiesNext();
  const cookies = getCookies();
  const [events, setEvents] = useState<EventModel[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const page = searchParams.get('page') || '1';
  const type = searchParams.get('type') || '';
  const search = searchParams.get('search') || '';

  const fetchEvents = useCallback(async () => {
    const payload: FilterEventsDTO = {
      searchParam: search,
      page: Number(page),
      limit: 10,
      sortField: 'name',
      sortOrder: 'asc',
      filter: {
        type
      }
    }
    const Cookie = cookies ? Object.entries(cookies)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value as string)}`)
      .join('; ') : '';
    const body = JSON.stringify({
      payload,
      command: EventCommands.filterEvents
    });
    try {
      const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`, {
        method: 'POST',
        body,
        headers: {
          Cookie
        }
      });
      const res = await data.json();
      const {totalCount, totalPages, currentPage, events} = res.payload;
      setEvents(events);
      setTotalCount(totalCount);
      setTotalPages(totalPages);
      setCurrentPage(currentPage);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setIsLoading(false);
      console.log('loaded');
    }
  }, [search, page, type]);

  useEffect(() => {
    fetchEvents().then();
  }, [fetchEvents]);

  const getPageToDisplay = () => {
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
    return pageToDisplay;
  };

  const filterEvents = (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchInput = formData.get('search');
    const typeInput = formData.get('type');
    const params = new URLSearchParams();
    params.set('page', '1');
    if (searchInput) params.set('search', searchInput.toString());
    if (typeInput) params.set('type', typeInput.toString());
    router.push(`/events/all?${params.toString()}`);
  };

  return (
    <div className="h-full max-w-7xl mx-auto">
      <div className="w-full mb-6">
        <Card>
          <CardContent className="p-4">
            <form onSubmit={filterEvents}>
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <Input
                    placeholder="Search events..."
                    defaultValue={search}
                    className="w-full"
                    name="search"
                  />
                </div>
                <Select name="type" defaultValue={type || 'all'}>
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
      {isLoading ? (<Loading></Loading>) :
        (
          <section>
            <div className="w-full">
              {events.map((event: EventModel, index: number) => (
                <EventCard event={event} key={index}/>
              ))}
            </div>

            <div className="w-full flex mt-2">
              <Pagination className="justify-between">
                <p className="text-sm flex items-center justify-center">
                  Showing {events.length} out of {totalCount} events
                </p>
                <PaginationContent>
                  <PaginationItem className={currentPage <= 1 ? 'disabled' : ''}>
                    <PaginationPrevious href="#"/>
                  </PaginationItem>
                  {getPageToDisplay().map(page => {
                    const params = new URLSearchParams(searchParams.toString());
                    params.set('page', page.toString());
                    const pageUrl = `/events/all?${params.toString()}`;
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink href={pageUrl}>{page}</PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  {totalPages > 5 && (
                    <PaginationItem>
                      <PaginationEllipsis/>
                    </PaginationItem>
                  )}
                  <PaginationItem className={currentPage >= totalPages ? 'disabled' : ''}>
                    <PaginationNext href="#"/>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </section>
        )
      }
    </div>
  );
};

export default EventList;
