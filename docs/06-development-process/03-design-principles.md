# 設計原則とCLAUDE.md管理

プロジェクト固有の設計原則をCLAUDE.mdで管理する方法について説明します。要件定義原則と設計原則の体系的な記載方法を学習できます。

## CLAUDE.mdとは

CLAUDE.mdは、Claude Codeがプロジェクトのコンテキストと設計原則を理解するための設定ファイルです。このファイルにプロジェクト固有の要件定義原則、設計原則、コーディング規約を記載することで、一貫した品質でのコード生成・編集が可能になります。

### CLAUDE.mdの役割

- **コンテキスト提供**: プロジェクトの背景と目的の共有
- **原則の統一**: チーム全体での設計方針の統一
- **品質保証**: 一貫した品質基準の適用
- **効率化**: 繰り返し説明の削減

## CLAUDE.mdの基本構造

### 推奨ファイル構造

```markdown
# プロジェクト名

## プロジェクト概要
[プロジェクトの目的と背景]

## 要件定義原則
[要件定義時の基本方針]

## 設計原則
[アーキテクチャと設計の基本方針]

## コーディング規約
[実装時の規約とスタイル]

## 技術スタック
[使用技術と選択理由]

## 品質基準
[品質管理の基準]

## 参考資料
[関連ドキュメントへのリンク]
```

## 実践的なCLAUDE.md作成

### タスク管理システムの例

**プロンプト:**
```
タスク管理システムプロジェクト用のCLAUDE.mdを作成してください。

プロジェクト情報:
- 目的: 社内タスク管理の効率化
- 規模: 50名のユーザー
- 技術: React + Node.js + PostgreSQL
- 期間: 6ヶ月

以下の原則を含めてください:
1. 要件定義時の原則
2. アーキテクチャ設計原則
3. UI/UX設計原則
4. データベース設計原則
5. セキュリティ原則
6. パフォーマンス原則
```

**生成されるCLAUDE.md:**

