# ビルド自動化

CI/CDパイプラインの構築とClaude Codeを活用した自動化戦略について説明します。GitHub Actions、Docker、デプロイメント自動化の実装方法を学習できます。

## ビルド自動化とは

ビルド自動化は、コードのコンパイル、テスト実行、デプロイメントなどの開発プロセスを自動化することです。継続的インテグレーション（CI）と継続的デプロイメント（CD）により、開発効率と品質を向上させます。

### ビルド自動化の利点

- **品質保証**: 自動テストによる品質維持
- **効率化**: 手動作業の削減
- **一貫性**: 環境間での一貫したビルド
- **早期発見**: 問題の早期検出と修正
- **デプロイ安全性**: 自動化されたデプロイプロセス

## Claude Codeでのビルド自動化設計

### GitHub Actions ワークフロー設計

**プロンプト例:**
```
Node.js + TypeScriptプロジェクトの
GitHub Actionsワークフローを作成してください。

要件:
- プルリクエスト時の自動テスト
- main ブランチへのマージ時の自動デプロイ
- 複数のNode.jsバージョンでのテスト
- テストカバレッジレポート
- セキュリティスキャン
- Docker イメージのビルドとプッシュ

ワークフロー:
1. コードチェックアウト
2. 依存関係のインストール
3. リント・フォーマットチェック
4. 単体テスト実行
5. 結合テスト実行
6. E2Eテスト実行
7. セキュリティスキャン
8. ビルド
9. デプロイ（本番環境）
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
  NODE_VERSION: '18'
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  # リント・フォーマットチェック
  lint:
    name: Lint and Format Check
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run ESLint
      run: npm run lint
      
    - name: Check Prettier formatting
      run: npm run format:check
      
    - name: TypeScript type check
      run: npm run type-check

  # 単体テスト
  unit-tests:
    name: Unit Tests
    runs-on: ubuntu-latest
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
      
    - name: Run unit tests
      run: npm run test:unit -- --coverage
      
    - name: Upload coverage to Codecov
      if: matrix.node-version == 18
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info
        flags: unittests
        name: codecov-umbrella

  # 結合テスト
  integration-tests:
    name: Integration Tests
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: testdb
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
          
      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run database migrations
      run: npm run db:migrate
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/testdb
        
    - name: Run integration tests
      run: npm run test:integration
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/testdb
        REDIS_URL: redis://localhost:6379

  # E2Eテスト
  e2e-tests:
    name: E2E Tests
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Install Playwright browsers
      run: npx playwright install --with-deps
      
    - name: Build application
      run: npm run build
      
    - name: Start application
      run: npm run start:test &
      
    - name: Wait for application
      run: npx wait-on http://localhost:3000
      
    - name: Run E2E tests
      run: npm run test:e2e
      
    - name: Upload E2E test results
      uses: actions/upload-artifact@v3
      if: failure()
      with:
        name: e2e-test-results
        path: test-results/

  # セキュリティスキャン
  security-scan:
    name: Security Scan
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run npm audit
      run: npm audit --audit-level high
      
    - name: Run Snyk security scan
      uses: snyk/actions/node@master
      env:
        SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
      with:
        args: --severity-threshold=high
        
    - name: Run CodeQL analysis
      uses: github/codeql-action/analyze@v2
      with:
        languages: javascript

  # ビルドとDockerイメージ作成
  build:
    name: Build and Push Docker Image
    runs-on: ubuntu-latest
    needs: [lint, unit-tests, integration-tests, e2e-tests, security-scan]
    if: github.ref == 'refs/heads/main'
    
    permissions:
      contents: read
      packages: write
      
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Setup Docker Buildx
      uses: docker/setup-buildx-action@v3
      
    - name: Login to Container Registry
      uses: docker/login-action@v3
      with:
        registry: ${{ env.REGISTRY }}
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}
        
    - name: Extract metadata
      id: meta
      uses: docker/metadata-action@v5
      with:
        images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
        tags: |
          type=ref,event=branch
          type=ref,event=pr
          type=sha,prefix={{branch}}-
          type=raw,value=latest,enable={{is_default_branch}}
          
    - name: Build and push Docker image
      uses: docker/build-push-action@v5
      with:
        context: .
        platforms: linux/amd64,linux/arm64
        push: true
        tags: ${{ steps.meta.outputs.tags }}
        labels: ${{ steps.meta.outputs.labels }}
        cache-from: type=gha
        cache-to: type=gha,mode=max

  # デプロイ
  deploy:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: [build]
    if: github.ref == 'refs/heads/main'
    environment: production
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Deploy to Kubernetes
      uses: azure/k8s-deploy@v1
      with:
        manifests: |
          k8s/deployment.yaml
          k8s/service.yaml
          k8s/ingress.yaml
        images: |
          ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}
        kubeconfig: ${{ secrets.KUBE_CONFIG }}
        
    - name: Run smoke tests
      run: |
        curl -f https://myapp.example.com/health || exit 1
        
    - name: Notify deployment
      uses: 8398a7/action-slack@v3
      with:
        status: ${{ job.status }}
        channel: '#deployments'
        webhook_url: ${{ secrets.SLACK_WEBHOOK }}
      if: always()
```

