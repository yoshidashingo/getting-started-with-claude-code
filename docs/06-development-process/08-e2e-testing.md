# E2Eテスト

エンドツーエンドテスト仕様書の作成とClaude Codeを活用したブラウザ自動化テストについて説明します。Playwright MCPとの連携によるユーザーシナリオテストを学習できます。

## E2Eテストとは

E2E（End-to-End）テストは、アプリケーション全体を通してユーザーの実際の操作フローを再現し、システム全体が期待通りに動作することを検証するテストです。フロントエンドからバックエンド、データベースまでの全体的な動作を確認します。

### E2Eテストの特徴

- **ユーザー視点**: 実際のユーザー操作を模擬
- **システム全体**: 全コンポーネントの連携を検証
- **ブラウザ自動化**: 実際のブラウザでの動作確認
- **シナリオベース**: ビジネス要件に基づくテストケース

## Claude CodeでのE2Eテスト設計

### ユーザーシナリオテスト仕様書の作成

**プロンプト例:**
```
ECサイトのE2Eテスト仕様書を作成してください。

対象機能:
- ユーザー登録・ログイン
- 商品検索・閲覧
- カート操作
- 注文処理
- 決済処理

テスト観点:
- ハッピーパス（正常系）
- エラーハンドリング
- ユーザビリティ
- レスポンシブ対応
- アクセシビリティ

各テストケースについて:
- ユーザーストーリー
- 前提条件
- テスト手順
- 期待結果
- 検証ポイント
```

**生成される仕様書:**
```markdown
# ECサイト E2Eテスト仕様書

## テスト概要

### 目的
ECサイトの主要な購買フローがエンドツーエンドで正常に動作することを検証する

### 対象ブラウザ
- Chrome (最新版)
- Firefox (最新版)
- Safari (最新版)
- Edge (最新版)

### テスト環境
- ステージング環境
- テスト用決済システム
- テスト用メールサーバー

## テストシナリオ

### TS001: 新規ユーザー登録から初回購入まで（ハッピーパス）

**ユーザーストーリー**: 
新規ユーザーとして、アカウント作成から商品購入まで一連の流れを完了したい

**前提条件**:
- ブラウザが起動している
- ECサイトのトップページにアクセス可能
- テスト用クレジットカード情報が利用可能

**テスト手順**:
1. トップページにアクセス
2. 「新規登録」ボタンをクリック
3. ユーザー情報を入力して登録
4. メール認証を完了
5. 商品を検索して選択
6. カートに追加
7. 購入手続きを進める
8. 決済情報を入力
9. 注文を確定

**期待結果**:
- 各ステップが正常に完了する
- 注文確認メールが送信される
- 注文履歴に記録される
- 在庫が正しく減算される

**検証ポイント**:
- フォームバリデーションが適切に動作
- ページ遷移がスムーズ
- エラーメッセージが適切に表示
- レスポンス時間が許容範囲内

### TS002: 既存ユーザーのリピート購入

**ユーザーストーリー**: 
既存ユーザーとして、過去の購入履歴を参考に再度商品を購入したい

**前提条件**:
- 既存のユーザーアカウントが存在
- 過去の購入履歴がある
- 保存済みの配送先・決済情報がある

**テスト手順**:
1. ログインページからサインイン
2. マイページで購入履歴を確認
3. 「再度購入」ボタンをクリック
4. カート内容を確認・調整
5. 保存済み情報で決済を完了

**期待結果**:
- ログインが正常に完了
- 購入履歴が正しく表示
- 保存済み情報が適用される
- 決済が正常に処理される

### TS003: カート操作とセッション管理

**ユーザーストーリー**: 
商品をカートに入れた後、一度サイトを離れても情報が保持されていてほしい

**前提条件**:
- ユーザーがログイン済み
- 商品がカートに追加済み

**テスト手順**:
1. 商品をカートに追加
2. ブラウザを閉じる
3. 再度サイトにアクセス
4. ログイン
5. カート内容を確認

**期待結果**:
- カート内容が保持されている
- 商品の価格・在庫状況が最新
- セッションが適切に復元される

### TS004: エラーハンドリング（異常系）

**ユーザーストーリー**: 
システムエラーが発生した場合でも、適切なメッセージが表示され、復旧できる

**前提条件**:
- 決済システムが一時的に利用不可
- または在庫切れ商品をカートに保持

**テスト手順**:
1. 在庫切れ商品で決済を試行
2. 決済エラーが発生
3. エラーメッセージを確認
4. 代替商品を選択
5. 再度決済を実行

**期待結果**:
- 適切なエラーメッセージが表示
- ユーザーが次のアクションを理解できる
- データの整合性が保たれる
- 復旧手順が明確

### TS005: レスポンシブ対応（モバイル）

**ユーザーストーリー**: 
スマートフォンからでも快適に商品を購入したい

**前提条件**:
- モバイルブラウザでアクセス
- タッチ操作が可能

**テスト手順**:
1. モバイルビューでサイトにアクセス
2. ハンバーガーメニューを操作
3. 商品検索・フィルタリング
4. 商品詳細ページでスワイプ操作
5. カート・決済フローを完了

**期待結果**:
- レイアウトが適切に調整される
- タッチ操作が正常に動作
- 文字・ボタンサイズが適切
- スクロール・ズームが快適
```

