# 技術スタック・ビルドシステム

## ドキュメント技術スタック

### 核となる技術
- **言語**: 日本語（主要）、英語の技術用語を併用
- **フォーマット**: Markdown（.mdファイル）
- **構造**: クロスリファレンス付き階層ドキュメント
- **バージョン管理**: 規約的コミットメッセージを使用したGit

### 開発ツール
- **Node.js**: 自動化スクリプトと品質チェック用
- **品質保証**: 
  - `markdown-link-check`によるリンクチェック
  - `markdownlint`によるMarkdownリント
  - `prismjs`、`acorn`、`typescript`によるコード検証
- **自動化**: CI/CD用GitHub Actions

### サンプルプロジェクト技術
- **フロントエンド**: React 18 + TypeScript、Viteビルドツール
- **スタイリング**: CSS Modules
- **テスト**: Jest、Vitest、Playwright
- **状態管理**: React Hooks
- **データ永続化**: LocalStorage（サンプル用）

## よく使用するコマンド

### 品質チェック
```bash
# 全品質チェック実行
cd tools/quality-check
npm install
npm run check:all

# 個別チェック
npm run check:links      # リンク検証
npm run check:markdown   # Markdown構文
npm run check:code       # コード例検証
npm run check:structure  # ドキュメント構造

# 開発用監視モード
npm run watch
```

### フィードバックシステム
```bash
# フィードバック収集・処理
cd tools/feedback-system
npm install
npm run collect-feedback
npm run process-feedback
npm run generate-changelog
```

### 開発ワークフロー
```bash
# 標準的な開発コマンド
git checkout -b feature/your-feature-name
# 変更を加える
git add .
git commit -m "docs: 新機能ドキュメントを追加"
git push origin feature/your-feature-name
```

## ビルド・デプロイ

### ローカル開発
- ドキュメントにビルドステップは不要
- Markdownエディタのライブプレビューを使用
- ファイル変更時に品質チェックが自動実行

### CI/CDパイプライン
- **トリガー**: docs/またはtools/ディレクトリへのプッシュ
- **チェック**: リンク検証、Markdownリント、コード検証
- **成果物**: GitHub Actionsに品質レポートをアップロード
- **通知**: チェック結果をPRコメントで通知

### リリースプロセス
1. セマンティックバージョニングによるバージョンアップ
2. Gitコミットからの変更履歴生成
3. リリースノート作成
4. Slack/Discordチャンネルへの通知

## コード規約

### コミットメッセージ
- `docs:` ドキュメント変更
- `feat:` 新機能
- `fix:` バグ修正
- `tools:` ツール更新

### ファイル命名
- ファイル名はkebab-caseを使用
- ファイル本文は日本語コンテンツ
- 内部リンクは相対パス
- ルート参照は`/`で始まる絶対パス

### コード例
- コードブロックには必ず言語を指定
- JavaScriptよりもTypeScriptを優先
- 実践例にはエラーハンドリングを含める
- コードブロックは可能な限り100行以下に抑える