### Dockerfile の最適化

**プロンプト例:**
```
Node.js TypeScriptアプリケーション用の
本番環境向けDockerfileを作成してください。

要件:
- マルチステージビルド
- セキュリティベストプラクティス
- 最小限のイメージサイズ
- 非rootユーザーでの実行
- ヘルスチェック機能
- 環境変数の適切な管理

アプリケーション構成:
- Node.js 18
- TypeScript
- Express.js
- PostgreSQL接続
- Redis接続
```

**生成されるDockerfile:**
```dockerfile
# Dockerfile
# マルチステージビルド: ビルドステージ
FROM node:18-alpine AS builder

# セキュリティ: 非rootユーザーの作成
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# 作業ディレクトリの設定
WORKDIR /app

# パッケージファイルをコピー（依存関係キャッシュの最適化）
COPY package*.json ./
COPY tsconfig.json ./

# 依存関係のインストール（開発依存関係も含む）
RUN npm ci --only=production=false && \
    npm cache clean --force

# ソースコードをコピー
COPY . .

# TypeScriptのビルド
RUN npm run build

# 本番用依存関係のみを再インストール
RUN npm ci --only=production && \
    npm cache clean --force

# 本番ステージ
FROM node:18-alpine AS production

# セキュリティアップデート
RUN apk update && apk upgrade && \
    apk add --no-cache dumb-init && \
    rm -rf /var/cache/apk/*

# 非rootユーザーの作成
RUN addgroup -g 1001 -S nodejs && \
    adduser -S appuser -u 1001

# 作業ディレクトリの設定
WORKDIR /app

# 必要なファイルをビルドステージからコピー
COPY --from=builder --chown=appuser:nodejs /app/dist ./dist
COPY --from=builder --chown=appuser:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:nodejs /app/package*.json ./

# ヘルスチェック用スクリプト
COPY --chown=appuser:nodejs healthcheck.js ./

# 非rootユーザーに切り替え
USER appuser

# ポート番号の公開
EXPOSE 3000

# ヘルスチェックの設定
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# アプリケーションの起動（dumb-initを使用してシグナル処理を改善）
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/index.js"]
```

**ヘルスチェックスクリプト:**
```javascript
// healthcheck.js
const http = require('http');

const options = {
  hostname: 'localhost',
  port: process.env.PORT || 3000,
  path: '/health',
  method: 'GET',
  timeout: 2000
};

const request = http.request(options, (res) => {
  if (res.statusCode === 200) {
    process.exit(0);
  } else {
    process.exit(1);
  }
});

request.on('error', () => {
  process.exit(1);
});

request.on('timeout', () => {
  request.destroy();
  process.exit(1);
});

request.end();
```

### Docker Compose for Development

**プロンプト例:**
```
開発環境用のDocker Compose設定を作成してください。

サービス構成:
- Node.js アプリケーション
- PostgreSQL データベース
- Redis キャッシュ
- Nginx リバースプロキシ
- Mailhog（メールテスト用）

要件:
- ホットリロード対応
- ボリュームマウント
- 環境変数管理
- ネットワーク分離
- 開発用ポート公開
```

