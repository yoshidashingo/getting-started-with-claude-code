# 個人設計原則管理

個人用設計指針の管理方法と活用テクニックについて説明します。チーム設計原則との使い分けと統合方法を学習できます。

## 個人設計原則とは

個人設計原則は、開発者個人が長年の経験から培った設計哲学、好みのパターン、学習した知識を体系化したものです。チーム共通のCLAUDE.mdとは別に、個人レベルでの設計品質向上と効率化を目的とします。

### 個人設計原則の価値

- **一貫性**: 個人の開発スタイルの統一
- **効率性**: 繰り返し判断の自動化
- **学習**: 経験の蓄積と体系化
- **成長**: 継続的なスキル向上

## 個人設計原則の管理方法

### 1. 個人用CLAUDE.mdの作成

#### ファイル配置
```
~/.claude/
├── personal-guidelines.md    # 個人設計原則
├── project-templates/        # プロジェクトテンプレート
├── code-snippets/           # よく使うコードスニペット
└── learning-notes/          # 学習メモ
```

#### 基本構造
```markdown
# 個人設計原則

## 開発哲学
[個人の開発に対する基本的な考え方]

## 設計原則
[個人が重視する設計原則]

## コーディングスタイル
[個人の好みのコーディングスタイル]

## よく使うパターン
[頻繁に使用する設計パターン]

## 学習メモ
[新しく学んだ知識の記録]

## 改善点
[継続的に改善したい点]
```

### 2. 実践的な個人設計原則の例

**プロンプト:**
```
以下の開発経験を基に、個人設計原則を作成してください：

経験・背景:
- フロントエンド開発5年
- React/TypeScript中心
- チーム開発経験豊富
- パフォーマンス最適化に興味
- 保守性を重視

重視する価値:
- コードの可読性
- 再利用性
- テスト容易性
- パフォーマンス
```

**生成される個人設計原則:**

```markdown
# 田中太郎の個人設計原則

## 開発哲学

### 基本理念
「コードは人が読むために書く。機械が実行するのは副次的な効果である。」

### 価値観の優先順位
1. **可読性** > パフォーマンス（最適化が必要な場合を除く）
2. **保守性** > 開発速度（長期的な視点を重視）
3. **テスト容易性** > 実装の簡潔さ
4. **一貫性** > 個人の好み

### 意思決定の基準
- 3ヶ月後の自分が理解できるか？
- チームメンバーが修正できるか？
- テストが書きやすいか？
- 将来の変更に対応できるか？

## 設計原則

### 1. コンポーネント設計原則

#### 1.1 単一責任の徹底
```typescript
// ❌ 悪い例: 複数の責任を持つコンポーネント
const UserDashboard = () => {
  // ユーザー情報の取得
  // タスク一覧の取得
  // 通知の管理
  // UI の描画
  // ...
};

// ✅ 良い例: 責任を分離
const UserDashboard = () => {
  return (
    <div>
      <UserProfile />
      <TaskList />
      <NotificationPanel />
    </div>
  );
};
```

#### 1.2 Props の設計原則
- **必須Props**: 最小限に抑える
- **Optional Props**: デフォルト値を明確に
- **Boolean Props**: 肯定的な名前を使用（`disabled` より `enabled`）
- **関数Props**: 具体的な名前（`onClick` より `onSubmit`）

```typescript
// ✅ 良いProps設計
interface TaskCardProps {
  task: Task;                          // 必須: 表示するデータ
  variant?: 'compact' | 'detailed';    // オプション: 表示形式
  showActions?: boolean;               // オプション: アクション表示
  onTaskUpdate?: (task: Task) => void; // オプション: 更新ハンドラー
  onTaskDelete?: (id: string) => void; // オプション: 削除ハンドラー
}
```

#### 1.3 状態管理の原則
- **ローカル状態**: コンポーネント内で完結する状態
- **共有状態**: 複数コンポーネントで使用する状態
- **サーバー状態**: API から取得するデータ

```typescript
// ローカル状態の例
const TaskForm = () => {
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  // ...
};

// 共有状態の例（Context）
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// サーバー状態の例（React Query）
const useTasks = (projectId: string) => {
  return useQuery({
    queryKey: ['tasks', projectId],
    queryFn: () => taskAPI.getTasks(projectId),
    staleTime: 5 * 60 * 1000, // 5分
  });
};
```

### 2. TypeScript 活用原則

#### 2.1 型安全性の追求
```typescript
// ❌ 避けるべき
const processData = (data: any) => {
  return data.map((item: any) => item.value);
};

