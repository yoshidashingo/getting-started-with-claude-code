# 結合テスト

結合テスト仕様書の作成とClaude Codeを活用したシステム間連携テストについて説明します。APIテストの自動化と統合テスト戦略を学習できます。

## 結合テストとは

結合テスト（Integration Test）は、複数のコンポーネントやシステムが連携して正しく動作することを検証するテストです。単体テストでは発見できない、コンポーネント間のインターフェースやデータフローの問題を検出します。

### 結合テストの種類

- **コンポーネント結合テスト**: アプリケーション内のモジュール間連携
- **システム結合テスト**: 外部システムとの連携
- **API結合テスト**: RESTful APIやGraphQLの動作確認
- **データベース結合テスト**: データアクセス層の検証

## Claude Codeでの結合テスト設計

### API結合テスト仕様書の作成

**プロンプト例:**
```
タスク管理システムのAPI結合テスト仕様書を作成してください。

API仕様:
- POST /api/tasks - タスク作成
- GET /api/tasks - タスク一覧取得
- PUT /api/tasks/:id - タスク更新
- DELETE /api/tasks/:id - タスク削除

テスト観点:
- 正常系フロー
- 異常系処理
- データ整合性
- 認証・認可
- パフォーマンス

各テストケースについて:
- テスト目的
- 前提条件
- テスト手順
- 期待結果
- 検証項目
```

**生成される仕様書:**
```markdown
# タスク管理API 結合テスト仕様書

## テスト概要

### 目的
タスク管理システムのAPI間連携とデータフローの正常性を検証する

### 対象範囲
- タスクCRUD API
- ユーザー認証API
- 通知システム連携
- データベース連携

### テスト環境
- テスト用データベース
- モックメールサービス
- テスト用認証サーバー

## テストケース

### TC001: タスク作成フロー（正常系）

**目的**: タスク作成から通知送信までの一連のフローを検証

**前提条件**:
- 認証済みユーザーでログイン
- データベースが初期状態
- メールサービスが利用可能

**テスト手順**:
1. POST /api/auth/login でログイン
2. POST /api/tasks でタスク作成
3. GET /api/tasks でタスク一覧取得
4. メール送信ログを確認

**期待結果**:
- タスクが正常に作成される
- データベースにタスクが保存される
- 担当者にメール通知が送信される
- レスポンス時間が2秒以内
- ステータスコード201が返される

**検証項目**:
- データベースにタスクレコードが正しく挿入されている
- 作成日時が正確に記録されている
- メール送信キューにジョブが追加されている
- レスポンスボディに正しいタスクIDが含まれている

### TC002: タスク更新フロー（正常系）

**目的**: タスク更新時のデータ整合性とイベント連携を検証

**前提条件**:
- 既存タスクがデータベースに存在
- 認証済みユーザーでログイン
- タスクの編集権限を保有

**テスト手順**:
1. GET /api/tasks/:id で既存タスクを取得
2. PUT /api/tasks/:id でタスクを更新
3. GET /api/tasks/:id で更新後のタスクを取得
4. 履歴テーブルの更新を確認

**期待結果**:
- タスクが正常に更新される
- 更新履歴が記録される
- 関連ユーザーに変更通知が送信される
- 楽観的ロックが正常に動作する

### TC003: タスク削除フロー（正常系）

**目的**: タスク削除時の関連データ処理を検証

**前提条件**:
- 削除対象タスクが存在
- 管理者権限でログイン
- 関連するコメントやファイルが存在

**テスト手順**:
1. DELETE /api/tasks/:id でタスク削除
2. GET /api/tasks/:id で削除確認（404エラー）
3. 関連データの削除状況を確認
4. 削除ログの記録を確認

**期待結果**:
- タスクが論理削除される
- 関連コメントも削除される
- 添付ファイルが適切に処理される
- 削除ログが記録される

### TC004: 認証エラー処理（異常系）

**目的**: 認証・認可エラー時の適切な処理を検証

**前提条件**:
- 無効なトークンまたは期限切れトークン
- 権限のないユーザー

**テスト手順**:
1. 無効なトークンでAPI呼び出し
2. 権限のないリソースにアクセス
3. トークン期限切れ後のアクセス

**期待結果**:
- 適切なHTTPステータスコード（401, 403）
- エラーメッセージが適切に返される
- セキュリティログが記録される
- 機密情報が漏洩しない

### TC005: データ整合性エラー（異常系）

**目的**: データ不整合時のエラーハンドリングを検証

**前提条件**:
- 不正なデータ形式
- 必須フィールドの欠如
- 制約違反データ

**テスト手順**:
1. 不正なJSONでPOSTリクエスト
2. 必須フィールドなしでリクエスト
3. 文字数制限を超えるデータで送信
4. 存在しない外部キーを指定

**期待結果**:
- バリデーションエラーが返される
- データベースの整合性が保たれる
- 適切なエラーメッセージが表示される
- ロールバックが正常に実行される
```

## Claude Codeでの結合テスト実装

### Supertest を使用したAPI結合テスト

**プロンプト例:**
```
以下のExpress.jsアプリケーションの結合テストを
Supertestを使用して作成してください：

```typescript
// app.ts
import express from 'express';
import { taskRouter } from './routes/tasks';
import { authMiddleware } from './middleware/auth';

