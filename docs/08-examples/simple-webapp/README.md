# 簡単なWebアプリケーション

Claude Codeを使ってReact + TypeScriptで作る、ユーザー管理機能付きのシンプルなWebアプリケーションです。

## プロジェクト概要

### 機能
- ユーザー一覧表示
- ユーザー追加・編集・削除
- 検索・フィルタリング
- ローカルストレージでのデータ永続化
- レスポンシブデザイン

### 技術スタック
- **フロントエンド**: React 18 + TypeScript
- **ビルドツール**: Vite
- **スタイリング**: CSS Modules
- **状態管理**: React Hooks
- **データ永続化**: LocalStorage

### 学習目標
- Claude Codeでの基本的なReact開発
- TypeScriptの実践的な使用
- コンポーネント設計の基礎
- 状態管理の実装

## 完成イメージ

```
┌─────────────────────────────────────┐
│ User Management App                 │
├─────────────────────────────────────┤
│ [Search: ________] [Add User]       │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ John Doe                        │ │
│ │ john@example.com                │ │
│ │ [Edit] [Delete]                 │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ Jane Smith                      │ │
│ │ jane@example.com                │ │
│ │ [Edit] [Delete]                 │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

## セットアップ手順

### 前提条件
- Node.js 16.x以降
- npm または yarn
- Claude Code環境

### 1. プロジェクト作成
```bash
npm create vite@latest user-management-app -- --template react-ts
cd user-management-app
npm install
```

### 2. 追加パッケージのインストール
```bash
npm install uuid
npm install -D @types/uuid
```

### 3. 開発サーバー起動
```bash
npm run dev
```

## Claude Codeでの開発手順

### ステップ1: 型定義の作成

**プロンプト:**
```
React TypeScriptでユーザー管理アプリを作成します。
まず、以下の型定義を作成してください：

- User: ユーザーの基本情報（id, name, email, createdAt）
- CreateUserInput: ユーザー作成時の入力データ
- UpdateUserInput: ユーザー更新時の入力データ

src/types/user.tsファイルに作成してください。
```

### ステップ2: ユーティリティ関数の作成

**プロンプト:**
```
ユーザー管理アプリ用のユーティリティ関数を作成してください：

機能:
- ローカルストレージへの保存・読み込み
- 一意IDの生成
- ユーザーデータの検索・フィルタリング

src/utils/userUtils.tsファイルに作成してください。
```

### ステップ3: カスタムフックの作成

**プロンプト:**
```
ユーザー管理の状態とロジックを管理するカスタムフック
useUsersを作成してください：

機能:
- ユーザー一覧の管理
- ユーザーの追加・更新・削除
- 検索機能
- ローカルストレージとの同期

src/hooks/useUsers.tsファイルに作成してください。
```

### ステップ4: コンポーネントの作成

**プロンプト:**
```
以下のコンポーネントを作成してください：

1. UserCard: 個別ユーザー情報の表示
   - ユーザー情報の表示
   - 編集・削除ボタン
   - CSS Modulesでスタイリング

2. UserForm: ユーザー追加・編集フォーム
   - バリデーション機能
   - 送信処理
   - キャンセル機能

3. SearchBar: 検索機能
   - リアルタイム検索
   - 検索結果のハイライト

各コンポーネントをsrc/components/ディレクトリに作成してください。
```

### ステップ5: メインアプリケーションの統合

**プロンプト:**
```
これまで作成したコンポーネントを統合して、
メインのAppコンポーネントを作成してください：

機能:
- 全コンポーネントの統合
- レスポンシブレイアウト
- エラーハンドリング
- ローディング状態の管理

src/App.tsxを更新してください。
```

## 主要ファイル構成

```
src/
├── components/
│   ├── UserCard/
│   │   ├── UserCard.tsx
│   │   └── UserCard.module.css
│   ├── UserForm/
│   │   ├── UserForm.tsx
│   │   └── UserForm.module.css
│   └── SearchBar/
│       ├── SearchBar.tsx
│       └── SearchBar.module.css
├── hooks/
│   └── useUsers.ts
├── types/
│   └── user.ts
├── utils/
│   └── userUtils.ts
├── App.tsx
├── App.css
└── main.tsx
```

## 機能拡張のアイデア

### 基本拡張
- ユーザーアバター画像の追加
- ソート機能（名前、作成日時）
- ページネーション
- データのエクスポート機能

### 中級拡張
- バックエンドAPIとの連携
- 認証機能の追加
- ユーザーロール管理
- 一括操作機能

### 上級拡張
- リアルタイム更新
- オフライン対応
- PWA化
- 国際化対応

## トラブルシューティング

### よくある問題

#### 1. TypeScriptエラー
```
Property 'id' does not exist on type 'User'
```
**解決方法**: 型定義を確認し、必要なプロパティが定義されているか確認

#### 2. ローカルストレージエラー
```
Cannot read property 'getItem' of undefined
```
**解決方法**: ブラウザ環境でのみ実行されるようにチェックを追加

#### 3. スタイリングが適用されない
**解決方法**: CSS Modulesの命名規約を確認し、正しくインポートされているか確認

## デプロイ

### Vercelでのデプロイ
```bash
npm run build
npx vercel --prod
```

### Netlifyでのデプロイ
```bash
npm run build
# dist/フォルダをNetlifyにドラッグ&ドロップ
```

## 学習リソース

- [React公式ドキュメント](https://react.dev/)
- [TypeScript公式ドキュメント](https://www.typescriptlang.org/)
- [Vite公式ドキュメント](https://vitejs.dev/)

---

**次のステップ**: [REST API開発](../api-development/README.md)でバックエンド開発を学習しましょう。