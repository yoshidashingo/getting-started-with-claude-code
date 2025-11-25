# Plugins（プラグイン）開発

Pluginsは、Commands（スラッシュコマンド）、Agents（サブエージェント）、Skills（スキル）、Hooks（フック）、MCPサーバーなどの複数の機能をバンドルして、パッケージとして配布・共有できる強力な仕組みです。

## 目次

- [Pluginsとは](#pluginsとは)
- [プラグインの構成要素](#プラグインの構成要素)
- [プラグインマニフェスト](#プラグインマニフェスト)
- [ディレクトリ構造](#ディレクトリ構造)
- [プラグインの作成](#プラグインの作成)
- [プラグインのインストール](#プラグインのインストール)
- [プラグインの管理](#プラグインの管理)
- [開発のベストプラクティス](#開発のベストプラクティス)
- [プラグインの配布](#プラグインの配布)
- [実践例](#実践例)
- [トラブルシューティング](#トラブルシューティング)

## Pluginsとは

### 基本概念

Pluginsは、Claude Codeの機能を拡張するための統合パッケージシステムです。複数の関連機能を1つのパッケージにまとめて、簡単にインストール・共有できます。

```
┌─────────────────────────────────────────┐
│           Plugin Package                │
│  (team-dev-standards)                   │
├─────────────────────────────────────────┤
│                                         │
│  ┌────────────┐  ┌────────────┐       │
│  │ Commands   │  │  Agents    │       │
│  │ (スラッシュ) │  │(サブエージェント)│  │
│  └────────────┘  └────────────┘       │
│                                         │
│  ┌────────────┐  ┌────────────┐       │
│  │  Skills    │  │   Hooks    │       │
│  │ (スキル)    │  │  (フック)   │       │
│  └────────────┘  └────────────┘       │
│                                         │
│  ┌────────────┐                        │
│  │MCP Servers │                        │
│  │(統合サーバー)│                        │
│  └────────────┘                        │
│                                         │
└─────────────────────────────────────────┘
```

**主な特徴:**

- **機能のバンドル**: 複数の機能を1つのパッケージにまとめる
- **簡単な配布**: GitHubやマーケットプレイスで共有
- **チーム標準化**: チーム全体で統一された設定を使用
- **バージョン管理**: セマンティックバージョニングでリリース管理
- **依存関係解決**: 必要な依存関係を自動管理

### Pluginsが適している場面

#### 1. チーム開発標準化
```
Plugin: company-dev-standards
  ├── Commands: /review, /deploy, /test
  ├── Skills: code-quality-check
  ├── Hooks: auto-format, pre-commit-check
  └── MCP: JIRA統合、社内ツール連携
```

#### 2. フレームワーク固有ツール
```
Plugin: react-toolkit
  ├── Commands: /component, /hook, /test
  ├── Skills: component-generator
  ├── Hooks: prop-types-check
  └── Templates: コンポーネントテンプレート
```

#### 3. 業界特化機能
```
Plugin: fintech-compliance
  ├── Commands: /audit, /compliance-check
  ├── Skills: regulation-validator
  ├── Hooks: pii-scanner
  └── Documentation: コンプライアンスガイド
```

#### 4. 開発ワークフロー統合
```
Plugin: ci-cd-toolkit
  ├── Commands: /build, /deploy, /rollback
  ├── Skills: deployment-automation
  ├── Hooks: build-notification
  └── MCP: Jenkins、GitHub Actions統合
```

## プラグインの構成要素

Pluginは以下の5つのコンポーネントを組み合わせて構成できます。

### 1. Commands（スラッシュコマンド）

**概要**: `/`で始まるカスタムコマンド

**配置場所**: `.claude-plugin/commands/`

**例**:
```markdown
<!-- .claude-plugin/commands/review.md -->
---
name: review
description: コードレビューを実施
---

# コードレビュー実施

指定されたPull Requestまたはファイルに対して、
包括的なコードレビューを実施してください。

レビュー観点：
- コード品質
- セキュリティ
- パフォーマンス
- ベストプラクティス準拠
```

### 2. Agents（サブエージェント）

**概要**: 特定タスクに特化したAIアシスタント

**配置場所**: `.claude-plugin/agents/`

**例**:
```markdown
<!-- .claude-plugin/agents/security-auditor.md -->
---
name: security-auditor
displayName: Security Auditor
model: claude-sonnet-4-5-20250929
---

# セキュリティ監査エージェント

あなたはセキュリティの専門家です。
コードのセキュリティ脆弱性を検出し、
修正方法を提案してください。

重点項目：
- SQLインジェクション
- XSS脆弱性
- 認証・認可の不備
- 機密情報の露出
```

### 3. Skills（スキル）

**概要**: 複雑なワークフローを自動化

**配置場所**: `.claude-plugin/skills/`

**例**:
```markdown
<!-- .claude-plugin/skills/test-automation/SKILL.md -->
---
skillName: test-automation
displayName: Test Automation
description: 自動テスト実行とレポート生成
version: 1.0.0
---

# 自動テスト実行

## タスク

1. テスト実行
2. カバレッジレポート生成
3. 結果の分析と報告
```

### 4. Hooks（フック）

**概要**: イベント駆動の自動化スクリプト

**配置場所**: `plugin.json`内で定義

**例**:
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "command": "npx prettier --write \"$file_path\"",
        "description": "自動フォーマット"
      }
    ]
  }
}
```

### 5. MCP Servers（MCPサーバー）

**概要**: 外部ツールとの統合

**配置場所**: `plugin.json`内で定義

**例**:
```json
{
  "mcpServers": {
    "company-jira": {
      "transport": "http",
      "url": "https://jira.company.com/mcp",
      "config": {
        "apiToken": "${JIRA_API_TOKEN}"
      }
    }
  }
}
```

## プラグインマニフェスト

すべてのPluginには`plugin.json`マニフェストファイルが必要です。

### 基本構造

```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "description": "My awesome Claude Code plugin",
  "author": "Your Name",
  "license": "MIT",
  "homepage": "https://github.com/username/my-plugin",
  "repository": {
    "type": "git",
    "url": "https://github.com/username/my-plugin.git"
  }
}
```

### 必須フィールド

| フィールド | 型 | 説明 | 例 |
|----------|-----|------|-----|
| `name` | string | プラグイン名（kebab-case） | `"team-dev-tools"` |
| `version` | string | セマンティックバージョン | `"1.2.3"` |
| `description` | string | 簡潔な説明 | `"Team development toolkit"` |

### オプションフィールド

| フィールド | 型 | 説明 |
|----------|-----|------|
| `author` | string | 作成者名 |
| `license` | string | ライセンス（SPDX識別子） |
| `homepage` | string | プラグインのWebサイトURL |
| `repository` | object | リポジトリ情報 |
| `keywords` | string[] | 検索用キーワード |
| `category` | string | カテゴリ（development, testing, etc.） |
| `engines` | object | 必要なClaude Codeバージョン |
| `dependencies` | object | 依存する他のプラグイン |
| `hooks` | object | Hooks定義 |
| `mcpServers` | object | MCPサーバー定義 |
| `settings` | object | デフォルト設定 |

### 完全な例

```json
{
  "name": "react-dev-toolkit",
  "version": "2.1.0",
  "description": "React開発のための包括的なツールキット",
  "author": "React Team",
  "license": "MIT",
  "homepage": "https://react-toolkit.dev",
  "repository": {
    "type": "git",
    "url": "https://github.com/team/react-toolkit.git"
  },
  "keywords": [
    "react",
    "development",
    "testing",
    "components"
  ],
  "category": "development",
  "engines": {
    "claude-code": ">=1.0.0"
  },
  "dependencies": {
    "eslint-plugin": "^1.0.0"
  },
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "command": "npx eslint --fix \"$file_path\"",
        "description": "ESLint自動修正"
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Write",
        "predicate": {
          "prompt": "ファイル「${file_path}」はNode.jsのnode_modulesディレクトリ内ですか？",
          "allowIf": "No"
        }
      }
    ]
  },
  "mcpServers": {
    "react-devtools": {
      "transport": "stdio",
      "command": "npx",
      "args": ["react-devtools-mcp"]
    }
  },
  "settings": {
    "defaultComponentStyle": "functional",
    "testFramework": "vitest",
    "cssFramework": "tailwind"
  }
}
```

## ディレクトリ構造

### 基本構造

```
my-plugin/
├── plugin.json              # プラグインマニフェスト（必須）
├── README.md                # プラグインドキュメント
├── LICENSE                  # ライセンスファイル
├── CHANGELOG.md             # 変更履歴
├── .claude-plugin/          # プラグインコンテンツ
│   ├── commands/            # スラッシュコマンド
│   │   ├── review.md
│   │   └── deploy.md
│   ├── agents/              # サブエージェント
│   │   ├── code-reviewer.md
│   │   └── tester.md
│   ├── skills/              # スキル
│   │   ├── test-automation/
│   │   │   ├── SKILL.md
│   │   │   └── scripts/
│   │   └── doc-generator/
│   │       └── SKILL.md
│   └── templates/           # テンプレート（オプション）
│       ├── component.tsx
│       └── test.spec.ts
├── scripts/                 # ヘルパースクリプト（オプション）
│   ├── install.sh
│   └── validate.sh
└── examples/                # 使用例（オプション）
    └── usage.md
```

### 命名規則

#### プラグイン名（plugin.json の name）
- **kebab-case**: `team-dev-tools`
- **小文字のみ**: `react-toolkit`（ReactToolkitではない）
- **説明的**: `code-quality-checker`（toolsではない）
- **衝突回避**: `@company/dev-tools`（スコープ付き）

#### ディレクトリ名
- **小文字とハイフン**: `code-review`
- **複数形避ける**: `command/`ではなく`commands/`
- **明確な名前**: `util/`ではなく`utilities/`

#### ファイル名
- **Commands**: `kebab-case.md`（例: `code-review.md`）
- **Agents**: `kebab-case.md`（例: `security-auditor.md`）
- **Skills**: ディレクトリ名は`kebab-case/`、`SKILL.md`は固定

## プラグインの作成

### ステップ1: プロジェクト初期化

```bash
# プラグインディレクトリを作成
mkdir my-plugin
cd my-plugin

# 基本構造を作成
mkdir -p .claude-plugin/{commands,agents,skills}
mkdir -p scripts examples

# plugin.jsonを作成
cat > plugin.json << 'EOF'
{
  "name": "my-plugin",
  "version": "1.0.0",
  "description": "My first Claude Code plugin",
  "author": "Your Name",
  "license": "MIT"
}
EOF

# READMEを作成
cat > README.md << 'EOF'
# My Plugin

Description of your plugin.

## Installation

\`\`\`bash
claude plugin install username/my-plugin
\`\`\`

## Usage

...
EOF
```

### ステップ2: コンポーネントの追加

#### Commandの追加

`.claude-plugin/commands/hello.md`:

```markdown
---
name: hello
description: シンプルな挨拶コマンド
---

# Hello Command

ユーザーに挨拶して、このプラグインが正常にインストールされたことを確認してください。

現在の日時と作業ディレクトリも表示してください。
```

#### Agentの追加

`.claude-plugin/agents/helper.md`:

```markdown
---
name: helper
displayName: Helper Agent
model: claude-sonnet-4-5-20250929
---

# Helper Agent

あなたは親切なアシスタントです。
ユーザーの質問に丁寧に答えてください。
```

#### Skillの追加

`.claude-plugin/skills/example-skill/SKILL.md`:

```markdown
---
skillName: example-skill
displayName: Example Skill
description: シンプルなスキルの例
version: 1.0.0
---

# Example Skill Task

このスキルは、プラグインのSkillsコンポーネントのデモです。

## 手順

1. 現在のディレクトリを確認
2. 簡単なメッセージを表示
3. 完了を報告
```

### ステップ3: Hooksの設定

`plugin.json`にHooksを追加：

```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "description": "My first Claude Code plugin",
  "author": "Your Name",
  "license": "MIT",
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "command": "echo 'File modified: $file_path'",
        "description": "ファイル変更通知"
      }
    ]
  }
}
```

### ステップ4: ドキュメント作成

#### README.md

```markdown
# My Plugin

このプラグインは、Claude Codeの使い方を学ぶためのシンプルな例です。

## 機能

- **Commands**: `/hello` - 挨拶コマンド
- **Agents**: `helper` - ヘルパーエージェント
- **Skills**: `example-skill` - サンプルスキル
- **Hooks**: ファイル変更通知

## インストール

```bash
# GitHubから
claude plugin install username/my-plugin

# ローカルから
claude plugin install /path/to/my-plugin
```

## 使用方法

### Commandの実行

```bash
/hello
```

### Agentの呼び出し

```bash
/agents
# "helper"を選択
```

### Skillの使用

```bash
claude skill example-skill
```

## 設定

このプラグインは追加の設定を必要としません。

## 貢献

プルリクエストを歓迎します。

## ライセンス

MIT License
```

#### CHANGELOG.md

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-03-15

### Added
- 初回リリース
- /hello コマンド
- helper エージェント
- example-skill スキル
- ファイル変更通知Hook

## [Unreleased]

今後の予定:
- より多くのコマンド追加
- 統合テスト
```

### ステップ5: テスト

#### バリデーションスクリプト

`scripts/validate.sh`:

```bash
#!/bin/bash

# プラグイン検証スクリプト
set -e

echo "Validating plugin structure..."

# 必須ファイルの確認
if [ ! -f "plugin.json" ]; then
  echo "Error: plugin.json not found"
  exit 1
fi

if [ ! -f "README.md" ]; then
  echo "Warning: README.md not found"
fi

# plugin.jsonの検証
echo "Validating plugin.json..."
if ! jq empty plugin.json 2>/dev/null; then
  echo "Error: Invalid JSON in plugin.json"
  exit 1
fi

# 必須フィールドの確認
NAME=$(jq -r '.name' plugin.json)
VERSION=$(jq -r '.version' plugin.json)
DESCRIPTION=$(jq -r '.description' plugin.json)

if [ "$NAME" = "null" ]; then
  echo "Error: 'name' field is required in plugin.json"
  exit 1
fi

if [ "$VERSION" = "null" ]; then
  echo "Error: 'version' field is required in plugin.json"
  exit 1
fi

if [ "$DESCRIPTION" = "null" ]; then
  echo "Error: 'description' field is required in plugin.json"
  exit 1
fi

# バージョン形式の確認
if ! echo "$VERSION" | grep -qE '^[0-9]+\.[0-9]+\.[0-9]+'; then
  echo "Error: Invalid version format. Use semantic versioning (e.g., 1.0.0)"
  exit 1
fi

echo "✓ Validation passed"
```

#### ローカルテスト

```bash
# 検証スクリプトを実行可能に
chmod +x scripts/validate.sh

# 検証実行
./scripts/validate.sh

# ローカルインストールしてテスト
claude plugin install .

# Commandsが利用可能か確認
/hello

# Skillsが利用可能か確認
claude skill example-skill
```

### ステップ6: バージョン管理

```bash
# Gitリポジトリ初期化
git init
git add .
git commit -m "Initial plugin version 1.0.0"
git tag v1.0.0

# .gitignoreを追加
cat > .gitignore << 'EOF'
# OS
.DS_Store
Thumbs.db

# Editor
.vscode/
.idea/

# Logs
*.log

# Temporary
tmp/
temp/
EOF
```

## プラグインのインストール

### 方法1: ローカルインストール

開発中またはプライベートプラグインの場合：

```bash
# ディレクトリパスから
claude plugin install /path/to/my-plugin

# 相対パスも使用可能
cd /path/to
claude plugin install ./my-plugin

# インストール確認
claude plugin list
```

**インストール先**: `~/.claude/plugins/my-plugin/`

### 方法2: GitHubからインストール

GitHubにホストされているプラグイン：

```bash
# 最新版をインストール
claude plugin install username/plugin-name

# 特定バージョンをインストール
claude plugin install username/plugin-name@v1.2.0

# ブランチを指定
claude plugin install username/plugin-name#develop

# プライベートリポジトリ（GitHub認証が必要）
claude plugin install private-org/private-plugin
```

**URL形式**:
- `username/repo` → `https://github.com/username/repo`
- `username/repo@tag` → 特定バージョン
- `username/repo#branch` → 特定ブランチ

### 方法3: マーケットプレイスからインストール

Claude Code公式マーケットプレイス（将来予定）：

```bash
# マーケットプレイスから検索
claude plugin search "react"

# マーケットプレイスからインストール
claude plugin install --marketplace react-toolkit

# 人気プラグインを表示
claude plugin trending
```

### インストールオプション

```bash
# 依存関係も一緒にインストール
claude plugin install username/plugin --with-deps

# グローバルインストール（全プロジェクトで使用）
claude plugin install username/plugin --global

# プロジェクトローカルインストール
claude plugin install username/plugin --local

# 強制再インストール
claude plugin install username/plugin --force
```

## プラグインの管理

### 有効化と無効化

#### settings.jsonで管理

`~/.claude/settings.json`または`.claude/settings.json`:

```json
{
  "enabledPlugins": [
    "team-dev-tools",
    "react-toolkit",
    "security-scanner"
  ]
}
```

**自動有効化**: `enabledPlugins`に記載されたプラグインは自動的に有効化されます。

#### CLIコマンドで管理

```bash
# プラグイン一覧表示
claude plugin list

# プラグインを有効化
claude plugin enable my-plugin

# プラグインを無効化
claude plugin disable my-plugin

# すべてのプラグインを無効化
claude plugin disable --all

# プラグインの詳細を表示
claude plugin info my-plugin
```

### 更新

```bash
# 特定プラグインを更新
claude plugin update my-plugin

# すべてのプラグインを更新
claude plugin update --all

# 更新可能なプラグインを確認
claude plugin outdated
```

### アンインストール

```bash
# プラグインをアンインストール
claude plugin uninstall my-plugin

# 設定ファイルも削除
claude plugin uninstall my-plugin --purge

# 依存関係も一緒に削除
claude plugin uninstall my-plugin --with-deps
```

### プラグイン情報の確認

```bash
# インストール済みプラグイン一覧
claude plugin list

# 詳細情報表示
claude plugin info my-plugin

# 出力例:
# Name: my-plugin
# Version: 1.0.0
# Author: Your Name
# Description: My awesome plugin
# Status: enabled
# Location: ~/.claude/plugins/my-plugin
# Components:
#   - Commands: 3
#   - Agents: 2
#   - Skills: 1
#   - Hooks: 2
```

### 設定の上書き

プロジェクト固有の設定でプラグインの設定を上書き：

`.claude/settings.json`:

```json
{
  "plugins": {
    "react-toolkit": {
      "settings": {
        "componentStyle": "functional",
        "testFramework": "jest"
      }
    }
  }
}
```

## 開発のベストプラクティス

### 1. セマンティックバージョニング

**バージョン形式**: `MAJOR.MINOR.PATCH`

```
1.2.3
│ │ │
│ │ └─ PATCH: バグ修正（後方互換あり）
│ └─── MINOR: 機能追加（後方互換あり）
└───── MAJOR: 破壊的変更（後方互換なし）
```

**例**:
- `1.0.0` → `1.0.1`: バグ修正
- `1.0.1` → `1.1.0`: 新機能追加
- `1.1.0` → `2.0.0`: APIの破壊的変更

### 2. 明確なドキュメント

#### README.mdに含めるべき項目

```markdown
# Plugin Name

## 概要
簡潔な説明（1-2文）

## 機能
- 機能1
- 機能2

## インストール
インストール手順

## 使用方法
具体的な使用例

## 設定
設定オプションの説明

## トラブルシューティング
よくある問題と解決方法

## 貢献
コントリビューションガイドライン

## ライセンス
ライセンス情報
```

### 3. 適切な命名

#### ✅ 良い例

```json
{
  "name": "react-dev-toolkit",
  "description": "React開発のための包括的なツールキット"
}
```

**理由**:
- kebab-case使用
- 説明的な名前
- 簡潔で明確

#### ❌ 悪い例

```json
{
  "name": "ReactToolkit",
  "description": "Tools"
}
```

**問題点**:
- PascalCase（kebab-caseを使うべき）
- 説明が曖昧

### 4. 依存関係の管理

#### 明示的な依存関係

```json
{
  "dependencies": {
    "base-plugin": "^1.0.0"
  },
  "peerDependencies": {
    "eslint-plugin": ">=2.0.0"
  },
  "engines": {
    "claude-code": ">=1.0.0",
    "node": ">=18.0.0"
  }
}
```

#### インストールスクリプト

`scripts/install.sh`:

```bash
#!/bin/bash

echo "Installing plugin dependencies..."

# Node.jsバージョンチェック
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is required"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "Error: Node.js 18 or higher is required"
    exit 1
fi

# 依存関係のインストール
if [ -f "package.json" ]; then
    npm install
fi

echo "Installation completed successfully!"
```

### 5. テストの充実

#### テストスクリプト

`scripts/test.sh`:

```bash
#!/bin/bash

set -e

echo "Running plugin tests..."

# 構造検証
./scripts/validate.sh

# Command存在確認
for cmd in .claude-plugin/commands/*.md; do
  echo "Validating command: $(basename $cmd)"
  # フロントマター検証など
done

# Skill存在確認
for skill in .claude-plugin/skills/*/SKILL.md; do
  echo "Validating skill: $(dirname $skill | xargs basename)"
  # YAMLフロントマター検証など
done

echo "All tests passed!"
```

### 6. セキュリティ考慮

#### ⚠️ 避けるべきこと

```json
// ❌ APIキーをハードコード
{
  "mcpServers": {
    "api": {
      "config": {
        "apiKey": "sk-1234567890abcdef"  // 絶対NG！
      }
    }
  }
}
```

#### ✅ 推奨される方法

```json
// ✅ 環境変数を使用
{
  "mcpServers": {
    "api": {
      "config": {
        "apiKey": "${API_KEY}"  // 環境変数から取得
      }
    }
  }
}
```

**READMEに環境変数の設定方法を記載**:

```markdown
## 設定

以下の環境変数を設定してください：

```bash
export API_KEY="your-api-key-here"
```
```

### 7. エラーハンドリング

#### Hooksでの適切なエラー処理

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "command": "bash -c 'npx prettier --write \"$file_path\" || echo \"Warning: Prettier failed for $file_path\"'",
        "description": "自動フォーマット（エラーは警告として表示）"
      }
    ]
  }
}
```

### 8. パフォーマンス最適化

#### 不要なファイルを除外

`.npmignore`または`.gitignore`:

```
# テストファイル
tests/
*.test.js

