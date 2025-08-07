# 外部ツール連携

Claude Codeの外部ツール連携機能について説明します。Git、テストツール、デプロイツールとの連携により、効率的な開発ワークフローを構築できます。

## 外部ツール連携とは

外部ツール連携機能は、Claude Codeを既存の開発ツールチェーンに統合し、シームレスな開発体験を提供する機能です。手動作業を自動化し、開発効率を大幅に向上させます。

### 主な特徴

- **Gitワークフローの自動化**: コミット、ブランチ管理、マージの支援
- **CI/CDパイプラインの構築**: 自動テスト、ビルド、デプロイの設定
- **テスト自動化の支援**: テストコードの生成と実行
- **プロジェクト管理ツール連携**: Issue、タスク管理との統合

## Git連携

### 1. 自動コミットメッセージ生成

**プロンプト:**
```
以下の変更内容に基づいて、適切なコミットメッセージを生成してください：

変更ファイル:
- src/components/UserProfile.tsx (修正)
- src/hooks/useAuth.ts (新規)
- src/types/user.ts (修正)
- tests/components/UserProfile.test.tsx (新規)

変更内容:
- ユーザープロフィール表示機能の追加
- 認証状態管理フックの実装
- ユーザー型定義の拡張
- 単体テストの追加
```

**生成されるコミットメッセージ:**
```
feat: add user profile display functionality

- Add UserProfile component with avatar and user info display
- Implement useAuth hook for authentication state management
- Extend User type definition with profile fields
- Add comprehensive unit tests for UserProfile component

Changes:
- src/components/UserProfile.tsx: new profile display component
- src/hooks/useAuth.ts: authentication state management
- src/types/user.ts: extend User interface
- tests/components/UserProfile.test.tsx: unit tests

Closes #123
```

### 2. ブランチ戦略の支援

**プロンプト:**
```
Git Flowに従って、新機能開発のためのブランチ戦略を提案してください。

機能: ユーザー通知システム
現在のブランチ: main
チーム規模: 5人
リリースサイクル: 2週間
```

**提案されるブランチ戦略:**
```
Git Flow ブランチ戦略:

1. 機能開発ブランチの作成:
```bash
# mainブランチから最新を取得
git checkout main
git pull origin main

# 機能ブランチを作成
git checkout -b feature/user-notification-system

# 作業開始
```

2. 開発中のコミット戦略:
```bash
# 小さな単位でコミット
git add src/services/NotificationService.ts
git commit -m "feat: add basic notification service structure"

git add src/components/NotificationBell.tsx
git commit -m "feat: add notification bell component"

git add tests/services/NotificationService.test.ts
git commit -m "test: add notification service unit tests"
```

3. プルリクエスト準備:
```bash
# リベースで履歴を整理
git rebase -i HEAD~3

# mainブランチの最新変更を取り込み
git checkout main
git pull origin main
git checkout feature/user-notification-system
git rebase main

# プッシュ
git push origin feature/user-notification-system
```

4. プルリクエストテンプレート:
```markdown
## 概要
ユーザー通知システムの実装

## 変更内容
- [ ] NotificationServiceの実装
- [ ] NotificationBellコンポーネントの追加
- [ ] 通知データモデルの定義
- [ ] 単体テストの追加

## テスト
- [ ] 単体テスト: 全て通過
- [ ] 統合テスト: 通知の送受信確認
- [ ] E2Eテスト: ユーザーフローの確認

## 関連Issue
Closes #123

## スクリーンショット
[必要に応じて追加]
```

5. マージ後のクリーンアップ:
```bash
# 機能ブランチの削除
git branch -d feature/user-notification-system
git push origin --delete feature/user-notification-system
```
```

### 3. 自動的なコードレビュー準備

**プロンプト:**
```
プルリクエストのレビュー準備として、
以下のチェックリストを自動実行するスクリプトを作成してください：

チェック項目:
- リンターの実行
- テストの実行
- ビルドの確認
- セキュリティスキャン
- 依存関係の脆弱性チェック
```

