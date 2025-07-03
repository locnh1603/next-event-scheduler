export interface UserProfile {
  id: string;
  email: string;
  role: 'host' | 'client';
  firstname: string | null;
  lastname: string | null;
  phonenumber: string | null;
  birthday: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserProfileDTO {
  email: string;
  role: 'host' | 'client';
  firstname?: string | null;
  lastname?: string | null;
  phonenumber?: string | null;
  birthday?: string | null;
}
