import { createClient } from '@/lib/supabase/server';

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
      .from('public.profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    if (error) {
      console.log('Error fetching user profile:', error, user.id);
      throw error;
    }
    return data;
  }

  async getUserProfiles(userIds: string[]) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('public.profiles')
      .select('*')
      .in('id', userIds);
    if (error) {
      throw error;
    }
    return data;
  }
}

export const userProfileService = new UserProfileService();
