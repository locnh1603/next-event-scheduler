import { z } from 'zod';

export const eventValidators = {
  getEvents: z.object({
    command: z.literal('getEvents'),
    payload: z.object({
      ids: z.array(z.string()).optional(),
    }),
  }),

  filterEvents: z.object({
    command: z.literal('filterEvents'),
    payload: z.object({
      searchParam: z.string().optional(),
      page: z.number().min(1),
      limit: z.number().min(1).max(100),
      sortField: z.string(),
      sortOrder: z.enum(['asc', 'desc']),
    }),
  }),

  createEvent: z.object({
    command: z.literal('createEvent'),
    payload: z.object({
      title: z.string().min(1),
      description: z.string().optional(),
      startTime: z.coerce.date(),
      endTime: z.coerce.date(),
      location: z.string().optional(),
      allowSelfJoin: z.boolean().optional(),
      allowAnonymousJoin: z.boolean().optional(),
      maxParticipants: z.number().optional(),
      hostName: z.string().optional(),
    }),
  }),

  updateEventDetails: z.object({
    command: z.literal('updateEventDetails'),
    payload: z.object({
      id: z.string().min(1),
      name: z.string().optional(),
      description: z.string().optional(),
    }),
  }),

  joinEvent: z.object({
    command: z.literal('joinEvent'),
    payload: z.object({
      eventId: z.string().min(1),
    }),
  }),

  getParticipants: z.object({
    command: z.literal('getParticipants'),
    payload: z.object({
      eventId: z.string(),
    }),
  }),

  inviteUsers: z.object({
    command: z.literal('inviteUsers'),
    payload: z.object({
      eventId: z.string().min(1),
      userIds: z.array(z.string()),
    }),
  }),

  inviteEmails: z.object({
    command: z.literal('inviteEmail'),
    payload: z.object({
      eventId: z.string().min(1),
      emails: z.array(z.string()),
    }),
  }),

  getInvitation: z.object({
    command: z.literal('getInvitation'),
    payload: z.object({
      id: z.string().min(1),
    }),
  }),

  getInvitationsByEventId: z.object({
    command: z.literal('getInvitationsByEventId'),
    payload: z.object({
      eventId: z.string().min(1),
    }),
  }),

  getEventByInvitationId: z.object({
    command: z.literal('getEventByInvitationId'),
    payload: z.object({
      token: z.string().min(1),
    }),
  }),

  acceptInvitation: z.object({
    command: z.literal('acceptInvitation'),
    payload: z.object({
      token: z.string().min(1),
    }),
  }),

  declineInvitation: z.object({
    command: z.literal('declineInvitation'),
    payload: z.object({
      token: z.string().min(1),
    }),
  }),
};