# ドキュメントソース
docs/drafts/

# 開発ツール
.eslintrc
.prettierrc

# ビルド成果物
dist/
build/
```

#### Hooksでの条件付き実行

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "predicate": {
          "prompt": "ファイル「${file_path}」はJavaScriptまたはTypeScriptファイルですか？",
          "allowIf": "Yes"
        },
        "command": "npx eslint --fix \"$file_path\""
      }
    ]
  }
}
```

**効果**: JavaScriptファイルのみにESLintを実行し、無駄な処理を削減

### 9. ユーザーフレンドリーな設計

#### デフォルト設定の提供

```json
{
  "settings": {
    "autoFormat": true,
    "lintOnSave": true,
    "notificationLevel": "error"
  }
}
```

#### ヘルプコマンドの提供

`.claude-plugin/commands/help.md`:

```markdown
---
name: help
description: プラグインのヘルプを表示
---

# Plugin Help

このプラグインの使い方を説明してください。

## 利用可能なコマンド

- `/review`: コードレビュー実施
- `/deploy`: デプロイ実行
- `/test`: テスト実行

## 利用可能なスキル

- `code-quality`: コード品質チェック
- `test-generator`: テスト自動生成

## 設定

設定は`.claude/settings.json`で変更できます。
```

### 10. 継続的なメンテナンス