**生成される設定:**
```yaml
# docker-compose.dev.yml
version: '3.8'

services:
  # Node.js アプリケーション
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    container_name: myapp-dev
    ports:
      - "3000:3000"
      - "9229:9229" # デバッグポート
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/myapp_dev
      - REDIS_URL=redis://redis:6379
      - SMTP_HOST=mailhog
      - SMTP_PORT=1025
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - app-network
    restart: unless-stopped

  # PostgreSQL データベース
  postgres:
    image: postgres:15-alpine
    container_name: myapp-postgres-dev
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_DB=myapp_dev
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./scripts/init-db.sql:/docker-entrypoint-initdb.d/init-db.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - app-network

  # Redis キャッシュ
  redis:
    image: redis:7-alpine
    container_name: myapp-redis-dev
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5
    networks:
      - app-network

  # Nginx リバースプロキシ
  nginx:
    image: nginx:alpine
    container_name: myapp-nginx-dev
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/dev.conf:/etc/nginx/conf.d/default.conf
      - ./nginx/ssl:/etc/nginx/ssl
    depends_on:
      - app
    networks:
      - app-network

  # Mailhog（メールテスト用）
  mailhog:
    image: mailhog/mailhog:latest
    container_name: myapp-mailhog-dev
    ports:
      - "1025:1025" # SMTP
      - "8025:8025" # Web UI
    networks:
      - app-network

  # pgAdmin（データベース管理用）
  pgadmin:
    image: dpage/pgadmin4:latest
    container_name: myapp-pgadmin-dev
    ports:
      - "5050:80"
    environment:
      - PGADMIN_DEFAULT_EMAIL=admin@example.com
      - PGADMIN_DEFAULT_PASSWORD=admin
    volumes:
      - pgadmin_data:/var/lib/pgadmin
    depends_on:
      - postgres
    networks:
      - app-network

volumes:
  postgres_data:
  redis_data:
  pgadmin_data:

networks:
  app-network:
    driver: bridge
```

**開発用Dockerfile:**
```dockerfile
# Dockerfile.dev
FROM node:18-alpine

# 開発用ツールのインストール
RUN apk add --no-cache git

# 作業ディレクトリの設定
WORKDIR /app

# パッケージファイルをコピー
COPY package*.json ./

# 依存関係のインストール（開発依存関係も含む）
RUN npm install

# ソースコードをマウントするためのボリューム
VOLUME ["/app"]

# デバッグポートの公開
EXPOSE 3000 9229

# 開発サーバーの起動（ホットリロード対応）
CMD ["npm", "run", "dev"]
```

### Kubernetes デプロイメント

**プロンプト例:**
```
Kubernetesクラスターへのデプロイメント設定を作成してください。

要件:
- Deployment、Service、Ingress
- ConfigMap、Secret管理
- HorizontalPodAutoscaler
- PersistentVolume
- Liveness/Readiness Probe
- リソース制限
- セキュリティコンテキスト

環境:
- 本番環境
- ステージング環境
- 開発環境
```

**生成されるKubernetes設定:**
```yaml
# k8s/namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: myapp-production
  labels:
    name: myapp-production

---
# k8s/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: myapp-config
  namespace: myapp-production
data:
  NODE_ENV: "production"
  PORT: "3000"
  LOG_LEVEL: "info"
  REDIS_HOST: "redis-service"
  REDIS_PORT: "6379"

---
# k8s/secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: myapp-secrets
  namespace: myapp-production
type: Opaque
data:
  DATABASE_URL: <base64-encoded-database-url>
  JWT_SECRET: <base64-encoded-jwt-secret>
  SMTP_PASSWORD: <base64-encoded-smtp-password>

---
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp-deployment
  namespace: myapp-production
  labels:
    app: myapp
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      securityContext:
        runAsNonRoot: true
        runAsUser: 1001
        fsGroup: 1001
      containers:
      - name: myapp
        image: ghcr.io/myorg/myapp:latest
        ports:
        - containerPort: 3000
          name: http
        env:
        - name: NODE_ENV
          valueFrom:
            configMapKeyRef:
              name: myapp-config
              key: NODE_ENV
        - name: PORT
          valueFrom:
            configMapKeyRef:
              name: myapp-config
              key: PORT
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: myapp-secrets
              key: DATABASE_URL
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: myapp-secrets
              key: JWT_SECRET
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
          timeoutSeconds: 3
          failureThreshold: 3
        securityContext:
          allowPrivilegeEscalation: false
          readOnlyRootFilesystem: true
          capabilities:
            drop:
            - ALL

---
# k8s/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: myapp-service
  namespace: myapp-production
  labels:
    app: myapp
spec:
  selector:
    app: myapp
  ports:
  - name: http
    port: 80
    targetPort: 3000
    protocol: TCP
  type: ClusterIP

---
# k8s/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: myapp-ingress
  namespace: myapp-production
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/rate-limit: "100"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  tls:
  - hosts:
    - myapp.example.com
    secretName: myapp-tls
  rules:
  - host: myapp.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: myapp-service
            port:
              number: 80

---
# k8s/hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: myapp-hpa
  namespace: myapp-production
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: myapp-deployment
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
      - type: Percent
        value: 10
        periodSeconds: 60
    scaleUp:
      stabilizationWindowSeconds: 60
      policies:
      - type: Percent
        value: 50
        periodSeconds: 60
```

### 監視とログ設定