```markdown
# 社内タスク管理システム

## プロジェクト概要

### 目的
社内の50名を対象とした、効率的なタスク管理システムの構築により、
プロジェクト管理の透明性向上と生産性の向上を実現する。

### 背景
- 現在のExcelベースの管理では、リアルタイム共有が困難
- 進捗の可視化ができていない
- 部門間でのタスク共有が非効率

### 成功指標
- タスク管理効率の30%向上
- プロジェクト遅延の50%削減
- ユーザー満足度80%以上

## 要件定義原則

### 1. ユーザー中心設計
- **原則**: すべての要件はエンドユーザーの価値創出を基準とする
- **適用**: 機能追加時は「ユーザーにとっての価値は何か？」を必ず確認
- **例外**: セキュリティ・コンプライアンス要件は価値よりも優先

### 2. 段階的価値提供
- **原則**: MVP（最小価値製品）から段階的に機能を拡張
- **適用**: 各フェーズで独立した価値を提供できる機能セットを定義
- **優先順位**: 基本機能 → 協働機能 → 分析機能

### 3. 測定可能性
- **原則**: すべての要件は測定可能な成功指標を持つ
- **適用**: 「使いやすい」ではなく「3クリック以内で操作完了」
- **測定方法**: ユーザビリティテスト、パフォーマンス測定、満足度調査

### 4. 制約の明確化
- **原則**: 技術的・組織的制約を要件定義時に明確化
- **制約事項**:
  - 既存AD（Active Directory）との連携必須
  - 社内セキュリティポリシー遵守
  - 予算上限500万円
  - 開発期間6ヶ月

## 設計原則

### 1. アーキテクチャ設計原則

#### 1.1 レイヤード アーキテクチャ
- **原則**: 関心の分離により保守性を確保
- **構成**: Presentation → Application → Business → Data Access → Database
- **禁止事項**: 上位層から下位層への直接アクセス（1層飛ばし禁止）

#### 1.2 依存性の逆転
- **原則**: 高レベルモジュールは低レベルモジュールに依存しない
- **実装**: インターフェースを通じた依存性注入
- **例**: `TaskService` → `ITaskRepository` ← `PrismaTaskRepository`

#### 1.3 単一責任の原則
- **原則**: 各クラス・モジュールは単一の責任のみを持つ
- **適用**: 1つのクラスが変更される理由は1つのみ
- **例**: `TaskService`（ビジネスロジック）と`TaskController`（HTTP処理）の分離

#### 1.4 開放閉鎖の原則
- **原則**: 拡張に対して開放、修正に対して閉鎖
- **実装**: 戦略パターン、観察者パターンの活用
- **例**: 通知方法の追加時、既存コードを変更せずに新しい通知クラスを追加

### 2. データベース設計原則

#### 2.1 正規化
- **原則**: 第3正規形まで正規化し、パフォーマンス要件に応じて非正規化
- **適用**: データ整合性を最優先、読み取り性能が問題になった場合のみ非正規化検討

#### 2.2 命名規約
- **テーブル名**: 複数形、スネークケース（例：`tasks`, `user_projects`）
- **カラム名**: 単数形、スネークケース（例：`created_at`, `user_id`）
- **外部キー**: `{参照テーブル名}_id`（例：`user_id`, `project_id`）

#### 2.3 インデックス戦略
- **原則**: WHERE句、JOIN条件、ORDER BY句で使用されるカラムにインデックス
- **複合インデックス**: 選択性の高いカラムを先頭に配置
- **監視**: 実行計画の定期的な確認と最適化

#### 2.4 データ型選択
- **ID**: UUID（分散環境での一意性確保）
- **日時**: TIMESTAMP WITH TIME ZONE（タイムゾーン考慮）
- **文字列**: 適切な長さ制限（VARCHAR(255)等）
- **列挙型**: ENUMまたはCHECK制約

### 3. API設計原則

#### 3.1 RESTful設計
- **原則**: リソースベースのURL、HTTPメソッドの適切な使用
- **URL構造**: `/api/{version}/{resource}/{id}/{sub-resource}`
- **例**: `GET /api/v1/tasks/123/comments`

#### 3.2 一貫したレスポンス形式
```json
{
  "data": {},           // 成功時のデータ
  "error": {},          // エラー時の詳細
  "meta": {             // メタデータ
    "pagination": {},
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

#### 3.3 バージョニング
- **方式**: URLパスでのバージョニング（`/api/v1/`）
- **後方互換性**: 最低2バージョンの同時サポート
- **廃止予告**: 6ヶ月前の事前通知

#### 3.4 エラーハンドリング
- **HTTPステータス**: 適切なステータスコードの使用
- **エラー形式**: 一貫したエラーレスポンス構造
- **ログ**: すべてのエラーをリクエストIDと共に記録

### 4. フロントエンド設計原則

#### 4.1 コンポーネント設計
- **原則**: 単一責任、再利用可能、テスト可能
- **構造**: Atomic Design（Atoms → Molecules → Organisms → Templates → Pages）
- **命名**: PascalCase、機能を表す名前（例：`TaskCard`, `UserProfile`）

#### 4.2 状態管理
- **原則**: 単一の信頼できる情報源（Single Source of Truth）
- **ツール**: Redux Toolkit（複雑な状態）、React State（ローカル状態）
- **正規化**: エンティティの正規化によるデータ整合性確保

#### 4.3 パフォーマンス
- **原則**: 初期表示3秒以内、操作レスポンス1秒以内
- **最適化**: コード分割、遅延読み込み、メモ化
- **測定**: Core Web Vitals指標の監視

## セキュリティ原則

### 1. 認証・認可
- **認証**: 既存AD（Active Directory）との連携
- **セッション**: JWT（8時間有効）+ リフレッシュトークン（30日有効）
- **認可**: RBAC（Role-Based Access Control）

### 2. データ保護
- **通信**: TLS 1.3以上での暗号化
- **保存**: 機密データのデータベース暗号化
- **ログ**: 個人情報のマスキング

### 3. 入力検証
- **原則**: すべての入力を疑い、サーバーサイドで検証
- **実装**: Joi等のバリデーションライブラリ使用
- **SQLインジェクション**: ORM使用によるパラメータ化クエリ

### 4. セキュリティヘッダー
```
Content-Security-Policy: default-src 'self'
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Strict-Transport-Security: max-age=31536000
```

## パフォーマンス原則

### 1. レスポンス時間目標
- **ページ読み込み**: 3秒以内（95%ile）
- **API応答**: 1秒以内（95%ile）
- **データベースクエリ**: 100ms以内（95%ile）

### 2. 最適化戦略
- **フロントエンド**: バンドル最適化、画像最適化、CDN使用
- **バックエンド**: クエリ最適化、キャッシュ活用、接続プール
- **データベース**: インデックス最適化、クエリチューニング

### 3. 監視・測定
- **APM**: New Relic等による継続的監視
- **ログ**: 構造化ログによる分析
- **アラート**: SLA違反時の自動通知

## コーディング規約

### 1. TypeScript規約
- **型定義**: 明示的な型定義、`any`の使用禁止
- **命名**: camelCase（変数・関数）、PascalCase（クラス・インターフェース）
- **インポート**: 絶対パス使用、グループ化

### 2. React規約
- **関数コンポーネント**: アロー関数での定義
- **Hooks**: カスタムフックでのロジック抽象化
- **Props**: インターフェースでの型定義

### 3. Node.js規約
- **非同期処理**: async/await使用、Promiseチェーン禁止
- **エラーハンドリング**: 適切なエラークラスの使用
- **ログ**: 構造化ログ（JSON形式）

### 4. データベース規約
- **マイグレーション**: すべてのスキーマ変更をマイグレーションで管理
- **クエリ**: ORM使用、生SQLは最小限
- **トランザクション**: データ整合性が必要な操作で使用

## 品質基準

### 1. テスト基準
- **カバレッジ**: 単体テスト80%以上、統合テスト60%以上
- **テスト種別**: 単体 → 統合 → E2E の順で実装
- **TDD**: 重要なビジネスロジックはテスト駆動開発

### 2. コードレビュー基準
- **必須レビュー**: すべてのプルリクエスト
- **レビュー観点**: 機能性、保守性、セキュリティ、パフォーマンス
- **承認**: 最低1名の承認、重要な変更は2名

### 3. 静的解析
- **リンター**: ESLint（TypeScript）、Prettier（フォーマット）
- **セキュリティ**: npm audit、Snyk
- **品質**: SonarQube

## 技術スタック

### フロントエンド
- **フレームワーク**: React 18 + TypeScript
- **UI**: Material-UI v5
- **状態管理**: Redux Toolkit
- **ルーティング**: React Router v6
- **通信**: Axios + React Query

### バックエンド
- **ランタイム**: Node.js 18
- **フレームワーク**: Express.js
- **ORM**: Prisma
- **認証**: Passport.js
- **リアルタイム**: Socket.io

### データベース
- **メイン**: PostgreSQL 15
- **キャッシュ**: Redis 7
- **検索**: Elasticsearch（将来的に検討）

### インフラ
- **コンテナ**: Docker + Docker Compose
- **プロキシ**: Nginx
- **監視**: New Relic + Prometheus
- **ログ**: Winston + ELK Stack

## 開発プロセス

### 1. ブランチ戦略
- **メインブランチ**: `main`（本番環境）
- **開発ブランチ**: `develop`（統合環境）
- **機能ブランチ**: `feature/TASK-123-description`
- **修正ブランチ**: `hotfix/TASK-456-description`

### 2. コミット規約
```
type(scope): subject

body

footer
```

**例:**
```
feat(task): add task assignment functionality

- Add task assignment API endpoint
- Update task model to include assignee
- Add assignment notification

Closes #123
```

### 3. リリースプロセス
1. 機能開発（feature branch）
2. 統合テスト（develop branch）
3. 受け入れテスト（staging環境）
4. 本番リリース（main branch）

## 参考資料

### 設計原則
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)

### コーディング規約
- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)
- [React Best Practices](https://react.dev/learn)

### セキュリティ
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)

