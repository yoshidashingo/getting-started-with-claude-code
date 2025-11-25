# .kiroディレクトリの基礎

## 目次
- [.kiroとは](#kiroとは)
- [ディレクトリ構造](#ディレクトリ構造)
- [steeringディレクトリの役割](#steeringディレクトリの役割)
- [specsディレクトリの役割](#specsディレクトリの役割)
- [初期セットアップ](#初期セットアップ)
- [ベストプラクティス](#ベストプラクティス)

## .kiroとは

`.kiro`は、プロジェクトのスペック駆動開発を実現するための標準化されたディレクトリ構造です。プロジェクトの方向性（steering）と詳細な仕様（specs）を明確に分離し、開発チーム全体で共有可能な構造化されたドキュメントを提供します。

### 主な特徴

- **明確な責任分離**: プロジェクトの方向性と実装仕様を分離
- **トレーサビリティ**: 要件から設計、実装まで追跡可能
- **AIフレンドリー**: Claude Codeなどのツールが理解しやすい構造
- **チーム協働**: 標準化されたフォーマットで情報共有が容易

### なぜ.kiroが必要か

```text
従来の開発プロセス:
- ドキュメントが散在（README、Wiki、チケットシステム等）
- 要件と実装の乖離
- 情報の陳腐化
- 新メンバーのオンボーディングが困難

.kiroを使った開発プロセス:
✓ すべての情報が一箇所に集約
✓ 要件から実装まで一貫した追跡
✓ 常に最新の情報を維持
✓ 新メンバーがすぐに状況を把握
```

## ディレクトリ構造

基本的な`.kiro`ディレクトリの構造は以下の通りです：

```
.kiro/
├── steering/              # プロジェクトの方向性
│   ├── product.md        # プロダクト定義
│   ├── structure.md      # プロジェクト構造
│   └── tech.md           # 技術スタック
│
└── specs/                # 詳細仕様
    ├── requirements.md   # 要件定義
    ├── design.md         # 設計仕様
    └── tasks.md          # 実装タスク
```

### 各ファイルの役割概要

| ファイル | 役割 | 主な内容 |
|---------|------|----------|
| `product.md` | プロダクト定義 | ビジョン、目標ユーザー、価値提案 |
| `structure.md` | プロジェクト構造 | ディレクトリ構成、モジュール構成 |
| `tech.md` | 技術スタック | 使用技術、ライブラリ、ツール |
| `requirements.md` | 要件定義 | User Story、受け入れ基準 |
| `design.md` | 設計仕様 | アーキテクチャ、データモデル |
| `tasks.md` | 実装タスク | 具体的な作業項目、進捗管理 |

## steeringディレクトリの役割

`steering/`ディレクトリは、プロジェクトの**方向性**を定義します。ここに含まれる情報は比較的安定しており、プロジェクト全体を通じて参照される基盤となります。

### product.md

プロダクトの根幹を定義するドキュメントです。

```markdown
# Product Definition

## Vision
このプロダクトで実現したい世界

## Target Users
- メインユーザー層
- ペルソナ定義

## Value Proposition
ユーザーに提供する価値

## Core Features
必須機能のリスト

## Success Metrics
成功指標（KPI）
```

### structure.md

プロジェクトの物理的な構造を定義します。

```markdown
# Project Structure

## Directory Layout
ディレクトリ構成の説明

## Module Organization
モジュールの役割と依存関係

## Naming Conventions
命名規則

## File Organization
ファイル配置のルール
```

### tech.md

技術的な選択とその理由を記録します。

```markdown
# Technology Stack

## Frontend
- Framework: React 18
- Language: TypeScript 5.2+
- Styling: CSS Modules

## Backend
- Runtime: Node.js
- Framework: Express
- Database: PostgreSQL

## Tools
- Build: Vite
- Testing: Vitest, Playwright
- Linting: ESLint, Prettier

## Rationale
各技術選択の理由
```

## specsディレクトリの役割

`specs/`ディレクトリは、プロジェクトの**詳細仕様**を定義します。開発の進行とともに更新され、実装の具体的なガイドとなります。

### requirements.md

何を作るべきかを定義します。

**主な特徴：**
- User Story形式での要件記述
- Acceptance Criteria（受け入れ基準）
- 優先順位付け
- トレーサビリティ

### design.md

どのように作るかを定義します。

**主な特徴：**
- アーキテクチャ設計
- コンポーネント設計
- データモデル
- テスト戦略

### tasks.md

具体的な作業項目を管理します。

**主な特徴：**
- 実装タスクのチェックリスト
- 優先順位と依存関係
- 進捗状態の追跡
- 要件へのトレーサビリティ

## 初期セットアップ

### ステップ1: ディレクトリ作成

プロジェクトルートで以下を実行：

```bash
# .kiroディレクトリ構造を作成
mkdir -p .kiro/steering .kiro/specs

# 必要なファイルを作成
touch .kiro/steering/product.md
touch .kiro/steering/structure.md
touch .kiro/steering/tech.md
touch .kiro/specs/requirements.md
touch .kiro/specs/design.md
touch .kiro/specs/tasks.md
```

### ステップ2: テンプレートの準備

各ファイルに基本的なテンプレートを配置します。

**product.md テンプレート:**

```markdown
# Product Definition

## Vision
[プロダクトのビジョンを記述]

## Target Users
- [ターゲットユーザー1]
- [ターゲットユーザー2]

## Value Proposition
[提供する価値を記述]

## Core Features
- [ ] [機能1]
- [ ] [機能2]

## Success Metrics
- [指標1]
- [指標2]
```

**structure.md テンプレート:**

```markdown
# Project Structure

## Directory Layout
\```
project/
├── src/
├── tests/
└── docs/
\```

## Module Organization
[モジュール構成を記述]

## Naming Conventions
[命名規則を記述]
```

**tech.md テンプレート:**

```markdown
# Technology Stack

## Frontend
- Framework:
- Language:

## Backend
- Runtime:
- Framework:

## Tools
- Build:
- Testing:

## Rationale
[技術選択の理由を記述]
```

### ステップ3: Claude Codeでの初期化

Claude Codeを使って効率的にセットアップできます：

```bash
# Claude Codeを起動
claude

# プロンプト例
「このプロジェクトに.kiroディレクトリ構造を作成してください。
プロジェクトはReact + TypeScriptのWebアプリケーションです。」
```

Claude Codeは自動的に：
1. ディレクトリ構造を作成
2. プロジェクトに適したテンプレートを配置
3. 既存のコードベースから情報を抽出して記入

### ステップ4: 検証

セットアップが正しく完了したか確認：

```bash
# ディレクトリ構造を確認
tree .kiro

# 各ファイルの存在を確認
ls -la .kiro/steering/
ls -la .kiro/specs/
```

期待される出力：

```
.kiro
├── steering
│   ├── product.md
│   ├── structure.md
│   └── tech.md
└── specs
    ├── requirements.md
    ├── design.md
    └── tasks.md
```

## ベストプラクティス

### 1. バージョン管理

⚠️ **重要**: `.kiro`ディレクトリは必ずGit管理下に置く

```bash
# .gitignoreに.kiroを含めない
# ✓ 正しい設定例
# .gitignore
node_modules/
dist/
.env

# ✗ 避けるべき設定
# .kiro/  ← これは追加しない
```

### 2. 更新頻度

| ディレクトリ | 更新頻度 | タイミング |
|-------------|---------|-----------|
| `steering/` | 低 | プロジェクト開始時、大きな方向転換時 |
| `specs/` | 高 | 各スプリント、各フィーチャー開発時 |

### 3. ドキュメントの責任者

```markdown
# 各ドキュメントの責任者を明確にする例

## requirements.md
- Owner: Product Manager
- Reviewers: Tech Lead, Designer

## design.md
- Owner: Tech Lead
- Reviewers: Senior Engineers

## tasks.md
- Owner: Development Team
- Updates: Daily
```

### 4. ファイルサイズの管理

⚠️ **注意**: 各ファイルは500行以内を目安に

```markdown
# ファイルが大きくなりすぎた場合の分割例

# requirements.md が大きい場合
.kiro/specs/
├── requirements/
│   ├── user-management.md
│   ├── authentication.md
│   └── reporting.md
└── requirements.md  # 概要と索引
```

### 5. リンクとクロスリファレンス

ドキュメント間の関連を明確に：

```markdown
# requirements.md での参照例

## US-001: ユーザー登録機能
- 設計: [design.md#user-registration](../design.md#user-registration)
- 実装: [tasks.md#task-001](../tasks.md#task-001)

# design.md での参照例

## User Registration Design
- 要件: [requirements.md#us-001](../requirements.md#us-001)
- 技術スタック: [steering/tech.md#authentication](../../steering/tech.md#authentication)
```

### 6. レビュープロセス

```markdown
# ドキュメント更新時のレビューフロー

1. ブランチ作成
   git checkout -b update-kiro-specs

2. ドキュメント更新
   vim .kiro/specs/requirements.md

3. レビュー依頼
   - PRを作成
   - 関係者をレビュアーに指定

4. マージ
   - 承認後にmainブランチへマージ
```

### 7. AIツールとの統合

Claude Codeに.kiroの存在を伝える：

```markdown
# CLAUDE.md または README.md に追記

## Spec-Driven Development

このプロジェクトは.kiroディレクトリを使ったスペック駆動開発を採用しています。

- `.kiro/steering/` - プロジェクトの方向性
- `.kiro/specs/` - 詳細仕様

新機能開発や変更時は、まず.kiro内のドキュメントを参照してください。
```

### 8. テンプレートのカスタマイズ

プロジェクトの性質に応じてテンプレートをカスタマイズ：

```markdown
# モバイルアプリの場合
.kiro/steering/
├── product.md
├── structure.md
├── tech.md
└── platform.md  # iOS/Android固有の情報

# マイクロサービスの場合
.kiro/steering/
├── product.md
├── structure.md
├── tech.md
└── services.md  # サービス間の依存関係
```

## 次のステップ

.kiroの基礎を理解したら、各ドキュメントの詳細な作成方法を学びましょう：

1. [要件定義（requirements.md）の作成](./02-requirements-spec.md)
2. [設計仕様（design.md）の作成](./03-design-spec.md)
3. [タスク管理（tasks.md）の活用](./04-tasks-spec.md)
4. [AIとの協働ワークフロー](./05-ai-workflow.md)

## まとめ

- `.kiro`はスペック駆動開発のための標準構造
- `steering/`で方向性、`specs/`で詳細を管理
- 初期セットアップは簡単で、Claude Codeで自動化可能
- バージョン管理とレビュープロセスが重要
- プロジェクトの性質に応じてカスタマイズ可能

---

**関連ドキュメント:**
- [06-development-process](../06-development-process/)
- [07-team-workflow](../07-team-workflow/)

**タグ:** #spec-driven #kiro #documentation #project-structure #best-practices
