---
name: commit
description: 依照 Conventional Commits 規則規劃 git commit（不會實際執行 git 指令），輸出 Commit Plan 供使用者確認後再手動執行
---

# Commit Skill

分析目前的 git 變更，規劃成一組或多組語意清楚、符合規範的 commit，並以固定格式輸出計畫。**不會自動執行任何 Git 操作**，一律等待使用者確認後才可以實際下 `git add` / `git commit` / `git push`。

## Commit Type 規則

| Type | 用途 |
|------|------|
| `feat` | 新增功能 |
| `fix` | 修正錯誤 |
| `refactor` | 重構（不影響外部行為的程式碼調整） |
| `chore` | 雜項（設定、依賴、建置腳本等） |
| `style` | 純樣式（格式、空白、排版，不影響邏輯） |
| `docs` | 文件 |

Commit message 格式：`<type>: <簡短描述>`（描述使用中文或英文皆可，但需清楚、精簡，祈使句、現在式）。

## 執行步驟

1. 執行 `git status` 與 `git diff` / `git diff --staged`，掌握目前所有已變更、已暫存、未追蹤的檔案。
2. 執行 `git log --oneline -10`，觀察本專案既有的 commit message 風格。
3. 依「單一 commit 只做一件事」原則，將變更依邏輯關聯分組（例如：功能新增、重構、樣式調整、文件更新應分開，不可混在同一個 commit）。
4. 判斷不應該被提交的檔案（例如 `.env`、憑證、大型二進位檔、明顯的暫存檔），若發現則在 Review 區塊提醒使用者，不要自動排除或加入。
5. 為每個分組挑選最合適的 type，並確認同一個 commit 內的檔案是否都屬於同一種變更性質；若不是，重新拆分。
6. 為每個 commit 撰寫 Message，格式須符合 `<type>: <描述>`。
7. **Message 格式驗證**：檢查每一則 Message 是否符合下列條件，若不符合需修正後才可輸出／執行：
   - type 必須是 `feat` / `fix` / `refactor` / `chore` / `style` / `docs` 其中之一
   - type 後面緊接 `: `（冒號 + 一個空白）
   - 描述不可為空、不可只重複 type 名稱
   - 描述長度精簡（建議 50 字以內），不以句號結尾
8. 依固定格式輸出 Commit Plan（見下方 Output Format）。

## Output Format

```
# Commit Plan

Branch prefix: [<分支名稱或使用者提供的票號>]

## Commit 1
Purpose:
Files:
Reason:
Message:

## Commit 2
...

## Review
Overall quality:
Suggestions:
規則核對: 全數通過 / 列出不符合項目
```

## 重要限制

- **不得執行** `git add`、`git commit`、`git push` 或任何會改變 git 狀態的指令。
- 輸出 Commit Plan 後必須停下來，等待使用者明確確認。
- 使用者確認後，若使用者要求實際執行 commit，**每次實際執行 `git commit` 前都必須重新執行一次步驟 7 的 Message 格式驗證**，確認訊息仍然符合規則，才可執行。
- 若使用者中途修改了分組或訊息，需重新跑過步驟 3～7 再輸出更新後的 Commit Plan。
