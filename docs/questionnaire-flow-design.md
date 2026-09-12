# 問卷流程(Step1~4)後端設計

延伸自 [product.md](./product.md) 的「自我探索 → 回答問題 → 分析結果」流程,針對線框稿 (`design/wireframe.pen`) 裡 Step1~4 的內容,規劃後端資料模型與 API,前端只負責渲染與呼叫 API。

## 1. 線框稿內容摘要

- **Step1 — 認識自己**:單選,3 個狀態(track):
  - 😕 `unsure`:我不知道自己適合什麼工作
  - 🔄 `dissatisfied`:我不喜歡現在的工作,想找其他可能
  - 🚀 `direction`:我想找到更適合自己的職涯方向
- **Step2 — 依 track 分支**:每個 track 各對應一組卡片,最多選 2 個
  - `unsure`:8 張卡片(哪些事情比較像你)
  - `dissatisfied`:10 張卡片(最想離開現職的哪些部分)
  - `direction`:8 張卡片(現在工作最喜歡哪些部分)
- **Step3 — 人生羅盤**:固定兩組問題,不受 track 影響
  - 工作觀:7 張卡片(希望從工作得到什麼)
  - 人生觀:12 張卡片(希望這一生怎麼活)
- **Step4 — 分析**:把 Step1~3 的答案送到後端,交給 AI 分析,產生多個職涯方向推薦(非單一推薦)

## 2. 架構決策:內容資料驅動,流程骨架留在前端

**決定**:Track 型別(`'unsure' | 'dissatisfied' | 'direction'`)與 step 順序/分支對應關係留在前端(維持 `src/routes/explore/step-1.tsx` 既有註解的決定);後端 / PostgreSQL 只負責存放**每個 step、每個 track 底下的選項內容**(標題、emoji、文字、最多可選幾個),不定義有哪些 track 或流程怎麼走。

**為什麼**(研究依據,詳見對話紀錄):
- 業界分支問卷的通用經驗法則是「1-3 個簡單分支用基本條件邏輯就好,選項內容需要能改才做成資料驅動」—— Step1 剛好只有 3 個分支,規模上不需要把流程本身也做成資料驅動。
- 常見的個性測驗類產品(如 ButterCMS + Next.js 的測驗教學)也是「題目內容存在 CMS/API,但測驗狀態與導航邏輯留在前端程式碼」的混合模式,而非後端動態決定下一步導去哪個畫面。
- 讓後端也定義 track,會讓「哪個 track 對應哪個路由」變成跨前後端同步的隱性契約,對目前規模是過度工程。

**影響**:
- `src/routes/explore/step-1.tsx` 現有的 `Track` 型別與路由跳轉邏輯維持不動——`unsure` / `dissatisfied` / `direction` 這三個 key 與它們對應哪個路由,永遠由前端決定,後端不參與。
- 後端資料表**仍會**為 Step1 建立一筆 `questions` row(`step = 1`,`track = NULL`)與對應的 3 筆 `options`,單純用來讓 emoji / 文字未來可透過後台調整維護;但這不代表後端「定義」了 track——`options.key` 必須對應前端寫死的 `Track` 三個字面值,新增/刪除分支仍需要改前端程式碼。

## 3. 資料表設計(PostgreSQL)

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

## 4. API 草案

| Method | Path | 說明 |
| --- | --- | --- |
| `POST` | `/api/sessions` | 建立一個匿名 session,回傳 `sessionId` |
| `GET` | `/api/questionnaire/questions?step=2&track=unsure` | 依 step + track 取得該畫面要顯示的題目與選項 |
| `GET` | `/api/questionnaire/questions?step=3` | 取得 Step3 兩組固定題目(工作觀、人生觀) |
| `POST` | `/api/questionnaire/answers` | body: `{ sessionId, questionKey, optionKeys[] }`,後端依 `max_selections` 驗證 |
| `POST` | `/api/questionnaire/analyze` | body: `{ sessionId }`,觸發 AI 分析(Step1~3 全部答完才能呼叫)。立即回應,不等待 AI 跑完,見第 7 節 |
| `GET` | `/api/questionnaire/results/:sessionId` | 取得目前 `sessions.status` 與(若已完成)分析結果;前端輪詢用,見第 7 節 |

回應包裝沿用專案既有的 `ApiResponse<T>` / `PageResponse<T>`(見 `src/types/api.ts`)。

## 5. 前端串接對應

沿用 `src/routes/explore/step-1.tsx` 已經規劃好的「接縫」模式:

- `src/features/exploration/api/use-tracks.ts` 目前回傳 mock 資料,之後只需把 `queryFn` 換成 `api.get('/api/questionnaire/questions', { params: { step: 2, track } })`,元件本身不用改。
- `useExplorationStore`(zustand + sessionStorage)除了現有的 `track`,之後還會累積 Step2/Step3 已選的 `optionKeys`,在 Step4 一次組成 `answers` 送出。
- Step2/Step3 的卡片元件應設計成通用的「選項卡片群」元件,吃 `{ title, subtitle, maxSelections, options }` 這種後端回傳的形狀,而不是像 Step1 一樣把選項寫死。

## 6. 待確認事項

**已決定**:
- ~~`max_selections` 目前線框稿都是 2,但 Step1 是單選(1)~~ → Step1 也建一筆 `questions` row(`max_selections = 1`)方便未來維運,見第 2 節「影響」。
- ~~AI 分析(Step4)要同步等待結果,還是非同步(排隊 + 前端輪詢/WebSocket)?~~ → 採輕量非同步 + 輪詢,見第 7 節。

## 7. AI 分析執行方式:輕量非同步(不等待 + 輪詢)

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
