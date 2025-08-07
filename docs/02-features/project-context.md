# プロジェクトコンテキスト理解

Claude Codeの大規模プロジェクト対応機能について説明します。複数ファイル間の依存関係理解とアーキテクチャパターンの認識により、一貫性のある開発を実現できます。

## プロジェクトコンテキスト理解とは

プロジェクトコンテキスト理解は、単一のファイルではなく、プロジェクト全体の構造、依存関係、設計パターンを理解する機能です。これにより、既存のアーキテクチャに適合した一貫性のあるコードを生成・編集できます。

### 主な特徴

- **全体構造の把握**: プロジェクトのフォルダ構造とファイル関係を理解
- **依存関係の追跡**: モジュール間の依存関係を正確に把握
- **パターン認識**: 既存のアーキテクチャパターンやコーディング規約を識別
- **一貫性の維持**: プロジェクト全体で統一されたスタイルを保持

## 理解できるプロジェクト構造

### 1. フロントエンドプロジェクト

#### React プロジェクト
```
src/
├── components/           # 再利用可能なコンポーネント
│   ├── common/          # 共通コンポーネント
│   ├── forms/           # フォーム関連
│   └── layout/          # レイアウト関連
├── pages/               # ページコンポーネント
├── hooks/               # カスタムフック
├── services/            # API通信
├── store/               # 状態管理
├── types/               # 型定義
├── utils/               # ユーティリティ関数
└── constants/           # 定数定義
```

**理解される内容:**
- コンポーネントの階層構造
- Propsの型定義パターン
- 状態管理の方法（Redux、Zustand、Context API）
- ルーティング構造
- スタイリング手法（CSS Modules、Styled Components、Tailwind）

#### Vue.js プロジェクト
```
src/
├── components/          # コンポーネント
├── views/              # ページビュー
├── router/             # ルーティング
├── store/              # Vuex/Pinia
├── composables/        # Composition API
├── plugins/            # プラグイン
└── assets/             # 静的ファイル
```

### 2. バックエンドプロジェクト

#### Node.js Express
```
src/
├── controllers/         # コントローラー
├── services/           # ビジネスロジック
├── models/             # データモデル
├── routes/             # ルーティング
├── middleware/         # ミドルウェア
├── config/             # 設定
├── utils/              # ユーティリティ
└── types/              # 型定義
```

#### Python Django
```
project/
├── apps/               # アプリケーション
│   ├── models.py       # データモデル
│   ├── views.py        # ビュー
│   ├── serializers.py  # シリアライザー
│   └── urls.py         # URL設定
├── settings/           # 設定
├── static/             # 静的ファイル
└── templates/          # テンプレート
```

## 実践的な活用例

### 例1: 既存パターンに従った新機能追加

**プロジェクト構造の理解:**
```
src/
├── components/
│   ├── UserCard.tsx
│   ├── ProductCard.tsx
│   └── OrderCard.tsx
├── hooks/
│   ├── useUser.ts
│   ├── useProduct.ts
│   └── useOrder.ts
├── services/
│   ├── userService.ts
│   ├── productService.ts
│   └── orderService.ts
└── types/
    ├── user.ts
    ├── product.ts
    └── order.ts
```

**プロンプト:**
```
このプロジェクトの既存パターンに従って、
カテゴリ管理機能を追加してください。

既存のUser、Product、Orderと同様の構造で：
- CategoryCardコンポーネント
- useCategoryフック
- categoryService
- category型定義

を作成してください。
```

**生成される一貫したコード:**

```typescript
// types/category.ts
export interface Category {
  id: string;
  name: string;
  description: string;
  parentId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCategoryRequest {
  name: string;
  description: string;
  parentId?: string;
}

export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {
  isActive?: boolean;
}
```

```typescript
// services/categoryService.ts
import { apiClient } from './apiClient';
import { Category, CreateCategoryRequest, UpdateCategoryRequest } from '../types/category';

export const categoryService = {
  async getAll(): Promise<Category[]> {
    const response = await apiClient.get<Category[]>('/categories');
    return response.data;
  },

  async getById(id: string): Promise<Category> {
    const response = await apiClient.get<Category>(`/categories/${id}`);
    return response.data;
  },

  async create(data: CreateCategoryRequest): Promise<Category> {
    const response = await apiClient.post<Category>('/categories', data);
    return response.data;
  },

  async update(id: string, data: UpdateCategoryRequest): Promise<Category> {
    const response = await apiClient.put<Category>(`/categories/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/categories/${id}`);
  }
};
```

```typescript
// hooks/useCategory.ts
import { useState, useEffect } from 'react';
import { Category } from '../types/category';
import { categoryService } from '../services/categoryService';
import { useNotification } from './useNotification';

export const useCategory = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showNotification } = useNotification();

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'カテゴリの取得に失敗しました';
      setError(errorMessage);
      showNotification(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories
  };
};
```

### 例2: アーキテクチャパターンの継承

**既存のClean Architecture構造:**
```
src/
├── domain/
│   ├── entities/
│   ├── repositories/
│   └── usecases/
├── infrastructure/
│   ├── database/
│   ├── external/
│   └── repositories/
├── presentation/
│   ├── controllers/
│   ├── middlewares/
│   └── routes/
└── application/
    ├── dtos/
    └── services/
```

**プロンプト:**
```
このClean Architectureパターンに従って、
通知機能を実装してください。

要件:
- 通知の作成、取得、更新、削除
- メール、SMS、プッシュ通知の送信
- 通知テンプレート管理
- 配信スケジューリング
```

**生成される構造化されたコード:**

