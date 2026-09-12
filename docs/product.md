# Career Designer

## 1. Product Goal

幫助不知道職涯方向的人，透過一連串問題探索適合自己的職涯方向。

## 2. Target User

- 不知道自己適合什麼工作
- 對職涯選擇沒有明確方向
- 不知道自己的興趣 / 能力可以對應哪些職業

## 3. Core User Flow

Landing
↓
自我探索
↓
回答問題
↓
分析結果
↓
推薦職涯方向
↓
查看職涯詳細資訊

## 4. Core Concepts

### Career

代表一個可能的職涯方向。

### Interest

使用者選擇的興趣 / 偏好。

### Skill

使用者具備或想發展的能力。

## 5. Important Business Rules

- 每題最多選 2 個選項
- 使用者可以返回上一題修改
- 完成所有問題後才產生分析結果
- 分析結果不是直接推薦單一職業，而是提供多個可能方向

## 6. Out of Scope

目前不處理：

- 履歷產生
- 職缺搜尋
- 求職投遞
- 使用者登入

## 後端技術

- Node.js
- PostgreSQL
