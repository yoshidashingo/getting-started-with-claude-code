# ビルド自動化

Claude Codeを活用したCI/CDパイプライン構築について説明します。自動化スクリプトの生成と保守の実践的な手法を学習できます。

## ビルド自動化とは

ビルド自動化は、コードのコンパイル、テスト実行、パッケージング、デプロイメントを自動化するプロセスです。Claude Codeを活用することで、効率的で信頼性の高いCI/CDパイプラインを構築できます。

### Claude Code活用の利点

- **設定ファイルの自動生成**: 複雑なCI/CD設定を自動生成
- **ベストプラクティスの適用**: 業界標準に従った設定
- **エラー対応の自動化**: 一般的な問題の自動解決
- **保守性の向上**: 理解しやすい設定とドキュメント

## GitHub Actions による CI/CD

### 基本的なワークフロー作成

**プロンプト:**
```
React TypeScriptプロジェクト用のGitHub Actionsワークフローを作成してください。

要件:
- プルリクエスト時の自動テスト
- mainブランチへのマージ時の自動デプロイ
- 複数のNode.jsバージョンでのテスト
- テストカバレッジレポート
- セキュリティスキャン
- Vercelへの自動デプロイ

プロジェクト構成:
- React 18 + TypeScript
- Jest + Testing Library
- ESLint + Prettier
- Vite ビルドツール
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

env:
  NODE_VERSION_MATRIX: '[16, 18, 20]'

jobs:
  # 静的解析とリンティング
  lint:
    name: Lint and Format Check
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run ESLint
      run: npm run lint
    
    - name: Check Prettier formatting
      run: npm run format:check
    
    - name: TypeScript type check
      run: npm run type-check

  # セキュリティスキャン
  security:
    name: Security Scan
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
    
    - name: Run npm audit
      run: npm audit --audit-level=moderate
    
    - name: Run Snyk security scan
      uses: snyk/actions/node@master
      env:
        SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
      with:
        args: --severity-threshold=medium

  # テスト実行（複数Node.jsバージョン）
  test:
    name: Test
    runs-on: ubuntu-latest
    needs: [lint]
    
    strategy:
      matrix:
        node-version: [16, 18, 20]
    
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
    
    - name: Run tests with coverage
      run: npm run test:coverage
    
    - name: Upload coverage to Codecov
      if: matrix.node-version == '18'
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info
        flags: unittests
        name: codecov-umbrella
        fail_ci_if_error: true

  # ビルドテスト
  build:
    name: Build
    runs-on: ubuntu-latest
    needs: [lint, test]
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build application
      run: npm run build
      env:
        NODE_ENV: production
    
    - name: Upload build artifacts
      uses: actions/upload-artifact@v3
      with:
        name: build-files
        path: dist/
        retention-days: 7

  # デプロイ（mainブランチのみ）
  deploy:
    name: Deploy to Vercel
    runs-on: ubuntu-latest
    needs: [security, test, build]
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
    
    - name: Download build artifacts
      uses: actions/download-artifact@v3
      with:
        name: build-files
        path: dist/
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
        vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
        vercel-args: '--prod'
    
    - name: Comment PR with deployment URL
      if: github.event_name == 'pull_request'
      uses: actions/github-script@v6
      with:
        script: |
          github.rest.issues.createComment({
            issue_number: context.issue.number,
            owner: context.repo.owner,
            repo: context.repo.repo,
            body: '🚀 Deployed to production: https://your-app.vercel.app'
          })

  # 通知
  notify:
    name: Notify
    runs-on: ubuntu-latest
    needs: [deploy]
    if: always()
    
    steps:
    - name: Notify Slack
      if: failure()
      uses: 8398a7/action-slack@v3
      with:
        status: failure
        channel: '#deployments'
        webhook_url: ${{ secrets.SLACK_WEBHOOK }}
        
    - name: Notify success
      if: success()
      uses: 8398a7/action-slack@v3
      with:
        status: success
        channel: '#deployments'
        webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```#
## 高度なワークフロー設定

**プロンプト:**
```
以下の要件を満たす高度なCI/CDパイプラインを作成してください：

要件:
- 環境別デプロイ（staging/production）
- データベースマイグレーション
- E2Eテストの実行
- パフォーマンステスト
- 自動ロールバック機能
- 承認プロセス
```