---

**最終更新**: 2024-01-15  
**承認者**: プロジェクトマネージャー、テックリード  
**次回レビュー**: 2024-02-15
```

## CLAUDE.mdの活用方法

### 1. Claude Codeでの参照

**プロンプト例:**
```
CLAUDE.mdの設計原則に従って、
タスク作成APIのエンドポイントを実装してください。

要件:
- RESTful設計原則の遵守
- 適切なバリデーション
- エラーハンドリング
- セキュリティ考慮
```

**Claude Codeの応答例:**
```
CLAUDE.mdの設計原則に基づいて、タスク作成APIを実装します。

## 実装内容

### 1. エンドポイント設計（RESTful原則）
```typescript
// routes/tasks.ts
import { Router } from 'express';
import { TaskController } from '../controllers/TaskController';
import { authMiddleware } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { createTaskSchema } from '../schemas/taskSchemas';

const router = Router();

// POST /api/v1/tasks - タスク作成
router.post(
  '/tasks',
  authMiddleware,                    // 認証チェック
  validateRequest(createTaskSchema), // バリデーション
  TaskController.createTask
);

export default router;
```

### 2. バリデーションスキーマ（入力検証原則）
```typescript
// schemas/taskSchemas.ts
import Joi from 'joi';

export const createTaskSchema = Joi.object({
  title: Joi.string()
    .min(1)
    .max(255)
    .required()
    .messages({
      'string.empty': 'タスクタイトルは必須です',
      'string.max': 'タスクタイトルは255文字以内で入力してください'
    }),
  
  description: Joi.string()
    .max(2000)
    .optional()
    .allow(''),
  
  priority: Joi.string()
    .valid('low', 'medium', 'high', 'urgent')
    .default('medium'),
  
  dueDate: Joi.date()
    .iso()
    .min('now')
    .optional()
    .messages({
      'date.min': '期限は現在時刻以降を設定してください'
    }),
  
  assignedTo: Joi.string()
    .uuid()
    .optional(),
  
  projectId: Joi.string()
    .uuid()
    .optional()
});
```