**プロンプト例:**
```
アプリケーションの監視とログ収集設定を作成してください。

監視要件:
- Prometheus メトリクス収集
- Grafana ダッシュボード
- アラート設定
- ログ集約（ELK Stack）
- APM（Application Performance Monitoring）

メトリクス:
- HTTP リクエスト数・レスポンス時間
- データベース接続数・クエリ時間
- メモリ・CPU使用率
- エラー率
- ビジネスメトリクス
```

**生成される監視設定:**
```yaml
# monitoring/prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "alert_rules.yml"

alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - alertmanager:9093

scrape_configs:
  - job_name: 'myapp'
    static_configs:
      - targets: ['myapp-service:3000']
    metrics_path: '/metrics'
    scrape_interval: 10s

  - job_name: 'postgres'
    static_configs:
      - targets: ['postgres-exporter:9187']

  - job_name: 'redis'
    static_configs:
      - targets: ['redis-exporter:9121']

  - job_name: 'nginx'
    static_configs:
      - targets: ['nginx-exporter:9113']

---
# monitoring/alert_rules.yml
groups:
- name: myapp.rules
  rules:
  - alert: HighErrorRate
    expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
    for: 5m
    labels:
      severity: critical
    annotations:
      summary: "High error rate detected"
      description: "Error rate is {{ $value }} errors per second"

  - alert: HighResponseTime
    expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 1
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "High response time detected"
      description: "95th percentile response time is {{ $value }} seconds"

  - alert: DatabaseConnectionHigh
    expr: pg_stat_activity_count > 80
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "High database connection count"
      description: "Database has {{ $value }} active connections"

  - alert: PodCrashLooping
    expr: rate(kube_pod_container_status_restarts_total[15m]) > 0
    for: 5m
    labels:
      severity: critical
    annotations:
      summary: "Pod is crash looping"
      description: "Pod {{ $labels.pod }} is restarting frequently"
```

**アプリケーション内メトリクス収集:**
```typescript
// src/middleware/metrics.ts
import { Request, Response, NextFunction } from 'express';
import promClient from 'prom-client';

// メトリクスの定義
const httpRequestsTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status']
});

const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
});

const activeConnections = new promClient.Gauge({
  name: 'active_connections',
  help: 'Number of active connections'
});

const databaseQueryDuration = new promClient.Histogram({
  name: 'database_query_duration_seconds',
  help: 'Duration of database queries in seconds',
  labelNames: ['query_type'],
  buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 3, 5]
});

// メトリクス収集ミドルウェア
export const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  activeConnections.inc();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route?.path || req.path;
    
    httpRequestsTotal.inc({
      method: req.method,
      route,
      status: res.statusCode
    });
    
    httpRequestDuration.observe({
      method: req.method,
      route,
      status: res.statusCode
    }, duration);
    
    activeConnections.dec();
  });
  
  next();
};

// メトリクスエンドポイント
export const metricsEndpoint = async (req: Request, res: Response) => {
  res.set('Content-Type', promClient.register.contentType);
  const metrics = await promClient.register.metrics();
  res.end(metrics);
};

// データベースクエリメトリクス
export const trackDatabaseQuery = async <T>(
  queryType: string,
  queryFn: () => Promise<T>
): Promise<T> => {
  const start = Date.now();
  
  try {
    const result = await queryFn();
    const duration = (Date.now() - start) / 1000;
    
    databaseQueryDuration.observe({ query_type: queryType }, duration);
    
    return result;
  } catch (error) {
    const duration = (Date.now() - start) / 1000;
    databaseQueryDuration.observe({ query_type: `${queryType}_error` }, duration);
    throw error;
  }
};
```

## 環境別デプロイ戦略

### Blue-Green デプロイメント

**プロンプト例:**
```
Blue-Greenデプロイメント戦略を実装してください。

要件:
- ゼロダウンタイムデプロイ
- 即座のロールバック機能
- ヘルスチェック確認
- トラフィック切り替え
- データベースマイグレーション対応

実装:
- Kubernetes環境
- Istio Service Mesh
- 自動化スクリプト
```