#### CHANGELOG.mdの維持

すべての変更を記録：

```markdown
## [1.2.0] - 2024-03-20

### Added
- 新しいコマンド: `/analyze`
- パフォーマンス監視Hook

### Changed
- コードレビューの精度向上
- エラーメッセージの改善

### Fixed
- #42: ファイルパスの処理バグ
- #45: 環境変数の読み込みエラー

### Deprecated
- `/old-command`は非推奨（v2.0.0で削除予定）
```

## プラグインの配布

### GitHub公開

#### 1. リポジトリの準備

```bash
# リポジトリ作成
git init
git add .
git commit -m "Initial commit: v1.0.0"

# GitHubにプッシュ
git remote add origin https://github.com/username/my-plugin.git
git push -u origin main
```

#### 2. リリース作成

```bash
# タグを作成
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

**GitHubでリリースを作成**:

1. GitHub → Releases → "Create a new release"
2. タグ: `v1.0.0`
3. タイトル: `v1.0.0 - Initial Release`
4. 説明:
   ```markdown
   ## Features
   - コマンド: /hello
   - エージェント: helper
   - スキル: example-skill

   ## Installation
   ```bash
   claude plugin install username/my-plugin
   ```
   ```

#### 3. README.mdバッジ追加

```markdown
# My Plugin