### 3. コントローラー実装（レイヤード原則）
```typescript
// controllers/TaskController.ts
import { Request, Response, NextFunction } from 'express';
import { TaskService } from '../services/TaskService';
import { CreateTaskRequest } from '../types/requests';
import { ApiResponse } from '../types/responses';

export class TaskController {
  static async createTask(
    req: Request<{}, ApiResponse<Task>, CreateTaskRequest>,
    res: Response<ApiResponse<Task>>,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.id; // 認証ミドルウェアで設定
      const taskData = req.body;
      
      // ビジネスロジックはサービス層に委譲
      const task = await TaskService.createTask({
        ...taskData,
        createdBy: userId
      });
      
      // 一貫したレスポンス形式
      res.status(201).json({
        data: task,
        meta: {
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      next(error); // エラーハンドリングミドルウェアに委譲
    }
  }
}
```

### 4. サービス層実装（単一責任原則）
```typescript
// services/TaskService.ts
import { TaskRepository } from '../repositories/TaskRepository';
import { UserRepository } from '../repositories/UserRepository';
import { ProjectRepository } from '../repositories/ProjectRepository';
import { NotificationService } from './NotificationService';
import { CreateTaskData, Task } from '../types/models';
import { ValidationError, NotFoundError } from '../errors';

export class TaskService {
  constructor(
    private taskRepository: TaskRepository,
    private userRepository: UserRepository,
    private projectRepository: ProjectRepository,
    private notificationService: NotificationService
  ) {}

  async createTask(data: CreateTaskData): Promise<Task> {
    // ビジネスルール検証
    await this.validateTaskCreation(data);
    
    // タスク作成
    const task = await this.taskRepository.create({
      ...data,
      status: 'todo',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    // 副作用の実行（通知等）
    await this.handleTaskCreated(task);
    
    return task;
  }
  
  private async validateTaskCreation(data: CreateTaskData): Promise<void> {
    // 担当者の存在確認
    if (data.assignedTo) {
      const assignee = await this.userRepository.findById(data.assignedTo);
      if (!assignee || !assignee.isActive) {
        throw new ValidationError('指定された担当者が見つかりません');
      }
    }
    
    // プロジェクトの存在確認
    if (data.projectId) {
      const project = await this.projectRepository.findById(data.projectId);
      if (!project) {
        throw new NotFoundError('指定されたプロジェクトが見つかりません');
      }
      
      // プロジェクトメンバーかチェック
      const isMember = await this.projectRepository.isMember(
        data.projectId, 
        data.createdBy
      );
      if (!isMember) {
        throw new ValidationError('プロジェクトメンバーのみタスクを作成できます');
      }
    }
  }
  
  private async handleTaskCreated(task: Task): Promise<void> {
    // 担当者への通知
    if (task.assignedTo && task.assignedTo !== task.createdBy) {
      await this.notificationService.notifyTaskAssigned(task);
    }
    
    // プロジェクトメンバーへの通知
    if (task.projectId) {
      await this.notificationService.notifyProjectTaskCreated(task);
    }
  }
}
```

