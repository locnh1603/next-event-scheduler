export interface IUserProfile {
  id: string;
  email: string;
  role: string;
  firstname: string | null;
  lastname: string | null;
  phonenumber: string | null;
  birthday: string | null;
  created_at: string;
  updated_at: string;
}