**生成される高度なワークフロー:**
```yaml
# .github/workflows/advanced-ci-cd.yml
name: Advanced CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  # ... 基本的なjobs（lint, test, build）

  # E2Eテスト
  e2e-test:
    name: E2E Tests
    runs-on: ubuntu-latest
    needs: [build]
    
    services:
      postgres:
        image: postgres:13
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: testdb
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Install Playwright browsers
      run: npx playwright install --with-deps
    
    - name: Run database migrations
      run: npm run db:migrate
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/testdb
    
    - name: Start application
      run: |
        npm run build
        npm run start &
        sleep 10
      env:
        NODE_ENV: test
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/testdb
    
    - name: Run E2E tests
      run: npm run test:e2e
    
    - name: Upload E2E test results
      uses: actions/upload-artifact@v3
      if: always()
      with:
        name: e2e-results
        path: test-results/

  # パフォーマンステスト
  performance-test:
    name: Performance Tests
    runs-on: ubuntu-latest
    needs: [build]
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build application
      run: npm run build
    
    - name: Run Lighthouse CI
      run: |
        npm install -g @lhci/cli@0.12.x
        lhci autorun
      env:
        LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
    
    - name: Run load tests
      run: npm run test:load

  # Staging デプロイ
  deploy-staging:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    needs: [e2e-test, performance-test]
    if: github.ref == 'refs/heads/develop'
    environment: staging
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
    
    - name: Deploy to staging
      run: |
        echo "Deploying to staging environment..."
        # デプロイスクリプト実行
      env:
        STAGING_API_KEY: ${{ secrets.STAGING_API_KEY }}
    
    - name: Run smoke tests
      run: npm run test:smoke
      env:
        TEST_URL: ${{ secrets.STAGING_URL }}
    
    - name: Update deployment status
      run: |
        curl -X POST "${{ secrets.SLACK_WEBHOOK }}" \
        -H 'Content-type: application/json' \
        --data '{"text":"🚀 Staging deployment successful: ${{ secrets.STAGING_URL }}"}'

  # Production デプロイ（承認必要）
  deploy-production:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: [deploy-staging]
    if: github.ref == 'refs/heads/main'
    environment: 
      name: production
      url: https://your-app.com
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
    
    - name: Create deployment
      id: deployment
      uses: actions/github-script@v6
      with:
        script: |
          const deployment = await github.rest.repos.createDeployment({
            owner: context.repo.owner,
            repo: context.repo.repo,
            ref: context.sha,
            environment: 'production',
            required_contexts: [],
            auto_merge: false
          });
          return deployment.data.id;
    
    - name: Run database migrations
      run: npm run db:migrate:prod
      env:
        DATABASE_URL: ${{ secrets.PROD_DATABASE_URL }}
    
    - name: Deploy to production
      id: deploy
      run: |
        echo "Deploying to production..."
        # 実際のデプロイスクリプト
        echo "deployment_url=https://your-app.com" >> $GITHUB_OUTPUT
      env:
        PROD_API_KEY: ${{ secrets.PROD_API_KEY }}
    
    - name: Update deployment status - success
      if: success()
      uses: actions/github-script@v6
      with:
        script: |
          await github.rest.repos.createDeploymentStatus({
            owner: context.repo.owner,
            repo: context.repo.repo,
            deployment_id: ${{ steps.deployment.outputs.result }},
            state: 'success',
            environment_url: '${{ steps.deploy.outputs.deployment_url }}'
          });
    
    - name: Update deployment status - failure
      if: failure()
      uses: actions/github-script@v6
      with:
        script: |
          await github.rest.repos.createDeploymentStatus({
            owner: context.repo.owner,
            repo: context.repo.repo,
            deployment_id: ${{ steps.deployment.outputs.result }},
            state: 'failure'
          });
    
    - name: Rollback on failure
      if: failure()
      run: |
        echo "Rolling back deployment..."
        # ロールバックスクリプト実行
        npm run deploy:rollback
      env:
        PROD_API_KEY: ${{ secrets.PROD_API_KEY }}
```

## Docker を使用したビルド

### マルチステージDockerfile

**プロンプト:**
```
Node.js React アプリケーション用の最適化されたDockerfileを作成してください。

要件:
- マルチステージビルド
- セキュリティベストプラクティス
- 最小限のイメージサイズ
- 本番環境用の最適化
```

