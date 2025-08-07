# テスト基礎 - Playwright MCPでの自動テスト

Claude Codeを使ったPlaywright MCPでの自動テスト基礎について説明します。テスト実行、デバッグ、結果解釈の実践的な手順を学習できます。

## Playwright MCPとは

Playwright MCPは、Claude CodeでPlaywrightを使用したE2Eテストを効率的に作成・実行するためのModel Context Protocol（MCP）サーバーです。ブラウザ自動化を通じて、実際のユーザー操作をシミュレートしたテストが可能です。

### 主な特徴

- **クロスブラウザテスト**: Chrome、Firefox、Safari、Edgeでのテスト実行
- **自動スクリーンショット**: テスト失敗時の画面キャプチャ
- **ビデオ録画**: テスト実行過程の記録
- **並列実行**: 複数テストの同時実行
- **Claude Code統合**: 自然言語でのテスト作成

## セットアップ

### 1. Playwright MCPのインストール

```bash
# Playwrightのインストール
npm install -D @playwright/test

# ブラウザのインストール
npx playwright install

# 設定ファイルの生成
npx playwright init
```

### 2. MCP設定

```json
// .kiro/settings/mcp.json
{
  "mcpServers": {
    "playwright": {
      "command": "uvx",
      "args": ["playwright-mcp-server@latest"],
      "env": {
        "FASTMCP_LOG_LEVEL": "ERROR"
      },
      "disabled": false,
      "autoApprove": ["browser_navigate", "browser_click", "browser_type", "browser_snapshot"]
    }
  }
}
```

### 3. Playwright設定

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }]
  ],
  
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  
  webServer: {
    command: 'npm start',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
});
```

## 基本的なテスト作成

### Claude Codeでのテスト生成

**プロンプト:**
```
Playwright MCPを使用して、Todoアプリの基本機能をテストするE2Eテストを作成してください。

テスト対象:
1. タスクの追加
2. タスクの完了状態切り替え
3. タスクの削除
4. フィルタリング機能

アプリのURL: http://localhost:3000
```

**生成されるテストコード:**
```typescript
// tests/e2e/todo-app.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Todoアプリ', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('タスクの追加', async ({ page }) => {
    // タスク入力フィールドを確認
    const input = page.locator('[data-testid="todo-input"]');
    await expect(input).toBeVisible();
    
    // 新しいタスクを追加
    await input.fill('新しいタスク');
    await input.press('Enter');
    
    // タスクが追加されたことを確認
    await expect(page.locator('[data-testid="todo-item"]')).toContainText('新しいタスク');
    
    // 入力フィールドがクリアされたことを確認
    await expect(input).toHaveValue('');
  });

  test('タスクの完了状態切り替え', async ({ page }) => {
    // テストデータの準備
    await page.locator('[data-testid="todo-input"]').fill('テストタスク');
    await page.locator('[data-testid="todo-input"]').press('Enter');
    
    // チェックボックスをクリック
    const checkbox = page.locator('[data-testid="todo-checkbox"]').first();
    await checkbox.click();
    
    // 完了状態になったことを確認
    await expect(checkbox).toBeChecked();
    await expect(page.locator('[data-testid="todo-item"]').first()).toHaveClass(/completed/);
    
    // 再度クリックして未完了に戻す
    await checkbox.click();
    await expect(checkbox).not.toBeChecked();
    await expect(page.locator('[data-testid="todo-item"]').first()).not.toHaveClass(/completed/);
  });

  test('タスクの削除', async ({ page }) => {
    // テストデータの準備
    await page.locator('[data-testid="todo-input"]').fill('削除テスト');
    await page.locator('[data-testid="todo-input"]').press('Enter');
    
    // 削除ボタンをクリック
    await page.locator('[data-testid="delete-button"]').first().click();
    
    // 確認ダイアログで削除を承認
    page.on('dialog', dialog => dialog.accept());
    
    // タスクが削除されたことを確認
    await expect(page.locator('[data-testid="todo-item"]')).toHaveCount(0);
  });

  test('フィルタリング機能', async ({ page }) => {
    // 複数のタスクを追加
    await page.locator('[data-testid="todo-input"]').fill('未完了タスク1');
    await page.locator('[data-testid="todo-input"]').press('Enter');
    
    await page.locator('[data-testid="todo-input"]').fill('未完了タスク2');
    await page.locator('[data-testid="todo-input"]').press('Enter');
    
    await page.locator('[data-testid="todo-input"]').fill('完了予定タスク');
    await page.locator('[data-testid="todo-input"]').press('Enter');
    
    // 1つのタスクを完了状態にする
    await page.locator('[data-testid="todo-checkbox"]').last().click();
    
    // 「未完了」フィルターをテスト
    await page.locator('[data-testid="filter-active"]').click();
    await expect(page.locator('[data-testid="todo-item"]')).toHaveCount(2);
    
    // 「完了済み」フィルターをテスト
    await page.locator('[data-testid="filter-completed"]').click();
    await expect(page.locator('[data-testid="todo-item"]')).toHaveCount(1);
    
    // 「すべて」フィルターをテスト
    await page.locator('[data-testid="filter-all"]').click();
    await expect(page.locator('[data-testid="todo-item"]')).toHaveCount(3);
  });
});
```

## 高度なテスト技法

### 1. ページオブジェクトモデル

**プロンプト:**
```
Todoアプリ用のPage Object Modelを作成してください。
テストの保守性と再利用性を向上させる設計にしてください。
```

**生成されるコード:**
```typescript
// tests/e2e/pages/TodoPage.ts
import { Page, Locator, expect } from '@playwright/test';

