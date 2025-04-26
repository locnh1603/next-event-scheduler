import React from 'react';
import {EventModel, FilterEventsDTO} from '@/models/event.model';
import EventCard from '@/app/events/event-card';
import EventPagination from '@/app/events/all/event-pagination';
import {EventCommands} from '@/enums/event.enum';
import customFetch, {IRequestBody, IResponseBody} from '@/utilities/server-fetch';
import EventFilter from '@/app/events/all/event-filter';
import {UserModel} from '@/models/user.model';
import {generateUniqueArray} from '@/utilities/array-util';
import { env } from '@env';

const EventList = async ({searchParams}: {searchParams: Promise<{ [key: string]: string | undefined }>}) => {
  const { page, search, type } = await searchParams;
  const paramsArray = [];
  if (page) paramsArray.push(`page=${page}`);
  if (search) paramsArray.push(`search=${search}`);
  if (type) paramsArray.push(`type=${type}`);
  const params = paramsArray.join("&");
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
  const data = await customFetch(`${env.NEXT_PUBLIC_API_URL}/events`, {
    method: 'POST',
    body: JSON.stringify(body)
  });
  const {payload: {events, totalCount, totalPages, currentPage}} = await data.json();
  const userIds = generateUniqueArray(events.map((event: EventModel) => event.createdBy.toString()));
  const userResponse = await customFetch(`${env.NEXT_PUBLIC_API_URL}/users`, {
    method: 'POST',
    body: JSON.stringify({ payload: { ids: userIds }, command: 'getUsers' }),
  })
  const usersData: IResponseBody<UserModel[]> = await userResponse.json();
  const users: UserModel[] = usersData.payload;
  return (
    <div className="h-full max-w-7xl mx-auto">
      <div className="w-full mb-6">
        <EventFilter search={search ?? ''} type={type ?? ''}></EventFilter>
      </div>
      <section>
        <div className="w-full grid grid-cols-2 gap-2">
          {events.map((event: EventModel) => (
            <div className="my-2" key={event.id}>
              <EventCard event={event}
                         user={users.find((user: UserModel) => user.id === event.createdBy.toString()) ?? {} as UserModel}/>
            </div>
          ))}
        </div>
        <div className="w-full flex mt-2">
          <EventPagination currentPage={currentPage} totalPages={totalPages}
                           totalCount={totalCount} searchParams={params} events={events}>

          </EventPagination>
        </div>
      </section>
    </div>
  );
};

export default EventList;
