import { createClient } from '@/lib/supabase/server';
import { mapDbUserProfile } from '@/utilities/data-mapper';

class UserProfileService {
  /**
   * Fetches the profile of the currently authenticated user.
   * @returns A promise that resolves to the user's profile, or null if not found.
   * @throws {Error} If the user is not authenticated.
   */
  async getUserProfile() {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    if (error) {
      throw error;
    }
    return data ? mapDbUserProfile(data) : null;
  }

  /**
   * Fetches the profiles of multiple users based on their IDs.
   * @param userIds - An array of user IDs.
   * @returns A promise that resolves to an array of user profiles.
   */
  async getUserProfiles(userIds: string[]) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .in('id', userIds);
    if (error) {
      throw error;
    }
    return data ? data.map(mapDbUserProfile) : [];
  }
}

export const userProfileService = new UserProfileService();