export class TodoPage {
  readonly page: Page;
  readonly todoInput: Locator;
  readonly addButton: Locator;
  readonly todoItems: Locator;
  readonly filterAll: Locator;
  readonly filterActive: Locator;
  readonly filterCompleted: Locator;
  readonly clearCompleted: Locator;
  readonly toggleAll: Locator;

  constructor(page: Page) {
    this.page = page;
    this.todoInput = page.locator('[data-testid="todo-input"]');
    this.addButton = page.locator('[data-testid="add-button"]');
    this.todoItems = page.locator('[data-testid="todo-item"]');
    this.filterAll = page.locator('[data-testid="filter-all"]');
    this.filterActive = page.locator('[data-testid="filter-active"]');
    this.filterCompleted = page.locator('[data-testid="filter-completed"]');
    this.clearCompleted = page.locator('[data-testid="clear-completed"]');
    this.toggleAll = page.locator('[data-testid="toggle-all"]');
  }

  async goto() {
    await this.page.goto('/');
  }

  async addTodo(text: string) {
    await this.todoInput.fill(text);
    await this.todoInput.press('Enter');
  }

  async addMultipleTodos(texts: string[]) {
    for (const text of texts) {
      await this.addTodo(text);
    }
  }

  async toggleTodo(index: number) {
    await this.todoItems.nth(index).locator('[data-testid="todo-checkbox"]').click();
  }

  async deleteTodo(index: number) {
    await this.todoItems.nth(index).locator('[data-testid="delete-button"]').click();
  }

  async editTodo(index: number, newText: string) {
    const todoItem = this.todoItems.nth(index);
    await todoItem.locator('[data-testid="todo-title"]').dblclick();
    await todoItem.locator('[data-testid="edit-input"]').fill(newText);
    await todoItem.locator('[data-testid="edit-input"]').press('Enter');
  }

  async filterBy(filter: 'all' | 'active' | 'completed') {
    switch (filter) {
      case 'all':
        await this.filterAll.click();
        break;
      case 'active':
        await this.filterActive.click();
        break;
      case 'completed':
        await this.filterCompleted.click();
        break;
    }
  }

  async expectTodoCount(count: number) {
    await expect(this.todoItems).toHaveCount(count);
  }

  async expectTodoText(index: number, text: string) {
    await expect(this.todoItems.nth(index)).toContainText(text);
  }

  async expectTodoCompleted(index: number, completed: boolean = true) {
    const checkbox = this.todoItems.nth(index).locator('[data-testid="todo-checkbox"]');
    if (completed) {
      await expect(checkbox).toBeChecked();
    } else {
      await expect(checkbox).not.toBeChecked();
    }
  }

  async expectEmptyState() {
    await expect(this.page.locator('[data-testid="empty-state"]')).toBeVisible();
  }
}
```

**Page Objectを使用したテスト:**
```typescript
// tests/e2e/todo-with-page-object.spec.ts
import { test } from '@playwright/test';
import { TodoPage } from './pages/TodoPage';

test.describe('Todoアプリ (Page Object)', () => {
  let todoPage: TodoPage;

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page);
    await todoPage.goto();
  });

  test('複数タスクの管理', async () => {
    // 複数のタスクを追加
    await todoPage.addMultipleTodos([
      'タスク1',
      'タスク2',
      'タスク3'
    ]);

    // タスク数を確認
    await todoPage.expectTodoCount(3);

    // 2番目のタスクを完了
    await todoPage.toggleTodo(1);
    await todoPage.expectTodoCompleted(1);

    // アクティブフィルターで未完了のみ表示
    await todoPage.filterBy('active');
    await todoPage.expectTodoCount(2);

    // 完了済みフィルターで完了済みのみ表示
    await todoPage.filterBy('completed');
    await todoPage.expectTodoCount(1);
  });

  test('タスクの編集', async () => {
    await todoPage.addTodo('編集前のタスク');
    await todoPage.editTodo(0, '編集後のタスク');
    await todoPage.expectTodoText(0, '編集後のタスク');
  });
});
```

### 2. テストデータの管理

**プロンプト:**
```
E2Eテスト用のテストデータ管理システムを作成してください。
テストの独立性とデータの一貫性を保つ設計にしてください。
```

**生成されるコード:**
```typescript
// tests/e2e/fixtures/test-data.ts
export interface TestTodo {
  title: string;
  completed?: boolean;
  priority?: 'high' | 'medium' | 'low';
}

