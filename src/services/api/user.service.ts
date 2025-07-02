import { createClient } from '@/lib/supabase/server';
const supabase = await createClient();

class UserService {
  async getUsers(ids: string[]) {
    const { data, error } = await supabase
      .from('public.profiles')
      .select('*')
      .in('id', ids);
    if (error) {
      throw error;
    }
    return data;
  }
  async getUser(id: string) {
    const { data, error } = await supabase
      .from('public.profiles')
      .select('*')
      .eq('id', id);
    if (error) {
      throw error;
    }
    return data;
  }
}

export const userService = new UserService();