```typescript
// domain/entities/Notification.ts
export class Notification {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly type: NotificationType,
    public readonly title: string,
    public readonly content: string,
    public readonly scheduledAt?: Date,
    public readonly sentAt?: Date,
    public readonly status: NotificationStatus = NotificationStatus.PENDING
  ) {}

  public markAsSent(): Notification {
    return new Notification(
      this.id,
      this.userId,
      this.type,
      this.title,
      this.content,
      this.scheduledAt,
      new Date(),
      NotificationStatus.SENT
    );
  }

  public isScheduled(): boolean {
    return this.scheduledAt !== undefined && this.scheduledAt > new Date();
  }
}
```

```typescript
// domain/repositories/NotificationRepository.ts
export interface NotificationRepository {
  save(notification: Notification): Promise<void>;
  findById(id: string): Promise<Notification | null>;
  findByUserId(userId: string): Promise<Notification[]>;
  findPendingNotifications(): Promise<Notification[]>;
  delete(id: string): Promise<void>;
}
```

```typescript
// domain/usecases/SendNotificationUseCase.ts
export class SendNotificationUseCase {
  constructor(
    private notificationRepository: NotificationRepository,
    private notificationService: NotificationService
  ) {}

  async execute(request: SendNotificationRequest): Promise<void> {
    const notification = new Notification(
      generateId(),
      request.userId,
      request.type,
      request.title,
      request.content,
      request.scheduledAt
    );

    await this.notificationRepository.save(notification);

    if (!notification.isScheduled()) {
      await this.notificationService.send(notification);
      const sentNotification = notification.markAsSent();
      await this.notificationRepository.save(sentNotification);
    }
  }
}
```

## 依存関係の理解と管理

### 1. モジュール間依存関係の追跡

**プロンプト:**
```
以下のモジュールを修正する際の影響範囲を分析してください:

修正対象: src/services/authService.ts

このモジュールを使用している箇所:
- src/hooks/useAuth.ts
- src/components/LoginForm.tsx
- src/middleware/authMiddleware.ts
- src/pages/Dashboard.tsx

修正内容: 認証トークンの形式変更
```

**分析結果:**
```
影響範囲分析:

直接的な影響:
1. useAuth.ts - トークン処理ロジックの更新が必要
2. authMiddleware.ts - トークン検証ロジックの更新が必要

間接的な影響:
3. LoginForm.tsx - useAuthを使用、再テストが必要
4. Dashboard.tsx - useAuthを使用、認証状態の確認が必要

推奨対応順序:
1. authService.tsの修正
2. useAuth.tsの更新
3. authMiddleware.tsの更新
4. 関連コンポーネントのテスト
5. 統合テストの実行
```

### 2. 循環依存の検出と解決

**プロンプト:**
```
このプロジェクトで循環依存が発生していないか確認し、
もし発見された場合は解決方法を提案してください。

プロジェクト構造:
[プロジェクト構造を提示]
```

## 設計パターンの認識と適用

### 1. 既存パターンの識別

Claude Codeが認識できる設計パターン：

- **MVC/MVP/MVVM**: アーキテクチャパターン
- **Repository Pattern**: データアクセス抽象化
- **Factory Pattern**: オブジェクト生成
- **Observer Pattern**: イベント通知
- **Strategy Pattern**: アルゴリズム切り替え
- **Decorator Pattern**: 機能拡張
- **Singleton Pattern**: 単一インスタンス

### 2. パターンに従った実装

**プロンプト:**
```
このプロジェクトではRepository Patternを使用しています。
同じパターンに従って、商品管理機能を実装してください。

既存の実装例:
[UserRepositoryの実装を提示]

要件:
- 商品の CRUD操作
- 検索・フィルタリング機能
- キャッシュ機能
- エラーハンドリング
```

## 大規模プロジェクトでのベストプラクティス

### 1. モジュール境界の尊重

```typescript
// 良い例: 適切な境界
// domain層からinfrastructure層への依存なし
export class UserService {
  constructor(private userRepository: UserRepository) {}
  
  async createUser(userData: CreateUserRequest): Promise<User> {
    // ビジネスロジックのみ
    const user = new User(userData);
    return await this.userRepository.save(user);
  }
}
```

### 2. 一貫したエラーハンドリング

```typescript
// プロジェクト全体で統一されたエラーハンドリング
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// 全てのサービスで同じパターンを使用
export const handleApiError = (error: unknown): ApiError => {
  if (error instanceof ApiError) {
    return error;
  }
  
  if (axios.isAxiosError(error)) {
    return new ApiError(
      error.response?.status || 500,
      error.response?.data?.message || 'API Error'
    );
  }
  
  return new ApiError(500, 'Internal Server Error');
};
```

### 3. 型安全性の維持

```typescript
// プロジェクト全体で一貫した型定義
export interface ApiResponse<T> {
  data: T;
  message: string;
  status: 'success' | 'error';
  timestamp: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

## 次のステップ

プロジェクトコンテキスト理解を習得したら：

1. **[デバッグサポート](debugging-support.md)** - 大規模プロジェクトでのデバッグ
2. **[コードレビュー](code-review.md)** - アーキテクチャレベルでの品質管理
3. **[チーム開発](../07-team-development/README.md)** - チーム全体でのコンテキスト共有

---

**関連ドキュメント:**
- [ファイル編集](file-editing.md) - 既存コードの修正
- [外部ツール連携](integration-tools.md) - プロジェクト管理ツールとの連携
- [体系的な開発プロセス](../06-development-process/README.md) - 設計原則の管理