[![Version](https://img.shields.io/github/v/release/username/my-plugin)](https://github.com/username/my-plugin/releases)
[![License](https://img.shields.io/github/license/username/my-plugin)](./LICENSE)
[![Downloads](https://img.shields.io/github/downloads/username/my-plugin/total)](https://github.com/username/my-plugin/releases)

...
```

### マーケットプレイス登録（将来予定）

Claude Code公式マーケットプレイスへの登録手順（将来実装予定）：

#### 1. 審査基準を満たす

- [ ] plugin.jsonが正しく設定されている
- [ ] README.mdが充実している
- [ ] LICENSEファイルが含まれている
- [ ] セキュリティベストプラクティスに準拠
- [ ] テストが実装されている
- [ ] ドキュメントが英語で提供されている

#### 2. マーケットプレイス申請

```bash
# マーケットプレイスに申請
claude plugin publish

# カテゴリ選択
# - Development
# - Testing
# - Security
# - Documentation
# - Deployment

# タグ追加（検索用）
# - react, typescript, testing, など
```

#### 3. レビュープロセス

1. **自動チェック**: 構造とセキュリティの自動検証
2. **人的レビュー**: Claude Codeチームによるレビュー
3. **フィードバック**: 改善提案を受け取る
4. **承認**: マーケットプレイスに公開

### プライベート配布

#### 企業内配布

**方法1: プライベートGitリポジトリ**

```bash
# GitHubプライベートリポジトリから
claude plugin install company-org/internal-plugin

# GitLabプライベートリポジトリから
claude plugin install gitlab:company/internal-plugin

# 認証設定
export GIT_TOKEN="your-token"
claude plugin install company/private-plugin
```

**方法2: 内部パッケージレジストリ**

```bash
# 内部NPMレジストリ
claude plugin install --registry https://npm.company.com internal-plugin

# Artifactory
claude plugin install --registry https://artifactory.company.com/claude internal-plugin
```

**方法3: ファイル共有**

```bash
# 共有ドライブから
claude plugin install /mnt/company-share/plugins/internal-plugin

# 圧縮ファイルから
claude plugin install ./internal-plugin.tar.gz
```

## 実践例

### 例1: チーム開発標準プラグイン

完全なチーム開発標準化プラグインの実装例。

#### ディレクトリ構造

```
team-dev-standards/
├── plugin.json
├── README.md
├── LICENSE
├── CHANGELOG.md
├── .claude-plugin/
│   ├── commands/
│   │   ├── review.md
│   │   ├── deploy.md
│   │   └── test.md
│   ├── agents/
│   │   ├── code-reviewer.md
│   │   └── security-auditor.md
│   └── skills/
│       ├── code-quality/
│       │   ├── SKILL.md
│       │   └── config/
│       │       └── rules.json
│       └── test-automation/
│           └── SKILL.md
└── scripts/
    ├── install.sh
    └── validate.sh
```

#### plugin.json

```json
{
  "name": "team-dev-standards",
  "version": "1.0.0",
  "description": "チーム開発標準化ツールキット",
  "author": "Dev Team",
  "license": "MIT",
  "category": "development",
  "keywords": [
    "team",
    "standards",
    "quality",
    "review"
  ],
  "engines": {
    "claude-code": ">=1.0.0",
    "node": ">=18.0.0"
  },
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "predicate": {
          "prompt": "ファイル「${file_path}」はJavaScriptまたはTypeScriptファイルですか？",
          "allowIf": "Yes"
        },
        "command": "npx eslint --fix \"$file_path\"",
        "description": "ESLint自動修正"
      },
      {
        "matcher": "Edit|Write",
        "command": "npx prettier --write \"$file_path\"",
        "description": "Prettier自動フォーマット"
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Bash",
        "predicate": {
          "prompt": "コマンド「${command}」は本番環境で実行しても安全ですか？危険なコマンド（rm -rf、force pushなど）をチェックしてください。",
          "allowIf": "Yes"
        }
      }
    ],
    "Stop": [
      {
        "command": "echo '✓ タスク完了。変更内容をレビューしてください。'",
        "description": "完了通知"
      }
    ]
  },
  "settings": {
    "codeReview": {
      "autoReviewOnPR": true,
      "strictMode": false,
      "checkSecurity": true,
      "checkPerformance": true
    },
    "testing": {
      "coverageThreshold": 80,
      "runOnSave": true
    },
    "deployment": {
      "requireApproval": true,
      "environment": "staging"
    }
  }
}
```

#### Commands

`.claude-plugin/commands/review.md`:

```markdown
---
name: review
description: コードレビューを実施
---

# コードレビュー実施

指定されたPull Requestまたはファイルに対して、包括的なコードレビューを実施してください。

## レビュー観点

### 1. コード品質
- 命名規則の遵守
- コメントの適切さ
- DRY原則の適用
- 複雑度の確認

### 2. セキュリティ
- SQLインジェクション対策
- XSS脆弱性チェック
- 認証・認可の確認
- 機密情報の露出チェック

### 3. パフォーマンス
- 不要な計算の検出
- メモリリークの可能性
- 効率的なアルゴリズムの使用

### 4. テスト
- ユニットテストの存在
- カバレッジの確認
- エッジケースのテスト

## レポート形式

以下の形式でレポートを作成してください：

```markdown
# コードレビューレポート

## 概要
- レビュー対象: [ファイル/PR]
- レビュー日時: [日時]

## 良い点
1. ...

## 改善提案

### 重要度: 高
1. ...

### 重要度: 中
1. ...

### 重要度: 低
1. ...

## 次のアクション
- [ ] 必須対応1
- [ ] 必須対応2
```

レビューは建設的でポジティブなトーンで行ってください。
```

`.claude-plugin/commands/deploy.md`:

```markdown
---
name: deploy
description: アプリケーションをデプロイ
---

# デプロイ実行

安全なデプロイプロセスを実行してください。

## デプロイ前チェック

1. **テストの実行**
   ```bash
   npm test
   ```
   すべてのテストがパスすることを確認

2. **ビルドの実行**
   ```bash
   npm run build
   ```
   ビルドエラーがないことを確認

3. **ブランチの確認**
   ```bash
   git branch --show-current
   ```
   `main`または`master`ブランチであることを確認

4. **変更の確認**
   ```bash
   git status
   ```
   未コミットの変更がないことを確認

## デプロイ手順

### ステージング環境

```bash
npm run deploy:staging
```

デプロイ後、スモークテストを実行：
```bash
npm run test:smoke -- --env=staging
```

### 本番環境

⚠️ 本番環境へのデプロイには追加の承認が必要です。

ユーザーに確認を求めてください：
「本番環境にデプロイしてもよろしいですか？（Yes/No）」

Yes の場合のみ実行：
```bash
npm run deploy:production
```

## デプロイ後

1. ヘルスチェック確認
2. ログ監視
3. エラー率の確認
4. デプロイ完了を通知
```

#### Agents

`.claude-plugin/agents/code-reviewer.md`:

```markdown
---
name: code-reviewer
displayName: Code Reviewer
model: claude-sonnet-4-5-20250929
---

# コードレビュー専門エージェント

あなたは経験豊富なシニアエンジニアとして、コードレビューを行います。

## あなたの役割

- コード品質の評価
- セキュリティ脆弱性の検出
- パフォーマンス問題の指摘
- ベストプラクティスの提案

## レビュー方針

1. **建設的**: 批判ではなく、改善提案を提供
2. **教育的**: なぜ改善すべきかの理由を説明
3. **具体的**: 曖昧な指摘ではなく、具体的な改善案
4. **バランス**: 良い点も積極的に評価

## レビューフォーマット

各指摘事項には以下を含めてください：

- **重要度**: 高/中/低
- **カテゴリ**: 品質/セキュリティ/パフォーマンス/テスト
- **場所**: ファイル名と行番号
- **問題**: 何が問題か
- **理由**: なぜ問題なのか
- **推奨**: どう改善すべきか
- **例**: 改善後のコード例

## チーム標準

- TypeScript厳格モード使用
- ESLintルールに準拠
- テストカバレッジ80%以上
- コメントは日本語OK
```

#### Skills

`.claude-plugin/skills/code-quality/SKILL.md`:

```markdown
---
skillName: code-quality
displayName: Code Quality Check
description: コード品質を包括的にチェック
version: 1.0.0
supportFiles:
  - config/rules.json
---

# コード品質チェック

## タスク概要

プロジェクトのコード品質を包括的にチェックし、問題を報告します。

## チェック項目

### Phase 1: 静的解析

```bash
# TypeScriptコンパイラチェック
npx tsc --noEmit

# ESLint実行
npx eslint . --ext .ts,.tsx,.js,.jsx

# Prettier確認
npx prettier --check "**/*.{ts,tsx,js,jsx,json,md}"
```

### Phase 2: 複雑度解析

```bash
# 循環的複雑度チェック
npx eslint . --ext .ts,.tsx --rule 'complexity: ["error", 10]'
```

以下の基準で評価：
- 複雑度 1-5: シンプル（理想的）
- 複雑度 6-10: 中程度（許容範囲）
- 複雑度 11-20: 複雑（リファクタリング推奨）
- 複雑度 21+: 非常に複雑（即座に対応が必要）

### Phase 3: 依存関係チェック

```bash
# 脆弱性スキャン
npm audit

# 古いパッケージ確認
npm outdated
```

### Phase 4: コードメトリクス

以下のメトリクスを計算：
- 総行数（LOC）
- コメント率
- 関数の平均行数
- ファイルの平均行数
- 重複コード検出

## レポート生成

```markdown
# コード品質レポート

## 概要
- プロジェクト: [名前]
- 分析日時: [日時]
- 総ファイル数: [数]
- 総行数: [数]

## 静的解析結果

### TypeScript
- エラー: [数]
- 警告: [数]

### ESLint
- エラー: [数]
- 警告: [数]

### Prettier
- フォーマット不一致: [数]

## 複雑度分析

- 平均複雑度: [値]
- 最も複雑な関数:
  1. [関数名] (複雑度: [値])
  2. ...

## 依存関係

- 脆弱性: [数]
  - Critical: [数]
  - High: [数]
  - Medium: [数]
  - Low: [数]

- 古いパッケージ: [数]

## コードメトリクス

- 総行数: [数]
- コメント率: [%]
- 平均関数行数: [数]
- 最も大きいファイル: [名前] ([行数]行)

## 推奨事項

1. [改善提案1]
2. [改善提案2]
3. [改善提案3]

## 総合評価

[優/良/可/要改善]
```

## 設定

`.claude-plugin/skills/code-quality/config/rules.json`で
カスタムルールを設定できます。
```

### 例2: セキュリティチェックプラグイン

セキュリティに特化したプラグインの実装例。

#### plugin.json

```json
{
  "name": "security-scanner",
  "version": "1.0.0",
  "description": "包括的なセキュリティスキャナー",
  "author": "Security Team",
  "license": "MIT",
  "category": "security",
  "keywords": [
    "security",
    "vulnerability",
    "audit",
    "compliance"
  ],
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write",
        "predicate": {
          "prompt": "ファイル「${file_path}」に機密情報（APIキー、パスワード、トークンなど）が含まれていませんか？",
          "allowIf": "No"
        },
        "description": "機密情報チェック"
      },
      {
        "matcher": "Write",
        "predicate": {
          "prompt": "ファイル「${file_path}」は.envまたは.gitignoreに記載されるべき機密ファイルですか？",
          "allowIf": "No"
        },
        "description": "機密ファイルチェック"
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "predicate": {
          "prompt": "ファイル「${file_path}」はJavaScript、TypeScript、またはPythonファイルですか？",
          "allowIf": "Yes"
        },
        "command": "bash -c 'if grep -qE \"(eval\\(|exec\\(|__import__)\" \"$file_path\"; then echo \"⚠️ Warning: Potentially dangerous function detected in $file_path\"; fi'",
        "description": "危険な関数の検出"
      }
    ]
  },
  "mcpServers": {
    "snyk": {
      "transport": "stdio",
      "command": "npx",
      "args": ["snyk-mcp-server"],
      "env": {
        "SNYK_TOKEN": "${SNYK_TOKEN}"
      }
    }
  }
}
```

#### Commands

`.claude-plugin/commands/security-scan.md`:

```markdown
---
name: security-scan
description: セキュリティスキャンを実行
---