### 5. エラーハンドリング（セキュリティ原則）
```typescript
// middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { ValidationError, NotFoundError, AuthorizationError } from '../errors';
import { logger } from '../utils/logger';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const requestId = req.headers['x-request-id'] as string;
  
  // セキュリティ: 詳細なエラー情報のログ記録（個人情報マスキング）
  logger.error('API Error', {
    error: error.message,
    stack: error.stack,
    requestId,
    url: req.url,
    method: req.method,
    userId: req.user?.id, // 個人情報ではないID
    // req.bodyは記録しない（機密情報の可能性）
  });
  
  // クライアントには安全な情報のみ返却
  if (error instanceof ValidationError) {
    res.status(400).json({
      error: {
        type: 'VALIDATION_ERROR',
        message: error.message,
        details: error.details
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId
      }
    });
  } else if (error instanceof NotFoundError) {
    res.status(404).json({
      error: {
        type: 'NOT_FOUND_ERROR',
        message: 'リソースが見つかりません'
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId
      }
    });
  } else {
    // 予期しないエラーは詳細を隠す
    res.status(500).json({
      error: {
        type: 'INTERNAL_SERVER_ERROR',
        message: 'サーバー内部エラーが発生しました'
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId
      }
    });
  }
};
```

この実装は、CLAUDE.mdで定義された以下の原則に従っています：
- RESTful API設計原則
- レイヤードアーキテクチャ
- 単一責任の原則
- 適切な入力検証
- セキュリティ考慮事項
- 一貫したエラーハンドリング
```

### 2. チーム開発での活用

**CLAUDE.mdの共有と更新プロセス:**

1. **初期作成**: プロジェクト開始時にテックリードが作成
2. **レビュー**: チーム全体でのレビューと合意形成
3. **バージョン管理**: Gitでの変更履歴管理
4. **定期更新**: スプリント終了時の振り返りで更新
5. **新メンバー**: オンボーディング時の必読資料

### 3. 継続的改善

**プロンプト例:**
```
プロジェクト進行中に発見された以下の課題を踏まえて、
CLAUDE.mdの設計原則を更新してください：

発見された課題:
1. APIレスポンス時間が目標を超過
2. データベースクエリの非効率性
3. フロントエンドでの状態管理の複雑化
4. セキュリティレビューでの指摘事項

改善提案と更新された原則を提示してください。
```

## CLAUDE.mdのテンプレート

### 小規模プロジェクト用テンプレート

```markdown
# [プロジェクト名]

## プロジェクト概要
- **目的**: [プロジェクトの目的]
- **期間**: [開発期間]
- **チーム**: [チーム構成]

## 基本原則
### 設計原則
- [基本的な設計方針]

### コーディング規約
- [最小限の規約]

## 技術スタック
- **フロントエンド**: [技術選択]
- **バックエンド**: [技術選択]
- **データベース**: [技術選択]

## 品質基準
- **テスト**: [テスト方針]
- **レビュー**: [レビュー方針]
```

### 大規模プロジェクト用テンプレート

```markdown
# [プロジェクト名]

## プロジェクト概要
[詳細な背景と目的]

## ステークホルダー
[関係者と役割]

## 要件定義原則
[詳細な要件定義方針]

## アーキテクチャ原則
[システム全体の設計方針]

## ドメイン設計原則
[ビジネスロジックの設計方針]

## データ設計原則
[データベース・API設計方針]

## UI/UX設計原則
[ユーザーインターフェース設計方針]

## セキュリティ原則
[セキュリティ要件と対策]

## パフォーマンス原則
[性能要件と最適化方針]

## 運用・保守原則
[運用時の考慮事項]

## 品質管理
[品質保証の仕組み]

## 開発プロセス
[開発フローと規約]
```

## 次のステップ

設計原則管理を理解したら：

1. **[個人設計原則管理](04-personal-guidelines.md)** - 個人レベルでの原則管理
2. **[AIによる設計レビュー](05-ai-design-review.md)** - 原則に基づく自動レビュー
3. **[チーム開発](../07-team-development/README.md)** - チーム全体での原則共有

---

**関連ドキュメント:**
- [AIと設計](02-design-with-ai.md) - 設計プロセスの詳細
- [プロジェクトコンテキスト](../02-features/project-context.md) - 大規模プロジェクトでの活用
- [チーム開発セットアップ](../07-team-development/01-team-setup.md) - チーム環境での設定