**生成されるスクリプト:**
```bash
#!/bin/bash
# pre-pr-check.sh - プルリクエスト前の自動チェック

set -e

echo "🔍 プルリクエスト準備チェックを開始..."

# 1. リンターの実行
echo "📝 リンターを実行中..."
npm run lint
if [ $? -eq 0 ]; then
    echo "✅ リンターチェック: 通過"
else
    echo "❌ リンターチェック: 失敗"
    exit 1
fi

# 2. フォーマッターの実行
echo "🎨 コードフォーマットを確認中..."
npm run format:check
if [ $? -eq 0 ]; then
    echo "✅ フォーマットチェック: 通過"
else
    echo "❌ フォーマットチェック: 失敗"
    echo "💡 'npm run format' を実行してください"
    exit 1
fi

# 3. 型チェック
echo "🔍 TypeScript型チェックを実行中..."
npm run type-check
if [ $? -eq 0 ]; then
    echo "✅ 型チェック: 通過"
else
    echo "❌ 型チェック: 失敗"
    exit 1
fi

# 4. テストの実行
echo "🧪 テストを実行中..."
npm run test:coverage
if [ $? -eq 0 ]; then
    echo "✅ テスト: 通過"
else
    echo "❌ テスト: 失敗"
    exit 1
fi

# 5. ビルドの確認
echo "🏗️ ビルドを確認中..."
npm run build
if [ $? -eq 0 ]; then
    echo "✅ ビルド: 成功"
else
    echo "❌ ビルド: 失敗"
    exit 1
fi

# 6. セキュリティスキャン
echo "🔒 セキュリティスキャンを実行中..."
npm audit --audit-level=moderate
if [ $? -eq 0 ]; then
    echo "✅ セキュリティスキャン: 通過"
else
    echo "⚠️ セキュリティスキャン: 脆弱性が検出されました"
    echo "💡 'npm audit fix' を実行してください"
fi

# 7. 依存関係の確認
echo "📦 依存関係を確認中..."
npm ls --depth=0
if [ $? -eq 0 ]; then
    echo "✅ 依存関係: 正常"
else
    echo "❌ 依存関係: 問題があります"
    exit 1
fi

# 8. コミットメッセージの確認
echo "📝 コミットメッセージを確認中..."
git log --oneline -n 5
echo "💡 コミットメッセージがConventional Commitsに従っているか確認してください"

echo ""
echo "🎉 全てのチェックが完了しました！"
echo "📋 プルリクエストの準備ができています"
echo ""
echo "次のステップ:"
echo "1. git push origin <branch-name>"
echo "2. GitHubでプルリクエストを作成"
echo "3. レビュアーを指定"
```

**package.jsonへの追加:**
```json
{
  "scripts": {
    "pre-pr": "./scripts/pre-pr-check.sh",
    "lint": "eslint src --ext .ts,.tsx",
    "format": "prettier --write src",
    "format:check": "prettier --check src",
    "type-check": "tsc --noEmit",
    "test:coverage": "jest --coverage",
    "build": "webpack --mode production"
  }
}
```

## CI/CD連携

### 1. GitHub Actions設定

**プロンプト:**
```
Node.js Reactアプリケーション用のGitHub Actionsワークフローを作成してください。

要件:
- プルリクエスト時の自動テスト
- mainブランチへのマージ時の自動デプロイ
- 複数のNode.jsバージョンでのテスト
- テストカバレッジレポート
- セキュリティスキャン
```

