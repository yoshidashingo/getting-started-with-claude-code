# 上級者向けトピック

Claude Codeの高度な活用方法と上級者向けの技術について説明します。効率的な開発ワークフローの構築と最適化手法を学習できます。

## 高度なプロンプトエンジニアリング

### 1. コンテキスト最適化

#### 大規模プロジェクトでのコンテキスト管理
```
# プロジェクト情報の構造化
プロジェクト: [プロジェクト名]
アーキテクチャ: [アーキテクチャパターン]
技術スタック: [使用技術]
設計原則: [重要な設計原則]

現在のタスク: [具体的なタスク]
関連ファイル: [関連するファイル一覧]
制約条件: [技術的・ビジネス的制約]

以下の要件に従って実装してください：
[詳細な要件]
```

#### 段階的なプロンプト設計
```typescript
// Phase 1: 設計確認
const designPrompt = `
システム設計を確認してください：
- アーキテクチャパターン
- 主要コンポーネント
- データフロー
- 技術選択の妥当性
`;

// Phase 2: 実装計画
const implementationPrompt = `
承認された設計に基づいて実装計画を作成してください：
- 実装順序
- 依存関係
- テスト戦略
- リスク要因
`;

// Phase 3: 実装実行
const codingPrompt = `
実装計画に従ってコードを生成してください：
- [具体的な機能要件]
- [技術的制約]
- [品質基準]
`;
```

### 2. 専門ドメイン向けプロンプト

#### 金融システム向け
```
金融システムの要件に従って実装してください：

規制要件:
- SOX法準拠
- PCI DSS準拠
- データ保護規制

技術要件:
- 高可用性（99.99%）
- 低レイテンシ（<100ms）
- 強力な監査ログ
- 暗号化（保存時・転送時）

ビジネス要件:
- リアルタイム取引処理
- 不正検知
- リスク管理
- レポート生成
```

#### 医療システム向け
```
医療システムの要件に従って実装してください：

規制要件:
- HIPAA準拠
- FDA規制対応
- 医療機器ソフトウェア規制

技術要件:
- 患者データの暗号化
- アクセス制御
- 監査証跡
- 災害復旧

ビジネス要件:
- 電子カルテ管理
- 診断支援
- 薬剤管理
- 医療画像処理
```

## 高度なアーキテクチャパターン

### 1. マイクロサービスアーキテクチャ

#### サービス分割戦略
```
以下のモノリシックシステムを
マイクロサービスに分割してください：

現在のシステム:
- ユーザー管理
- 商品管理
- 注文処理
- 決済処理
- 在庫管理
- 通知システム

分割方針:
- ドメイン駆動設計
- データの独立性
- サービス間通信の最小化
- 障害の局所化

各サービスについて:
- 責任範囲
- API設計
- データストア
- 通信方式
```

#### イベント駆動アーキテクチャ
```typescript
// イベントストーミング結果に基づく実装
interface DomainEvent {
  eventId: string;
  eventType: string;
  aggregateId: string;
  aggregateType: string;
  eventData: any;
  timestamp: Date;
  version: number;
}

// イベントソーシング実装
class EventStore {
  async saveEvents(
    aggregateId: string,
    events: DomainEvent[],
    expectedVersion: number
  ): Promise<void> {
    // イベント保存ロジック
  }

  async getEvents(
    aggregateId: string,
    fromVersion?: number
  ): Promise<DomainEvent[]> {
    // イベント取得ロジック
  }
}

// CQRS実装
interface CommandHandler<T> {
  handle(command: T): Promise<void>;
}

interface QueryHandler<T, R> {
  handle(query: T): Promise<R>;
}
```

### 2. 分散システム設計

#### 分散トランザクション（Saga Pattern）
```typescript
// Saga実装例
abstract class Saga {
  protected steps: SagaStep[] = [];
  
  async execute(): Promise<void> {
    const executedSteps: SagaStep[] = [];
    
    try {
      for (const step of this.steps) {
        await step.execute();
        executedSteps.push(step);
      }
    } catch (error) {
      // 補償トランザクション実行
      for (const step of executedSteps.reverse()) {
        await step.compensate();
      }
      throw error;
    }
  }
}

class OrderSaga extends Saga {
  constructor(
    private orderService: OrderService,
    private paymentService: PaymentService,
    private inventoryService: InventoryService
  ) {
    super();
    this.steps = [
      new ReserveInventoryStep(inventoryService),
      new ProcessPaymentStep(paymentService),
      new CreateOrderStep(orderService)
    ];
  }
}
```

