# 設計文書

## 概要

この設計文書は、Claude Code初心者ガイドに沿ったsimple-webappサンプルの完全な実装を定義します。React + TypeScriptを使用したユーザー管理システムを構築し、開発者がClaude Codeを効果的に活用する方法を学習できる包括的な例を提供します。

## アーキテクチャ

### システム全体構成

```mermaid
graph TB
    A[ユーザー] --> B[Webブラウザ]
    B --> C[React Application]
    C --> D[LocalStorage]
    C --> E[CSS Modules]
    
    subgraph "React Application"
        F[App Component]
        G[Custom Hooks]
        H[UI Components]
        I[Utility Functions]
        J[Type Definitions]
    end
    
    F --> G
    F --> H
    G --> I
    G --> J
    H --> E
```

### 技術スタック

- **フロントエンド**: React 18 + TypeScript 4.9+
- **ビルドツール**: Vite 4.x
- **スタイリング**: CSS Modules
- **状態管理**: React Hooks (useState, useEffect, useCallback, useMemo)
- **データ永続化**: Browser LocalStorage API
- **開発ツール**: ESLint, Prettier, TypeScript Compiler

### アーキテクチャパターン

- **コンポーネント設計**: 単一責任の原則に基づく機能別分割
- **状態管理**: カスタムフックによる状態ロジックの分離
- **データフロー**: 単方向データフロー（React標準）
- **エラーハンドリング**: 各層での適切なエラー処理

## コンポーネントとインターフェース

### コンポーネント階層

```
App
├── UserManagementApp
    ├── UserForm (ユーザー追加フォーム)
    ├── SearchBar (検索機能)
    ├── UserList (ユーザー一覧)
    │   └── UserCard (個別ユーザー表示)
    └── UserStats (統計情報表示)
```

### 主要コンポーネント仕様

#### UserManagementApp
- **責任**: アプリケーション全体の状態管理と子コンポーネントの統合
- **Props**: なし
- **State**: ユーザーリスト、検索クエリ、フィルター状態
- **Hooks**: useUsers (カスタムフック)

#### UserForm
- **責任**: 新規ユーザーの追加とバリデーション
- **Props**: onAddUser: (user: CreateUserInput) => void
- **State**: フォーム入力値、バリデーションエラー
- **機能**: リアルタイムバリデーション、送信処理

#### UserCard
- **責任**: 個別ユーザー情報の表示と操作
- **Props**: user: User, onEdit: (id: string) => void, onDelete: (id: string) => void
- **State**: 編集モード状態
- **機能**: インライン編集、削除確認

#### SearchBar
- **責任**: ユーザー検索とフィルタリング
- **Props**: onSearch: (query: string) => void, placeholder?: string
- **State**: 検索入力値
- **機能**: リアルタイム検索、検索結果ハイライト

### カスタムフック設計

#### useUsers
```typescript
interface UseUsersReturn {
  users: User[];
  filteredUsers: User[];
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
  
  // CRUD操作
  addUser: (input: CreateUserInput) => Promise<void>;
  updateUser: (id: string, input: UpdateUserInput) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  
  // 検索・フィルタリング
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
  
  // ユーティリティ
  getUserById: (id: string) => User | undefined;
  getUserCount: () => number;
}
```

#### useLocalStorage
```typescript
interface UseLocalStorageReturn<T> {
  value: T;
  setValue: (value: T | ((prev: T) => T)) => void;
  removeValue: () => void;
  isLoading: boolean;
  error: string | null;
}
```

## データモデル

### 型定義

```typescript
// 基本ユーザー型
interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

// ユーザー作成入力型
interface CreateUserInput {
  name: string;
  email: string;
}

// ユーザー更新入力型
interface UpdateUserInput {
  name?: string;
  email?: string;
}

// バリデーションエラー型
interface ValidationError {
  field: string;
  message: string;
}

// アプリケーション状態型
interface AppState {
  users: User[];
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
}
```

### データバリデーション

#### ユーザー入力バリデーション
- **名前**: 必須、1-50文字、特殊文字制限
- **メールアドレス**: 必須、有効なメール形式、重複チェック

#### データ整合性
- **ID**: UUID v4形式での一意性保証
- **日時**: ISO 8601形式での統一
- **文字エンコーディング**: UTF-8対応

### LocalStorage設計

#### データ構造
```typescript
interface StorageData {
  users: User[];
  version: string;
  lastUpdated: string;
}
```

#### ストレージキー
- `userManagementApp_users`: ユーザーデータ
- `userManagementApp_settings`: アプリケーション設定

## エラーハンドリング

### エラー分類

#### 1. バリデーションエラー
- **発生場所**: フォーム入力時
- **処理方法**: フィールド単位でのエラー表示
- **ユーザー体験**: リアルタイムフィードバック

#### 2. ストレージエラー
- **発生場所**: LocalStorage操作時
- **処理方法**: フォールバック処理とユーザー通知
- **復旧方法**: データの再読み込み、初期化オプション

#### 3. システムエラー
- **発生場所**: 予期しない例外
- **処理方法**: エラーバウンダリでのキャッチ
- **ユーザー体験**: 適切なエラーメッセージと復旧手順

### エラー処理戦略