**生成されるデプロイスクリプト:**
```bash
#!/bin/bash
# scripts/blue-green-deploy.sh

set -e

# 設定
NAMESPACE="myapp-production"
APP_NAME="myapp"
NEW_VERSION=$1
CURRENT_COLOR=""
NEW_COLOR=""

if [ -z "$NEW_VERSION" ]; then
  echo "Usage: $0 <new-version>"
  exit 1
fi

# 現在のアクティブな色を取得
get_current_color() {
  CURRENT_COLOR=$(kubectl get service ${APP_NAME}-service -n ${NAMESPACE} -o jsonpath='{.spec.selector.color}' 2>/dev/null || echo "blue")
  if [ "$CURRENT_COLOR" = "blue" ]; then
    NEW_COLOR="green"
  else
    NEW_COLOR="blue"
  fi
  echo "Current color: $CURRENT_COLOR, New color: $NEW_COLOR"
}

# 新しいバージョンをデプロイ
deploy_new_version() {
  echo "Deploying new version $NEW_VERSION as $NEW_COLOR..."
  
  # デプロイメント設定を更新
  kubectl patch deployment ${APP_NAME}-${NEW_COLOR} -n ${NAMESPACE} -p \
    "{\"spec\":{\"template\":{\"metadata\":{\"labels\":{\"color\":\"${NEW_COLOR}\"}},\"spec\":{\"containers\":[{\"name\":\"${APP_NAME}\",\"image\":\"ghcr.io/myorg/${APP_NAME}:${NEW_VERSION}\"}]}}}}"
  
  # デプロイメントの完了を待機
  kubectl rollout status deployment/${APP_NAME}-${NEW_COLOR} -n ${NAMESPACE} --timeout=300s
}

# ヘルスチェック
health_check() {
  echo "Performing health check on $NEW_COLOR environment..."
  
  # ポッドが準備完了になるまで待機
  kubectl wait --for=condition=ready pod -l app=${APP_NAME},color=${NEW_COLOR} -n ${NAMESPACE} --timeout=300s
  
  # アプリケーションのヘルスチェック
  POD_NAME=$(kubectl get pods -l app=${APP_NAME},color=${NEW_COLOR} -n ${NAMESPACE} -o jsonpath='{.items[0].metadata.name}')
  
  for i in {1..30}; do
    if kubectl exec ${POD_NAME} -n ${NAMESPACE} -- curl -f http://localhost:3000/health; then
      echo "Health check passed"
      return 0
    fi
    echo "Health check attempt $i failed, retrying..."
    sleep 10
  done
  
  echo "Health check failed"
  return 1
}

# トラフィックを切り替え
switch_traffic() {
  echo "Switching traffic to $NEW_COLOR..."
  
  # サービスのセレクターを更新
  kubectl patch service ${APP_NAME}-service -n ${NAMESPACE} -p \
    "{\"spec\":{\"selector\":{\"color\":\"${NEW_COLOR}\"}}}"
  
  echo "Traffic switched to $NEW_COLOR"
}

# ロールバック
rollback() {
  echo "Rolling back to $CURRENT_COLOR..."
  
  kubectl patch service ${APP_NAME}-service -n ${NAMESPACE} -p \
    "{\"spec\":{\"selector\":{\"color\":\"${CURRENT_COLOR}\"}}}"
  
  echo "Rollback completed"
}

# スモークテスト
smoke_test() {
  echo "Running smoke tests..."
  
  # 外部エンドポイントでのテスト
  for i in {1..10}; do
    if curl -f https://myapp.example.com/health; then
      echo "Smoke test $i passed"
    else
      echo "Smoke test $i failed"
      return 1
    fi
    sleep 2
  done
  
  echo "All smoke tests passed"
}

# 古いバージョンをクリーンアップ
cleanup_old_version() {
  echo "Scaling down old version ($CURRENT_COLOR)..."
  kubectl scale deployment ${APP_NAME}-${CURRENT_COLOR} -n ${NAMESPACE} --replicas=0
}

# メイン処理
main() {
  echo "Starting Blue-Green deployment for version $NEW_VERSION"
  
  get_current_color
  
  if ! deploy_new_version; then
    echo "Deployment failed"
    exit 1
  fi
  
  if ! health_check; then
    echo "Health check failed, aborting deployment"
    exit 1
  fi
  
  switch_traffic
  
  if ! smoke_test; then
    echo "Smoke tests failed, rolling back"
    rollback
    exit 1
  fi
  
  cleanup_old_version
  
  echo "Blue-Green deployment completed successfully"
  echo "New version $NEW_VERSION is now live as $NEW_COLOR"
}

# エラー時のロールバック設定
trap 'echo "Error occurred, rolling back..."; rollback; exit 1' ERR

main
```

## 次のステップ

ビルド自動化を理解したら：

1. **[チーム開発](../07-team-development/README.md)** - チームでの開発プロセス
2. **[トラブルシューティング](../09-troubleshooting.md)** - 問題解決とデバッグ
3. **[高度なトピック](../10-advanced-topics.md)** - 応用的な活用方法

---

**関連ドキュメント:**
- [E2Eテスト](08-e2e-testing.md) - テスト自動化との連携
- [統合ツール](../02-features/integration-tools.md) - CI/CDツール連携
- [プロジェクトコンテキスト](../02-features/project-context.md) - プロジェクト設定管理