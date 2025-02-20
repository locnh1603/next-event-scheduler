import { z } from 'zod';

export const userValidator = {
  getUsers: z.object({
    command: z.literal('getUsers'),
    payload: z.object({
      ids: z.array(z.string()).optional(),
    }),
  }),
};
