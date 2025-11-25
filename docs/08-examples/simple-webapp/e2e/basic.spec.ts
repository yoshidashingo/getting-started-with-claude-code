import { test, expect } from '@playwright/test';

test.describe('Basic User Management App Test', () => {
  test('should load the app successfully', async ({ page }) => {
    await page.goto('/');
    
    // アプリが読み込まれることを確認
    await expect(page.locator('h1')).toContainText('ユーザー管理システム');
    
    // 基本的な要素が存在することを確認 (実際は5つのh2要素がある)
    await expect(page.locator('h2')).toHaveCount(5);
    
    console.log('✅ アプリケーションが正常に読み込まれました');
  });
});