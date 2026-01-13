import { create } from "zustand";
import type { IUser } from "@/interfaces";

export interface UserStore {
  user: Partial<IUser> | null;
  setUser: (payload: Partial<IUser> | null) => void;
}

const useUsersStore = create<UserStore>((set) => ({
  user: null,
  setUser: (payload: Partial<IUser> | null) => set({ user: payload }),
}));

export default useUsersStore;