**生成されるDockerfile:**
```dockerfile
# マルチステージビルド

# ビルドステージ
FROM node:18-alpine AS builder

# セキュリティ: 非rootユーザーの作成
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

WORKDIR /app

# 依存関係のインストール（レイヤーキャッシュ最適化）
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# 開発依存関係のインストール
COPY package*.json ./
RUN npm ci

# ソースコードのコピーとビルド
COPY . .
RUN npm run build

# 本番ステージ
FROM nginx:alpine AS production

# セキュリティ設定
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# 不要なパッケージの削除
RUN apk del --no-cache \
    && rm -rf /var/cache/apk/*

# ビルド成果物のコピー
COPY --from=builder --chown=nextjs:nodejs /app/dist /usr/share/nginx/html

# Nginxの設定
COPY nginx.conf /etc/nginx/nginx.conf

# セキュリティヘッダーの設定
COPY security-headers.conf /etc/nginx/conf.d/security-headers.conf

# ヘルスチェック
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# 非rootユーザーで実行
USER nextjs

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose for Development

**プロンプト:**
```
開発環境用のDocker Compose設定を作成してください。

要件:
- アプリケーション、データベース、Redis
- ホットリロード対応
- 環境変数管理
- ボリュームマウント
- ネットワーク設定
```

**生成されるdocker-compose.yml:**
```yaml
version: '3.8'

services:
  # アプリケーション
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
      target: development
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
      - /app/dist
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://user:password@postgres:5432/myapp
      - REDIS_URL=redis://redis:6379
      - API_BASE_URL=http://localhost:3001
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_started
    networks:
      - app-network
    restart: unless-stopped

  # API サーバー
  api:
    build:
      context: ./api
      dockerfile: Dockerfile.dev
    ports:
      - "3001:3001"
    volumes:
      - ./api:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://user:password@postgres:5432/myapp
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=dev-secret-key
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_started
    networks:
      - app-network
    restart: unless-stopped

  # データベース
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database/init:/docker-entrypoint-initdb.d
    ports:
      - "5432:5432"
    networks:
      - app-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user -d myapp"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

  # Redis
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - app-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

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

## 品質ゲートの設定

### SonarQube 統合

**プロンプト:**
```
SonarQubeを使用した品質ゲートを設定してください。

要件:
- コード品質チェック
- セキュリティ脆弱性検出
- 技術的負債の測定
- カバレッジ要件
- 品質ゲート失敗時のビルド停止
```

**生成される設定:**
```yaml
# .github/workflows/quality-gate.yml
name: Quality Gate

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  sonarqube:
    name: SonarQube Analysis
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      with:
        fetch-depth: 0
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests with coverage
      run: npm run test:coverage
    
    - name: SonarQube Scan
      uses: sonarqube-quality-gate-action@master
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
      with:
        scanMetadataReportFile: target/sonar/report-task.txt
    
    - name: Quality Gate Check
      uses: sonarqube-quality-gate-action@master
      timeout-minutes: 5
      env:
        SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```

**sonar-project.properties:**
```properties
# SonarQube設定
sonar.projectKey=my-react-app
sonar.organization=my-org
sonar.host.url=https://sonarcloud.io

# ソースコード設定
sonar.sources=src
sonar.tests=src
sonar.test.inclusions=**/*.test.ts,**/*.test.tsx,**/*.spec.ts,**/*.spec.tsx
sonar.exclusions=**/node_modules/**,**/dist/**,**/coverage/**

# カバレッジ設定
sonar.javascript.lcov.reportPaths=coverage/lcov.info
sonar.coverage.exclusions=**/*.test.ts,**/*.test.tsx,**/*.spec.ts,**/*.spec.tsx

# 品質ゲート設定
sonar.qualitygate.wait=true
```

## 次のステップ

ビルド自動化を理解したら：

1. **[デプロイ自動化](08-deployment-automation.md)** - 本番環境への自動デプロイ
2. **[チーム開発](../07-team-development/README.md)** - チーム全体での自動化活用
3. **[外部ツール連携](../02-features/integration-tools.md)** - 高度なツール統合

---

**関連ドキュメント:**
- [単体テスト](06-unit-testing.md) - テスト自動化の基礎
- [外部ツール連携](../02-features/integration-tools.md) - CI/CDツールとの連携
- [トラブルシューティング](../09-troubleshooting.md) - ビルドエラーの解決