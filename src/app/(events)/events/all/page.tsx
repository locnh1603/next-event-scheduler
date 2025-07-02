import React from 'react';
import { Event, FilterEventsDTO } from '@/models/event.model';
import EventCard from '@/app/(events)/events/event-card';
import EventPagination from '@/app/(events)/events/all/event-pagination';
import { EventCommands } from '@/enums/event.enum';
import customFetch, { IRequestBody } from '@/services/app/server/server-fetch';
import EventFilter from '@/app/(events)/events/all/event-filter';
import { env } from '@env';

const EventList = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const { page, search, type } = await searchParams;
  const paramsArray = [];
  if (page) paramsArray.push(`page=${page}`);
  if (search) paramsArray.push(`search=${search}`);
  if (type) paramsArray.push(`type=${type}`);
  const params = paramsArray.join('&');
  const body: IRequestBody<FilterEventsDTO> = {
    command: EventCommands.filterEvents,
    payload: {
      searchParam: search || '',
      page: Number(page) || 1,
      limit: 20,
      sortField: 'startDate',
      sortOrder: 'asc',
    },
  };
  const data = await customFetch(`${env.NEXT_PUBLIC_API_URL}/events`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
  const {
    payload: { events, totalCount, totalPages, currentPage },
  } = await data.json();
  return (
    <div className="h-full max-w-7xl mx-auto">
      <div className="w-full mb-6">
        <EventFilter search={search ?? ''} type={type ?? ''}></EventFilter>
      </div>
      <section>
        <div className="w-full grid grid-cols-2 gap-2">
          {events.map((event: Event) => (
            <div className="my-2" key={event.id}>
              <EventCard event={event} />
            </div>
          ))}
        </div>
        <div className="w-full flex mt-2">
          <EventPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalCount={totalCount}
            searchParams={params}
            events={events}
          ></EventPagination>
        </div>
      </section>
    </div>
  );
};

export default EventList;
