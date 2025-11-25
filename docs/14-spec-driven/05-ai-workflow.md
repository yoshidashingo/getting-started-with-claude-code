# AIとの協働ワークフロー

## 目次
- [スペック駆動開発におけるAIの役割](#スペック駆動開発におけるaiの役割)
- [Claude Codeでのワークフロー](#claude-codeでのワークフロー)
- [実践的なプロンプト例](#実践的なプロンプト例)
- [要件→設計→実装の流れ](#要件設計実装の流れ)
- [レビューと修正のサイクル](#レビューと修正のサイクル)
- [チーム開発での活用](#チーム開発での活用)
- [ベストプラクティス](#ベストプラクティス)

## スペック駆動開発におけるAIの役割

### AIが得意なこと

```text
AIの強み:
✓ ドキュメント生成の自動化
✓ 要件の構造化と整理
✓ 設計パターンの提案
✓ コード生成とテスト作成
✓ トレーサビリティの維持
✓ 一貫性のチェック
✓ ベストプラクティスの適用
```

### 人間が担当すべきこと

```text
人間の役割:
✓ ビジネス要件の決定
✓ 優先順位付け
✓ アーキテクチャの最終決定
✓ コードレビュー
✓ ユーザー体験の評価
✓ セキュリティの検証
✓ 最終的な品質保証
```

### AIと人間の協働モデル

```markdown
## Collaborative Development Model

### フェーズ1: 要件定義
Human:  ビジネス要件の説明
  ↓
AI:     User Story形式への変換、受け入れ基準の提案
  ↓
Human:  レビューと調整
  ↓
AI:     requirements.md生成

### フェーズ2: 設計
Human:  アーキテクチャの方向性決定
  ↓
AI:     詳細設計の提案、パターン適用
  ↓
Human:  レビューと決定
  ↓
AI:     design.md生成

### フェーズ3: 実装計画
Human:  スプリント目標の設定
  ↓
AI:     タスク分解、見積もり
  ↓
Human:  優先順位付け、調整
  ↓
AI:     tasks.md生成

### フェーズ4: 実装
AI:     コード生成、テスト作成
  ↓
Human:  コードレビュー
  ↓
AI:     修正、リファクタリング
  ↓
Human:  最終承認

### フェーズ5: ドキュメント更新
AI:     実装に基づくドキュメント更新
  ↓
Human:  検証と承認
```

## Claude Codeでのワークフロー

### 基本的な開発サイクル

```bash
# 1. プロジェクト開始
claude

# プロンプト
「新しいプロジェクトを開始します。
.kiroディレクトリ構造を作成し、初期ドキュメントを生成してください。

プロジェクト概要:
- 名前: User Management System
- 目的: Webベースのユーザー管理アプリケーション
- 技術スタック: React + TypeScript + Node.js + PostgreSQL」

# 2. 要件定義
「requirements.mdを作成してください。
以下の機能が必要です：
- ユーザー登録
- ログイン・ログアウト
- プロフィール管理
- ユーザー検索

User Story形式で、Acceptance Criteriaを含めてください。」

# 3. 設計
「requirements.mdを基に、design.mdを作成してください。
以下を含めてください：
- システムアーキテクチャ
- コンポーネント設計
- データモデル
- API設計」

# 4. タスク分解
「design.mdを基に、tasks.mdを作成してください。
Sprint 1として、ユーザー登録機能（US-001）に焦点を当てます。
実装可能なタスクに分解し、依存関係を明確にしてください。」

# 5. 実装
「Task-001（データベーススキーマ作成）を実装してください。
design.mdの仕様に従い、マイグレーションファイルを作成してください。」

# 6. テスト
「Task-001のテストを作成してください。」

# 7. レビュー
「Task-001のコードをレビューしてください。
以下の観点で確認：
- 設計仕様との一致
- セキュリティ
- パフォーマンス
- テストカバレッジ」

# 8. ドキュメント更新
「Task-001が完了しました。
tasks.mdを更新してください：
- ステータスをDoneに
- 実際の作業時間を記録
- 完了日を追加
- 次のタスクの依存関係を確認」
```

### インクリメンタルな開発

```markdown
## Incremental Development with Claude Code

### Week 1: Foundation
Day 1: .kiro setup + requirements.md
Day 2: design.md creation
Day 3: tasks.md planning
Day 4-5: Task-001 ~ Task-003 implementation

### Week 2: Core Features
Day 1-2: Task-004 ~ Task-006 implementation
Day 3: Testing (Task-009 ~ Task-011)
Day 4: E2E testing (Task-012)
Day 5: Review & Documentation

### 各タスクでのClaude Code活用
\```bash
# タスク開始時
「Task-XXXを開始します。
実装前に以下を確認してください：
1. 要件との整合性
2. 設計仕様の確認
3. 依存タスクの完了状況
4. テスト戦略」

# 実装中
「Task-XXXを実装してください。
[具体的な指示]」

# 実装後
「Task-XXXが完了しました。
以下を実行してください：
1. テストの実行
2. コードレビュー
3. ドキュメント更新
4. tasks.mdの進捗更新」
\```
```

## 実践的なプロンプト例

### 要件定義フェーズ

#### プロンプト1: 初期要件の生成

```bash
「requirements.mdを作成してください。

プロジェクト: ユーザー管理Webアプリケーション

必要な機能:
1. ユーザー登録
   - メールアドレスとパスワードで登録
   - メールアドレスの検証
   - パスワード強度チェック

2. ログイン
   - メールアドレスとパスワードで認証
   - セッション管理
   - Remember Me機能

3. ユーザー検索
   - 名前、メールアドレスで検索
   - リアルタイムフィルタリング

各機能について：
- User Story形式で記述
- 詳細なAcceptance Criteriaを含める
- Given-When-Then形式も使用
- 優先順位をMoSCoW法で分類
- 依存関係を明示

既存のベストプラクティスに従ってください。」
```

#### プロンプト2: 要件の詳細化

```bash
「US-001（ユーザー登録機能）の受け入れ基準を詳細化してください。

以下の観点を追加：
1. セキュリティ要件
   - パスワードの要件（長さ、複雑さ）
   - SQLインジェクション対策
   - CSRF対策

2. パフォーマンス要件
   - レスポンスタイム
   - 同時登録数

3. アクセシビリティ要件
   - WCAG 2.1 AA準拠
   - キーボード操作
   - スクリーンリーダー対応

4. エラーハンドリング
   - 各種エラーケース
   - エラーメッセージの内容

具体的で測定可能な基準を記述してください。」
```

#### プロンプト3: 要件のレビュー

```bash
「requirements.mdをレビューしてください。

以下の観点で確認：
1. INVEST原則への準拠
   - Independent
   - Negotiable
   - Valuable
   - Estimable
   - Small
   - Testable

2. 受け入れ基準の品質
   - 測定可能か
   - 曖昧さはないか
   - すべてのシナリオをカバーしているか

3. 一貫性
   - 用語の統一
   - フォーマットの一貫性

4. 完全性
   - 不足している要件はないか
   - 依存関係は明確か

問題点と改善提案をリストアップしてください。」
```

### 設計フェーズ

#### プロンプト4: アーキテクチャ設計

```bash
「design.mdを作成してください。

要件: .kiro/specs/requirements.md
技術スタック: .kiro/steering/tech.md

設計内容:
1. システムアーキテクチャ
   - 全体構成図（ASCII art）
   - レイヤー構成
   - 技術選択の理由

2. コンポーネント設計
   - フロントエンドコンポーネント構造
   - バックエンドモジュール構成
   - 各コンポーネントの責務

3. データモデル
   - ER図
   - テーブル定義（CREATE TABLE文）
   - TypeScript型定義

4. API設計
   - エンドポイント一覧
   - Request/Response例
   - エラーレスポンス形式

5. テスト戦略
   - テストピラミッド
   - カバレッジ目標
   - テストツール

各セクションに具体的なコード例を含めてください。」
```

#### プロンプト5: セキュリティ設計

```bash
「design.mdにセキュリティ設計セクションを追加してください。

以下をカバー：
1. 認証・認可
   - JWTの実装方法
   - トークンのライフサイクル
   - Refresh token戦略

2. データ保護
   - パスワードハッシュ化（bcrypt）
   - 個人情報の暗号化
   - HTTPS必須化

3. 攻撃対策
   - SQLインジェクション
   - XSS
   - CSRF
   - レートリミット

4. セキュリティヘッダー
   - HSTS
   - CSP
   - X-Frame-Options

5. 監査ログ
   - ログ対象のアクション
   - ログフォーマット
   - 保存期間

実装例を含めてください。」
```

#### プロンプト6: パフォーマンス最適化設計

```bash
「design.mdにパフォーマンス最適化セクションを追加してください。

最適化戦略:
1. フロントエンド
   - Code splitting
   - Lazy loading
   - Memoization
   - Virtual scrolling

2. バックエンド
   - Database indexing
   - Query optimization
   - Connection pooling
   - Response caching

3. ネットワーク
   - Gzip compression
   - CDN利用
   - HTTP/2

各最適化について：
- 実装方法
- 期待される効果
- トレードオフ

具体的なコード例とベンチマーク目標を含めてください。」
```

### 実装フェーズ

#### プロンプト7: タスク生成

```bash
「tasks.mdを作成してください。

対象: US-001（ユーザー登録機能）

タスク分解の基準:
- 各タスクは1-2日で完了可能
- 明確な依存関係
- テスタブル
- 独立して実装可能

各タスクに含める情報:
1. タスクID
2. タスク名
3. 説明
4. 受け入れ基準（チェックリスト）
5. 実装詳細
6. 技術的注意事項
7. テストチェックリスト
8. 依存関係
9. 見積もり時間
10. 担当者
11. ステータス
12. 要件・設計へのリンク

フェーズごとに分類してください：
- Phase 1: Backend Infrastructure
- Phase 2: API Implementation
- Phase 3: Frontend Implementation
- Phase 4: Testing
- Phase 5: Documentation & Review」
```

#### プロンプト8: コード実装

```bash
「Task-004（POST /api/auth/register エンドポイント）を実装してください。

要件: requirements.md#us-001
設計: design.md#api-design

実装内容:
1. Express ルーター設定
2. リクエストバリデーション（Zod）
3. メールアドレス重複チェック
4. パスワードハッシュ化
5. データベース保存
6. JWTトークン生成
7. レスポンス生成
8. エラーハンドリング

実装後:
1. ユニットテスト作成
2. Integrationテスト作成
3. APIドキュメント更新
4. tasks.mdの進捗更新

TypeScript、ESLint、Prettierに準拠してください。」
```

#### プロンプト9: テスト作成

```bash
「Task-004（Register API）のテストを作成してください。

テストフレームワーク: Vitest

テストケース:
1. 正常系
   - 有効な入力でユーザーが作成される
   - 201ステータスコードが返る
   - ユーザー情報とトークンが返る

2. バリデーションエラー
   - 無効なメールアドレス
   - 弱いパスワード
   - 必須フィールドの欠落

3. ビジネスロジックエラー
   - メールアドレスの重複
   - データベースエラー

4. エッジケース
   - 特殊文字を含むメールアドレス
   - 非常に長い入力
   - 同時リクエスト

各テストケースについて:
- Arrange-Act-Assert パターン
- 適切なモック使用
- エラーメッセージの検証
- レスポンス構造の検証

カバレッジ80%以上を目指してください。」
```

### レビューフェーズ

#### プロンプト10: コードレビュー

```bash
「Task-004の実装をレビューしてください。

レビュー観点:
1. 要件との整合性
   - requirements.md#us-001との対応
   - すべての受け入れ基準を満たしているか

2. 設計との整合性
   - design.md#api-designに従っているか
   - アーキテクチャパターンに準拠しているか

3. コード品質
   - 命名規則
   - 関数の単一責任
   - コメントの適切さ
   - DRY原則

4. セキュリティ
   - SQLインジェクション対策
   - パスワードハッシュ化
   - 入力バリデーション
   - エラーメッセージの情報漏洩

5. パフォーマンス
   - 不要なデータベースクエリ
   - N+1問題
   - メモリリーク

6. テスタビリティ
   - ユニットテスト容易性
   - モック可能性

7. テストカバレッジ
   - カバレッジ率
   - エッジケースのテスト

問題点、改善提案、Good Practiceをリストアップしてください。」
```

#### プロンプト11: ドキュメント同期確認

```bash
「実装とドキュメントの同期を確認してください。

確認項目:
1. requirements.mdの受け入れ基準
   - すべて実装されているか
   - 変更が必要な基準はないか

2. design.mdの設計仕様
   - 実装が設計に従っているか
   - 設計からの逸脱がある場合、更新が必要か

3. tasks.mdの進捗
   - タスクステータスは最新か
   - 完了基準を満たしているか
   - 新たに発見されたタスクはないか

4. APIドキュメント
   - 実装と一致しているか
   - Request/Response例が正確か

不一致がある場合、修正案を提示してください。」
```

## 要件→設計→実装の流れ

### 完全なワークフロー例

```markdown
## Complete Workflow Example: User Registration Feature

### Step 1: ビジネス要件の説明（Human）

「新規ユーザーがメールアドレスとパスワードで登録できる機能が必要です。

要件:
- セキュアなパスワード保存
- メールアドレスの検証
- 重複登録の防止
- わかりやすいエラーメッセージ」

---

### Step 2: User Story生成（AI）

\```bash
「この要件をrequirements.mdに追加してください。
User Story形式で、詳細なAcceptance Criteriaを含めてください。」
\```

**Claude Codeの出力:**

\```markdown
## US-001: ユーザー登録機能

### User Story
As a 新規ユーザー
I want to メールアドレスとパスワードで登録できる
So that アプリケーションのサービスを利用できる

### Acceptance Criteria
- [ ] ユーザーは有効なメールアドレスを入力できる
- [ ] パスワードは8文字以上で、大文字、小文字、数字を含む必要がある
- [ ] 既に登録済みのメールアドレスの場合、エラーメッセージが表示される
- [ ] 登録成功後、確認メールが送信される
...
\```

---

### Step 3: レビューと調整（Human）

「US-001をレビューしました。
以下を追加してください：
- パスワードに特殊文字も必須にする
- 確認メールは24時間有効にする
- アカウントロック機能の要件も追加」

---

### Step 4: 要件の更新（AI）

\```bash
「US-001を更新してください。
パスワード要件に特殊文字を追加し、
メール検証の有効期限を24時間と明記してください。」
\```

---

### Step 5: 設計提案（AI）

\```bash
「US-001の実装設計をdesign.mdに追加してください。

以下を含める:
1. データベーススキーマ
2. API エンドポイント設計
3. パスワードハッシュ化方式
4. メール検証フロー
5. エラーハンドリング」
\```

**Claude Codeの出力:**

\```markdown
## User Registration Design

### Database Schema
\```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  ...
);
\```

### API Endpoint
POST /api/auth/register

### Password Security
- bcrypt with cost factor 12
- Requirements: 8+ chars, uppercase, lowercase, number, special char
...
\```

---

### Step 6: 設計レビュー（Human）

「設計をレビューしました。
bcryptのcost factorを12から10に変更してください。
パフォーマンステストの結果、12では遅すぎました。」

---

### Step 7: 設計更新（AI）

\```bash
「design.mdのパスワードハッシュ設計を更新してください。
bcrypt cost factorを10に変更し、
その理由（パフォーマンス）を記載してください。」
\```

---

### Step 8: タスク分解（AI）

\```bash
「US-001の実装タスクをtasks.mdに追加してください。
実装フェーズごとに分解し、依存関係を明確にしてください。」
\```

**Claude Codeの出力:**

\```markdown
### [US-001] User Registration

#### Phase 1: Backend Infrastructure
- [ ] Task-001: Database schema creation (2h)
- [ ] Task-002: User model implementation (3h)
- [ ] Task-003: Password hashing utility (2h)

#### Phase 2: API Implementation
- [ ] Task-004: POST /api/auth/register endpoint (4h)
  - Dependencies: Task-001, Task-002, Task-003
...
\```

---

### Step 9: タスクの優先順位付け（Human）

「Sprint 1ではTask-001からTask-006まで実装します。
Task-007以降は次のSprintに回してください。」

---

### Step 10: 実装開始（AI）

\```bash
「Task-001（Database schema creation）を実装してください。
design.mdの仕様に従って、マイグレーションファイルを作成してください。」
\```

**Claude Codeの出力:**

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
\```

「マイグレーションファイルを作成しました。
Task-001を完了としてマークしますか？」

---

### Step 11: レビューと承認（Human）

「Task-001のレビュー完了。承認します。
tasks.mdを更新してください。」

---

### Step 12: 進捗更新（AI）

\```bash
「Task-001を完了としてマークし、tasks.mdを更新してください。
実際の作業時間は2.5時間でした。」
\```

---

### Step 13 ~ N: 継続的な実装サイクル

同様のプロセスでTask-002、Task-003、...と進めていく。

各タスクで:
1. 実装（AI）
2. テスト作成（AI）
3. レビュー（Human）
4. 修正（AI）
5. 承認（Human）
6. ドキュメント更新（AI）
```

### フィードバックループ

```markdown
## Continuous Feedback Loop

### 実装中のフィードバック

#### 問題発見時
\```bash
Human: 「Task-003のパフォーマンステストで問題を発見しました。
        bcrypt cost=12だと1秒以上かかります。」

AI:    「了解しました。以下の対応を提案します：
        1. cost=10に変更（推奨）
        2. design.mdの更新
        3. tasks.mdにブロッカーとして記録
        4. パフォーマンステストの追加


        実行しますか？」
\```

#### 要件変更時
\```bash
Human: 「US-001の要件を変更したいです。
        メール検証を必須ではなくオプションにしてください。」

AI:    「了解しました。以下を更新します：
        1. requirements.md#us-001の受け入れ基準
        2. design.md のメール検証フロー（オプション化）
        3. 影響を受けるタスク（Task-015, Task-016, Task-017）の確認
        
        変更の影響範囲：
        - 実装済み: Task-001 ~ Task-003（影響なし）
        - 進行中: Task-004（軽微な修正が必要）
        - 未着手: Task-015 ~ Task-017（優先度を下げる）
        
        更新してよろしいですか？」
\```

#### 設計変更時
\```bash
Human: 「JWTの代わりにセッションベース認証に変更したいです。」

AI:    「大きな設計変更です。影響範囲を分析します：
        
        変更が必要なドキュメント:
        1. design.md#authentication-system（全面的に書き直し）
        2. tech.md（セッションストレージ追加: Redis）
        
        影響を受けるタスク:
        - Task-004: 大幅な修正が必要
        - Task-007: APIクライアントの修正
        - 新規タスク: Redisセットアップ、セッション管理実装
        
        見積もりへの影響: +16h
        
        この変更を実行する前に、以下を確認してください：
        1. なぜこの変更が必要か
        2. JWTの何が問題か
        3. セッションベースのトレードオフを理解しているか
        
        続行しますか？」
\```
```

## レビューと修正のサイクル

### コードレビューのワークフロー

```markdown
## Code Review Workflow with Claude Code

### 1. プルリクエスト作成前のセルフレビュー

\```bash
「Task-004の実装が完了しました。
プルリクエストを作成する前にセルフレビューを実行してください。

レビュー項目:
1. コード品質
2. テストカバレッジ
3. ドキュメントとの整合性
4. セキュリティ
5. パフォーマンス

チェックリストを作成し、問題があれば修正案を提示してください。」
\```

### 2. Claude Codeによる自動レビュー

**Claude Codeの出力:**
\```markdown
## Code Review Checklist

### ✅ Code Quality
- [x] 命名規則に従っている
- [x] 関数の単一責任原則
- [x] 適切なコメント
- [x] DRY原則の遵守

### ⚠️ Test Coverage
- [x] ユニットテスト: 85% (目標: 80%)
- [ ] **Issue**: エラーハンドリングのテストが不足
  - 推奨: データベースエラーケースのテスト追加

### ✅ Documentation Alignment
- [x] requirements.md#us-001 と一致
- [x] design.md#api-design に準拠

### ⚠️ Security
- [x] SQLインジェクション対策
- [x] パスワードハッシュ化
- [ ] **Issue**: レートリミットが未実装
  - 推奨: express-rate-limitの追加

### ✅ Performance
- [x] 不要なデータベースクエリなし
- [x] 適切なインデックス使用

### 修正推奨事項:
1. エラーハンドリングテストの追加（30分）
2. レートリミットの実装（1時間）

続行しますか？
\```

### 3. 修正の実行

\```bash
Human: 「修正推奨事項を実装してください。」

AI: [修正を実行し、テストを追加]

「修正が完了しました。
- エラーハンドリングテスト追加（5ケース）
- レートリミット実装（5req/min/IP）
- テストカバレッジ: 85% → 92%

再度レビューを実行しますか？」
\```

### 4. チームメンバーによるレビュー（Human）

\```bash
# PRコメント
「コードは良い状態ですが、以下を確認してください：
1. レートリミットの設定値（5req/minは厳しすぎる？）
2. エラーメッセージの国際化対応」
\```

### 5. フィードバックへの対応（AI）

\```bash
「PRフィードバックに対応してください：
1. レートリミットを10req/minに変更
2. エラーメッセージに i18n対応を追加」

AI: [対応を実行]

「フィードバックに対応しました：
- レートリミット: 10req/min
- i18nライブラリ導入: i18next
- エラーメッセージの多言語化

変更内容:
- src/middleware/rateLimiter.ts
- src/utils/i18n.ts
- src/locales/en.json
- src/locales/ja.json

タスクを完了としてマークしてよろしいですか？」
\```
```

### レビュー基準の標準化

```markdown
## Standardized Review Criteria

### Automated Checks (Claude Code)
\```bash
「以下の自動チェックを実行してください：
1. ESLint実行: npm run lint
2. TypeScriptコンパイル: npm run type-check
3. ユニットテスト: npm run test
4. カバレッジ確認: npm run test:coverage
5. ビルド確認: npm run build

結果をレポートしてください。」
\```

### Manual Review Points (Human)
1. **ビジネスロジック**: 要件通りに実装されているか
2. **ユーザー体験**: 使いやすいUIか
3. **エッジケース**: 想定外の入力への対応
4. **セキュリティ**: 脆弱性はないか
5. **パフォーマンス**: 実際の負荷で問題ないか

### Review Template

\```markdown
## Pull Request Review

### Summary
[PRの概要]

### Changes
- [変更内容のリスト]

### Test Coverage
- Unit Tests: XX%
- Integration Tests: [結果]
- E2E Tests: [結果]

### Checklist
- [ ] 要件を満たしている
- [ ] テストが十分
- [ ] ドキュメント更新済み
- [ ] セキュリティ確認済み
- [ ] パフォーマンス確認済み

### Review Comments
[具体的なコメント]

### Verdict
- [ ] Approve
- [ ] Request Changes
- [ ] Comment
\```
```

## チーム開発での活用

### ロール分担

```markdown
## Team Roles in Spec-Driven Development with AI

### Product Manager
**責務:**
- ビジネス要件の定義
- User Storyの優先順位付け
- 受け入れテストの実施

**Claude Code活用:**
\```bash
「新機能のアイデアがあります。
User Story形式でrequirements.mdに追加してください。
フィードバックに基づいて詳細化していきます。」
\```

### Tech Lead
**責務:**
- アーキテクチャ決定
- 設計レビュー
- 技術的な方向性の決定

**Claude Code活用:**
\```bash
「この要件に対するアーキテクチャ設計案を3つ提案してください。
それぞれのメリット・デメリット、トレードオフを含めて。」
\```

### Backend Developer
**責務:**
- API実装
- データベース設計
- バックエンドテスト

**Claude Code活用:**
\```bash
「Task-004のAPI実装を開始します。
design.mdに従って実装してください。
テストも同時に作成してください。」
\```

### Frontend Developer
**責務:**
- UIコンポーネント実装
- ユーザー体験の最適化
- フロントエンドテスト

**Claude Code活用:**
\```bash
「RegistrationFormコンポーネントを実装してください。
design.mdのコンポーネント設計に従い、
アクセシビリティにも配慮してください。」
\```

### QA Engineer
**責務:**
- テスト計画
- E2Eテスト実装
- バグレポート

**Claude Code活用:**
\```bash
「US-001のE2Eテストシナリオを作成してください。
正常系、異常系、エッジケースを網羅してください。」
\```
```

### チーム間のコミュニケーション

```markdown
## Team Communication with .kiro

### デイリースタンドアップでの活用

\```bash
# 進捗の自動集計
「昨日から今日までのチーム全体の進捗をまとめてください。

tasks.mdを基に：
1. 完了したタスク
2. 進行中のタスク
3. ブロッカー
4. 今日の計画

チームメンバーごとにグループ化してください。」
\```

**Claude Codeの出力:**
\```markdown
## Daily Standup (2025-01-23)

### Backend Team
**@developer1**
- ✅ 完了: Task-001, Task-002
- 🔄 進行中: Task-003 (80%)
- 🎯 Today: Task-003完了、Task-004開始

**@developer2**
- ✅ 完了: Task-005
- 🔄 進行中: Task-006 (60%)
- ⚠️ Blocker: デザインレビュー待ち
- 🎯 Today: デザイン調整後、Task-006完了

### Frontend Team
**@developer3**
- ✅ 完了: Task-007
- 🔄 進行中: Task-008 (40%)
- 🎯 Today: Task-008完了予定

### QA Team
**@qa1**
- ✅ 完了: E2E環境セットアップ
- 🔄 進行中: Task-011準備
- 🎯 Today: Task-009のテストレビュー

### Team Blockers
- ⚠️ Task-003: パフォーマンス問題（対応中）
- ⚠️ Task-006: デザインレビュー待ち

### Sprint Progress
- Completed: 5/13 tasks (38%)
- On Track: Yes
\```

### スプリントレビューでの活用

\```bash
「Sprint 1のレビュー資料を作成してください。

含める内容:
1. スプリント目標の達成状況
2. 完了したUser Story
3. デモ可能な機能
4. メトリクス（Velocity、カバレッジ）
5. 課題と改善点
6. 次スプリントへの引き継ぎ事項

プレゼンテーション形式でまとめてください。」
\```

### レトロスペクティブでの活用

\```bash
「Sprint 1のレトロスペクティブデータを分析してください。

分析項目:
1. Velocity (計画 vs 実績)
2. 見積もり精度
3. ブロッカーの頻度と種類
4. チーム間の依存関係の問題
5. プロセスの改善機会

具体的な改善アクションを提案してください。」
\```

**Claude Codeの出力:**
\```markdown
## Sprint 1 Retrospective Analysis

### Metrics
- **Planned Velocity**: 40 SP
- **Actual Velocity**: 35 SP (88%)
- **Estimate Accuracy**: 92% (good!)
- **Bug Count**: 3 (all resolved)

### What Went Well
✓ .kiroドキュメントによる明確な要件定義
✓ タスクの細分化が適切
✓ コードレビューの品質が高い
✓ テストカバレッジ目標達成

### What Didn't Go Well
⚠️ パフォーマンステストの遅延
⚠️ デザインレビューのボトルネック
⚠️ Frontend-Backend間の調整不足

### Root Cause Analysis

**Issue 1: パフォーマンステスト遅延**
- 原因: テスト環境の準備不足
- 影響: Task-003で1日遅延
- 対策: 次スプリント開始前に環境準備

**Issue 2: デザインレビューボトルネック**
- 原因: デザイナーのキャパシティ不足
- 影響: Task-006で0.5日遅延
- 対策: 非同期レビュープロセスの導入

**Issue 3: チーム間調整不足**
- 原因: API仕様の認識のずれ
- 影響: 追加調整ミーティング×2回
- 対策: design.mdへのAPI仕様の詳細化

### Action Items for Next Sprint
1. [ ] パフォーマンステスト環境を事前準備 (@devops)
2. [ ] デザインレビュープロセスの改善 (@tech-lead, @designer)
3. [ ] API仕様レビューミーティングを Sprint初日に実施 (@backend, @frontend)
4. [ ] Claude CodeでのAPI mockの自動生成検討 (@tech-lead)

### Improvement Proposal
\```bash
# Sprint 2での改善
「Sprint 2開始時に以下を実行：
1. API仕様の事前レビュー（design.md）
2. パフォーマンステスト環境の検証
3. デザイナーとの非同期レビューフロー確立
4. Claude CodeによるAPI mock自動生成の試験導入」
\```
\```
```

## ベストプラクティス

### 効果的なプロンプト作成

```markdown
## Effective Prompt Patterns

### Pattern 1: Context + Task + Format

**良い例:**
\```
Context: このプロジェクトはReact + TypeScriptのWebアプリケーションです。
Task: US-001（ユーザー登録機能）の実装タスクを tasks.mdに追加してください。
Format: 各タスクにID、説明、受け入れ基準、見積もり、依存関係を含めてください。
\```

**悪い例:**
\```
ユーザー登録のタスクを作って
\```

### Pattern 2: Step-by-Step Refinement

\```bash
# Step 1: 大まかな生成
「requirements.mdを作成してください。」

# Step 2: 詳細化
「US-001の受け入れ基準をもっと詳しくしてください。」

# Step 3: 特定の観点を追加
「セキュリティ要件とパフォーマンス要件を追加してください。」

# Step 4: レビューと修正
「INVEST原則に照らしてレビューし、改善してください。」
\```

### Pattern 3: Reference to Existing Docs

\```bash
「Task-004を実装してください。

参考ドキュメント:
- 要件: requirements.md#us-001
- 設計: design.md#api-design
- 技術スタック: steering/tech.md

これらに従って実装してください。」
\```

### Pattern 4: Explicit Constraints

\```bash
「ユーザー登録APIを実装してください。

制約:
- TypeScript必須
- ESLintルール厳守
- テストカバレッジ80%以上
- APIレスポンスタイム200ms以下
- JWTトークンの有効期限15分

これらの制約を満たす実装を提案してください。」
\```
```

### トラブルシューティング

```markdown
## Troubleshooting Common Issues

### Issue 1: AIの提案が要件と合わない

**症状:**
Claude Codeが生成したコードが要件を満たしていない

**解決策:**
\```bash
「生成されたコードをrequirements.md#us-001の受け入れ基準と照らし合わせてください。
満たしていない基準があれば、それを満たすように修正してください。

不足している受け入れ基準:
- [具体的に指摘]

これらを実装に追加してください。」
\```

### Issue 2: 設計とのずれ

**症状:**
実装がdesign.mdの設計パターンに従っていない

**解決策:**
\```bash
「実装がdesign.md#component-architectureのパターンに従っていません。

期待されるパターン:
- Container/Presentational分離
- Custom Hooksの使用
- 型安全なprops

このパターンに合わせてリファクタリングしてください。」
\```

### Issue 3: ドキュメントの不整合

**症状:**
requirements.md、design.md、tasks.mdの間で情報が一致しない

**解決策:**
\```bash
「.kiro/specs/内のドキュメント間の不整合をチェックしてください。

確認項目:
1. requirements.mdのUser Storyがすべてdesignでカバーされているか
2. design.mdの設計がすべてtasksで実装タスク化されているか
3. 用語の統一性

不整合があれば修正案を提示してください。」
\```

### Issue 4: 見積もりの大幅なずれ

**症状:**
実際の作業時間が見積もりと大きく異なる

**解決策:**
\```bash
「Task-003の見積もりが2時間でしたが、実際は5時間かかりました。

原因を分析してください：
1. タスクの複雑さを過小評価していたか
2. 想定外の問題が発生したか
3. 依存関係に漏れがあったか

今後の見積もり精度向上のための提案をしてください。」
\```

### Issue 5: AIの応答が一貫性を欠く

**症状:**
同じような質問でも毎回異なる答えが返ってくる

**解決策:**
\```bash
# .kiro構造を明示的に参照させる
「この質問に答える際は、以下のドキュメントを参照してください：
- .kiro/specs/requirements.md
- .kiro/specs/design.md
- .kiro/steering/tech.md

これらのドキュメントに基づいて、一貫した回答をしてください。」

# または、CLAUDE.mdにプロジェクト固有のガイドラインを記載
\```
```

### 継続的改善

```markdown
## Continuous Improvement

### フィードバックループの確立

\```bash
# 週次レビュー
「今週のClaude Code活用状況をレビューしてください。

分析項目:
1. 生成されたコードの品質
2. 見積もり精度
3. ドキュメント更新の頻度
4. レビュー指摘事項の傾向

改善提案を含めてレポートしてください。」
\```

### プロンプトライブラリの構築

\```markdown
# .claude/prompts/ディレクトリ
.claude/
├── prompts/
│   ├── requirements/
│   │   ├── create-user-story.md
│   │   ├── add-acceptance-criteria.md
│   │   └── review-requirements.md
│   ├── design/
│   │   ├── create-architecture.md
│   │   ├── add-component-design.md
│   │   └── review-design.md
│   └── implementation/
│       ├── create-task.md
│       ├── implement-api.md
│       └── create-tests.md
\```

### ベストプラクティスの共有

\```bash
# チーム内でのベストプラクティス共有
「今週の開発で見つけたClaude Code活用のベストプラクティスを
ドキュメント化してください。

形式:
- パターン名
- 使用場面
- プロンプト例
- 期待される結果
- 注意点

.kiro/docs/best-practices.mdに追加してください。」
\```
```

## まとめ

### スペック駆動開発 × AI の価値

```text
従来の開発:
❌ ドキュメントの作成・更新が負担
❌ 要件と実装の乖離
❌ コードレビューに時間がかかる
❌ 新メンバーのオンボーディングが困難

.kiro + Claude Code:
✅ ドキュメント生成の自動化
✅ 要件・設計・実装の一貫性
✅ AIによる自動レビュー
✅ いつでも最新のドキュメント
✅ 新メンバーもすぐに貢献可能
```

### 次のステップ

1. **.kiro構造のセットアップ**
   - [.kiroディレクトリの基礎](./01-steering-basics.md)を参照

2. **要件定義の開始**
   - [requirements.mdの作成方法](./02-requirements-spec.md)を参照

3. **設計仕様の作成**
   - [design.mdの作成方法](./03-design-spec.md)を参照

4. **タスク管理の実践**
   - [tasks.mdの活用方法](./04-tasks-spec.md)を参照

5. **チーム全体への展開**
   - 本ドキュメント（AIワークフロー）を参考に、チーム開発に適用

### 成功のポイント

```markdown
## Success Factors

### 1. 明確な責任分離
- AI: ドキュメント生成、コード生成、レビュー支援
- Human: ビジネス判断、最終決定、品質保証

### 2. 継続的なフィードバック
- AIの提案を鵜呑みにしない
- 常にレビューと修正のサイクルを回す

### 3. ドキュメントファースト
- 実装前に必ずドキュメントを整備
- トレーサビリティを維持

### 4. チーム全体での活用
- 個人だけでなく、チーム全体で.kiroを活用
- 標準化されたプロセスで開発効率向上

### 5. 継続的改善
- 定期的にプロセスを見直し
- ベストプラクティスを蓄積・共有
```

---

**関連ドキュメント:**
- [.kiroディレクトリの基礎](./01-steering-basics.md)
- [要件定義の作成](./02-requirements-spec.md)
- [設計仕様の作成](./03-design-spec.md)
- [タスク管理の活用](./04-tasks-spec.md)
- [06-development-process](../06-development-process/)
- [07-team-workflow](../07-team-workflow/)

**タグ:** #spec-driven #ai-workflow #claude-code #collaboration #best-practices #continuous-improvement #kiro
