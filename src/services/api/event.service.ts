import type { EventDTO, FilterEventsDTO } from '@/models/event.model';
import { createClient } from '@/lib/supabase/server';

class EventService {
  /**
   * Get participants for an event
   */
  async getParticipants(eventId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('event_participants')
      .select('user_id, users(name, email)')
      .eq('event_id', eventId);
    if (error) throw error;
    // No event data in this payload, return as is
    return data;
  }

  /**
   * Join an event as a participant
   */
  async joinEvent(eventId: string, userId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('event_participants')
      .insert({ event_id: eventId, user_id: userId })
      .select();
    if (error) throw error;
    // No event data in this payload, return as is
    return data;
  }

  /**
   * Invite users to an event
   */
  async inviteUsers(eventId: string, userIds: string[]) {
    const supabase = await createClient();
    const invitations = userIds.map((user_id) => ({
      event_id: eventId,
      user_id,
      status: 'pending',
    }));
    const { data, error } = await supabase
      .from('event_invitations')
      .insert(invitations)
      .select();
    if (error) throw error;
    // No event data in this payload, return as is
    return data;
  }
  /**
   * Updates an event by id with the provided data (snake_case DTO)
   * @param id - Event id
   * @param updateData - Partial<EventDTO> with fields to update
   * @returns Promise resolving to the updated event object
   */
  async updateEvent(id: string, updateData: Partial<EventDTO>) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('events')
      .update(updateData)
      .eq('id', id)
      .select();
    if (error) throw error;
    const { mapSupabaseEvent } = await import('@/utilities/data-mapper');
    return data?.[0] ? mapSupabaseEvent(data[0]) : null;
  }
  /**
   * Retrieves events by their IDs or all active events if no IDs are provided.
   * @param ids - Optional array of event IDs to filter by.
   * @returns Promise resolving to an array of event objects.
   */
  async getEvents(ids?: string[]) {
    const supabase = await createClient();
    let events;
    if (ids?.length) {
      events = await supabase
        .from('events')
        .select(
          'id, title, description, start_time, end_time, location, host_name, created_by, created_at, allow_self_join, allow_anonymous_join, max_participants'
        )
        .in('id', ids);
    } else {
      events = await supabase
        .from('events')
        .select(
          'id, title, description, start_time, end_time, location, host_name, created_by, created_at, allow_self_join, allow_anonymous_join, max_participants'
        );
    }
    const { mapSupabaseEvents } = await import('@/utilities/data-mapper');
    return events.data ? mapSupabaseEvents(events.data) : [];
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
        .select(
          'id, title, description, start_time, end_time, location, host_name, created_by, created_at, allow_self_join, allow_anonymous_join, max_participants'
        )
        .filter('title', 'ilike', `%${searchParam}%`)
        .filter('created_by', 'eq', createdBy)
        .order(sortField, { ascending: sortOrder === 'asc' })
        .range(skip, skip + limit - 1),
      supabase
        .from('events')
        .select('id', { count: 'exact' })
        .filter('title', 'ilike', `%${searchParam}%`)
        .filter('created_by', 'eq', createdBy),
    ]);

    const { mapSupabaseEvents } = await import('@/utilities/data-mapper');
    return {
      events: events.data ? mapSupabaseEvents(events.data) : [],
      count: events.data?.length ?? 0,
      totalCount: totalCount.count ?? 0,
      totalPages: totalCount.count ? Math.ceil(totalCount.count / limit) : 0,
      currentPage: page,
    };
  }

  /**
   * Creates a new event with the provided data and creator.
   * @param eventData - Data for the new event.
   * @param createdBy - ID of the user creating the event.
   * @returns Promise resolving to the created event object.
   */
  async createEvent(eventData: EventDTO, createdBy: string) {
    const supabase = await createClient();
    const newEvent = await supabase
      .from('events')
      .insert({
        ...eventData,
        created_by: createdBy,
      })
      .select();
    const { mapSupabaseEvent } = await import('@/utilities/data-mapper');
    return newEvent.data?.[0] ? mapSupabaseEvent(newEvent.data[0]) : null;
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

    const { mapSupabaseEvents } = await import('@/utilities/data-mapper');
    return {
      newEvents: newEventsRes.data ? mapSupabaseEvents(newEventsRes.data) : [],
      myEvents: myEventsRes.data ? mapSupabaseEvents(myEventsRes.data) : [],
      hotEvents: [],
    };
  }
}

export const eventService = new EventService();