# セキュリティスキャン

包括的なセキュリティスキャンを実行してください。

## スキャン項目

### 1. 依存関係の脆弱性

```bash
# npm audit
npm audit --audit-level=moderate

# Snyk（利用可能な場合）
npx snyk test
```

### 2. 機密情報の検出

```bash
# GitリポジトリからAPIキーやパスワードを検索
git grep -E "api[_-]?key|password|secret|token" -- '*.js' '*.ts' '*.py'

# 環境変数ファイルの確認
find . -name ".env*" -not -path "*/node_modules/*"
```

### 3. セキュリティベストプラクティス

以下をチェック：
- [ ] パスワードがハッシュ化されている
- [ ] JWTが適切に検証されている
- [ ] CSRFトークンが使用されている
- [ ] XSS対策が実装されている
- [ ] SQLインジェクション対策がある
- [ ] HTTPS使用が強制されている

### 4. 権限設定

```bash
# 実行権限のあるファイルを確認
find . -type f -executable

# 777権限のファイルを検出
find . -type f -perm 777
```

### 5. セキュリティヘッダー

Webアプリケーションの場合、以下のヘッダーを確認：
- Content-Security-Policy
- X-Frame-Options
- X-Content-Type-Options
- Strict-Transport-Security

## レポート生成

```markdown
# セキュリティスキャンレポート

## 概要
- スキャン日時: [日時]
- スキャン対象: [プロジェクト]

## 検出された問題

### Critical
1. [問題1]
   - 場所: [ファイル:行]
   - 説明: [詳細]
   - 推奨: [修正方法]

### High
...

### Medium
...

### Low
...

## 推奨事項

1. 即座に対応が必要な項目
2. 短期的に対応すべき項目
3. 長期的な改善提案

## 総合評価

セキュリティスコア: [スコア]/100
```

