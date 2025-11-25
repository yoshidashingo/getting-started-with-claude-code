# Claude Code 初心者ガイド

Claude Codeを初めて使う開発者のための包括的な学習リソースです。基本概念から実践的な開発手法、エコシステム活用、スペック駆動開発まで、段階的に学習できるように設計されています。

## 🚀 Claude Codeとは

Claude CodeはAIを活用したコード生成・編集ツールです。自然言語での対話を通じて、効率的にソフトウェア開発を行うことができます。

### 主な特徴

- **自然言語でのコード生成**: 日本語で指示するだけで高品質なコードを生成
- **既存コードの理解と編集**: プロジェクト全体のコンテキストを理解した編集
- **多言語・多フレームワーク対応**: JavaScript、Python、React、Node.jsなど幅広く対応
- **デバッグサポート**: エラーの原因分析と修正提案
- **コードレビュー機能**: 自動的な品質チェックと改善提案
- **エコシステム統合**: MCP、Skills、Hooks、Subagents、Pluginsで拡張可能

## 🎯 クイックスタート

Claude Codeをすぐに試したい方は：

1. **[セットアップガイド](docs/03-getting-started.md)** でClaude Codeをインストール
2. **[簡単なアプリ作成チュートリアル](docs/04-quick-tutorial.md)** で実際に開発を体験
3. **[機能概要](docs/02-features/README.md)** で利用可能な機能を確認
4. **[エコシステム概要](docs/13-ecosystem/README.md)** で拡張機能を学ぶ

## 📖 目次

### 基本編（初心者向け）
Claude Codeの基礎から始めて、最初のアプリケーションを作成するまでの導入コンテンツです。

- **[基本概念](docs/01-basic-concepts.md)** - Claude Codeの基礎知識、用語、主要機能の理解
- **[セットアップガイド](docs/03-getting-started.md)** - システム要件、インストール手順、初期設定
- **[簡単なアプリ作成](docs/04-quick-tutorial.md)** - Todoアプリ作成による実践チュートリアル

### 機能編（初心者～中級者向け）
Claude Codeの全機能を体系的に学び、効果的な使い方をマスターします。

- **[機能概要](docs/02-features/README.md)** - 12機能の概要と学習優先度
- **[チャットインターフェース](docs/02-features/chat-interface.md)** - 対話的開発の基礎と効果的なプロンプト作成
- **[コード生成](docs/02-features/code-generation.md)** - 様々な言語・フレームワークでの自動生成
- **[ファイル編集](docs/02-features/file-editing.md)** - 既存コードの修正・リファクタリング
- **[プロジェクトコンテキスト](docs/02-features/project-context.md)** - 大規模プロジェクトの理解と管理
- **[デバッグサポート](docs/02-features/debugging-support.md)** - エラー解析と修正提案
- **[コードレビュー](docs/02-features/code-review.md)** - AI支援による品質向上
- **[外部ツール連携](docs/02-features/integration-tools.md)** - Git、テストツールとの統合
- **[スラッシュコマンド](docs/02-features/slash-commands.md)** - 効率的なコマンド活用
- **[セッション管理](docs/02-features/session-management.md)** - 作業セッションの効果的な管理
- **[メモリ管理](docs/02-features/memory-management.md)** - コンテキストとメモリの活用
- **[拡張思考](docs/02-features/extended-thinking.md)** - 複雑な問題への深い分析モード

### 実践編（中級者向け）
体系的な開発プロセスとテスト駆動開発を実践します。

- **[テスト基礎](docs/05-testing-basics.md)** - Playwright MCPでの自動テスト入門
- **[開発プロセス](docs/06-development-process/README.md)** - 体系的開発フロー全体像
  - [AIと要件定義](docs/06-development-process/01-requirements-with-ai.md) - AI支援による要件定義
  - [AIと設計](docs/06-development-process/02-design-with-ai.md) - AI活用設計プロセス
  - [設計原則管理](docs/06-development-process/03-design-principles.md) - CLAUDE.mdによる原則管理
  - [個人設計原則](docs/06-development-process/04-personal-guidelines.md) - 個人設計指針
  - [AIによる設計レビュー](docs/06-development-process/05-ai-design-review.md) - AI設計レビュー
  - [単体テスト](docs/06-development-process/06-unit-testing.md) - 単体テスト作成
  - [結合テスト](docs/06-development-process/07-integration-testing.md) - 結合テスト
  - [E2Eテスト](docs/06-development-process/08-e2e-testing.md) - E2Eテスト
  - [ビルド自動化](docs/06-development-process/09-build-automation.md) - CI/CD自動化

### エコシステム編（中級者～上級者向け）
MCP、Skills、Hooks、Subagents、Pluginsを活用してClaude Codeの可能性を最大限に引き出します。

- **[エコシステム概要](docs/13-ecosystem/README.md)** - Claude Codeエコシステム全体像と活用戦略
- **MCP（Model Context Protocol）** - 外部ツール・サービスとの統合
  - [MCP基礎](docs/13-ecosystem/01-mcp-basics.md) - MCPの基本概念、仕組み、セキュリティ
  - [MCPサーバー活用](docs/13-ecosystem/02-mcp-servers.md) - GitHub、Sentry、PostgreSQLなど既存サーバーの利用
  - [カスタムMCPサーバー](docs/13-ecosystem/03-mcp-custom.md) - TypeScript/JavaScriptでの独自サーバー作成
