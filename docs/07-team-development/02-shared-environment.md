# 共有開発環境の構築

チーム全体で統一された開発環境を構築し、効率的な協働開発を実現する方法を詳しく解説します。環境設定の標準化により、開発効率の向上と品質の統一を実現します。

## 概要

### 共有環境とは

共有開発環境とは、チームメンバー全員が同じツール、設定、依存関係を使用して開発できる環境のことです。これにより以下のメリットが得られます：

- **再現性の確保**: 誰の環境でも同じ動作を保証
- **オンボーディングの効率化**: 新メンバーの環境構築が迅速に完了
- **トラブルシューティングの簡素化**: 共通環境により問題解決が容易
- **品質の統一**: 同じツールチェインによる一貫した品質
- **協働の効率化**: 設定の相違による問題を排除

### 統一すべき要素

1. **Claude Code設定**: `.claude/` 配下の設定ファイル
2. **MCP設定**: `.mcp.json` とMCPサーバー設定
3. **開発ツール**: エディタ、フォーマッター、リンター
4. **依存関係**: パッケージとバージョン管理
5. **環境変数**: 開発・本番環境の設定
6. **コンテナ環境**: Dockerによる環境の完全な統一

## Claude Code設定の共有

### .claude/ディレクトリ構造

チームで共有すべき設定ファイルの構造：

```
.claude/
├── settings.json           # Claude Code基本設定
├── prompts/               # 共有プロンプトテンプレート
│   ├── code-review.md
│   ├── refactoring.md
│   ├── testing.md
│   └── documentation.md
├── skills/                # カスタムスキル
│   ├── team-standards.md
│   └── project-patterns.md
├── agents/                # カスタムエージェント
│   ├── code-reviewer/
│   └── test-generator/
└── memory/                # 共有メモリファイル
    ├── project-context.md
    └── team-decisions.md
```

### settings.jsonの共有設定

**`.claude/settings.json`**:
```json
{
  "modelId": "claude-sonnet-4-5-20250929",
  "maxTokens": 8192,
  "temperature": 0.7,
  "systemPrompt": "You are a helpful assistant for our team project. Follow our coding standards and design principles.",
  "codeStyle": {
    "language": "typescript",
    "indentation": "spaces",
    "indentSize": 2,
    "lineWidth": 80,
    "semicolons": true,
    "quotes": "single",
    "trailingComma": "es5"
  },
  "projectContext": {
    "name": "team-project",
    "description": "チームプロジェクトの説明",
    "techStack": [
      "React",
      "TypeScript",
      "Node.js",
      "PostgreSQL"
    ],
    "designPrinciples": [
      "SOLID",
      "DRY",
      "YAGNI",
      "Clean Architecture"
    ]
  },
  "teamStandards": {
    "reviewRequired": true,
    "testCoverage": 80,
    "documentationRequired": true,
    "securityChecks": true
  }
}
```

### 共有プロンプトテンプレート

**`.claude/prompts/code-review.md`**:
```markdown
# コードレビュープロンプト

以下のコードをチームの基準でレビューしてください。

## プロジェクトコンテキスト
- 技術スタック: React + TypeScript + Node.js
- 設計原則: SOLID、Clean Architecture
- コーディング規約: `.claude/settings.json` 参照

## レビュー観点
1. **設計品質**
   - [ ] 単一責任原則の遵守
   - [ ] 適切な抽象化レベル
   - [ ] 依存関係の適切な管理

2. **コード品質**
   - [ ] 型安全性（TypeScript strict mode）
   - [ ] エラーハンドリングの実装
   - [ ] 命名規則の遵守

3. **テスト**
   - [ ] テストカバレッジ80%以上
   - [ ] エッジケースの考慮
   - [ ] 単体テストと統合テストの適切な分離

4. **パフォーマンス**
   - [ ] 不要なレンダリングの回避
   - [ ] メモリリークのチェック
   - [ ] バンドルサイズへの配慮

5. **セキュリティ**
   - [ ] 入力値のバリデーション
   - [ ] XSS対策
   - [ ] 機密情報の適切な管理

## コード
[ここにコードを貼り付け]

## 期待する出力
1. 評価サマリー（良い点・改善点）
2. 具体的な改善提案
3. 修正コード例
4. セキュリティやパフォーマンス上の懸念
```

