# 專案架構說明

簡要說明此專案的目錄、資料流與重要設計決策，方便新成員快速上手與擴充。

## 概覽

本專案使用 Next.js（App Router）、TypeScript 與 Supabase 作為主要後端服務。結構上把界面、可重用元件、服務（actions）與資料存取層分離，便於測試與維護。

## 主要目錄與職責

- `app/`: Next.js App Router 的頁面與路由，包含公開、登入、註冊、使用者與管理端（`(private)` 與 `(public)`）等子路由。
- `components/`: 可重用 UI 與 layout 元件（`layout/`、`ui/`），包含表單元件、表格、spinner 等。
- `actions/`: 與後端交互的伺服器端行為（例如 `events.ts`, `users.ts`, `file-uploads.ts`），封裝商業邏輯與資料庫操作。
- `lib/`: 工具與第三方客戶端封裝（`utils.ts`、`supabase/`），包含 `client.ts`、`server.ts`、`auth.ts` 等 Supabase 相關整合。
- `hooks/`: 客戶端 React hooks（例如 `SetUserClient.tsx`）供頁面/元件使用。
- `store/`: 全域狀態管理（例如 `user-store.ts`），通常用於 session、使用者狀態等。
- `constants/`, `interfaces/`: 共用常數與 TypeScript 型別與介面。
- `public/`: 靜態資源。

## 資料流與認證

- 認證與使用者資料透過 Supabase 處理；存在 `lib/supabase/` 的 `client.ts`（客户端）與 `server.ts`（伺服器端）中。大部分需要身份的操作，應該於 server-side actions（`actions/`）或 server components 中執行以保護憑證。
- 上傳檔案由 `actions/file-uploads.ts` 管理，檔案儲存與權限由 Supabase Storage 處理。

## 元件與樣式約定

- `components/ui/` 含基礎可重用元件（`button.tsx`, `input.tsx`, `select.tsx` 等），遵循單一職責與接受 props 的方式；樣式採用全域 CSS（`app/globals.css`）搭配組件層級類別。

## 擴充與撰寫新功能指引

- 新增頁面：在 `app/` 下建立對應路由資料夾與 `page.tsx`。
- 新增後端行為：在 `actions/` 新增檔案並顯式導出可被前端呼叫的函式。
- 新增共用元件：放入 `components/ui/`，保持 API 一致性與文件註解。

## 測試與本地開發

- 啟動：依 `package.json` 指令（通常 `npm run dev` 或 `pnpm dev`）啟動 Next.js 開發伺服器。
- 環境變數：把 Supabase URL/KEY、第三方憑證放在 `.env.local`，勿提交至版本控制。

## 部署建議

- 推薦部署至 Vercel 或相容的 Next.js 平台，並在部署環境中設定必要的環境變數（Supabase、第三方 API Keys）。

## 其他資源與注意事項

- Skills 與 agent 相關內容位於 `.agent/skills/`（如 `.agent/skills/walkthrough.md` 與 `skills_index.json`）。
- 若要新增 API route 或外部服務整合，請務必在 `lib/` 建立對應封裝並在 `README` 或此檔補上使用說明。

---

如需我把此文件翻成英文、加上 ASCII 目錄索引，或自動產生圖示（例如 Mermaid 圖），告訴我你要哪種格式。 
