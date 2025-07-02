export interface EventDTO {
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  location?: string;
  hostName?: string;
  allowSelfJoin?: boolean;
  allowAnonymousJoin?: boolean;
  maxParticipants?: number;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  location?: string;
  hostName?: string;
  createdBy: string;
  createdAt: string;
  allowSelfJoin: boolean;
  allowAnonymousJoin: boolean;
  maxParticipants?: number;
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