**`.claude/prompts/testing.md`**:
```markdown
# テストコード生成プロンプト

以下の実装に対してテストコードを生成してください。

## テスト要件
- テストフレームワーク: Vitest
- カバレッジ目標: 80%以上
- テストタイプ: 単体テスト、統合テスト

## テスト観点
1. **正常系**
   - 期待される入力での動作確認
   - 一般的なユースケースのカバー

2. **異常系**
   - エラーハンドリングの確認
   - バリデーションエラーのテスト
   - 境界値テスト

3. **エッジケース**
   - null/undefined処理
   - 空配列・空文字列
   - 極端な値（最大・最小）

4. **非機能要件**
   - パフォーマンステスト
   - メモリリークチェック

## 対象コード
[ここにコードを貼り付け]

## 期待する出力
- 包括的なテストスイート
- テストケースの説明
- モック・スタブの適切な使用
- テスト可読性の高いコード
```

### カスタムスキルの共有

**`.claude/skills/team-standards.md`**:
```markdown
# チーム開発標準スキル

このスキルは、チームの開発標準に準拠したコード生成を支援します。

## 使用方法
Claude Codeでコード生成時に、このスキルを参照することで
チーム標準に沿ったコードが生成されます。

## コーディング標準

### TypeScript
- strict mode有効
- any型の使用禁止（unknown使用を検討）
- 明示的な戻り値の型定義
- 非null アサーション演算子（!）の最小限使用

### React
- 関数コンポーネントのみ使用
- カスタムフックでのロジック分離
- PropTypesは使用せず、TypeScriptの型定義を使用
- useEffect依存配列の適切な管理

### ファイル構成
```
src/
├── components/
│   └── ComponentName/
│       ├── index.tsx           # エクスポート専用
│       ├── ComponentName.tsx   # コンポーネント本体
│       ├── ComponentName.test.tsx
│       ├── ComponentName.module.css
│       └── types.ts
├── hooks/
│   └── useHookName.ts
├── services/
│   └── ServiceName.service.ts
├── utils/
│   └── utilName.ts
└── types/
    └── typeName.ts
```

### 命名規則
- コンポーネント: PascalCase（例: UserCard）
- フック: camelCase with 'use' prefix（例: useAuth）
- ユーティリティ関数: camelCase（例: formatDate）
- 定数: UPPER_SNAKE_CASE（例: API_ENDPOINT）
- 型・インターフェース: PascalCase（例: UserData）

### エラーハンドリング
```typescript
// カスタムエラークラスの使用
class ValidationError extends Error {
  constructor(message: string, public field: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

// try-catchの適切な使用
try {
  await apiCall();
} catch (error) {
  if (error instanceof ValidationError) {
    // バリデーションエラー処理
  } else if (error instanceof NetworkError) {
    // ネットワークエラー処理
  } else {
    // 未知のエラー処理
    logger.error('Unexpected error', error);
    throw error;
  }
}
```
```

## MCP設定の共有

### .mcp.jsonの標準設定

**`.mcp.json`**:
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/username/projects/team-project"
      ],
      "env": {
        "NODE_ENV": "development"
      }
    },
    "github": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-github"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "postgresql": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-postgres",
        "postgresql://localhost/team_dev_db"
      ]
    },
    "slack": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-slack"
      ],
      "env": {
        "SLACK_BOT_TOKEN": "${SLACK_BOT_TOKEN}",
        "SLACK_TEAM_ID": "${SLACK_TEAM_ID}"
      }
    }
  }
}
```

### MCPサーバー設定テンプレート

**`team-config/mcp-setup.md`**:
```markdown
# MCP サーバーセットアップガイド

