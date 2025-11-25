# Claude Code エコシステム

Claude Codeは、強力な拡張機能とツール統合のエコシステムを提供しています。これらの機能を活用することで、開発ワークフローを大幅に改善し、生産性を向上させることができます。

## 📚 エコシステム概要

Claude Codeのエコシステムは、以下の主要コンポーネントで構成されています：

### 1. **MCP (Model Context Protocol)**
外部ツールやサービスとの統合を可能にするオープンソース標準です。

- **[MCP基礎](01-mcp-basics.md)** - MCPの基本概念と仕組み
- **[MCPサーバー活用](02-mcp-servers.md)** - 既存サーバーの利用方法
- **[カスタムMCPサーバー](03-mcp-custom.md)** - 独自サーバーの作成

**主な用途:**
- データベースへの自然言語クエリ
- 課題管理システム（JIRA、GitHub Issues）との連携
- モニタリング・分析ツール（Sentry、DataDog）の統合
- デザインツール（Figma）からのデータ取得

### 2. **Skills（スキル）**
Claudeが自律的に使用できる再利用可能な能力です。

- **[Skills基礎](04-skills-basics.md)** - Skillsの概念と使い方
- **[カスタムSkills作成](05-skills-custom.md)** - 独自Skillsの開発

**主な用途:**
- 複雑なワークフローの自動化
- プロジェクト固有の知識のカプセル化
- チーム全体での能力共有

### 3. **Hooks（フック）**
ワークフローの特定のポイントでカスタムロジックを実行します。

- **[Hooks基礎](06-hooks-basics.md)** - Hooksの種類と設定
- **[Hooks実践](07-hooks-practice.md)** - 実践的な使用例

**主な用途:**
- コード品質の自動チェック
- セキュリティスキャン
- 自動フォーマット
- デスクトップ通知

### 4. **Subagents（サブエージェント）**
専門化されたタスク委譲のためのAIアシスタントです。

- **[Subagents活用](08-subagents.md)** - サブエージェントの作成と利用

**主な用途:**
- コードレビューの自動化
- デバッグ支援
- データ分析タスク
- ドメイン固有の専門知識

### 5. **Plugins（プラグイン）**
複数の機能をバンドルして配布・共有できます。

- **[Plugins開発](09-plugins.md)** - プラグインシステムの活用

**主な用途:**
- チーム全体での設定共有
- オープンソースでの機能配布
- 複雑な統合のパッケージング

## 🎯 学習パス

### 初心者向け：既存ツールの活用
1. [MCP基礎](01-mcp-basics.md) - MCPの基本概念を理解
2. [MCPサーバー活用](02-mcp-servers.md) - GitHub、Sentryなどの既存サーバーを使用
3. [Skills基礎](04-skills-basics.md) - 既存Skillsの利用方法
4. [Hooks基礎](06-hooks-basics.md) - 基本的なフックの設定

### 中級者向け：カスタマイズと拡張
5. [Hooks実践](07-hooks-practice.md) - プロジェクト固有のフック作成
6. [Subagents活用](08-subagents.md) - 専門化されたエージェント設計
7. [カスタムSkills作成](05-skills-custom.md) - チーム固有のSkills開発

### 上級者向け：エコシステム構築
8. [カスタムMCPサーバー](03-mcp-custom.md) - 独自の統合開発
9. [Plugins開発](09-plugins.md) - 包括的なプラグイン作成

## 🔄 エコシステム活用の実践例

### 例1: フルスタック開発環境
```
MCP: PostgreSQLデータベース接続
Skills: APIエンドポイント生成スキル
Hooks: コミット前のTypeScriptチェック
Subagent: セキュリティレビュー専門エージェント
```

### 例2: データ分析ワークフロー
```
MCP: Jupyter Notebook統合
Skills: データクリーニングスキル
Hooks: 実行後の結果通知
Subagent: 統計分析専門エージェント
```

### 例3: チーム開発標準化
```
Plugin: 会社標準の設定バンドル
  ├── Commands: 標準スラッシュコマンド
  ├── Skills: コーディング規約スキル
  ├── Hooks: リント・フォーマット自動化
  └── MCP: 社内ツール統合
```

## 📊 機能比較表

| 機能 | 起動方法 | 用途 | 共有方法 |
|------|----------|------|----------|
| **MCP** | 自動（接続時） | 外部ツール統合 | `.mcp.json` |
| **Skills** | 自動（Claude判断） | 複雑なワークフロー | `.claude/skills/` |
| **Hooks** | イベント駆動 | ワークフロー自動化 | `settings.json` |
| **Subagents** | 手動または自動 | タスク委譲 | `.claude/agents/` |
| **Plugins** | インストール時 | 機能バンドル | マーケットプレイス |

## 🚀 クイックスタート

### すぐに試せる設定

**1. GitHub MCPサーバー追加（5分）**
```bash
claude mcp add --transport http github https://api.githubcopilot.com/mcp/
```

**2. 自動フォーマッタHook設定（10分）**
```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Write|Edit",
      "command": "npx prettier --write \"$file_path\""
    }]
  }
}
```

**3. コードレビューSubagent作成（15分）**
```bash
/agents
# "code-reviewer"を選択して新規作成
```

## 💡 ベストプラクティス

### エコシステム設計の原則

1. **段階的な導入**
   - まず既存ツールから始める
   - チームで効果を確認してから拡張
   - 必要に応じてカスタマイズ

2. **適切なツール選択**
   - 外部API統合 → MCP
   - 複雑なワークフロー → Skills
   - イベント処理 → Hooks
   - 専門タスク → Subagents
   - 統合パッケージ → Plugins

3. **セキュリティ重視**
   - サードパーティツールは慎重に評価
   - 環境変数で認証情報を管理
   - Hooksのコードレビューを徹底

4. **ドキュメント化**
   - 設定の意図を明記
   - チームメンバーへの共有方法を確立
   - トラブルシューティングガイドを作成

## 🔗 関連リソース

### 基本機能との連携
- **[スラッシュコマンド](../02-features/slash-commands.md)** - コマンドとSkillsの違い
- **[統合ツール](../02-features/integration-tools.md)** - 基本的なツール連携
- **[設定ファイル](../12-configuration.md)** - 詳細な設定方法

### 開発プロセスとの統合
- **[単体テスト](../06-development-process/06-unit-testing.md)** - HooksでのCI統合
- **[ビルド自動化](../06-development-process/09-build-automation.md)** - MCPとの連携
- **[チーム開発](../07-team-development/README.md)** - エコシステムの共有

### 上級トピック
- **[上級者向けトピック](../10-advanced-topics.md)** - 高度な活用テクニック
- **[IDE統合](../11-ide-integration.md)** - VS Codeでの活用

## 📖 次のステップ

エコシステムを理解したら：

1. **[MCP基礎](01-mcp-basics.md)** から始めて、外部ツール統合を学ぶ
2. **[Skills基礎](04-skills-basics.md)** で自動化の基礎を習得
3. **[Hooks基礎](06-hooks-basics.md)** でワークフロー最適化を実践

---

**タグ:** `#中級者` `#エコシステム` `#拡張機能` `#ツール統合`
