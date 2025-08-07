# 簡単なWebアプリケーション

Claude Codeを使ってReact + TypeScriptで作る、ユーザー管理機能付きのシンプルなWebアプリケーションです。

## 📋 プロジェクト概要

### 🎯 機能
- ✅ ユーザー一覧表示
- ✅ ユーザー追加・編集・削除（CRUD操作）
- ✅ リアルタイム検索・フィルタリング
- ✅ ローカルストレージでのデータ永続化
- ✅ レスポンシブデザイン（モバイル・タブレット・デスクトップ対応）
- ✅ ダークモード対応
- ✅ アクセシビリティ対応（WCAG 2.1 AA準拠）
- ✅ エラーハンドリングとローディング状態
- ✅ パフォーマンス最適化

### 🛠️ 技術スタック
- **フロントエンド**: React 18 + TypeScript 5.2+
- **ビルドツール**: Vite 5.0+
- **スタイリング**: CSS Modules + CSS Variables
- **状態管理**: React Hooks（useState, useEffect, useCallback, useMemo）
- **データ永続化**: Browser LocalStorage API
- **開発ツール**: ESLint, Prettier, TypeScript Compiler

### 🎓 学習目標
- Claude Codeでの効率的なReact開発
- TypeScriptの実践的な使用方法
- モダンなコンポーネント設計パターン
- カスタムフックによる状態管理
- アクセシビリティとパフォーマンスのベストプラクティス

## 🖼️ 完成イメージ

```
┌─────────────────────────────────────────────────────────┐
│ ユーザー管理システム                                      │
│ Claude Codeで作成したシンプルなWebアプリケーション          │
├─────────────────────────────────────────────────────────┤
│ 新しいユーザーを追加                                      │
│ ┌─────────────────┐ ┌─────────────────┐ ┌──────┐        │
│ │ ユーザー名       │ │ メールアドレス   │ │ 追加 │        │
│ └─────────────────┘ └─────────────────┘ └──────┘        │
├─────────────────────────────────────────────────────────┤
│ 統計情報: 👥 3 ユーザー                                   │
├─────────────────────────────────────────────────────────┤
│ ユーザー検索                                              │
│ 🔍 ┌─────────────────────────────────┐ 3 件 / 全 3 件    │
│    │ ユーザー名またはメールアドレス... │                   │
│    └─────────────────────────────────┘                   │
├─────────────────────────────────────────────────────────┤
│ ユーザー一覧                                              │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ John Doe                                  ✏️ 🗑️    │ │
│ │ john@example.com                                    │ │
│ │ 作成: 2時間前                                        │ │
│ └─────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Jane Smith                                ✏️ 🗑️    │ │
│ │ jane@example.com                                    │ │
│ │ 作成: 1日前                                          │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

## 🚀 クイックスタート

### 前提条件
- Node.js 16.x以降（18.x推奨）
- npm または yarn
- モダンなWebブラウザ（Chrome, Firefox, Safari, Edge）

### インストールと起動

```bash
# プロジェクトディレクトリに移動
cd docs/08-examples/simple-webapp

# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# ブラウザで http://localhost:3000 を開く
```

### ビルドとプレビュー

```bash
# プロダクション用ビルド
npm run build

# ビルド結果のプレビュー
npm run preview
```

## 📁 プロジェクト構造

```
src/
├── components/                 # Reactコンポーネント
│   ├── ErrorBoundary/         # エラーバウンダリ
│   ├── LoadingSpinner/        # ローディング表示
│   ├── SearchBar/             # 検索バー
│   ├── UserCard/              # ユーザーカード
│   ├── UserForm/              # ユーザーフォーム
│   ├── UserList/              # ユーザーリスト
│   ├── UserStats/             # 統計情報
│   └── UserManagementApp/     # メインアプリ
├── hooks/                     # カスタムフック
│   ├── useAccessibility.ts    # アクセシビリティ
│   ├── useLocalStorage.ts     # LocalStorage操作
│   ├── usePerformance.ts      # パフォーマンス最適化
│   └── useUsers.ts            # ユーザー管理
├── types/                     # TypeScript型定義
│   └── user.ts                # ユーザー関連の型
├── utils/                     # ユーティリティ関数
│   ├── accessibility.ts       # アクセシビリティ支援
│   ├── performance.ts         # パフォーマンス最適化
│   ├── storage.ts             # データ操作
│   └── validation.ts          # バリデーション
├── styles/                    # グローバルスタイル
│   └── globals.css            # ユーティリティクラス
├── App.tsx                    # アプリケーションルート
├── App.css                    # アプリケーションスタイル
├── index.css                  # グローバルスタイル・CSS変数
└── main.tsx                   # エントリーポイント
```

## 🎨 Claude Codeでの開発手順

### ステップ1: プロジェクト基盤の構築

**プロンプト:**
```
React + TypeScript + Viteでユーザー管理アプリを作成します。
以下の基盤を構築してください：

