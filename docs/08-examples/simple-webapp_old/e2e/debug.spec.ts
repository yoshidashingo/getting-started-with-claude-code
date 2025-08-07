import { test, expect } from '@playwright/test';

test.describe('Debug Test', () => {
  test('should debug the current state of the app', async ({ page }) => {
    // console.logをキャッチ
    page.on('console', msg => console.log(`BROWSER LOG: ${msg.text()}`));
    
    // エラーをキャッチ
    page.on('pageerror', error => console.error(`PAGE ERROR: ${error.message}`));
    
    await page.goto('/');
    
    // ページが読み込まれたことを確認
    await expect(page.locator('body')).toBeVisible();
    
    // 基本的な要素が存在するかチェック
    const title = await page.locator('h1').textContent();
    console.log(`Title: ${title}`);
    
    // すべてのh2要素をチェック
    const h2Elements = await page.locator('h2').count();
    console.log(`H2 elements count: ${h2Elements}`);
    
    // フォームが存在するかチェック
    const inputs = await page.locator('input').count();
    console.log(`Input elements count: ${inputs}`);
    
    // ボタンが存在するかチェック
    const buttons = await page.locator('button').count();
    console.log(`Button elements count: ${buttons}`);
    
    // エラーメッセージが表示されているかチェック
    const errorElements = await page.locator('[role="alert"]').count();
    console.log(`Error alert elements: ${errorElements}`);
    
    // スクリーンショットを取得
    await page.screenshot({ path: 'current-state.png', fullPage: true });
    
    console.log('✅ Debug information collected');
  });
});