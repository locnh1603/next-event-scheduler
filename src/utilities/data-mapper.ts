import { Message } from '@/models/message.model';
import { UserProfile, UserProfileDTO } from '@/models/user-profile.model';
// Map DB row (snake_case) to app UserProfile (camelCase)
export interface DbUserProfileRow {
  id: string;
  email: string;
  role: 'host' | 'client';
  firstname: string | null;
  lastname: string | null;
  phonenumber: string | null;
  birthday: string | null;
  created_at: string;
  updated_at: string;
}

export function mapDbUserProfile(row: DbUserProfileRow): UserProfile {
  return {
    id: row.id,
    email: row.email,
    role: row.role,
    firstName: row.firstname ?? null,
    lastName: row.lastname ?? null,
    phoneNumber: row.phonenumber ?? null,
    birthday: row.birthday ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// Map request body (camelCase) to UserProfileDTO (snake_case)
export function mapRequestToUserProfileDTO(
  data: Partial<UserProfile>
): UserProfileDTO {
  return {
    email: data.email!,
    role: data.role!,
    firstname: data.firstName ?? null,
    lastname: data.lastName ?? null,
    phonenumber: data.phoneNumber ?? null,
    birthday: data.birthday ?? null,
  };
}
import { EventDTO, Event } from '@/models/event.model';

export function mapEventToDTO(event: Partial<Event>): EventDTO {
  function toDateString(val: string | Date | undefined): string {
    if (!val) return '';
    if (typeof val === 'string') return val;
    if (val instanceof Date) return val.toISOString();
    return '';
  }
  return {
    title: event.title ?? '',
    description: event.description,
    start_time: toDateString(event.startTime),
    end_time: toDateString(event.endTime),
    location: event.location,
    host_name: event.hostName,
    created_by: event.createdBy ?? '',
    allow_self_join: event.allowSelfJoin ?? false,
    allow_anonymous_join: event.allowAnonymousJoin ?? false,
    max_participants: event.maxParticipants,
  };
}

export interface DbEventRow {
  id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  location?: string;
  host_name?: string;
  created_by: string;
  created_at: string;
  allow_self_join: boolean;
  allow_anonymous_join: boolean;
  max_participants?: number;
}

export function mapSupabaseEvent(row: DbEventRow): Event {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? undefined,
    startTime: row.start_time,
    endTime: row.end_time,
    location: row.location ?? undefined,
    hostName: row.host_name ?? undefined,
    createdBy: row.created_by,
    createdAt: row.created_at,
    allowSelfJoin: row.allow_self_join,
    allowAnonymousJoin: row.allow_anonymous_join,
    maxParticipants: row.max_participants ?? undefined,
  };
}

export function mapSupabaseEvents(rows: DbEventRow[]): Event[] {
  return rows.map(mapSupabaseEvent);
}

export interface DbMessageRow {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  sent_at: string;
}

export function mapDbMessageToAppMessage(row: DbMessageRow): Message {
  return {
    id: row.id,
    senderId: row.sender_id,
    receiverId: row.receiver_id,
    content: row.content,
    sentAt: row.sent_at,
  };
}

export function mapDbMessagesToAppMessages(rows: DbMessageRow[]): Message[] {
  return rows.map(mapDbMessageToAppMessage);
}