// ✅ 推奨
interface DataItem {
  id: string;
  value: string;
  metadata?: Record<string, unknown>;
}

const processData = (data: DataItem[]): string[] => {
  return data.map(item => item.value);
};
```

#### 2.2 ユニオン型の活用
```typescript
// 状態を明確に表現
type LoadingState = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: Task[] }
  | { status: 'error'; error: string };

// 使用例
const TaskList = () => {
  const [state, setState] = useState<LoadingState>({ status: 'idle' });
  
  if (state.status === 'success') {
    // TypeScript が data の存在を保証
    return <div>{state.data.length} tasks</div>;
  }
  
  if (state.status === 'error') {
    // TypeScript が error の存在を保証
    return <div>Error: {state.error}</div>;
  }
  
  return <div>Loading...</div>;
};
```

#### 2.3 ジェネリクスの効果的な使用
```typescript
// 再利用可能なAPI関数
const createApiHook = <T>(endpoint: string) => {
  return (id?: string) => {
    return useQuery({
      queryKey: [endpoint, id],
      queryFn: () => api.get<T>(`${endpoint}${id ? `/${id}` : ''}`),
      enabled: !!id,
    });
  };
};

// 使用例
const useTask = createApiHook<Task>('/tasks');
const useProject = createApiHook<Project>('/projects');
```

### 3. パフォーマンス最適化原則

#### 3.1 メモ化の戦略的使用
```typescript
// ✅ 計算コストが高い場合のみメモ化
const ExpensiveComponent = ({ items }: { items: Item[] }) => {
  const expensiveValue = useMemo(() => {
    return items.reduce((acc, item) => {
      // 重い計算処理
      return acc + complexCalculation(item);
    }, 0);
  }, [items]);

  return <div>{expensiveValue}</div>;
};

// ✅ 子コンポーネントの不要な再レンダリング防止
const TaskItem = memo(({ task, onUpdate }: TaskItemProps) => {
  return (
    <div>
      <h3>{task.title}</h3>
      <button onClick={() => onUpdate(task)}>Update</button>
    </div>
  );
});
```

#### 3.2 バンドルサイズの最適化
```typescript
// ❌ 全体をインポート
import * as _ from 'lodash';

// ✅ 必要な関数のみインポート
import { debounce, throttle } from 'lodash';

// ✅ 動的インポートの活用
const LazyComponent = lazy(() => import('./HeavyComponent'));

const App = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
};
```

## コーディングスタイル

### 1. 命名規約

#### 1.1 変数・関数名
```typescript
// ✅ 意図が明確な名前
const isUserAuthenticated = checkAuthStatus();
const filteredTasks = tasks.filter(task => task.status === 'active');
const handleTaskSubmit = (task: Task) => { /* ... */ };

// ❌ 曖昧な名前
const flag = checkAuthStatus();
const data = tasks.filter(task => task.status === 'active');
const handle = (task: Task) => { /* ... */ };
```

#### 1.2 コンポーネント名
```typescript
// ✅ 具体的で説明的
const TaskCreationForm = () => { /* ... */ };
const UserProfileCard = () => { /* ... */ };
const ProjectMemberList = () => { /* ... */ };

// ❌ 抽象的すぎる
const Form = () => { /* ... */ };
const Card = () => { /* ... */ };
const List = () => { /* ... */ };
```

### 2. ファイル構成

#### 2.1 ディレクトリ構造
```
src/
├── components/
│   ├── common/          # 汎用コンポーネント
│   ├── features/        # 機能別コンポーネント
│   └── layout/          # レイアウトコンポーネント
├── hooks/               # カスタムフック
├── services/            # API通信
├── types/               # 型定義
├── utils/               # ユーティリティ関数
└── constants/           # 定数
```

#### 2.2 ファイル命名
```
// コンポーネント
TaskCard.tsx
TaskCard.test.tsx
TaskCard.stories.tsx

// フック
useTaskManagement.ts
useTaskManagement.test.ts

// ユーティリティ
dateUtils.ts
dateUtils.test.ts
```

### 3. コメント・ドキュメント

#### 3.1 コメントの原則
```typescript
// ❌ 何をしているかのコメント（コードを見れば分かる）
// ユーザーIDを取得
const userId = user.id;

// ✅ なぜそうするかのコメント
// パフォーマンス向上のため、重い計算は初回のみ実行
const expensiveResult = useMemo(() => {
  return heavyCalculation(data);
}, [data]);

