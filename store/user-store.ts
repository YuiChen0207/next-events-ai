import { create } from "zustand";
import type { IUser } from "@/interfaces";

export interface UserStore {
  user: Partial<IUser> | null;
  setUser: (payload: Partial<IUser> | null) => void;
}

const useUserStore = create<UserStore>((set) => ({
  user: null, // 初始狀態
  setUser: (payload: Partial<IUser> | null) => set({ user: payload }), //一個更新 user 的方法
}));

export default useUserStore;

// create 是一個 store factory
// 建立一個「全域 state 容器」
// 建立一個「訂閱機制」
// 回傳一個 React hook
// set 是什麼？Zustand 提供的 狀態更新器
// 只執行一次，在app啟動時（module 被 import）

// 資料流向為:
// set({ user: payload })
// Zustand 內部：
// 建立新 state
// 比對前後 state（shallow）
// 找出「誰有訂閱 user」
// 只 re-render 那些 component
// 不是整個 app re-render

// Zustand store（React 外）
//  ├─ state: { user }
//  ├─ set() 更新 state
//  └─ subscribers（React components）

// React Component
//  └─ useUserStore(selector)
//       └─ 訂閱 store