**生成されるワークフロー:**
```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    name: Test
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [16.x, 18.x, 20.x]
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
    
    - name: Setup Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v4
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linter
      run: npm run lint
    
    - name: Check formatting
      run: npm run format:check
    
    - name: Type check
      run: npm run type-check
    
    - name: Run tests
      run: npm run test:coverage
    
    - name: Upload coverage to Codecov
      if: matrix.node-version == '18.x'
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info
        flags: unittests
        name: codecov-umbrella
    
    - name: Build application
      run: npm run build
    
    - name: Run security audit
      run: npm audit --audit-level=moderate

  security-scan:
    name: Security Scan
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
    
    - name: Run Trivy vulnerability scanner
      uses: aquasecurity/trivy-action@master
      with:
        scan-type: 'fs'
        scan-ref: '.'
        format: 'sarif'
        output: 'trivy-results.sarif'
    
    - name: Upload Trivy scan results to GitHub Security tab
      uses: github/codeql-action/upload-sarif@v2
      with:
        sarif_file: 'trivy-results.sarif'

  deploy:
    name: Deploy
    needs: [test, security-scan]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18.x'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build application
      run: npm run build
      env:
        NODE_ENV: production
    
    - name: Deploy to staging
      run: |
        echo "Deploying to staging environment..."
        # デプロイスクリプトの実行
        npm run deploy:staging
      env:
        DEPLOY_TOKEN: ${{ secrets.DEPLOY_TOKEN }}
        STAGING_URL: ${{ secrets.STAGING_URL }}
    
    - name: Run smoke tests
      run: |
        echo "Running smoke tests..."
        npm run test:smoke
      env:
        TEST_URL: ${{ secrets.STAGING_URL }}
    
    - name: Deploy to production
      if: success()
      run: |
        echo "Deploying to production environment..."
        npm run deploy:production
      env:
        DEPLOY_TOKEN: ${{ secrets.DEPLOY_TOKEN }}
        PRODUCTION_URL: ${{ secrets.PRODUCTION_URL }}
    
    - name: Notify deployment
      if: always()
      uses: 8398a7/action-slack@v3
      with:
        status: ${{ job.status }}
        channel: '#deployments'
        webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### 2. Docker統合

**プロンプト:**
```
Node.js Reactアプリケーション用のDockerfileと
docker-compose.ymlを作成してください。

要件:
- マルチステージビルド
- 本番環境用の最適化
- 開発環境用の設定
- データベース（PostgreSQL）との連携
- Redis（キャッシュ）との連携
```

**生成されるDockerfile:**
```dockerfile
# Dockerfile
# マルチステージビルド

# ビルドステージ
FROM node:18-alpine AS builder

WORKDIR /app

# 依存関係のインストール（キャッシュ最適化）
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# ソースコードのコピーとビルド
COPY . .
RUN npm run build

# 本番ステージ
FROM nginx:alpine AS production

# セキュリティ: 非rootユーザーの作成
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# ビルド成果物のコピー
COPY --from=builder /app/build /usr/share/nginx/html

# Nginxの設定
COPY nginx.conf /etc/nginx/nginx.conf

# ヘルスチェック
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

# 開発ステージ
FROM node:18-alpine AS development

WORKDIR /app

# 開発用依存関係のインストール
COPY package*.json ./
RUN npm install

# ソースコードのコピー
COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  # アプリケーション（開発環境）
  app-dev:
    build:
      context: .
      target: development
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://user:password@postgres:5432/myapp
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis
    networks:
      - app-network

  # アプリケーション（本番環境）
  app-prod:
    build:
      context: .
      target: production
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
    depends_on:
      - postgres
      - redis
    networks:
      - app-network
    profiles:
      - production

  # データベース
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"
    networks:
      - app-network

  # Redis（キャッシュ）
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - app-network

  # データベース管理ツール
  pgadmin:
    image: dpage/pgadmin4
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@example.com
      PGADMIN_DEFAULT_PASSWORD: admin
    ports:
      - "5050:80"
    depends_on:
      - postgres
    networks:
      - app-network
    profiles:
      - tools

volumes:
  postgres_data:
  redis_data:

networks:
  app-network:
    driver: bridge
