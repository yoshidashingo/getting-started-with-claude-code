# tasks.mdの活用方法

## 目次
- [タスク管理とは](#タスク管理とは)
- [実装タスクの細分化](#実装タスクの細分化)
- [チェックリスト形式の管理](#チェックリスト形式の管理)
- [要件とのトレーサビリティ](#要件とのトレーサビリティ)
- [タスクの優先順位付け](#タスクの優先順位付け)
- [進捗管理](#進捗管理)
- [Claude Codeを使ったタスク管理](#claude-codeを使ったタスク管理)
- [実践例](#実践例)

## タスク管理とは

`tasks.md`は、**具体的な実装作業**を管理するドキュメントです。要件定義（requirements.md）と設計仕様（design.md）を基に、実際に開発チームが実行すべき作業項目を明確にします。

### tasks.mdの役割

```text
タスク管理の目的:
✓ 実装作業の具体化
✓ 作業の細分化と見積もり
✓ 進捗の可視化
✓ チーム間の作業調整
✓ 完了基準の明確化
✓ 要件・設計へのトレーサビリティ
```

### 基本構造

```markdown
# Tasks Specification

## Overview
プロジェクトの実装タスク管理

## Sprint Planning
現在のスプリント情報

## Task List

### [US-001] User Registration
- [ ] Task-001: データベーススキーマ作成
- [ ] Task-002: バックエンドAPI実装
- [ ] Task-003: フロントエンドコンポーネント実装
- [ ] Task-004: テスト作成
- [ ] Task-005: ドキュメント更新

## Task Details
各タスクの詳細情報

## Progress Tracking
進捗状況の可視化
```

## 実装タスクの細分化

### タスク分割の原則

良いタスクは**SMART**原則に従います：

| 原則 | 意味 | 具体例 |
|------|------|--------|
| **S**pecific | 具体的 | "認証機能の実装"ではなく"JWTトークン生成関数の実装" |
| **M**easurable | 測定可能 | "テストを書く"ではなく"カバレッジ80%以上" |
| **A**chievable | 達成可能 | 1-2日で完了できる粒度 |
| **R**elevant | 関連性がある | 要件とリンクしている |
| **T**ime-bound | 期限がある | 明確な完了予定日 |

### User Storyからタスクへの分解

```markdown
## From User Story to Tasks

### US-001: ユーザー登録機能
**Requirements**: [requirements.md#us-001](../requirements.md#us-001)
**Design**: [design.md#user-registration](../design.md#user-registration)

#### タスク分解

##### Phase 1: Backend Infrastructure
- [ ] **Task-001**: PostgreSQLスキーマ設計
  - users テーブル作成
  - マイグレーションファイル作成
  - インデックス設定
  - **Estimate**: 2h
  - **Assignee**: Backend Team
  - **Status**: Todo

- [ ] **Task-002**: ユーザーモデル実装
  - TypeScript interface定義
  - Prisma/TypeORM model作成
  - バリデーションルール実装
  - **Estimate**: 3h
  - **Assignee**: Backend Team
  - **Status**: Todo

- [ ] **Task-003**: パスワードハッシュ化ユーティリティ
  - bcrypt integration
  - ハッシュ生成関数
  - 検証関数
  - ユニットテスト
  - **Estimate**: 2h
  - **Assignee**: Backend Team
  - **Status**: Todo

##### Phase 2: API Implementation
- [ ] **Task-004**: POST /api/auth/register エンドポイント実装
  - リクエストバリデーション
  - ユーザー重複チェック
  - パスワードハッシュ化
  - データベース保存
  - レスポンス生成
  - **Estimate**: 4h
  - **Assignee**: Backend Team
  - **Status**: Todo
  - **Dependencies**: Task-001, Task-002, Task-003

- [ ] **Task-005**: エラーハンドリング実装
  - バリデーションエラー
  - データベースエラー
  - 重複エラー
  - エラーレスポンス標準化
  - **Estimate**: 2h
  - **Assignee**: Backend Team
  - **Status**: Todo

##### Phase 3: Frontend Implementation
- [ ] **Task-006**: 登録フォームコンポーネント作成
  - UserRegistrationForm.tsx
  - フォーム状態管理
  - バリデーション（フロント側）
  - CSS Modules
  - **Estimate**: 4h
  - **Assignee**: Frontend Team
  - **Status**: Todo

- [ ] **Task-007**: APIクライアント実装
  - 登録API呼び出し関数
  - エラーハンドリング
  - TypeScript型定義
  - **Estimate**: 2h
  - **Assignee**: Frontend Team
  - **Status**: Todo

- [ ] **Task-008**: フォームバリデーション実装
  - リアルタイムバリデーション
  - エラーメッセージ表示
  - パスワード強度インジケーター
  - **Estimate**: 3h
  - **Assignee**: Frontend Team
  - **Status**: Todo

##### Phase 4: Testing
- [ ] **Task-009**: バックエンドユニットテスト
  - モデルテスト
  - ユーティリティテスト
  - APIエンドポイントテスト
  - カバレッジ80%以上
  - **Estimate**: 4h
  - **Assignee**: Backend Team
  - **Status**: Todo

- [ ] **Task-010**: フロントエンドユニットテスト
  - コンポーネントテスト
  - フックテスト
  - バリデーションテスト
  - **Estimate**: 3h
  - **Assignee**: Frontend Team
  - **Status**: Todo

- [ ] **Task-011**: Integration テスト
  - API統合テスト
  - データベース統合テスト
  - **Estimate**: 3h
  - **Assignee**: QA Team
  - **Status**: Todo

- [ ] **Task-012**: E2E テスト
  - 登録フローのE2Eシナリオ
  - エラーケースのテスト
  - Playwright実装
  - **Estimate**: 4h
  - **Assignee**: QA Team
  - **Status**: Todo

##### Phase 5: Documentation & Review
- [ ] **Task-013**: API ドキュメント更新
  - エンドポイント仕様
  - Request/Response例
  - エラーコード一覧
  - **Estimate**: 2h
  - **Assignee**: Backend Team
  - **Status**: Todo

- [ ] **Task-014**: コードレビュー
  - セキュリティチェック
  - コード品質確認
  - テストカバレッジ確認
  - **Estimate**: 2h
  - **Assignee**: Tech Lead
  - **Status**: Todo

#### Total Estimate: 40h (約5日間)
```

### タスクテンプレート

```markdown
## Task Template

### Task-XXX: [タスク名]

#### Description
[タスクの詳細説明]

#### Acceptance Criteria
- [ ] 基準1
- [ ] 基準2
- [ ] 基準3

#### Implementation Details
- ファイル: `path/to/file.ts`
- 主要な変更点:
  1. [変更1]
  2. [変更2]

#### Technical Notes
[技術的な注意事項、制約、考慮事項]

#### Testing Checklist
- [ ] ユニットテスト作成
- [ ] Integrationテスト作成
- [ ] カバレッジ確認
- [ ] 手動テスト完了

#### Dependencies
- Depends on: Task-001, Task-002
- Blocks: Task-005

#### Estimate
3h

#### Assignee
@developer-name

#### Status
Todo | In Progress | Review | Done

#### Related
- Requirements: [US-001](../requirements.md#us-001)
- Design: [design.md#component-name](../design.md#component-name)
- PR: #123
```

## チェックリスト形式の管理

### 階層的チェックリスト

```markdown
## Feature: User Management

### [US-001] User Registration
#### Backend
- [ ] Database
  - [x] users テーブル作成
  - [x] マイグレーション実行
  - [ ] インデックス最適化
- [ ] API
  - [x] POST /api/auth/register 実装
  - [x] バリデーション実装
  - [ ] レートリミット追加
- [ ] Tests
  - [x] ユニットテスト (15/15)
  - [ ] Integrationテスト (3/5)
  - [ ] E2Eテスト (0/3)

#### Frontend
- [ ] Components
  - [x] RegistrationForm.tsx
  - [x] PasswordStrengthIndicator.tsx
  - [ ] EmailVerificationBanner.tsx
- [ ] Validation
  - [x] フロント側バリデーション
  - [x] エラーメッセージ表示
  - [ ] リアルタイムフィードバック改善
- [ ] Tests
  - [x] コンポーネントテスト (8/8)
  - [ ] E2Eテスト (0/2)

#### Documentation
- [ ] API Documentation
  - [x] エンドポイント仕様
  - [ ] エラーコード一覧
- [ ] User Documentation
  - [ ] 利用者向けガイド
  - [ ] FAQ

### Progress: 65% (13/20 completed)
```

### デイリーチェックリスト

```markdown
## Sprint 1 - Week 1

### Monday (2025-01-20)
- [x] Task-001: users テーブル作成
- [x] Task-002: ユーザーモデル実装
- [ ] Task-003: パスワードハッシュ化ユーティリティ (50% 完了)

**Notes**:
- Task-003で bcrypt のパフォーマンス問題を発見
- cost値を12→10に変更を検討中

### Tuesday (2025-01-21)
- [ ] Task-003: パスワードハッシュ化ユーティリティ (継続)
- [ ] Task-004: POST /api/auth/register 実装開始
- [ ] Task-006: 登録フォームコンポーネント作成開始

### Wednesday (2025-01-22)
- [ ] Task-004: POST /api/auth/register 完了
- [ ] Task-005: エラーハンドリング実装
- [ ] Task-006: 登録フォームコンポーネント完了

### Thursday (2025-01-23)
- [ ] Task-007: APIクライアント実装
- [ ] Task-008: フォームバリデーション実装
- [ ] Task-009: バックエンドユニットテスト開始

### Friday (2025-01-24)
- [ ] Task-009: バックエンドユニットテスト完了
- [ ] Task-010: フロントエンドユニットテスト
- [ ] コードレビュー準備

### Weekly Goal: US-001 Backend完了 + Frontend 80%完了
```

## 要件とのトレーサビリティ

### 双方向リンク

```markdown
## Traceability Matrix

| Task ID | Task Name | User Story | Design Ref | Status | Assignee |
|---------|-----------|------------|------------|--------|----------|
| Task-001 | users テーブル作成 | [US-001](../requirements.md#us-001) | [DB Schema](../design.md#database-schema) | Done | @backend |
| Task-002 | ユーザーモデル実装 | [US-001](../requirements.md#us-001) | [Data Model](../design.md#data-model) | Done | @backend |
| Task-003 | パスワードハッシュ | [US-001](../requirements.md#us-001) | [Security](../design.md#security) | In Progress | @backend |
| Task-004 | Register API | [US-001](../requirements.md#us-001) | [API Design](../design.md#api-design) | Todo | @backend |
| Task-005 | エラーハンドリング | [US-001](../requirements.md#us-001) | [Error Handling](../design.md#error-handling) | Todo | @backend |
| Task-006 | 登録フォーム | [US-001](../requirements.md#us-001) | [Component Design](../design.md#components) | Todo | @frontend |
| Task-007 | APIクライアント | [US-001](../requirements.md#us-001) | [API Client](../design.md#api-client) | Todo | @frontend |

### Coverage Analysis
- US-001: 7 tasks (2 done, 1 in progress, 4 todo)
- US-002: 5 tasks (0 done, 0 in progress, 5 todo)
- US-003: 3 tasks (0 done, 0 in progress, 3 todo)
```

### 要件からタスクへのマッピング

```markdown
## Requirements to Tasks Mapping

### US-001: ユーザー登録機能

#### Acceptance Criteria Mapping

##### AC-1: 基本的な登録フロー
- Task-001: データベーススキーマ
- Task-002: ユーザーモデル
- Task-004: Register API実装
- Task-006: 登録フォームコンポーネント
- Task-007: APIクライアント

##### AC-2: パスワード要件
- Task-003: パスワードハッシュ化
- Task-008: フォームバリデーション（パスワード強度）

##### AC-3: メールアドレス検証
- Task-015: メール送信機能実装
- Task-016: メール検証トークン生成
- Task-017: 検証エンドポイント実装

##### AC-4: エラーハンドリング
- Task-005: エラーハンドリング実装
- Task-008: フロント側エラー表示

#### Testing Coverage
- Task-009: バックエンドユニットテスト
- Task-010: フロントエンドユニットテスト
- Task-011: Integrationテスト
- Task-012: E2Eテスト

**All Acceptance Criteria Covered**: ✓
```

## タスクの優先順位付け

### Eisenhower Matrix

```markdown
## Task Prioritization (Eisenhower Matrix)

### Urgent & Important (Do First)
- Task-001: users テーブル作成 [Blocker]
- Task-002: ユーザーモデル実装 [Blocker]
- Task-004: Register API実装 [Critical Path]

### Important but Not Urgent (Schedule)
- Task-009: バックエンドユニットテスト
- Task-010: フロントエンドユニットテスト
- Task-013: APIドキュメント更新

### Urgent but Not Important (Delegate)
- Task-008: パスワード強度インジケーター（見た目）
- Task-018: ログイン画面のスタイル調整

### Neither Urgent nor Important (Eliminate)
- Task-019: アニメーション追加（Nice to have）
- Task-020: ダークモード対応（Future enhancement）
```

### 依存関係グラフ

```markdown
## Task Dependency Graph

\```
Task-001 (DB Schema)
  └─> Task-002 (User Model)
       ├─> Task-003 (Password Hash)
       │    └─> Task-004 (Register API)
       │         ├─> Task-005 (Error Handling)
       │         │    └─> Task-009 (Backend Tests)
       │         │         └─> Task-011 (Integration Tests)
       │         │              └─> Task-012 (E2E Tests)
       │         └─> Task-007 (API Client)
       │              └─> Task-006 (Form Component)
       │                   └─> Task-008 (Validation)
       │                        └─> Task-010 (Frontend Tests)
       │                             └─> Task-012 (E2E Tests)
       └─> Task-015 (Email Service)
            └─> Task-016 (Verification Token)
                 └─> Task-017 (Verification Endpoint)

Critical Path: Task-001 → Task-002 → Task-003 → Task-004 → Task-009 → Task-012
Estimated Duration: 24h
\```

### 優先順位に基づくタスクリスト
\```markdown
## Prioritized Task List

### P0: Blockers (Must do immediately)
- [ ] Task-001: users テーブル作成 [2h] @backend
- [ ] Task-002: ユーザーモデル実装 [3h] @backend

### P1: Critical Path (Must do this sprint)
- [ ] Task-003: パスワードハッシュ化 [2h] @backend
- [ ] Task-004: Register API実装 [4h] @backend
- [ ] Task-006: 登録フォーム [4h] @frontend
- [ ] Task-007: APIクライアント [2h] @frontend

### P2: Important (Should do this sprint)
- [ ] Task-005: エラーハンドリング [2h] @backend
- [ ] Task-008: フォームバリデーション [3h] @frontend
- [ ] Task-009: バックエンドテスト [4h] @backend
- [ ] Task-010: フロントエンドテスト [3h] @frontend

### P3: Nice to Have (Could do this sprint)
- [ ] Task-013: APIドキュメント [2h] @backend
- [ ] Task-015: メール送信機能 [4h] @backend
- [ ] Task-012: E2Eテスト [4h] @qa

### P4: Future (Next sprint)
- [ ] Task-018: スタイル調整 [3h] @frontend
- [ ] Task-019: アニメーション [2h] @frontend
\```

## 進捗管理

### スプリントボード

```markdown
## Sprint 1 Progress Board

### Sprint Goal
ユーザー登録機能（US-001）の完全実装とテスト完了

### Sprint Duration
2025-01-20 ~ 2025-01-31 (2 weeks)

### Velocity Target
40 Story Points

### Progress Overview
\```
Todo         In Progress    Review        Done
────────     ────────────   ──────────    ────────
Task-003     Task-004       Task-002      Task-001
Task-005     Task-006       -             -
Task-007     -              -             -
Task-008
Task-009
Task-010
Task-011
Task-012
Task-013

Count: 9     Count: 2       Count: 1      Count: 1
Points: 28   Points: 8      Points: 3     Points: 2
\```

### Burndown Chart
\```
Story Points Remaining
40 │●
35 │ ●
30 │  ●
25 │   ●
20 │    ●─●
15 │      ●
10 │       ●
5  │        ●
0  │         ●
   └─────────────────────
   Day 1 2 3 4 5 6 7 8 9 10

Ideal:  ───
Actual: ●──●
\```

### Team Capacity
- Backend Team: 40h/week (2 developers × 20h)
- Frontend Team: 40h/week (2 developers × 20h)
- QA Team: 20h/week (1 QA engineer × 20h)
- Total: 100h/week

### Current Allocation
- Backend: 22h allocated (55%)
- Frontend: 19h allocated (48%)
- QA: 11h allocated (55%)
```

### デイリースタンドアップトラッキング

```markdown
## Daily Standup - 2025-01-22

### Yesterday
- ✅ Task-001: users テーブル作成 (完了)
- ✅ Task-002: ユーザーモデル実装 (完了)
- 🔄 Task-003: パスワードハッシュ化 (80% 完了)

### Today
- 🎯 Task-003: パスワードハッシュ化 (完了予定)
- 🎯 Task-004: Register API実装 (開始)
- 🎯 Task-006: 登録フォーム (開始)

### Blockers
- ⚠️ Task-003: bcrypt パフォーマンス問題
  - Resolution: cost値を調整、パフォーマンステスト実施中

### Notes
- Task-004とTask-006を並行して進める
- 明日はコードレビューの時間を確保
```

### 週次レポート

```markdown
## Week 1 Summary (2025-01-20 ~ 2025-01-26)

### Completed Tasks
- ✅ Task-001: users テーブル作成
- ✅ Task-002: ユーザーモデル実装
- ✅ Task-003: パスワードハッシュ化
- ✅ Task-004: Register API実装

### In Progress
- 🔄 Task-005: エラーハンドリング (60%)
- 🔄 Task-006: 登録フォーム (80%)
- 🔄 Task-007: APIクライアント (40%)

### Not Started
- ⏸️ Task-008: フォームバリデーション
- ⏸️ Task-009: バックエンドテスト
- ⏸️ Task-010: フロントエンドテスト

### Metrics
- **Velocity**: 15 Story Points completed
- **Burndown**: On track (予定通り)
- **Quality**: 2 bugs found, 2 fixed
- **Code Reviews**: 4 PRs merged

### Highlights
- バックエンドAPI実装が予定より早く完了
- パスワードハッシュのパフォーマンス問題を解決

### Challenges
- フロントエンドのデザインレビューが遅延
- E2Eテスト環境のセットアップに時間がかかった

### Next Week Plan
- Task-005 ~ Task-010 完了を目指す
- E2Eテスト環境の準備
- 中間デモの準備
```

## Claude Codeを使ったタスク管理

### ステップ1: タスク生成

```bash
# プロンプト例
「.kiro/specs/tasks.mdを作成してください。

以下の要件と設計を基に、実装タスクを生成してください：
- 要件: .kiro/specs/requirements.md
- 設計: .kiro/specs/design.md

各User Storyについて：
1. 実装フェーズごとにタスクを分解
2. 依存関係を明確に
3. 見積もり時間を追加
4. 担当チームを割り当て
5. 受け入れ基準を含める

タスクテンプレートを使用してください。」
```

### ステップ2: タスク詳細化

```bash
# プロンプト例
「Task-004（Register API実装）について詳細化してください。

以下を含めてください：
1. 実装ファイルのリスト
2. 主要な処理フロー
3. エラーハンドリングのシナリオ
4. テストケース
5. 技術的な注意事項
6. 依存タスクとの関係」
```

### ステップ3: 進捗更新

```bash
# プロンプト例
「tasks.mdの進捗を更新してください。

以下のタスクが完了しました：
- Task-001: users テーブル作成
- Task-002: ユーザーモデル実装

以下のタスクが進行中です：
- Task-003: パスワードハッシュ化 (80%)
- Task-004: Register API実装 (開始したばかり)

進捗ボードとバーンダウンチャートを更新してください。」
```

### ステップ4: 依存関係分析

```bash
# プロンプト例
「tasks.mdの依存関係を分析してください。

以下を確認：
1. クリティカルパス
2. 並行実行可能なタスク
3. ボトルネックとなるタスク
4. 最適な実行順序の提案

依存関係グラフを作成してください。」
```

### ステップ5: タスクのリファクタリング

```bash
# プロンプト例
「Task-004が大きすぎるので、より小さなタスクに分割してください。

現在のTask-004:
- Register API実装（見積もり: 8h）

以下に分割：
1. リクエストバリデーション
2. ビジネスロジック
3. データベース操作
4. レスポンス生成
5. エラーハンドリング

各サブタスクに見積もりと受け入れ基準を追加。」
```

### 実践的なワークフロー

```markdown
## Claude Code タスク管理ワークフロー

### 1. スプリント開始時
\```bash
# 新しいスプリントのタスク生成
「Sprint 2のタスクを生成してください。

対象User Story:
- US-002: ログイン機能
- US-003: ユーザー検索機能

Sprint 1の速度（Velocity）を参考に、
実現可能なタスク量を提案してください。」
\```

### 2. デイリースタンドアップ前
\```bash
# 進捗の自動集計
「昨日から今日までの進捗をまとめてください。

Git commits、PRステータス、テスト結果を基に：
1. 完了したタスク
2. 進行中のタスク
3. ブロッカー
4. 本日の計画

デイリースタンドアップ用のサマリーを生成。」
\```

### 3. ブロッカー発生時
\```bash
# ブロッカー対応タスクの追加
「Task-003でパフォーマンス問題が発生しました。

以下の対応タスクを追加：
1. パフォーマンス調査
2. 代替手段の検討
3. 修正実装
4. パフォーマンステスト

優先順位を調整し、依存タスクへの影響を分析してください。」
\```

### 4. コードレビュー時
\```bash
# レビューチェックリストの生成
「Task-004のコードレビューチェックリストを生成してください。

以下の観点で：
1. 要件の実装完了度
2. コード品質
3. テストカバレッジ
4. セキュリティ
5. パフォーマンス
6. ドキュメント

受け入れ基準との照合も含めてください。」
\```

### 5. スプリント終了時
\```bash
# レトロスペクティブデータの生成
「Sprint 1のレトロスペクティブデータを生成してください。

分析項目:
1. Velocity (計画 vs 実績)
2. 完了率
3. ブロッカーの分析
4. 見積もり精度
5. 改善提案

次スプリントへの改善アクションを提案してください。」
\```
```

## 実践例

### 完全なtasks.mdの例

```markdown
# Tasks Specification

## Overview
ユーザー管理Webアプリケーションの実装タスク管理。
要件定義と設計仕様に基づき、実装作業を具体化して進捗を追跡する。

## Current Sprint: Sprint 1

### Sprint Goal
ユーザー登録機能（US-001）の完全実装とテスト完了

### Duration
2025-01-20 ~ 2025-01-31 (2 weeks)

### Team Capacity
- Backend: 80h (2 devs × 40h)
- Frontend: 80h (2 devs × 40h)
- QA: 40h (1 QA × 40h)
- Total: 200h

### Velocity Target
40 Story Points

---

## Task List

### [US-001] User Registration Feature

#### Phase 1: Backend Infrastructure (Priority: P0)

##### Task-001: Database Schema Creation
**Status**: ✅ Done
**Assignee**: @backend-team
**Estimate**: 2h
**Actual**: 2.5h
**Completed**: 2025-01-20

**Description**:
PostgreSQL スキーマ設計とマイグレーション作成

**Acceptance Criteria**:
- [x] `users` テーブル作成（id, email, password_hash, name, etc.）
- [x] マイグレーションファイル作成
- [x] インデックス設定（email, created_at）
- [x] 外部キー制約設定

**Implementation**:
\```sql
-- migrations/001_create_users_table.sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);
\```

**Files Changed**:
- `migrations/001_create_users_table.sql`
- `database/schema.sql`

**Related**:
- Requirements: [US-001](../requirements.md#us-001)
- Design: [Database Schema](../design.md#database-schema)
- PR: #101

---

##### Task-002: User Model Implementation
**Status**: ✅ Done
**Assignee**: @backend-team
**Estimate**: 3h
**Actual**: 3h
**Completed**: 2025-01-21

**Description**:
TypeScript ユーザーモデルとバリデーションの実装

**Acceptance Criteria**:
- [x] User interface定義
- [x] Prisma/TypeORM model作成
- [x] Zodバリデーションスキーマ
- [x] ユニットテスト作成

**Implementation**:
\```typescript
// src/types/user.ts
export interface User {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// src/validation/user.ts
import { z } from 'zod';

export const CreateUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).regex(/[A-Z]/).regex(/[a-z]/).regex(/[0-9]/),
  name: z.string().min(1).max(100),
});
\```

**Files Changed**:
- `src/types/user.ts`
- `src/models/User.ts`
- `src/validation/user.ts`
- `src/models/__tests__/User.test.ts`

**Test Coverage**: 95%

**Related**:
- Requirements: [US-001](../requirements.md#us-001)
- Design: [Data Model](../design.md#data-model)
- PR: #102

---

##### Task-003: Password Hashing Utility
**Status**: 🔄 In Progress (80%)
**Assignee**: @backend-team
**Estimate**: 2h
**Started**: 2025-01-21

**Description**:
bcrypt を使ったパスワードハッシュ化ユーティリティの実装

**Acceptance Criteria**:
- [x] bcrypt integration
- [x] ハッシュ生成関数（cost: 12）
- [x] 検証関数
- [ ] パフォーマンステスト（⚠️ 進行中）
- [ ] ユニットテスト

**Blocker**:
⚠️ bcrypt cost=12 でパフォーマンス問題を発見
- 解決策: cost=10に変更してテスト中
- 影響: Task-004開始が1日遅延の可能性

**Implementation**:
\```typescript
// src/utils/password.ts
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12; // パフォーマンス問題により10に変更検討中

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
\```

**Files Changed**:
- `src/utils/password.ts`
- `src/utils/__tests__/password.test.ts` (作成中)

**Related**:
- Requirements: [US-001 AC-2](../requirements.md#us-001)
- Design: [Security](../design.md#security-considerations)

---

#### Phase 2: API Implementation (Priority: P1)

##### Task-004: POST /api/auth/register Endpoint
**Status**: ⏸️ Todo
**Assignee**: @backend-team
**Estimate**: 4h
**Dependencies**: Task-001, Task-002, Task-003

**Description**:
ユーザー登録APIエンドポイントの実装

**Acceptance Criteria**:
- [ ] リクエストバリデーション（Zod）
- [ ] メールアドレス重複チェック
- [ ] パスワードハッシュ化
- [ ] データベース保存
- [ ] レスポンス生成（JWT token）
- [ ] 適切なHTTPステータスコード

**Implementation Plan**:
\```typescript
// src/routes/auth.ts
router.post('/register', async (req, res) => {
  try {
    // 1. Validate request body
    const validatedData = CreateUserSchema.parse(req.body);

    // 2. Check email uniqueness
    const existing = await userRepo.findByEmail(validatedData.email);
    if (existing) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    // 3. Hash password
    const passwordHash = await hashPassword(validatedData.password);

    // 4. Create user
    const user = await userRepo.create({
      ...validatedData,
      passwordHash,
    });

    // 5. Generate JWT
    const token = generateToken(user);

    // 6. Return response
    res.status(201).json({ user, token });
  } catch (error) {
    handleError(error, res);
  }
});
\```

**Test Cases**:
- [ ] 正常な登録フロー
- [ ] バリデーションエラー（無効なメール）
- [ ] バリデーションエラー（弱いパスワード）
- [ ] 重複エラー（既存メール）
- [ ] データベースエラー処理

**Files to Create/Modify**:
- `src/routes/auth.ts`
- `src/controllers/AuthController.ts`
- `src/routes/__tests__/auth.test.ts`

**Related**:
- Requirements: [US-001 AC-1](../requirements.md#us-001)
- Design: [API Design](../design.md#api-design)

---

##### Task-005: Error Handling Implementation
**Status**: ⏸️ Todo
**Assignee**: @backend-team
**Estimate**: 2h
**Dependencies**: Task-004

**Description**:
統一されたエラーハンドリングミドルウェアの実装

**Acceptance Criteria**:
- [ ] バリデーションエラーハンドラ
- [ ] データベースエラーハンドラ
- [ ] 標準化されたエラーレスポンス形式
- [ ] エラーロギング
- [ ] ステータスコードの適切な使用

**Error Response Format**:
\```typescript
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
\```

**Files to Create/Modify**:
- `src/middleware/errorHandler.ts`
- `src/utils/errors.ts`
- `src/middleware/__tests__/errorHandler.test.ts`

**Related**:
- Requirements: [US-001 AC-4](../requirements.md#us-001)
- Design: [Error Handling](../design.md#error-handling)

---

#### Phase 3: Frontend Implementation (Priority: P1)

##### Task-006: Registration Form Component
**Status**: 🔄 In Progress (60%)
**Assignee**: @frontend-team
**Estimate**: 4h
**Started**: 2025-01-22

**Description**:
ユーザー登録フォームコンポーネントの作成

**Acceptance Criteria**:
- [x] RegistrationForm.tsx コンポーネント作成
- [x] フォーム状態管理（React Hook Form）
- [x] CSS Modules スタイリング
- [ ] ローディング状態表示
- [ ] 成功メッセージ表示
- [ ] エラーメッセージ表示

**Implementation Progress**:
\```tsx
// src/components/auth/RegistrationForm/RegistrationForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import styles from './RegistrationForm.module.css';

export const RegistrationForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(CreateUserSchema),
  });

  const onSubmit = async (data: CreateUserInput) => {
    // TODO: API call implementation
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <input {...register('email')} placeholder="Email" />
      {errors.email && <span className={styles.error}>{errors.email.message}</span>}

      <input {...register('password')} type="password" placeholder="Password" />
      {errors.password && <span className={styles.error}>{errors.password.message}</span>}

      <input {...register('name')} placeholder="Name" />
      {errors.name && <span className={styles.error}>{errors.name.message}</span>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
};
\```

**Files Changed**:
- `src/components/auth/RegistrationForm/RegistrationForm.tsx` ✅
- `src/components/auth/RegistrationForm/RegistrationForm.module.css` ✅
- `src/components/auth/RegistrationForm/index.ts` ✅
- `src/components/auth/RegistrationForm/RegistrationForm.test.tsx` ⏸️ Pending

**Related**:
- Requirements: [US-001](../requirements.md#us-001)
- Design: [Component Design](../design.md#component-architecture)

---

##### Task-007: API Client Implementation
**Status**: ⏸️ Todo
**Assignee**: @frontend-team
**Estimate**: 2h
**Dependencies**: Task-004

**Description**:
フロントエンド用のAPI クライアント実装

**Acceptance Criteria**:
- [ ] 登録API呼び出し関数
- [ ] エラーハンドリング
- [ ] TypeScript型定義
- [ ] リトライロジック（オプション）

**Implementation Plan**:
\```typescript
// src/api/auth.ts
import axios from 'axios';

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface RegisterResponse {
  user: User;
  token: string;
}

export async function register(data: RegisterRequest): Promise<RegisterResponse> {
  try {
    const response = await axios.post<RegisterResponse>('/api/auth/register', data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new APIError(error.response.data.error);
    }
    throw error;
  }
}
\```

**Files to Create**:
- `src/api/auth.ts`
- `src/api/client.ts`
- `src/api/errors.ts`
- `src/api/__tests__/auth.test.ts`

**Related**:
- Requirements: [US-001](../requirements.md#us-001)
- Design: [API Client](../design.md#api-client)

---

##### Task-008: Form Validation Implementation
**Status**: ⏸️ Todo
**Assignee**: @frontend-team
**Estimate**: 3h
**Dependencies**: Task-006

**Description**:
フォームバリデーションとユーザーフィードバックの実装

**Acceptance Criteria**:
- [ ] リアルタイムバリデーション
- [ ] エラーメッセージ表示
- [ ] パスワード強度インジケーター
- [ ] 確認メッセージ

**Implementation Plan**:
1. React Hook Form + Zod integration
2. Password strength meter component
3. Error message styling
4. Success feedback

**Files to Create/Modify**:
- `src/components/common/PasswordStrengthIndicator/`
- `src/components/auth/RegistrationForm/RegistrationForm.tsx` (update)
- `src/utils/validation.ts`

**Related**:
- Requirements: [US-001 AC-2](../requirements.md#us-001)
- Design: [Component Design](../design.md#component-architecture)

---

#### Phase 4: Testing (Priority: P2)

##### Task-009: Backend Unit Tests
**Status**: ⏸️ Todo
**Assignee**: @backend-team
**Estimate**: 4h
**Dependencies**: Task-004, Task-005

**Description**:
バックエンドのユニットテスト実装

**Test Coverage Target**: 80%以上

**Test Cases**:
- [ ] User model tests
- [ ] Password utility tests
- [ ] Validation schema tests
- [ ] Controller unit tests
- [ ] Error handler tests

**Files to Create**:
- `src/models/__tests__/User.test.ts`
- `src/utils/__tests__/password.test.ts`
- `src/validation/__tests__/user.test.ts`
- `src/controllers/__tests__/AuthController.test.ts`
- `src/middleware/__tests__/errorHandler.test.ts`

**Related**:
- Requirements: [US-001](../requirements.md#us-001)
- Design: [Testing Strategy](../design.md#testing-strategy)

---

##### Task-010: Frontend Unit Tests
**Status**: ⏸️ Todo
**Assignee**: @frontend-team
**Estimate**: 3h
**Dependencies**: Task-006, Task-007, Task-008

**Description**:
フロントエンドコンポーネントのユニットテスト

**Test Coverage Target**: 80%以上

**Test Cases**:
- [ ] RegistrationForm component tests
- [ ] PasswordStrengthIndicator tests
- [ ] API client tests
- [ ] Validation utility tests

**Files to Create**:
- `src/components/auth/RegistrationForm/RegistrationForm.test.tsx`
- `src/components/common/PasswordStrengthIndicator/PasswordStrengthIndicator.test.tsx`
- `src/api/__tests__/auth.test.ts`
- `src/utils/__tests__/validation.test.ts`

**Related**:
- Requirements: [US-001](../requirements.md#us-001)
- Design: [Testing Strategy](../design.md#testing-strategy)

---

##### Task-011: Integration Tests
**Status**: ⏸️ Todo
**Assignee**: @qa-team
**Estimate**: 3h
**Dependencies**: Task-004, Task-006

**Description**:
APIとデータベースの統合テスト

**Test Scenarios**:
- [ ] 正常な登録フロー（E2E）
- [ ] バリデーションエラーケース
- [ ] 重複エラーケース
- [ ] データベーストランザクション

**Files to Create**:
- `tests/integration/auth.test.ts`
- `tests/integration/setup.ts`

**Related**:
- Requirements: [US-001](../requirements.md#us-001)
- Design: [Testing Strategy](../design.md#testing-strategy)

---

##### Task-012: E2E Tests
**Status**: ⏸️ Todo
**Assignee**: @qa-team
**Estimate**: 4h
**Dependencies**: Task-011

**Description**:
Playwright を使ったE2Eテスト

**Test Scenarios**:
- [ ] ユーザー登録フローの完全テスト
- [ ] エラーケースのテスト
- [ ] UI/UXの検証

**Files to Create**:
- `tests/e2e/user-registration.spec.ts`
- `tests/e2e/fixtures.ts`

**Related**:
- Requirements: [US-001](../requirements.md#us-001)
- Design: [Testing Strategy](../design.md#testing-strategy)

---

#### Phase 5: Documentation & Review (Priority: P3)

##### Task-013: API Documentation Update
**Status**: ⏸️ Todo
**Assignee**: @backend-team
**Estimate**: 2h
**Dependencies**: Task-004

**Description**:
APIドキュメントの更新

**Deliverables**:
- [ ] エンドポイント仕様
- [ ] Request/Response examples
- [ ] エラーコード一覧
- [ ] 認証フロー説明

**Files to Create/Update**:
- `docs/api/authentication.md`
- `docs/api/errors.md`

**Related**:
- Requirements: [US-001](../requirements.md#us-001)
- Design: [API Design](../design.md#api-design)

---

##### Task-014: Code Review
**Status**: ⏸️ Todo
**Assignee**: @tech-lead
**Estimate**: 2h
**Dependencies**: Task-001 ~ Task-012

**Description**:
最終コードレビューと品質チェック

**Review Checklist**:
- [ ] コード品質
- [ ] セキュリティ
- [ ] パフォーマンス
- [ ] テストカバレッジ
- [ ] ドキュメント完全性

---

## Progress Tracking

### Sprint Board
\```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│   Todo      │ In Progress │   Review    │    Done     │
├─────────────┼─────────────┼─────────────┼─────────────┤
│ Task-004    │ Task-003    │             │ Task-001    │
│ Task-005    │ Task-006    │             │ Task-002    │
│ Task-007    │             │             │             │
│ Task-008    │             │             │             │
│ Task-009    │             │             │             │
│ Task-010    │             │             │             │
│ Task-011    │             │             │             │
│ Task-012    │             │             │             │
│ Task-013    │             │             │             │
│ Task-014    │             │             │             │
├─────────────┼─────────────┼─────────────┼─────────────┤
│ Count: 9    │ Count: 2    │ Count: 0    │ Count: 2    │
│ Points: 28  │ Points: 6   │ Points: 0   │ Points: 5   │
└─────────────┴─────────────┴─────────────┴─────────────┘

Total: 13 tasks, 39 points
Completed: 2 tasks, 5 points (13%)
\```

### Burndown Chart
\```
Story Points Remaining
40 │●
35 │ ●
30 │
25 │
20 │
15 │
10 │
5  │
0  │
   └──────────────────────
   Day 1 2 3 4 5 6 7 8 9 10

   Ideal:  ─────●──
   Actual: ●────●
\```

### Team Velocity
- **Planned**: 40 Story Points
- **Completed**: 5 Story Points
- **In Progress**: 6 Story Points
- **Remaining**: 28 Story Points
- **% Complete**: 13%

### Blockers
- ⚠️ **Task-003**: bcrypt パフォーマンス問題
  - Impact: Task-004 開始遅延
  - Resolution ETA: 2025-01-23

---

## Traceability Matrix

| Task ID | Task Name | User Story | Design Ref | Status | Assignee | Estimate | Actual |
|---------|-----------|------------|------------|--------|----------|----------|--------|
| Task-001 | DB Schema | [US-001](../requirements.md#us-001) | [DB Schema](../design.md#database-schema) | Done | @backend | 2h | 2.5h |
| Task-002 | User Model | [US-001](../requirements.md#us-001) | [Data Model](../design.md#data-model) | Done | @backend | 3h | 3h |
| Task-003 | Password Hash | [US-001](../requirements.md#us-001) | [Security](../design.md#security) | In Progress | @backend | 2h | - |
| Task-004 | Register API | [US-001](../requirements.md#us-001) | [API Design](../design.md#api-design) | Todo | @backend | 4h | - |
| Task-005 | Error Handler | [US-001](../requirements.md#us-001) | [Error Handling](../design.md#error-handling) | Todo | @backend | 2h | - |
| Task-006 | Registration Form | [US-001](../requirements.md#us-001) | [Components](../design.md#components) | In Progress | @frontend | 4h | - |
| Task-007 | API Client | [US-001](../requirements.md#us-001) | [API Client](../design.md#api-client) | Todo | @frontend | 2h | - |
| Task-008 | Form Validation | [US-001](../requirements.md#us-001) | [Components](../design.md#components) | Todo | @frontend | 3h | - |
| Task-009 | Backend Tests | [US-001](../requirements.md#us-001) | [Testing](../design.md#testing-strategy) | Todo | @backend | 4h | - |
| Task-010 | Frontend Tests | [US-001](../requirements.md#us-001) | [Testing](../design.md#testing-strategy) | Todo | @frontend | 3h | - |
| Task-011 | Integration Tests | [US-001](../requirements.md#us-001) | [Testing](../design.md#testing-strategy) | Todo | @qa | 3h | - |
| Task-012 | E2E Tests | [US-001](../requirements.md#us-001) | [Testing](../design.md#testing-strategy) | Todo | @qa | 4h | - |
| Task-013 | API Docs | [US-001](../requirements.md#us-001) | [API Design](../design.md#api-design) | Todo | @backend | 2h | - |

**Total**: 38h estimated

---

## Version History
- v1.0 (2025-01-20): 初版作成、Sprint 1 タスク定義
- v1.1 (2025-01-22): Task-001, Task-002 完了、Task-003 ブロッカー追加
```

## まとめ

### タスク管理のチェックリスト

```markdown
## Task Management Checklist

### タスク作成
- [ ] User Storyから分解されている
- [ ] SMART原則に従っている
- [ ] 受け入れ基準が明確
- [ ] 見積もり時間が適切（1-2日以内）
- [ ] 依存関係が明示されている

### タスク詳細
- [ ] 実装ファイルがリストされている
- [ ] 技術的な注意事項がある
- [ ] テストケースが含まれている
- [ ] 担当者が割り当てられている

### トレーサビリティ
- [ ] User Storyへのリンク
- [ ] 設計ドキュメントへのリンク
- [ ] PRへのリンク（完了時）

### 進捗管理
- [ ] ステータスが最新
- [ ] スプリントボードが更新されている
- [ ] ブロッカーが記録されている
- [ ] 完了基準が満たされている
```

### 次のステップ

タスク管理の仕組みを理解したら、AIとの協働でさらに効率化します：

1. [AIとの協働ワークフロー](./05-ai-workflow.md)

---

**関連ドキュメント:**
- [.kiroディレクトリの基礎](./01-steering-basics.md)
- [要件定義の作成](./02-requirements-spec.md)
- [設計仕様の作成](./03-design-spec.md)

**タグ:** #spec-driven #task-management #sprint-planning #progress-tracking #traceability #kiro
