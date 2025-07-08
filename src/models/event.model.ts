// Matches the public.events table
export interface EventDTO {
  title: string;
  description?: string;
  start_time: string; // timestamp with time zone
  end_time: string; // timestamp with time zone
  location?: string;
  host_name?: string;
  created_by: string; // uuid
  allow_self_join?: boolean;
  allow_anonymous_join?: boolean;
  max_participants?: number;
}

// App-level Event model
export interface Event {
  id: string;
  title: string;
  description?: string;
  startTime: string | Date;
  endTime: string | Date;
  location?: string;
  hostName?: string;
  createdBy: string;
  createdAt: string;
  allowSelfJoin: boolean;
  allowAnonymousJoin: boolean;
  maxParticipants?: number;
  invitationStatus?: 'accepted' | 'declined' | 'pending';
}

export interface GetEventsDTO {
  ids?: string[];
}

export interface FilterEventsDTO {
  searchParam: string;
  page: number;
  limit: number;
  sortField: string;
  sortOrder: 'asc' | 'desc';
}
