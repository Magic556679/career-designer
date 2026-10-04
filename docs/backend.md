# 問卷流程(Step1~4)後端設計

延伸自 [exploration.md](./exploration.md) 的 Step1~4 問卷流程,這裡放後端資料庫、API、與 AI 分析執行的實作細節;流程骨架、Track 分支、前端串接方式仍以 exploration.md 為準。

## 1. 資料表設計(PostgreSQL)

```sql
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  step INT NOT NULL,                    -- 2 或 3
  track TEXT,                           -- 'unsure' | 'dissatisfied' | 'direction'，step3 為 NULL(不分 track)
  key TEXT UNIQUE NOT NULL,             -- 'step2-unsure' / 'step3-work-values' / 'step3-life-values'
  title TEXT NOT NULL,
  subtitle TEXT,
  max_selections INT NOT NULL DEFAULT 2,
  order_index INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES questions(id),
  key TEXT NOT NULL,                    -- 'find-root-cause', 'financial-freedom' ...
  emoji TEXT,
  label TEXT NOT NULL,
  order_index INT NOT NULL DEFAULT 0,
  UNIQUE (question_id, key)
);

CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  status TEXT NOT NULL DEFAULT 'in_progress',  -- in_progress | analyzed
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(id),
  question_id UUID NOT NULL REFERENCES questions(id),
  option_id UUID NOT NULL REFERENCES options(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (session_id, question_id, option_id)
);

CREATE TABLE analysis_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(id),
  careers JSONB NOT NULL,               -- AI 分析出的多個職涯方向
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

無登入需求(product.md 排除範圍),`sessions` 為匿名 session,由前端產生後存在 `sessionStorage`(對應 `use-exploration-store` 的持久化方式)。

## 2. API 草案

| Method | Path                                               | 說明                                                                                            |
| ------ | --------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `POST` | `/api/sessions`                                    | 建立一個匿名 session,回傳 `sessionId`                                                           |
| `GET`  | `/api/questionnaire/questions?step=2&track=unsure` | 依 step + track 取得該畫面要顯示的題目與選項                                                    |
| `GET`  | `/api/questionnaire/questions?step=3`              | 取得 Step3 兩組固定題目(工作觀、人生觀)                                                         |
| `POST` | `/api/questionnaire/answers`                       | body: `{ sessionId, questionKey, optionKeys[] }`,後端依 `max_selections` 驗證                   |
| `POST` | `/api/questionnaire/analyze`                       | body: `{ sessionId }`,觸發 AI 分析(Step1~3 全部答完才能呼叫)。立即回應,不等待 AI 跑完,見第 4 節 |
| `GET`  | `/api/questionnaire/results/:sessionId`            | 取得目前 `sessions.status` 與(若已完成)分析結果;前端輪詢用,見第 4 節                            |

回應包裝沿用專案既有的 `ApiResponse<T>` / `PageResponse<T>`(見 `src/types/api.ts`)。

## 3. 欄位命名轉換(snake_case → camelCase)

**決定**:API 回應一律用 camelCase(對齊 `PageResponse.pageSize` 的既有慣例,見 `src/features/exploration/types.ts` 的 `Question` / `Option` / `Answer`)。PostgreSQL 欄位是 snake_case(`max_selections`、`session_id`),由**後端**在組回應前轉換成 camelCase(例如用 ORM 的欄位對應,或是在 service 層手動 map / 套用 `camelcase-keys` 之類的轉換),前端不需要、也不會再做任何大小寫轉換。

## 4. AI 分析執行方式:輕量非同步(不等待 + 輪詢)

**決定**:`POST /analyze` 收到請求後**立即回應**,不等待 AI 呼叫完成;實際呼叫 AI 的動作在背景執行完再把結果寫進 `analysis_results` 並把該筆 `sessions.status` 更新為 `analyzed`。前端靠現成的 `sessions.status` 欄位,呼叫 `GET /results/:sessionId` 輪詢直到狀態變成 `analyzed`。**不**引入獨立的訊息佇列/broker(如 Redis、RabbitMQ)。

**為什麼**(討論依據,詳見對話紀錄):

- 同步等待的風險:AI 呼叫常要數秒到數十秒,容易撞上 HTTP/proxy 的預設逾時,且整段時間佔用伺服器的請求資源。
- 真正的擴充瓶頸是 AI 呼叫本身的並發量與費用(供應商 RPM 限制、運算成本),不是輪詢查詢——輪詢只是對 `sessions` 表做一次 primary key 查詢,成本極低(以目前規模估算,單一分析流程約產生個位數次輪詢請求,即使同時上千人使用也遠低於資料庫負載上限)。
- 引入獨立訊息佇列會多一個要部署、監控、付費的服務,對目前規模(尚未上線、匿名 session、單一問卷流程)是過度工程;想要「重啟不遺失任務」的可靠度,可以先用「資料庫輪詢式 worker」這種只靠既有 DB 的中間方案,不必一步到位上訊息佇列。

**影響**:

- `POST /analyze`:立即回應(例如 202,或沿用既有 `ApiResponse<T>` 回 `{ status: 'in_progress' }`),不在此次 response 內回傳分析結果;呼叫 AI 的邏輯用背景任務執行(依後端框架而定,例如不 await 該次呼叫,或用框架內建的 background task 機制)。
- `GET /results/:sessionId`:回傳當前 `sessions.status`;`in_progress` 時 `data` 為 `null`,`analyzed` 時帶出 `analysis_results.careers`。
- 前端沿用已裝好的 `@tanstack/react-query`,用 `refetchInterval` 做輪詢(建議 2 秒起),不需要額外的輪詢框架、WebSocket 或狀態管理。

**已知限制(目前規模可接受,暫不處理)**:

- 若伺服器在 AI 呼叫進行中重啟或崩潰,該次背景任務會直接遺失、不會自動重試。之後若需要,可改成「資料庫輪詢式 worker」定期掃描 `status = 'in_progress'` 且逾時未完成的 session 撿回處理,不必馬上上訊息佇列。
- 若輪詢請求量之後真的造成負擔,可把固定 2 秒間隔改成漸進式退避(例如 2s → 3s → 5s → 8s)。

## 5. 待確認事項(已決定)

- ~~`max_selections` 目前線框稿都是 2,但 Step1 是單選(1)~~ → Step1 也建一筆 `questions` row(`max_selections = 1`)方便未來維運,見 exploration.md 第 2 節「影響」。
- ~~AI 分析(Step4)要同步等待結果,還是非同步(排隊 + 前端輪詢/WebSocket)?~~ → 採輕量非同步 + 輪詢,見第 4 節。