export const testData = {
  todos: {
    simple: [
      { title: 'シンプルなタスク1' },
      { title: 'シンプルなタスク2' },
      { title: 'シンプルなタスク3' }
    ],
    
    mixed: [
      { title: '未完了タスク1', completed: false },
      { title: '完了済みタスク1', completed: true },
      { title: '未完了タスク2', completed: false },
      { title: '完了済みタスク2', completed: true }
    ],
    
    priority: [
      { title: '高優先度タスク', priority: 'high' },
      { title: '中優先度タスク', priority: 'medium' },
      { title: '低優先度タスク', priority: 'low' }
    ],
    
    longText: [
      { title: 'これは非常に長いタスクタイトルのテストです。長いテキストが適切に表示されることを確認します。' },
      { title: '特殊文字を含むタスク: !@#$%^&*()_+-=[]{}|;:,.<>?' }
    ],
    
    empty: []
  },
  
  users: {
    testUser: {
      name: 'テストユーザー',
      email: 'test@example.com'
    }
  }
};

// テストデータのセットアップヘルパー
export class TestDataHelper {
  constructor(private todoPage: TodoPage) {}

  async setupTodos(todos: TestTodo[]) {
    for (const todo of todos) {
      await this.todoPage.addTodo(todo.title);
      
      if (todo.completed) {
        const index = todos.indexOf(todo);
        await this.todoPage.toggleTodo(index);
      }
    }
  }

  async clearAllTodos() {
    // ローカルストレージをクリア
    await this.todoPage.page.evaluate(() => {
      localStorage.clear();
    });
    await this.todoPage.page.reload();
  }
}
```

### 3. 視覚的回帰テスト

**プロンプト:**
```
Todoアプリの視覚的回帰テストを作成してください。
スクリーンショット比較によるUI変更の検出を実装してください。
```

**生成されるコード:**
```typescript
// tests/e2e/visual-regression.spec.ts
import { test, expect } from '@playwright/test';
import { TodoPage } from './pages/TodoPage';
import { testData, TestDataHelper } from './fixtures/test-data';

test.describe('視覚的回帰テスト', () => {
  let todoPage: TodoPage;
  let testHelper: TestDataHelper;

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page);
    testHelper = new TestDataHelper(todoPage);
    await todoPage.goto();
  });

  test('空の状態のスクリーンショット', async ({ page }) => {
    await expect(page).toHaveScreenshot('empty-state.png');
  });

  test('タスクありの状態のスクリーンショット', async ({ page }) => {
    await testHelper.setupTodos(testData.todos.simple);
    await expect(page).toHaveScreenshot('with-todos.png');
  });

  test('混在状態のスクリーンショット', async ({ page }) => {
    await testHelper.setupTodos(testData.todos.mixed);
    await expect(page).toHaveScreenshot('mixed-state.png');
  });

  test('フィルター状態のスクリーンショット', async ({ page }) => {
    await testHelper.setupTodos(testData.todos.mixed);
    
    // アクティブフィルター
    await todoPage.filterBy('active');
    await expect(page).toHaveScreenshot('active-filter.png');
    
    // 完了済みフィルター
    await todoPage.filterBy('completed');
    await expect(page).toHaveScreenshot('completed-filter.png');
  });

  test('モバイル表示のスクリーンショット', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await testHelper.setupTodos(testData.todos.simple);
    await expect(page).toHaveScreenshot('mobile-view.png');
  });
});
```

## テスト実行とデバッグ

### 1. テストの実行

```bash
# 全テストの実行
npx playwright test

# 特定のテストファイルの実行
npx playwright test todo-app.spec.ts

# 特定のブラウザでの実行
npx playwright test --project=chromium

# ヘッドモードでの実行（ブラウザを表示）
npx playwright test --headed

# デバッグモードでの実行
npx playwright test --debug

# 並列実行の無効化
npx playwright test --workers=1
```

### 2. Claude Codeでのデバッグ支援

**プロンプト:**
```
以下のPlaywrightテストが失敗しています。
エラーメッセージと失敗したテストコードを分析して、
原因と修正方法を教えてください。