## 前提条件
- Node.js 18以上
- 各サービスのAPIトークン

## セットアップ手順

### 1. 環境変数の設定
`.env.local` ファイルを作成：
```bash
# GitHub
GITHUB_TOKEN=ghp_your_token_here

# Slack
SLACK_BOT_TOKEN=xoxb-your-token-here
SLACK_TEAM_ID=T01234567

# その他のサービス
DATABASE_URL=postgresql://localhost/team_dev_db
```

### 2. .mcp.jsonのコピー
```bash
cp team-config/.mcp.json ~/.mcp.json
```

### 3. パスの調整
`.mcp.json` 内のファイルパスを環境に合わせて調整

### 4. 動作確認
```bash
# Claude Codeを起動して動作確認
claude-code --check-mcp
```

## トラブルシューティング

### MCPサーバーが起動しない
- Node.jsバージョンを確認（18以上）
- 環境変数が正しく設定されているか確認
- ログファイルを確認: `~/.claude/logs/mcp.log`

### GitHub MCPが認証エラー
- GitHubトークンのスコープ確認（repo, read:org）
- トークンの有効期限確認
```
```

## 環境変数の管理

### .env.exampleテンプレート

**`.env.example`**:
```bash
# アプリケーション設定
NODE_ENV=development
PORT=3000
APP_URL=http://localhost:3000

# データベース
DATABASE_URL=postgresql://localhost:5432/team_dev_db
DATABASE_POOL_SIZE=10

# 認証
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=your-refresh-secret-here

# 外部サービス
# GitHub
GITHUB_TOKEN=ghp_your_personal_access_token
GITHUB_ORG=your-organization

# Slack
SLACK_BOT_TOKEN=xoxb-your-bot-token
SLACK_SIGNING_SECRET=your-signing-secret
SLACK_TEAM_ID=T01234567

# AWS (本番環境)
AWS_REGION=ap-northeast-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
S3_BUCKET=your-bucket-name

# 監視・ログ
LOG_LEVEL=info
SENTRY_DSN=https://your-sentry-dsn

# 機能フラグ
ENABLE_FEATURE_X=false
ENABLE_EXPERIMENTAL=false
```

### シークレット管理のベストプラクティス

#### 1. ローカル開発環境

**`.gitignore`に追加**:
```
# 環境変数ファイル
.env
.env.local
.env.*.local

# Claude Code設定（プライベート情報含む）
.claude/secrets/
.mcp.json
```

#### 2. チーム共有のための安全な方法

**オプション1: 1Passwordなどのシークレット管理ツール**
```bash
# 1Password CLIでシークレット取得
op read "op://Development/TeamProject/GITHUB_TOKEN"
```

**オプション2: dotenv-vaultの使用**
```bash
# シークレットの暗号化と共有
npx dotenv-vault new
npx dotenv-vault keys
npx dotenv-vault push
```

**オプション3: チーム用セットアップスクリプト**

**`scripts/setup-secrets.sh`**:
```bash
#!/bin/bash

echo "🔐 環境変数のセットアップ"

# .envファイルが存在するか確認
if [ -f .env ]; then
    echo "⚠️  .envファイルが既に存在します。上書きしますか？ (y/N)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        echo "セットアップを中止しました"
        exit 0
    fi
fi

# .env.exampleからコピー
cp .env.example .env

echo ""
echo "以下の環境変数を設定してください："
echo ""

# 必須の環境変数を入力
echo "📝 GitHub Personal Access Token (repo, read:org権限が必要):"
read -r GITHUB_TOKEN
echo "GITHUB_TOKEN=$GITHUB_TOKEN" >> .env

echo ""
echo "📝 Slack Bot Token (xoxb-で始まるトークン):"
read -r SLACK_BOT_TOKEN
echo "SLACK_BOT_TOKEN=$SLACK_BOT_TOKEN" >> .env

echo ""
echo "📝 Slack Team ID (T で始まるID):"
read -r SLACK_TEAM_ID
echo "SLACK_TEAM_ID=$SLACK_TEAM_ID" >> .env

echo ""
echo "📝 JWT Secret (ランダムな文字列を生成しますか？ y/N):"
read -r generate_secret
if [[ "$generate_secret" =~ ^[Yy]$ ]]; then
    JWT_SECRET=$(openssl rand -base64 32)
    echo "GENERATED: $JWT_SECRET"
else
    echo "JWT Secretを入力してください:"
    read -r JWT_SECRET
fi
echo "JWT_SECRET=$JWT_SECRET" >> .env

echo ""
echo "✅ セットアップ完了！"
echo ""
echo "次のステップ:"
echo "1. .envファイルの内容を確認"
echo "2. 必要に応じて追加の環境変数を設定"
echo "3. npm run dev でアプリケーションを起動"
```

