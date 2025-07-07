import type { EventDTO, FilterEventsDTO } from '@/models/event.model';
import { createAdminClient, createClient } from '@/lib/supabase/server';
import { mailService } from './mail.service';
import {
  mapSupabaseEvent,
  mapSupabaseEvents,
  mapSupabaseInvitation,
  mapSupabaseInvitations,
} from '@/utilities/data-mapper';

class EventService {
  /**
   * Get all participants for a given event.
   * @param eventId - The ID of the event for which to get the participants.
   * @returns A list of participants with their user IDs, names, and emails.
   * @throws An error if the request fails.
   */
  async getParticipants(eventId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('event_participants')
      .select('user_id, users(name, email)')
      .eq('event_id', eventId);
    if (error) throw error;
    return data;
  }

  /**
   * Adds a user to the list of participants for the specified event.
   * @param eventId - The ID of the event to join.
   * @param userId - The ID of the user joining the event.
   * @returns A promise resolving to the data of the newly added participant.
   * @throws Will throw an error if the insertion fails.
   */

  async joinEvent(eventId: string, userId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('event_participants')
      .insert({ event_id: eventId, user_id: userId })
      .select();
    if (error) throw error;
    return data?.[0];
  }

  /**
   * Invites users to an event by creating invitation records in the database.
   * @param eventId - The ID of the event to invite users to.
   * @param userIds - An array of user IDs to be invited to the event.
   * @returns A promise resolving to the data of the newly created invitations.
   * @throws An error if the insertion fails.
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

    return {
      newEvents: newEventsRes.data ? mapSupabaseEvents(newEventsRes.data) : [],
      myEvents: myEventsRes.data ? mapSupabaseEvents(myEventsRes.data) : [],
      hotEvents: [],
    };
  }

  /**
   * Sends an email invitation to the provided emails and creates a new EventInvitation row
   * in the database.
   * @param eventId - ID of the event to invite to
   * @param emails - Array of email addresses to invite
   * @returns An object containing the IDs of the created invitations.
   */
  async inviteByEmails(eventId: string, userId: string, emails: string[]) {
    // This call uses the Supabase service role key to bypass RLS for invitation creation
    const supabase = await createAdminClient();
    const invitationsToInsert = emails.map((email) => ({
      event_id: eventId,
      user_id: userId,
      receiver_email: email,
    }));

    const { data: insertedInvitations, error: insertError } = await supabase
      .from('event_invitations')
      .insert(invitationsToInsert)
      .select('id, receiver_email, token');

    if (insertError) {
      throw insertError;
    }

    const invitationIds = insertedInvitations.map((inv) => inv.id);
    const invitationEmails = insertedInvitations.map((inv) => {
      return {
        id: inv.id,
        email: inv.receiver_email,
        token: inv.token,
      };
    });

    // Send emails using the inserted invitation data
    await mailService.inviteEmails(invitationEmails, eventId);

    return { invitationIds };
  }

  /**
   * Retrieves a single event invitation by its ID.
   * @param id - The ID of the event invitation to fetch.
   * @returns A promise resolving to the event invitation data.
   * @throws An error if the request fails or the invitation is not found.
   */

  async getEventInvitation(token: string) {
    const supabase = await createAdminClient();
    const { data, error } = await supabase
      .from('event_invitations')
      .select('*')
      .eq('token', token)
      .single();
    if (error) throw error;
    return mapSupabaseInvitation(data);
  }

  /**
   * Retrieves all invitations for a specified event by event ID.
   * @param eventId - The ID of the event for which to fetch invitations.
   * @returns A promise resolving to a list of invitations associated with the event.
   * @throws An error if the request fails.
   */

  async getEventInvitationsByEventId(eventId: string) {
    const supabase = await createClient();
    const { data: invitations, error } = await supabase
      .from('event_invitations')
      .select('*')
      .eq('event_id', eventId);

    if (error) {
      console.error('Error fetching invitations:', error);
      throw new Error('Could not fetch invitations.');
    }
    return mapSupabaseInvitations(invitations);
  }

  /**
   * Retrieves the event associated with a given invitation ID.
   * @param invitationId - The ID of the invitation to fetch the related event.
   * @returns A promise resolving to the event data associated with the invitation.
   * @throws An error if the invitation or event is not found, or if the request fails.
   */

  async getEventByInvitationId(token: string) {
    const supabase = await createAdminClient();
    const { data, error } = await supabase
      .from('event_invitations')
      .select('event_id')
      .eq('token', token)
      .single();
    if (error) throw error;
    if (!data) throw new Error('Invitation not found');

    const event = await supabase
      .from('events')
      .select('*')
      .eq('id', data.event_id)
      .single();
    if (event.error) throw event.error;

    return mapSupabaseEvent(event.data);
  }

  /**
   * Updates the status of the invitation to 'accepted'.
   * @param invitationId - The ID of the invitation to accept.
   * @returns A promise resolving to the updated invitation data.
   * @throws An error if the invitation is not found, or if the request fails.
   */
  async acceptInvitation(token: string) {
    const supabase = await createAdminClient();
    const { data, error } = await supabase
      .from('event_invitations')
      .update({ status: 'accepted' })
      .eq('token', token)
      .select()
      .single();
    if (error) throw error;
    return mapSupabaseInvitation(data);
  }

  /**
   * Updates the status of the invitation to 'declined'.
   * @param invitationId - The ID of the invitation to decline.
   * @returns A promise resolving to the updated invitation data.
   * @throws An error if the invitation is not found, or if the request fails.
   */
  async declineInvitation(token: string) {
    const supabase = await createAdminClient();
    const { data, error } = await supabase
      .from('event_invitations')
      .update({ status: 'declined' })
      .eq('token', token)
      .select()
      .single();
    if (error) throw error;
    return mapSupabaseInvitation(data);
  }
}

export const eventService = new EventService();
