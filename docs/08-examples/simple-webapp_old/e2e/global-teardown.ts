import { FullConfig } from '@playwright/test';

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting global teardown...');
  
  // テスト後のクリーンアップ処理
  // 必要に応じてテストデータの削除、外部サービスの停止など
  
  console.log('✅ Global teardown completed');
}

export default globalTeardown;