1. TypeScript型定義（User, CreateUserInput, UpdateUserInput等）
2. プロジェクト設定（tsconfig.json, eslint, prettier）
3. 基本的なディレクトリ構造

要件：
- 厳密な型安全性
- モダンなReact開発環境
- 保守性の高いコード構造
```

### ステップ2: データ管理層の実装

**プロンプト:**
```
ユーザーデータの管理機能を実装してください：

1. LocalStorage操作ユーティリティ
2. データバリデーション関数
3. useLocalStorageカスタムフック
4. useUsersカスタムフック（CRUD操作）

要件：
- エラーハンドリング
- 型安全性
- パフォーマンス最適化
- データ永続化
```

### ステップ3: UIコンポーネントの作成

**プロンプト:**
```
以下のUIコンポーネントを作成してください：

1. UserForm - ユーザー追加フォーム
   - リアルタイムバリデーション
   - アクセシビリティ対応
   - エラー表示

2. UserCard - ユーザー情報カード
   - インライン編集機能
   - 削除確認ダイアログ
   - 検索ハイライト

3. SearchBar - 検索機能
   - リアルタイム検索
   - 統計情報表示
   - キーボードショートカット

各コンポーネントにCSS Modulesでスタイリングを適用してください。
```

### ステップ4: 高度な機能の実装

**プロンプト:**
```
以下の高度な機能を実装してください：

1. エラーバウンダリ - アプリケーション全体のエラーキャッチ
2. ローディングスピナー - 非同期処理の状態表示
3. アクセシビリティ機能 - WCAG準拠の支援機能
4. パフォーマンス最適化 - メモ化、デバウンス等

要件：
- ユーザビリティの向上
- 堅牢性の確保
- パフォーマンスの最適化
```

### ステップ5: 統合とテスト

**プロンプト:**
```
全コンポーネントを統合してメインアプリケーションを完成させてください：

1. UserManagementApp - メインコンポーネント
2. エラーハンドリングの統合
3. レスポンシブデザインの実装
4. ダークモード対応

最終的な動作確認とブラウザテストも含めてください。
```

## 🔧 主要機能の詳細

### ユーザー管理（CRUD操作）

```typescript
// ユーザーの追加
const handleAddUser = async (userData: CreateUserInput) => {
  const result = await addUser(userData);
  if (result.success) {
    // 成功処理
  }
};

// ユーザーの更新
const handleUpdateUser = async (id: string, userData: UpdateUserInput) => {
  const result = await updateUser(id, userData);
  // 結果処理
};

// ユーザーの削除
const handleDeleteUser = async (id: string) => {
  const confirmed = window.confirm('削除しますか？');
  if (confirmed) {
    await deleteUser(id);
  }
};
```

### リアルタイム検索

```typescript
// 検索クエリの状態管理
const [searchQuery, setSearchQuery] = useState('');

// デバウンス処理による最適化
const debouncedQuery = useDebounce(searchQuery, 300);

// フィルタリングされたユーザーリスト
const filteredUsers = useMemo(() => {
  return filterUsers(users, debouncedQuery);
}, [users, debouncedQuery]);
```

### アクセシビリティ対応

```typescript
// キーボードナビゲーション
const handleKeyDown = (event: KeyboardEvent) => {
  switch (event.key) {
    case 'Enter':
      handleSubmit();
      break;
    case 'Escape':
      handleCancel();
      break;
  }
};

// スクリーンリーダー対応
<button
  aria-label={`${user.name}を削除`}
  onClick={handleDelete}
>
  削除
