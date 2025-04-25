import { z } from 'zod';

export const userValidator = {
  getUsers: z.object({
    command: z.literal('getUsers'),
    payload: z.object({
      ids: z.array(z.string()).optional(),
    }),
  }),
  inviteUsers: z.object({
    command: z.literal('inviteUser'),
    payload: z.object({
      ids: z.array(z.string())
    })
  }),
  inviteEmails: z.object({
    command: z.literal('inviteEmail'),
    payload: z.object({
      emails: z.array(z.string())
    })
  })
};
