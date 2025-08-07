# 開発ガイド

このドキュメントは、simple-webapp-exampleの開発・保守・拡張に関する詳細な情報を提供します。

## 📋 目次

- [開発環境のセットアップ](#開発環境のセットアップ)
- [アーキテクチャ詳細](#アーキテクチャ詳細)
- [コーディング規約](#コーディング規約)
- [テスト戦略](#テスト戦略)
- [パフォーマンス最適化](#パフォーマンス最適化)
- [デバッグ手法](#デバッグ手法)
- [機能拡張ガイド](#機能拡張ガイド)

## 🛠️ 開発環境のセットアップ

### 必要なツール

```bash
# Node.js バージョン確認
node --version  # v18.0.0以上

# パッケージマネージャー
npm --version   # v8.0.0以上
# または
yarn --version # v1.22.0以上
```

### 推奨VS Code拡張機能

```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-json",
    "ms-python.python",
    "ms-vscode.vscode-jest"
  ]
}
```

### 開発用スクリプト

```bash
# 開発サーバー起動
npm run dev

# 型チェック
npm run type-check

# リンティング
npm run lint
npm run lint:fix

# フォーマット
npm run format

# テスト実行
npm run test
npm run test:watch
npm run test:coverage

# ビルド
npm run build
npm run preview
```

## 🏗️ アーキテクチャ詳細

### コンポーネント設計原則

#### 1. 単一責任の原則
各コンポーネントは一つの明確な責任を持つ：

```typescript
// ❌ 悪い例：複数の責任を持つコンポーネント
const UserManagement = () => {
  // ユーザー管理 + 検索 + 統計 + フォーム処理
};

// ✅ 良い例：責任を分離
const UserForm = () => { /* フォーム処理のみ */ };
const SearchBar = () => { /* 検索機能のみ */ };
const UserStats = () => { /* 統計表示のみ */ };
```

#### 2. Props設計パターン

```typescript
// 基本的なProps
interface ComponentProps {
  // 必須プロパティ
  data: User[];
  onAction: (id: string) => void;
  
  // オプショナルプロパティ
  className?: string;
  disabled?: boolean;
  
  // 設定オブジェクト
  config?: {
    showActions: boolean;
    enableEdit: boolean;
  };
}

// 子要素を受け取る場合
interface ContainerProps {
  children: React.ReactNode;
  title?: string;
}

// レンダープロップパターン
interface RenderProps<T> {
  data: T[];
  render: (item: T, index: number) => React.ReactNode;
}
```

### 状態管理パターン

#### 1. ローカル状態 vs グローバル状態

```typescript
// ローカル状態：コンポーネント固有の状態
const [isEditing, setIsEditing] = useState(false);
const [formData, setFormData] = useState(initialData);

// グローバル状態：アプリケーション全体で共有
const { users, addUser, updateUser } = useUsers();
```

#### 2. カスタムフックの設計

```typescript
// 単一責任のカスタムフック
export const useFormValidation = (schema: ValidationSchema) => {
  const [errors, setErrors] = useState<ValidationError[]>([]);
  
  const validate = useCallback((data: any) => {
    // バリデーションロジック
  }, [schema]);
  
  return { errors, validate };
};

// 複合的なカスタムフック
export const useUserManagement = () => {
  const storage = useLocalStorage('users', []);
  const validation = useFormValidation(userSchema);
  
  // 複数のフックを組み合わせた高レベルAPI
  return {
    users: storage.value,
    addUser: (data) => {
      if (validation.validate(data)) {
        storage.setValue(prev => [...prev, data]);
      }
    },
    // ...
  };
};
```

### ファイル構成規約

```
src/
├── components/
│   └── ComponentName/
│       ├── ComponentName.tsx      # メインコンポーネント
│       ├── ComponentName.module.css # スタイル
│       ├── ComponentName.test.tsx  # テスト
│       ├── ComponentName.stories.tsx # Storybook（オプション）
│       └── index.ts               # エクスポート
├── hooks/
│   ├── useHookName.ts
│   └── useHookName.test.ts
├── utils/
│   ├── utilityName.ts
│   └── utilityName.test.ts
└── types/
    └── domain.ts
```

## 📝 コーディング規約

### TypeScript規約

#### 1. 型定義

```typescript
// インターフェース vs タイプエイリアス
interface User {          // オブジェクトの形状定義
  id: string;
  name: string;
}

type Status = 'loading' | 'success' | 'error'; // ユニオン型

// ジェネリクス
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

// ユーティリティ型の活用
type CreateUserInput = Omit<User, 'id' | 'createdAt'>;
type UpdateUserInput = Partial<CreateUserInput>;
```

#### 2. 関数定義

```typescript
// 関数宣言 vs アロー関数
function processUser(user: User): ProcessedUser {
  // 複雑なロジック、再帰、ホイスティングが必要な場合
}

const handleClick = (event: MouseEvent): void => {
  // イベントハンドラー、コールバック関数
};

// 非同期関数
const fetchUsers = async (): Promise<User[]> => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch users:', error);
    throw error;
  }
};
```

### React規約

#### 1. コンポーネント定義

```typescript
// 関数コンポーネント（推奨）
export const UserCard: React.FC<UserCardProps> = ({
  user,
  onEdit,
  onDelete,
  className = '',
}) => {
  // フック呼び出しは最上位で
  const [isEditing, setIsEditing] = useState(false);
  const handleEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  // 早期リターン
  if (!user) {
    return <div>No user data</div>;
  }

  return (
    <div className={`${styles.card} ${className}`}>
      {/* JSX */}
    </div>
  );
};
```

#### 2. フック使用規約

```typescript
// useEffect の依存配列
useEffect(() => {
  fetchData();
}, [userId]); // 依存関係を明示

// useCallback の適切な使用
const handleSubmit = useCallback(async (data: FormData) => {
  await onSubmit(data);
}, [onSubmit]); // onSubmitが変更された時のみ再生成

// useMemo の適切な使用
const expensiveValue = useMemo(() => {
  return heavyComputation(data);
}, [data]); // dataが変更された時のみ再計算
```

### CSS規約

#### 1. CSS Modules

```css
/* ComponentName.module.css */

/* BEMライクな命名 */
.card {
  /* ベーススタイル */
}

.card--editing {
  /* 状態による変更 */
}

.card__header {
  /* 子要素 */
}

.card__title {
  /* 孫要素 */
}

/* レスポンシブデザイン */
@media (max-width: 768px) {
  .card {
    /* モバイル用スタイル */
  }
}
```

#### 2. CSS変数の活用

```css
:root {
  --color-primary: #3182ce;
  --color-secondary: #718096;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --border-radius: 0.5rem;
}

.button {
  background-color: var(--color-primary);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius);
}
```

## 🧪 テスト戦略

### テストピラミッド

```
    /\
   /  \     E2E Tests (少数)
  /____\    
 /      \   Integration Tests (中程度)
/________\  Unit Tests (多数)
```

### ユニットテスト

```typescript
// hooks/useUsers.test.ts
import { renderHook, act } from '@testing-library/react';
import { useUsers } from './useUsers';

describe('useUsers', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should add user correctly', async () => {
    const { result } = renderHook(() => useUsers());
    
    await act(async () => {
      await result.current.addUser({
        name: 'John Doe',
        email: 'john@example.com'
      });
    });

    expect(result.current.users).toHaveLength(1);
    expect(result.current.users[0].name).toBe('John Doe');
  });
});
```

### コンポーネントテスト

```typescript
// components/UserCard/UserCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { UserCard } from './UserCard';

const mockUser = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('UserCard', () => {
  it('should render user information', () => {
    render(
      <UserCard
        user={mockUser}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('should call onEdit when edit button is clicked', () => {
    const onEdit = jest.fn();
    render(
      <UserCard
        user={mockUser}
        onEdit={onEdit}
        onDelete={jest.fn()}
      />
    );

    fireEvent.click(screen.getByLabelText(/編集/));
    expect(onEdit).toHaveBeenCalledWith(mockUser.id, expect.any(Object));
  });
});
```

### E2Eテスト

```typescript
// e2e/user-management.spec.ts
import { test, expect } from '@playwright/test';

test('user management flow', async ({ page }) => {
  await page.goto('/');

  // ユーザー追加
  await page.fill('[data-testid="user-name"]', 'John Doe');
  await page.fill('[data-testid="user-email"]', 'john@example.com');
  await page.click('[data-testid="add-user"]');

  // ユーザーが表示されることを確認
  await expect(page.locator('[data-testid="user-card"]')).toContainText('John Doe');

  // 検索機能
  await page.fill('[data-testid="search-input"]', 'John');
  await expect(page.locator('[data-testid="user-card"]')).toHaveCount(1);
});
```

## ⚡ パフォーマンス最適化

### レンダリング最適化

#### 1. メモ化の活用

```typescript
// React.memo でコンポーネントをメモ化
export const UserCard = React.memo<UserCardProps>(({ user, onEdit, onDelete }) => {
  // コンポーネントの実装
});

// カスタム比較関数
export const UserList = React.memo<UserListProps>(
  ({ users, onEdit, onDelete }) => {
    // 実装
  },
  (prevProps, nextProps) => {
    return prevProps.users.length === nextProps.users.length &&
           prevProps.users.every((user, index) => 
             user.id === nextProps.users[index].id
           );
  }
);
```

#### 2. 仮想化

```typescript
// 大量データの仮想化
import { FixedSizeList as List } from 'react-window';

const VirtualizedUserList: React.FC<{ users: User[] }> = ({ users }) => {
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={style}>
      <UserCard user={users[index]} />
    </div>
  );

  return (
    <List
      height={600}
      itemCount={users.length}
      itemSize={120}
    >
      {Row}
    </List>
  );
};
```

### バンドル最適化

#### 1. 動的インポート

```typescript
// 遅延読み込み
const LazyUserStats = React.lazy(() => import('./UserStats/UserStats'));

const App = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <LazyUserStats />
  </Suspense>
);
```

#### 2. Tree Shaking

```typescript
// 必要な関数のみインポート
import { debounce } from 'lodash/debounce'; // ❌ 全体をインポート
import debounce from 'lodash.debounce';    // ✅ 必要な部分のみ
```

## 🐛 デバッグ手法

### React DevTools

```typescript
// コンポーネントにデバッグ情報を追加
const UserCard = ({ user }) => {
  // デバッグ用のカスタムフック
  useDebugValue(user, user => `User: ${user.name}`);
  
  return <div>{/* コンポーネント */}</div>;
};
```

### パフォーマンス分析

```typescript
// パフォーマンス測定
const measurePerformance = (name: string, fn: () => void) => {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`${name}: ${end - start}ms`);
};

// React Profiler
import { Profiler } from 'react';

const onRenderCallback = (id, phase, actualDuration) => {
  console.log('Render:', { id, phase, actualDuration });
};

<Profiler id="UserList" onRender={onRenderCallback}>
  <UserList users={users} />
</Profiler>
```

### エラー追跡

```typescript
// エラーバウンダリでのエラー報告
class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // エラー報告サービスに送信
    if (process.env.NODE_ENV === 'production') {
      errorReportingService.captureException(error, {
        extra: errorInfo,
        tags: {
          component: 'UserManagement'
        }
      });
    }
  }
}
```

## 🚀 機能拡張ガイド

### 新しいコンポーネントの追加

1. **コンポーネントディレクトリの作成**
```bash
mkdir src/components/NewComponent
cd src/components/NewComponent
```

2. **ファイル作成**
```bash
touch NewComponent.tsx
touch NewComponent.module.css
touch NewComponent.test.tsx
touch index.ts
```

3. **テンプレート実装**
```typescript
// NewComponent.tsx
import React from 'react';
import styles from './NewComponent.module.css';

interface NewComponentProps {
  // Props定義
}

export const NewComponent: React.FC<NewComponentProps> = ({
  // Props分割代入
}) => {
  return (
    <div className={styles.container}>
      {/* 実装 */}
    </div>
  );
};
```

### 新しいフックの追加

```typescript
// hooks/useNewFeature.ts
import { useState, useCallback, useEffect } from 'react';

export const useNewFeature = (initialValue: any) => {
  const [state, setState] = useState(initialValue);
  
  const action = useCallback((param: any) => {
    // ロジック実装
  }, []);
  
  useEffect(() => {
    // 副作用処理
  }, []);
  
  return {
    state,
    action,
  };
};
```

### APIとの連携

```typescript
// utils/api.ts
class ApiClient {
  private baseURL: string;
  
  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }
  
  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    return response.json();
  }
  
  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return response.json();
  }
}

export const apiClient = new ApiClient(process.env.REACT_APP_API_URL || '');
```

## 📊 メトリクスと監視

### パフォーマンスメトリクス

```typescript
// utils/metrics.ts
export const trackPerformance = () => {
  // Core Web Vitals
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      console.log(`${entry.name}: ${entry.value}`);
    });
  });
  
  observer.observe({ entryTypes: ['measure', 'navigation'] });
};

// ユーザー行動の追跡
export const trackUserAction = (action: string, data?: any) => {
  if (process.env.NODE_ENV === 'production') {
    // 分析サービスに送信
    analytics.track(action, data);
  }
};
```

### エラー監視

```typescript
// utils/errorReporting.ts
export const setupErrorReporting = () => {
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    // エラー報告サービスに送信
  });
  
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    // エラー報告サービスに送信
  });
};
```

## 🔧 開発ツール設定

### VS Code設定

```json
// .vscode/settings.json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "emmet.includeLanguages": {
    "typescript": "typescriptreact"
  }
}
```

### デバッグ設定

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug React App",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/react-scripts",
      "args": ["start"],
      "env": {
        "BROWSER": "none"
      },
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

## 📈 継続的改善

### コードレビューチェックリスト

- [ ] TypeScript型定義は適切か
- [ ] パフォーマンスに問題はないか
- [ ] アクセシビリティは考慮されているか
- [ ] テストは十分か
- [ ] エラーハンドリングは適切か
- [ ] セキュリティ上の問題はないか

### リファクタリング指針

1. **小さな変更から始める**
2. **テストを先に書く**
3. **一度に一つの責任を変更する**
4. **レビューを受ける**
5. **段階的にリリースする**

---

このガイドは継続的に更新されます。質問や改善提案があれば、お気軽にお知らせください。