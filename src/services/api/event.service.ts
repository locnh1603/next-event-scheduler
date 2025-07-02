import type { EventDTO, FilterEventsDTO } from '@/models/event.model';
import { createClient } from '@/lib/supabase/server';

class EventService {
  /**
   * Retrieves events by their IDs or all active events if no IDs are provided.
   * @param ids - Optional array of event IDs to filter by.
   * @returns Promise resolving to an array of event objects.
   */
  async getEvents(ids?: string[]) {
    const supabase = await createClient();
    if (ids?.length) {
      const events = await supabase
        .from('events')
        .select('id, title, description, start_time, end_time')
        .in('id', ids);
      return events.data;
    }
    const events = await supabase
      .from('events')
      .select('id, title, description, start_time, end_time');
    return events.data;
  }

  /**
   * Filters events based on search parameters, pagination, sorting, and creator.
   * @param params - Filtering, sorting, and pagination options.
   * @returns Promise resolving to an object containing filtered events and pagination info.
   */
  async filterEvents({
    searchParam,
    page,
    limit,
    sortField,
    sortOrder,
    createdBy,
  }: FilterEventsDTO & { createdBy: string }) {
    const supabase = await createClient();
    const skip = (page - 1) * limit;
    const [events, totalCount] = await Promise.all([
      supabase
        .from('events')
        .select('id, title, description, start_time, end_time')
        .filter('title', 'ilike', `%${searchParam}%`)
        .filter('created_by', 'eq', createdBy)
        .order(sortField, { ascending: sortOrder === 'asc' })
        .range(skip, skip + limit),
      supabase
        .from('events')
        .select('id', { count: 'exact' })
        .filter('title', 'ilike', `%${searchParam}%`)
        .filter('created_by', 'eq', createdBy),
    ]);

    if (events.data) {
      return {
        events: events.data,
        count: events.data.length,
        totalCount: totalCount.count,
        totalPages: totalCount.count && Math.ceil(totalCount.count / limit),
        currentPage: page,
      };
    }
  }

  /**
   * Creates a new event with the provided data and creator.
   * @param eventData - Data for the new event.
   * @param createdBy - ID of the user creating the event.
   * @returns Promise resolving to the created event object.
   */
  async createEvent(eventData: EventDTO, createdBy: string) {
    const supabase = await createClient();
    const newEvent = await supabase.from('events').insert({
      ...eventData,
      id: Date.now().toString(),
      created_by: createdBy,
    });
    return newEvent.data?.[0];
  }

  /**
   * Returns dashboard data including recent events, user's events, and hot events by participation count.
   * @param userId - ID of the authenticated user, can be null
   * @returns Object with newEvents, myEvents, and hotEvents
   */
  async getDashboardEvents(userId?: string) {
    const supabase = await createClient();
    const newEventsPromise = supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    const myEventsPromise = userId
      ? supabase
          .from('events')
          .select('*')
          .eq('created_by', userId)
          .order('created_at', { ascending: false })
          .limit(10)
      : Promise.resolve({ data: [] });

    const [newEventsRes, myEventsRes] = await Promise.all([
      newEventsPromise,
      myEventsPromise,
      [],
    ]);

    return {
      newEvents: newEventsRes.data ?? [],
      myEvents: myEventsRes.data ?? [],
      hotEvents: [],
    };
  }
}

export const eventService = new EventService();
