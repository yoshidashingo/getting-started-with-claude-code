# CLAUDE.md

このファイルは、Claude Code (claude.ai/code) がこのリポジトリで作業する際のガイダンスを提供します。

## プロジェクト概要

Claude Code初心者向けの日本語学習リソースです。包括的なドキュメント、チュートリアル、エコシステム活用ガイド、スペック駆動開発手法、そしてReact・TypeScriptとモダンウェブ技術で構築された実践的なサンプルアプリケーション（simple-webapp）が含まれています。

## リポジトリ構造

- `/docs/` - 以下をカバーする包括的な日本語ドキュメント：
  - 基本概念と入門ガイド（01-basic-concepts.md）
  - 機能説明とチュートリアル（02-features/）
  - セットアップとクイックチュートリアル（03-getting-started.md、04-quick-tutorial.md）
  - テスト基礎（05-testing-basics.md）
  - 開発プロセス（06-development-process/）
  - チーム開発（07-team-development/）
  - サンプルとテンプレート（08-examples/）
  - トラブルシューティングと上級トピック（09-troubleshooting.md、10-advanced-topics.md）
  - IDE統合と設定（11-ide-integration.md、12-configuration.md）
  - **エコシステム（13-ecosystem/）** - MCP、Skills、Hooks、Subagents、Plugins
  - **スペック駆動開発（14-spec-driven/）** - .kiroシステムと要件駆動開発
- `/docs/08-examples/simple-webapp/` - 完全なReact + TypeScriptサンプルアプリケーション
- `/tools/` - 品質保証とフィードバックツール
- `/.kiro/` - スペック駆動開発の仕様とステアリングルール
  - `/specs/` - プロジェクト仕様（requirements.md、design.md、tasks.md）
  - `/steering/` - AI指導ルール（product.md、structure.md、tech.md）

## ドキュメント構成の原則

### 学習パス設計
このリポジトリは、初心者から上級者まで段階的に学習できるよう設計されています：

1. **導入パス（初心者）**: 基本概念 → セットアップ → チュートリアル
2. **機能学習パス（初心者～中級者）**: 全機能の体系的な理解
3. **実践開発パス（中級者）**: テスト、開発プロセス、自動化
4. **エコシステム活用パス（中級者～上級者）**: MCP、Skills、Hooks、Subagents、Plugins
5. **スペック駆動開発パス（中級者～上級者）**: .kiroシステムによる要件駆動開発
6. **チーム開発パス（中級者～上級者）**: チーム環境構築、共有、統合

### 目標レベル
- **初心者レベル**: Claude Codeの基本操作と簡単なアプリ開発
- **中級者レベル**: エコシステム活用、テスト駆動開発、**開発現場即戦力**
- **上級者レベル**: カスタム拡張開発、スペック駆動開発、チームリーダーシップ

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

### ドキュメント作成
- **日本語で記述**: すべてのドキュメントは日本語で作成
- **Markdownフォーマット**: GitHub-flavored Markdown使用
- **実践的な例**: 具体的なコード例とプロンプト例を含める
- **段階的な説明**: 初心者にも理解できるステップバイステップの説明
- **タグ付け**: 各ドキュメント末尾に関連タグを追加（`#初心者` `#中級者` など）
- **相互リンク**: 関連ドキュメントへのリンクを含める

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

## エコシステムとスペック駆動開発

### エコシステム（13-ecosystem/）
このリポジトリには、Claude Codeのエコシステムに関する包括的なドキュメントが含まれています：

- **MCP（Model Context Protocol）**: 外部ツール統合の標準
- **Skills**: 自律的に起動する再利用可能な能力
- **Hooks**: ワークフロー自動化のイベントハンドラー
- **Subagents**: 専門化されたタスク委譲AIアシスタント
- **Plugins**: 複数機能のバンドルと配布

### スペック駆動開発（14-spec-driven/）
.kiroシステムによる要件駆動開発：

- **steering/**: AI指導ルール（product.md、structure.md、tech.md）
- **specs/**: プロジェクト仕様（requirements.md、design.md、tasks.md）
- **ワークフロー**: Requirements → Design → Tasks → 実装
- **トレーサビリティ**: 要件から実装まで追跡可能

このリポジトリ自体が.kiroシステムで管理されているため、実例として参照できます。

## ファイルパターン

**ドキュメント:**
- Markdownファイル（`.md`）
- 番号プレフィックス（`01-`, `02-`など）
- kebab-case命名規則
- 各セクションにREADME.md

**コンポーネント（simple-webapp）:** 各コンポーネントは独自のディレクトリを持ち：
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

### ドキュメント変更時
1. リンク切れチェック
2. タグの一貫性確認
3. 目次・索引の更新

### サンプルアプリ変更時
1. 型チェック実行: `npm run type-check`
2. リント実行: `npm run lint`
3. テスト実行: `npm run test`
4. E2Eテスト実行: `npm run test:e2e`

## 重要な注意事項

- **網羅性重視**: このリポジトリは初心者が中級者として開発現場に入れるレベルを目指しています
- **最新情報**: MCP、Skills、Hooks、Subagents、Pluginsなど2024-2025年の最新機能を完全カバー
- **実践重視**: すべてのドキュメントに実行可能な例とプロンプトを含める
- **段階的学習**: 初心者→中級者→上級者への明確な学習パスを提供

サンプルアプリは包括的なテストと型安全性による高いコード品質基準を維持しています。

## 言語

日本語で応答してください。
