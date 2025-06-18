export interface EventDTO {
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  hostId: string;
  allowSelfJoin?: boolean;
  allowAnonymousJoin?: boolean;
  maxParticipants?: number;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  hostId: string;
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
  filter: {
    type: string;
  };
}
