import React from 'react';
import {EventModel, FilterEventsDTO} from '@/models/event.model';
import EventCard from '@/app/events/event-card';
import EventPagination from '@/app/events/all/event-pagination';
import {IRequestBody} from '@/models/fetch.model';
import {EventCommands} from '@/enums/event.enum';
import fetchWithCookie from '@/utilities/fetch-server-action';
import EventFilter from '@/app/events/all/event-filter';

const EventList = async ({searchParams}: {searchParams: Promise<{ [key: string]: string | undefined }>}) => {
  const {page, search, type} = await searchParams;
  const params = `${page ? `page=${page}` : ''}${search ? `&search=${search}` : ''}${type ? `&type=${type}` : ''}`;
  const body: IRequestBody<FilterEventsDTO> = {
    command: EventCommands.filterEvents,
    payload: {
      searchParam: search || '',
      page: Number(page) || 1,
      limit: 20,
      sortField: 'startDate',
      sortOrder: 'asc',
      filter: {type: type || 'all'},
    }
  }
  const data = await fetchWithCookie(`${process.env.NEXT_PUBLIC_API_URL}/events`, {
    method: 'POST',
    body: JSON.stringify(body)
  });
  const {payload: {events, totalCount, totalPages, currentPage}} = await data.json();
  return (
    <div className="h-full max-w-7xl mx-auto">
      <div className="w-full mb-6">
        <EventFilter search={search ?? ''} type={type ?? ''}></EventFilter>
      </div>
      <section>
        <div className="w-full grid grid-cols-2 gap-2">
          {events.map((event: EventModel, index: number) => (
            <div className="my-2" key={index}>
              <EventCard event={event}/>
            </div>
          ))}
        </div>
        <div className="w-full flex mt-2">
          <EventPagination currentPage={currentPage} totalPages={totalPages} totalCount={totalCount} searchParams={params} events={events}></EventPagination>
        </div>
      </section>
    </div>
  );
};

export default EventList;
