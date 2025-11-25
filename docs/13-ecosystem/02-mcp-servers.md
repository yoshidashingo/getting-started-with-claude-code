# MCPサーバー活用ガイド

このドキュメントでは、Claude Codeで利用できる人気のMCPサーバーとその活用方法を詳しく解説します。実践的な設定例とユースケースを通じて、開発効率を大幅に向上させる方法を学びましょう。

## 目次

1. [人気MCPサーバー一覧](#人気mcpサーバー一覧)
2. [カテゴリ別サーバー](#カテゴリ別サーバー)
3. [詳細解説と設定例](#詳細解説と設定例)
4. [MCPリソースの活用](#mcpリソースの活用)
5. [MCPプロンプトの使用](#mcpプロンプトの使用)
6. [パフォーマンス最適化](#パフォーマンス最適化)
7. [サーバーの組み合わせ例](#サーバーの組み合わせ例)

## 人気MCPサーバー一覧

2025年時点で、MCPエコシステムは急速に成長しており、6,470以上のサーバーが利用可能です。以下は最も人気のあるMCPサーバーのトップ10です：

| サーバー | 用途 | トランスポート | 難易度 |
|---------|------|---------------|--------|
| GitHub | リポジトリ・issue・PR管理 | HTTP | 初級 |
| PostgreSQL | データベースクエリ | Stdio | 中級 |
| Sentry | エラー監視・分析 | HTTP | 中級 |
| Notion | ドキュメント管理 | HTTP | 初級 |
| Figma | デザイン連携 | HTTP | 中級 |
| Slack | チームコミュニケーション | Stdio | 中級 |
| Playwright | ブラウザ自動化 | Stdio | 上級 |
| MySQL | データベースクエリ | Stdio | 中級 |
| Puppeteer | ブラウザ自動化 | Stdio | 上級 |
| Sequential Thinking | 問題解決支援 | Stdio | 中級 |

### サーバーディレクトリ

より多くのMCPサーバーを探すには、以下の公式ディレクトリを参照してください：

- **[PulseMCP](https://www.pulsemcp.com/servers)** - 6,470以上のサーバーを日次更新
- **[MCP Server Finder](https://www.mcpserverfinder.com/)** - 詳細な実装ガイド付き
- **[Awesome MCP Servers](https://github.com/punkpeye/awesome-mcp-servers)** - コミュニティキュレーション
- **[MCP Market](https://mcpmarket.com/server)** - カテゴリ別分類
- **[公式リポジトリ](https://github.com/modelcontextprotocol/servers)** - Anthropic提供

## カテゴリ別サーバー

### 開発ツール

- **GitHub** - リポジトリ管理、issue/PR操作
- **Git** - バージョン管理
- **Docker** - コンテナ管理
- **Kubernetes** - オーケストレーション
- **Sequential Thinking** - 構造化された問題解決

### データベース

- **PostgreSQL** - リレーショナルDB
- **MySQL** - リレーショナルDB
- **Redis** - インメモリデータストア
- **MongoDB** - NoSQLデータベース
- **Aurora MySQL** - AWS管理データベース

### モニタリング・オブザーバビリティ

- **Sentry** - エラー追跡と分析
- **Dynatrace** - リアルタイム監視
- **Opik-MCP** - LLM観測性
- **CloudWatch** - AWSモニタリング

### コミュニケーション

- **Slack** - チームメッセージング
- **Discord** - コミュニティチャット
- **Email** - メール統合

### デザイン・コンテンツ

- **Figma** - UIデザイン連携
- **Notion** - ドキュメント管理
- **Google Drive** - ファイルストレージ

### ブラウザ自動化・テスト

- **Playwright** - クロスブラウザ自動化
- **Puppeteer** - Chrome自動化
- **Selenium** - ブラウザテスト

### API開発

- **Apidog** - API仕様管理
- **Postman** - APIテスト
- **GraphQL** - API統合

## 詳細解説と設定例

### GitHub MCPサーバー

#### 概要

GitHub MCPサーバーは、Claude CodeをGitHubのREST APIに接続し、リポジトリ、issue、プルリクエスト、ワークフローとシームレスに対話できるようにします。

**主な機能:**
- リポジトリ情報の取得
- Issueの作成・更新・検索
- プルリクエストの管理
- CI/CDワークフローのトリガー
- コミット履歴の分析

#### インストール方法

```bash
# Claude Code CLI
claude mcp add --transport http github https://api.githubcopilot.com/mcp/

# 環境変数を設定（必要に応じて）
export GITHUB_CLIENT_ID="your-client-id"
export GITHUB_CLIENT_SECRET="your-client-secret"
```

#### 設定例

**プロジェクトスコープ設定（`.mcp.json`）:**

```json
{
  "mcpServers": {
    "github": {
      "description": "GitHubリポジトリ管理用。issueとPRの作成・更新に使用。",
      "transport": "http",
      "endpoint": "https://api.githubcopilot.com/mcp/",
      "auth": {
        "type": "oauth2",
        "clientId": "${GITHUB_CLIENT_ID}",
        "clientSecret": "${GITHUB_CLIENT_SECRET}",
        "authorizationUrl": "https://github.com/login/oauth/authorize",
        "tokenUrl": "https://github.com/login/oauth/access_token",
        "scopes": ["repo", "issues", "pull_requests"]
      }
    }
  }
}
```

#### 基本的な使用例

```
あなた: このリポジトリの未解決issueを優先度が高い順に表示して

Claude: [GitHub MCPサーバーに問い合わせ]
高優先度の未解決issue:

1. #156: 本番環境のメモリリーク問題
   - ラベル: critical, bug
   - 担当: @tech-lead
   - 作成日: 2日前

2. #145: ユーザーログイン失敗（iOS）
   - ラベル: high-priority, mobile
   - 担当: @mobile-dev
   - 作成日: 4日前

3. #142: API応答時間が遅い
   - ラベル: performance, high-priority
   - 担当: 未割り当て
   - 作成日: 1週間前

あなた: issue #156の詳細とスレッドを確認して

Claude: [詳細情報を取得]

Issue #156: 本番環境のメモリリーク問題

作成者: @devops-team
作成日: 2025-01-21 09:30

説明:
本番環境のNodeアプリケーションでメモリ使用量が
24時間で500MBから2GBまで増加。サーバー再起動で一時的に解決。

コメント（3件）:
- @tech-lead: ヒーププロファイルを取得中
- @senior-dev: EventEmitterのリスナー解除漏れが疑わしい
- @devops-team: 監視アラートの閾値を調整しました

関連ファイル:
- src/services/websocket-handler.js
- src/utils/event-manager.js
```

#### 実践的なユースケース

**1. 自動issue作成:**

```
あなた: Sentryでエラーが急増しているので、GitHubにissueを作成して

Claude: [Sentryからエラー情報を取得し、GitHubにissue作成]

Issue #157を作成しました:

タイトル: TypeError急増: UserService.getUser
ラベル: bug, high-priority
担当者: @backend-team

本文:
過去1時間でTypeErrorが45件発生しています。

エラー詳細:
- TypeError: Cannot read property 'id' of undefined
- 発生場所: UserService.js:42
- 影響ユーザー: 12人
- Sentryリンク: https://sentry.io/issues/...

[スタックトレース、提案される修正案を含む]
```

**2. PRレビュー支援:**

```
あなた: PR #234のコード変更を分析してレビューコメントを追加して

Claude: [PRの差分を取得し分析]

PR #234を分析しました:

変更サマリー:
- 3ファイル変更
- +127 -45行
- 主な変更: 認証ロジックのリファクタリング

懸念点を3件コメントしました:

1. auth-service.ts:45 - エラーハンドリングの欠落
2. user-controller.ts:89 - SQLインジェクションの脆弱性
3. tests/auth.test.ts - エッジケースのテスト不足

承認前に上記の修正を推奨します。
```

---

### Sentry MCPサーバー

#### 概要

Sentry MCPサーバーは、Sentryのエラー追跡機能をClaude Codeに統合し、エラーログの分析、問題調査、デバッグを支援します。

**主な機能:**
- エラーイベントの取得と分析
- スタックトレースの解析
- トレンド分析
- 影響範囲の評価
- 修正提案の生成

#### インストール方法

```bash
# 環境変数を設定
export SENTRY_TOKEN="your-sentry-auth-token"
export SENTRY_ORG="your-organization"
export SENTRY_PROJECT="your-project"

# Stdio版（ローカル開発用）
claude mcp add --transport stdio sentry npx -y @getsentry/sentry-mcp-stdio

# HTTP版（推奨）
claude mcp add --transport http sentry https://sentry.io/api/mcp/
```

#### 設定例

**Stdio設定（`.mcp.json`）:**

```json
{
  "mcpServers": {
    "sentry": {
      "description": "本番環境のエラー監視とデバッグ支援",
      "transport": "stdio",
      "command": "npx",
      "args": ["-y", "@getsentry/sentry-mcp-stdio"],
      "env": {
        "SENTRY_TOKEN": "${SENTRY_TOKEN}",
        "SENTRY_ORG": "${SENTRY_ORG}",
        "SENTRY_PROJECT": "${SENTRY_PROJECT}"
      }
    }
  }
}
```

**HTTP設定（リモートホスト版）:**

```json
{
  "mcpServers": {
    "sentry": {
      "description": "Sentry MCP（リモートホスト版）",
      "transport": "http",
      "endpoint": "https://sentry.io/api/mcp/",
      "auth": {
        "type": "bearer",
        "token": "${SENTRY_TOKEN}"
      }
    }
  }
}
```

#### 基本的な使用例

```
あなた: 過去24時間の重大エラーをSentryから取得して

Claude: [Sentry MCPサーバーに問い合わせ]

過去24時間の重大エラー概要:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
総エラー数: 347件
ユニークエラー: 12種類
影響ユーザー: 89人
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

トップ3エラー:

1. TypeError: Cannot read property 'id' of undefined
   - 発生回数: 127件
   - 影響ユーザー: 34人
   - ファイル: UserService.js:42
   - 最終発生: 3分前

2. UnhandledPromiseRejectionWarning
   - 発生回数: 89件
   - 影響ユーザー: 28人
   - ファイル: database-connector.js:156
   - 最終発生: 12分前

3. ValidationError: Invalid email format
   - 発生回数: 67件
   - 影響ユーザー: 45人
   - ファイル: auth-validator.js:23
   - 最終発生: 1時間前

あなた: 最初のTypeErrorの詳細と修正案を教えて

Claude: [詳細情報を取得し分析]

TypeError詳細分析:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

エラーメッセージ:
TypeError: Cannot read property 'id' of undefined

発生場所:
UserService.js:42
  at UserService.getUser()
  at UserController.show()
  at express.Router.get()

問題のコード:
```javascript
async getUser(userId) {
  const user = await db.users.findOne(userId);
  return user.id; // ← ここでエラー（userがundefined）
}
```

根本原因:
- データベースクエリがnullを返す場合の処理が欠如
- 存在しないユーザーIDへのアクセス

推奨される修正:
```javascript
async getUser(userId) {
  const user = await db.users.findOne(userId);

  if (!user) {
    throw new UserNotFoundError(`User ${userId} not found`);
  }

  return user.id;
}
```

追加の改善提案:
1. 入力バリデーションの追加
2. エラーハンドリングミドルウェアの実装
3. ユニットテストの追加
```

#### 実践的なユースケース

**1. エラートレンド分析:**

```
あなた: 過去1週間のエラートレンドを分析して、増加傾向のエラーを特定して

Claude: [時系列データを取得し分析]

エラートレンド分析（過去7日間）:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📈 増加傾向（要注意）:

1. DatabaseConnectionError
   - 1週間前: 12件/日
   - 現在: 89件/日
   - 増加率: +641%
   - 推定原因: コネクションプール枯渇

2. SlowApiResponse (>5s)
   - 1週間前: 23件/日
   - 現在: 67件/日
   - 増加率: +191%
   - 推定原因: データベースクエリの非効率化

📉 減少傾向（改善）:

1. AuthenticationError
   - 1週間前: 145件/日
   - 現在: 34件/日
   - 減少率: -77%
   - 理由: 認証ロジック改善（PR #234）

推奨アクション:
1. DatabaseConnectionErrorの緊急調査
2. データベースクエリの最適化
3. コネクションプール設定の見直し
```

**2. ユーザー影響範囲の評価:**

```
あなた: 特定のユーザーが報告している「ページが読み込めない」問題を
       Sentryのエラーログから調査して

Claude: [ユーザーセッションとエラーを相関分析]

ユーザーimpact分析:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

影響ユーザー: 23人（過去1時間）
共通点:
- 全員iOS Safari使用
- 全員「プロフィール編集」ページでエラー
- バージョン: iOS 17.2

関連エラー:
ChunkLoadError: Loading chunk 3 failed
  at profile-editor.chunk.js

根本原因:
最新デプロイ（30分前）でJavaScriptチャンクの
Content Security Policyヘッダー設定が不正

影響範囲: モバイルユーザーの12%

即時対応推奨:
1. デプロイをロールバック
2. CSPヘッダー設定を修正
3. モバイル環境でのE2Eテスト追加
```

---

### PostgreSQL MCPサーバー

#### 概要

PostgreSQL MCPサーバーは、自然言語でデータベースに問い合わせを行い、スキーマ情報の取得、クエリ実行、データ分析を可能にします。

**主な機能:**
- スキーマ検査
- SQLクエリ実行（読み取り専用推奨）
- データ分析とレポート生成
- クエリ最適化の提案
- ERD生成

#### インストール方法

```bash
# 環境変数を設定
export DATABASE_URL="postgresql://user:password@localhost:5432/mydb"

# Stdioサーバーを追加
claude mcp add --transport stdio postgres npx -y @modelcontextprotocol/server-postgres
```

#### 設定例

**読み取り専用設定（推奨）:**

```json
{
  "mcpServers": {
    "postgres": {
      "description": "本番DBへの読み取り専用アクセス",
      "transport": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "POSTGRES_URL": "${DATABASE_URL}",
        "POSTGRES_READ_ONLY": "true"
      }
    }
  }
}
```

**開発環境用設定（書き込み許可）:**

```json
{
  "mcpServers": {
    "postgres-dev": {
      "description": "開発DB（書き込み可）",
      "transport": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "POSTGRES_URL": "${DEV_DATABASE_URL}",
        "POSTGRES_READ_ONLY": "false"
      }
    }
  }
}
```

#### 基本的な使用例

```
あなた: usersテーブルのスキーマを教えて

Claude: [PostgreSQL MCPサーバーに問い合わせ]

usersテーブルスキーマ:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

テーブル: public.users

カラム:
┌──────────────┬─────────────┬─────────┬────────────┐
│ カラム名      │ データ型     │ NULL可  │ デフォルト  │
├──────────────┼─────────────┼─────────┼────────────┤
│ id           │ SERIAL      │ NO      │ 自動採番    │
│ email        │ VARCHAR(255)│ NO      │ -          │
│ name         │ VARCHAR(100)│ NO      │ -          │
│ role         │ VARCHAR(50) │ NO      │ 'user'     │
│ created_at   │ TIMESTAMP   │ NO      │ NOW()      │
│ updated_at   │ TIMESTAMP   │ NO      │ NOW()      │
│ last_login   │ TIMESTAMP   │ YES     │ NULL       │
│ is_active    │ BOOLEAN     │ NO      │ true       │
└──────────────┴─────────────┴─────────┴────────────┘

インデックス:
- PRIMARY KEY: id
- UNIQUE: email
- INDEX: role, created_at

外部キー:
- user_profiles.user_id → users.id
- orders.user_id → users.id

あなた: 過去30日間で登録したアクティブユーザー数を教えて

Claude: [クエリを実行]

実行クエリ:
```sql
SELECT
  COUNT(*) as active_users,
  COUNT(*) FILTER (WHERE last_login >= NOW() - INTERVAL '7 days') as recently_active
FROM users
WHERE created_at >= NOW() - INTERVAL '30 days'
  AND is_active = true;
```

結果:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
過去30日間の新規登録: 234人
  - アクティブユーザー: 234人
  - 最近ログイン（7日以内）: 189人（81%）
  - 休眠ユーザー: 45人（19%）

傾向分析:
- 平均: 7.8人/日
- 最大: 15人/日（2025-01-15）
- 最小: 3人/日（2025-01-07）
```

#### 実践的なユースケース

**1. データ分析とレポート生成:**

```
あなた: 月次売上レポートを生成して。カテゴリ別と地域別で集計

Claude: [複数クエリを実行し分析]

月次売上レポート（2025年1月）:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

総売上: ¥45,678,900
注文数: 1,234件
平均単価: ¥37,021

カテゴリ別売上:
┌─────────────┬──────────────┬────────┬─────────┐
│ カテゴリ     │ 売上         │ 注文数  │ 構成比   │
├─────────────┼──────────────┼────────┼─────────┤
│ エレクトロ   │ ¥18,234,500  │ 345    │ 39.9%   │
│ ファッション │ ¥12,456,700  │ 523    │ 27.3%   │
│ 食品        │ ¥8,765,400   │ 234    │ 19.2%   │
│ 書籍        │ ¥6,222,300   │ 132    │ 13.6%   │
└─────────────┴──────────────┴────────┴─────────┘

地域別売上（トップ5）:
1. 東京都: ¥15,234,600（33.4%）
2. 大阪府: ¥8,456,200（18.5%）
3. 神奈川県: ¥7,123,400（15.6%）
4. 愛知県: ¥5,678,900（12.4%）
5. 福岡県: ¥3,987,600（8.7%）

前月比較:
- 売上: +12.3% ↑
- 注文数: +8.7% ↑
- 平均単価: +3.3% ↑
```

**2. パフォーマンス分析:**

```
あなた: 遅いクエリを特定して最適化案を提案して

Claude: [pg_stat_statementsを分析]

スロークエリ分析:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

問題クエリ #1:
```sql
SELECT * FROM orders o
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id
WHERE o.user_id = $1;
```

パフォーマンス:
- 平均実行時間: 2,345ms
- 実行回数: 1,234回/時間
- 総時間: 48分/時間

問題点:
1. SELECT * で不要なカラムも取得
2. order_items.order_idにインデックスなし
3. N+1問題の可能性

最適化案:
```sql
-- 1. 必要なカラムのみ選択
-- 2. インデックス追加
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- 3. 最適化されたクエリ
SELECT
  o.id, o.total, o.created_at,
  oi.quantity, oi.price,
  p.name, p.category
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id
WHERE o.user_id = $1;
```

期待される改善:
- 実行時間: 2,345ms → 45ms（98%改善）
- 時間当たり総実行時間: 48分 → 0.9分
```

---

### MySQL MCPサーバー

#### 概要

MySQL MCPサーバーは、MySQLデータベースへのアクセスを提供し、PostgreSQLサーバーと同様の機能を提供します。

**主な機能:**
- スキーマ検査
- 読み取り専用クエリ実行
- データ分析
- SSHトンネル対応

#### インストール方法

```bash
# 環境変数を設定
export MYSQL_HOST="127.0.0.1"
export MYSQL_PORT="3306"
export MYSQL_USER="root"
export MYSQL_PASS="your_password"
export MYSQL_DB="your_database"

# Stdioサーバーを追加
claude mcp add --transport stdio mysql npx -y @benborla29/mcp-server-mysql
```

#### 設定例

**読み取り専用設定（`.mcp.json`）:**

```json
{
  "mcpServers": {
    "mysql": {
      "description": "本番MySQL（読み取り専用）",
      "transport": "stdio",
      "command": "npx",
      "args": ["-y", "@benborla29/mcp-server-mysql"],
      "env": {
        "MYSQL_HOST": "${MYSQL_HOST}",
        "MYSQL_PORT": "${MYSQL_PORT}",
        "MYSQL_USER": "${MYSQL_USER}",
        "MYSQL_PASS": "${MYSQL_PASS}",
        "MYSQL_DB": "${MYSQL_DB}",
        "ALLOW_INSERT_OPERATION": "false",
        "ALLOW_UPDATE_OPERATION": "false",
        "ALLOW_DELETE_OPERATION": "false"
      }
    }
  }
}
```

**AWS Aurora MySQL設定:**

```json
{
  "mcpServers": {
    "aurora-mysql": {
      "description": "AWS Aurora MySQL",
      "transport": "stdio",
      "command": "uvx",
      "args": [
        "awslabs.mysql-mcp-server@latest",
        "--hostname", "${AURORA_HOSTNAME}",
        "--secret_arn", "${AURORA_SECRET_ARN}",
        "--database", "${AURORA_DATABASE}",
        "--region", "${AWS_REGION}",
        "--readonly", "True"
      ],
      "env": {
        "AWS_PROFILE": "${AWS_PROFILE}",
        "AWS_REGION": "${AWS_REGION}"
      }
    }
  }
}
```

---

### Notion MCPサーバー

#### 概要

Notion MCPサーバーは、NotionワークスペースへのAIアクセスを提供し、ページの作成・更新・検索を可能にします。

**主な機能:**
- ページの作成・更新・削除
- データベースクエリ
- コンテンツ検索
- ドキュメント生成

#### インストール方法

```bash
# Claude Code CLI（ホスト版）
claude mcp add --transport http notion https://mcp.notion.com/mcp

# または、オープンソース版
export NOTION_TOKEN="ntn_****"
claude mcp add --transport stdio notion npx -y @notionhq/notion-mcp-server
```

#### 認証設定

1. **Notion統合の作成:**
   - https://www.notion.so/profile/integrations にアクセス
   - 新しい内部統合を作成
   - 必要な権限を付与（読み取り/書き込み）

2. **ページへのアクセス許可:**
   - 対象ページの「...」メニューから「接続」を選択
   - 作成した統合を選択

#### 設定例

**ホスト版設定（`.mcp.json`）:**

```json
{
  "mcpServers": {
    "notion": {
      "description": "Notionワークスペース統合",
      "transport": "http",
      "endpoint": "https://mcp.notion.com/mcp",
      "auth": {
        "type": "oauth2",
        "flow": "one-click"
      }
    }
  }
}
```

**オープンソース版設定:**

```json
{
  "mcpServers": {
    "notion": {
      "description": "Notion統合（トークンベース）",
      "transport": "stdio",
      "command": "npx",
      "args": ["-y", "@notionhq/notion-mcp-server"],
      "env": {
        "NOTION_TOKEN": "${NOTION_TOKEN}"
      }
    }
  }
}
```

#### 基本的な使用例

```
あなた: 今週のタスクをNotionから取得して

Claude: [Notion MCPサーバーに問い合わせ]

今週のタスク（2025-01-20週）:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

完了済み（5/12）:
✅ APIドキュメント更新
✅ データベース移行スクリプト作成
✅ コードレビュー（PR #234-237）
✅ 週次ミーティング資料作成
✅ バグ修正（issue #156）

進行中（3/12）:
🔄 新機能実装: ユーザープロフィール編集
🔄 E2Eテスト追加
🔄 パフォーマンス最適化

未着手（4/12）:
📋 セキュリティ監査対応
📋 リファクタリング: 認証モジュール
📋 ドキュメント翻訳（英→日）
📋 月次レポート作成

進捗率: 42%（5/12完了）
期限内完了見込み: 要注意（3タスク遅延リスク）

あなた: 「セキュリティ監査対応」タスクの詳細をNotionで確認して

Claude: [タスク詳細を取得]

タスク: セキュリティ監査対応
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

優先度: 高
期限: 2025-01-24（あと3日）
担当者: @security-team

詳細:
外部セキュリティ監査で指摘された以下の項目に対応:

必須項目（3件）:
1. ❌ CSRF保護の実装（API エンドポイント）
2. ❌ パスワードポリシーの強化
3. ❌ セッションタイムアウトの設定

推奨項目（5件）:
1. ⚠️ HTTPヘッダーのセキュリティ強化
2. ⚠️ 入力バリデーションの改善
3. ⚠️ ログ出力の機密情報マスキング
4. ⚠️ 依存パッケージの脆弱性対応
5. ⚠️ APIレート制限の実装

関連ドキュメント:
- セキュリティ監査レポート.pdf
- 対応チェックリスト

ブロッカー:
なし
```

#### 実践的なユースケース

**1. ドキュメント自動生成:**

```
あなた: 今日実装した新機能のドキュメントをNotionに作成して

Claude: [コード変更を分析し、Notionページを作成]

Notionページを作成しました:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ページタイトル: ユーザープロフィール編集機能

URL: https://notion.so/workspace/user-profile-edit-12345

内容:
# ユーザープロフィール編集機能

## 概要
ユーザーが自分のプロフィール情報を編集できる機能を実装しました。

## 実装内容

### API エンドポイント
- `PUT /api/users/:id/profile` - プロフィール更新

### フロントエンド
- ProfileEditForm コンポーネント
- バリデーション（リアルタイム）
- プレビュー機能

### データベース
- `user_profiles` テーブル更新
- インデックス追加: `(user_id, updated_at)`

## 使用方法
[スクリーンショット付きの使用手順]

## テスト
- ユニットテスト: 15件追加
- E2Eテスト: 3シナリオ追加
- カバレッジ: 94%

## デプロイメモ
- マイグレーション実行必須
- 環境変数追加: `MAX_PROFILE_IMAGE_SIZE`

ドキュメントを「開発」データベースに追加しました。
```

**2. ミーティング議事録の自動作成:**

```
あなた: 今日のスタンドアップミーティングの議事録をNotionに作成して。
       議題は各メンバーの進捗と今日の予定

Claude: [会話履歴を整理しNotionページを作成]

議事録を作成しました:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ページタイトル: デイリースタンドアップ - 2025/01/20

URL: https://notion.so/workspace/standup-20250120

内容構成:
1. 基本情報
   - 日時: 2025-01-20 10:00-10:15
   - 参加者: @alice, @bob, @charlie, @diana
   - ファシリテーター: @alice

2. 各メンバー進捗

   @alice (フロントエンド)
   昨日: プロフィール編集UI実装完了
   今日: E2Eテスト追加、デザインレビュー
   ブロッカー: なし

   @bob (バックエンド)
   昨日: API実装、ドキュメント作成
   今日: セキュリティ監査対応、パフォーマンステスト
   ブロッカー: なし

   @charlie (DevOps)
   昨日: CI/CD パイプライン改善
   今日: 本番デプロイ準備、監視設定
   ブロッカー: なし

   @diana (QA)
   昨日: テスト計画作成、スモークテスト実行
   今日: 回帰テスト、バグレポート作成
   ブロッカー: テスト環境のデータベース接続不安定

3. アクションアイテム
   - [ ] @charlie: テスト環境DB調査（優先度: 高）
   - [ ] @alice: デザインレビューMTG設定
   - [ ] @bob: セキュリティチェックリスト確認

4. 次回
   - 日時: 2025-01-21 10:00

議事録を「ミーティング」データベースに追加し、
関連メンバーにメンション通知を送信しました。
```

---

### Figma MCPサーバー

#### 概要

Figma MCPサーバーは、FigmaデザインファイルとClaude Codeを連携し、デザインからコードへの変換を支援します。

**主な機能:**
- デザインファイルの取得
- コンポーネント情報の抽出
- スタイル情報の取得
- アセットのエクスポート
- デザイントークンの生成

#### インストール方法

**デスクトップ版（ローカル）:**

Figmaデスクトップアプリが必要です。アプリ起動時に自動的にMCPサーバーが起動します。

```bash
# Claude Code設定
claude mcp add --transport http figma-desktop http://127.0.0.1:3845/mcp
```

**リモート版（推奨）:**

```bash
# Figmaアカウントでログイン必要
claude mcp add --transport http figma https://mcp.figma.com/mcp
```

#### 設定例

**デスクトップ版設定（`.mcp.json`）:**

```json
{
  "mcpServers": {
    "figma-desktop": {
      "description": "Figmaデスクトップ統合",
      "transport": "http",
      "endpoint": "http://127.0.0.1:3845/mcp"
    }
  }
}
```

**リモート版設定:**

```json
{
  "mcpServers": {
    "figma": {
      "description": "Figmaリモート統合",
      "transport": "http",
      "endpoint": "https://mcp.figma.com/mcp",
      "auth": {
        "type": "oauth2",
        "flow": "figma"
      }
    }
  }
}
```

#### 基本的な使用例

```
あなた: Figmaの最新デザインファイルからボタンコンポーネントの
       情報を取得して

Claude: [Figma MCPサーバーに問い合わせ]

ボタンコンポーネント情報:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ファイル名: Design System v2.0
コンポーネント: Button/Primary

バリアント:
1. Default
   - サイズ: 120px × 40px
   - 背景色: #3B82F6
   - テキスト色: #FFFFFF
   - フォント: Inter 14px Medium
   - 角丸: 8px
   - パディング: 12px 24px

2. Hover
   - 背景色: #2563EB
   - その他: Defaultと同じ

3. Disabled
   - 背景色: #E5E7EB
   - テキスト色: #9CA3AF
   - opacity: 0.6

4. Loading
   - スピナーアニメーション
   - テキスト: "読み込み中..."

あなた: このボタンのReactコンポーネントを生成して

Claude: [デザイン情報を基にコード生成]

Reactコンポーネントを生成しました:

```typescript
// Button.tsx
import React from 'react';
import styles from './Button.module.css';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  children,
  onClick,
}) => {
  const className = [
    styles.button,
    styles[variant],
    styles[size],
    disabled && styles.disabled,
    loading && styles.loading,
  ].filter(Boolean).join(' ');

  return (
    <button
      className={className}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? (
        <>
          <span className={styles.spinner} />
          <span>読み込み中...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};
```

```css
/* Button.module.css */
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.button.primary {
  background-color: #3B82F6;
  color: #FFFFFF;
}

.button.primary:hover:not(.disabled):not(.loading) {
  background-color: #2563EB;
}

.button.disabled {
  background-color: #E5E7EB;
  color: #9CA3AF;
  opacity: 0.6;
  cursor: not-allowed;
}

.button.medium {
  padding: 12px 24px;
  font-size: 14px;
  min-width: 120px;
  height: 40px;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #FFFFFF;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

コンポーネントは完全に型安全で、Figmaデザインと
100%一致しています。
```

#### 実践的なユースケース

**1. デザイントークン生成:**

```
あなた: Figmaのカラーパレットとタイポグラフィをデザイントークンとして出力して

Claude: [Figmaスタイル情報を取得]

デザイントークンを生成しました:

```typescript
// design-tokens.ts
export const colors = {
  // Primary
  primary: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6', // Main
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
  },

  // Neutral
  neutral: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },

  // Semantic
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
} as const;

export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['Fira Code', 'monospace'],
  },

  fontSize: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
    '4xl': '36px',
  },

  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

export const spacing = {
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
} as const;

export const borderRadius = {
  none: '0px',
  sm: '4px',
  base: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px',
} as const;
```

これらのトークンをTailwind CSS、styled-components、
CSS Modulesなどで使用できます。
```

---

### Slack MCPサーバー

#### 概要

Slack MCPサーバーは、SlackワークスペースとClaude Codeを統合し、メッセージの送受信、チャンネル管理、通知の自動化を可能にします。

**主な機能:**
- メッセージの送信・取得
- チャンネル情報の取得
- ダイレクトメッセージ
- スレッド返信
- ファイルアップロード

#### インストール方法

**Bot Token方式（推奨）:**

1. Slack Appを作成: https://api.slack.com/apps
2. Bot Token Scopesを設定
3. ワークスペースにインストール

```bash
# 環境変数を設定
export SLACK_BOT_TOKEN="xoxb-your-bot-token"
export SLACK_TEAM_ID="T01234567"

# Stdioサーバーを追加
claude mcp add --transport stdio slack npx -y @modelcontextprotocol/server-slack
```

**User Token方式:**

```bash
export SLACK_MCP_XOXP_TOKEN="xoxp-your-user-token"
claude mcp add --transport stdio slack npx -y slack-mcp-server@latest
```

#### 設定例

**Bot Token設定（`.mcp.json`）:**

```json
{
  "mcpServers": {
    "slack": {
      "description": "チーム通知とコミュニケーション",
      "transport": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-slack"],
      "env": {
        "SLACK_BOT_TOKEN": "${SLACK_BOT_TOKEN}",
        "SLACK_TEAM_ID": "${SLACK_TEAM_ID}",
        "SLACK_CHANNEL_IDS": "C01234567,C76543210"
      }
    }
  }
}
```

#### 基本的な使用例

```
あなた: #dev-teamチャンネルに「デプロイ完了」とメッセージを送って

Claude: [Slack MCPサーバー経由でメッセージ送信]

#dev-teamにメッセージを送信しました:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 デプロイ完了

本番環境へのデプロイが正常に完了しました。

バージョン: v2.3.1
デプロイ時刻: 2025-01-20 14:30:00
変更内容:
- プロフィール編集機能追加
- パフォーマンス改善
- バグ修正（3件）

リリースノート: https://github.com/org/repo/releases/v2.3.1
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

メッセージURL: https://workspace.slack.com/archives/C01234567/...

あなた: 過去1時間の#alertsチャンネルのメッセージを取得して

Claude: [チャンネル履歴を取得]

#alertsチャンネル（過去1時間）:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[14:25] Sentry Alert Bot
⚠️ エラー急増検知
TypeError: 45件（過去10分）
→ https://sentry.io/issues/...

[14:18] Datadog Monitor
📊 API応答時間: 警告
平均応答時間: 1,234ms (通常: 340ms)
エンドポイント: POST /api/users

[14:05] GitHub Actions
✅ CI/CD Pipeline 成功
ブランチ: main
コミット: abc1234

[13:50] PagerDuty
🔴 本番DB接続エラー
優先度: P1 - Critical
担当: @oncall-engineer

概要:
- 総メッセージ: 4件
- 要対応アラート: 2件（Sentry、PagerDuty）
- 情報のみ: 2件
```

#### 実践的なユースケース

**1. 自動レポート送信:**

```
あなた: 今日の作業サマリーをSlackの#daily-standupチャンネルに投稿して

Claude: [作業履歴を集計しSlackに投稿]

#daily-standupに投稿しました:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 デイリーサマリー - 2025/01/20 (@your-name)

✅ 完了タスク:
• プロフィール編集機能実装
  - フロントエンド: React + TypeScript
  - バックエンド: REST API
  - テスト: ユニット + E2E

• バグ修正
  - issue #156: メモリリーク問題
  - issue #142: API応答遅延

• コードレビュー
  - PR #234-237（4件レビュー完了）

🔄 進行中:
• パフォーマンス最適化
  - データベースクエリ改善中
  - 進捗: 60%

📅 明日の予定:
• セキュリティ監査対応
• E2Eテストカバレッジ向上
• リファクタリング: 認証モジュール

📊 統計:
• コミット数: 8件
• コード追加: +847行
• コード削除: -234行
• レビュー: 4件

🔗 リンク:
GitHub Activity: https://github.com/...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**2. インシデント通知:**

```
あなた: Sentryで検知したエラーをSlackの#incidentsチャンネルに
       詳細付きで通知して

Claude: [Sentryデータを取得しSlackに緊急通知]

#incidentsに緊急通知を送信しました:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚨 インシデント発生 - P1 Critical

エラー種別: TypeError
発生回数: 127件（過去1時間）
影響ユーザー: 34人
発生率: 12.3%（通常: 0.1%）

エラーメッセージ:
TypeError: Cannot read property 'id' of undefined

発生場所:
UserService.js:42
  at UserService.getUser()
  at UserController.show()

根本原因（推定）:
データベースクエリがnullを返すケースの
エラーハンドリング不足

影響範囲:
- 機能: ユーザープロフィール表示
- 環境: 本番
- プラットフォーム: 全環境

推奨対応:
1. 緊急修正パッチのデプロイ
2. エラーハンドリング追加
3. ユニットテスト補強

Sentryリンク: https://sentry.io/issues/...
GitHub Issue: 自動作成 #158

@oncall-engineer @tech-lead
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

また、GitHub issue #158も自動作成しました。
```

---

### Playwright MCPサーバー

#### 概要

Playwright MCPサーバーは、ブラウザ自動化機能を提供し、E2Eテスト、スクレイピング、UI検証を可能にします。Microsoft公式のクロスブラウザ対応ツールです。

**主な機能:**
- ブラウザ操作の自動化
- スクリーンショット取得
- JavaScript実行
- ネットワーク監視
- アクセシビリティツリーの活用

#### インストール方法

```bash
# Node.js 18以上が必要
claude mcp add --transport stdio playwright npx @playwright/mcp@latest
```

#### 設定例

**基本設定（`.mcp.json`）:**

```json
{
  "mcpServers": {
    "playwright": {
      "description": "ブラウザ自動化とE2Eテスト",
      "transport": "stdio",
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

**高度な設定（ヘッドレスモード無効）:**

```json
{
  "mcpServers": {
    "playwright-debug": {
      "description": "Playwright（デバッグモード）",
      "transport": "stdio",
      "command": "npx",
      "args": ["@playwright/mcp@latest"],
      "env": {
        "PLAYWRIGHT_HEADLESS": "false",
        "PLAYWRIGHT_SLOW_MO": "500"
      }
    }
  }
}
```

#### 基本的な使用例

```
あなた: 本番サイトのログインフローをテストして

Claude: [Playwright MCPサーバーでブラウザ操作]

ログインフローテストを実行しました:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

テスト結果: ✅ 成功

実行ステップ:
1. ✅ https://example.com にアクセス（203ms）
2. ✅ ログインページに遷移（156ms）
3. ✅ メールアドレス入力（45ms）
4. ✅ パスワード入力（38ms）
5. ✅ ログインボタンクリック（89ms）
6. ✅ ダッシュボード表示確認（312ms）
7. ✅ ユーザー名表示確認（23ms）

総実行時間: 866ms

スクリーンショット:
- login-page.png
- after-login.png

検証項目:
✅ ログインフォームが正しく表示される
✅ バリデーションエラーが適切に表示される
✅ ログイン成功後、ダッシュボードに遷移する
✅ セッションが正しく保持される

パフォーマンス:
- ページ読み込み: 203ms（目標: <500ms）✅
- ログイン処理: 89ms（目標: <200ms）✅
- 合計: 866ms（目標: <2000ms）✅

アクセシビリティ:
✅ フォームラベルが適切
✅ キーボードナビゲーション対応
✅ エラーメッセージがaria-liveで通知
⚠️ パスワード表示トグルボタンのaria-label欠如

推奨改善:
パスワード表示トグルボタンに
aria-label="パスワードを表示"を追加
```

#### 実践的なユースケース

**1. 視覚的回帰テスト:**

```
あなた: トップページの視覚的回帰テストを実行して、
       前回のスクリーンショットと比較して

Claude: [スクリーンショットを取得し比較]

視覚的回帰テスト結果:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

テスト対象: https://example.com
画面サイズ: 1920×1080（デスクトップ）

比較結果:
⚠️ 差異検出（3箇所）

差異詳細:

1. ヘッダーナビゲーション
   位置: (0, 0) - (1920, 80)
   差異率: 2.3%
   変更内容: ロゴサイズが5px大きくなった
   影響: 軽微

2. ヒーローセクション
   位置: (0, 80) - (1920, 600)
   差異率: 15.7%
   変更内容: 背景画像が変更された
   影響: 意図的な変更と思われる

3. フッター
   位置: (0, 2800) - (1920, 3000)
   差異率: 0.8%
   変更内容: コピーライト年が更新された
   影響: 正常

総合評価:
✅ 重大な視覚的回帰なし
⚠️ ヘッダーロゴサイズの意図しない変更を確認

スクリーンショット:
- current.png（現在）
- baseline.png（基準）
- diff.png（差分）

推奨アクション:
ヘッダーロゴのCSSを確認し、
意図した変更か確認してください。
```

**2. パフォーマンス監視:**

```
あなた: 主要ページのパフォーマンスを測定して、
       ボトルネックを特定して

Claude: [各ページを自動巡回し計測]

パフォーマンス監査結果:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

測定ページ: 5ページ
測定環境: Chrome 120, Slow 3G

結果サマリー:

ページ                  | FCP    | LCP    | TTI    | スコア
----------------------|--------|--------|--------|--------
トップページ            | 1.2s   | 2.1s   | 3.4s   | 78/100
商品一覧                | 2.8s   | 4.2s   | 5.9s   | 52/100 ⚠️
商品詳細                | 1.5s   | 2.5s   | 3.8s   | 71/100
カート                  | 0.9s   | 1.6s   | 2.3s   | 89/100
チェックアウト          | 1.1s   | 1.9s   | 3.1s   | 82/100

ボトルネック分析:

🔴 商品一覧ページ（最優先）:
問題:
1. 大量の画像が未最適化（合計: 15MB）
2. JavaScriptバンドルサイズが大きい（2.3MB）
3. APIレスポンスが遅い（2.1s）

推奨改善:
- 画像を次世代フォーマット（WebP）に変換
- 画像の遅延読み込み（Lazy Loading）
- コード分割とTree Shaking
- APIレスポンスのキャッシュ
- CDN配信の最適化

期待効果:
LCP: 4.2s → 1.8s（57%改善）
スコア: 52 → 85

⚠️ 商品詳細ページ:
- サードパーティスクリプトの最適化
- フォントの事前読み込み

詳細レポート: performance-report.html
```

---

### Puppeteer MCPサーバー

#### 概要

Puppeteer MCPサーバーは、Chrome/Chromiumブラウザの自動化に特化したツールです。Playwrightと似ていますが、Chrome専用で軽量です。

**主な機能:**
- Chrome自動化
- スクリーンショット・PDF生成
- スクレイピング
- フォーム自動入力
- パフォーマンス計測

#### インストール方法

```bash
claude mcp add --transport stdio puppeteer npx -y @modelcontextprotocol/server-puppeteer
```

#### 設定例

**基本設定（`.mcp.json`）:**

```json
{
  "mcpServers": {
    "puppeteer": {
      "description": "Chrome自動化とスクレイピング",
      "transport": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-puppeteer"]
    }
  }
}
```

**Docker環境用設定:**

```json
{
  "mcpServers": {
    "puppeteer-docker": {
      "description": "Puppeteer（Docker環境）",
      "transport": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-puppeteer"],
      "env": {
        "PUPPETEER_LAUNCH_OPTIONS": "{\"args\":[\"--no-sandbox\",\"--disable-setuid-sandbox\"]}",
        "ALLOW_DANGEROUS": "true"
      }
    }
  }
}
```

---

### Sequential Thinking MCPサーバー

#### 概要

Sequential Thinking MCPサーバーは、複雑な問題解決に構造化された思考プロセスを提供します。人間の認知パターンを模倣し、段階的な問題分析を支援します。

**主な機能:**
- 構造化された問題分析
- 段階的思考プロセス
- 反復的改善
- デバッグ支援
- アーキテクチャ設計支援

#### インストール方法

```bash
claude mcp add --transport stdio sequential-thinking npx -y @modelcontextprotocol/server-sequential-thinking
```

#### 設定例

```json
{
  "mcpServers": {
    "sequential-thinking": {
      "description": "構造化された問題解決支援",
      "transport": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
    }
  }
}
```

#### 使用例

```
あなた: この複雑なバグを段階的に分析して解決して

Claude: [Sequential Thinking MCPを使用]

段階的問題分析:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【フェーズ1: 問題の理解】
現象: ユーザーログイン後、稀にセッションが
      即座に切れる（発生率: 0.5%）

【フェーズ2: 情報収集】
- ログ分析: セッションIDが重複している
- 頻度: 1000リクエストに5件
- 環境: 本番環境のみ（開発環境では未発生）
- タイミング: 複数ユーザーの同時ログイン時

【フェーズ3: 仮説立案】
仮説1: セッションID生成の衝突
仮説2: Redis接続の競合
仮説3: タイムゾーン問題

【フェーズ4: 検証】
仮説1を検証:
- セッションID生成ロジックを確認
- ランダム性が不十分（Date.now()のみ使用）
- 同一ミリ秒内の複数リクエストで衝突

【フェーズ5: 根本原因特定】
✅ 根本原因: セッションID生成の衝突
セッションIDがDate.now()のみで生成されており、
同一ミリ秒内の複数リクエストで同じIDが生成される

【フェーズ6: 解決策の提案】
推奨修正:
- crypto.randomUUID()を使用
- または、Date.now() + crypto.randomBytes()

【フェーズ7: 実装・検証】
[修正コードを提示]

【フェーズ8: 再発防止】
追加対策:
- ユニットテストの追加
- セッションID重複検知の監視
- 本番環境での段階的ロールアウト
```

---

## MCPリソースの活用

MCPサーバーは、**リソース**と呼ばれる読み取り専用データを提供します。リソースは`@`メンション構文で参照できます。

### リソースとは

リソースは、サーバー側で管理されるデータソースで、以下のような情報を含みます：

- ドキュメント（Markdown、テキスト）
- 画像やファイル
- データベーススキーマ
- API仕様
- 設定ファイル

### @メンション構文

Claude Codeでリソースを参照する際は、`@`構文を使用します：

```
@mcp-server-name/resource-path
```

### 使用例

#### 1. Notionドキュメントの参照

```
あなた: @notion/project-guidelines/coding-standards を参考に
       このコードをレビューして

Claude: [Notionリソースを読み込みレビュー]

コーディング標準に基づくレビュー:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

参照ドキュメント:
@notion/project-guidelines/coding-standards

検出された問題:

1. ❌ 命名規則違反
   ファイル: userService.js
   標準: PascalCase（UserService.js）

2. ❌ コメント不足
   標準: 全publicメソッドにJSDoc必須

3. ⚠️ エラーハンドリング不十分
   標準: try-catchブロックとロギング必須

4. ✅ インデント: 2スペース（標準準拠）
5. ✅ セミコロン使用（標準準拠）

推奨修正を適用しますか？
```

#### 2. データベーススキーマの参照

```
あなた: @postgres/schema/users と @postgres/schema/orders を見て、
       ユーザーの注文履歴を取得するクエリを書いて

Claude: [スキーマリソースを読み込み]

スキーマ情報:
- @postgres/schema/users
  - 主キー: id
  - カラム: email, name, created_at

- @postgres/schema/orders
  - 主キー: id
  - 外部キー: user_id → users.id
  - カラム: total, status, created_at

最適化されたクエリ:

```sql
SELECT
  u.id,
  u.name,
  u.email,
  o.id as order_id,
  o.total,
  o.status,
  o.created_at as order_date
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.id = $1
ORDER BY o.created_at DESC
LIMIT 10;
```

このクエリは:
- インデックスを活用（user_id）
- LEFT JOINで注文がないユーザーも表示
- 最新10件の注文を取得
```

#### 3. Figmaデザインの参照

```
あなた: @figma/design-system/button-component を基に
       Reactコンポーネントを実装して

Claude: [Figmaリソースを読み込み]

参照デザイン: @figma/design-system/button-component

[デザイン情報に基づいてコンポーネント生成]
```

### リソースの一覧表示

```
あなた: 利用可能なリソースを一覧表示して

Claude: 設定されているMCPサーバーのリソース:

📁 notion
  - @notion/project-guidelines/coding-standards
  - @notion/project-guidelines/git-workflow
  - @notion/documentation/api-reference
  - @notion/meeting-notes/2025-01-20

📁 postgres
  - @postgres/schema/users
  - @postgres/schema/orders
  - @postgres/schema/products

📁 figma
  - @figma/design-system/button-component
  - @figma/design-system/input-component
  - @figma/design-system/color-palette

📁 github
  - @github/repo/README.md
  - @github/repo/.github/CONTRIBUTING.md
```

### リソースのベストプラクティス

1. **明示的な参照**
   ```
   ✅ @notion/coding-standards を参考に
   ❌ Notionのコーディング標準を参考に（曖昧）
   ```

2. **複数リソースの組み合わせ**
   ```
   @notion/guidelines と @github/README を統合して
   新しいドキュメントを作成して
   ```

3. **リソースの更新確認**
   ```
   @notion/project-guidelines が最新か確認して
   ```

---

## MCPプロンプトの使用

MCPプロンプトは、スラッシュコマンドとして呼び出せる再利用可能なテンプレートです。

### プロンプトとは

プロンプトは、事前定義された指示テンプレートで、一貫した動作を保証します：

- コードレビューテンプレート
- ドキュメント生成テンプレート
- デバッグワークフロー
- テスト生成テンプレート

### スラッシュコマンド構文

```
/mcp.server-name.prompt-name [引数...]
```

または、Claude Codeの自動補完を使用：

```
/mcp [TAB]  # プロンプト一覧を表示
```

### 実装例

#### 1. コードレビュープロンプト

```
あなた: /mcp.code-review.security user-service.ts

Claude: [セキュリティレビュープロンプトを実行]

セキュリティコードレビュー:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ファイル: user-service.ts

🔴 重大な問題（3件）:

1. SQLインジェクションの脆弱性
   行: 45
   コード: `SELECT * FROM users WHERE id = ${userId}`

   修正案:
   ```typescript
   const query = 'SELECT * FROM users WHERE id = ?';
   await db.query(query, [userId]);
   ```

2. 機密情報のログ出力
   行: 89
   コード: `console.log('User:', user)`

   修正案:
   ```typescript
   logger.info('User action', { userId: user.id });
   // パスワードやトークンを除外
   ```

3. 認証バイパスの可能性
   行: 123
   コード: `if (user.role === 'admin' || DEBUG_MODE)`

   修正案:
   ```typescript
   if (user.role === 'admin' && !process.env.PRODUCTION)
   ```

⚠️ 警告（2件）:
- エラーハンドリング不足
- 入力バリデーション不完全

推奨アクション:
1. 重大な問題を即座に修正
2. ユニットテストを追加
3. セキュリティ監査を実施
```

#### 2. ドキュメント生成プロンプト

```
あなた: /mcp.docs.api-endpoint createUser

Claude: [API ドキュメント生成プロンプトを実行]

API ドキュメント生成:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# POST /api/users - ユーザー作成

## 概要
新しいユーザーアカウントを作成します。

## エンドポイント
```
POST /api/users
```

## 認証
Bearer Token必須

## リクエスト

### ヘッダー
```
Content-Type: application/json
Authorization: Bearer {token}
```

### ボディ
```json
{
  "email": "user@example.com",
  "name": "山田太郎",
  "password": "SecureP@ssw0rd",
  "role": "user"
}
```

### パラメータ

| フィールド | 型     | 必須 | 説明                    |
|-----------|--------|------|------------------------|
| email     | string | ✅   | メールアドレス（一意）    |
| name      | string | ✅   | ユーザー名（3-100文字）  |
| password  | string | ✅   | パスワード（8文字以上）   |
| role      | string | ❌   | ロール（デフォルト: user）|

## レスポンス

### 成功（201 Created）
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "user@example.com",
  "name": "山田太郎",
  "role": "user",
  "createdAt": "2025-01-20T10:30:00Z"
}
```

### エラー

#### 400 Bad Request
```json
{
  "error": "ValidationError",
  "message": "Invalid email format",
  "field": "email"
}
```

#### 409 Conflict
```json
{
  "error": "DuplicateError",
  "message": "Email already exists"
}
```

## サンプルコード

### cURL
```bash
curl -X POST https://api.example.com/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "email": "user@example.com",
    "name": "山田太郎",
    "password": "SecureP@ssw0rd"
  }'
```

### JavaScript (fetch)
```javascript
const response = await fetch('https://api.example.com/api/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    email: 'user@example.com',
    name: '山田太郎',
    password: 'SecureP@ssw0rd'
  })
});

const user = await response.json();
```

## 注意事項
- メールアドレスは一意である必要があります
- パスワードは暗号化されて保存されます
- rateリミット: 10リクエスト/分
```

#### 3. デバッグワークフロープロンプト

```
あなた: /mcp.debug.trace-error TypeError in UserService

Claude: [エラートレースプロンプトを実行]

エラートレースデバッグ:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【ステップ1: エラー情報収集】
- Sentryからエラー詳細を取得
- ログファイルを解析
- 影響範囲を評価

【ステップ2: 再現手順の特定】
[Sentryデータから再現手順を抽出]

再現手順:
1. ユーザーIDなしでgetUser()を呼び出し
2. データベースクエリがnullを返す
3. null.idアクセスでTypeError

【ステップ3: スタックトレース分析】
```
TypeError: Cannot read property 'id' of undefined
  at UserService.getUser (user-service.ts:42:20)
  at UserController.show (user-controller.ts:28:35)
  at Layer.handle (express/lib/router/layer.js:95:5)
```

【ステップ4: 関連コード確認】
[問題のコードを表示]

【ステップ5: 根本原因の特定】
✅ 根本原因: nullチェックの欠如

【ステップ6: 修正案の提示】
[修正コードを提示]

【ステップ7: テストケースの追加】
[テストコードを生成]

【ステップ8: 検証】
修正をデプロイし、Sentryで監視を継続
```

### カスタムプロンプトの作成

独自のMCPプロンプトを作成することもできます。詳細は[カスタムMCPサーバー](03-mcp-custom.md)を参照してください。

---

## パフォーマンス最適化

MCPサーバーを効率的に使用するためのパフォーマンス最適化手法を紹介します。

### トークン使用量の最適化

#### 1. MAX_MCP_OUTPUT_TOKENSの設定

MCPサーバーからの出力を制限することで、コンテキストウィンドウを節約できます。

**問題:**
- Claude Codeセッション開始時に、コンテキストウィンドウの59%（118k/200k tokens）が消費される
- MCPツール定義だけで47.9k tokens（24%）を使用

**解決策:**

```json
{
  "mcpServers": {
    "postgres": {
      "transport": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "maxOutputTokens": 5000
    }
  }
}
```

#### 2. プレーンテキストフォーマットの使用

JSON形式ではなくプレーンテキスト形式を使用することで、約80%のトークンを節約できます。

**JSONレスポンス（2,500 tokens）:**
```json
{
  "users": [
    {
      "id": 1,
      "name": "Alice",
      "email": "alice@example.com"
    },
    {
      "id": 2,
      "name": "Bob",
      "email": "bob@example.com"
    }
  ]
}
```

**プレーンテキストレスポンス（500 tokens）:**
```
ユーザー一覧:
1. Alice (alice@example.com)
2. Bob (bob@example.com)
```

#### 3. ツール定義の最適化

**非効率な定義（800 tokens）:**
```json
{
  "name": "query_database",
  "description": "This tool allows you to execute SQL queries against the PostgreSQL database. It supports SELECT, INSERT, UPDATE, and DELETE operations with various filtering, sorting, and pagination options...",
  "parameters": {
    "query": {
      "type": "string",
      "description": "The SQL query to execute. Must be a valid SQL statement..."
    }
  }
}
```

**最適化された定義（200 tokens）:**
```json
{
  "name": "query_db",
  "description": "Execute SQL query",
  "parameters": {
    "query": { "type": "string" }
  }
}
```

#### 4. フィルタリングとページネーション

大量のデータを返さず、必要な情報のみを取得します。

```typescript
// ❌ 全データ取得（32,795 tokens）
SELECT * FROM users;

// ✅ 必要なカラムのみ（421 tokens）
SELECT id, name, email
FROM users
WHERE active = true
LIMIT 10;
```

### レスポンス時間の最適化

#### 1. キャッシュの活用

頻繁にアクセスするデータはキャッシュします。

```json
{
  "mcpServers": {
    "postgres": {
      "transport": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "cache": {
        "enabled": true,
        "ttl": 300,
        "maxSize": 100
      }
    }
  }
}
```

#### 2. タイムアウトとリトライの設定

```json
{
  "mcpServers": {
    "github": {
      "transport": "http",
      "endpoint": "https://api.githubcopilot.com/mcp/",
      "timeout": 10000,
      "retries": 3,
      "retryDelay": 1000
    }
  }
}
```

#### 3. 並列リクエストの活用

複数のMCPサーバーに同時にリクエストを送信します。

```
あなた: GitHubのissueとSentryのエラーを同時に取得して

Claude: [GitHub と Sentry MCPに並列リクエスト]
# 2秒で両方の結果を取得（逐次実行なら4秒）
```

### ツール数の最適化

#### 1. 必要なサーバーのみ有効化

使用しないサーバーは無効化します。

```bash
# 一時的に無効化
claude mcp disable unused-server

# 完全に削除
claude mcp remove unused-server
```

#### 2. MCP Optimizerの使用

MCP Optimizerは、必要なツールのみを動的に送信することで、トークン使用量を削減します。

**Before（102,000 tokens）:**
- 114個のツールメタデータを送信

**After（5,000 tokens）:**
- 必要な5個のツールのみを送信

削減率: 95%

#### 3. サーバーの統合

複数の小さなサーバーを1つの包括的なサーバーに統合します。

```json
// ❌ 5つの個別サーバー（ツール定義: 5 × 800 = 4,000 tokens）
{
  "mcpServers": {
    "github-issues": {...},
    "github-prs": {...},
    "github-repos": {...},
    "github-actions": {...},
    "github-releases": {...}
  }
}

// ✅ 1つの統合サーバー（ツール定義: 1,200 tokens）
{
  "mcpServers": {
    "github": {
      "description": "GitHub統合（issues, PRs, repos, actions, releases）",
      "transport": "http",
      "endpoint": "https://api.githubcopilot.com/mcp/"
    }
  }
}
```

### コード実行の最適化

MCPでコード実行を使用する場合、中間結果を実行環境内に保持することで、トークンを節約できます。

```python
# ❌ 大量の中間結果を返す
result1 = process_data()  # 10,000 tokens
result2 = filter_data(result1)  # 8,000 tokens
result3 = aggregate_data(result2)  # 5,000 tokens
return result3

# ✅ 最終結果のみを返す
result = pipeline.execute()  # 500 tokens
return result
```

### モニタリングとメトリクス

#### 1. トークン使用量の監視

```bash
# セッションのトークン使用量を確認
/context stats

# 出力例:
# Total tokens: 118,532 / 200,000 (59%)
# - MCP tools: 47,900 (24%)
# - System: 17,300 (9%)
# - Memory: 4,700 (2%)
# - Conversation: 48,632 (24%)
```

#### 2. レスポンス時間の計測

```json
{
  "mcpServers": {
    "postgres": {
      "transport": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "metrics": {
        "enabled": true,
        "logLevel": "info"
      }
    }
  }
}
```

#### 3. パフォーマンスレポートの自動生成

```
あなた: 過去24時間のMCPパフォーマンスレポートを生成して

Claude: MCPパフォーマンスレポート（過去24時間）:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

サーバー別統計:

GitHub:
- リクエスト数: 234
- 平均応答時間: 340ms
- 成功率: 99.1%
- トークン使用: 平均 1,200 tokens/req

PostgreSQL:
- リクエスト数: 567
- 平均応答時間: 180ms
- 成功率: 100%
- トークン使用: 平均 800 tokens/req

Sentry:
- リクエスト数: 45
- 平均応答時間: 890ms
- 成功率: 97.8%
- トークン使用: 平均 2,300 tokens/req

最適化推奨:
1. Sentryのレスポンスフィルタリング強化
2. GitHub APIのキャッシュ有効化
3. PostgreSQLクエリの結果制限
```

---

## サーバーの組み合わせ例

複数のMCPサーバーを組み合わせることで、強力なワークフローを構築できます。

### 例1: フルスタック開発環境

GitHub、PostgreSQL、Sentryを組み合わせた開発環境です。

**設定（`.mcp.json`）:**

```json
{
  "mcpServers": {
    "github": {
      "description": "リポジトリ・issue・PR管理",
      "transport": "http",
      "endpoint": "https://api.githubcopilot.com/mcp/",
      "auth": {
        "type": "oauth2",
        "clientId": "${GITHUB_CLIENT_ID}",
        "clientSecret": "${GITHUB_CLIENT_SECRET}"
      }
    },
    "postgres": {
      "description": "本番DBへの読み取りアクセス",
      "transport": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "POSTGRES_URL": "${DATABASE_URL}",
        "POSTGRES_READ_ONLY": "true"
      }
    },
    "sentry": {
      "description": "エラー監視とデバッグ",
      "transport": "http",
      "endpoint": "https://sentry.io/api/mcp/",
      "auth": {
        "type": "bearer",
        "token": "${SENTRY_TOKEN}"
      }
    }
  }
}
```

**ワークフロー例:**

```
あなた: Sentryで急増しているエラーを調査して、
       データベースも確認して、GitHubにissueを作成して

Claude: [統合調査ワークフロー開始]

【ステップ1: Sentryエラー分析】
[Sentry MCPでエラー取得]

急増エラー:
TypeError: Cannot read property 'id' of undefined
- 発生回数: 127件（過去1時間）
- 影響ユーザー: 34人

【ステップ2: データベース調査】
[PostgreSQL MCPでデータ確認]

```sql
SELECT COUNT(*) FROM users WHERE id IS NULL;
```

結果: 0件（データ整合性問題なし）

```sql
SELECT * FROM error_logs
WHERE message LIKE '%undefined%'
ORDER BY created_at DESC
LIMIT 5;
```

パターン発見:
- 全て特定APIエンドポイントから
- 最近のデプロイ後に発生開始

【ステップ3: GitHub issue作成】
[GitHub MCPでissue作成]

Issue #159を作成しました:

タイトル: [緊急] TypeError急増: UserService.getUser

優先度: P0 - Critical
ラベル: bug, production, backend
担当: @backend-team

本文:
## 概要
UserService.getUserでTypeErrorが急増（127件/時間）

## 詳細
- エラー: Cannot read property 'id' of undefined
- 発生場所: user-service.ts:42
- 影響: 34ユーザー
- 発生タイミング: デプロイ後（PR #234）

## データベース確認
- データ整合性: 問題なし
- NULL値: 検出されず

## 推奨対応
1. PR #234のロールバック
2. nullチェック追加
3. ユニットテスト補強

## 関連リンク
- Sentry: https://sentry.io/issues/...
- デプロイ: PR #234

完了しました。全体で3分30秒かかりました。
```

### 例2: チーム通知自動化

Sentry、GitHub、Slackを組み合わせた通知システムです。

**設定:**

```json
{
  "mcpServers": {
    "sentry": {
      "description": "エラー監視",
      "transport": "http",
      "endpoint": "https://sentry.io/api/mcp/"
    },
    "github": {
      "description": "issue自動作成",
      "transport": "http",
      "endpoint": "https://api.githubcopilot.com/mcp/"
    },
    "slack": {
      "description": "チーム通知",
      "transport": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-slack"],
      "env": {
        "SLACK_BOT_TOKEN": "${SLACK_BOT_TOKEN}"
      }
    }
  }
}
```

**自動化ワークフロー:**

```
あなた: Sentryの新しいエラーを監視して、重大なエラーは
       自動でGitHub issueを作成し、Slackに通知して

Claude: 監視を開始しました。

[5分後、新しいエラーを検知]

🚨 重大エラー検知:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【Sentryアラート】
UnhandledPromiseRejection
- 発生回数: 23件（過去5分）
- 影響ユーザー: 12人
- 重大度: P0

【GitHub issue自動作成】
Issue #160: [P0] UnhandledPromiseRejection in PaymentService
→ https://github.com/org/repo/issues/160

【Slack通知送信】
#incidents チャンネルに通知しました:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚨 P0 インシデント発生

エラー: UnhandledPromiseRejection
場所: PaymentService.processPayment
影響: 12ユーザー
GitHub: #160

@oncall-engineer 対応をお願いします
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

監視を継続しています...
```

### 例3: デザイン→実装ワークフロー

Figma、GitHub、Notionを組み合わせた開発フローです。

**設定:**

```json
{
  "mcpServers": {
    "figma": {
      "description": "デザイン連携",
      "transport": "http",
      "endpoint": "https://mcp.figma.com/mcp"
    },
    "github": {
      "description": "コード管理",
      "transport": "http",
      "endpoint": "https://api.githubcopilot.com/mcp/"
    },
    "notion": {
      "description": "ドキュメント管理",
      "transport": "http",
      "endpoint": "https://mcp.notion.com/mcp"
    }
  }
}
```

**ワークフロー:**

```
あなた: Figmaの最新デザインからコンポーネントを実装して、
       GitHubにプッシュし、Notionにドキュメントを作成して

Claude: デザイン→実装ワークフローを開始します:

【ステップ1: Figmaデザイン取得】
[Figma MCPでコンポーネント情報取得]

取得コンポーネント:
- Button/Primary
- Input/Text
- Card/Product

【ステップ2: コンポーネント実装】
[各コンポーネントのReact + TypeScriptコード生成]

生成ファイル:
- src/components/Button/Button.tsx
- src/components/Button/Button.module.css
- src/components/Button/Button.test.tsx
- src/components/Input/Input.tsx
- src/components/Input/Input.module.css
- src/components/Input/Input.test.tsx
- src/components/Card/Card.tsx
- src/components/Card/Card.module.css
- src/components/Card/Card.test.tsx

【ステップ3: テスト実行】
[npm test を実行]

テスト結果: ✅ 全て合格（27/27）

【ステップ4: GitHubにプッシュ】
[GitHub MCPで新しいブランチ作成とコミット]

ブランチ: feature/design-system-components
コミット: "Add Button, Input, Card components from Figma design"
→ https://github.com/org/repo/tree/feature/design-system-components

【ステップ5: Notionドキュメント作成】
[Notion MCPでコンポーネントドキュメント生成]

作成ページ:
1. "デザインシステム - ボタンコンポーネント"
2. "デザインシステム - 入力コンポーネント"
3. "デザインシステム - カードコンポーネント"

各ページに含まれる内容:
- コンポーネント概要
- 使用方法とサンプルコード
- プロパティ一覧
- デザインガイドライン
- Figmaデザインリンク
- GitHubソースコードリンク

完了しました！
- 実装: 9ファイル
- テスト: 27件合格
- GitHub: feature/design-system-components
- Notion: 3ページ作成

次のステップ:
PRを作成してレビューを依頼しますか？
```

### 例4: データ駆動開発

PostgreSQL、Notion、GitHubを組み合わせた分析駆動開発です。

**ワークフロー:**

```
あなた: データベースのパフォーマンス問題を分析して、
       最適化案をNotionにまとめて、GitHubにissueを作成して

Claude: データ駆動分析ワークフローを開始:

【ステップ1: データベースパフォーマンス分析】
[PostgreSQL MCPでスロークエリ分析]

検出された問題:
1. orders テーブルのフルスキャン（平均2.3s）
2. インデックス未使用（user_id, created_at）
3. N+1クエリ問題（products JOIN）

【ステップ2: 最適化案の生成】
[詳細な最適化提案を作成]

提案内容:
- インデックス追加（3件）
- クエリリファクタリング（5箇所）
- キャッシュ戦略

【ステップ3: Notionドキュメント作成】
[Notion MCPで分析レポート作成]

作成ページ: "データベースパフォーマンス最適化提案"

内容:
1. 現状分析
   - スロークエリ一覧
   - パフォーマンスメトリクス
   - ボトルネック特定

2. 最適化提案
   - インデックス追加案
   - クエリ改善案
   - 期待される改善効果

3. 実装計画
   - マイグレーションスクリプト
   - ロールバック手順
   - リスク評価

4. 検証方法
   - パフォーマンステスト
   - 監視メトリクス

【ステップ4: GitHub issue作成】
[GitHub MCPでissue作成]

Issue #161: データベースパフォーマンス最適化

ラベル: enhancement, database, performance
マイルストーン: Q1 2025
担当: @backend-team

本文:
## 概要
スロークエリの最適化により、応答時間を60%改善

## 詳細分析
Notionドキュメント: [リンク]

## 実装タスク
- [ ] インデックス追加（3件）
- [ ] クエリリファクタリング（5箇所）
- [ ] キャッシュ実装
- [ ] パフォーマンステスト
- [ ] 本番デプロイ

## 期待効果
- クエリ実行時間: 2.3s → 0.8s（65%改善）
- API応答時間: 1.2s → 0.5s（58%改善）
- スループット: +120%

完了しました！
- Notion: 分析レポート作成
- GitHub: Issue #161作成
```

### 例5: E2Eテスト自動化

Playwright、GitHub、Slackを組み合わせたテスト自動化です。

**ワークフロー:**

```
あなた: 新しいPRがマージされたら、E2Eテストを実行して、
       結果をSlackに通知して

Claude: E2Eテスト自動化を設定しました:

[PRマージ検知]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔀 PR #234がmainにマージされました

【E2Eテスト実行】
[Playwright MCPでテスト実行]

実行中のテストスイート:
✅ ログインフロー（3シナリオ）
✅ ユーザープロフィール編集（5シナリオ）
⚠️ 商品購入フロー（2/3シナリオ）
❌ 管理画面（1/4シナリオ失敗）

テスト結果サマリー:
- 合計: 15シナリオ
- 成功: 13シナリオ（87%）
- 失敗: 2シナリオ（13%）
- 実行時間: 3分45秒

失敗詳細:

1. 商品購入フロー - 支払い確認
   エラー: タイムアウト（要素が見つからない）
   スクリーンショット: payment-error.png

2. 管理画面 - ユーザー一覧表示
   エラー: 500 Internal Server Error
   ログ: API応答エラー

【Slack通知送信】
#ci-cd チャンネルに通知:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ E2Eテスト部分失敗

PR: #234（ユーザープロフィール編集機能）
ブランチ: main
成功率: 87%（13/15）

失敗シナリオ:
❌ 商品購入フロー - 支払い確認
❌ 管理画面 - ユーザー一覧表示

詳細: [リンク]
スクリーンショット: [リンク]

@developer @qa-team
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

監視を継続しています...
```

---

## トラブルシューティング

### 問題1: MCPサーバーが応答しない

**症状:**
```
Error: MCP server 'github' timed out after 30000ms
```

**解決方法:**

1. **タイムアウト設定を延長**
   ```json
   {
     "timeout": 60000
   }
   ```

2. **ネットワーク接続を確認**
   ```bash
   curl https://api.githubcopilot.com/mcp/health
   ```

3. **サーバーを再起動**
   ```bash
   claude mcp restart github
   ```

### 問題2: 認証エラー

**症状:**
```
Error: Authentication failed for MCP server 'notion'
```

**解決方法:**

1. **トークンを確認**
   ```bash
   echo $NOTION_TOKEN
   ```

2. **トークンを再生成**
   - サービスのダッシュボードで新しいトークンを生成
   - 環境変数を更新

3. **OAuth再認証**
   ```bash
   claude mcp remove notion
   claude mcp add --transport http notion https://mcp.notion.com/mcp
   ```

### 問題3: トークン使用量が多すぎる

**症状:**
コンテキストウィンドウがすぐに満杯になる。

**解決方法:**

1. **MAX_MCP_OUTPUT_TOKENSを設定**
   ```json
   {
     "maxOutputTokens": 3000
   }
   ```

2. **不要なサーバーを無効化**
   ```bash
   claude mcp disable unused-server
   ```

3. **プレーンテキスト形式を要求**
   ```
   あなた: 結果を簡潔なテキスト形式で返して
   ```

### 問題4: パフォーマンスが遅い

**症状:**
MCPサーバーへのリクエストに時間がかかる。

**解決方法:**

1. **キャッシュを有効化**
   ```json
   {
     "cache": {
       "enabled": true,
       "ttl": 300
     }
   }
   ```

2. **並列リクエストを活用**
   ```
   複数のサーバーに同時に問い合わせる
   ```

3. **データフィルタリング**
   ```
   必要最小限のデータのみを取得
   ```

---

## ベストプラクティス

### 1. サーバー選択の指針

**使用するサーバー:**
- ✅ 公式サーバー（Anthropic、Microsoft、GitHub等）
- ✅ 有名オープンソース（活発なメンテナンス）
- ✅ エンタープライズグレード（Sentry、Notion等）

**避けるべきサーバー:**
- ❌ 出所不明
- ❌ ソースコード非公開
- ❌ 長期間更新されていない

### 2. セキュリティ重視

- 環境変数で認証情報を管理
- 最小権限の原則（OAuth2スコープ）
- HTTPS必須
- 定期的なトークンローテーション

### 3. パフォーマンス最適化

- トークン使用量の監視
- 不要なサーバーの無効化
- キャッシュの活用
- 並列リクエストの活用

### 4. チーム開発

- プロジェクトスコープで設定を共有
- 環境変数は個人管理
- ドキュメント化
- 段階的導入

### 5. モニタリングと改善

- 定期的なパフォーマンスレビュー
- エラーログの確認
- トークン使用量の最適化
- フィードバックループの構築

---

## まとめ

MCPサーバーは、Claude Codeを強力な開発プラットフォームに変換します。

**重要なポイント:**

1. **適切なサーバー選択** - 目的に応じた公式・信頼できるサーバーを選ぶ
2. **効果的な組み合わせ** - 複数のサーバーを統合して強力なワークフローを構築
3. **パフォーマンス最適化** - トークン使用量とレスポンス時間を最適化
4. **セキュリティ優先** - 認証情報の適切な管理と最小権限の原則
5. **チームでの活用** - 設定を共有し、一貫した開発環境を構築

**次のステップ:**

- **[MCP基礎](01-mcp-basics.md)** - MCPの基本概念と設定方法
- **[カスタムMCPサーバー](03-mcp-custom.md)** - 独自のサーバーを開発する
- **[スキル活用](04-skills-basics.md)** - Claude Codeスキルとの連携

---

**関連ドキュメント:**
- [統合ツール](../02-features/integration-tools.md) - ツール統合の基礎
- [設定ファイル](../12-configuration.md) - 詳細な設定方法
- [トラブルシューティング](../09-troubleshooting.md) - 一般的な問題解決

**外部リソース:**
- [PulseMCP](https://www.pulsemcp.com/servers) - 6,470以上のMCPサーバーディレクトリ
- [MCP Server Finder](https://www.mcpserverfinder.com/) - 詳細な実装ガイド
- [Awesome MCP Servers](https://github.com/punkpeye/awesome-mcp-servers) - コミュニティキュレーション
- [MCP Market](https://mcpmarket.com/server) - カテゴリ別サーバーマーケット
- [公式リポジトリ](https://github.com/modelcontextprotocol/servers) - Anthropic提供サーバー
- [MCP公式ドキュメント](https://modelcontextprotocol.io/) - プロトコル仕様
- [Model Context Protocol Guide](https://www.ikkaro.net/mcp-servers/) - 包括的ガイド

**情報源:**
- [The 10 Must-Have MCP Servers for Claude Code (2025 Developer Edition)](https://roobia.medium.com/the-10-must-have-mcp-servers-for-claude-code-2025-developer-edition-43dc3c15c887)
- [Top 10 Essential MCP Servers for Claude Code](https://apidog.com/blog/top-10-mcp-servers-for-claude-code/)
- [7 Claude MCP servers you can set up right now](https://zapier.com/blog/claude-mcp-servers/)
- [Best MCP Servers for Claude Code - Top Tools & Integrations](https://mcpcat.io/guides/best-mcp-servers-for-claude-code/)
- [Sentry MCP Server Documentation](https://docs.sentry.io/product/sentry-mcp/)
- [Notion MCP - Official Documentation](https://developers.notion.com/docs/mcp)
- [Guide to the Figma MCP server](https://help.figma.com/hc/en-us/articles/32132100833559-Guide-to-the-Figma-MCP-server)
- [Slack MCP Server Documentation](https://docs.slack.dev/ai/mcp-server/)
- [Playwright MCP: Comprehensive Guide](https://medium.com/@bluudit/playwright-mcp-comprehensive-guide-to-ai-powered-browser-automation-in-2025-712c9fd6cffa)
- [A brief introduction to MCP server performance optimization](https://www.catchmetrics.io/blog/a-brief-introduction-to-mcp-server-performance-optimization)
- [MCP Prompts Explained](https://medium.com/@laurentkubaski/mcp-prompts-explained-including-how-to-actually-use-them-9db13d69d7e2)
- [Understanding MCP features: Tools, Resources, Prompts](https://workos.com/blog/mcp-features-guide)
- [MCP Server Explained: The Complete 2025 Guide](https://www.ikkaro.net/mcp-servers/)

**タグ:** `#中級者` `#MCP` `#サーバー` `#ツール統合` `#GitHub` `#Sentry` `#PostgreSQL` `#Notion` `#Figma` `#Slack` `#Playwright` `#パフォーマンス最適化` `#ワークフロー`
