import { test, expect } from '@playwright/test';

test.describe('User Management Functionality Test', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // LocalStorageをクリア
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should add a user and see it in the list', async ({ page }) => {
    // ユーザーを追加
    await page.fill('input[placeholder*="ユーザー名"]', 'Test User');
    await page.fill('input[placeholder*="メールアドレス"]', 'test@example.com');
    await page.click('button:has-text("追加")');
    
    // ユーザーが表示されることを確認
    await expect(page.locator('text=Test User')).toBeVisible();
    await expect(page.locator('text=test@example.com')).toBeVisible();
    
    console.log('✅ ユーザー追加機能が正常に動作しました');
  });
  
  test('should show validation errors for empty form', async ({ page }) => {
    // 空のフォームで送信ボタンをクリック
    await page.click('button:has-text("追加")');
    
    // バリデーションエラーが表示されることを確認
    await expect(page.locator('text=ユーザー名は必須です')).toBeVisible({ timeout: 5000 });
    
    console.log('✅ フォームバリデーション機能が正常に動作しました');
  });
});