```

**開発用スクリプト（package.json）:**
```json
{
  "scripts": {
    "docker:dev": "docker-compose up app-dev postgres redis",
    "docker:prod": "docker-compose --profile production up app-prod postgres redis",
    "docker:tools": "docker-compose --profile tools up pgadmin",
    "docker:build": "docker-compose build",
    "docker:clean": "docker-compose down -v && docker system prune -f"
  }
}
```

## テストツール連携

### 1. Jest設定の最適化

**プロンプト:**
```
React TypeScriptプロジェクト用のJest設定を最適化してください。

要件:
- TypeScriptサポート
- カバレッジレポート
- モックの自動化
- スナップショットテスト
- 並列実行の最適化
```

**生成される設定:**
```javascript
// jest.config.js
module.exports = {
  // テスト環境
  testEnvironment: 'jsdom',
  
  // TypeScriptサポート
  preset: 'ts-jest',
  
  // ファイル拡張子の解決
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  
  // テストファイルのパターン
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.(ts|tsx|js)',
    '<rootDir>/src/**/?(*.)(spec|test).(ts|tsx|js)'
  ],
  
  // 変換設定
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
    '^.+\\.css$': 'jest-transform-css'
  },
  
  // モジュール名のマッピング
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': 
      '<rootDir>/__mocks__/fileMock.js'
  },
  
  // セットアップファイル
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  
  // カバレッジ設定
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.tsx',
    '!src/serviceWorker.ts',
    '!src/**/*.stories.{ts,tsx}',
    '!src/**/__tests__/**',
    '!src/**/*.test.{ts,tsx}'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json-summary'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  
  // 並列実行の最適化
  maxWorkers: '50%',
  
  // キャッシュ
  cache: true,
  cacheDirectory: '<rootDir>/.jest-cache',
  
  // 詳細な出力
  verbose: true,
  
  // テストタイムアウト
  testTimeout: 10000,
  
  // グローバル設定
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
      isolatedModules: true
    }
  },
  
  // 無視するパターン
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/build/',
    '<rootDir>/dist/'
  ],
  
  // モック設定
  clearMocks: true,
  restoreMocks: true,
  
  // スナップショット設定
  snapshotSerializers: ['enzyme-to-json/serializer']
};
```

### 2. Playwright E2Eテスト設定

**プロンプト:**
```
Playwrightを使用したE2Eテストの設定を作成してください。

要件:
- 複数ブラウザでのテスト
- 並列実行
- スクリーンショット撮影
- レポート生成
- CI/CD統合
```

**生成される設定:**
```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // テストディレクトリ
  testDir: './e2e',
  
  // 並列実行
  fullyParallel: true,
  
  // CI環境での設定
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  // レポート設定
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }]
  ],
  
  // 共通設定
  use: {
    // ベースURL
    baseURL: 'http://localhost:3000',
    
    // トレース設定
    trace: 'on-first-retry',
    
    // スクリーンショット
    screenshot: 'only-on-failure',
    
    // ビデオ録画
    video: 'retain-on-failure',
    
    // ブラウザコンテキスト
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    
    // タイムアウト
    actionTimeout: 10000,
    navigationTimeout: 30000
  },
  
  // プロジェクト設定（複数ブラウザ）
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  
  // ローカル開発サーバー
  webServer: {
    command: 'npm start',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
  
  // 出力ディレクトリ
  outputDir: 'test-results/',
  
  // グローバルセットアップ
  globalSetup: require.resolve('./e2e/global-setup'),
  globalTeardown: require.resolve('./e2e/global-teardown'),
});
```

**E2Eテストの例:**
```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('認証機能', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('ログイン機能', async ({ page }) => {
    // ログインページに移動
    await page.click('[data-testid="login-button"]');
    await expect(page).toHaveURL('/login');
    
    // ログイン情報を入力
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    
    // ログインボタンをクリック
    await page.click('[data-testid="submit-button"]');
    
    // ダッシュボードにリダイレクトされることを確認
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('[data-testid="welcome-message"]')).toBeVisible();
  });

  test('ログアウト機能', async ({ page }) => {
    // 事前にログイン
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="submit-button"]');
    
    // ログアウト
    await page.click('[data-testid="user-menu"]');
    await page.click('[data-testid="logout-button"]');
    
    // ホームページにリダイレクトされることを確認
    await expect(page).toHaveURL('/');
    await expect(page.locator('[data-testid="login-button"]')).toBeVisible();
  });
});
```

## プロジェクト管理ツール連携

### 1. Jira連携

**プロンプト:**
```
JiraのIssueと連携したGitワークフローを設定してください。

