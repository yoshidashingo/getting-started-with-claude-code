# トラブルシューティング

Claude Code使用時によくある問題と解決方法について説明します。問題の種類別に整理し、効率的な解決方法を提供します。

## 環境・セットアップ関連

### 1. APIキーエラー

#### 問題: "CLAUDE_API_KEY が設定されていません"
**原因**: 環境変数が正しく設定されていない

**解決方法**:
```bash
# 環境変数の確認
echo $CLAUDE_API_KEY  # macOS/Linux
echo %CLAUDE_API_KEY% # Windows

# .envファイルの確認
cat .env

# 正しい設定例
CLAUDE_API_KEY=your-actual-api-key-here
```

#### 問題: "Invalid API key"
**原因**: APIキーが無効または期限切れ

**解決方法**:
1. Claude公式サイトでAPIキーを確認
2. 新しいAPIキーを生成
3. 環境変数を更新

### 2. Node.jsバージョンエラー

#### 問題: "Node.js version not supported"
**解決方法**:
```bash
# 現在のバージョン確認
node --version

# 推奨バージョン（18.x以降）のインストール
# macOS (Homebrew)
brew install node@18

# Windows (公式インストーラー)
# https://nodejs.org からダウンロード

# Linux (NodeSource)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 3. 依存関係エラー

#### 問題: "Module not found"
**解決方法**:
```bash
# キャッシュクリア
npm cache clean --force

# node_modules削除と再インストール
rm -rf node_modules package-lock.json
npm install

# 特定パッケージの再インストール
npm uninstall [package-name]
npm install [package-name]
```

## Claude Code API関連

### 4. レスポンス遅延・タイムアウト

#### 問題: "Request timeout"
**原因**: ネットワーク問題またはAPI負荷

**解決方法**:
```typescript
// タイムアウト設定の調整
const client = new ClaudeClient(apiKey, {
  timeout: 60000, // 60秒に延長
  retries: 3,     // リトライ回数
});

// 指数バックオフでのリトライ
const retryWithBackoff = async (fn: () => Promise<any>, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
};
```

### 5. レート制限エラー

#### 問題: "Rate limit exceeded"
**解決方法**:
```typescript
// レート制限対応
class RateLimitedClient {
  private lastRequest = 0;
  private minInterval = 1000; // 1秒間隔

  async makeRequest(prompt: string) {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequest;
    
    if (timeSinceLastRequest < this.minInterval) {
      await new Promise(resolve => 
        setTimeout(resolve, this.minInterval - timeSinceLastRequest)
      );
    }
    
    this.lastRequest = Date.now();
    return await this.client.generateCode(prompt);
  }
}
```

## コード生成関連

### 6. 期待した結果が得られない

#### 問題: 生成されたコードが要求と異なる
**解決方法**:

**改善前のプロンプト:**
```
ログイン機能を作って
```

**改善後のプロンプト:**
```
React TypeScriptでログイン機能を作成してください。

要件:
- メールアドレスとパスワードでの認証
- フォームバリデーション（必須項目、メール形式チェック）
- ローディング状態の表示
- エラーメッセージの表示
- 成功時のリダイレクト処理

技術仕様:
- React Hook Form使用
- Yupでバリデーション
- Axiosで API通信
- Material-UI でスタイリング

期待する動作:
1. フォーム入力
2. バリデーション実行
3. API送信
4. 結果に応じた画面遷移
```

### 7. 生成されたコードにエラーがある

#### 問題: TypeScriptエラーや実行時エラー
**解決方法**:

**エラー報告のプロンプト:**
```
以下のコードでエラーが発生しています：

エラーメッセージ:
[具体的なエラーメッセージ]

問題のコード:
[エラーが発生しているコード]

環境情報:
- TypeScript: 5.0.0
- React: 18.2.0
- Node.js: 18.16.0

エラーの原因を特定して修正してください。
```

## プロジェクト構造関連

### 8. 大規模プロジェクトでの性能問題

#### 問題: Claude Codeの応答が遅い
**解決方法**:

```typescript
// プロジェクトコンテキストの最適化
const optimizeContext = {
  // 重要なファイルのみ含める
  includeFiles: [
    'src/types/**/*.ts',
    'src/components/**/*.tsx',
    'package.json',
    'tsconfig.json'
  ],
  
  // 除外するファイル
  excludeFiles: [
    'node_modules/**',
    'dist/**',
    '**/*.test.ts',
    '**/*.spec.ts'
  ]
};
```

**段階的なプロンプト:**
```
# 大きなタスクを分割
1. まず基本的な型定義を作成
2. 次にコアロジックを実装
3. 最後にUI コンポーネントを作成
```

### 9. ファイル構造の混乱

#### 問題: プロジェクト構造が複雑になりすぎる
**解決方法**:

**構造整理のプロンプト:**
```
現在のプロジェクト構造を分析して、
以下の原則に基づいて最適化してください：