</button>
```

## 🎯 学習ポイント

### 1. TypeScriptの活用
- 厳密な型定義による開発効率向上
- インターフェースとユニオン型の実践的使用
- ジェネリクスを使った再利用可能なコード

### 2. Reactのモダンパターン
- 関数コンポーネント + Hooks
- カスタムフックによるロジック分離
- メモ化によるパフォーマンス最適化

### 3. アクセシビリティ
- WCAG 2.1準拠の実装
- キーボードナビゲーション
- スクリーンリーダー対応

### 4. パフォーマンス最適化
- React.memo, useCallback, useMemo
- デバウンス・スロットル処理
- 仮想化とレイジーローディング

## 🚀 機能拡張のアイデア

### 基本拡張
- [ ] ユーザーアバター画像の追加
- [ ] ソート機能（名前、作成日時、更新日時）
- [ ] ページネーション
- [ ] データのエクスポート機能（CSV, JSON）
- [ ] 一括操作（複数選択・削除）

### 中級拡張
- [ ] バックエンドAPIとの連携
- [ ] 認証機能の追加
- [ ] ユーザーロール・権限管理
- [ ] 履歴・監査ログ機能
- [ ] 高度な検索・フィルタリング

### 上級拡張
- [ ] リアルタイム更新（WebSocket）
- [ ] オフライン対応（Service Worker）
- [ ] PWA化（Progressive Web App）
- [ ] 国際化対応（i18n）
- [ ] テーマカスタマイズ機能

## 🐛 トラブルシューティング

### よくある問題と解決方法

#### 1. TypeScriptエラー
```
Property 'id' does not exist on type 'User'
```
**解決方法**: 
- `src/types/user.ts`の型定義を確認
- インポート文が正しいかチェック
- TypeScriptコンパイラの再起動

#### 2. LocalStorageエラー
```
Cannot read property 'getItem' of undefined
```
**解決方法**:
```typescript
// ブラウザ環境チェック
if (typeof Storage !== 'undefined') {
  localStorage.setItem(key, value);
}
```

#### 3. CSS Modulesが適用されない
**解決方法**:
- ファイル名が `.module.css` になっているか確認
- インポート方法: `import styles from './Component.module.css'`
- クラス名の使用: `className={styles.className}`

#### 4. パフォーマンス問題
**解決方法**:
- React DevTools Profilerで分析
- 不要な再レンダリングをuseCallback/useMemoで最適化
- 大量データの場合は仮想化を検討

### デバッグのヒント

```typescript
// 開発環境でのデバッグ情報表示
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', { users, searchQuery, stats });
}

// パフォーマンス測定
const start = performance.now();
// 処理
const end = performance.now();
console.log(`処理時間: ${end - start}ms`);
```

## 📦 デプロイメント

### Vercelでのデプロイ

```bash
# Vercel CLIのインストール
npm i -g vercel

# プロジェクトのビルド
npm run build

# Vercelにデプロイ
vercel --prod
```

### Netlifyでのデプロイ

```bash
# ビルド
npm run build

# Netlify CLIでデプロイ
npx netlify deploy --prod --dir=dist
```

### GitHub Pagesでのデプロイ

```bash
# gh-pagesパッケージのインストール
npm install --save-dev gh-pages

# package.jsonにスクリプト追加
"scripts": {
  "deploy": "gh-pages -d dist"
}

# デプロイ実行
npm run build
npm run deploy
```

## 📚 学習リソース

### 公式ドキュメント
- [React公式ドキュメント](https://react.dev/) - React 18の最新機能
- [TypeScript公式ドキュメント](https://www.typescriptlang.org/) - 型システムの詳細
- [Vite公式ドキュメント](https://vitejs.dev/) - 高速ビルドツール

### 追加学習
- [React Hooks完全ガイド](https://react.dev/reference/react) - フックの詳細
- [CSS Modules入門](https://github.com/css-modules/css-modules) - スタイリング手法
- [Web Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/) - アクセシビリティ

### コミュニティ
- [React Community](https://reactcommunity.org/) - Reactコミュニティ
- [TypeScript Community](https://www.typescriptlang.org/community/) - TypeScriptコミュニティ

## 🤝 コントリビューション

このサンプルプロジェクトの改善にご協力ください：

1. 問題を発見した場合はIssueを作成
2. 機能追加や改善のPull Requestを歓迎
3. ドキュメントの改善提案
4. 学習体験の向上提案

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

---

**🎉 完成おめでとうございます！**

このサンプルを通じて、Claude Codeを使った効率的なReact開発の基礎を学習できました。次は[REST API開発](../api-development/README.md)でバックエンド開発にチャレンジしてみましょう。

**関連ドキュメント:**
- [Claude Code基本概念](../../01-basic-concepts.md) - 基礎理解
- [機能概要](../../02-features/README.md) - 全機能の詳細
- [テスト基礎](../../05-testing-basics.md) - テスト手法