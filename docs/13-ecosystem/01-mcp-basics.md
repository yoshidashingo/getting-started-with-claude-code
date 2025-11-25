# MCP（Model Context Protocol）基礎

MCP（Model Context Protocol）は、Claude Codeと外部ツール、データベース、APIを接続するためのオープンソース標準プロトコルです。MCPを使用することで、Claudeは様々な外部サービスに安全にアクセスし、より強力な開発支援を提供できます。

## MCPとは

### 基本概念

MCPは、AIモデルと外部リソースの間の標準化された通信プロトコルです。以下の図は、MCPの基本的な仕組みを示しています：

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│ Claude Code │ ◄─MCP──► │ MCPサーバー  │ ◄─────► │外部サービス │
│             │         │              │         │             │
│  (クライアント) │         │ (プロトコル   │         │ (GitHub、   │
│             │         │  変換層)      │         │  DB等)      │
└─────────────┘         └──────────────┘         └─────────────┘
```

**主な特徴:**

- **標準化されたインターフェース**: 統一された方法で様々なサービスに接続
- **セキュアな通信**: 認証とアクセス制御をサポート
- **拡張可能**: 新しいサービスを簡単に追加可能
- **オープンソース**: 誰でもサーバーを開発・公開できる

### MCPでできること

MCPを利用すると、以下のような強力な機能を活用できます：

#### 1. データベースへの自然言語クエリ
```
あなた: ユーザーテーブルから最新10件のレコードを取得して
Claude: [PostgreSQL MCPサーバー経由でクエリ実行]
```

#### 2. 課題管理システムとの連携
```
あなた: GitHubで「バグ修正」というタイトルのissueを作成して
Claude: [GitHub MCPサーバー経由でissue作成]
```

#### 3. モニタリングツールとの統合
```
あなた: 過去1週間のエラーログをSentryから取得して分析して
Claude: [Sentry MCPサーバー経由でログ取得]
```

#### 4. デザインツールからのデータ取得
```
あなた: Figmaの最新デザインファイルからコンポーネント情報を取得して
Claude: [Figma MCPサーバー経由でデータ取得]
```

## MCPサーバーの種類

MCPは3つのトランスポートプロトコルをサポートしています：

### 1. HTTP（推奨）

**特徴:**
- 最も推奨される方法
- スケーラブルで信頼性が高い
- ファイアウォールフレンドリー
- OAuth 2.0認証をネイティブサポート

**使用例:**
```bash
claude mcp add --transport http github https://api.githubcopilot.com/mcp/
```

**適用シナリオ:**
- クラウドサービスとの統合
- 本番環境での使用
- チーム全体での共有

### 2. SSE（Server-Sent Events）【非推奨】

**特徴:**
- リアルタイムストリーミングに対応
- 一方向通信（サーバーからクライアント）
- 将来的に廃止予定

**注意:**
⚠️ 新規プロジェクトではSSEの使用を避け、HTTPを使用してください。

### 3. Stdio（標準入出力）

**特徴:**
- ローカルプロセスとして実行
- 軽量で高速
- 開発・テスト環境に最適

**使用例:**
```bash
claude mcp add --transport stdio my-local-server /path/to/server/executable
```

**適用シナリオ:**
- ローカル開発ツールの統合
- カスタムスクリプトの実行
- プロトタイピング

## インストールと設定

### CLIを使用したサーバー追加

MCPサーバーを追加する基本的な方法は`claude mcp add`コマンドです：

#### HTTP サーバーの追加

```bash
# 基本形式
claude mcp add --transport http <サーバー名> <エンドポイントURL>

# 例: GitHub MCPサーバー
claude mcp add --transport http github https://api.githubcopilot.com/mcp/

# 例: Sentry MCPサーバー
claude mcp add --transport http sentry https://sentry.io/api/mcp/
```

#### Stdio サーバーの追加

```bash
# 基本形式
claude mcp add --transport stdio <サーバー名> <実行ファイルパス> [引数...]

# 例: PostgreSQL MCPサーバー（Node.js）
claude mcp add --transport stdio postgres npx -y @modelcontextprotocol/server-postgres