原則:
- 機能別のディレクトリ構成
- 関心の分離
- 再利用性の向上
- 保守性の確保

現在の構造:
[現在のディレクトリ構造]

推奨する改善案を提示してください。
```

## デバッグ関連

### 10. ランタイムエラーの解決

#### 問題: "Cannot read property of undefined"
**デバッグプロンプト:**
```
以下のランタイムエラーを解決してください：

エラー: Cannot read property 'name' of undefined
発生箇所: UserProfile.tsx:25
関連コード:
[エラー発生箇所のコード]

考えられる原因:
1. データの非同期読み込み
2. プロパティの存在チェック不足
3. 型定義の不整合

安全なコードに修正してください。
```

### 11. パフォーマンス問題

#### 問題: アプリケーションが重い
**最適化プロンプト:**
```
以下のReactコンポーネントのパフォーマンスを
最適化してください：

問題:
- 不要な再レンダリング
- 重い計算の繰り返し実行
- メモリリーク

最適化手法:
- React.memo
- useMemo
- useCallback
- 仮想化

[対象コード]
```

## テスト関連

### 12. テストが失敗する

#### 問題: Jest/Playwrightテストエラー
**解決プロンプト:**
```
以下のテストが失敗しています：

テストコード:
[失敗するテストコード]

エラーメッセージ:
[具体的なエラーメッセージ]

期待する動作:
[テストで確認したい動作]

テストを修正して、正しく動作するようにしてください。
```

## デプロイ関連

### 13. ビルドエラー

#### 問題: "Build failed"
**解決方法**:
```bash
# 詳細なエラー情報を取得
npm run build -- --verbose

# TypeScriptエラーの確認
npx tsc --noEmit

# ESLintエラーの確認
npm run lint
```

### 14. 本番環境での動作不良

#### 問題: 開発環境では動作するが本番で問題
**チェック項目:**
```typescript
// 環境変数の確認
console.log('Environment:', process.env.NODE_ENV);
console.log('API URL:', process.env.REACT_APP_API_URL);

// ビルド設定の確認
// vite.config.ts
export default defineConfig({
  base: '/your-app/', // 本番環境のベースパス
  build: {
    outDir: 'dist',
    sourcemap: true, // デバッグ用
  }
});
```

## 一般的な問題解決手順

### 1. 問題の特定
```markdown
1. エラーメッセージの確認
2. 再現手順の記録
3. 環境情報の収集
4. 最小再現コードの作成
```

### 2. Claude Codeでの解決
```
問題解決のプロンプトテンプレート:

問題の概要: [簡潔な問題の説明]
エラーメッセージ: [具体的なエラー]
環境情報: [OS, Node.js, ブラウザ等]
再現手順: [問題が発生する手順]
期待する動作: [本来の動作]
試した解決方法: [既に試したこと]

この問題の原因と解決方法を教えてください。
```

### 3. 予防策の実装
```typescript
// エラーハンドリングの強化
const safeApiCall = async (apiFunction: () => Promise<any>) => {
  try {
    return await apiFunction();
  } catch (error) {
    console.error('API Error:', error);
    // エラー報告サービスに送信
    errorReporting.captureException(error);
    throw error;
  }
};

// 型安全性の向上
interface ApiResponse<T> {
  data: T;
  error?: string;
  status: number;
}

// バリデーションの追加
const validateInput = (input: unknown): input is ValidInput => {
  return typeof input === 'object' && input !== null;
};
```

## サポートリソース

### 公式リソース
- [Claude公式ドキュメント](https://docs.anthropic.com/)
- [Claude APIリファレンス](https://docs.anthropic.com/claude/reference/)

### コミュニティ
- [Claude Community Forum](https://community.anthropic.com/)
- [GitHub Discussions](https://github.com/anthropic/claude-code/discussions)

### 緊急時の連絡先
- サポートチケット: support@anthropic.com
- 障害情報: status.anthropic.com

---

**ナビゲーション:**
- ⬅️ 前へ: [サンプル集](08-examples/README.md) - 実用的なプロジェクト例
- ➡️ 次へ: [上級者向けトピック](10-advanced-topics.md) - 高度な活用テクニック

**関連ドキュメント:**
- [セットアップガイド](03-getting-started.md) - 基本的な環境構築
- [デバッグサポート](02-features/debugging-support.md) - 詳細なデバッグ手法
- [設定ファイル詳細](12-configuration.md) - 詳細なカスタマイズ