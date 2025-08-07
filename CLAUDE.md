# CLAUDE.md

このファイルは、Claude Code (claude.ai/code) がこのリポジトリで作業する際のガイダンスを提供します。

## プロジェクト概要

Claude Code初心者向けの日本語学習リソースです。包括的なドキュメント、チュートリアル、React・TypeScriptとモダンウェブ技術で構築された実践的なサンプルアプリケーション（simple-webapp）が含まれています。

## リポジトリ構造

- `/docs/` - 以下をカバーする包括的な日本語ドキュメント：
  - 基本概念と入門ガイド
  - 機能説明とチュートリアル
  - 開発プロセスとチームワークフロー
  - 実践例とトラブルシューティング
- `/docs/08-examples/simple-webapp/` - 完全なReact + TypeScriptサンプルアプリケーション
- `/tools/` - 品質保証とフィードバックツール

## 主要な開発コマンド

### シンプルWebアプリサンプル用 (`docs/08-examples/simple-webapp/`)

まずWebアプリディレクトリに移動：
```bash
cd docs/08-examples/simple-webapp
```

**開発:**
```bash
npm install          # 依存関係のインストール
npm run dev         # 開発サーバー起動 (ポート3000)
npm run build       # プロダクション用ビルド
npm run preview     # プロダクションビルドのプレビュー
```

**コード品質:**
```bash
npm run lint        # ESLint実行
npm run lint:fix    # ESLintの問題を自動修正
npm run type-check  # TypeScriptコンパイラチェック
npm run format      # Prettierでコード整形
npm run format:check # コード整形チェック
```

**テスト:**
```bash
npm run test        # Vitestでユニットテスト実行
npm run test:ui     # UI付きテスト実行
npm run test:coverage # カバレッジレポート生成
npm run test:e2e    # PlaywrightでE2Eテスト実行
```

**解析・パフォーマンス:**
```bash
npm run analyze     # バンドル解析
npm run lighthouse  # パフォーマンス監査
```

**デプロイ:**
```bash
npm run deploy:vercel  # Vercelにデプロイ
npm run deploy:netlify # Netlifyにデプロイ
```

## アーキテクチャ概要

### シンプルWebアプリ (`docs/08-examples/simple-webapp/`)

**技術スタック:**
- React 18 + TypeScript 5.2+
- Viteビルドツール
- CSS Modulesスタイリング
- Vitestユニットテスト
- Playwright E2Eテスト

**主要なアーキテクチャパターン:**
- **コンポーネント構造**: CSS Modulesを使ったモジュラーコンポーネント
- **カスタムフック**: `useUsers`, `useLocalStorage`を使ったビジネスロジック分離
- **型安全性**: `/src/types/`内の包括的なTypeScriptインターフェース
- **データレイヤー**: `/src/utils/`のユーティリティによるLocalStorage永続化
- **エラーハンドリング**: 一元化されたエラーバウンダリとバリデーション

**コアコンポーネント:**
- `UserManagementApp` - メインアプリケーションコンポーネント
- `UserForm` - バリデーション付きフォーム処理
- `UserCard` - インライン編集機能付き個別ユーザー表示
- `SearchBar` - リアルタイム検索機能
- `ErrorBoundary` - アプリケーション全体のエラーキャッチ

**データフロー:**
1. `useUsers`フックがすべてのユーザーCRUD操作を管理
2. `useLocalStorage`が永続ストレージを提供
3. `utils/validation.ts`によるデータバリデーション
4. `utils/storage.ts`によるストレージ操作

## 重要な開発ガイドライン

### TypeScript使用法
- 厳密型付けが有効 - すべてのコンポーネントとユーティリティが完全に型付け
- `/src/types/user.ts`でカスタムインターフェース定義
- 型付きcatchブロックによる適切なエラーハンドリング

### Reactパターン
- フックを使った関数コンポーネント
- ビジネスロジック用カスタムフック（`useUsers`, `useLocalStorage`）
- `useMemo`, `useCallback`による適切なメモ化
- フォルトトレラントなエラーバウンダリ

### テスト戦略
- Vitestユニットテスト（80%カバレッジ閾値）
- Playwright E2Eテスト
- jsdom環境でのコンポーネントテスト
- CI/CD用カバレッジレポート設定

### アクセシビリティ・パフォーマンス
- WCAG 2.1 AA準拠
- キーボードナビゲーション対応
- スクリーンリーダー互換性
- React.memoとフックによるパフォーマンス最適化
- Lighthouse統合パフォーマンス監視

## ファイルパターン

**コンポーネント:** 各コンポーネントは独自のディレクトリを持ち：
- `ComponentName.tsx` - メインコンポーネントファイル
- `ComponentName.module.css` - スコープ付きスタイル
- `ComponentName.test.tsx` - ユニットテスト（該当する場合）

**フック:** `/src/hooks/`に配置、包括的なTypeScriptインターフェース付き

**ユーティリティ:** `/src/utils/`の純粋関数、完全なテストカバレッジ付き

**型:** `/src/types/`に集約、明確なインターフェースとドキュメント付き

## テストコマンド

常にWebアプリディレクトリから実行 (`docs/08-examples/simple-webapp/`)：

```bash
# ユニットテスト
npm run test

# E2Eテスト（開発サーバー実行が必要）
npm run test:e2e

# カバレッジレポート
npm run test:coverage
```

注意: E2EテストはPlaywright設定により開発サーバーを自動起動します。

## 品質保証

サンプルアプリの変更をコミットする前に：

1. 型チェック実行: `npm run type-check`
2. リント実行: `npm run lint`
3. テスト実行: `npm run test`
4. E2Eテスト実行: `npm run test:e2e`

サンプルアプリは包括的なテストと型安全性による高いコード品質基準を維持しています。