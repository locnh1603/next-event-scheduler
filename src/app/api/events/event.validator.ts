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
      filter: z.object({
        type: z.string(),
      }),
    }),
  }),

  createEvent: z.object({
    command: z.literal('createEvent'),
    payload: z.object({
      name: z.string().min(1),
      description: z.string().optional(),
      startDate: z.number(),
      endDate: z.number(),
      location: z.string().optional(),
      image: z.string().optional(),
      type: z.string(),
      limit: z.number(),
      tags: z.array(z.string()),
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
};
