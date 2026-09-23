# 開發計畫

依據 2026-09-20 的專案分析整理。產品目標與流程見 [product.md](./product.md),Step1~4 的後端設計見 [questionnaire-flow-design.md](./questionnaire-flow-design.md)。

## 目前進度

| 項目                              | 狀態                                |
| --------------------------------- | ----------------------------------- |
| Step1(認識自己)頁面               | 已完成,含切版;`useTracks` 仍是 mock |
| Step2 / Step3 / Step4             | 只有 wireframe 與後端設計,尚無頁面  |
| 後端 API / DB                     | 只有設計文件,尚未實作               |
| 測試                              | 未設定 test runner                  |
| `react-hook-form` / `zod`         | 已安裝,尚未使用                     |
| `src/lib/axios.ts`、`ApiResponse` | 已備妥,尚無實際呼叫                 |

## 待處理

### 1. ExploreLayout(優先)

- 建立 `ExploreLayout`,放 Header(App 名稱 + `Step N / 4`)與 Footer 提示,讓 Step1~4 共用。
- 把 `src/routes/index.tsx` 的扁平 `explore/step-1` 改成巢狀路由 `explore` → `children`,URL 結構不變。
- 目前 Step2 導向 `/explore/step-2` 但路由不存在,會落到 404,需一併補上。

### 2. 通用「選項卡片群」元件

- 依 questionnaire-flow-design.md 第 5 節,元件吃 `{ title, subtitle, maxSelections, options }`,不把選項寫死。
- 一次涵蓋 Step2(依 track 分支)與 Step3(工作觀 / 人生觀)。
- 每題最多選 2 個(product.md 業務規則)、可返回上一題修改。
- `useExplorationStore` 擴充為累積各步驟已選的 `optionKeys`。

### 3. Step4 與後端串接

- 建立 session、送出答案、`POST /analyze` 後以 `refetchInterval`(2 秒起)輪詢結果,見設計文件第 7 節。
- 把 `use-tracks.ts` 與後續 mock hook 的 `queryFn` 換成 `api.get(...)`。
- 後端(Node.js + PostgreSQL)依設計文件的資料表與 API 草案實作。

### 4. 清理與文件

- 刪除 `src/App.tsx`(無任何檔案 import,為死碼)。
- 更新 `CLAUDE.md`:路由已改為 `createBrowserRouter` + `RouterProvider`(`src/app/router.tsx`),不再是 `BrowserRouter` + `App`。
- 重寫 `README.md`(目前仍是 Vite 範本,且提到 Oxlint,與實際使用 ESLint 矛盾)。
- `not-found.tsx` 元件名 `notFound` 改為大寫開頭,並補上基本版面。
- ~~抽出共用的 loading / error 元件,取代 Step1 裸的 `<div>`。~~ 已完成:`components/ui/spinner.tsx`(shadcn `Spinner` + `LoadingFallback`)、`components/errors/error-fallback.tsx`(結構參考 bulletproof-react)。做 `ExploreLayout` 時再於 `explore` 父路由掛 `errorElement`。

## 已決定的事項

- 流程骨架(`Track` 型別、step 順序與分支)留在前端;後端只存各 step / track 的選項內容。
- AI 分析採「立即回應 + 前端輪詢」,不引入訊息佇列。
- 不做登入,使用匿名 session(存 `sessionStorage`)。
- 專案一律使用 `@` alias 匯入,不用相對路徑。

## 學習分工

- Step1 邏輯(資料取得、選取、換頁)由本人自行練習;協助內容以切版、結構、規劃為主。
