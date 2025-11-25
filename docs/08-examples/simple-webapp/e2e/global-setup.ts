import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global setup...');
  
  // ブラウザを起動してアプリケーションが正常に動作することを確認
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    // アプリケーションのヘルスチェック
    await page.goto('http://localhost:3000');
    await page.waitForSelector('h1', { timeout: 10000 });
    
    console.log('✅ Application is running and accessible');
    
    // 基本的な機能が動作することを確認
    await page.fill('[placeholder*="ユーザー名"]', 'Test Setup User');
    await page.fill('[placeholder*="メールアドレス"]', 'setup@test.com');
    await page.click('button:has-text("追加")');
    
    // ユーザーが追加されることを確認
    await page.waitForSelector('text=Test Setup User', { timeout: 5000 });
    console.log('✅ Basic functionality verified');
    
    // テスト用データをクリア
    await page.evaluate(() => localStorage.clear());
    
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
  
  console.log('✅ Global setup completed successfully');
}

export default globalSetup;