要件:
- Issue番号の自動取得
- コミットメッセージとの連携
- プルリクエストでのIssue更新
- 自動的なステータス変更
```

**生成される連携設定:**
```bash
#!/bin/bash
# git-hooks/prepare-commit-msg
# Jira Issue番号を自動的にコミットメッセージに追加

COMMIT_MSG_FILE=$1
COMMIT_SOURCE=$2

# ブランチ名からIssue番号を抽出
BRANCH_NAME=$(git symbolic-ref --short HEAD)
ISSUE_NUMBER=$(echo $BRANCH_NAME | grep -o -E '[A-Z]+-[0-9]+')

if [ -n "$ISSUE_NUMBER" ]; then
    # 既存のコミットメッセージを読み取り
    COMMIT_MSG=$(cat $COMMIT_MSG_FILE)
    
    # Issue番号が既に含まれていない場合のみ追加
    if ! echo "$COMMIT_MSG" | grep -q "$ISSUE_NUMBER"; then
        echo "$COMMIT_MSG" > $COMMIT_MSG_FILE
        echo "" >> $COMMIT_MSG_FILE
        echo "Refs: $ISSUE_NUMBER" >> $COMMIT_MSG_FILE
    fi
fi
```

**GitHub Actions Jira連携:**
```yaml
# .github/workflows/jira-integration.yml
name: Jira Integration

on:
  pull_request:
    types: [opened, closed, merged]
  push:
    branches: [main]

jobs:
  update-jira:
    runs-on: ubuntu-latest
    
    steps:
    - name: Extract Jira Issue
      id: extract
      run: |
        ISSUE=$(echo "${{ github.head_ref }}" | grep -o -E '[A-Z]+-[0-9]+' || echo "")
        echo "issue=$ISSUE" >> $GITHUB_OUTPUT
    
    - name: Update Jira Issue
      if: steps.extract.outputs.issue != ''
      uses: atlassian/gajira-transition@v2.0.1
      with:
        issue: ${{ steps.extract.outputs.issue }}
        transition: "In Review"
      env:
        JIRA_BASE_URL: ${{ secrets.JIRA_BASE_URL }}
        JIRA_USER_EMAIL: ${{ secrets.JIRA_USER_EMAIL }}
        JIRA_API_TOKEN: ${{ secrets.JIRA_API_TOKEN }}
    
    - name: Add PR Link to Jira
      if: steps.extract.outputs.issue != ''
      uses: atlassian/gajira-comment@v2.0.1
      with:
        issue: ${{ steps.extract.outputs.issue }}
        comment: |
          プルリクエストが作成されました: ${{ github.event.pull_request.html_url }}
          
          変更内容:
          ${{ github.event.pull_request.title }}
```

## 次のステップ

外部ツール連携を理解したら：

1. **[体系的な開発プロセス](../06-development-process/README.md)** - 統合された開発フロー
2. **[チーム開発](../07-team-development/README.md)** - チーム全体でのツール活用
3. **[ビルド自動化](../06-development-process/09-build-automation.md)** - CI/CDの詳細設定

---

**関連ドキュメント:**
- [コードレビュー](code-review.md) - 自動レビューとの連携
- [デバッグサポート](debugging-support.md) - デバッグツールとの統合
- [テスト基礎](../05-testing-basics.md) - テスト自動化の基礎