## Claude CodeとPlaywright MCPの連携

### Playwright MCPを使用したテスト自動化

**プロンプト例:**
```
以下のE2Eテストシナリオを
Playwright MCPを使用して自動化してください：

シナリオ: ユーザー登録から商品購入まで

手順:
1. サイトにアクセス
2. 新規登録フォームに入力
3. 商品を検索
4. カートに追加
5. 決済を完了

検証項目:
- 各ページの表示確認
- フォーム入力の動作
- エラーメッセージの表示
- 最終的な注文完了
```

**生成されるテストコード:**
```typescript
// e2e/user-purchase-flow.test.ts
import { test, expect } from '@playwright/test';

test.describe('ユーザー登録から商品購入フロー', () => {
  test('新規ユーザーが商品を購入できる', async ({ page }) => {
    // 1. サイトにアクセス
    await page.goto('https://example-shop.com');
    
    // ページが正しく読み込まれることを確認
    await expect(page).toHaveTitle(/ECショップ/);
    await expect(page.locator('h1')).toContainText('ようこそ');

    // 2. 新規登録
    await page.click('[data-testid="signup-button"]');
    
    // 登録フォームが表示されることを確認
    await expect(page.locator('[data-testid="signup-form"]')).toBeVisible();
    
    // フォームに入力
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'SecurePass123!');
    await page.fill('[data-testid="name-input"]', 'テストユーザー');
    await page.fill('[data-testid="phone-input"]', '090-1234-5678');
    
    // 利用規約に同意
    await page.check('[data-testid="terms-checkbox"]');
    
    // 登録ボタンをクリック
    await page.click('[data-testid="register-button"]');
    
    // 登録完了メッセージを確認
    await expect(page.locator('[data-testid="success-message"]'))
      .toContainText('登録が完了しました');

    // 3. 商品検索
    await page.fill('[data-testid="search-input"]', 'ノートパソコン');
    await page.press('[data-testid="search-input"]', 'Enter');
    
    // 検索結果が表示されることを確認
    await expect(page.locator('[data-testid="product-list"]')).toBeVisible();
    await expect(page.locator('[data-testid="product-item"]').first()).toBeVisible();
    
    // 最初の商品をクリック
    await page.click('[data-testid="product-item"]', { first: true });
    
    // 商品詳細ページが表示されることを確認
    await expect(page.locator('[data-testid="product-detail"]')).toBeVisible();
    await expect(page.locator('[data-testid="product-title"]')).toBeVisible();
    await expect(page.locator('[data-testid="product-price"]')).toBeVisible();

    // 4. カートに追加
    await page.click('[data-testid="add-to-cart-button"]');
    
    // カート追加の確認メッセージ
    await expect(page.locator('[data-testid="cart-notification"]'))
      .toContainText('カートに追加しました');
    
    // カートページに移動
    await page.click('[data-testid="cart-button"]');
    
    // カート内容を確認
    await expect(page.locator('[data-testid="cart-item"]')).toBeVisible();
    await expect(page.locator('[data-testid="cart-total"]')).toBeVisible();

    // 5. 決済手続き
    await page.click('[data-testid="checkout-button"]');
    
    // 配送先情報入力
    await page.fill('[data-testid="address-input"]', '東京都渋谷区1-1-1');
    await page.fill('[data-testid="postal-code-input"]', '150-0001');
    
    // 決済方法選択
    await page.click('[data-testid="payment-method-credit"]');
    
    // クレジットカード情報入力（テスト用）
    await page.fill('[data-testid="card-number-input"]', '4111111111111111');
    await page.fill('[data-testid="card-expiry-input"]', '12/25');
    await page.fill('[data-testid="card-cvv-input"]', '123');
    await page.fill('[data-testid="card-name-input"]', 'TEST USER');
    
    // 注文確認
    await page.click('[data-testid="review-order-button"]');
    
    // 注文内容確認ページ
    await expect(page.locator('[data-testid="order-summary"]')).toBeVisible();
    await expect(page.locator('[data-testid="total-amount"]')).toBeVisible();
    
    // 注文確定
    await page.click('[data-testid="place-order-button"]');
    
    // 注文完了ページの確認
    await expect(page.locator('[data-testid="order-success"]')).toBeVisible();
    await expect(page.locator('[data-testid="order-number"]')).toBeVisible();
    
    // 注文番号を取得して検証
    const orderNumber = await page.locator('[data-testid="order-number"]').textContent();
    expect(orderNumber).toMatch(/ORD-\d{8}/);
    
    // 注文確認メールの送信確認（モック環境での確認）
    // 実際の実装では、メールサービスのモックを確認
  });

  test('フォームバリデーションが正しく動作する', async ({ page }) => {
    await page.goto('https://example-shop.com/signup');
    
    // 空のフォームで送信を試行
    await page.click('[data-testid="register-button"]');
    
    // バリデーションエラーメッセージを確認
    await expect(page.locator('[data-testid="email-error"]'))
      .toContainText('メールアドレスを入力してください');
    await expect(page.locator('[data-testid="password-error"]'))
      .toContainText('パスワードを入力してください');
    
    // 不正なメールアドレスでテスト
    await page.fill('[data-testid="email-input"]', 'invalid-email');
    await page.click('[data-testid="register-button"]');
    
    await expect(page.locator('[data-testid="email-error"]'))
      .toContainText('正しいメールアドレスを入力してください');
    
    // 弱いパスワードでテスト
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', '123');
    await page.click('[data-testid="register-button"]');
    
    await expect(page.locator('[data-testid="password-error"]'))
      .toContainText('パスワードは8文字以上で入力してください');
  });

  test('カート操作が正しく動作する', async ({ page }) => {
    // 事前にログイン済みの状態を設定
    await page.goto('https://example-shop.com/login');
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'SecurePass123!');
    await page.click('[data-testid="login-button"]');
    
    // 商品ページに移動
    await page.goto('https://example-shop.com/products/laptop-001');
    
    // 数量を変更
    await page.fill('[data-testid="quantity-input"]', '2');
    await page.click('[data-testid="add-to-cart-button"]');
    
    // カートページで数量確認
    await page.click('[data-testid="cart-button"]');
    await expect(page.locator('[data-testid="item-quantity"]')).toHaveValue('2');
    
    // 数量を変更
    await page.fill('[data-testid="item-quantity"]', '3');
    await page.click('[data-testid="update-quantity-button"]');
    
    // 合計金額が更新されることを確認
    const totalBefore = await page.locator('[data-testid="cart-total"]').textContent();
    await page.waitForTimeout(1000); // 更新を待つ
    const totalAfter = await page.locator('[data-testid="cart-total"]').textContent();
    expect(totalBefore).not.toBe(totalAfter);
    
    // 商品を削除
    await page.click('[data-testid="remove-item-button"]');
    await expect(page.locator('[data-testid="empty-cart-message"]'))
      .toContainText('カートは空です');
  });
});
```

