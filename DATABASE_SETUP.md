# 數據庫設置指南 (Database Setup Guide)

## 📋 前提條件

確保你已經：

1. ✅ 註冊 Supabase 帳號：https://app.supabase.com
2. ✅ 創建一個新的 Supabase 項目

---

## 🚀 快速設置步驟

### 步驟 1: 打開 Supabase SQL Editor

1. 登入你的 Supabase Dashboard
2. 選擇你的項目
3. 點擊左側選單的 **「SQL Editor」**
4. 點擊 **「New Query」** 創建新查詢

### 步驟 2: 執行完整數據庫 Schema

複製 `supabase-schema-complete.sql` 的所有內容並貼到 SQL Editor 中，然後點擊 **「Run」** 執行。

這會創建以下表格：

#### 1️⃣ **Events Table (活動表)**

```
- id, title, description, date, time
- location, capacity, images, status
```

#### 2️⃣ **Event Ticket Types Table (票種表)**

```
- id, event_id, name, price
- total_tickets, available_tickets, booked_tickets
```

#### 3️⃣ **Bookings Table (訂單表)** ⭐ 重點

```
- id, event_id, user_id
- customer_name, customer_email, customer_phone
- total_amount, status
- stripe_session_id, payment_intent_id (Stripe 付款整合)
```

#### 4️⃣ **Booking Tickets Table (訂單票券明細表)**

```
- id, booking_id, ticket_type_id
- quantity, price_per_ticket, subtotal
```

#### 5️⃣ **User Profiles Table (用戶檔案表)**

```
- id, user_id, name, email, role, avatar
```

### 步驟 3: 驗證表格已創建

在 SQL Editor 底部你應該會看到成功訊息，顯示所有表格已創建。

或者你可以點擊左側選單的 **「Table Editor」** 查看所有表格。

---

## 🔐 安全設置 (Row Level Security)

這個 schema 已經包含了 Row Level Security (RLS) 政策：

✅ **Events & Ticket Types** - 所有人可讀，認證用戶可寫
✅ **Bookings** - 用戶只能查看和管理自己的訂單
✅ **Booking Tickets** - 用戶只能查看自己訂單的票券
✅ **User Profiles** - 用戶只能查看和更新自己的檔案

---

## 📊 數據庫架構圖

```
┌─────────────────┐
│     Events      │
│  (活動主表)      │
└────────┬────────┘
         │
         │ 1:N
         │
┌────────▼────────────┐        ┌──────────────────┐
│ Event Ticket Types  │        │   User Profiles  │
│   (票種表)           │        │   (用戶檔案)      │
└────────┬────────────┘        └────────┬─────────┘
         │                              │
         │                              │
         │ N:M (透過 Booking Tickets)    │ 1:N
         │                              │
         │        ┌─────────────────────▼──┐
         │        │      Bookings          │
         │        │     (訂單表)            │
         │        │  - stripe_session_id   │
         │        │  - payment_intent_id   │
         │        └─────────────────────┬──┘
         │                              │
         │                              │ 1:N
         │                              │
┌────────▼──────────────────────────────▼──┐
│         Booking Tickets                   │
│        (訂單票券明細)                      │
└───────────────────────────────────────────┘
```

---

## 🧪 測試數據庫 (可選)

你可以插入一些測試數據來驗證設置：

```sql
-- 插入測試活動
INSERT INTO events (title, small_description, date, start_time, end_time, location, capacity, status)
VALUES
('測試音樂會', '一場精彩的音樂表演', '2026-03-15', '19:00:00', '21:00:00', '台北小巨蛋', 200, 'active');

-- 獲取剛創建的活動 ID
SELECT id, title FROM events WHERE title = '測試音樂會';

-- 使用上面的活動 ID 插入票種 (替換 'your-event-id-here')
INSERT INTO event_ticket_types (event_id, name, price, total_tickets, available_tickets)
VALUES
('your-event-id-here', 'VIP票', 1500.00, 50, 50),
('your-event-id-here', '普通票', 800.00, 150, 150);

-- 查看結果
SELECT
  e.title,
  ett.name as ticket_type,
  ett.price,
  ett.available_tickets
FROM events e
JOIN event_ticket_types ett ON e.id = ett.event_id
WHERE e.title = '測試音樂會';
```

---

## ✅ 完成檢查清單

確保以下都已完成：

- [ ] ✅ 執行 `supabase-schema-complete.sql` 創建所有表格
- [ ] ✅ 在 Table Editor 中看到 5 個表格
- [ ] ✅ Row Level Security (RLS) 已啟用
- [ ] ✅ 測試數據插入成功（可選）

---

## 🎯 接下來做什麼？

數據庫設置完成後，返回 Stripe 整合設置：

1. ✅ 數據庫已設置 ← **你在這裡**
2. ⏭️ 設置環境變數 (.env.local)
3. ⏭️ 配置 Stripe webhook
4. ⏭️ 測試付款流程

查看 `STRIPE_QUICKSTART.md` 了解完整的 Stripe 設置步驟。

---

## ❓ 常見問題

### Q: 如果表格已經存在怎麼辦？

A: Script 使用 `CREATE TABLE IF NOT EXISTS`，所以不會覆蓋現有表格。如果需要重新創建，先刪除舊表：

```sql
DROP TABLE IF EXISTS booking_tickets CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS event_ticket_types CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
```

### Q: RLS 政策會影響 Server Actions 嗎？

A: 不會。Server Actions 使用 `SUPABASE_SERVICE_ROLE_KEY` 繞過 RLS。RLS 主要保護客戶端查詢。

### Q: 需要手動創建 auth.users 表嗎？

A: 不需要。Supabase 自動創建和管理 `auth.users` 表。

---

## 📞 需要幫助？

如果遇到問題：

1. 檢查 SQL 執行是否有錯誤訊息
2. 確認 Supabase 項目已正確創建
3. 確認你有足夠的權限執行 SQL
4. 查看 Supabase Dashboard 的 Logs

---

**設置完成！** 🎉 現在你的數據庫已經準備好支持完整的活動訂票和 Stripe 付款系統了！