#### 3. CI/CD環境でのシークレット管理

**GitHub Actions シークレット設定**:
```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    env:
      NODE_ENV: test
      DATABASE_URL: postgresql://postgres:postgres@localhost/test_db
      # GitHub Secretsから環境変数を設定
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      SLACK_BOT_TOKEN: ${{ secrets.SLACK_BOT_TOKEN }}
      JWT_SECRET: ${{ secrets.JWT_SECRET }}

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test
```

## 依存関係の統一

### package.jsonの管理

**厳密なバージョン管理**:
```json
{
  "name": "team-project",
  "version": "1.0.0",
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  },
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "test": "vitest",
    "lint": "eslint . --ext .ts,.tsx",
    "format": "prettier --write .",
    "type-check": "tsc --noEmit",
    "prepare": "husky install"
  },
  "dependencies": {
    "react": "18.2.0",
    "react-dom": "18.2.0"
  },
  "devDependencies": {
    "@types/react": "18.2.0",
    "@types/react-dom": "18.2.0",
    "@typescript-eslint/eslint-plugin": "6.0.0",
    "@typescript-eslint/parser": "6.0.0",
    "eslint": "8.45.0",
    "prettier": "3.0.0",
    "typescript": "5.2.0",
    "vite": "4.4.0",
    "vitest": "0.34.0"
  }
}
```

⚠️ **重要**: チーム開発では `^` や `~` を使わず、厳密なバージョンを指定することを推奨

### Lock filesの管理

#### npm
```bash
# package-lock.jsonを必ずコミット
git add package-lock.json

# 依存関係のインストール（lock fileを尊重）
npm ci

# 依存関係の更新（慎重に）
npm update
npm audit fix
```

#### pnpm（推奨）
```bash
# pnpmの使用を推奨（高速・厳密な依存解決）
npm install -g pnpm

# package.jsonから依存関係をインストール
pnpm install

# pnpm-lock.yamlをコミット
git add pnpm-lock.yaml
```

**`.npmrc`設定**:
```
# 厳密なバージョン管理
save-exact=true

# 自動的なpeer依存関係インストール
auto-install-peers=true

# パッケージロック
package-lock=true

# エンジンの厳密チェック
engine-strict=true
```

### 依存関係の監査

**定期的なセキュリティ監査**:
```bash
# 脆弱性チェック
npm audit

# 自動修正
npm audit fix

# 依存関係の更新確認
npx npm-check-updates

# インタラクティブな更新
npx npm-check-updates -i
```

## Docker活用

### 開発環境のコンテナ化

**`Dockerfile.dev`**:
```dockerfile
FROM node:18-alpine

# 作業ディレクトリ
WORKDIR /app

# 依存関係のインストール
COPY package*.json ./
RUN npm ci

# アプリケーションコードのコピー
COPY . .

# ポート公開
EXPOSE 3000

# 開発サーバー起動
CMD ["npm", "run", "dev"]
```

**`docker-compose.yml`**:
```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/team_dev_db
    depends_on:
      - db
      - redis

  db:
    image: postgres:15-alpine
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=team_dev_db
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  adminer:
    image: adminer
    ports:
      - "8080:8080"
    depends_on:
      - db

volumes:
  postgres_data:
  redis_data:
```

