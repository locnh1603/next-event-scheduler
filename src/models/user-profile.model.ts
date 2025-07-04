export interface UserProfile {
  id: string;
  email: string;
  role: 'host' | 'client';
  firstName: string | null;
  lastName: string | null;
  phoneNumber: string | null;
  birthday: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfileDTO {
  email: string;
  role: 'host' | 'client';
  firstname?: string | null;
  lastname?: string | null;
  phonenumber?: string | null;
  birthday?: string | null;
}
