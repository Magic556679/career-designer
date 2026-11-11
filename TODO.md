# TODO

## 1. Step2 頁面補齊

- 標題 / 副標：依 `docs/exploration.md` 第 3 節，`title`/`subtitle` 由 route 自行渲染，`step-2.tsx` 目前只渲染了 `MultiSelectCards`，還沒有頁面文案（三個 track 的文案各不同，見 wireframe）。
- 下一步按鈕：目前沒有前往 Step3 的按鈕，也沒有「至少選 1 個才能繼續」之類的檢查。
- Barrel 匯入：`step-2.tsx` 用 `@/features/exploration/components/multi-select-cards` 直接深層匯入元件，違反「slice 只透過 `index.ts` 匯入」的規則——應在 `src/features/exploration/index.ts` 匯出 `MultiSelectCards`（`MultiSelectCardsProps` 視需要一併匯出）。
- 最多可選數不一致：`docs/exploration.md` 與 product.md 業務規則寫「最多選 2 個」，但 `QUESTIONS_BY_TRACK.direction` 的 `maxSelections` 是 `3`，需確認以哪個為準。

## 2. lucide icon 全量打包導致 bundle 過大

- `src/features/exploration/components/multi-select-cards.tsx` 用 `import { icons } from 'lucide-react'` 依字串名稱查 icon，會把 lucide 全部約 1500 個 icon 打包進來，`pnpm build` 產出的 JS 達 872 KB（觸發 >500 kB 警告）。
- 可能做法：
  - 自建一份只含用到 icon 的對照表（如 `{ Search, Puzzle, ... }`），後端只回傳表內的名稱。
  - 改用 `lucide-react/dynamic` 的 `DynamicIcon`，依名稱按需載入（每個 icon 會是獨立 chunk）。
