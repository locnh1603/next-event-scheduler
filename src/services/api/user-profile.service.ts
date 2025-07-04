import { createClient } from '@/lib/supabase/server';
import { mapDbUserProfile } from '@/utilities/data-mapper';

class UserProfileService {
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