# 例: カスタムスクリプト
claude mcp add --transport stdio custom-tool /usr/local/bin/my-mcp-server --verbose
```

### サーバー管理コマンド

#### サーバー一覧の表示

```bash
# 設定済みのMCPサーバーを確認
claude mcp list

# 出力例:
# Project MCPサーバー:
#   github (http) - https://api.githubcopilot.com/mcp/
#   postgres (stdio) - npx @modelcontextprotocol/server-postgres
#
# User MCPサーバー:
#   sentry (http) - https://sentry.io/api/mcp/
```

#### サーバーの削除

```bash
# 特定のサーバーを削除
claude mcp remove <サーバー名>

# 例
claude mcp remove github
```

#### サーバーの更新

```bash
# サーバー設定を更新
claude mcp update <サーバー名> --endpoint <新しいURL>

# 例
claude mcp update github --endpoint https://new-api.githubcopilot.com/mcp/
```

#### サーバーの有効化/無効化

```bash
# サーバーを一時的に無効化
claude mcp disable <サーバー名>

# サーバーを再度有効化
claude mcp enable <サーバー名>
```

## 設定スコープ

MCPサーバーは3つの異なるスコープで設定できます：

### 1. Local（ローカル）スコープ

**保存場所:** `.mcp.json`（現在のディレクトリ）

**特徴:**
- 現在のディレクトリでのみ有効
- Gitにコミットしない（`.gitignore`に追加推奨）
- 個人的な設定に最適

**使用例:**
```bash
claude mcp add --scope local --transport stdio dev-db /path/to/local/db-server
```

**`.gitignore`への追加:**
```
# MCPローカル設定
.mcp.json
```

### 2. Project（プロジェクト）スコープ【推奨】

**保存場所:** `.mcp.json`（プロジェクトルート）

**特徴:**
- プロジェクト全体で共有
- Gitにコミット可能
- チーム開発に最適

**使用例:**
```bash
claude mcp add --scope project --transport http github https://api.githubcopilot.com/mcp/
```

**プロジェクト設定例（`.mcp.json`）:**
```json
{
  "mcpServers": {
    "github": {
      "transport": "http",
      "endpoint": "https://api.githubcopilot.com/mcp/",
      "auth": {
        "type": "oauth2",
        "clientId": "${GITHUB_CLIENT_ID}",
        "scopes": ["repo", "issues"]
      }
    },
    "postgres": {
      "transport": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "POSTGRES_URL": "${DATABASE_URL}"
      }
    }
  }
}
```

### 3. User（ユーザー）スコープ

**保存場所:** `~/.config/claude/settings.json`（ユーザーホーム）

**特徴:**
- すべてのプロジェクトで有効
- ユーザー個人の設定
- グローバルツールに最適

**使用例:**
```bash
claude mcp add --scope user --transport http sentry https://sentry.io/api/mcp/
```

**ユーザー設定例（`~/.config/claude/settings.json`）:**
```json
{
  "mcpServers": {
    "sentry": {
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

### スコープの優先順位

複数のスコープで同じサーバー名が定義されている場合、以下の優先順位が適用されます：

```
Local > Project > User
```

## 認証方法

MCPサーバーは様々な認証方式をサポートしています：

### 1. OAuth 2.0（推奨）

**特徴:**
- セキュアなトークンベース認証
- スコープによる権限制御
- トークンの自動リフレッシュ

**設定例:**
```json
{
  "mcpServers": {
    "github": {
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

**初回認証フロー:**
```bash
# サーバー追加時に自動的にブラウザが開きます
claude mcp add --transport http github https://api.githubcopilot.com/mcp/

# ブラウザで認証を承認
# トークンは自動的に安全に保存されます
```

### 2. Bearer Token

**特徴:**
- シンプルなトークン認証
- APIキーに最適
- 手動トークン管理

**設定例:**
```json
{
  "mcpServers": {
    "api-service": {
      "transport": "http",
      "endpoint": "https://api.example.com/mcp/",
      "auth": {
        "type": "bearer",
        "token": "${API_TOKEN}"
      }
    }
  }
}
```

### 3. Basic認証

**特徴:**
- ユーザー名とパスワードによる認証
- レガシーシステムとの互換性
- セキュリティリスクに注意

**設定例:**
```json
{
  "mcpServers": {
    "legacy-service": {
      "transport": "http",
      "endpoint": "https://legacy.example.com/mcp/",
      "auth": {
        "type": "basic",
        "username": "${SERVICE_USERNAME}",
        "password": "${SERVICE_PASSWORD}"
      }
    }
  }
}
```

⚠️ **セキュリティ警告:** Basic認証はHTTPSでのみ使用してください。

### 4. API Key（カスタムヘッダー）

**特徴:**
- カスタムヘッダーによる認証
- サービス固有の認証方式に対応

**設定例:**
```json
{
  "mcpServers": {
    "custom-api": {
      "transport": "http",
      "endpoint": "https://api.example.com/mcp/",
      "headers": {
        "X-API-Key": "${CUSTOM_API_KEY}",
        "X-Client-Version": "1.0"
      }
    }
  }
}
```

## 環境変数の使用

MCPサーバー設定では、環境変数を使用して機密情報を安全に管理できます。

### 環境変数の展開

設定ファイル内で`${VARIABLE_NAME}`の形式で環境変数を参照できます：

```json
{
  "mcpServers": {
    "postgres": {
      "transport": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "POSTGRES_URL": "${DATABASE_URL}",
        "POSTGRES_USER": "${DB_USER}",
        "POSTGRES_PASSWORD": "${DB_PASSWORD}"
      }
    }
  }
}
```

### 環境変数の設定方法

#### 1. シェル環境変数

```bash
# .bashrc または .zshrc に追加
export DATABASE_URL="postgresql://localhost:5432/mydb"
export GITHUB_CLIENT_ID="your-client-id"
export SENTRY_TOKEN="your-sentry-token"
```

#### 2. .envファイル（プロジェクトルート）

```bash
# .env
DATABASE_URL=postgresql://localhost:5432/mydb
GITHUB_CLIENT_ID=your-client-id
GITHUB_CLIENT_SECRET=your-client-secret
SENTRY_TOKEN=your-sentry-token
```

⚠️ **重要:** `.env`ファイルは必ず`.gitignore`に追加してください：

```
# .gitignore
.env
.env.local
.env.*.local
```

#### 3. Claude Code セッション内

```bash
# セッション開始時に環境変数を設定
export DATABASE_URL="postgresql://localhost:5432/mydb"

# Claude Codeを起動
claude
```

### 環境変数のベストプラクティス

1. **機密情報は環境変数で管理**
   ```json
   ❌ "token": "ghp_xxxxxxxxxxxx"  // ハードコードは避ける
   ✅ "token": "${GITHUB_TOKEN}"   // 環境変数を使用
   ```

2. **デフォルト値の提供**
   ```json
   {
     "env": {
       "PORT": "${PORT:-3000}",  // デフォルト: 3000
       "HOST": "${HOST:-localhost}"
     }
   }
   ```

3. **環境ごとの設定分離**
   ```bash
   # 開発環境
   .env.development

   # 本番環境
   .env.production
   ```

## 実践的な使用例

### 例1: GitHub統合

GitHubリポジトリと連携し、issueやPRを管理します。

#### サーバー追加

```bash
claude mcp add --transport http github https://api.githubcopilot.com/mcp/
```

#### 使用例

```
あなた: このリポジトリの未解決issueを一覧表示して

Claude: [GitHub MCPサーバーに問い合わせ]
現在の未解決issue（5件）:
1. #42: ログイン機能のバグ修正
2. #43: パフォーマンス改善
3. #44: ドキュメント更新
...

あなた: issue #42の詳細を教えて

Claude: [詳細情報を取得]
Issue #42: ログイン機能のバグ修正
作成日: 2024-01-15
担当者: @developer
ラベル: bug, high-priority
...

あなた: 「バグ修正完了」というコメントをissue #42に追加して

Claude: [コメント追加]
コメントを追加しました。
```

### 例2: PostgreSQLデータベース

データベースに自然言語でクエリを実行します。

#### サーバー追加

```bash
# 環境変数を設定
export DATABASE_URL="postgresql://user:password@localhost:5432/mydb"

# サーバー追加
claude mcp add --transport stdio postgres npx -y @modelcontextprotocol/server-postgres
```

#### 使用例

```
あなた: usersテーブルから最新10件のユーザーを取得して

Claude: [PostgreSQL MCPサーバー経由でクエリ実行]
SELECT * FROM users ORDER BY created_at DESC LIMIT 10;

結果:
| id | name          | email                | created_at          |
|----|---------------|----------------------|---------------------|
| 52 | 田中太郎       | tanaka@example.com   | 2024-01-20 10:30:00 |
| 51 | 佐藤花子       | sato@example.com     | 2024-01-19 15:20:00 |
...

あなた: 過去1週間で登録したユーザー数を教えて

Claude: [クエリ実行]
SELECT COUNT(*) FROM users
WHERE created_at >= NOW() - INTERVAL '7 days';

結果: 23人のユーザーが過去1週間で登録しています。
```

### 例3: Sentry エラー監視

エラーログの分析と問題の調査を行います。

#### サーバー追加

```bash
# 環境変数を設定
export SENTRY_TOKEN="your-sentry-token"
export SENTRY_ORG="your-org"
export SENTRY_PROJECT="your-project"

# サーバー追加
claude mcp add --transport http sentry https://sentry.io/api/mcp/
```

#### 使用例

```
あなた: 過去24時間のエラーを確認して

Claude: [Sentry MCPサーバーに問い合わせ]
過去24時間のエラー概要:
- 総エラー数: 127件
- ユニークエラー: 8種類
- 最も多いエラー: TypeError in UserService (45件)

あなた: TypeErrorの詳細を教えて

Claude: [詳細情報取得]
Error: TypeError: Cannot read property 'id' of undefined
発生場所: UserService.js:line 42
発生回数: 45回
影響ユーザー: 12人
最終発生: 2分前

スタックトレース:
  at UserService.getUser (UserService.js:42)
  at UserController.show (UserController.js:18)
  ...

あなた: この問題を修正するコードを提案して

Claude: UserService.jsの42行目を確認したところ、
nullチェックが不足しています。以下の修正を提案します:

[修正コードを提示]
```

## セキュリティ考慮事項

MCPサーバーを使用する際は、以下のセキュリティ対策を必ず実施してください。

### 1. サードパーティサーバーの評価

⚠️ **重要:** サードパーティのMCPサーバーは慎重に評価してください。

**チェックリスト:**
- [ ] ソースコードが公開されているか
- [ ] 信頼できる組織・個人が開発しているか
- [ ] セキュリティ監査を受けているか
- [ ] コミュニティで実績があるか
- [ ] 定期的にメンテナンスされているか

**推奨サーバー:**
```bash
# 公式サーバー（Anthropic提供）
claude mcp add --transport http github https://api.githubcopilot.com/mcp/

# 有名オープンソース
claude mcp add --transport stdio postgres npx @modelcontextprotocol/server-postgres
```

**避けるべき:**
```bash
# 出所不明なサーバー
❌ claude mcp add --transport http unknown https://suspicious-site.com/mcp/

# ソースコードが非公開
❌ claude mcp add --transport stdio closed-source /path/to/binary
```

### 2. 認証情報の管理

**必ず実施:**
```bash
# 環境変数を使用
export GITHUB_TOKEN="ghp_xxxxxxxxxxxx"

# .envファイルを.gitignoreに追加
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
```

**絶対に避ける:**
```json
❌ {
  "auth": {
    "token": "ghp_xxxxxxxxxxxx"  // ハードコードは絶対に避ける
  }
}
```

### 3. 権限の最小化

OAuth2スコープは必要最小限に設定してください：

```json
{
  "auth": {
    "type": "oauth2",
    "scopes": [
      "repo:read",    // ✅ 読み取りのみ必要ならread
      "issues:write"  // ✅ 必要な権限のみ付与
    ]
  }
}
```

```json
❌ {
  "scopes": ["admin:all"]  // 過剰な権限は避ける
}
```

### 4. HTTPS の使用

HTTPサーバーは必ずHTTPSを使用してください：

```bash
# ✅ HTTPS
claude mcp add --transport http api https://api.example.com/mcp/

# ❌ HTTP（平文通信）
claude mcp add --transport http api http://api.example.com/mcp/
```

### 5. アクセス制限

不要なサーバーは無効化または削除してください：

```bash
# 一時的に無効化
claude mcp disable unused-server

# 完全に削除
claude mcp remove unused-server
```

### 6. 監査ログ

MCPサーバーへのアクセスを定期的に確認してください：

```bash
# MCPサーバーの使用状況を確認
claude mcp logs

# 特定サーバーのアクセス履歴
claude mcp logs github --days 7
```

## トラブルシューティング

### 問題1: サーバーに接続できない

**症状:**
```
Error: Failed to connect to MCP server 'github'
```

**解決方法:**

1. **エンドポイントURLを確認**
   ```bash
   claude mcp list
   # URLが正しいか確認
   ```

2. **ネットワーク接続を確認**
   ```bash
   curl https://api.githubcopilot.com/mcp/health
   # 200 OKが返ってくるか確認
   ```

3. **認証情報を確認**
   ```bash
   echo $GITHUB_TOKEN
   # トークンが設定されているか確認
   ```

4. **サーバーを再起動**
   ```bash
   claude mcp restart github
   ```

### 問題2: 認証エラー

**症状:**
```
Error: Authentication failed for MCP server 'github'
```

**解決方法:**

1. **トークンの有効性を確認**
   ```bash
   # GitHubの場合
   curl -H "Authorization: Bearer $GITHUB_TOKEN" https://api.github.com/user
   ```

2. **スコープを確認**
   ```json
   {
     "scopes": ["repo", "issues"]  // 必要なスコープが含まれているか
   }
   ```

3. **トークンを再生成**
   ```bash
   # OAuth2の場合は再認証
   claude mcp remove github
   claude mcp add --transport http github https://api.githubcopilot.com/mcp/
   ```

### 問題3: 環境変数が展開されない

**症状:**
```
Error: Environment variable ${DATABASE_URL} not found
```

**解決方法:**

1. **環境変数を確認**
   ```bash
   echo $DATABASE_URL
   # 値が表示されるか確認
   ```

2. **Claude Codeセッション内で設定**
   ```bash
   export DATABASE_URL="postgresql://localhost:5432/mydb"
   ```

3. **.envファイルを読み込み**
   ```bash
   # .envファイルを作成
   echo 'DATABASE_URL="postgresql://localhost:5432/mydb"' > .env

   # セッション開始時に読み込み
   source .env && claude
   ```

### 問題4: Stdioサーバーが起動しない

**症状:**
```
Error: Failed to start stdio server 'postgres'
```

**解決方法:**

1. **コマンドパスを確認**
   ```bash
   which npx
   # コマンドが存在するか確認
   ```

2. **手動で実行してテスト**
   ```bash
   npx -y @modelcontextprotocol/server-postgres
   # エラーメッセージを確認
   ```

3. **依存関係をインストール**
   ```bash
   npm install -g @modelcontextprotocol/server-postgres
   ```

4. **絶対パスを使用**
   ```bash
   claude mcp add --transport stdio postgres /usr/local/bin/npx -y @modelcontextprotocol/server-postgres
   ```

### 問題5: パフォーマンスが遅い

**症状:**
MCPサーバーへのリクエストが遅い。

**解決方法:**

1. **サーバーの状態を確認**
   ```bash
   claude mcp status github
   # レスポンス時間を確認
   ```

2. **タイムアウト設定を調整**
   ```json
   {
     "timeout": 30000,  // 30秒に延長
     "retries": 3
   }
   ```

3. **キャッシュを有効化**
   ```json
   {
     "cache": {
       "enabled": true,
       "ttl": 300  // 5分間キャッシュ
     }
   }
   ```

### 問題6: プロジェクト設定が反映されない

**症状:**
`.mcp.json`に追加したサーバーが認識されない。

**解決方法:**

1. **設定ファイルの場所を確認**
   ```bash
   # プロジェクトルートに配置されているか
   ls -la .mcp.json
   ```

2. **JSON構文を確認**
   ```bash
   # JSON検証ツールで確認
   cat .mcp.json | jq .
   ```

3. **Claude Codeを再起動**
   ```bash
   /exit
   claude
   ```

4. **設定を手動で再読み込み**
   ```bash
   claude mcp reload
   ```

## ベストプラクティス

### 1. プロジェクトスコープを優先

チーム開発では、プロジェクトスコープを使用してください：

```bash
# ✅ チーム全体で共有
claude mcp add --scope project --transport http github https://api.githubcopilot.com/mcp/

# ❌ 個人設定はローカルに
claude mcp add --scope local --transport stdio dev-db /path/to/local/db
```

### 2. 設定をドキュメント化

`.mcp.json`にコメント（説明）を追加してください：

```json
{
  "mcpServers": {
    "github": {
      "description": "GitHubリポジトリ管理用。issueとPRの作成・更新に使用。",
      "transport": "http",
      "endpoint": "https://api.githubcopilot.com/mcp/",
      "requiredEnvVars": ["GITHUB_CLIENT_ID", "GITHUB_CLIENT_SECRET"]
    }
  }
}
```

### 3. 段階的な導入

一度に多数のサーバーを追加せず、段階的に導入してください：

```bash
# フェーズ1: 基本的なツール統合
claude mcp add --transport http github https://api.githubcopilot.com/mcp/

# フェーズ2: データベース統合（効果確認後）
claude mcp add --transport stdio postgres npx @modelcontextprotocol/server-postgres

# フェーズ3: 監視ツール統合（必要性確認後）
claude mcp add --transport http sentry https://sentry.io/api/mcp/
```

### 4. 環境ごとの設定分離

開発・本番で異なる設定を使用してください：

```bash
# 開発環境
.mcp.development.json

# 本番環境
.mcp.production.json

# 設定切り替え
ln -sf .mcp.development.json .mcp.json
```

### 5. 定期的なメンテナンス

MCPサーバーを定期的に確認・更新してください：

```bash
# 月次チェックリスト
claude mcp list              # 使用中のサーバー確認
claude mcp logs --days 30    # 使用状況確認
claude mcp update --all      # サーバー更新
claude mcp remove unused-*   # 不要なサーバー削除
```

## まとめ

MCPは、Claude Codeの機能を大幅に拡張する強力なプロトコルです：

**重要なポイント:**

1. **HTTPトランスポートを優先** - スケーラブルで信頼性が高い
2. **環境変数で認証情報を管理** - セキュリティの基本
3. **プロジェクトスコープでチーム共有** - 効率的なコラボレーション
4. **サードパーティサーバーは慎重に評価** - セキュリティリスクの軽減
5. **段階的に導入** - チームの習熟度に応じて拡張

**次のステップ:**

- **[MCPサーバー活用](02-mcp-servers.md)** - 実践的なサーバー利用方法を学ぶ
- **[カスタムMCPサーバー](03-mcp-custom.md)** - 独自のサーバーを開発する
- **[統合ツール](../02-features/integration-tools.md)** - 他のClaude Code機能との連携

---

**関連ドキュメント:**
- [スラッシュコマンド](../02-features/slash-commands.md) - 基本的なClaude Code操作
- [設定ファイル](../12-configuration.md) - 詳細な設定方法
- [セキュリティ](../10-advanced-topics.md) - 高度なセキュリティ対策
- [トラブルシューティング](../09-troubleshooting.md) - 一般的な問題解決

**外部リソース:**
- [MCP公式仕様](https://modelcontextprotocol.io) - プロトコル詳細
- [MCP サーバーレジストリ](https://github.com/modelcontextprotocol/servers) - 公式サーバー一覧
- [MCP SDK](https://github.com/modelcontextprotocol/sdk) - サーバー開発用SDK

**タグ:** `#初心者` `#MCP` `#ツール統合` `#セキュリティ` `#外部サービス` `#データベース` `#API`
