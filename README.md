# Career Designer

幫助不知道職涯方向的人，透過一連串問題探索適合自己的職涯方向。

產品目標與流程見 [docs/product.md](./docs/product.md)，問卷流程的後端設計見 [docs/questionnaire-flow-design.md](./docs/questionnaire-flow-design.md)，開發計畫見 [docs/plan.md](./docs/plan.md)。

## 技術棧

- Vite + React 19 + TypeScript
- Tailwind CSS v4、shadcn/ui
- React Router (`createBrowserRouter`)、TanStack Query、zustand、axios

## 開始開發

```bash
pnpm install
cp .env.example .env   # 設定 VITE_API_BASE_URL
pnpm dev
```

## 常用指令

| 指令                                | 說明                      |
| ----------------------------------- | ------------------------- |
| `pnpm dev`                          | 啟動開發伺服器            |
| `pnpm build`                        | 型別檢查後打包            |
| `pnpm preview`                      | 預覽 production build     |
| `pnpm lint`                         | 執行 ESLint               |
| `pnpm format` / `pnpm format:check` | 套用 / 檢查 Prettier 格式 |

## 專案結構

- `src/routes/`：路由頁面，只負責組合 feature 與導頁。
- `src/features/<name>/`：功能切片（`api/`、`components/`、`stores/`），只透過各自的 `index.ts` 對外。
- `src/components/`：共用元件，`ui/` 為 shadcn。
- `src/lib`、`src/stores`、`src/types`：共用工具、全域 store 與型別。

匯入一律使用 `@` alias（對應 `src/`），不使用相對路徑。
