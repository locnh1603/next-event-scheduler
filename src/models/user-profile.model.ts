export interface UserProfile {
  id: string;
  email: string;
  role: string;
  firstName: string | null;
  lastName: string | null;
  phoneNumber: string | null;
  birthday: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfileDTO {
  email: string;
  role: string;
  firstName?: string | null;
  lastName?: string | null;
  phoneNumber?: string | null;
  birthday?: string | null;
}