```typescript
// エラーハンドリングパターン
const handleAsyncOperation = async (operation: () => Promise<void>) => {
  try {
    setIsLoading(true);
    setError(null);
    await operation();
  } catch (error) {
    const errorMessage = error instanceof Error 
      ? error.message 
      : '予期しないエラーが発生しました';
    setError(errorMessage);
    console.error('Operation failed:', error);
  } finally {
    setIsLoading(false);
  }
};
```

## テスト戦略

### テストレベル

#### 1. ユニットテスト
- **対象**: 個別関数、カスタムフック
- **ツール**: Jest, React Testing Library
- **カバレッジ**: 90%以上

#### 2. コンポーネントテスト
- **対象**: 個別コンポーネントの動作
- **テスト内容**: レンダリング、イベント処理、状態変更

#### 3. 統合テスト
- **対象**: コンポーネント間の連携
- **テスト内容**: データフロー、状態同期

#### 4. E2Eテスト
- **対象**: ユーザーシナリオ全体
- **ツール**: Playwright または Cypress

### テストケース例

```typescript
// UserCard コンポーネントのテスト例
describe('UserCard', () => {
  it('ユーザー情報を正しく表示する', () => {
    // テスト実装
  });
  
  it('編集ボタンクリックで編集モードになる', () => {
    // テスト実装
  });
  
  it('削除ボタンクリックで確認ダイアログが表示される', () => {
    // テスト実装
  });
});
```

## パフォーマンス最適化

### 最適化戦略

#### 1. レンダリング最適化
- **React.memo**: 不要な再レンダリング防止
- **useCallback**: 関数の再生成防止
- **useMemo**: 計算結果のメモ化

#### 2. バンドルサイズ最適化
- **Tree Shaking**: 未使用コードの除去
- **Code Splitting**: 必要に応じた動的読み込み
- **依存関係の最小化**: 軽量ライブラリの選択

#### 3. ユーザー体験最適化
- **ローディング状態**: 適切なローディングインジケーター
- **楽観的更新**: UI の即座な反映
- **エラー回復**: 自動リトライ機能

### パフォーマンス指標

- **初回読み込み時間**: < 2秒
- **操作レスポンス時間**: < 100ms
- **バンドルサイズ**: < 500KB (gzip圧縮後)

## セキュリティ考慮事項

### クライアントサイドセキュリティ

#### 1. XSS対策
- **入力サニタイゼーション**: ユーザー入力の適切なエスケープ
- **Content Security Policy**: 適切なCSPヘッダー設定

#### 2. データ保護
- **LocalStorage**: 機密情報の保存回避
- **入力バリデーション**: クライアント・サーバー両側での検証

#### 3. 依存関係セキュリティ
- **脆弱性スキャン**: npm audit の定期実行
- **依存関係更新**: セキュリティパッチの適用

## アクセシビリティ

### WCAG 2.1 準拠

#### レベルAA対応
- **キーボードナビゲーション**: 全機能のキーボード操作対応
- **スクリーンリーダー**: 適切なARIAラベル設定
- **色彩コントラスト**: 4.5:1以上のコントラスト比

#### 実装例
```typescript
// アクセシブルなボタンコンポーネント
<button
  aria-label={`${user.name}を削除`}
  onClick={handleDelete}
  className={styles.deleteButton}
>
  削除
</button>
```

## 国際化対応

### 多言語サポート設計

#### 1. テキスト外部化
- **メッセージファイル**: JSON形式での管理
- **動的読み込み**: 言語切り替え対応

#### 2. 日付・数値フォーマット
- **Intl API**: ブラウザ標準APIの活用
- **ロケール対応**: 地域固有の表示形式

## デプロイメント戦略

### ビルドプロセス

#### 1. 開発環境
```bash
npm run dev    # 開発サーバー起動
npm run test   # テスト実行
npm run lint   # コード品質チェック
```

#### 2. 本番環境
```bash
npm run build  # 本番用ビルド
npm run preview # ビルド結果プレビュー
```

### デプロイメント先

#### 静的ホスティング
- **Vercel**: 自動デプロイ、プレビュー機能
- **Netlify**: フォーム処理、CDN最適化
- **GitHub Pages**: 無料ホスティング

#### 設定例（Vercel）
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install"
}
```

## 監視とメンテナンス

### エラー監視
- **クライアントエラー**: ブラウザコンソールログ
- **パフォーマンス**: Web Vitals指標
- **ユーザー行動**: 基本的な使用統計

### メンテナンス計画
- **依存関係更新**: 月次での更新確認
- **セキュリティパッチ**: 即座の適用
- **機能追加**: ユーザーフィードバックに基づく改善

## 拡張性設計

### 将来の機能拡張

#### 1. バックエンド連携
- **REST API**: サーバーサイドデータ管理
- **認証機能**: ユーザーログイン・権限管理
- **リアルタイム更新**: WebSocket対応

#### 2. 高度な機能
- **データエクスポート**: CSV、JSON形式
- **一括操作**: 複数ユーザーの同時処理
- **検索機能強化**: 高度なフィルタリング

#### 3. UI/UX改善
- **ダークモード**: テーマ切り替え機能
- **カスタマイズ**: ユーザー設定保存
- **アニメーション**: スムーズな画面遷移