const app = express();

app.use(express.json());
app.use('/api/tasks', authMiddleware, taskRouter);

export { app };
```

```typescript
// routes/tasks.ts
import { Router } from 'express';
import { TaskService } from '../services/TaskService';

const router = Router();
const taskService = new TaskService();

router.post('/', async (req, res) => {
  try {
    const task = await taskService.createTask(req.body, req.user.id);
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  const tasks = await taskService.getUserTasks(req.user.id);
  res.json(tasks);
});

export { router as taskRouter };
```

テスト要件:
- 認証フロー
- CRUD操作
- エラーハンドリング
- データベース連携
```

**生成されるテストコード:**
```typescript
// integration/tasks.test.ts
import request from 'supertest';
import { app } from '../src/app';
import { setupTestDatabase, cleanupTestDatabase } from './helpers/database';
import { createTestUser, generateAuthToken } from './helpers/auth';

describe('Tasks API Integration Tests', () => {
  let authToken: string;
  let testUserId: string;

  beforeAll(async () => {
    await setupTestDatabase();
    const testUser = await createTestUser({
      email: 'test@example.com',
      name: 'Test User'
    });
    testUserId = testUser.id;
    authToken = generateAuthToken(testUser);
  });

  afterAll(async () => {
    await cleanupTestDatabase();
  });

  afterEach(async () => {
    // 各テスト後にタスクデータをクリーンアップ
    await cleanupTasks();
  });

  describe('POST /api/tasks', () => {
    test('認証済みユーザーがタスクを作成できる', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        dueDate: '2024-12-31T23:59:59Z'
      };

      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send(taskData)
        .expect(201);

      expect(response.body).toMatchObject({
        id: expect.any(String),
        title: 'Test Task',
        description: 'Test Description',
        userId: testUserId,
        status: 'pending'
      });

      // データベースに実際に保存されているか確認
      const savedTask = await getTaskFromDatabase(response.body.id);
      expect(savedTask).toBeTruthy();
      expect(savedTask.title).toBe('Test Task');
    });

    test('認証なしではタスク作成できない', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description'
      };

      await request(app)
        .post('/api/tasks')
        .send(taskData)
        .expect(401);
    });

    test('不正なデータではバリデーションエラーが返される', async () => {
      const invalidTaskData = {
        title: '', // 空のタイトル
        description: 'A'.repeat(1001) // 文字数制限超過
      };

      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidTaskData)
        .expect(400);

      expect(response.body.error).toContain('validation');
    });
  });

  describe('GET /api/tasks', () => {
    test('ユーザーのタスク一覧を取得できる', async () => {
      // テストデータを事前に作成
      await createTestTasks([
        { title: 'Task 1', userId: testUserId },
        { title: 'Task 2', userId: testUserId }
      ]);

      const response = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toMatchObject({
        title: 'Task 1',
        userId: testUserId
      });
    });

    test('他のユーザーのタスクは取得できない', async () => {
      const otherUser = await createTestUser({
        email: 'other@example.com',
        name: 'Other User'
      });

      await createTestTasks([
        { title: 'My Task', userId: testUserId },
        { title: 'Other Task', userId: otherUser.id }
      ]);

      const response = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].title).toBe('My Task');
    });
  });

  describe('PUT /api/tasks/:id', () => {
    test('タスクを更新できる', async () => {
      const task = await createTestTask({
        title: 'Original Title',
        userId: testUserId
      });

      const updateData = {
        title: 'Updated Title',
        status: 'completed'
      };

      const response = await request(app)
        .put(`/api/tasks/${task.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.title).toBe('Updated Title');
      expect(response.body.status).toBe('completed');

      // データベースでも更新されているか確認
      const updatedTask = await getTaskFromDatabase(task.id);
      expect(updatedTask.title).toBe('Updated Title');
    });

    test('存在しないタスクの更新は404エラー', async () => {
      await request(app)
        .put('/api/tasks/nonexistent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Updated' })
        .expect(404);
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    test('タスクを削除できる', async () => {
      const task = await createTestTask({
        title: 'Task to Delete',
        userId: testUserId
      });

      await request(app)
        .delete(`/api/tasks/${task.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(204);

      // データベースから削除されているか確認
      const deletedTask = await getTaskFromDatabase(task.id);
      expect(deletedTask).toBeNull();
    });

    test('他のユーザーのタスクは削除できない', async () => {
      const otherUser = await createTestUser({
        email: 'other2@example.com',
        name: 'Other User 2'
      });

      const task = await createTestTask({
        title: 'Other User Task',
        userId: otherUser.id
      });

      await request(app)
        .delete(`/api/tasks/${task.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(403);
    });
  });
});
```

## 次のステップ

結合テストを理解したら：

1. **[E2Eテスト](08-e2e-testing.md)** - エンドツーエンドテスト
2. **[テスト基礎](../05-testing-basics.md)** - Playwright MCPでの自動テスト
3. **[ビルド自動化](07-build-automation.md)** - CI/CDパイプライン

---

**関連ドキュメント:**
- [単体テスト](06-unit-testing.md) - 単体テストとの組み合わせ
- [デバッグサポート](../02-features/debugging-support.md) - 結合テストのデバッグ
- [統合ツール](../02-features/integration-tools.md) - 外部システム連携