問題を検出した場合は、具体的な修正方法を提案してください。
```

### 例3: データ分析プラグイン

データ分析ワークフロー用のプラグイン。

#### plugin.json

```json
{
  "name": "data-analytics-toolkit",
  "version": "1.0.0",
  "description": "データ分析ワークフロー自動化ツールキット",
  "author": "Data Team",
  "license": "MIT",
  "category": "data",
  "keywords": [
    "data",
    "analytics",
    "visualization",
    "etl"
  ],
  "engines": {
    "claude-code": ">=1.0.0",
    "python": ">=3.9.0"
  },
  "mcpServers": {
    "jupyter": {
      "transport": "stdio",
      "command": "python",
      "args": ["-m", "jupyter_mcp_server"]
    },
    "pandas": {
      "transport": "stdio",
      "command": "python",
      "args": ["-m", "pandas_mcp_server"]
    }
  },
  "settings": {
    "dataFormat": "parquet",
    "visualizationLibrary": "plotly",
    "defaultChartType": "bar"
  }
}
```

#### Skills

`.claude-plugin/skills/data-pipeline/SKILL.md`:

```markdown
---
skillName: data-pipeline
displayName: Data Pipeline
description: データパイプラインの構築と実行
version: 1.0.0
supportFiles:
  - scripts/extract.py
  - scripts/transform.py
  - scripts/load.py
