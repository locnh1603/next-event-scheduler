import { z } from 'zod';
import { UserProfileCommands } from '@/enums/event.enum';

export const userProfileValidator = {
  getUserProfile: z.object({
    command: z.literal(UserProfileCommands.getUserProfile),
    payload: z.object({
      userId: z.string(),
    }),
  }),
  getUserProfiles: z.object({
    command: z.literal(UserProfileCommands.getUserProfiles),
    payload: z.object({
      userIds: z.array(z.string()),
    }),
  }),
};