### Dev Containerの活用

**`.devcontainer/devcontainer.json`**:
```json
{
  "name": "Team Project Dev Container",
  "dockerComposeFile": "../docker-compose.yml",
  "service": "app",
  "workspaceFolder": "/app",

  "customizations": {
    "vscode": {
      "extensions": [
        "dbaeumer.vscode-eslint",
        "esbenp.prettier-vscode",
        "ms-vscode.vscode-typescript-next",
        "bradlc.vscode-tailwindcss"
      ],
      "settings": {
        "editor.formatOnSave": true,
        "editor.defaultFormatter": "esbenp.prettier-vscode",
        "typescript.tsdk": "node_modules/typescript/lib"
      }
    }
  },

  "forwardPorts": [3000, 5432, 6379, 8080],

  "postCreateCommand": "npm install",

  "remoteUser": "node"
}
```

### 使用方法

```bash
# Docker環境の起動
docker-compose up -d

# ログの確認
docker-compose logs -f app

# コンテナ内でコマンド実行
docker-compose exec app npm test

# 環境のクリーンアップ
docker-compose down -v
```

## CI/CD環境の統一

### GitHub Actionsワークフロー

**`.github/workflows/ci.yml`**:
```yaml
name: Continuous Integration

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint-and-format:
    name: Lint and Format Check
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run ESLint
        run: npm run lint

      - name: Check formatting
        run: npm run format:check

  type-check:
    name: TypeScript Type Check
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Type check
        run: npm run type-check

  test:
    name: Unit Tests
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15-alpine
        env:
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test -- --coverage
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json

  build:
    name: Build
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build
          path: dist/
```

### 環境別の設定管理

**`.github/workflows/deploy-staging.yml`**:
```yaml
name: Deploy to Staging

on:
  push:
    branches: [develop]

jobs:
  deploy:
    name: Deploy to Staging Environment
    runs-on: ubuntu-latest
    environment: staging

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          NODE_ENV: staging
          VITE_API_URL: ${{ secrets.STAGING_API_URL }}

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          working-directory: ./
```

## トラブルシューティング

### よくある問題と解決方法

#### 1. 依存関係のバージョン不一致

**問題**: チームメンバー間で異なるパッケージバージョンが使用されている

```bash
# 解決方法1: lock fileから再インストール
rm -rf node_modules
npm ci

# 解決方法2: package-lock.jsonの再生成
rm package-lock.json
npm install

# 解決方法3: pnpmを使用（より厳密な依存解決）
npm install -g pnpm
pnpm install
```

#### 2. 環境変数が読み込まれない

**問題**: `.env`ファイルの環境変数がアプリケーションで使用できない

```bash
# 解決方法1: dotenvの確認
npm install --save-dev dotenv

# アプリケーションの最初に追加
# main.ts または index.ts
import 'dotenv/config';

# 解決方法2: Viteの場合、VITE_プレフィックスが必要
# .env
VITE_API_URL=http://localhost:3000

# 使用
const apiUrl = import.meta.env.VITE_API_URL;
```

#### 3. MCPサーバーが起動しない

**問題**: Claude CodeでMCPサーバーに接続できない

```bash
# 解決方法1: MCPサーバーログの確認
cat ~/.claude/logs/mcp.log

# 解決方法2: 手動でMCPサーバーをテスト
npx @modelcontextprotocol/server-filesystem /path/to/project

# 解決方法3: Node.jsバージョン確認
node --version  # 18以上が必要
nvm use 18
```

#### 4. Dockerコンテナでホットリロードが動作しない

**問題**: ファイル変更時に自動リロードされない

**解決方法**: `docker-compose.yml`のvolume設定を確認
```yaml
services:
  app:
    volumes:
      - .:/app
      - /app/node_modules  # この行が重要
    environment:
      - CHOKIDAR_USEPOLLING=true  # ファイル監視の有効化
```

#### 5. CI/CDで環境変数が見つからない