---

# データパイプライン構築

## タスク概要

ETL（Extract, Transform, Load）パイプラインを構築して実行します。

## Phase 1: Extract（抽出）

### データソースの特定

ユーザーに以下を確認：
- データソースのタイプ（CSV, JSON, API, Database）
- データソースの場所
- 認証情報（必要な場合）

### データ抽出

```python
# scripts/extract.pyを使用
python .claude-plugin/skills/data-pipeline/scripts/extract.py \
  --source [source] \
  --type [csv|json|api|db] \
  --output data/raw/
```

## Phase 2: Transform（変換）

### データクリーニング

1. **欠損値の処理**
   - 削除、補完、または代替値

2. **データ型の変換**
   - 文字列→数値
   - 文字列→日付

3. **正規化**
   - スケーリング
   - 標準化

### データ変換

```python
# scripts/transform.pyを使用
python .claude-plugin/skills/data-pipeline/scripts/transform.py \
  --input data/raw/ \
  --output data/processed/ \
  --config transform-config.json
```

### データバリデーション

以下を確認：
- [ ] データ型が正しい
- [ ] 必須フィールドが存在
- [ ] 値の範囲が妥当
- [ ] 重複レコードがない

## Phase 3: Load（ロード）

### データ保存

```python
# scripts/load.pyを使用
python .claude-plugin/skills/data-pipeline/scripts/load.py \
  --input data/processed/ \
  --destination [database|warehouse|file] \
  --format [parquet|csv|json]
```

### データ確認

```python
# レコード数確認
import pandas as pd
df = pd.read_parquet('data/processed/output.parquet')
print(f"Total records: {len(df)}")
print(f"Columns: {list(df.columns)}")
print(df.describe())
```

## Phase 4: レポート生成

```markdown
# データパイプラインレポート

## 実行概要
- 実行日時: [日時]
- パイプライン: [名前]
- 実行時間: [秒]

## Extract
- ソース: [ソース]
- 抽出レコード数: [数]

## Transform
- 処理レコード数: [数]
- スキップレコード数: [数]
- エラーレコード数: [数]

## Load
- ロード先: [先]
- 保存レコード数: [数]
- ファイルサイズ: [サイズ]

## データ品質
- 完全性: [%]
- 正確性: [%]

## エラー詳細
[エラーがあれば記載]

## 次のステップ
- データ分析実行
- ビジュアライゼーション作成
```

