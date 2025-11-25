# design.mdの作成方法

## 目次
- [設計仕様とは](#設計仕様とは)
- [アーキテクチャの定義](#アーキテクチャの定義)
- [コンポーネント設計](#コンポーネント設計)
- [データモデル設計](#データモデル設計)
- [テスト戦略](#テスト戦略)
- [設計ドキュメントのベストプラクティス](#設計ドキュメントのベストプラクティス)
- [Claude Codeを使った設計作成](#claude-codeを使った設計作成)
- [実践例](#実践例)

## 設計仕様とは

`design.md`は、**どのように作るか**を定義するドキュメントです。要件定義（requirements.md）で定義された機能を、どのようなアーキテクチャ、コンポーネント、データ構造で実装するかを記述します。

### design.mdの役割

```text
設計仕様の目的:
✓ システムアーキテクチャの明確化
✓ コンポーネント間の関係定義
✓ データモデルの設計
✓ 技術的な実装方針の決定
✓ テスト戦略の策定
✓ 開発チーム全体での技術的合意形成
```

### 基本構造

```markdown
# Design Specification

## Overview
システム全体の概要と設計思想

## Architecture
### System Architecture
システム全体のアーキテクチャ

### Component Architecture
コンポーネント構成と責務

## Data Model
データベーススキーマとデータ構造

## API Design
エンドポイント設計とインターフェース

## Component Specifications
各コンポーネントの詳細設計

## Testing Strategy
テスト方針とカバレッジ目標

## Security Considerations
セキュリティ設計

## Performance Optimization
パフォーマンス要件と最適化戦略
```

## アーキテクチャの定義

### システムアーキテクチャ

#### 全体構成の記述

```markdown
## System Architecture

### Overview
本システムは3層アーキテクチャを採用し、フロントエンド、バックエンド、
データベースを明確に分離します。

### Architecture Diagram
\```
┌─────────────────────────────────────────────┐
│           Frontend (React)                  │
│  ┌─────────────────────────────────────┐   │
│  │  Components                          │   │
│  │  ├─ UserManagement                  │   │
│  │  ├─ Authentication                  │   │
│  │  └─ Dashboard                       │   │
│  └─────────────────────────────────────┘   │
│  ┌─────────────────────────────────────┐   │
│  │  State Management (Context API)     │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
                      │
                      │ REST API (HTTPS)
                      ▼
┌─────────────────────────────────────────────┐
│        Backend (Node.js + Express)          │
│  ┌─────────────────────────────────────┐   │
│  │  API Routes                          │   │
│  │  ├─ /api/users                      │   │
│  │  ├─ /api/auth                       │   │
│  │  └─ /api/search                     │   │
│  └─────────────────────────────────────┘   │
│  ┌─────────────────────────────────────┐   │
│  │  Business Logic                      │   │
│  │  ├─ UserService                     │   │
│  │  ├─ AuthService                     │   │
│  │  └─ ValidationService               │   │
│  └─────────────────────────────────────┘   │
│  ┌─────────────────────────────────────┐   │
│  │  Data Access Layer                   │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
                      │
                      │ SQL Queries
                      ▼
┌─────────────────────────────────────────────┐
│           Database (PostgreSQL)             │
│  ┌─────────────────────────────────────┐   │
│  │  Tables                              │   │
│  │  ├─ users                           │   │
│  │  ├─ sessions                        │   │
│  │  └─ audit_logs                      │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
\```

### Technology Stack
- **Frontend**: React 18, TypeScript, CSS Modules
- **Backend**: Node.js 20, Express 4.18
- **Database**: PostgreSQL 15
- **Authentication**: JWT (Access Token + Refresh Token)
- **Caching**: Redis 7
- **Build Tool**: Vite 5

### Design Principles
1. **関心の分離**: UI、ビジネスロジック、データアクセスを明確に分離
2. **疎結合**: コンポーネント間の依存を最小限に抑える
3. **テスタビリティ**: 各層が独立してテスト可能
4. **拡張性**: 新機能の追加が容易な構造
5. **型安全性**: TypeScriptによる厳密な型チェック
```

#### レイヤーアーキテクチャ

```markdown
## Layer Architecture

### Presentation Layer (Frontend)
**責務**: ユーザーインターフェース、ユーザー入力の処理

**主要コンポーネント**:
- React Components: UI表示
- Custom Hooks: ビジネスロジックの抽象化
- Context API: グローバル状態管理

**技術選択の理由**:
- React: コンポーネントベースの開発、豊富なエコシステム
- TypeScript: 型安全性、開発者体験の向上
- CSS Modules: スコープ付きスタイル、命名衝突の回避

### Business Logic Layer (Backend)
**責務**: ビジネスルールの実装、データ検証

**主要コンポーネント**:
- Services: ビジネスロジックのカプセル化
- Validators: 入力検証
- Middleware: 認証、エラーハンドリング

**技術選択の理由**:
- Node.js: JavaScriptエコシステムとの統合
- Express: シンプルで柔軟なルーティング
- JWT: ステートレスな認証

### Data Access Layer
**責務**: データベース操作、クエリの最適化

**主要コンポーネント**:
- Repositories: データアクセスの抽象化
- Query Builder: 型安全なクエリ構築
- Connection Pool: 効率的なDB接続管理

**技術選択の理由**:
- PostgreSQL: ACID準拠、複雑なクエリサポート
- Prisma/TypeORM: 型安全なORM、マイグレーション管理
```

### マイクロサービスアーキテクチャの例

```markdown
## Microservices Architecture

### Service Overview
\```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   User       │     │   Auth       │     │   Notification│
│   Service    │────▶│   Service    │────▶│   Service    │
│   :8001      │     │   :8002      │     │   :8003      │
└──────────────┘     └──────────────┘     └──────────────┘
        │                    │                     │
        └────────────────────┴─────────────────────┘
                             │
                             ▼
                    ┌──────────────┐
                    │   API        │
                    │   Gateway    │
                    │   :8000      │
                    └──────────────┘
                             │
                             ▼
                    ┌──────────────┐
                    │   Frontend   │
                    │   :3000      │
                    └──────────────┘
\```

### Service Specifications

#### User Service
- **責務**: ユーザー情報のCRUD操作
- **ポート**: 8001
- **データベース**: PostgreSQL (users DB)
- **API**: REST
- **依存サービス**: Auth Service

#### Auth Service
- **責務**: 認証・認可
- **ポート**: 8002
- **データベース**: Redis (sessions)
- **API**: REST + WebSocket
- **依存サービス**: User Service, Notification Service

#### Notification Service
- **責務**: メール・プッシュ通知
- **ポート**: 8003
- **メッセージキュー**: RabbitMQ
- **API**: Event-driven
- **依存サービス**: なし

### Inter-Service Communication
- **同期通信**: REST API (HTTP/HTTPS)
- **非同期通信**: RabbitMQ (メッセージキュー)
- **サービスディスカバリ**: Consul
- **負荷分散**: Nginx
```

## コンポーネント設計

### Reactコンポーネント構造

```markdown
## Component Architecture

### Directory Structure
\```
src/
├── components/
│   ├── common/                    # 共通コンポーネント
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.module.css
│   │   │   ├── Button.test.tsx
│   │   │   └── index.ts
│   │   ├── Input/
│   │   └── Modal/
│   │
│   ├── features/                  # 機能別コンポーネント
│   │   ├── UserManagement/
│   │   │   ├── UserList/
│   │   │   ├── UserForm/
│   │   │   ├── UserCard/
│   │   │   └── index.ts
│   │   ├── Authentication/
│   │   └── Dashboard/
│   │
│   └── layouts/                   # レイアウトコンポーネント
│       ├── MainLayout/
│       ├── AuthLayout/
│       └── index.ts
│
├── hooks/                         # カスタムフック
│   ├── useUsers.ts
│   ├── useAuth.ts
│   └── useLocalStorage.ts
│
├── contexts/                      # Context API
│   ├── AuthContext.tsx
│   └── ThemeContext.tsx
│
├── types/                         # TypeScript型定義
│   ├── user.ts
│   ├── auth.ts
│   └── api.ts
│
└── utils/                         # ユーティリティ関数
    ├── validation.ts
    ├── formatting.ts
    └── storage.ts
\```

### Component Design Patterns

#### 1. Container/Presentational Pattern
\```typescript
// Container Component (ロジック担当)
// UserListContainer.tsx
import { useUsers } from '@/hooks/useUsers';
import { UserList } from './UserList';

export const UserListContainer: React.FC = () => {
  const { users, loading, error, deleteUser } = useUsers();

  const handleDelete = async (id: string) => {
    if (confirm('本当に削除しますか?')) {
      await deleteUser(id);
    }
  };

  return (
    <UserList
      users={users}
      loading={loading}
      error={error}
      onDelete={handleDelete}
    />
  );
};

// Presentational Component (表示担当)
// UserList.tsx
interface UserListProps {
  users: User[];
  loading: boolean;
  error: Error | null;
  onDelete: (id: string) => void;
}

export const UserList: React.FC<UserListProps> = ({
  users,
  loading,
  error,
  onDelete,
}) => {
  if (loading) return <Loading />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <ul className={styles.userList}>
      {users.map(user => (
        <UserCard
          key={user.id}
          user={user}
          onDelete={() => onDelete(user.id)}
        />
      ))}
    </ul>
  );
};
\```

#### 2. Compound Component Pattern
\```typescript
// Modal.tsx
export const Modal = ({ children, isOpen, onClose }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

Modal.Header = ({ children }: { children: React.ReactNode }) => (
  <div className={styles.header}>{children}</div>
);

Modal.Body = ({ children }: { children: React.ReactNode }) => (
  <div className={styles.body}>{children}</div>
);

Modal.Footer = ({ children }: { children: React.ReactNode }) => (
  <div className={styles.footer}>{children}</div>
);

// 使用例
<Modal isOpen={isOpen} onClose={handleClose}>
  <Modal.Header>
    <h2>ユーザー削除</h2>
  </Modal.Header>
  <Modal.Body>
    <p>本当に削除しますか?</p>
  </Modal.Body>
  <Modal.Footer>
    <Button onClick={handleClose}>キャンセル</Button>
    <Button onClick={handleDelete} variant="danger">削除</Button>
  </Modal.Footer>
</Modal>
\```

#### 3. Custom Hook Pattern
\```typescript
// useUsers.ts
export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.getUsers();
      setUsers(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  const addUser = useCallback(async (user: NewUser) => {
    const newUser = await api.createUser(user);
    setUsers(prev => [...prev, newUser]);
    return newUser;
  }, []);

  const updateUser = useCallback(async (id: string, updates: Partial<User>) => {
    const updated = await api.updateUser(id, updates);
    setUsers(prev => prev.map(u => u.id === id ? updated : u));
    return updated;
  }, []);

  const deleteUser = useCallback(async (id: string) => {
    await api.deleteUser(id);
    setUsers(prev => prev.filter(u => u.id !== id));
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    addUser,
    updateUser,
    deleteUser,
    refetch: fetchUsers,
  };
};
\```

### コンポーネント設計原則

```markdown
## Component Design Principles

### 1. Single Responsibility
各コンポーネントは1つの責務のみを持つ

**良い例**:
- `Button`: ボタンの表示とクリックイベント
- `UserCard`: ユーザー情報の表示
- `SearchBar`: 検索入力とフィルタリング

**悪い例**:
- `UserManagement`: ユーザー表示+検索+編集+削除（責務が多すぎる）

### 2. Props Drilling の回避
深いネストでのprops渡しはContext APIで解決

\```typescript
// 悪い例: Props Drilling
<App>
  <Header user={user} />           {/* ▼ user を渡す */}
    <Navigation user={user} />     {/* ▼ user を渡す */}
      <UserMenu user={user} />     {/* ▼ user を使用 */}
</App>

// 良い例: Context API
<AuthProvider>
  <App>
    <Header />
      <Navigation />
        <UserMenu />  {/* useAuth() で取得 */}
  </App>
</AuthProvider>
\```

### 3. Memoization
パフォーマンス最適化のため適切にメモ化

\```typescript
// React.memo: 不要な再レンダリング防止
export const UserCard = React.memo(({ user, onDelete }: UserCardProps) => {
  return (
    <div className={styles.card}>
      <h3>{user.name}</h3>
      <button onClick={onDelete}>削除</button>
    </div>
  );
});

// useMemo: 計算コストの高い処理のメモ化
const sortedUsers = useMemo(() => {
  return users.sort((a, b) => a.name.localeCompare(b.name));
}, [users]);

// useCallback: 関数のメモ化
const handleDelete = useCallback((id: string) => {
  deleteUser(id);
}, [deleteUser]);
\```

### 4. Error Boundaries
エラーハンドリングの責務分離

\```typescript
// ErrorBoundary.tsx
export class ErrorBoundary extends React.Component<Props, State> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // エラーログサービスに送信
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}

// 使用例
<ErrorBoundary>
  <UserManagementApp />
</ErrorBoundary>
\```
```

## データモデル設計

### データベーススキーマ

```markdown
## Database Schema

### Entity Relationship Diagram
\```
┌─────────────────────┐
│      users          │
├─────────────────────┤
│ id (PK)            │
│ email (UNIQUE)     │
│ password_hash      │
│ name               │
│ profile_image_url  │
│ email_verified     │
│ created_at         │
│ updated_at         │
│ deleted_at         │
└─────────────────────┘
          │
          │ 1:N
          ▼
┌─────────────────────┐
│     sessions        │
├─────────────────────┤
│ id (PK)            │
│ user_id (FK)       │
│ token_hash         │
│ refresh_token_hash │
│ ip_address         │
│ user_agent         │
│ expires_at         │
│ created_at         │
└─────────────────────┘
          │
          │
          │ 1:N
          ▼
┌─────────────────────┐
│    audit_logs       │
├─────────────────────┤
│ id (PK)            │
│ user_id (FK)       │
│ action             │
│ resource_type      │
│ resource_id        │
│ details (JSONB)    │
│ ip_address         │
│ created_at         │
└─────────────────────┘
\```

### Table Definitions

#### users テーブル
\```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  profile_image_url VARCHAR(500),
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- インデックス
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_users_deleted_at ON users(deleted_at) WHERE deleted_at IS NULL;

-- トリガー: updated_at自動更新
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
\```

#### sessions テーブル
\```sql
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL UNIQUE,
  refresh_token_hash VARCHAR(255) NOT NULL UNIQUE,
  ip_address INET,
  user_agent TEXT,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- インデックス
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_token_hash ON sessions(token_hash);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);

-- 自動削除: 期限切れセッション
CREATE INDEX idx_sessions_expired ON sessions(expires_at) WHERE expires_at < CURRENT_TIMESTAMP;
\```

#### audit_logs テーブル
\```sql
CREATE TABLE audit_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(50) NOT NULL,
  resource_type VARCHAR(50),
  resource_id UUID,
  details JSONB,
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- インデックス
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_details ON audit_logs USING GIN(details);
\```

### TypeScript型定義

#### データ型の定義
\```typescript
// types/user.ts
export interface User {
  id: string;
  email: string;
  name: string;
  profileImageUrl?: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NewUser {
  email: string;
  password: string;
  name: string;
}

export interface UpdateUser {
  name?: string;
  profileImageUrl?: string;
}

// types/auth.ts
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface Session {
  id: string;
  userId: string;
  ipAddress?: string;
  userAgent?: string;
  expiresAt: string;
  createdAt: string;
}

// types/audit.ts
export interface AuditLog {
  id: number;
  userId?: string;
  action: AuditAction;
  resourceType?: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  createdAt: string;
}

export enum AuditAction {
  USER_CREATED = 'USER_CREATED',
  USER_UPDATED = 'USER_UPDATED',
  USER_DELETED = 'USER_DELETED',
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILED = 'LOGIN_FAILED',
  LOGOUT = 'LOGOUT',
}
\```

### データ検証

\```typescript
// utils/validation.ts
import { z } from 'zod';

// ユーザー登録のバリデーション
export const NewUserSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z
    .string()
    .min(8, 'パスワードは8文字以上である必要があります')
    .regex(/[A-Z]/, '大文字を1文字以上含めてください')
    .regex(/[a-z]/, '小文字を1文字以上含めてください')
    .regex(/[0-9]/, '数字を1文字以上含めてください')
    .regex(/[@$!%*?&]/, '特殊文字を1文字以上含めてください'),
  name: z
    .string()
    .min(1, '名前を入力してください')
    .max(100, '名前は100文字以内で入力してください'),
});

// ユーザー更新のバリデーション
export const UpdateUserSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  profileImageUrl: z.string().url().optional(),
});

// バリデーション実行関数
export function validateNewUser(data: unknown): NewUser {
  return NewUserSchema.parse(data);
}

export function validateUpdateUser(data: unknown): UpdateUser {
  return UpdateUserSchema.parse(data);
}
\```
```

## テスト戦略

```markdown
## Testing Strategy

### Testing Pyramid
\```
           ┌───────────────┐
           │   E2E Tests   │  10%
           │  (Playwright) │
           └───────────────┘
         ┌───────────────────┐
         │ Integration Tests │  20%
         │    (Vitest)       │
         └───────────────────┘
     ┌─────────────────────────┐
     │     Unit Tests          │  70%
     │   (Vitest + RTL)        │
     └─────────────────────────┘
\```

### Unit Testing

#### コンポーネントテスト
\```typescript
// UserCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { UserCard } from './UserCard';

describe('UserCard', () => {
  const mockUser = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    emailVerified: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  };

  const mockOnDelete = vi.fn();

  beforeEach(() => {
    mockOnDelete.mockClear();
  });

  it('ユーザー情報を表示する', () => {
    render(<UserCard user={mockUser} onDelete={mockOnDelete} />);

    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('削除ボタンクリックでonDeleteが呼ばれる', () => {
    render(<UserCard user={mockUser} onDelete={mockOnDelete} />);

    const deleteButton = screen.getByRole('button', { name: '削除' });
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith('1');
  });

  it('メール未検証の場合はバッジが表示される', () => {
    const unverifiedUser = { ...mockUser, emailVerified: false };
    render(<UserCard user={unverifiedUser} onDelete={mockOnDelete} />);

    expect(screen.getByText('未検証')).toBeInTheDocument();
  });
});
\```

#### カスタムフックテスト
\```typescript
// useUsers.test.ts
import { renderHook, act, waitFor } from '@testing-library/react';
import { useUsers } from './useUsers';
import * as api from '@/api/users';

vi.mock('@/api/users');

describe('useUsers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('初期ロード時にユーザーを取得する', async () => {
    const mockUsers = [
      { id: '1', name: 'User 1', email: 'user1@example.com' },
      { id: '2', name: 'User 2', email: 'user2@example.com' },
    ];
    vi.mocked(api.getUsers).mockResolvedValue(mockUsers);

    const { result } = renderHook(() => useUsers());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.users).toEqual(mockUsers);
    expect(api.getUsers).toHaveBeenCalledTimes(1);
  });

  it('ユーザーを追加できる', async () => {
    const newUser = { email: 'new@example.com', name: 'New User', password: 'pass123' };
    const createdUser = { id: '3', ...newUser };

    vi.mocked(api.createUser).mockResolvedValue(createdUser);

    const { result } = renderHook(() => useUsers());

    await act(async () => {
      const user = await result.current.addUser(newUser);
      expect(user).toEqual(createdUser);
    });

    expect(result.current.users).toContainEqual(createdUser);
  });

  it('エラー時はerror状態が設定される', async () => {
    const error = new Error('API Error');
    vi.mocked(api.getUsers).mockRejectedValue(error);

    const { result } = renderHook(() => useUsers());

    await waitFor(() => {
      expect(result.current.error).toEqual(error);
      expect(result.current.loading).toBe(false);
    });
  });
});
\```

### Integration Testing

\```typescript
// user-management.integration.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UserManagementApp } from './UserManagementApp';
import { setupServer } from 'msw/node';
import { rest } from 'msw';

const server = setupServer(
  rest.get('/api/users', (req, res, ctx) => {
    return res(ctx.json([
      { id: '1', name: 'User 1', email: 'user1@example.com' },
    ]));
  }),
  rest.post('/api/users', (req, res, ctx) => {
    return res(ctx.json({ id: '2', ...req.body }));
  }),
  rest.delete('/api/users/:id', (req, res, ctx) => {
    return res(ctx.status(204));
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('User Management Integration', () => {
  it('ユーザーの一覧表示から追加、削除までの一連の流れ', async () => {
    render(<UserManagementApp />);

    // 一覧表示
    await waitFor(() => {
      expect(screen.getByText('User 1')).toBeInTheDocument();
    });

    // ユーザー追加
    fireEvent.click(screen.getByRole('button', { name: '新規追加' }));
    fireEvent.change(screen.getByLabelText('名前'), { target: { value: 'New User' } });
    fireEvent.change(screen.getByLabelText('メールアドレス'), { target: { value: 'new@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: '登録' }));

    await waitFor(() => {
      expect(screen.getByText('New User')).toBeInTheDocument();
    });

    // ユーザー削除
    const deleteButtons = screen.getAllByRole('button', { name: '削除' });
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(screen.queryByText('User 1')).not.toBeInTheDocument();
    });
  });
});
\```

### E2E Testing

\```typescript
// tests/e2e/user-management.spec.ts
import { test, expect } from '@playwright/test';

test.describe('User Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('ユーザー登録から削除までの完全なフロー', async ({ page }) => {
    // ログイン
    await page.fill('[name="email"]', 'admin@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('http://localhost:3000/dashboard');

    // ユーザー管理画面へ移動
    await page.click('text=ユーザー管理');
    await expect(page).toHaveURL('http://localhost:3000/users');

    // 新規ユーザー追加
    await page.click('button:has-text("新規追加")');
    await page.fill('[name="name"]', 'E2E Test User');
    await page.fill('[name="email"]', 'e2e@example.com');
    await page.fill('[name="password"]', 'Test123!@#');
    await page.click('button:has-text("登録")');

    // 成功メッセージ確認
    await expect(page.locator('text=ユーザーを登録しました')).toBeVisible();

    // ユーザーリストに表示されることを確認
    await expect(page.locator('text=E2E Test User')).toBeVisible();

    // ユーザー削除
    await page.click('[data-testid="delete-user-e2e@example.com"]');
    await page.click('button:has-text("削除する")'); // 確認ダイアログ

    // 削除されたことを確認
    await expect(page.locator('text=E2E Test User')).not.toBeVisible();
  });

  test('バリデーションエラーが表示される', async ({ page }) => {
    await page.click('button:has-text("新規追加")');

    // 名前を入力せずに送信
    await page.fill('[name="email"]', 'test@example.com');
    await page.click('button:has-text("登録")');

    // エラーメッセージ確認
    await expect(page.locator('text=名前を入力してください')).toBeVisible();
  });
});
\```

### カバレッジ目標

\```json
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80,
      },
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.test.ts',
        '**/*.test.tsx',
        '**/*.spec.ts',
      ],
    },
  },
});
\```

### テストのベストプラクティス

1. **AAA Pattern**: Arrange - Act - Assert
2. **テストの独立性**: 各テストは独立して実行可能
3. **モックの適切な使用**: 外部依存をモック化
4. **意味のあるテスト名**: 何をテストしているか明確に
5. **エッジケースのテスト**: 正常系だけでなく異常系も
```

## 設計ドキュメントのベストプラクティス

```markdown
## Design Documentation Best Practices

### 1. 図を活用する

**良い例**:
\```markdown
### アーキテクチャ図
[ASCII art or Mermaid diagram]

### データフロー
[Sequence diagram]

### コンポーネント構造
[Component tree diagram]
\```

**ツール**:
- ASCII art: シンプルな図
- Mermaid: より複雑な図（UML、シーケンス、フローチャート）
- Draw.io: 詳細な図（画像として埋め込み）

### 2. コード例を含める

設計の意図を示すコードスニペットを含める

\```typescript
// 良い例: 実装イメージが具体的
/**
 * User認証サービス
 * - JWT トークンベース
 * - Refresh token でセッション延長
 */
class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // 実装...
  }
}

// 悪い例: 抽象的すぎる
// 認証機能を提供する
\```

### 3. トレーサビリティ

要件へのリンクを含める

\```markdown
## User Authentication Design

**Requirements**: [US-001](../requirements.md#us-001), [US-002](../requirements.md#us-002)

**Implementation**: [tasks.md#task-001](../tasks.md#task-001)
\```

### 4. 設計の理由を記録

技術選択の理由を明記

\```markdown
## Why PostgreSQL?

### 選択理由
- ACID準拠のトランザクション
- JSON型による柔軟なデータ構造
- 豊富なインデックス種別
- 成熟したエコシステム

### 検討したが採用しなかった選択肢
- MongoDB: トランザクションサポートが弱い
- MySQL: JSON機能がPostgreSQLより劣る
\```

### 5. 制約と前提条件

\```markdown
## Constraints and Assumptions

### Performance Constraints
- 同時接続数: 最大10,000
- レスポンスタイム: 95%ile で 200ms以下
- データベースサイズ: 初年度100GB想定

### Security Constraints
- HTTPS必須
- パスワードはbcryptでハッシュ化（コスト12）
- セッショントークンは暗号学的に安全なランダム値

### Scalability Assumptions
- ユーザー数: 初年度10万人想定
- 年間成長率: 50%
- 読み取り:書き込み比率 = 9:1
\```

### 6. 決定事項の記録(ADR: Architecture Decision Record)

\```markdown
## ADR-001: React Context API for State Management

### Status
Accepted

### Context
グローバル状態管理のソリューションが必要。
Redux, Zustand, Context APIなどの選択肢がある。

### Decision
React Context APIを採用する。

### Consequences

#### Pros
- 追加ライブラリ不要
- Reactのビルトイン機能
- シンプルな学習曲線
- プロジェクトサイズに適している

#### Cons
- 大規模アプリではパフォーマンス課題
- DevToolsのサポートがない
- ミドルウェアサポートがない

### Notes
将来的にユーザー数が増加し、状態管理が複雑化した場合は、
Zustandへの移行を検討する。
\```
```

## Claude Codeを使った設計作成

### ステップ1: アーキテクチャ設計

```bash
# プロンプト例
「.kiro/specs/design.mdを作成してください。
プロジェクトはReact + Node.js + PostgreSQLのWebアプリケーションです。

以下の情報を基に、システムアーキテクチャを設計してください：
- 要件: .kiro/specs/requirements.md を参照
- 技術スタック: .kiro/steering/tech.md を参照

以下を含めてください：
1. システムアーキテクチャ図
2. レイヤー構成
3. コンポーネント構造
4. データフロー」
```

### ステップ2: コンポーネント設計の詳細化

```bash
# プロンプト例
「design.mdのコンポーネント設計セクションを詳細化してください。

以下のコンポーネントについて設計を追加：
1. UserManagement: ユーザー管理画面
   - UserList: ユーザー一覧
   - UserForm: 新規作成・編集フォーム
   - UserCard: 個別ユーザー表示

各コンポーネントについて：
- Props interface
- 状態管理
- イベントハンドリング
- 実装サンプルコード」
```

### ステップ3: データモデル設計

```bash
# プロンプト例
「design.mdにデータベーススキーマを追加してください。

テーブル：
- users: ユーザー情報
- sessions: セッション管理
- audit_logs: 監査ログ

各テーブルについて：
1. CREATE TABLE文
2. インデックス定義
3. 外部キー制約
4. TypeScript型定義
5. バリデーションスキーマ（Zod）」
```

### ステップ4: テスト戦略の追加

```bash
# プロンプト例
「design.mdにテスト戦略セクションを追加してください。

以下を含める：
1. テストピラミッド（Unit/Integration/E2E の比率）
2. 各コンポーネントのユニットテスト例
3. Integration testのサンプル
4. E2E testのシナリオ
5. カバレッジ目標設定」
```

### ステップ5: レビューと改善

```bash
# プロンプト例
「design.mdをレビューして、以下の観点で改善提案をしてください：

1. アーキテクチャの一貫性
2. スケーラビリティ
3. セキュリティ考慮事項
4. パフォーマンス最適化
5. テスタビリティ
6. メンテナンス性

不足している設計情報や改善点を指摘してください。」
```

## 実践例

### 完全なdesign.mdの例（抜粋）

詳細な完全版のサンプルは、実際のプロジェクトの`.kiro/specs/design.md`を参照してください。

```markdown
# Design Specification

## Overview
ユーザー管理Webアプリケーションの設計仕様。
3層アーキテクチャ（フロントエンド、バックエンド、データベース）を採用し、
拡張性とメンテナンス性を重視した設計。

## System Architecture

[システムアーキテクチャ図...]

## Component Architecture

[コンポーネント設計...]

## Data Model

[データモデル設計...]

## API Design

### REST API Endpoints

#### User Management

\```
POST   /api/users              # ユーザー作成
GET    /api/users              # ユーザー一覧取得
GET    /api/users/:id          # 特定ユーザー取得
PATCH  /api/users/:id          # ユーザー更新
DELETE /api/users/:id          # ユーザー削除
GET    /api/users/search?q=... # ユーザー検索
\```

#### Authentication

\```
POST   /api/auth/register      # 新規登録
POST   /api/auth/login         # ログイン
POST   /api/auth/logout        # ログアウト
POST   /api/auth/refresh       # トークンリフレッシュ
POST   /api/auth/verify-email  # メール検証
\```

### Request/Response Examples

#### POST /api/users

**Request**:
\```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe"
}
\```

**Response** (201 Created):
\```json
{
  "user": {
    "id": "uuid-here",
    "email": "user@example.com",
    "name": "John Doe",
    "emailVerified": false,
    "createdAt": "2025-01-25T00:00:00Z",
    "updatedAt": "2025-01-25T00:00:00Z"
  }
}
\```

**Error Response** (400 Bad Request):
\```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "password",
        "message": "Password must be at least 8 characters"
      }
    ]
  }
}
\```

## Testing Strategy

[テスト戦略...]

## Security Considerations

### Authentication
- JWT (JSON Web Token) を使用
- Access Token: 有効期限15分
- Refresh Token: 有効期限30日（Remember Me時）

### Password Security
- bcrypt でハッシュ化（cost: 12）
- パスワード要件: 8文字以上、大小英数字+特殊文字

### HTTPS
- 本番環境では必須
- HSTSヘッダーの設定

### CORS
- 許可されたオリジンのみ
- 本番環境では厳格に設定

### Rate Limiting
- ログイン: 5回/15分
- API呼び出し: 100回/分

### SQL Injection Prevention
- パラメータ化クエリの使用
- ORMによる自動エスケープ

## Performance Optimization

### Frontend
- Code splitting (React.lazy)
- Image optimization (WebP, lazy loading)
- Memoization (React.memo, useMemo, useCallback)
- Virtual scrolling (1000+アイテム時)

### Backend
- Database connection pooling
- Query optimization (インデックス)
- Response caching (Redis, 5分間)
- Gzip compression

### Database
- Proper indexing
- Query optimization
- Connection pooling
- Read replica (将来的に)

## Scalability Considerations

### Horizontal Scaling
- ステートレスな設計
- セッションはRedisで管理
- ロードバランサー対応

### Database Scaling
- Read replica for read-heavy operations
- Sharding strategy (将来的に)
- Archiving old data

### Caching Strategy
- Redis for session storage
- API response caching
- Static asset CDN

## Monitoring and Logging

### Application Logging
- Winston for structured logging
- Log levels: error, warn, info, debug
- Log rotation (daily, 30日保存)

### Error Tracking
- Sentry integration
- Error grouping and alerting

### Performance Monitoring
- Response time tracking
- Database query performance
- Memory usage monitoring

### Audit Logging
- User actions (create, update, delete)
- Authentication events
- JSONB format for flexibility

---

**Requirements Traceability**:
- [US-001: User Registration](../requirements.md#us-001)
- [US-002: User Login](../requirements.md#us-002)
- [US-003: User Search](../requirements.md#us-003)

**Related Tasks**:
- [Task Planning](../tasks.md)

**Technology Stack**:
- [Tech Stack Details](../../steering/tech.md)
```

## まとめ

### 設計仕様のチェックリスト

```markdown
## Design Specification Checklist

### アーキテクチャ
- [ ] システム全体のアーキテクチャ図
- [ ] レイヤー構成と責務
- [ ] 技術スタックの選択理由
- [ ] スケーラビリティ考慮

### コンポーネント設計
- [ ] ディレクトリ構造
- [ ] 主要コンポーネントの責務
- [ ] コンポーネント間の関係
- [ ] 設計パターンの適用

### データモデル
- [ ] ER図
- [ ] テーブル定義
- [ ] インデックス戦略
- [ ] TypeScript型定義

### API設計
- [ ] エンドポイント一覧
- [ ] Request/Response例
- [ ] エラーハンドリング
- [ ] 認証・認可方式

### テスト戦略
- [ ] テストピラミッド
- [ ] Unit test例
- [ ] Integration test例
- [ ] E2E test例
- [ ] カバレッジ目標

### セキュリティ
- [ ] 認証方式
- [ ] 認可方式
- [ ] データ保護
- [ ] 脆弱性対策

### パフォーマンス
- [ ] 最適化戦略
- [ ] キャッシュ戦略
- [ ] スケーリング計画

### トレーサビリティ
- [ ] 要件へのリンク
- [ ] タスクへのリンク
- [ ] 技術スタックへのリンク
```

### 次のステップ

設計仕様が完成したら、実装フェーズに進みます：

1. [タスク管理（tasks.md）の活用](./04-tasks-spec.md)
2. [AIとの協働ワークフロー](./05-ai-workflow.md)

---

**関連ドキュメント:**
- [.kiroディレクトリの基礎](./01-steering-basics.md)
- [要件定義の作成](./02-requirements-spec.md)
- [タスク管理の活用](./04-tasks-spec.md)

**タグ:** #spec-driven #design #architecture #component-design #data-model #testing #kiro