## パフォーマンス最適化

### 1. フロントエンド最適化

#### バンドル最適化
```typescript
// Webpack設定の最適化
const webpackConfig = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
};

// 動的インポートによるコード分割
const LazyComponent = lazy(() => 
  import('./HeavyComponent').then(module => ({
    default: module.HeavyComponent
  }))
);

// プリロード戦略
const preloadComponent = () => {
  const componentImport = () => import('./NextPageComponent');
  
  // ユーザーがリンクにホバーした時にプリロード
  const link = document.querySelector('a[href="/next-page"]');
  link?.addEventListener('mouseenter', componentImport);
};
```

#### レンダリング最適化
```typescript
// 仮想化による大量データの効率的表示
import { FixedSizeList as List } from 'react-window';

const VirtualizedList: React.FC<{ items: Item[] }> = ({ items }) => {
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={style}>
      <ItemComponent item={items[index]} />
    </div>
  );

  return (
    <List
      height={600}
      itemCount={items.length}
      itemSize={80}
      width="100%"
    >
      {Row}
    </List>
  );
};

// Intersection Observer による遅延読み込み
const useLazyLoading = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
};
```

### 2. バックエンド最適化

#### データベース最適化
```sql
-- インデックス戦略
CREATE INDEX CONCURRENTLY idx_orders_user_created 
ON orders(user_id, created_at DESC);

-- 部分インデックス
CREATE INDEX idx_active_users 
ON users(email) 
WHERE is_active = true;

-- 複合インデックス
CREATE INDEX idx_products_category_price 
ON products(category_id, price DESC);

-- クエリ最適化
EXPLAIN (ANALYZE, BUFFERS) 
SELECT p.name, c.name as category_name
FROM products p
JOIN categories c ON p.category_id = c.id
WHERE p.price > 100
ORDER BY p.created_at DESC
LIMIT 20;
```

#### キャッシュ戦略
```typescript
// 多層キャッシュ実装
class CacheManager {
  constructor(
    private l1Cache: MemoryCache,    // L1: メモリキャッシュ
    private l2Cache: RedisCache,     // L2: Redis
    private l3Cache: DatabaseCache   // L3: データベース
  ) {}

  async get<T>(key: string): Promise<T | null> {
    // L1キャッシュから取得
    let value = await this.l1Cache.get<T>(key);
    if (value) return value;

    // L2キャッシュから取得
    value = await this.l2Cache.get<T>(key);
    if (value) {
      await this.l1Cache.set(key, value, 300); // 5分
      return value;
    }

    // L3キャッシュから取得
    value = await this.l3Cache.get<T>(key);
    if (value) {
      await this.l2Cache.set(key, value, 3600); // 1時間
      await this.l1Cache.set(key, value, 300);  // 5分
      return value;
    }

    return null;
  }

  async set<T>(key: string, value: T, ttl: number): Promise<void> {
    await Promise.all([
      this.l1Cache.set(key, value, Math.min(ttl, 300)),
      this.l2Cache.set(key, value, ttl),
      this.l3Cache.set(key, value, ttl * 2)
    ]);
  }
}
```

## セキュリティ強化

### 1. 高度な認証・認可

#### Zero Trust アーキテクチャ
```typescript
// 動的権限評価
class PolicyEngine {
  async evaluate(
    subject: User,
    resource: Resource,
    action: string,
    context: RequestContext
  ): Promise<AuthorizationResult> {
    const policies = await this.getPolicies(resource.type);
    
    for (const policy of policies) {
      const result = await policy.evaluate({
        subject,
        resource,
        action,
        context: {
          ...context,
          time: new Date(),
          location: context.clientIP,
          riskScore: await this.calculateRiskScore(subject, context)
        }
      });
      
      if (result.decision === 'DENY') {
        return result;
      }
    }
    
    return { decision: 'ALLOW' };
  }

  private async calculateRiskScore(
    user: User,
    context: RequestContext
  ): Promise<number> {
    let score = 0;
    
    // 異常な時間帯のアクセス
    const hour = new Date().getHours();
    if (hour < 6 || hour > 22) score += 0.3;
    
    // 異常な地理的位置
    const lastLocation = await this.getLastLocation(user.id);
    if (this.calculateDistance(lastLocation, context.location) > 1000) {
      score += 0.5;
    }
    
    // 異常なアクセスパターン
    const recentActivity = await this.getRecentActivity(user.id);
    if (this.detectAnomalousPattern(recentActivity)) {
      score += 0.4;
    }
    
    return Math.min(score, 1.0);
  }
}
```