すべての処理を完了したら、結果をユーザーに報告してください。
```

## トラブルシューティング

### よくある問題と解決方法

#### 問題1: プラグインがインストールできない

**症状**:
```
Error: Failed to install plugin 'my-plugin'
```

**原因と解決方法**:

1. **plugin.jsonが存在しない**
   ```bash
   # 確認
   ls -la plugin.json

   # 解決: plugin.jsonを作成
   ```

2. **plugin.jsonの形式が不正**
   ```bash
   # 確認
   cat plugin.json | jq .

   # エラーが出る場合はJSON形式を修正
   ```

3. **必須フィールドが不足**
   ```bash
   # 確認
   jq -r '.name, .version, .description' plugin.json

   # null が表示される場合は該当フィールドを追加
   ```

#### 問題2: Commandsが表示されない

**症状**: `/my-command`が利用できない

**原因と解決方法**:

1. **プラグインが有効化されていない**
   ```bash
   # 確認
   claude plugin list

   # 解決
   claude plugin enable my-plugin
   ```

2. **ファイルパスが間違っている**
   ```bash
   # 正しい構造
   .claude-plugin/commands/my-command.md

   # 誤った構造（動作しない）
   commands/my-command.md
   ```

3. **フロントマターが不正**
   ```markdown
   <!-- 正しい形式 -->
   ---
   name: my-command
   description: My command
   ---

   <!-- 誤った形式（YAMLではない） -->
   name: my-command
   description: My command
   ```

#### 問題3: Hooksが実行されない

**症状**: Hookが期待通りに実行されない

**デバッグ手順**:

1. **Hookの設定を確認**
   ```json
   {
     "hooks": {
       "PostToolUse": [
         {
           "matcher": "Edit|Write",
           "command": "echo 'Hook executed: $file_path'",
           "description": "Test hook"
         }
       ]
     }
   }
   ```

2. **matcherパターンを確認**
   ```json
   // 正しい: OR条件
   "matcher": "Edit|Write"

   // 誤り
   "matcher": "Edit, Write"
   ```

3. **コマンドの実行権限を確認**
   ```bash
   # スクリプトファイルの場合
   chmod +x scripts/my-hook.sh
   ```

4. **環境変数を確認**
   ```bash
   # Hookで使用できる変数
   # $file_path, $tool_name, $command, など

   # テスト
   echo "File: $file_path"
   ```

#### 問題4: MCPサーバーに接続できない

**症状**: MCPサーバーへの接続エラー

**原因と解決方法**:

1. **環境変数が設定されていない**
   ```bash
   # 確認
   echo $API_KEY

   # 解決
   export API_KEY="your-key"
   ```

2. **transportタイプが間違っている**
   ```json
   // HTTP APIの場合
   {
     "transport": "http",
     "url": "https://api.example.com/mcp"
   }

   // ローカルコマンドの場合
   {
     "transport": "stdio",
     "command": "node",
     "args": ["server.js"]
   }
   ```

3. **サーバーが起動していない**
   ```bash
   # サーバー起動確認
   ps aux | grep mcp-server

   # 手動起動テスト
   node server.js
   ```

#### 問題5: プラグインの更新が反映されない

**症状**: プラグインを更新したが変更が反映されない

**解決方法**:

1. **プラグインを再インストール**
   ```bash
   claude plugin uninstall my-plugin
   claude plugin install /path/to/my-plugin
   ```

2. **キャッシュをクリア**
   ```bash
   rm -rf ~/.claude/cache
   claude restart
   ```

3. **設定を確認**
   ```bash
   # プラグインが有効化されているか
   cat ~/.claude/settings.json | jq '.enabledPlugins'
   ```

#### 問題6: プラグインの依存関係エラー

**症状**:
```
Error: Missing dependency 'base-plugin'
```

**解決方法**:

1. **依存プラグインをインストール**
   ```bash
   # plugin.jsonで依存関係を確認
   cat plugin.json | jq '.dependencies'

   # 依存プラグインをインストール
   claude plugin install base-plugin
   ```

2. **バージョン互換性を確認**
   ```json
   {
     "dependencies": {
       "base-plugin": "^1.0.0"  // 1.x.x
     },
     "engines": {
       "claude-code": ">=1.0.0"
     }
   }
   ```

### デバッグモード

プラグインのデバッグ時に有効なテクニック：

#### 1. 詳細ログを有効化

```bash
# 詳細ログモードで実行
DEBUG=claude:plugin:* claude plugin install ./my-plugin

# 特定プラグインのログのみ
DEBUG=claude:plugin:my-plugin claude
```

#### 2. ドライランモード

```bash
# 実際にインストールせずに検証
claude plugin install --dry-run ./my-plugin

# 出力例:
# ✓ plugin.json is valid
# ✓ All required fields present
# ✓ Directory structure is correct
# ✓ Commands: 3 found
# ✓ Skills: 2 found
# ✓ Hooks: 1 found
```

#### 3. バリデーションツール

```bash
# プラグイン構造を検証
claude plugin validate ./my-plugin

# 詳細な検証結果
claude plugin validate --verbose ./my-plugin
```

### サポートリソース

- **公式ドキュメント**: [Claude Code Docs](https://docs.anthropic.com/claude-code)
- **GitHub Discussions**: コミュニティフォーラム
- **Issue Tracker**: バグ報告と機能リクエスト
- **Examples Repository**: サンプルプラグイン集

## まとめ

Pluginsは、Claude Codeの機能を拡張し、チーム全体で標準化された開発環境を実現する強力な仕組みです。

### Plugins開発のポイント

1. **明確な目的**: 単一の明確な目的を持つ
2. **適切な構成**: Commands、Agents、Skills、Hooks、MCPを適切に組み合わせる
3. **充実したドキュメント**: README、CHANGELOG、使用例を提供
4. **セキュリティ重視**: 機密情報を含めない、環境変数を使用
5. **テストの実装**: バリデーションスクリプトとテストを用意
6. **バージョン管理**: セマンティックバージョニングを使用
7. **コミュニティ貢献**: オープンソースで公開、フィードバックを受け入れる

### 次のステップ

1. **簡単なプラグインを作成**: 1つのCommandから始める
2. **チーム内で共有**: 小規模なチームで試用
3. **フィードバック収集**: ユーザーの意見を集める
4. **機能拡張**: Skills、Hooks、MCPを追加
5. **公開**: GitHubまたはマーケットプレイスで公開

### 関連ドキュメント

- [Commands（スラッシュコマンド）](../02-features/slash-commands.md) - コマンドの作成方法
- [Skills基礎](./04-skills-basics.md) - Skillsの基本概念
- [カスタムSkills作成](./05-skills-custom.md) - Skills開発の詳細
- [Hooks基礎](./06-hooks-basics.md) - Hooksの種類と設定
- [Hooks実践](./07-hooks-practice.md) - Hooksの実践的な使用
- [Subagents活用](./08-subagents.md) - Agentsの作成方法
- [MCP基礎](./01-mcp-basics.md) - MCPの基本概念
- [MCPサーバー活用](./02-mcp-servers.md) - MCPサーバーの使用方法

---

**タグ:** `#上級者` `#Plugins` `#拡張機能` `#カスタマイズ` `#チーム開発` `#配布` `#エコシステム`