### ビジュアルリグレッションテスト

**プロンプト例:**
```
重要なページのビジュアルリグレッションテストを
Playwrightのスクリーンショット機能で作成してください：

対象ページ:
- トップページ
- 商品一覧ページ
- 商品詳細ページ
- カートページ
- 決済ページ

各ページで:
- デスクトップ表示
- モバイル表示
- ダークモード
- 異なるブラウザでの表示
```

**生成されるテストコード:**
```typescript
// e2e/visual-regression.test.ts
import { test, expect } from '@playwright/test';

test.describe('ビジュアルリグレッションテスト', () => {
  // デスクトップ表示のテスト
  test.describe('デスクトップ表示', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
    });

    test('トップページのスクリーンショット', async ({ page }) => {
      await page.goto('https://example-shop.com');
      await page.waitForLoadState('networkidle');
      
      // ヘッダーが表示されるまで待機
      await expect(page.locator('[data-testid="header"]')).toBeVisible();
      
      await expect(page).toHaveScreenshot('homepage-desktop.png');
    });

    test('商品一覧ページのスクリーンショット', async ({ page }) => {
      await page.goto('https://example-shop.com/products');
      await page.waitForLoadState('networkidle');
      
      // 商品リストが読み込まれるまで待機
      await expect(page.locator('[data-testid="product-list"]')).toBeVisible();
      
      await expect(page).toHaveScreenshot('products-desktop.png');
    });

    test('商品詳細ページのスクリーンショット', async ({ page }) => {
      await page.goto('https://example-shop.com/products/laptop-001');
      await page.waitForLoadState('networkidle');
      
      // 商品画像が読み込まれるまで待機
      await expect(page.locator('[data-testid="product-image"]')).toBeVisible();
      
      await expect(page).toHaveScreenshot('product-detail-desktop.png');
    });
  });

  // モバイル表示のテスト
  test.describe('モバイル表示', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
    });

    test('トップページ（モバイル）のスクリーンショット', async ({ page }) => {
      await page.goto('https://example-shop.com');
      await page.waitForLoadState('networkidle');
      
      await expect(page.locator('[data-testid="mobile-header"]')).toBeVisible();
      
      await expect(page).toHaveScreenshot('homepage-mobile.png');
    });

    test('ハンバーガーメニューのスクリーンショット', async ({ page }) => {
      await page.goto('https://example-shop.com');
      
      // ハンバーガーメニューを開く
      await page.click('[data-testid="hamburger-button"]');
      await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();
      
      await expect(page).toHaveScreenshot('mobile-menu.png');
    });
  });

  // ダークモードのテスト
  test.describe('ダークモード', () => {
    test.beforeEach(async ({ page }) => {
      // ダークモードを有効にする
      await page.emulateMedia({ colorScheme: 'dark' });
    });

    test('トップページ（ダークモード）のスクリーンショット', async ({ page }) => {
      await page.goto('https://example-shop.com');
      await page.waitForLoadState('networkidle');
      
      await expect(page).toHaveScreenshot('homepage-dark.png');
    });

    test('商品詳細ページ（ダークモード）のスクリーンショット', async ({ page }) => {
      await page.goto('https://example-shop.com/products/laptop-001');
      await page.waitForLoadState('networkidle');
      
      await expect(page).toHaveScreenshot('product-detail-dark.png');
    });
  });

  // 異なる状態でのテスト
  test.describe('状態別スクリーンショット', () => {
    test('エラーページのスクリーンショット', async ({ page }) => {
      await page.goto('https://example-shop.com/nonexistent-page');
      
      await expect(page.locator('[data-testid="error-404"]')).toBeVisible();
      await expect(page).toHaveScreenshot('error-404.png');
    });

    test('ローディング状態のスクリーンショット', async ({ page }) => {
      // ネットワークを遅くしてローディング状態を再現
      await page.route('**/api/products', route => {
        setTimeout(() => route.continue(), 2000);
      });
      
      await page.goto('https://example-shop.com/products');
      
      // ローディングスピナーが表示されることを確認
      await expect(page.locator('[data-testid="loading-spinner"]')).toBeVisible();
      await expect(page).toHaveScreenshot('loading-state.png');
    });

    test('空のカートページのスクリーンショット', async ({ page }) => {
      await page.goto('https://example-shop.com/cart');
      
      await expect(page.locator('[data-testid="empty-cart"]')).toBeVisible();
      await expect(page).toHaveScreenshot('empty-cart.png');
    });
  });
});
```

