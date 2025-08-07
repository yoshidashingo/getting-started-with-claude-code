# AIと設計

Claude Codeを活用した設計プロセスについて説明します。設計パターンとアーキテクチャ決定の支援方法を学習できます。

## AIを活用した設計とは

従来の設計プロセスでは、個人の経験と知識に依存した設計判断が多く、一貫性や最適性の確保が困難でした。AI活用設計では、Claude Codeとの対話を通じて、ベストプラクティスに基づいた設計決定を効率的に行います。

### AI活用設計の利点

- **知識の活用**: 豊富な設計パターンとベストプラクティスの適用
- **一貫性**: プロジェクト全体での設計方針の統一
- **効率性**: 設計検討時間の短縮と品質向上
- **学習効果**: 設計の根拠と理由の理解促進

## 設計プロセス

### フェーズ1: アーキテクチャ設計

#### ステップ1: システム全体構成の検討

**プロンプト例:**
```
タスク管理システムのアーキテクチャ設計を支援してください。

要件概要:
- ユーザー数: 50名（同時接続20名）
- 主要機能: タスク管理、リアルタイム共有、進捗可視化
- 非機能要件: レスポンス3秒以内、可用性99.5%
- 制約: 既存AD連携、社内セキュリティポリシー遵守

以下の観点で設計を提案してください:
1. 全体アーキテクチャパターン
2. 技術スタック選択
3. データベース設計方針
4. セキュリティアーキテクチャ
5. 拡張性への配慮
```

