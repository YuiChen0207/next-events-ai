export interface IUser {
  id: number; // bigint from database (auto-increment)
  user_id: string; // UUID from auth.users
  name: string;
  email: string;
  role: "user" | "admin";
  avatar?: string;
  is_active: boolean;
  created_at: string;
}

export interface IRegisterPayload {
  name: string;
  email: string;
  password: string; // Only for registration, not stored in user-profiles
}
