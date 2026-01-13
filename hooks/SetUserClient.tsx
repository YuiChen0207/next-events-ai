"use client";

import { useEffect } from "react";
import type { IUser } from "@/interfaces";
import useUserStore from "@/store/user-store";

// SetUserClient 是 一個小 client component，專門用來：
// 接收 server 傳來的 user
// 呼叫 useEffect 將 user 寫入 store

export default function SetUserClient({
  user,
}: {
  user: IUser | Partial<IUser> | null;
}) {
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    setUser(user);
  }, [user, setUser]);

  return null;
}