**Claude Codeからの提案例:**
```
# タスク管理システム アーキテクチャ設計

## 1. 全体アーキテクチャパターン

### 推奨パターン: レイヤードアーキテクチャ + MVC

```
┌─────────────────────────────────────┐
│           Presentation Layer        │
│  (React SPA + WebSocket Client)     │
├─────────────────────────────────────┤
│           Application Layer         │
│     (Node.js + Express + Socket.io) │
├─────────────────────────────────────┤
│            Business Layer           │
│        (Service Classes)            │
├─────────────────────────────────────┤
│         Data Access Layer           │
│    (Repository Pattern + ORM)       │
├─────────────────────────────────────┤
│           Database Layer            │
│         (PostgreSQL)                │
└─────────────────────────────────────┘
```

**選択理由:**
- 小〜中規模システムに適している
- 開発・保守が容易
- チーム開発に適している
- 段階的な拡張が可能

## 2. 技術スタック選択

### フロントエンド
- **React 18** + TypeScript
  - 理由: コンポーネントベース、豊富なエコシステム
- **Material-UI v5**
  - 理由: 企業向けUI、アクセシビリティ対応
- **Socket.io Client**
  - 理由: リアルタイム通信、フォールバック機能

### バックエンド
- **Node.js 18** + Express
  - 理由: JavaScript統一、高いパフォーマンス
- **Socket.io**
  - 理由: リアルタイム通信、スケーラビリティ
- **Prisma ORM**
  - 理由: 型安全、マイグレーション管理

### データベース
- **PostgreSQL 15**
  - 理由: ACID準拠、JSON対応、拡張性
- **Redis**
  - 理由: セッション管理、キャッシュ、リアルタイム通信

### インフラ
- **Docker** + **Docker Compose**
  - 理由: 環境統一、デプロイ簡素化
- **Nginx**
  - 理由: リバースプロキシ、静的ファイル配信

## 3. データベース設計方針

### 正規化レベル: 第3正規形
- データ整合性の確保
- 冗長性の排除
- 保守性の向上

### 主要テーブル設計
```sql
-- ユーザー管理
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    department_id UUID REFERENCES departments(id),
    role user_role NOT NULL DEFAULT 'member',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- タスク管理
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status task_status NOT NULL DEFAULT 'todo',
    priority task_priority NOT NULL DEFAULT 'medium',
    due_date TIMESTAMP,
    assigned_to UUID REFERENCES users(id),
    created_by UUID REFERENCES users(id) NOT NULL,
    project_id UUID REFERENCES projects(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### インデックス戦略
```sql
-- パフォーマンス最適化
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
```

## 4. セキュリティアーキテクチャ

### 認証・認可フロー
```
1. ユーザーログイン → AD認証
2. JWT トークン発行（有効期限: 8時間）
3. リフレッシュトークン発行（有効期限: 30日）
4. 各APIリクエストでJWT検証
5. 権限チェック（RBAC）
```

### セキュリティ対策
- **通信暗号化**: TLS 1.3
- **入力検証**: Joi バリデーション
- **SQLインジェクション対策**: Prisma ORM使用
- **XSS対策**: CSP ヘッダー設定
- **CSRF対策**: SameSite Cookie

## 5. 拡張性への配慮

### 水平スケーリング対応
```
┌─────────────┐    ┌─────────────┐
│ Load        │    │ Load        │
│ Balancer    │    │ Balancer    │
└─────────────┘    └─────────────┘
       │                   │
┌─────────────┐    ┌─────────────┐
│ App Server  │    │ App Server  │
│ Instance 1  │    │ Instance 2  │
└─────────────┘    └─────────────┘
       │                   │
       └───────┬───────────┘
               │
    ┌─────────────┐
    │ Database    │
    │ Cluster     │
    └─────────────┘
```

### マイクロサービス移行パス
1. **Phase 1**: モノリシック構成
2. **Phase 2**: 機能別モジュール分離
3. **Phase 3**: マイクロサービス化

この設計により、現在の要件を満たしながら、
将来の拡張にも対応できるシステムが構築できます。
```

#### ステップ2: 詳細設計の検討

**プロンプト例:**
```
提案されたアーキテクチャを基に、以下の詳細設計を行ってください：

1. APIエンドポイント設計
2. データモデル詳細設計
3. リアルタイム通信設計
4. 状態管理設計（フロントエンド）
5. エラーハンドリング設計

RESTful APIの原則に従い、OpenAPI仕様も含めてください。
```

**Claude Codeの詳細設計例:**
```
# 詳細設計仕様

## 1. API エンドポイント設計

### RESTful API 設計原則
- リソースベースのURL設計
- HTTPメソッドの適切な使用
- ステータスコードの統一
- 一貫したレスポンス形式

### エンドポイント一覧

#### 認証関連
```
POST   /api/auth/login          # ログイン
POST   /api/auth/logout         # ログアウト
POST   /api/auth/refresh        # トークン更新
GET    /api/auth/me             # 現在のユーザー情報
```

#### ユーザー管理
```
GET    /api/users               # ユーザー一覧取得
GET    /api/users/:id           # 特定ユーザー取得
PUT    /api/users/:id           # ユーザー情報更新
GET    /api/users/:id/tasks     # ユーザーのタスク一覧
```

#### タスク管理
```
GET    /api/tasks               # タスク一覧取得
POST   /api/tasks               # タスク作成
GET    /api/tasks/:id           # 特定タスク取得
PUT    /api/tasks/:id           # タスク更新
DELETE /api/tasks/:id           # タスク削除
POST   /api/tasks/:id/comments  # コメント追加
```

#### プロジェクト管理
```
GET    /api/projects            # プロジェクト一覧
POST   /api/projects            # プロジェクト作成
GET    /api/projects/:id        # プロジェクト詳細
PUT    /api/projects/:id        # プロジェクト更新
GET    /api/projects/:id/tasks  # プロジェクトのタスク
```

### OpenAPI 仕様例

```yaml
openapi: 3.0.3
info:
  title: Task Management API
  version: 1.0.0
  description: 社内タスク管理システムAPI

paths:
  /api/tasks:
    get:
      summary: タスク一覧取得
      parameters:
        - name: status
          in: query
          schema:
            type: string
            enum: [todo, in_progress, done, on_hold]
        - name: assigned_to
          in: query
          schema:
            type: string
            format: uuid
        - name: page
          in: query
          schema:
            type: integer
            minimum: 1
            default: 1
        - name: limit
          in: query
          schema:
            type: integer
            minimum: 1
            maximum: 100
            default: 20
      responses:
        '200':
          description: 成功
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/Task'
                  pagination:
                    $ref: '#/components/schemas/Pagination'
                  
    post:
      summary: タスク作成
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateTaskRequest'
      responses:
        '201':
          description: 作成成功
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Task'
        '400':
          description: バリデーションエラー
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

components:
  schemas:
    Task:
      type: object
      properties:
        id:
          type: string
          format: uuid
        title:
          type: string
          maxLength: 255
        description:
          type: string
        status:
          type: string
          enum: [todo, in_progress, done, on_hold]
        priority:
          type: string
          enum: [low, medium, high, urgent]
        due_date:
          type: string
          format: date-time
        assigned_to:
          $ref: '#/components/schemas/User'
        created_by:
          $ref: '#/components/schemas/User'
        project:
          $ref: '#/components/schemas/Project'
        created_at:
          type: string
          format: date-time
        updated_at:
          type: string
          format: date-time
      required:
        - id
        - title
        - status
        - priority
        - created_by
        - created_at
        - updated_at
```

## 2. データモデル詳細設計

### ドメインモデル

```typescript
// Domain Models
export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  department: Department;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
  assignedTo?: User;
  createdBy: User;
  project?: Project;
  comments: Comment[];
  attachments: Attachment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  startDate?: Date;
  endDate?: Date;
  owner: User;
  members: User[];
  tasks: Task[];
  createdAt: Date;
  updatedAt: Date;
}

// Enums
export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
  ON_HOLD = 'on_hold'
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export enum UserRole {
  MEMBER = 'member',
  MANAGER = 'manager',
  ADMIN = 'admin'
}
```

### データベーススキーマ

```sql
-- 部門テーブル
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES departments(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ユーザーテーブル
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    department_id UUID REFERENCES departments(id),
    role user_role NOT NULL DEFAULT 'member',
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- プロジェクトテーブル
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status project_status NOT NULL DEFAULT 'active',
    start_date DATE,
    end_date DATE,
    owner_id UUID REFERENCES users(id) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- タスクテーブル
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status task_status NOT NULL DEFAULT 'todo',
    priority task_priority NOT NULL DEFAULT 'medium',
    due_date TIMESTAMP,
    assigned_to UUID REFERENCES users(id),
    created_by UUID REFERENCES users(id) NOT NULL,
    project_id UUID REFERENCES projects(id),
    parent_task_id UUID REFERENCES tasks(id),
    estimated_hours INTEGER,
    actual_hours INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- コメントテーブル
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES tasks(id) NOT NULL,
    user_id UUID REFERENCES users(id) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 添付ファイルテーブル
CREATE TABLE attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES tasks(id) NOT NULL,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size INTEGER NOT NULL,
    uploaded_by UUID REFERENCES users(id) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- プロジェクトメンバーテーブル
CREATE TABLE project_members (
    project_id UUID REFERENCES projects(id),
    user_id UUID REFERENCES users(id),
    role project_member_role NOT NULL DEFAULT 'member',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (project_id, user_id)
);

-- カスタム型定義
CREATE TYPE user_role AS ENUM ('member', 'manager', 'admin');
CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'done', 'on_hold');
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE project_status AS ENUM ('active', 'completed', 'archived');
CREATE TYPE project_member_role AS ENUM ('member', 'manager');
```

## 3. リアルタイム通信設計

### Socket.io イベント設計

```typescript
// Server-side Events
interface ServerToClientEvents {
  // タスク関連
  'task:created': (task: Task) => void;
  'task:updated': (task: Task) => void;
  'task:deleted': (taskId: string) => void;
  'task:assigned': (task: Task, assignee: User) => void;
  
  // コメント関連
  'comment:added': (comment: Comment) => void;
  
  // プロジェクト関連
  'project:updated': (project: Project) => void;
  'project:member_added': (project: Project, member: User) => void;
  
  // 通知関連
  'notification:new': (notification: Notification) => void;
  
  // システム関連
  'system:maintenance': (message: string) => void;
}

// Client-side Events
interface ClientToServerEvents {
  // 接続管理
  'join:project': (projectId: string) => void;
  'leave:project': (projectId: string) => void;
  
  // リアルタイム編集
  'task:editing': (taskId: string, userId: string) => void;
  'task:stop_editing': (taskId: string, userId: string) => void;
  
  // 通知確認
  'notification:read': (notificationId: string) => void;
}
```

### リアルタイム通信フロー

```
1. ユーザーログイン
   ↓
2. Socket.io接続確立
   ↓
3. プロジェクトルームに参加
   ↓
4. タスク更新時
   ↓
5. 関連ユーザーに通知配信
   ↓
6. フロントエンドでリアルタイム更新
```

## 4. 状態管理設計（フロントエンド）

### Redux Toolkit 設計

```typescript
// Store Structure
interface RootState {
  auth: AuthState;
  tasks: TasksState;
  projects: ProjectsState;
  users: UsersState;
  notifications: NotificationsState;
  ui: UIState;
}

// Auth Slice
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Tasks Slice
interface TasksState {
  items: Record<string, Task>;
  lists: {
    all: string[];
    byProject: Record<string, string[]>;
    byAssignee: Record<string, string[]>;
    byStatus: Record<TaskStatus, string[]>;
  };
  filters: TaskFilters;
  isLoading: boolean;
  error: string | null;
}

// Async Thunks
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (params: FetchTasksParams, { rejectWithValue }) => {
    try {
      const response = await taskAPI.getTasks(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Slice Definition
const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    // Synchronous actions
    setFilter: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        // Normalize data
        const tasks = action.payload;
        tasks.forEach(task => {
          state.items[task.id] = task;
        });
        state.lists.all = tasks.map(task => task.id);
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});
```

## 5. エラーハンドリング設計

### エラー分類と対応

```typescript
// Error Types
export enum ErrorType {
  VALIDATION = 'VALIDATION_ERROR',
  AUTHENTICATION = 'AUTHENTICATION_ERROR',
  AUTHORIZATION = 'AUTHORIZATION_ERROR',
  NOT_FOUND = 'NOT_FOUND_ERROR',
  CONFLICT = 'CONFLICT_ERROR',
  INTERNAL = 'INTERNAL_SERVER_ERROR',
  NETWORK = 'NETWORK_ERROR',
}

// Error Response Format
interface ErrorResponse {
  type: ErrorType;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
  requestId: string;
}

// Global Error Handler (Express)
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const requestId = req.headers['x-request-id'] as string;
  
  // Log error
  logger.error('API Error', {
    error: error.message,
    stack: error.stack,
    requestId,
    url: req.url,
    method: req.method,
  });
  
  // Determine error type and response
  let errorResponse: ErrorResponse;
  
  if (error instanceof ValidationError) {
    errorResponse = {
      type: ErrorType.VALIDATION,
      message: 'Validation failed',
      details: error.details,
      timestamp: new Date().toISOString(),
      requestId,
    };
    res.status(400).json(errorResponse);
  } else if (error instanceof AuthenticationError) {
    errorResponse = {
      type: ErrorType.AUTHENTICATION,
      message: 'Authentication required',
      timestamp: new Date().toISOString(),
      requestId,
    };
    res.status(401).json(errorResponse);
  } else {
    // Default to internal server error
    errorResponse = {
      type: ErrorType.INTERNAL,
      message: 'Internal server error',
      timestamp: new Date().toISOString(),
      requestId,
    };
    res.status(500).json(errorResponse);
  }
};

// Frontend Error Handling
export const handleApiError = (error: any): string => {
  if (error.response?.data?.type) {
    const errorData = error.response.data as ErrorResponse;
    
    switch (errorData.type) {
      case ErrorType.VALIDATION:
        return 'Input validation failed. Please check your data.';
      case ErrorType.AUTHENTICATION:
        return 'Please log in to continue.';
      case ErrorType.AUTHORIZATION:
        return 'You do not have permission to perform this action.';
      case ErrorType.NOT_FOUND:
        return 'The requested resource was not found.';
      case ErrorType.CONFLICT:
        return 'The operation conflicts with the current state.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }
  
  if (error.code === 'NETWORK_ERROR') {
    return 'Network error. Please check your connection.';
  }
  
  return 'An unexpected error occurred. Please try again.';
};
```

この詳細設計により、堅牢で保守性の高いシステムが構築できます。
各コンポーネントが明確に定義され、一貫した設計原則に従っています。
```

### フェーズ2: 設計パターンの適用

#### ステップ3: 適切な設計パターンの選択

**プロンプト例:**
```
タスク管理システムの実装において、以下の課題に対して
適切な設計パターンを提案してください：

課題:
1. 複雑なビジネスロジックの管理
2. データアクセス層の抽象化
3. 通知システムの柔軟な拡張
4. UIコンポーネントの再利用性
5. 状態変更の追跡と履歴管理

各パターンの適用理由と実装例も含めてください。
```

**Claude Codeのパターン提案例:**
```
# 設計パターン適用提案

## 1. 複雑なビジネスロジック管理 → Service Layer Pattern

### 適用理由
- ビジネスロジックをコントローラーから分離
- 再利用可能なビジネス操作の定義
- テストの容易性向上

### 実装例

```typescript
// Business Logic Service
export class TaskService {
  constructor(
    private taskRepository: TaskRepository,
    private userRepository: UserRepository,
    private notificationService: NotificationService
  ) {}

  async assignTask(taskId: string, assigneeId: string, assignedBy: string): Promise<Task> {
    // ビジネスルールの検証
    const task = await this.taskRepository.findById(taskId);
    if (!task) {
      throw new NotFoundError('Task not found');
    }

    const assignee = await this.userRepository.findById(assigneeId);
    if (!assignee || !assignee.isActive) {
      throw new ValidationError('Invalid assignee');
    }

    // 権限チェック
    if (!this.canAssignTask(assignedBy, task)) {
      throw new AuthorizationError('Cannot assign this task');
    }

    // ビジネスロジック実行
    const updatedTask = await this.taskRepository.update(taskId, {
      assignedTo: assigneeId,
      status: TaskStatus.IN_PROGRESS,
      updatedAt: new Date()
    });

    // 副作用の実行
    await this.notificationService.notifyTaskAssigned(updatedTask, assignee);
    
    return updatedTask;
  }

  private canAssignTask(userId: string, task: Task): boolean {
    // 権限チェックロジック
    return task.createdBy === userId || 
           this.userRepository.hasRole(userId, 'manager');
  }
}
```

## 2. データアクセス層の抽象化 → Repository Pattern

### 適用理由
- データアクセスロジックの抽象化
- テスト時のモック化が容易
- データソースの変更に対する柔軟性

### 実装例

```typescript
// Repository Interface
export interface TaskRepository {
  findById(id: string): Promise<Task | null>;
  findByAssignee(assigneeId: string): Promise<Task[]>;
  findByProject(projectId: string): Promise<Task[]>;
  create(task: CreateTaskData): Promise<Task>;
  update(id: string, data: UpdateTaskData): Promise<Task>;
  delete(id: string): Promise<void>;
  search(criteria: SearchCriteria): Promise<Task[]>;
}

// Concrete Implementation
export class PrismaTaskRepository implements TaskRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<Task | null> {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        assignedTo: true,
        createdBy: true,
        project: true,
        comments: {
          include: { user: true },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    return task ? this.mapToTask(task) : null;
  }

  async search(criteria: SearchCriteria): Promise<Task[]> {
    const where: Prisma.TaskWhereInput = {};

    if (criteria.status) {
      where.status = criteria.status;
    }

    if (criteria.assigneeId) {
      where.assignedTo = criteria.assigneeId;
    }

    if (criteria.projectId) {
      where.projectId = criteria.projectId;
    }

    if (criteria.keyword) {
      where.OR = [
        { title: { contains: criteria.keyword, mode: 'insensitive' } },
        { description: { contains: criteria.keyword, mode: 'insensitive' } }
      ];
    }

    const tasks = await this.prisma.task.findMany({
      where,
      include: {
        assignedTo: true,
        createdBy: true,
        project: true
      },
      orderBy: { createdAt: 'desc' },
      skip: criteria.offset,
      take: criteria.limit
    });

    return tasks.map(this.mapToTask);
  }

  private mapToTask(prismaTask: any): Task {
    // Prisma結果をドメインモデルにマッピング
    return {
      id: prismaTask.id,
      title: prismaTask.title,
      description: prismaTask.description,
      status: prismaTask.status,
      priority: prismaTask.priority,
      dueDate: prismaTask.dueDate,
      assignedTo: prismaTask.assignedTo,
      createdBy: prismaTask.createdBy,
      project: prismaTask.project,
      createdAt: prismaTask.createdAt,
      updatedAt: prismaTask.updatedAt
    };
  }
}

// Test Mock Implementation
export class MockTaskRepository implements TaskRepository {
  private tasks: Map<string, Task> = new Map();

  async findById(id: string): Promise<Task | null> {
    return this.tasks.get(id) || null;
  }

  async create(data: CreateTaskData): Promise<Task> {
    const task: Task = {
      id: generateId(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.tasks.set(task.id, task);
    return task;
  }

  // その他のメソッド実装...
}
```

## 3. 通知システムの柔軟な拡張 → Observer Pattern

### 適用理由
- 通知方法の動的な追加・削除
- 疎結合な通知システム
- 拡張性の確保

### 実装例

```typescript
// Observer Interface
export interface TaskObserver {
  onTaskCreated(task: Task): Promise<void>;
  onTaskUpdated(task: Task, changes: Partial<Task>): Promise<void>;
  onTaskAssigned(task: Task, assignee: User): Promise<void>;
  onTaskCompleted(task: Task): Promise<void>;
}

// Concrete Observers
export class EmailNotificationObserver implements TaskObserver {
  constructor(private emailService: EmailService) {}

  async onTaskAssigned(task: Task, assignee: User): Promise<void> {
    await this.emailService.sendEmail({
      to: assignee.email,
      subject: `新しいタスクが割り当てられました: ${task.title}`,
      template: 'task-assigned',
      data: { task, assignee }
    });
  }

  async onTaskCompleted(task: Task): Promise<void> {
    if (task.createdBy.id !== task.assignedTo?.id) {
      await this.emailService.sendEmail({
        to: task.createdBy.email,
        subject: `タスクが完了しました: ${task.title}`,
        template: 'task-completed',
        data: { task }
      });
    }
  }

  // その他のイベントハンドラー...
}

export class SlackNotificationObserver implements TaskObserver {
  constructor(private slackService: SlackService) {}

  async onTaskCreated(task: Task): Promise<void> {
    if (task.priority === TaskPriority.URGENT) {
      await this.slackService.sendMessage({
        channel: '#urgent-tasks',
        message: `🚨 緊急タスクが作成されました: ${task.title}`,
        attachments: [
          {
            title: task.title,
            text: task.description,
            color: 'danger'
          }
        ]
      });
    }
  }

  // その他のイベントハンドラー...
}

// Subject (Observable)
export class TaskEventPublisher {
  private observers: TaskObserver[] = [];

  addObserver(observer: TaskObserver): void {
    this.observers.push(observer);
  }

  removeObserver(observer: TaskObserver): void {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }

  async notifyTaskCreated(task: Task): Promise<void> {
    await Promise.all(
      this.observers.map(observer => 
        observer.onTaskCreated(task).catch(error => 
          console.error('Observer error:', error)
        )
      )
    );
  }

  async notifyTaskAssigned(task: Task, assignee: User): Promise<void> {
    await Promise.all(
      this.observers.map(observer => 
        observer.onTaskAssigned(task, assignee).catch(error => 
          console.error('Observer error:', error)
        )
      )
    );
  }

  // その他の通知メソッド...
}

// Usage in Service
export class TaskService {
  constructor(
    private taskRepository: TaskRepository,
    private eventPublisher: TaskEventPublisher
  ) {}

  async createTask(data: CreateTaskData): Promise<Task> {
    const task = await this.taskRepository.create(data);
    
    // イベント発行
    await this.eventPublisher.notifyTaskCreated(task);
    
    return task;
  }
}
```

## 4. UIコンポーネントの再利用性 → Compound Component Pattern

### 適用理由
- 柔軟で再利用可能なコンポーネント
- 関心の分離
- カスタマイズ性の向上

### 実装例

```typescript
// Compound Component for Task Card
interface TaskCardProps {
  task: Task;
  onUpdate?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  children: React.ReactNode;
}

interface TaskCardContextValue {
  task: Task;
  onUpdate?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}

const TaskCardContext = React.createContext<TaskCardContextValue | null>(null);

export const TaskCard: React.FC<TaskCardProps> & {
  Header: typeof TaskCardHeader;
  Body: typeof TaskCardBody;
  Actions: typeof TaskCardActions;
  Status: typeof TaskCardStatus;
} = ({ task, onUpdate, onDelete, children }) => {
  const contextValue = { task, onUpdate, onDelete };

  return (
    <TaskCardContext.Provider value={contextValue}>
      <div className="task-card">
        {children}
      </div>
    </TaskCardContext.Provider>
  );
};

const TaskCardHeader: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const context = useContext(TaskCardContext);
  if (!context) throw new Error('TaskCardHeader must be used within TaskCard');

  return (
    <div className="task-card-header">
      <h3>{context.task.title}</h3>
      {children}
    </div>
  );
};

const TaskCardBody: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const context = useContext(TaskCardContext);
  if (!context) throw new Error('TaskCardBody must be used within TaskCard');

  return (
    <div className="task-card-body">
      {context.task.description && (
        <p>{context.task.description}</p>
      )}
      {children}
    </div>
  );
};

const TaskCardActions: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const context = useContext(TaskCardContext);
  if (!context) throw new Error('TaskCardActions must be used within TaskCard');

  return (
    <div className="task-card-actions">
      {children}
      <button onClick={() => context.onDelete?.(context.task.id)}>
        削除
      </button>
    </div>
  );
};

const TaskCardStatus: React.FC = () => {
  const context = useContext(TaskCardContext);
  if (!context) throw new Error('TaskCardStatus must be used within TaskCard');

  return (
    <span className={`status status-${context.task.status}`}>
      {context.task.status}
    </span>
  );
};

// Attach sub-components
TaskCard.Header = TaskCardHeader;
TaskCard.Body = TaskCardBody;
TaskCard.Actions = TaskCardActions;
TaskCard.Status = TaskCardStatus;

// Usage
const TaskList: React.FC<{ tasks: Task[] }> = ({ tasks }) => {
  return (
    <div>
      {tasks.map(task => (
        <TaskCard key={task.id} task={task} onUpdate={handleUpdate} onDelete={handleDelete}>
          <TaskCard.Header>
            <TaskCard.Status />
          </TaskCard.Header>
          <TaskCard.Body />
          <TaskCard.Actions>
            <button>編集</button>
          </TaskCard.Actions>
        </TaskCard>
      ))}
    </div>
  );
};
```

## 5. 状態変更の追跡と履歴管理 → Command Pattern + Memento Pattern

### 適用理由
- 操作の取り消し・やり直し機能
- 変更履歴の記録
- 操作の再実行

### 実装例

```typescript
// Command Interface
export interface Command {
  execute(): Promise<void>;
  undo(): Promise<void>;
  getDescription(): string;
}

// Concrete Commands
export class UpdateTaskCommand implements Command {
  private previousState: Partial<Task>;

  constructor(
    private taskId: string,
    private newData: Partial<Task>,
    private taskRepository: TaskRepository
  ) {}

  async execute(): Promise<void> {
    const currentTask = await this.taskRepository.findById(this.taskId);
    if (!currentTask) {
      throw new Error('Task not found');
    }

    // 現在の状態を保存（Memento）
    this.previousState = {
      title: currentTask.title,
      description: currentTask.description,
      status: currentTask.status,
      priority: currentTask.priority,
      dueDate: currentTask.dueDate,
      assignedTo: currentTask.assignedTo
    };

    // 更新実行
    await this.taskRepository.update(this.taskId, this.newData);
  }

  async undo(): Promise<void> {
    if (!this.previousState) {
      throw new Error('Cannot undo: no previous state');
    }

    await this.taskRepository.update(this.taskId, this.previousState);
  }

  getDescription(): string {
    return `Update task ${this.taskId}`;
  }
}

export class CreateTaskCommand implements Command {
  private createdTaskId?: string;

  constructor(
    private taskData: CreateTaskData,
    private taskRepository: TaskRepository
  ) {}

  async execute(): Promise<void> {
    const task = await this.taskRepository.create(this.taskData);
    this.createdTaskId = task.id;
  }

  async undo(): Promise<void> {
    if (!this.createdTaskId) {
      throw new Error('Cannot undo: task was not created');
    }

    await this.taskRepository.delete(this.createdTaskId);
  }

  getDescription(): string {
    return `Create task: ${this.taskData.title}`;
  }
}

// Command Manager (Invoker)
export class CommandManager {
  private history: Command[] = [];
  private currentIndex = -1;

  async executeCommand(command: Command): Promise<void> {
    try {
      await command.execute();
      
      // 履歴に追加（現在位置以降を削除）
      this.history = this.history.slice(0, this.currentIndex + 1);
      this.history.push(command);
      this.currentIndex++;
      
      // 履歴サイズ制限
      if (this.history.length > 50) {
        this.history.shift();
        this.currentIndex--;
      }
    } catch (error) {
      console.error('Command execution failed:', error);
      throw error;
    }
  }

  async undo(): Promise<void> {
    if (this.currentIndex < 0) {
      throw new Error('Nothing to undo');
    }

    const command = this.history[this.currentIndex];
    await command.undo();
    this.currentIndex--;
  }

  async redo(): Promise<void> {
    if (this.currentIndex >= this.history.length - 1) {
      throw new Error('Nothing to redo');
    }

    this.currentIndex++;
    const command = this.history[this.currentIndex];
    await command.execute();
  }

  canUndo(): boolean {
    return this.currentIndex >= 0;
  }

  canRedo(): boolean {
    return this.currentIndex < this.history.length - 1;
  }

  getHistory(): string[] {
    return this.history.map(command => command.getDescription());
  }
}

// Usage in Service
export class TaskService {
  constructor(
    private taskRepository: TaskRepository,
    private commandManager: CommandManager
  ) {}

  async updateTask(taskId: string, data: Partial<Task>): Promise<void> {
    const command = new UpdateTaskCommand(taskId, data, this.taskRepository);
    await this.commandManager.executeCommand(command);
  }

  async undoLastAction(): Promise<void> {
    await this.commandManager.undo();
  }

  async redoLastAction(): Promise<void> {
    await this.commandManager.redo();
  }
}
```

これらの設計パターンを適用することで、
保守性、拡張性、テスト容易性が大幅に向上します。
各パターンは特定の問題を解決し、
システム全体の品質を高めます。
```

## 設計レビューと検証

### 設計品質の評価

**プロンプト例:**
```
作成した設計について、以下の観点で品質評価を行ってください：

1. SOLID原則の遵守
2. 設計パターンの適切な適用
3. 非機能要件の実現可能性
4. 保守性・拡張性
5. テスト容易性
6. セキュリティ考慮事項

改善すべき点があれば具体的な修正案も提示してください。
```

### 設計文書の作成

**プロンプト例:**
```
これまでの設計内容を基に、開発チーム向けの
設計文書を作成してください。

含めるべき内容:
- アーキテクチャ概要図
- コンポーネント設計
- データベース設計
- API設計
- セキュリティ設計
- 非機能要件への対応

開発者が実装時に参照しやすい形式で作成してください。
```

## 次のステップ

AIと設計を理解したら：

1. **[設計原則管理](03-design-principles.md)** - 設計品質の基盤作り
2. **[AIによる設計レビュー](05-ai-design-review.md)** - 設計品質の検証
3. **[単体テスト](06-unit-testing.md)** - 設計を検証するテスト作成

---

**関連ドキュメント:**
- [AIと要件定義](01-requirements-with-ai.md) - 前のフェーズ
- [プロジェクトコンテキスト](../02-features/project-context.md) - 大規模プロジェクトでの設計
- [コードレビュー](../02-features/code-review.md) - 設計品質の継続的改善