#### 暗号化とキー管理
```typescript
// エンベロープ暗号化
class EncryptionService {
  constructor(private kms: KeyManagementService) {}

  async encrypt(data: string, keyId: string): Promise<EncryptedData> {
    // データ暗号化キー（DEK）を生成
    const dek = crypto.randomBytes(32);
    
    // DEKでデータを暗号化
    const cipher = crypto.createCipher('aes-256-gcm', dek);
    const encryptedData = Buffer.concat([
      cipher.update(data, 'utf8'),
      cipher.final()
    ]);
    const authTag = cipher.getAuthTag();
    
    // DEKをKMSで暗号化
    const encryptedDek = await this.kms.encrypt(keyId, dek);
    
    return {
      encryptedData: encryptedData.toString('base64'),
      encryptedKey: encryptedDek,
      authTag: authTag.toString('base64'),
      algorithm: 'aes-256-gcm'
    };
  }

  async decrypt(encryptedData: EncryptedData): Promise<string> {
    // DEKを復号化
    const dek = await this.kms.decrypt(encryptedData.encryptedKey);
    
    // データを復号化
    const decipher = crypto.createDecipher('aes-256-gcm', dek);
    decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'base64'));
    
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(encryptedData.encryptedData, 'base64')),
      decipher.final()
    ]);
    
    return decrypted.toString('utf8');
  }
}
```

## 監視・観測性

### 1. 分散トレーシング

#### OpenTelemetry実装
```typescript
import { trace, context, SpanStatusCode } from '@opentelemetry/api';

class TracedService {
  private tracer = trace.getTracer('user-service', '1.0.0');

  async processUser(userId: string): Promise<User> {
    return this.tracer.startActiveSpan('process-user', async (span) => {
      try {
        span.setAttributes({
          'user.id': userId,
          'service.name': 'user-service',
          'service.version': '1.0.0'
        });

        // 子スパンでデータベース操作
        const user = await this.tracer.startActiveSpan('db-query', async (dbSpan) => {
          dbSpan.setAttributes({
            'db.system': 'postgresql',
            'db.operation': 'SELECT',
            'db.table': 'users'
          });
          
          const result = await this.userRepository.findById(userId);
          dbSpan.setStatus({ code: SpanStatusCode.OK });
          return result;
        });

        if (!user) {
          span.recordException(new Error('User not found'));
          span.setStatus({ 
            code: SpanStatusCode.ERROR, 
            message: 'User not found' 
          });
          throw new Error('User not found');
        }

        // 外部API呼び出し
        await this.tracer.startActiveSpan('external-api', async (apiSpan) => {
          apiSpan.setAttributes({
            'http.method': 'GET',
            'http.url': 'https://api.example.com/user-profile',
            'http.user_agent': 'user-service/1.0.0'
          });
          
          await this.externalApiClient.getUserProfile(userId);
          apiSpan.setStatus({ code: SpanStatusCode.OK });
        });

        span.setStatus({ code: SpanStatusCode.OK });
        return user;
      } catch (error) {
        span.recordException(error as Error);
        span.setStatus({ 
          code: SpanStatusCode.ERROR, 
          message: (error as Error).message 
        });
        throw error;
      } finally {
        span.end();
      }
    });
  }
}
```

### 2. メトリクス収集

#### カスタムメトリクス
```typescript
import { metrics } from '@opentelemetry/api';

class MetricsCollector {
  private meter = metrics.getMeter('user-service', '1.0.0');
  
  // カウンター
  private requestCounter = this.meter.createCounter('http_requests_total', {
    description: 'Total number of HTTP requests'
  });
  
  // ヒストグラム
  private requestDuration = this.meter.createHistogram('http_request_duration_seconds', {
    description: 'HTTP request duration in seconds'
  });
  
  // ゲージ
  private activeConnections = this.meter.createUpDownCounter('active_connections', {
    description: 'Number of active connections'
  });

  recordRequest(method: string, route: string, statusCode: number, duration: number) {
    const labels = { method, route, status_code: statusCode.toString() };
    
    this.requestCounter.add(1, labels);
    this.requestDuration.record(duration, labels);
  }

  recordConnectionChange(delta: number) {
    this.activeConnections.add(delta);
  }
}

// ミドルウェアでの使用
const metricsMiddleware = (collector: MetricsCollector) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    
    res.on('finish', () => {
      const duration = (Date.now() - startTime) / 1000;
      collector.recordRequest(
        req.method,
        req.route?.path || req.path,
        res.statusCode,
        duration
      );
    });
    
    next();
  };
};
```

