import { customFetch as clientFetch } from '@/services/app/client/client-fetch';
import { UserProfileCommands } from '@/enums/event.enum';
import { UserProfile } from '@/models/user-profile.model';

const USER_PROFILE_API_URL = '/api/user-profiles';

class ClientUserProfileService {
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const response = await clientFetch(USER_PROFILE_API_URL, {
      method: 'POST',
      body: JSON.stringify({
        command: UserProfileCommands.getUserProfile,
        payload: { userId },
      }),
    });
    if (!response) {
      return null;
    }
    const data = await response.json();
    return data.payload;
  }
}

export const clientUserProfileService = new ClientUserProfileService();