### アクセシビリティテスト

**プロンプト例:**
```
Webアクセシビリティの自動テストを
Playwright + axe-coreで作成してください：

チェック項目:
- WCAG 2.1 AA準拠
- キーボードナビゲーション
- スクリーンリーダー対応
- カラーコントラスト
- フォーカス管理

対象ページ:
- 主要なユーザーフロー
- フォームページ
- 動的コンテンツページ
```

**生成されるテストコード:**
```typescript
// e2e/accessibility.test.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('アクセシビリティテスト', () => {
  test('トップページのアクセシビリティ', async ({ page }) => {
    await page.goto('https://example-shop.com');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('フォームページのアクセシビリティ', async ({ page }) => {
    await page.goto('https://example-shop.com/signup');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('キーボードナビゲーション', async ({ page }) => {
    await page.goto('https://example-shop.com');
    
    // Tabキーでナビゲーション
    await page.keyboard.press('Tab');
    let focusedElement = await page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // 複数回Tabを押してフォーカス移動を確認
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
      focusedElement = await page.locator(':focus');
      await expect(focusedElement).toBeVisible();
    }
    
    // Shift+Tabで逆方向ナビゲーション
    await page.keyboard.press('Shift+Tab');
    focusedElement = await page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('フォームのキーボード操作', async ({ page }) => {
    await page.goto('https://example-shop.com/signup');
    
    // Tabでフォーカス移動
    await page.keyboard.press('Tab');
    await page.keyboard.type('test@example.com');
    
    await page.keyboard.press('Tab');
    await page.keyboard.type('SecurePass123!');
    
    await page.keyboard.press('Tab');
    await page.keyboard.type('テストユーザー');
    
    // Enterキーで送信
    await page.keyboard.press('Tab'); // 送信ボタンにフォーカス
    await page.keyboard.press('Enter');
    
    // フォーム送信が実行されることを確認
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
  });

  test('ARIAラベルとロールの確認', async ({ page }) => {
    await page.goto('https://example-shop.com/products');
    
    // 検索フォームのARIAラベル
    const searchInput = page.locator('[data-testid="search-input"]');
    await expect(searchInput).toHaveAttribute('aria-label', '商品を検索');
    
    // ナビゲーションのロール
    const navigation = page.locator('[data-testid="main-navigation"]');
    await expect(navigation).toHaveAttribute('role', 'navigation');
    
    // 商品リストのロール
    const productList = page.locator('[data-testid="product-list"]');
    await expect(productList).toHaveAttribute('role', 'list');
    
    // 商品アイテムのロール
    const productItems = page.locator('[data-testid="product-item"]');
    await expect(productItems.first()).toHaveAttribute('role', 'listitem');
  });

  test('カラーコントラストの確認', async ({ page }) => {
    await page.goto('https://example-shop.com');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .withRules(['color-contrast'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('動的コンテンツのアクセシビリティ', async ({ page }) => {
    await page.goto('https://example-shop.com/products');
    
    // 検索を実行して動的にコンテンツを更新
    await page.fill('[data-testid="search-input"]', 'ノートパソコン');
    await page.press('[data-testid="search-input"]', 'Enter');
    
    // 検索結果が読み込まれるまで待機
    await expect(page.locator('[data-testid="search-results"]')).toBeVisible();
    
    // 動的に更新されたコンテンツのアクセシビリティをチェック
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('[data-testid="search-results"]')
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
    
    // aria-live領域の確認
    const searchStatus = page.locator('[data-testid="search-status"]');
    await expect(searchStatus).toHaveAttribute('aria-live', 'polite');
    await expect(searchStatus).toContainText('件の商品が見つかりました');
  });
});
```