## 次世代技術の活用

### 1. WebAssembly (WASM)

#### 高性能計算処理
```typescript
// Rust で実装した計算処理をWASMで利用
class WasmCalculator {
  private wasmModule: any;

  async initialize() {
    this.wasmModule = await import('./pkg/calculator_wasm');
  }

  calculateComplexOperation(data: number[]): number[] {
    // JavaScriptでは重い処理をWASMで実行
    const inputPtr = this.wasmModule.allocate_array(data);
    const resultPtr = this.wasmModule.complex_calculation(inputPtr, data.length);
    const result = this.wasmModule.get_result_array(resultPtr, data.length);
    
    // メモリクリーンアップ
    this.wasmModule.deallocate_array(inputPtr);
    this.wasmModule.deallocate_array(resultPtr);
    
    return result;
  }
}
```

### 2. エッジコンピューティング

#### CDNエッジでの処理
```typescript
// Cloudflare Workers での実装例
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    
    // エッジでの認証チェック
    const authResult = await this.validateAuth(request, env);
    if (!authResult.valid) {
      return new Response('Unauthorized', { status: 401 });
    }
    
    // エッジキャッシュの確認
    const cacheKey = `cache:${url.pathname}:${authResult.userId}`;
    const cached = await env.CACHE.get(cacheKey);
    if (cached) {
      return new Response(cached, {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // オリジンサーバーへのリクエスト
    const response = await fetch(request);
    const data = await response.text();
    
    // エッジキャッシュに保存
    await env.CACHE.put(cacheKey, data, { expirationTtl: 300 });
    
    return new Response(data, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
```

## 継続的学習と改善

### 1. 技術トレンドの追跡

#### 自動化された学習システム
```typescript
class TechTrendTracker {
  async analyzeTrends(): Promise<TrendReport> {
    const sources = [
      'https://github.com/trending',
      'https://news.ycombinator.com',
      'https://dev.to',
      'https://stackoverflow.com/questions/tagged/javascript'
    ];
    
    const trends = await Promise.all(
      sources.map(source => this.scrapeSource(source))
    );
    
    return this.generateReport(trends);
  }

  async suggestLearningPath(currentSkills: string[]): Promise<LearningPath> {
    const marketDemand = await this.getMarketDemand();
    const skillGaps = this.identifySkillGaps(currentSkills, marketDemand);
    
    return this.createLearningPath(skillGaps);
  }
}
```

### 2. 自動化されたコード改善

#### AI駆動のリファクタリング
```typescript
class AutoRefactoring {
  async analyzeCodebase(projectPath: string): Promise<RefactoringReport> {
    const analysis = await this.staticAnalysis(projectPath);
    const suggestions = await this.generateSuggestions(analysis);
    
    return {
      codeSmells: analysis.codeSmells,
      suggestions: suggestions,
      estimatedImpact: this.calculateImpact(suggestions)
    };
  }

  async applyRefactoring(
    suggestion: RefactoringSuggestion
  ): Promise<RefactoringResult> {
    // バックアップ作成
    await this.createBackup(suggestion.filePath);
    
    try {
      // リファクタリング実行
      const result = await this.executeRefactoring(suggestion);
      
      // テスト実行
      const testResult = await this.runTests();
      if (!testResult.passed) {
        await this.restoreBackup(suggestion.filePath);
        throw new Error('Tests failed after refactoring');
      }
      
      return result;
    } catch (error) {
      await this.restoreBackup(suggestion.filePath);
      throw error;
    }
  }
}
```

---

**ナビゲーション:**
- ⬅️ 前へ: [トラブルシューティング](09-troubleshooting.md) - よくある問題と解決方法
- ➡️ 次へ: [IDE統合](11-ide-integration.md) - エディタとの連携

**関連ドキュメント:**
- [体系的な開発プロセス](06-development-process/README.md) - 開発プロセス全体
- [チーム開発](07-team-development/README.md) - チーム規模での高度な活用
- [外部ツール連携](02-features/integration-tools.md) - 高度なツール統合