- **Skills（スキル）** - 自律的に起動する再利用可能な能力
  - [Skills基礎](docs/13-ecosystem/04-skills-basics.md) - Skillsの概念、スラッシュコマンドとの違い
  - [カスタムSkills作成](docs/13-ecosystem/05-skills-custom.md) - 独自Skillsの開発とチーム共有
- **Hooks（フック）** - ワークフロー自動化のイベントハンドラー
  - [Hooks基礎](docs/13-ecosystem/06-hooks-basics.md) - Hooksの種類、設定、セキュリティ
  - [Hooks実践](docs/13-ecosystem/07-hooks-practice.md) - 10以上の実践的なHook実装例
- **高度な機能**
  - [Subagents活用](docs/13-ecosystem/08-subagents.md) - 専門化されたタスク委譲AIアシスタント
  - [Plugins開発](docs/13-ecosystem/09-plugins.md) - 複数機能のバンドルと配布

### スペック駆動開発編（中級者～上級者向け）
ステアリングファイルと仕様管理による要件駆動開発で、体系的かつ追跡可能な開発を実現します。

- **[スペック駆動開発概要](docs/14-spec-driven/README.md)** - ステアリングファイルと仕様管理の理解
- **[ステアリングファイル基礎](docs/14-spec-driven/01-steering-basics.md)** - ディレクトリ構造、steering/specs/の役割
- **[要件仕様作成](docs/14-spec-driven/02-requirements-spec.md)** - User Story形式、Acceptance Criteria、requirements.mdの書き方
- **[設計仕様作成](docs/14-spec-driven/03-design-spec.md)** - アーキテクチャ、コンポーネント設計、design.mdの書き方
- **[タスク管理](docs/14-spec-driven/04-tasks-spec.md)** - チェックリスト形式、トレーサビリティ、tasks.mdの活用
- **[AIとの協働ワークフロー](docs/14-spec-driven/05-ai-workflow.md)** - 実践的な開発フローとプロンプト例

### チーム開発編（中級者～上級者向け）
チーム全体でClaude Codeを効果的に活用し、開発効率を最大化します。

- **[チーム開発概要](docs/07-team-development/README.md)** - チーム開発の全体像と戦略
- **[チーム環境構築](docs/07-team-development/01-team-setup.md)** - 開発環境の統一とセットアップ
- **[共有環境構築](docs/07-team-development/02-shared-environment.md)** - .claude/設定、MCP、環境変数の共有
- **[共有コンテキスト管理](docs/07-team-development/03-shared-context.md)** - チーム知識の共有システム
- **[GitHub統合](docs/07-team-development/04-github-integration.md)** - PR・Issue管理、GitHub Actions連携
- **[大規模開発テクニック](docs/07-team-development/05-large-scale-techniques.md)** - スケーラブルな開発手法

### サンプル・参考資料
実践的なプロジェクト例と問題解決のリソースです。

- **[コード例とサンプル](docs/08-examples/README.md)** - 実用的なプロジェクト例一覧
  - [簡単なWebアプリ](docs/08-examples/simple-webapp/README.md) - React + TypeScriptによる基本的なWebアプリケーション開発
  - [チーム開発テンプレート](docs/08-examples/team-project-template/README.md) - チーム開発用プロジェクトテンプレート
- **[トラブルシューティング](docs/09-troubleshooting.md)** - よくある問題と解決方法、FAQ
- **[上級者向けトピック](docs/10-advanced-topics.md)** - プロンプトエンジニアリング、最適化テクニック
- **[IDE統合](docs/11-ide-integration.md)** - VS Code、Cursor統合ガイド
- **[設定ファイル詳細](docs/12-configuration.md)** - 詳細な設定方法とカスタマイズ

### 検索・ナビゲーション
効率的な情報アクセスのためのツールです。

- **[完全目次](docs/TABLE_OF_CONTENTS.md)** - すべてのドキュメントの詳細目次と学習パス
- **[索引](docs/INDEX.md)** - キーワード別索引で素早く情報を検索
- **[タグシステム](docs/TAGS.md)** - 難易度・トピック別のタグ付けシステム

## 🎓 学習目標レベル

このドキュメントを学習することで、以下のレベルに到達できます：

### 初心者レベル（導入・機能学習パス完了後）
- Claude Codeの基本操作をマスター
- 簡単なアプリケーション開発が可能
- 基本的なプロンプト作成ができる

### 中級者レベル（実践開発・エコシステムパス完了後）
- 体系的な開発プロセスを実践できる
- MCP、Skills、Hooksを活用できる
- テスト駆動開発を実践できる
- **開発現場に即戦力として入れるレベル**

### 上級者レベル（スペック駆動・チーム開発パス完了後）
- カスタムMCPサーバー、Skills、Hooksを開発できる
- スペック駆動開発を実践できる
- チーム開発をリードできる
- 大規模プロジェクトを効率的に管理できる

## 🤝 貢献について

このドキュメントの改善にご協力いただける方は、[貢献ガイド](CONTRIBUTING.md)をご覧ください。

## 📝 ライセンス

このドキュメントはMITライセンスの下で公開されています。

---

**次のステップ**: [基本概念](docs/01-basic-concepts.md)を読んで、Claude Codeの基礎を理解しましょう。

**中級者の方は**: [エコシステム概要](docs/13-ecosystem/README.md)から始めて、Claude Codeの拡張機能を学びましょう。

**上級者の方は**: [スペック駆動開発](docs/14-spec-driven/README.md)でプロフェッショナルな開発手法を習得しましょう。