**問題**: GitHub Actionsでビルドが失敗

**解決方法**: GitHubリポジトリのSecretsを設定
```bash
# GitHub > Settings > Secrets and variables > Actions
# 必要なシークレットを追加:
# - GITHUB_TOKEN (自動提供)
# - VERCEL_TOKEN
# - DATABASE_URL
# etc.
```

## ベストプラクティス

### 1. 設定ファイルのバージョン管理

**推奨される管理方法**:
```bash
# コミットすべきファイル
git add .claude/settings.json
git add .claude/prompts/
git add .claude/skills/
git add .mcp.json.example  # .mcp.jsonの代わりにexampleをコミット
git add .env.example       # .envの代わりにexampleをコミット
git add docker-compose.yml
git add .github/workflows/

# コミットしないファイル（.gitignoreに追加）
.env
.env.local
.mcp.json  # パス情報を含むため
.claude/memory/local-*.md
```

### 2. ドキュメント化

**`SETUP.md`の作成**:
```markdown
# 開発環境セットアップガイド

## 前提条件
- Node.js 18以上
- npm 9以上（またはpnpm 8以上）
- Docker Desktop（オプション）

## セットアップ手順

### 1. リポジトリのクローン
\`\`\`bash
git clone https://github.com/your-org/team-project.git
cd team-project
\`\`\`

### 2. 依存関係のインストール
\`\`\`bash
npm install
\`\`\`

### 3. 環境変数の設定
\`\`\`bash
cp .env.example .env
# .envファイルを編集して必要な値を設定
\`\`\`

### 4. Claude Code設定
\`\`\`bash
# MCPサーバー設定
cp .mcp.json.example ~/.mcp.json
# パスを自分の環境に合わせて調整
\`\`\`

### 5. データベースのセットアップ
\`\`\`bash
# Dockerを使用する場合
docker-compose up -d db

# マイグレーション実行
npm run db:migrate
\`\`\`

### 6. 開発サーバーの起動
\`\`\`bash
npm run dev
\`\`\`

## トラブルシューティング
問題が発生した場合は[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)を参照
```

### 3. 定期的な設定の見直し

**月次チェックリスト**:
```markdown
## 環境設定メンテナンスチェックリスト

### 依存関係
- [ ] npm audit実行と脆弱性対応
- [ ] 依存パッケージの更新確認
- [ ] 不要な依存関係の削除

### 設定ファイル
- [ ] .claude/settings.jsonの見直し
- [ ] .mcp.jsonの有効性確認
- [ ] 環境変数の棚卸し

### ドキュメント
- [ ] SETUP.mdの更新
- [ ] 新メンバーオンボーディング手順の確認
- [ ] トラブルシューティングガイドの更新

### CI/CD
- [ ] GitHub Actionsワークフローの確認
- [ ] ビルド時間の最適化
- [ ] テストカバレッジの確認
```

## 次のステップ

共有開発環境の構築が完了したら、次の段階に進みましょう:

### 即座に実践
1. **[共有コンテキスト管理](03-shared-context.md)** - チーム知識の共有システム構築
2. **[GitHub連携](04-github-integration.md)** - バージョン管理との統合

### 継続的改善
1. 定期的な設定レビューと更新
2. 新しいツール・技術の評価と導入
3. チームフィードバックによる改善

---

**ナビゲーション:**
- ⬅️ 前へ: [チーム環境構築](01-team-setup.md) - 基本的な開発環境統一
- ➡️ 次へ: [共有コンテキスト管理](03-shared-context.md) - チーム知識の共有

**関連ドキュメント:**
- [チーム開発概要](README.md) - チーム開発の全体像
- [外部ツール連携](../02-features/integration-tools.md) - 開発ツールとの連携
- [トラブルシューティング](../09-troubleshooting/README.md) - 問題解決ガイド

**タグ:** `#チーム開発` `#共有環境` `#設定管理` `#Docker` `#CI/CD` `#環境変数` `#MCP` `#依存関係管理`