## パフォーマンステスト

### Core Web Vitals の測定

**プロンプト例:**
```
Core Web Vitalsを測定するE2Eテストを作成してください：

測定項目:
- LCP (Largest Contentful Paint)
- FID (First Input Delay)
- CLS (Cumulative Layout Shift)
- FCP (First Contentful Paint)
- TTI (Time to Interactive)

対象ページ:
- トップページ
- 商品一覧ページ
- 商品詳細ページ

閾値:
- LCP: 2.5秒以下
- FID: 100ms以下
- CLS: 0.1以下
```

**生成されるテストコード:**
```typescript
// e2e/performance.test.ts
import { test, expect } from '@playwright/test';

test.describe('パフォーマンステスト', () => {
  test('トップページのCore Web Vitals', async ({ page }) => {
    // パフォーマンス測定を開始
    await page.goto('https://example-shop.com', { waitUntil: 'networkidle' });
    
    // Core Web Vitalsを測定
    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const metrics = {};
          
          entries.forEach((entry) => {
            if (entry.entryType === 'largest-contentful-paint') {
              metrics.lcp = entry.startTime;
            }
            if (entry.entryType === 'first-input') {
              metrics.fid = entry.processingStart - entry.startTime;
            }
            if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
              metrics.cls = (metrics.cls || 0) + entry.value;
            }
          });
          
          // FCPとTTIも取得
          const navigation = performance.getEntriesByType('navigation')[0];
          metrics.fcp = performance.getEntriesByName('first-contentful-paint')[0]?.startTime;
          metrics.tti = navigation.loadEventEnd - navigation.fetchStart;
          
          resolve(metrics);
        }).observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
        
        // タイムアウト設定
        setTimeout(() => resolve({}), 10000);
      });
    });
    
    // 閾値チェック
    if (metrics.lcp) {
      expect(metrics.lcp).toBeLessThan(2500); // 2.5秒以下
    }
    if (metrics.fid) {
      expect(metrics.fid).toBeLessThan(100); // 100ms以下
    }
    if (metrics.cls) {
      expect(metrics.cls).toBeLessThan(0.1); // 0.1以下
    }
    if (metrics.fcp) {
      expect(metrics.fcp).toBeLessThan(1800); // 1.8秒以下
    }
    
    console.log('Performance Metrics:', metrics);
  });

  test('商品一覧ページの読み込み時間', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('https://example-shop.com/products');
    await page.waitForSelector('[data-testid="product-list"]');
    
    const loadTime = Date.now() - startTime;
    
    // 3秒以内に読み込み完了
    expect(loadTime).toBeLessThan(3000);
    
    // 商品画像の遅延読み込みをテスト
    const images = page.locator('[data-testid="product-image"]');
    const imageCount = await images.count();
    
    // 最初の数枚の画像が読み込まれることを確認
    for (let i = 0; i < Math.min(imageCount, 6); i++) {
      await expect(images.nth(i)).toBeVisible();
    }
  });

  test('検索機能のレスポンス時間', async ({ page }) => {
    await page.goto('https://example-shop.com/products');
    
    const startTime = Date.now();
    
    await page.fill('[data-testid="search-input"]', 'ノートパソコン');
    await page.press('[data-testid="search-input"]', 'Enter');
    
    // 検索結果が表示されるまで待機
    await page.waitForSelector('[data-testid="search-results"]');
    
    const searchTime = Date.now() - startTime;
    
    // 検索は1秒以内に完了
    expect(searchTime).toBeLessThan(1000);
    
    // 結果件数が表示されることを確認
    await expect(page.locator('[data-testid="search-count"]')).toBeVisible();
  });
});
```

## 次のステップ

E2Eテストを理解したら：

1. **[テスト基礎](../05-testing-basics.md)** - Playwright MCPの詳細設定
2. **[ビルド自動化](07-build-automation.md)** - CI/CDでのテスト実行
3. **[チーム開発](../07-team-development/README.md)** - チームでのテスト運用

---

**関連ドキュメント:**
- [結合テスト](07-integration-testing.md) - 結合テストとの組み合わせ
- [単体テスト](06-unit-testing.md) - テストピラミッドの理解
- [統合ツール](../02-features/integration-tools.md) - Playwright MCP連携