// ✅ 複雑なビジネスロジックの説明
// 管理者は全てのタスクを見ることができるが、
// 一般ユーザーは自分が作成したタスクまたは
// 自分がアサインされたタスクのみ表示
const visibleTasks = useMemo(() => {
  if (user.role === 'admin') {
    return allTasks;
  }
  return allTasks.filter(task => 
    task.createdBy === user.id || task.assignedTo === user.id
  );
}, [allTasks, user]);
```

#### 3.2 JSDoc の活用
```typescript
/**
 * タスクの優先度に基づいて色を返す
 * @param priority - タスクの優先度
 * @returns 優先度に対応する色コード
 * @example
 * ```typescript
 * const color = getPriorityColor('high'); // '#ff4757'
 * ```
 */
const getPriorityColor = (priority: TaskPriority): string => {
  const colorMap: Record<TaskPriority, string> = {
    low: '#2ed573',
    medium: '#ffa502',
    high: '#ff4757',
    urgent: '#ff3838'
  };
  return colorMap[priority];
};
```

## よく使うパターン

### 1. カスタムフックパターン

#### 1.1 データ取得フック
```typescript
const useApiData = <T>(
  endpoint: string,
  options?: {
    enabled?: boolean;
    refetchInterval?: number;
  }
) => {
  return useQuery({
    queryKey: [endpoint],
    queryFn: () => api.get<T>(endpoint),
    enabled: options?.enabled ?? true,
    refetchInterval: options?.refetchInterval,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
```

#### 1.2 フォーム管理フック
```typescript
const useFormWithValidation = <T extends Record<string, any>>(
  initialValues: T,
  validationSchema: Joi.ObjectSchema<T>
) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const setValue = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
    
    // リアルタイムバリデーション
    if (touched[field]) {
      const { error } = validationSchema.validate({ ...values, [field]: value });
      setErrors(prev => ({
        ...prev,
        [field]: error?.details.find(d => d.path[0] === field)?.message
      }));
    }
  }, [values, validationSchema, touched]);

  const setTouched = useCallback((field: keyof T) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  }, []);

  const validate = useCallback(() => {
    const { error } = validationSchema.validate(values, { abortEarly: false });
    if (error) {
      const newErrors: Partial<Record<keyof T, string>> = {};
      error.details.forEach(detail => {
        const field = detail.path[0] as keyof T;
        newErrors[field] = detail.message;
      });
      setErrors(newErrors);
      return false;
    }
    setErrors({});
    return true;
  }, [values, validationSchema]);

  return {
    values,
    errors,
    touched,
    setValue,
    setTouched,
    validate,
    isValid: Object.keys(errors).length === 0
  };
};
```

### 2. エラーハンドリングパターン

#### 2.1 エラーバウンダリ
```typescript
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<
  PropsWithChildren<{ fallback?: ComponentType<{ error: Error }> }>,
  ErrorBoundaryState
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // エラー報告サービスに送信
    errorReportingService.captureException(error, {
      extra: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return <FallbackComponent error={this.state.error!} />;
    }

    return this.props.children;
  }
}
```

#### 2.2 非同期エラーハンドリング
```typescript
const useAsyncError = () => {
  const [, setError] = useState();
  return useCallback((error: Error) => {
    setError(() => {
      throw error;
    });
  }, []);
};

const AsyncComponent = () => {
  const throwError = useAsyncError();

  const handleAsyncOperation = async () => {
    try {
      await riskyAsyncOperation();
    } catch (error) {
      throwError(error as Error);
    }
  };

  return <button onClick={handleAsyncOperation}>Execute</button>;
};
```

## 学習メモ

### 最近学んだパターン

#### 1. Compound Component Pattern の活用
```typescript
// 学習日: 2024-01-10
// 参考: https://kentcdodds.com/blog/compound-components-with-react-hooks

const Modal = ({ children, isOpen, onClose }: ModalProps) => {
  if (!isOpen) return null;
  
  return (
    <ModalContext.Provider value={{ onClose }}>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          {children}
        </div>
      </div>
    </ModalContext.Provider>
  );
};

Modal.Header = ({ children }: { children: ReactNode }) => (
  <div className="modal-header">{children}</div>
);

Modal.Body = ({ children }: { children: ReactNode }) => (
  <div className="modal-body">{children}</div>
);

Modal.Footer = ({ children }: { children: ReactNode }) => (
  <div className="modal-footer">{children}</div>
);

// 使用例
<Modal isOpen={isOpen} onClose={handleClose}>
  <Modal.Header>
    <h2>確認</h2>
  </Modal.Header>
  <Modal.Body>
    <p>本当に削除しますか？</p>
  </Modal.Body>
  <Modal.Footer>
    <button onClick={handleClose}>キャンセル</button>
    <button onClick={handleDelete}>削除</button>
  </Modal.Footer>
