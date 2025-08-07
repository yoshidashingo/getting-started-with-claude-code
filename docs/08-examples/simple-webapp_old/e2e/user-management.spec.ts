import { test, expect } from '@playwright/test';

test.describe('User Management App', () => {
  test.beforeEach(async ({ page }) => {
    // 各テスト前にページを訪問し、LocalStorageをクリア
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should display the main interface correctly', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('ユーザー管理システム');
    await expect(page.locator('text=新しいユーザーを追加')).toBeVisible();
    await expect(page.locator('text=統計情報')).toBeVisible();
    await expect(page.locator('text=ユーザー検索')).toBeVisible();
  });

  test('should add a new user successfully', async ({ page }) => {
    // フォームに入力
    await page.fill('[placeholder*="ユーザー名"]', 'John Doe');
    await page.fill('[placeholder*="メールアドレス"]', 'john@example.com');
    
    // 追加ボタンをクリック
    await page.click('button:has-text("追加")');
    
    // ユーザーが追加されたことを確認
    await expect(page.locator('text=John Doe')).toBeVisible();
    await expect(page.locator('text=john@example.com')).toBeVisible();
    
    // 統計が更新されたことを確認
    await expect(page.locator('text=1 ユーザー')).toBeVisible();
  });

  test('should validate form inputs', async ({ page }) => {
    // 空のフォームで送信を試行
    await page.click('button:has-text("追加")');
    
    // バリデーションエラーが表示されることを確認
    await expect(page.locator('text=ユーザー名は必須です')).toBeVisible();
    await expect(page.locator('text=メールアドレスは必須です')).toBeVisible();
    
    // 無効なメールアドレスでテスト
    await page.fill('[placeholder*="ユーザー名"]', 'John Doe');
    await page.fill('[placeholder*="メールアドレス"]', 'invalid-email');
    await page.click('button:has-text("追加")');
    
    await expect(page.locator('text=有効なメールアドレスを入力してください')).toBeVisible();
  });

  test('should search users correctly', async ({ page }) => {
    // 複数のユーザーを追加
    const users = [
      { name: 'John Doe', email: 'john@example.com' },
      { name: 'Jane Smith', email: 'jane@example.com' },
      { name: 'Bob Johnson', email: 'bob@test.com' },
    ];

    for (const user of users) {
      await page.fill('[placeholder*="ユーザー名"]', user.name);
      await page.fill('[placeholder*="メールアドレス"]', user.email);
      await page.click('button:has-text("追加")');
      
      // フォームがクリアされるまで待機
      await expect(page.locator('[placeholder*="ユーザー名"]')).toHaveValue('');
    }

    // 検索機能をテスト
    await page.fill('[placeholder*="検索"]', 'John');
    
    // 検索結果を確認
    await expect(page.locator('text=John Doe')).toBeVisible();
    await expect(page.locator('text=Jane Smith')).not.toBeVisible();
    await expect(page.locator('text=Bob Johnson')).not.toBeVisible();
    
    // 検索統計を確認
    await expect(page.locator('text=1 件 / 全 3 件')).toBeVisible();
    
    // 検索をクリア
    await page.click('[aria-label="検索をクリア"]');
    
    // すべてのユーザーが再表示されることを確認
    await expect(page.locator('text=John Doe')).toBeVisible();
    await expect(page.locator('text=Jane Smith')).toBeVisible();
    await expect(page.locator('text=Bob Johnson')).toBeVisible();
  });

  test('should edit user information', async ({ page }) => {
    // ユーザーを追加
    await page.fill('[placeholder*="ユーザー名"]', 'John Doe');
    await page.fill('[placeholder*="メールアドレス"]', 'john@example.com');
    await page.click('button:has-text("追加")');
    
    // 編集ボタンをクリック
    await page.click('[aria-label*="編集"]');
    
    // 編集フォームが表示されることを確認
    await expect(page.locator('input[value="John Doe"]')).toBeVisible();
    await expect(page.locator('input[value="john@example.com"]')).toBeVisible();
    
    // 名前を変更
    await page.fill('input[value="John Doe"]', 'John Smith');
    
    // 保存ボタンをクリック
    await page.click('button:has-text("保存")');
    
    // 変更が反映されることを確認
    await expect(page.locator('text=John Smith')).toBeVisible();
    await expect(page.locator('text=John Doe')).not.toBeVisible();
  });

  test('should delete user with confirmation', async ({ page }) => {
    // ユーザーを追加
    await page.fill('[placeholder*="ユーザー名"]', 'John Doe');
    await page.fill('[placeholder*="メールアドレス"]', 'john@example.com');
    await page.click('button:has-text("追加")');
    
    // 削除ダイアログのモック
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('John Doe');
      expect(dialog.message()).toContain('削除しますか');
      await dialog.accept();
    });
    
    // 削除ボタンをクリック
    await page.click('[aria-label*="削除"]');
    
    // ユーザーが削除されることを確認
    await expect(page.locator('text=John Doe')).not.toBeVisible();
    await expect(page.locator('text=0 ユーザー')).toBeVisible();
  });

  test('should cancel delete when confirmation is rejected', async ({ page }) => {
    // ユーザーを追加
    await page.fill('[placeholder*="ユーザー名"]', 'John Doe');
    await page.fill('[placeholder*="メールアドレス"]', 'john@example.com');
    await page.click('button:has-text("追加")');
    
    // 削除ダイアログをキャンセル
    page.on('dialog', async dialog => {
      await dialog.dismiss();
    });
    
    // 削除ボタンをクリック
    await page.click('[aria-label*="削除"]');
    
    // ユーザーが削除されないことを確認
    await expect(page.locator('text=John Doe')).toBeVisible();
    await expect(page.locator('text=1 ユーザー')).toBeVisible();
  });

  test('should persist data in localStorage', async ({ page }) => {
    // ユーザーを追加
    await page.fill('[placeholder*="ユーザー名"]', 'John Doe');
    await page.fill('[placeholder*="メールアドレス"]', 'john@example.com');
    await page.click('button:has-text("追加")');
    
    // ページをリロード
    await page.reload();
    
    // データが保持されていることを確認
    await expect(page.locator('text=John Doe')).toBeVisible();
    await expect(page.locator('text=john@example.com')).toBeVisible();
    await expect(page.locator('text=1 ユーザー')).toBeVisible();
  });

  test('should handle keyboard navigation', async ({ page }) => {
    // ユーザーを追加
    await page.fill('[placeholder*="ユーザー名"]', 'John Doe');
    await page.fill('[placeholder*="メールアドレス"]', 'john@example.com');
    
    // Enterキーで送信
    await page.press('[placeholder*="メールアドレス"]', 'Enter');
    
    // ユーザーが追加されることを確認
    await expect(page.locator('text=John Doe')).toBeVisible();
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    // モバイルビューポートに設定
    await page.setViewportSize({ width: 375, height: 667 });
    
    // 基本的な要素が表示されることを確認
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=新しいユーザーを追加')).toBeVisible();
    
    // フォームが使用可能であることを確認
    await page.fill('[placeholder*="ユーザー名"]', 'Mobile User');
    await page.fill('[placeholder*="メールアドレス"]', 'mobile@example.com');
    await page.click('button:has-text("追加")');
    
    await expect(page.locator('text=Mobile User')).toBeVisible();
  });

  test('should show empty state when no users exist', async ({ page }) => {
    // 空状態のメッセージが表示されることを確認
    await expect(page.locator('text=まだユーザーがありません')).toBeVisible();
    await expect(page.locator('text=上のフォームから新しいユーザーを追加')).toBeVisible();
  });

  test('should show search empty state', async ({ page }) => {
    // ユーザーを追加
    await page.fill('[placeholder*="ユーザー名"]', 'John Doe');
    await page.fill('[placeholder*="メールアドレス"]', 'john@example.com');
    await page.click('button:has-text("追加")');
    
    // 存在しないユーザーを検索
    await page.fill('[placeholder*="検索"]', 'NonExistent');
    
    // 検索結果なしのメッセージが表示されることを確認
    await expect(page.locator('text=検索結果が見つかりません')).toBeVisible();
  });

  test('should handle duplicate email validation', async ({ page }) => {
    // 最初のユーザーを追加
    await page.fill('[placeholder*="ユーザー名"]', 'John Doe');
    await page.fill('[placeholder*="メールアドレス"]', 'john@example.com');
    await page.click('button:has-text("追加")');
    
    // 同じメールアドレスで別のユーザーを追加しようとする
    await page.fill('[placeholder*="ユーザー名"]', 'Jane Doe');
    await page.fill('[placeholder*="メールアドレス"]', 'john@example.com');
    await page.click('button:has-text("追加")');
    
    // 重複エラーが表示されることを確認
    await expect(page.locator('text=このメールアドレスは既に使用されています')).toBeVisible();
  });
});