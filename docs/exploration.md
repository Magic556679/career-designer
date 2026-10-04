# 問卷流程(Step1~4)設計

延伸自 [product.md](./product.md) 的「自我探索 → 回答問題 → 分析結果」流程,針對線框稿 (`design/wireframe.pen`) 裡 Step1~4 的內容,規劃流程骨架與前端串接方式。後端資料模型、API 設計、AI 分析執行細節見 [backend.md](./backend.md)。

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
- 後端資料表**仍會**為 Step1 建立一筆 `questions` row(`step = 1`,`track = NULL`)與對應的 3 筆 `options`,單純用來讓 emoji / 文字未來可透過後台調整維護;但這不代表後端「定義」了 track——`options.key` 必須對應前端寫死的 `Track` 三個字面值,新增/刪除分支仍需要改前端程式碼。schema 定義見 [backend.md](./backend.md) 第 1 節。

## 3. 前端串接對應

沿用 `src/routes/explore/step-1.tsx` 已經規劃好的「接縫」模式:

- `src/features/exploration/api/use-tracks.ts` 目前回傳 mock 資料,之後只需把 `queryFn` 換成 `api.get('/api/questionnaire/questions', { params: { step: 2, track } })`,元件本身不用改。
- `useExplorationStore`(zustand + sessionStorage)除了現有的 `track`,之後還會累積 Step2/Step3 已選的 `optionKeys`,在 Step4 一次組成 `answers` 送出。
- Step2/Step3 的卡片元件應設計成通用的「選項卡片群」元件,吃 `{ title, subtitle, maxSelections, options }` 這種後端回傳的形狀,而不是像 Step1 一樣把選項寫死。