エラーメッセージ:
TimeoutError: Timeout 30000ms exceeded.
=========================== logs ===========================
waiting for locator('[data-testid="todo-item"]')
============================================================

失敗したテストコード:
[テストコードを貼り付け]
```

**Claude Codeの分析:**
```
エラー分析:

原因:
1. 要素が見つからない（セレクターの問題）
2. 要素の表示に時間がかかっている
3. 非同期処理の完了を待っていない

修正方法:

1. セレクターの確認:
```typescript
// デバッグ用のスクリーンショットを追加
await page.screenshot({ path: 'debug-screenshot.png' });

// 要素の存在確認
const todoItems = page.locator('[data-testid="todo-item"]');
console.log('Todo items count:', await todoItems.count());
```

2. 待機条件の改善:
```typescript
// ネットワーク待機を追加
await page.waitForLoadState('networkidle');

// 特定の状態を待機
await expect(page.locator('[data-testid="todo-item"]')).toBeVisible({ timeout: 10000 });
```

3. より堅牢な待機:
```typescript
// カスタム待機条件
await page.waitForFunction(() => {
  const items = document.querySelectorAll('[data-testid="todo-item"]');
  return items.length > 0;
});
```
```

### 3. テスト結果の解釈

**レポートの確認:**
```bash
# HTMLレポートの生成と表示
npx playwright show-report

# JSON結果の確認
cat test-results/results.json | jq '.suites[0].specs[0].tests[0].results[0]'
```

**Claude Codeでの結果分析:**
```
テスト結果レポートを分析して、以下の情報を教えてください：

1. 失敗したテストの傾向
2. パフォーマンスの問題
3. 不安定なテスト（flaky tests）の特定
4. 改善提案

テスト結果:
[JSON結果を貼り付け]
```

## 継続的インテグレーション

### GitHub Actionsでの自動テスト

**プロンプト:**
```
PlaywrightテストをGitHub Actionsで自動実行する
ワークフローを作成してください。

要件:
- プルリクエスト時の自動実行
- 複数ブラウザでのテスト
- テスト結果のアーティファクト保存
- 失敗時のスクリーンショット保存
```

**生成されるワークフロー:**
```yaml
# .github/workflows/e2e-tests.yml
name: E2E Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - uses: actions/setup-node@v4
      with:
        node-version: 18
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Install Playwright Browsers
      run: npx playwright install --with-deps
    
    - name: Build application
      run: npm run build
    
    - name: Run Playwright tests
      run: npx playwright test
    
    - uses: actions/upload-artifact@v4
      if: always()
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30
    
    - uses: actions/upload-artifact@v4
      if: always()
      with:
        name: test-results
        path: test-results/
        retention-days: 30
```

## ベストプラクティス

### 1. テスト設計の原則

- **独立性**: 各テストは他のテストに依存しない
- **再現性**: 同じ条件で同じ結果が得られる
- **明確性**: テストの目的と期待結果が明確
- **保守性**: 変更に対して柔軟に対応できる

### 2. 効率的なテスト作成

**プロンプト:**
```
効率的なE2Eテスト作成のためのベストプラクティスを
具体的なコード例と共に教えてください。

観点:
- テストの構造化
- 共通処理の抽象化
- データ駆動テスト
- エラーハンドリング
```

### 3. パフォーマンス最適化

```typescript
// 並列実行の最適化
test.describe.configure({ mode: 'parallel' });

// 不要な待機の削除
test('最適化されたテスト', async ({ page }) => {
  // ページロードの最適化
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  
  // 効率的なセレクター
  const todoInput = page.locator('[data-testid="todo-input"]');
  await todoInput.fill('テスト');
  
  // 不要な待機を避ける
  await expect(page.locator('[data-testid="todo-item"]')).toBeVisible();
});
```

## 次のステップ

テスト基礎を理解したら：

1. **[体系的な開発プロセス](06-development-process/README.md)** - テスト駆動開発
2. **[単体テスト](06-development-process/06-unit-testing.md)** - ユニットテストとの組み合わせ
3. **[結合テスト](06-development-process/07-integration-testing.md)** - 統合テスト戦略

---

**ナビゲーション:**
- ⬅️ 前へ: [機能概要](02-features/README.md) - Claude Codeの全機能
- ➡️ 次へ: [開発プロセス](06-development-process/README.md) - 体系的な開発手法

**関連ドキュメント:**
- [簡単なアプリ作成](04-quick-tutorial.md) - テスト対象アプリの作成
- [デバッグサポート](02-features/debugging-support.md) - テストデバッグ技術
- [外部ツール連携](02-features/integration-tools.md) - CI/CD統合