</Modal>
```

#### 2. React Query の Optimistic Updates
```typescript
// 学習日: 2024-01-15
// 楽観的更新でUXを向上

const useUpdateTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (updatedTask: Task) => taskAPI.update(updatedTask),
    
    // 楽観的更新
    onMutate: async (updatedTask) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      
      const previousTasks = queryClient.getQueryData(['tasks']);
      
      queryClient.setQueryData(['tasks'], (old: Task[] | undefined) => {
        return old?.map(task => 
          task.id === updatedTask.id ? updatedTask : task
        ) ?? [];
      });
      
      return { previousTasks };
    },
    
    // エラー時のロールバック
    onError: (err, updatedTask, context) => {
      queryClient.setQueryData(['tasks'], context?.previousTasks);
    },
    
    // 成功時の再同期
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};
```

### 改善したい点

#### 1. テストの充実
- **現状**: 単体テストのカバレッジが不十分
- **目標**: 重要なビジネスロジックは100%カバレッジ
- **アクション**: Testing Library を使った統合テストの強化

#### 2. アクセシビリティの向上
- **現状**: 基本的な対応のみ
- **目標**: WCAG 2.1 AA レベルの準拠
- **アクション**: eslint-plugin-jsx-a11y の導入と修正

#### 3. パフォーマンス監視の強化
- **現状**: 主観的な判断
- **目標**: 客観的な指標による継続的改善
- **アクション**: Web Vitals の監視とアラート設定

## チーム原則との統合

### 1. 優先順位の明確化

```markdown
## 原則の適用優先順位

1. **チーム原則** (CLAUDE.md)
   - プロジェクト固有の要件
   - チーム合意事項
   - 技術的制約

2. **個人原則** (personal-guidelines.md)
   - チーム原則で定義されていない部分
   - 個人の経験に基づく判断
   - 効率化のための工夫

3. **業界標準**
   - 一般的なベストプラクティス
   - 言語・フレームワークの推奨事項
```

### 2. 競合時の解決方法

**プロンプト例:**
```
チーム原則と個人原則が競合する場合の
判断基準と解決方法を教えてください。

競合例:
- チーム: 関数型コンポーネント推奨
- 個人: クラスコンポーネント好み

- チーム: Redux使用
- 個人: Context API好み
```

### 3. 個人原則のチームへの提案

```typescript
// 個人原則で効果的だったパターンをチームに提案
const useOptimisticUpdate = <T>(
  queryKey: string[],
  updateFn: (data: T) => Promise<T>
) => {
  // 実装...
};

// チーム会議で提案:
// "楽観的更新パターンでUXが大幅に改善されました。
//  チーム標準として採用を検討しませんか？"
```

## 継続的改善

### 1. 定期的な見直し

**月次レビュー項目:**
- 新しく学んだパターンの追加
- 使わなくなった原則の削除
- 効果測定と改善点の特定

### 2. 学習記録の活用

```markdown
## 学習ログ

### 2024-01-20: React 18 Concurrent Features
- **学習内容**: Suspense, useTransition, useDeferredValue
- **適用場面**: 大量データの表示時のUX改善
- **個人原則への反映**: パフォーマンス最適化原則に追加

### 2024-01-25: Design Patterns in TypeScript
- **学習内容**: Builder Pattern, Factory Pattern
- **適用場面**: 複雑なオブジェクト生成
- **個人原則への反映**: よく使うパターンに追加
```

### 3. 効果測定

```typescript
// 個人原則適用前後の比較
const metrics = {
  beforePersonalGuidelines: {
    developmentTime: '2 weeks',
    bugCount: 15,
    codeReviewComments: 25
  },
  afterPersonalGuidelines: {
    developmentTime: '1.5 weeks',
    bugCount: 8,
    codeReviewComments: 12
  }
};
```

## 次のステップ

個人設計原則管理を理解したら：

1. **[AIによる設計レビュー](05-ai-design-review.md)** - 個人原則に基づく自動レビュー
2. **[単体テスト](06-unit-testing.md)** - 原則を検証するテスト作成
3. **[チーム開発](../07-team-development/README.md)** - 個人原則とチーム原則の統合

---

**関連ドキュメント:**
- [設計原則管理](03-design-principles.md) - チーム原則との関係
- [AIと設計](02-design-with-ai.md) - 設計プロセスでの活用
- [コードレビュー](../02-features/code-review.md) - 原則に基づくレビュー