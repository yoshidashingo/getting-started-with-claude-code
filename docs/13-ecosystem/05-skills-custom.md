# カスタムSkillsの作成

カスタムSkillsを作成して、Claude Codeの機能を特定のワークフローやタスクに合わせて拡張する方法を学びましょう。

## 目次

- [カスタムSkillsを作る理由](#カスタムskillsを作る理由)
- [Skillsディレクトリ構造](#skillsディレクトリ構造)
- [基本的なSkillの作成](#基本的なskillの作成)
- [YAMLフロントマター](#yamlフロントマター)
- [効果的な指示の書き方](#効果的な指示の書き方)
- [サポートファイルの追加](#サポートファイルの追加)
- [複雑なワークフローの実装](#複雑なワークフローの実装)
- [マルチファイルSkillsの構成](#マルチファイルskillsの構成)
- [依存関係の管理](#依存関係の管理)
- [Skillsのテスト方法](#skillsのテスト方法)
- [デバッグ手法](#デバッグ手法)
- [チームでの共有](#チームでの共有)
- [実践例](#実践例)
- [ベストプラクティス](#ベストプラクティス)

## カスタムSkillsを作る理由

カスタムSkillsは以下のような場面で有効です：

### 繰り返しのタスクの自動化
- コードレビューのチェックリスト実行
- 定型的なドキュメント生成
- テストコードの自動生成

### プロジェクト固有のワークフロー
- 社内コーディング規約のチェック
- 特定のフレームワーク向けの実装パターン
- カスタムビルド・デプロイプロセス

### チーム標準化
- 一貫した品質保証プロセス
- 統一されたドキュメントフォーマット
- 共通のベストプラクティス適用

### 専門知識のカプセル化
- 複雑なドメイン知識の再利用
- エキスパートのノウハウの共有
- 新メンバーのオンボーディング支援

## Skillsディレクトリ構造

Skillsは`.claude/skills/`ディレクトリに配置します：

```
.claude/
└── skills/
    ├── code-review/
    │   ├── SKILL.md              # メインSkillファイル
    │   ├── checklist.md          # サポートファイル
    │   └── examples/
    │       └── good-review.md
    ├── data-processor/
    │   ├── SKILL.md
    │   ├── scripts/
    │   │   └── transform.py
    │   └── templates/
    │       └── output.json
    └── doc-generator/
        ├── SKILL.md
        └── templates/
            ├── api-doc.md
            └── readme.md
```

### ディレクトリ命名規則

- **小文字とハイフン**: `code-review`, `api-generator`
- **説明的な名前**: Skillの目的が明確にわかる名前
- **短く簡潔に**: 2-3単語程度が理想的

## 基本的なSkillの作成

最小限のSkillは`SKILL.md`ファイル1つで構成されます。

### シンプルな例

`.claude/skills/hello-skill/SKILL.md`:

```markdown
---
skillName: hello-skill
displayName: Hello Skill
description: シンプルな挨拶Skillの例
version: 1.0.0
---

# Hello Skillタスク

ユーザーに挨拶して、このSkillが正常に動作していることを確認してください。

## 手順

1. "Hello from custom skill!"というメッセージを表示
2. 現在の日時を表示
3. 現在の作業ディレクトリを表示

明るく前向きなトーンで応答してください。
```

### Skillの実行

```bash
# コマンドラインから
claude skill hello-skill

# Claude Code内で
@skills use hello-skill
```

## YAMLフロントマター

`SKILL.md`ファイルの先頭には、YAMLフロントマターでメタデータを定義します。

### 必須フィールド

```yaml
---
skillName: my-skill        # Skill識別子（ディレクトリ名と同じ）
displayName: My Skill      # 表示名
description: Skillの説明   # 簡潔な説明文
version: 1.0.0            # セマンティックバージョニング
---
```

### オプションフィールド

```yaml
---
skillName: advanced-skill
displayName: Advanced Skill
description: 高度な機能を持つSkill
version: 2.1.0

# オプションフィールド
author: Your Name
category: development
tags:
  - testing
  - automation
  - quality-assurance

# 依存関係
requires:
  - node: ">=18.0.0"
  - npm: ">=9.0.0"

# サポートファイル
supportFiles:
  - scripts/test-runner.js
  - templates/report.html

# 環境変数
env:
  - TEST_MODE
  - API_ENDPOINT
---
```

### フィールド詳細

| フィールド | 必須 | 説明 | 例 |
|----------|------|------|-----|
| `skillName` | ✓ | Skill識別子 | `code-review` |
| `displayName` | ✓ | 表示名 | `Code Review Assistant` |
| `description` | ✓ | 簡潔な説明 | `コードレビューを支援` |
| `version` | ✓ | バージョン | `1.0.0` |
| `author` |  | 作成者 | `Team Name` |
| `category` |  | カテゴリ | `development` |
| `tags` |  | タグリスト | `[testing, ci]` |
| `requires` |  | 依存関係 | `node: ">=18"` |
| `supportFiles` |  | サポートファイル | `[scripts/run.sh]` |
| `env` |  | 環境変数 | `[API_KEY]` |

## 効果的な指示の書き方

Skillの指示は明確で実行可能である必要があります。

### 構造化された指示

```markdown
# タスク概要

簡潔にタスクの目的を説明します。

## 前提条件

- 必要なファイルやツール
- 実行前に確認すべき事項

## 手順

1. **最初のステップ**: 具体的な行動を記述
2. **次のステップ**: 詳細な説明を含める
3. **最終ステップ**: 期待される結果

## 制約事項

- 避けるべきこと
- 注意が必要な点

## 出力形式

期待される出力の形式を明示します。
```

### 良い例と悪い例

#### ❌ 悪い例（曖昧）

```markdown
コードをレビューしてください。
```

#### ✅ 良い例（具体的）

```markdown
# コードレビュータスク

指定されたファイルに対して以下の観点でレビューを実施してください：

## レビュー観点

1. **コード品質**
   - 命名規則の遵守
   - 適切なコメント
   - DRY原則の適用

2. **バグの可能性**
   - エラーハンドリングの欠如
   - ヌルチェック漏れ
   - 境界値テスト

3. **パフォーマンス**
   - 不要な計算
   - メモリリーク
   - 非効率なアルゴリズム

## 出力形式

各観点について以下の形式で報告してください：

- 重要度: 高/中/低
- 場所: ファイル名と行番号
- 問題: 具体的な指摘
- 推奨: 改善案

## 報告トーン

建設的でポジティブなフィードバックを心がけてください。
```

### コンテキストの提供

```markdown
# データ処理Skill

## プロジェクトコンテキスト

このプロジェクトは顧客データを処理する社内ツールです。
個人情報保護規則に準拠する必要があります。

## 処理ルール

1. **データバリデーション**
   - メールアドレスの形式チェック
   - 必須フィールドの確認
   - データ型の検証

2. **プライバシー保護**
   - ログに個人情報を出力しない
   - 機密データはマスキング
   - GDPR準拠

3. **エラーハンドリング**
   - すべてのエラーをログに記録
   - ユーザーフレンドリーなエラーメッセージ
   - フェイルセーフ機構

このコンテキストを常に考慮して実装してください。
```

## サポートファイルの追加

Skillは複数のファイルで構成できます。

### スクリプトの追加

`.claude/skills/test-runner/SKILL.md`:

```markdown
---
skillName: test-runner
displayName: Test Runner
description: 自動テスト実行とレポート生成
version: 1.0.0
supportFiles:
  - scripts/run-tests.sh
  - scripts/generate-report.js
---

# テスト実行タスク

## 手順

1. `scripts/run-tests.sh`を実行してテストを実行
2. テスト結果を解析
3. `scripts/generate-report.js`でレポート生成
4. 結果をユーザーに報告

## スクリプト使用方法

テストスクリプトは以下のように実行してください：

```bash
bash .claude/skills/test-runner/scripts/run-tests.sh
```

レポート生成：

```bash
node .claude/skills/test-runner/scripts/generate-report.js
```
```

`.claude/skills/test-runner/scripts/run-tests.sh`:

```bash
#!/bin/bash

# テスト実行スクリプト
set -e

echo "Running unit tests..."
npm test

echo "Running integration tests..."
npm run test:integration

echo "Running E2E tests..."
npm run test:e2e

echo "All tests completed successfully!"
```

`.claude/skills/test-runner/scripts/generate-report.js`:

```javascript
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// テスト結果を読み込み
const testResults = JSON.parse(
  fs.readFileSync('test-results.json', 'utf-8')
);

// レポート生成
const report = {
  timestamp: new Date().toISOString(),
  summary: {
    total: testResults.numTotalTests,
    passed: testResults.numPassedTests,
    failed: testResults.numFailedTests,
    coverage: testResults.coverageMap
  },
  details: testResults.testResults
};

// レポート保存
fs.writeFileSync(
  'test-report.json',
  JSON.stringify(report, null, 2)
);

console.log('Report generated: test-report.json');
```

### テンプレートの追加

`.claude/skills/doc-generator/SKILL.md`:

```markdown
---
skillName: doc-generator
displayName: Documentation Generator
description: API仕様書の自動生成
version: 1.0.0
supportFiles:
  - templates/api-doc.md
  - templates/readme.md
---

# ドキュメント生成タスク

## 手順

1. コードから関数やクラスを抽出
2. JSDocコメントを解析
3. `templates/api-doc.md`テンプレートを使用して文書化
4. 生成されたドキュメントを適切な場所に保存

## テンプレート使用方法

`templates/api-doc.md`の構造に従ってドキュメントを生成してください。
変数は以下の形式で置換します：

- `{{functionName}}`: 関数名
- `{{description}}`: 関数の説明
- `{{parameters}}`: パラメータリスト
- `{{returns}}`: 戻り値
- `{{examples}}`: 使用例
```

`.claude/skills/doc-generator/templates/api-doc.md`:

```markdown
# {{functionName}}

## 説明

{{description}}

## 構文

```{{language}}
{{signature}}
```

## パラメータ

{{parameters}}

## 戻り値

{{returns}}

## 例

{{examples}}

## 注意事項

{{notes}}

---

*自動生成日時: {{timestamp}}*
```

## 複雑なワークフローの実装

複数のステップを持つ複雑なワークフローを実装できます。

### マルチステージWorkflow

`.claude/skills/ci-pipeline/SKILL.md`:

```markdown
---
skillName: ci-pipeline
displayName: CI/CD Pipeline
description: 完全なCI/CDパイプラインの実行
version: 1.0.0
supportFiles:
  - stages/lint.sh
  - stages/test.sh
  - stages/build.sh
  - stages/deploy.sh
  - config/pipeline.json
---

# CI/CDパイプライン実行

## パイプライン概要

以下のステージを順番に実行します：

1. Lint（静的解析）
2. Test（テスト実行）
3. Build（ビルド）
4. Deploy（デプロイ）

各ステージは前のステージが成功した場合のみ実行されます。

## 実行手順

### Stage 1: Lint

```bash
bash .claude/skills/ci-pipeline/stages/lint.sh
```

- ESLintでコード品質をチェック
- TypeScriptの型チェック
- Prettierでフォーマット確認

**終了条件**: エラー0件

### Stage 2: Test

```bash
bash .claude/skills/ci-pipeline/stages/test.sh
```

- ユニットテスト実行
- 統合テスト実行
- カバレッジレポート生成（最低80%）

**終了条件**: すべてのテストがパス、カバレッジ80%以上

### Stage 3: Build

```bash
bash .claude/skills/ci-pipeline/stages/build.sh
```

- プロダクションビルド
- アセット最適化
- バンドルサイズチェック

**終了条件**: ビルド成功、バンドルサイズが制限内

### Stage 4: Deploy

```bash
bash .claude/skills/ci-pipeline/stages/deploy.sh
```

- ステージング環境にデプロイ
- スモークテスト実行
- プロダクション環境にデプロイ

**終了条件**: デプロイ成功、スモークテストパス

## エラーハンドリング

いずれかのステージが失敗した場合：

1. 失敗したステージを明確に報告
2. エラーログを表示
3. 次のステージは実行しない
4. ロールバック手順を提示

## 成功時の報告

すべてのステージが成功した場合：

1. 各ステージの実行時間を報告
2. 総実行時間を計算
3. デプロイされたバージョンを表示
4. デプロイURLを提供

## 設定ファイル

`config/pipeline.json`で各ステージの設定をカスタマイズできます。
```

### 条件分岐を含むSkill

`.claude/skills/smart-deploy/SKILL.md`:

```markdown
---
skillName: smart-deploy
displayName: Smart Deploy
description: 環境に応じた最適なデプロイ戦略
version: 1.0.0
---

# スマートデプロイ

## タスク概要

プロジェクトの状態と環境を分析し、最適なデプロイ戦略を自動選択します。

## 分析フェーズ

### 1. プロジェクトタイプの判定

以下を確認してプロジェクトタイプを判定：

- `package.json`の存在 → Node.jsプロジェクト
- `requirements.txt`の存在 → Pythonプロジェクト
- `Cargo.toml`の存在 → Rustプロジェクト
- `pom.xml`の存在 → Javaプロジェクト

### 2. デプロイ環境の判定

環境変数`DEPLOY_ENV`を確認：

- `development`: 開発環境
- `staging`: ステージング環境
- `production`: 本番環境

未設定の場合はユーザーに確認してください。

### 3. 変更範囲の分析

`git diff`で変更内容を確認：

- フロントエンドのみ変更 → フロントエンドデプロイ
- バックエンドのみ変更 → バックエンドデプロイ
- 両方変更 → フルデプロイ
- DBスキーマ変更あり → マイグレーション必要

## デプロイ戦略選択

### Node.jsプロジェクト

**開発環境**:
```bash
npm install
npm run dev
```

**ステージング環境**:
```bash
npm ci
npm run build
npm run preview
```

**本番環境**:
```bash
npm ci --production
npm run build
npm run deploy:prod
```

### Pythonプロジェクト

**開発環境**:
```bash
pip install -r requirements-dev.txt
python manage.py runserver
```

**本番環境**:
```bash
pip install -r requirements.txt
gunicorn app:app
```

## セーフティチェック

本番環境へのデプロイ前に以下を確認：

1. すべてのテストがパスしているか
2. ブランチが`main`または`master`か
3. 未コミットの変更がないか
4. 最新のコードをプルしているか
5. バージョンタグが付与されているか

1つでも満たさない場合はユーザーに確認を求めてください。

## デプロイ実行

選択された戦略に基づいてデプロイを実行し、以下を報告：

1. 選択されたデプロイ戦略と理由
2. 実行されたコマンドのリスト
3. デプロイ結果（成功/失敗）
4. デプロイ後のURL
5. ロールバック手順（失敗時）

## ロールバック

デプロイが失敗した場合の手順を自動生成します。
```

## マルチファイルSkillsの構成

大規模なSkillsは複数のファイルで構成します。

### 構造例

```
.claude/skills/full-stack-generator/
├── SKILL.md                    # メインSkill定義
├── README.md                   # Skill説明書
├── config/
│   ├── backend.json           # バックエンド設定
│   └── frontend.json          # フロントエンド設定
├── templates/
│   ├── backend/
│   │   ├── controller.ts
│   │   ├── service.ts
│   │   ├── model.ts
│   │   └── test.ts
│   ├── frontend/
│   │   ├── component.tsx
│   │   ├── hook.ts
│   │   ├── style.css
│   │   └── test.tsx
│   └── shared/
│       ├── types.ts
│       └── constants.ts
├── scripts/
│   ├── generate-backend.js    # バックエンド生成スクリプト
│   ├── generate-frontend.js   # フロントエンド生成スクリプト
│   ├── setup-database.js      # DB初期化
│   └── validate.js            # バリデーション
└── examples/
    ├── backend-example.ts
    └── frontend-example.tsx
```

### メインSkillファイル

`.claude/skills/full-stack-generator/SKILL.md`:

```markdown
---
skillName: full-stack-generator
displayName: Full Stack Generator
description: フロントエンドとバックエンドの完全なコード生成
version: 2.0.0
supportFiles:
  - config/backend.json
  - config/frontend.json
  - templates/**/*
  - scripts/**/*.js
---

# フルスタックコード生成

## 概要

このSkillはフロントエンドとバックエンドの完全なコードを生成します。

## 前提条件

- Node.js 18以上
- TypeScript 5以上
- データベース（PostgreSQL推奨）

## 使用方法

### 1. 要件の確認

ユーザーから以下の情報を収集：

- エンティティ名（例: User, Product）
- フィールド定義（名前、型、バリデーション）
- リレーション（他のエンティティとの関係）
- 必要なAPIエンドポイント

### 2. 設定の読み込み

```javascript
// バックエンド設定
const backendConfig = require('./config/backend.json');

// フロントエンド設定
const frontendConfig = require('./config/frontend.json');
```

### 3. バックエンド生成

`scripts/generate-backend.js`を実行：

```bash
node .claude/skills/full-stack-generator/scripts/generate-backend.js \
  --entity User \
  --fields "name:string,email:string,age:number"
```

生成されるファイル：
- `src/controllers/UserController.ts`
- `src/services/UserService.ts`
- `src/models/User.ts`
- `src/tests/User.test.ts`

### 4. フロントエンド生成

`scripts/generate-frontend.js`を実行：

```bash
node .claude/skills/full-stack-generator/scripts/generate-frontend.js \
  --entity User \
  --fields "name:string,email:string,age:number"
```

生成されるファイル：
- `src/components/UserList.tsx`
- `src/components/UserForm.tsx`
- `src/hooks/useUser.ts`
- `src/tests/UserList.test.tsx`

### 5. データベース初期化

`scripts/setup-database.js`を実行：

```bash
node .claude/skills/full-stack-generator/scripts/setup-database.js --entity User
```

マイグレーションファイルとシードデータを生成します。

### 6. バリデーション

`scripts/validate.js`で生成されたコードを検証：

```bash
node .claude/skills/full-stack-generator/scripts/validate.js
```

- TypeScript型チェック
- ESLintチェック
- テスト実行

### 7. 統合

生成されたコードをプロジェクトに統合：

1. インポート文を追加
2. ルーティングを設定
3. 型定義をエクスポート
4. テストを実行

## テンプレート説明

### バックエンドテンプレート

`templates/backend/controller.ts`: REST APIコントローラー
`templates/backend/service.ts`: ビジネスロジック
`templates/backend/model.ts`: データモデル
`templates/backend/test.ts`: ユニットテスト

### フロントエンドテンプレート

`templates/frontend/component.tsx`: Reactコンポーネント
`templates/frontend/hook.ts`: カスタムフック
`templates/frontend/style.css`: スタイル
`templates/frontend/test.tsx`: コンポーネントテスト

## カスタマイズ

設定ファイルを編集してテンプレートをカスタマイズできます：

- `config/backend.json`: バックエンドの設定
- `config/frontend.json`: フロントエンドの設定

## 例

`examples/`ディレクトリに完全な実装例があります。
```

## 依存関係の管理

Skillsの依存関係を明確に定義します。

### package.jsonの追加

`.claude/skills/my-skill/package.json`:

```json
{
  "name": "@skills/my-skill",
  "version": "1.0.0",
  "description": "My custom skill",
  "scripts": {
    "setup": "npm install",
    "validate": "node scripts/validate.js",
    "test": "jest"
  },
  "dependencies": {
    "lodash": "^4.17.21",
    "axios": "^1.6.0"
  },
  "devDependencies": {
    "jest": "^29.7.0"
  }
}
```

### セットアップスクリプト

`.claude/skills/my-skill/scripts/setup.sh`:

```bash
#!/bin/bash

# Skillのセットアップスクリプト
set -e

SKILL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "Setting up skill: my-skill"

# Node.jsバージョンチェック
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "Error: Node.js 18 or higher is required"
    exit 1
fi

# 依存関係のインストール
echo "Installing dependencies..."
cd "$SKILL_DIR"
npm install

# 検証
echo "Validating skill..."
npm run validate

echo "Setup completed successfully!"
```

### SKILL.mdでの依存関係記載

```markdown
---
skillName: my-skill
displayName: My Skill
description: カスタムSkill
version: 1.0.0
requires:
  - node: ">=18.0.0"
  - npm: ">=9.0.0"
---

# My Skillタスク

## セットアップ

初回実行時は以下のコマンドでセットアップしてください：

```bash
bash .claude/skills/my-skill/scripts/setup.sh
```

これにより必要な依存関係がインストールされます。

## 依存関係

このSkillは以下に依存しています：

- Node.js 18以上
- npm 9以上
- lodash: データ操作
- axios: HTTP通信

## 実行
...
```

## Skillsのテスト方法

Skillsを本番使用前にテストすることが重要です。

### テストチェックリスト

```markdown
# Skillテストチェックリスト

## 1. 基本動作テスト

- [ ] Skillが正常に読み込まれる
- [ ] YAMLフロントマターが正しくパースされる
- [ ] 指示が明確で理解可能

## 2. 機能テスト

- [ ] すべてのステップが実行される
- [ ] サポートファイルが正しく読み込まれる
- [ ] スクリプトが正常に実行される
- [ ] 期待される出力が得られる

## 3. エラーハンドリングテスト

- [ ] 無効な入力でエラーが適切に処理される
- [ ] 依存関係が不足している場合に警告される
- [ ] スクリプトエラーが適切に報告される

## 4. エッジケーステスト

- [ ] 空のファイルに対して動作する
- [ ] 大きなファイルに対して動作する
- [ ] 特殊文字を含むファイル名に対応

## 5. パフォーマンステスト

- [ ] 実行時間が許容範囲内
- [ ] メモリ使用量が適切
- [ ] 並行実行で問題ない
```

### テストスクリプト例

`.claude/skills/my-skill/tests/test-skill.sh`:

```bash
#!/bin/bash

# Skillテストスクリプト
set -e

SKILL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TEST_DIR="$SKILL_DIR/tests"

echo "Testing skill: my-skill"

# テスト1: 基本動作
echo "Test 1: Basic functionality"
claude skill my-skill --test-input "$TEST_DIR/fixtures/basic.json"

# テスト2: エラーハンドリング
echo "Test 2: Error handling"
claude skill my-skill --test-input "$TEST_DIR/fixtures/invalid.json" && exit 1 || echo "Expected error occurred"

# テスト3: エッジケース
echo "Test 3: Edge cases"
claude skill my-skill --test-input "$TEST_DIR/fixtures/empty.json"
claude skill my-skill --test-input "$TEST_DIR/fixtures/large.json"

echo "All tests passed!"
```

### ユニットテスト例

`.claude/skills/my-skill/tests/scripts.test.js`:

```javascript
const { generateCode } = require('../scripts/generate');
const { validate } = require('../scripts/validate');

describe('Code Generator', () => {
  test('generates valid TypeScript code', () => {
    const result = generateCode({
      entity: 'User',
      fields: ['name', 'email']
    });

    expect(result).toContain('interface User');
    expect(result).toContain('name: string');
    expect(result).toContain('email: string');
  });

  test('validates generated code', () => {
    const code = 'interface User { name: string; }';
    const result = validate(code);

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('handles invalid input', () => {
    expect(() => {
      generateCode({ entity: '', fields: [] });
    }).toThrow('Entity name is required');
  });
});
```

## デバッグ手法

Skillのデバッグに役立つテクニック。

### デバッグモード

`.claude/skills/my-skill/SKILL.md`:

```markdown
---
skillName: my-skill
displayName: My Skill
description: デバッグ対応Skill
version: 1.0.0
env:
  - DEBUG_MODE
---

# My Skillタスク

## デバッグモード

環境変数`DEBUG_MODE=true`を設定するとデバッグ情報を出力します。

```bash
DEBUG_MODE=true claude skill my-skill
```

## 手順

1. **入力の検証**
   ```bash
   # DEBUG_MODEがtrueの場合、入力内容を詳細に出力
   if [ "$DEBUG_MODE" = "true" ]; then
     echo "Debug: Input parameters:"
     echo "$INPUT_PARAMS" | jq .
   fi
   ```

2. **処理の実行**
   ```bash
   # デバッグログを出力しながら実行
   ```

3. **結果の確認**
   ```bash
   # DEBUG_MODEがtrueの場合、中間結果を出力
   ```
```

### ログ出力

`.claude/skills/my-skill/scripts/debug.js`:

```javascript
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// デバッグモードチェック
const DEBUG = process.env.DEBUG_MODE === 'true';

// ログ関数
function log(level, message, data = null) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    message,
    data
  };

  // コンソール出力
  if (DEBUG || level === 'ERROR') {
    console.error(JSON.stringify(logEntry, null, 2));
  }

  // ファイル出力
  const logFile = path.join(__dirname, '../logs/debug.log');
  fs.appendFileSync(
    logFile,
    JSON.stringify(logEntry) + '\n'
  );
}

// エクスポート
module.exports = {
  debug: (msg, data) => log('DEBUG', msg, data),
  info: (msg, data) => log('INFO', msg, data),
  warn: (msg, data) => log('WARN', msg, data),
  error: (msg, data) => log('ERROR', msg, data)
};
```

使用例：

```javascript
const logger = require('./debug');

logger.debug('Processing started', { input: params });
logger.info('Step 1 completed');
logger.warn('Performance issue detected', { duration: 5000 });
logger.error('Operation failed', { error: err.message });
```

### トレース機能

```bash
#!/bin/bash

# トレース有効化
set -x  # すべてのコマンドを出力

# 処理
echo "Starting process..."
process_data

# トレース無効化
set +x
```

## チームでの共有

Skillsをチームで効果的に共有する方法。

### リポジトリ構造

```
project/
├── .claude/
│   └── skills/
│       ├── team-review/        # チーム標準レビュー
│       ├── deploy/             # デプロイフロー
│       └── onboarding/         # 新人オンボーディング
└── README.md
```

### ドキュメント作成

`.claude/skills/team-review/README.md`:

```markdown
# Team Code Review Skill

## 概要

チームのコードレビュー基準に基づいた自動レビューSkillです。

## 使用方法

```bash
claude skill team-review
```

または Claude Code内で：

```
@skills use team-review
```

## レビュー観点

このSkillは以下の観点でレビューします：

1. **コーディング規約**
   - 命名規則（camelCase, PascalCase）
   - インデント（スペース2個）
   - 行の長さ（最大100文字）

2. **コード品質**
   - 循環的複雑度（最大10）
   - 関数の長さ（最大50行）
   - コメントの適切さ

3. **セキュリティ**
   - SQL injection対策
   - XSS対策
   - 機密情報のハードコード

4. **パフォーマンス**
   - N+1クエリ
   - 不要なループ
   - メモリリーク

## カスタマイズ

チーム固有のルールは`config/rules.json`で設定できます。

## バージョン履歴

- v1.0.0 (2024-01-15): 初版リリース
- v1.1.0 (2024-02-01): セキュリティチェック追加
- v1.2.0 (2024-03-01): パフォーマンスチェック追加

## 問い合わせ

質問や改善提案は[チームSlack #dev-tools]まで。
```

### バージョン管理

#### セマンティックバージョニング

```
MAJOR.MINOR.PATCH

例: 2.1.3
  2: メジャーバージョン（破壊的変更）
  1: マイナーバージョン（新機能追加）
  3: パッチバージョン（バグ修正）
```

#### CHANGELOG.md

`.claude/skills/team-review/CHANGELOG.md`:

```markdown
# Changelog

All notable changes to this skill will be documented in this file.

## [1.2.0] - 2024-03-01

### Added
- パフォーマンスチェック機能
- メモリリーク検出
- N+1クエリ警告

### Changed
- レポートフォーマットをJSON対応に改善
- エラーメッセージをより詳細に

### Fixed
- 特殊文字を含むファイル名の処理バグ

## [1.1.0] - 2024-02-01

### Added
- セキュリティチェック機能
- SQL injection検出
- XSS脆弱性警告

## [1.0.0] - 2024-01-15

### Added
- 初版リリース
- 基本的なコード品質チェック
- コーディング規約チェック
```

### Git管理

```bash
# Skillsをコミット
git add .claude/skills/
git commit -m "Add team-review skill v1.2.0"
git tag skills/team-review/v1.2.0
git push origin main --tags

# チームメンバーが更新を取得
git pull
git fetch --tags
```

### 共有のベストプラクティス

1. **明確なドキュメント**: READMEとCHANGELOGを必ず提供
2. **バージョン管理**: セマンティックバージョニングを使用
3. **テスト**: 本番投入前に十分テスト
4. **レビュー**: Skillの変更もコードレビュー対象に
5. **通知**: 重要な変更はチームに周知

## 実践例

ここからは実際の業務で使える完全実装例を紹介します。

### 例1: コードレビューSkill

`.claude/skills/code-review/SKILL.md`:

```markdown
---
skillName: code-review
displayName: Code Review Assistant
description: 包括的なコードレビューを実施
version: 1.0.0
category: quality-assurance
tags:
  - review
  - quality
  - best-practices
supportFiles:
  - checklist.md
  - examples/good-review.md
---

# コードレビュータスク

## 目的

Pull Requestまたは指定されたファイルに対して、包括的なコードレビューを実施します。

## レビュープロセス

### Phase 1: 変更内容の理解

1. **変更されたファイルの特定**
   ```bash
   git diff --name-only origin/main...HEAD
   ```

2. **変更の規模を確認**
   ```bash
   git diff --stat origin/main...HEAD
   ```

3. **コミットメッセージを確認**
   ```bash
   git log origin/main..HEAD --oneline
   ```

### Phase 2: コード品質チェック

`checklist.md`の項目に従ってレビューを実施してください。

#### 2.1 コーディングスタイル

- [ ] 命名規則の遵守
  - 変数: camelCase
  - 定数: UPPER_SNAKE_CASE
  - クラス: PascalCase
  - プライベートメソッド: _prefixWithUnderscore

- [ ] インデントの一貫性
  - スペース2個（JavaScript/TypeScript）
  - スペース4個（Python）

- [ ] 行の長さ
  - 最大100文字を推奨
  - 120文字を超えない

#### 2.2 コード構造

- [ ] 関数の責任が単一か
- [ ] クラスの責任が明確か
- [ ] 適切な抽象化レベルか
- [ ] DRY原則の遵守

#### 2.3 エラーハンドリング

- [ ] try-catchが適切に使用されているか
- [ ] エラーメッセージが明確か
- [ ] エラーログが適切に記録されるか
- [ ] ユーザーフレンドリーなエラー表示か

#### 2.4 テストカバレッジ

- [ ] 新規コードにユニットテストがあるか
- [ ] エッジケースがテストされているか
- [ ] モックが適切に使用されているか
- [ ] テストが読みやすいか

#### 2.5 パフォーマンス

- [ ] 不要な計算の繰り返しがないか
- [ ] 効率的なデータ構造を使用しているか
- [ ] メモリリークの可能性がないか
- [ ] 非同期処理が適切か

#### 2.6 セキュリティ

- [ ] 入力バリデーションが実装されているか
- [ ] SQLインジェクション対策があるか
- [ ] XSS対策が実装されているか
- [ ] 機密情報がハードコードされていないか
- [ ] 認証・認可が適切か

### Phase 3: レビューレポート作成

以下の形式でレビュー結果を報告してください：

```markdown
# コードレビューレポート

## 概要

- **レビュー対象**: [ブランチ名/PR番号]
- **変更ファイル数**: [数]
- **追加行数**: [数]
- **削除行数**: [数]
- **レビュー日時**: [日時]

## 総合評価

[優/良/可/要改善]

## 詳細レビュー

### 良い点

1. **[観点]**
   - ファイル: `[ファイル名]:[行番号]`
   - 内容: [具体的な良い点]

2. ...

### 改善提案

#### 重要度: 高

1. **[問題点]**
   - ファイル: `[ファイル名]:[行番号]`
   - 現状: [現在のコード]
   - 問題: [何が問題か]
   - 推奨: [改善案]
   - 理由: [なぜ改善すべきか]

#### 重要度: 中

1. ...

#### 重要度: 低（任意）

1. ...

### セキュリティ関連

[セキュリティ上の懸念があれば詳細に記載]

### パフォーマンス関連

[パフォーマンス上の懸念があれば詳細に記載]

## 次のアクション

- [ ] [必須対応事項1]
- [ ] [必須対応事項2]
- [ ] [推奨対応事項1]

## 参考資料

- [関連ドキュメント]
- [コーディングガイドライン]
```

## レビューのトーン

- **建設的**: 問題を指摘するだけでなく、解決策を提示
- **ポジティブ**: 良い点も積極的に評価
- **明確**: 曖昧な表現を避け、具体的に
- **教育的**: なぜそうすべきかの理由を説明

## 参考資料

良いレビューの例は`examples/good-review.md`を参照してください。
```

`.claude/skills/code-review/checklist.md`:

```markdown
# コードレビューチェックリスト

## 機能性

- [ ] 要件を満たしているか
- [ ] エッジケースが処理されているか
- [ ] エラーハンドリングが適切か

## コード品質

- [ ] 読みやすく理解しやすいか
- [ ] 適切にコメントされているか
- [ ] 命名が明確で一貫しているか
- [ ] 複雑度が適切か

## テスト

- [ ] ユニットテストがあるか
- [ ] テストカバレッジが十分か
- [ ] テストが意味のあるケースをカバーしているか

## セキュリティ

- [ ] 入力バリデーションがあるか
- [ ] 認証・認可が適切か
- [ ] 機密情報が保護されているか

## パフォーマンス

- [ ] 効率的なアルゴリズムか
- [ ] リソース使用が最適化されているか
- [ ] スケーラビリティが考慮されているか

## ドキュメント

- [ ] APIドキュメントが更新されているか
- [ ] READMEが更新されているか
- [ ] 変更ログが記録されているか
```

### 例2: データ処理Skill

`.claude/skills/data-processor/SKILL.md`:

```markdown
---
skillName: data-processor
displayName: Data Processor
description: CSVやJSONデータの変換・検証・処理
version: 1.0.0
category: data
tags:
  - data
  - etl
  - validation
supportFiles:
  - scripts/transform.py
  - scripts/validate.py
  - templates/output.json
  - schemas/input-schema.json
---

# データ処理タスク

## 概要

CSV、JSON、XMLなどの構造化データを読み込み、変換、検証、処理します。

## サポートされる形式

### 入力形式
- CSV (`.csv`)
- JSON (`.json`)
- XML (`.xml`)
- Excel (`.xlsx`)

### 出力形式
- JSON
- CSV
- Parquet
- SQLite

## 処理フロー

### Step 1: データ読み込み

```bash
# ファイルの特定
ls -la data/

# ファイル形式の確認
file data/input.*
```

ユーザーに以下を確認：
- 入力ファイルのパス
- データ形式
- 文字エンコーディング（デフォルト: UTF-8）

### Step 2: データ検証

`scripts/validate.py`を使用してデータを検証：

```bash
python .claude/skills/data-processor/scripts/validate.py \
  --input data/input.csv \
  --schema schemas/input-schema.json
```

検証項目：
- [ ] スキーマの一致
- [ ] 必須フィールドの存在
- [ ] データ型の正確性
- [ ] 値の範囲チェック
- [ ] 重複レコードの検出

検証エラーがあれば詳細を報告し、処理を中断してください。

### Step 3: データ変換

`scripts/transform.py`でデータを変換：

```bash
python .claude/skills/data-processor/scripts/transform.py \
  --input data/input.csv \
  --output data/output.json \
  --template templates/output.json
```

変換処理：
1. **フィールドマッピング**
   - 入力フィールド名を出力フィールド名にマッピング
   - 型変換（string → number, date, etc.）

2. **データクリーニング**
   - 空白の除去
   - NULLの処理
   - 文字エンコーディング正規化

3. **データエンリッチメント**
   - 計算フィールドの追加
   - ルックアップテーブルとの結合
   - 派生値の生成

4. **データ集約**
   - グループ化
   - 集計（sum, avg, count, etc.）
   - ピボット操作

### Step 4: 品質チェック

変換後のデータを検証：

```python
# レコード数の確認
assert len(output_data) == len(input_data)

# データ型の確認
for record in output_data:
    assert isinstance(record['id'], int)
    assert isinstance(record['amount'], float)

# 値の範囲確認
for record in output_data:
    assert 0 <= record['amount'] <= 1000000
```

### Step 5: 出力

処理結果を指定された形式で出力：

```bash
# JSON出力
{
  "metadata": {
    "processed_at": "2024-03-15T10:30:00Z",
    "input_file": "data/input.csv",
    "input_records": 1000,
    "output_records": 950,
    "errors": 50
  },
  "data": [...]
}

# CSV出力
id,name,amount,date
1,Item A,100.50,2024-03-15
2,Item B,200.75,2024-03-15
```

### Step 6: レポート作成

処理結果のサマリーを作成：

```markdown
# データ処理レポート

## 処理概要

- **入力ファイル**: data/input.csv
- **出力ファイル**: data/output.json
- **処理日時**: 2024-03-15 10:30:00
- **実行時間**: 2.5秒

## 処理統計

- **入力レコード数**: 1,000
- **出力レコード数**: 950
- **スキップレコード数**: 50
- **エラーレコード数**: 0

## データ品質

- **完全性**: 95%
- **正確性**: 100%
- **一貫性**: 100%

## エラー詳細

### スキップされたレコード

1. 行 23: 必須フィールド'email'が欠損
2. 行 45: 無効な日付形式
...

## 変換ルール適用結果

- ルール1 (名前正規化): 1,000件適用
- ルール2 (金額丸め): 950件適用
- ルール3 (カテゴリ分類): 950件適用

## 推奨事項

1. 入力データの品質を改善（5%のスキップ率）
2. エラーログを確認して根本原因を特定
3. データソースとバリデーションルールの見直し
```

## スクリプト実装

### validate.py

```python
#!/usr/bin/env python3
import json
import sys
import argparse
from jsonschema import validate, ValidationError

def load_schema(schema_path):
    with open(schema_path, 'r') as f:
        return json.load(f)

def load_data(input_path):
    # CSV, JSON, XMLなどの読み込み
    # 実装省略
    pass

def validate_data(data, schema):
    errors = []
    for idx, record in enumerate(data):
        try:
            validate(instance=record, schema=schema)
        except ValidationError as e:
            errors.append({
                'record': idx,
                'error': str(e)
            })
    return errors

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--input', required=True)
    parser.add_argument('--schema', required=True)
    args = parser.parse_args()

    schema = load_schema(args.schema)
    data = load_data(args.input)
    errors = validate_data(data, schema)

    if errors:
        print(f"Validation failed: {len(errors)} errors")
        for error in errors[:10]:  # 最初の10件を表示
            print(f"  Record {error['record']}: {error['error']}")
        sys.exit(1)
    else:
        print("Validation passed")
        sys.exit(0)

if __name__ == '__main__':
    main()
```

### transform.py

```python
#!/usr/bin/env python3
import json
import csv
import argparse
from datetime import datetime

def transform_record(record, mapping):
    """レコードを変換"""
    result = {}
    for output_field, config in mapping.items():
        input_field = config.get('source')
        transform_func = config.get('transform')

        value = record.get(input_field)

        if transform_func == 'uppercase':
            value = value.upper()
        elif transform_func == 'lowercase':
            value = value.lower()
        elif transform_func == 'to_float':
            value = float(value)
        elif transform_func == 'parse_date':
            value = datetime.strptime(value, '%Y-%m-%d').isoformat()

        result[output_field] = value

    return result

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--input', required=True)
    parser.add_argument('--output', required=True)
    parser.add_argument('--template', required=True)
    args = parser.parse_args()

    # マッピング読み込み
    with open(args.template, 'r') as f:
        mapping = json.load(f)

    # データ読み込み
    with open(args.input, 'r') as f:
        reader = csv.DictReader(f)
        data = list(reader)

    # 変換
    transformed = [transform_record(r, mapping) for r in data]

    # 出力
    with open(args.output, 'w') as f:
        json.dump(transformed, f, indent=2)

    print(f"Transformed {len(transformed)} records")

if __name__ == '__main__':
    main()
```

## エラーハンドリング

すべてのステップでエラーを適切に処理：

1. **ファイルが見つからない**: パスを確認し、ユーザーに正しいパスを尋ねる
2. **フォーマットエラー**: サポートされる形式を提示
3. **スキーマ検証失敗**: 詳細なエラーメッセージと修正方法を提供
4. **変換エラー**: 問題のあるレコードをスキップし、ログに記録
5. **出力エラー**: ディスク容量や書き込み権限を確認
```

### 例3: ドキュメント生成Skill

`.claude/skills/doc-generator/SKILL.md`:

```markdown
---
skillName: doc-generator
displayName: Documentation Generator
description: コードからAPIドキュメントと使用ガイドを自動生成
version: 1.0.0
category: documentation
tags:
  - documentation
  - api
  - automation
supportFiles:
  - templates/api-doc.md
  - templates/readme.md
  - templates/changelog.md
  - scripts/extract-jsdoc.js
---

# ドキュメント生成タスク

## 概要

ソースコードから以下のドキュメントを自動生成します：

1. API仕様書
2. READMEファイル
3. CHANGELOGファイル
4. 使用例ドキュメント

## 生成プロセス

### Phase 1: コード解析

#### 1.1 プロジェクト構造の把握

```bash
# ファイル構造の確認
tree -L 3 -I 'node_modules|dist|build'

# 主要ファイルの特定
find . -name "*.ts" -o -name "*.js" -o -name "*.py" | head -20
```

#### 1.2 エントリーポイントの特定

- `package.json`の`main`フィールド
- `index.ts`または`index.js`
- READMEに記載されたエントリーポイント

#### 1.3 公開APIの抽出

```bash
# JSDocコメントの抽出
node .claude/skills/doc-generator/scripts/extract-jsdoc.js \
  --src src/ \
  --output api-data.json
```

抽出対象：
- エクスポートされた関数
- 公開クラスとメソッド
- 型定義とインターフェース
- 定数とEnums

### Phase 2: API仕様書生成

`templates/api-doc.md`を使用してAPI仕様書を生成します。

#### 構造

```markdown
# API仕様書

## 概要

[プロジェクトの簡単な説明]

## インストール

```bash
npm install [package-name]
```

## 基本的な使用方法

```javascript
// 簡単な使用例
```

## API リファレンス

### 関数

#### functionName(param1, param2)

**説明**: [関数の説明]

**パラメータ**:
- `param1` (型): 説明
- `param2` (型): 説明

**戻り値**: 戻り値の説明

**例**:
```javascript
const result = functionName('value1', 123);
console.log(result);
```

**注意事項**:
- 重要な注意点

---

### クラス

#### ClassName

**説明**: [クラスの説明]

**コンストラクタ**:
```javascript
new ClassName(options)
```

**パラメータ**:
- `options` (Object): 設定オプション
  - `option1` (string): 説明
  - `option2` (number): 説明

**メソッド**:

##### methodName(param)

説明とパラメータ...

**例**:
```javascript
const instance = new ClassName({ option1: 'value' });
instance.methodName(param);
```

---

### 型定義

#### InterfaceName

```typescript
interface InterfaceName {
  field1: string;
  field2: number;
  field3?: boolean;
}
```

**フィールド**:
- `field1` (string, 必須): 説明
- `field2` (number, 必須): 説明
- `field3` (boolean, オプション): 説明

## エラーハンドリング

[エラーの種類とハンドリング方法]

## 高度な使用例

[複雑なユースケース]

## FAQ

### Q1: [質問]
A: [回答]

## 変更履歴

[CHANGELOG.mdへのリンク]
```

#### テンプレート変数の置換

`templates/api-doc.md`内の変数を実際の値で置換：

- `{{projectName}}`: プロジェクト名
- `{{description}}`: プロジェクト説明
- `{{version}}`: バージョン番号
- `{{functions}}`: 関数リスト
- `{{classes}}`: クラスリスト
- `{{types}}`: 型定義リスト
- `{{examples}}`: 使用例

### Phase 3: README生成

プロジェクトのREADME.mdを生成または更新します。

#### README構造

```markdown
# [Project Name]

[バッジ: ビルド状態、カバレッジ、バージョンなど]

## 概要

[プロジェクトの簡潔な説明（2-3文）]

## 特徴

- 特徴1
- 特徴2
- 特徴3

## インストール

```bash
npm install [package-name]
```

## クイックスタート

```javascript
// 最も基本的な使用例
```

## ドキュメント

- [API仕様書](docs/api.md)
- [使用ガイド](docs/guide.md)
- [変更履歴](CHANGELOG.md)

## 使用例

### 例1: [ユースケース]

```javascript
// コード例
```

### 例2: [別のユースケース]

```javascript
// コード例
```

## 開発

### 要件

- Node.js 18以上
- npm 9以上

### セットアップ

```bash
git clone https://github.com/user/repo.git
cd repo
npm install
```

### テスト

```bash
npm test
```

### ビルド

```bash
npm run build
```

## 貢献

プルリクエストを歓迎します。大きな変更の場合は、まずissueを開いて変更内容を議論してください。

## ライセンス

[MIT](LICENSE)

## クレジット

- [貢献者リスト]
- [使用ライブラリ]
```

### Phase 4: CHANGELOG生成

既存のgitコミットからCHANGELOG.mdを生成または更新します。

```bash
# コミット履歴の取得
git log --oneline --no-merges

# タグの取得
git tag -l
```

#### CHANGELOG形式

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- 新機能1
- 新機能2

### Changed
- 変更内容1

### Deprecated
- 非推奨の機能

### Removed
- 削除された機能

### Fixed
- バグ修正1

### Security
- セキュリティ修正

## [1.2.0] - 2024-03-01

### Added
- 機能追加

### Fixed
- バグ修正

## [1.1.0] - 2024-02-01

...

## [1.0.0] - 2024-01-01

初回リリース
```

#### コミットメッセージの分類

コミットメッセージを解析して適切なセクションに分類：

- `feat:` → Added
- `fix:` → Fixed
- `docs:` → Documentation
- `style:` → Changed
- `refactor:` → Changed
- `perf:` → Changed
- `test:` → Added
- `chore:` → Changed
- `security:` → Security

### Phase 5: 使用例ドキュメント

実際のコードから使用例を抽出して整理します。

```markdown
# 使用例ガイド

## 基本的な使用パターン

### パターン1: [ユースケース名]

**状況**: [どんな時に使うか]

**実装**:
```javascript
// コード例
```

**説明**: [コードの解説]

**結果**: [期待される出力]

---

## 高度な使用パターン

### パターン2: [複雑なユースケース]

...

## ベストプラクティス

1. **推奨事項1**
   - 理由
   - 実装例

2. **推奨事項2**
   - 理由
   - 実装例

## アンチパターン

### ❌ 避けるべきパターン1

```javascript
// 悪い例
```

**問題**: なぜこれが問題か

### ✅ 推奨される代替案

```javascript
// 良い例
```

**利点**: なぜこちらが良いか

## トラブルシューティング

### 問題1: [よくある問題]

**症状**: [どんなエラーが出るか]

**原因**: [なぜ発生するか]

**解決方法**:
```javascript
// 修正コード
```
```

## スクリプト実装

### extract-jsdoc.js

```javascript
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const ts = require('typescript');

/**
 * TypeScriptファイルからJSDocを抽出
 */
function extractJSDoc(filePath) {
  const sourceCode = fs.readFileSync(filePath, 'utf-8');
  const sourceFile = ts.createSourceFile(
    filePath,
    sourceCode,
    ts.ScriptTarget.Latest,
    true
  );

  const exports = [];

  function visit(node) {
    // エクスポートされた関数
    if (ts.isFunctionDeclaration(node) && hasExportModifier(node)) {
      exports.push(extractFunction(node, sourceFile));
    }

    // エクスポートされたクラス
    if (ts.isClassDeclaration(node) && hasExportModifier(node)) {
      exports.push(extractClass(node, sourceFile));
    }

    // エクスポートされたインターフェース
    if (ts.isInterfaceDeclaration(node) && hasExportModifier(node)) {
      exports.push(extractInterface(node, sourceFile));
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return exports;
}

function hasExportModifier(node) {
  return node.modifiers?.some(
    m => m.kind === ts.SyntaxKind.ExportKeyword
  );
}

function extractFunction(node, sourceFile) {
  const jsDocTags = ts.getJSDocTags(node);

  return {
    type: 'function',
    name: node.name?.text,
    description: getJSDocDescription(node),
    parameters: extractParameters(node),
    returnType: extractReturnType(node, sourceFile),
    examples: extractExamples(jsDocTags)
  };
}

function extractClass(node, sourceFile) {
  return {
    type: 'class',
    name: node.name?.text,
    description: getJSDocDescription(node),
    constructor: extractConstructor(node),
    methods: extractMethods(node, sourceFile),
    properties: extractProperties(node)
  };
}

function extractInterface(node, sourceFile) {
  return {
    type: 'interface',
    name: node.name?.text,
    description: getJSDocDescription(node),
    properties: node.members.map(m => ({
      name: m.name?.text,
      type: m.type ? m.type.getText(sourceFile) : 'any',
      optional: !!m.questionToken,
      description: getJSDocDescription(m)
    }))
  };
}

function getJSDocDescription(node) {
  const jsDocs = ts.getJSDocCommentsAndTags(node);
  if (jsDocs.length > 0) {
    const comment = jsDocs[0].comment;
    return typeof comment === 'string' ? comment : '';
  }
  return '';
}

function extractParameters(node) {
  return node.parameters.map(p => ({
    name: p.name.text,
    type: p.type ? p.type.getText() : 'any',
    optional: !!p.questionToken,
    description: '' // JSDocのparamタグから抽出可能
  }));
}

function extractReturnType(node, sourceFile) {
  if (node.type) {
    return node.type.getText(sourceFile);
  }
  return 'void';
}

function extractExamples(jsDocTags) {
  return jsDocTags
    .filter(tag => tag.tagName.text === 'example')
    .map(tag => tag.comment);
}

// メイン処理
function main() {
  const args = process.argv.slice(2);
  const srcDir = args[args.indexOf('--src') + 1];
  const outputFile = args[args.indexOf('--output') + 1];

  const files = findTypeScriptFiles(srcDir);
  const allExports = {};

  files.forEach(file => {
    allExports[file] = extractJSDoc(file);
  });

  fs.writeFileSync(
    outputFile,
    JSON.stringify(allExports, null, 2)
  );

  console.log(`Extracted JSDoc from ${files.length} files`);
}

function findTypeScriptFiles(dir) {
  const files = [];

  function walk(currentPath) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);

      if (entry.isDirectory()) {
        if (entry.name !== 'node_modules' && entry.name !== 'dist') {
          walk(fullPath);
        }
      } else if (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) {
        files.push(fullPath);
      }
    }
  }

  walk(dir);
  return files;
}

if (require.main === module) {
  main();
}
```

## 実行例

```bash
# ドキュメント生成
claude skill doc-generator

# 対話形式で情報を収集し、ドキュメントを生成
```

期待される出力：
- `docs/api.md`: API仕様書
- `README.md`: 更新されたREADME
- `CHANGELOG.md`: 更新されたCHANGELOG
- `docs/examples.md`: 使用例ガイド
```

### 例4: テスト自動生成Skill

`.claude/skills/test-generator/SKILL.md`:

```markdown
---
skillName: test-generator
displayName: Test Generator
description: コードからユニットテストとE2Eテストを自動生成
version: 1.0.0
category: testing
tags:
  - testing
  - automation
  - quality
supportFiles:
  - templates/unit-test.ts
  - templates/integration-test.ts
  - templates/e2e-test.ts
  - scripts/analyze-code.js
---

# テスト自動生成タスク

## 概要

既存のコードを解析し、包括的なテストコードを自動生成します。

## サポートするテストタイプ

1. **ユニットテスト**: 個別の関数やメソッドのテスト
2. **統合テスト**: 複数のモジュール間の連携テスト
3. **E2Eテスト**: エンドツーエンドのシナリオテスト

## サポートするテストフレームワーク

- Jest (JavaScript/TypeScript)
- Vitest (Vite projects)
- Pytest (Python)
- JUnit (Java)

## 生成プロセス

### Phase 1: コード解析

#### 1.1 対象ファイルの特定

ユーザーに以下を確認：
- テスト対象のファイルまたはディレクトリ
- 既存のテストファイルの確認

```bash
# テスト対象ファイルの確認
ls -la src/

# 既存のテストファイルの確認
find . -name "*.test.ts" -o -name "*.spec.ts"
```

#### 1.2 コード構造の解析

`scripts/analyze-code.js`を使用してコードを解析：

```bash
node .claude/skills/test-generator/scripts/analyze-code.js \
  --file src/utils/validation.ts \
  --output analysis.json
```

抽出する情報：
- 関数のシグネチャ
- パラメータの型
- 戻り値の型
- 依存関係（imports）
- JSDocコメント

### Phase 2: テストケースの設計

各関数に対して以下のテストケースを設計：

#### 2.1 正常系テスト

```typescript
/**
 * 関数: validateEmail(email: string): boolean
 */

// 正常系テストケース
test('有効なメールアドレスを受け入れる', () => {
  expect(validateEmail('user@example.com')).toBe(true);
  expect(validateEmail('test.user@domain.co.jp')).toBe(true);
});
```

#### 2.2 異常系テスト

```typescript
test('無効なメールアドレスを拒否する', () => {
  expect(validateEmail('invalid')).toBe(false);
  expect(validateEmail('test@')).toBe(false);
  expect(validateEmail('@example.com')).toBe(false);
});
```

#### 2.3 境界値テスト

```typescript
test('境界値を正しく処理する', () => {
  // 空文字列
  expect(validateEmail('')).toBe(false);

  // 最大長
  const longEmail = 'a'.repeat(64) + '@' + 'b'.repeat(63) + '.com';
  expect(validateEmail(longEmail)).toBe(true);
});
```

#### 2.4 エッジケーステスト

```typescript
test('エッジケースを処理する', () => {
  // 特殊文字
  expect(validateEmail('user+tag@example.com')).toBe(true);

  // Unicode文字
  expect(validateEmail('user@例え.jp')).toBe(true);

  // 複数の@
  expect(validateEmail('user@@example.com')).toBe(false);
});
```

### Phase 3: テストコード生成

#### 3.1 ユニットテストの生成

`templates/unit-test.ts`を使用してテストを生成：

```typescript
import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { {{functionName}} } from '../{{sourcePath}}';

describe('{{functionName}}', () => {
  // 正常系テスト
  describe('正常系', () => {
    test('{{testCase1Description}}', () => {
      // Arrange
      const input = {{testCase1Input}};
      const expected = {{testCase1Expected}};

      // Act
      const result = {{functionName}}(input);

      // Assert
      expect(result).toBe(expected);
    });

    test('{{testCase2Description}}', () => {
      // 実装
    });
  });

  // 異常系テスト
  describe('異常系', () => {
    test('{{errorCase1Description}}', () => {
      // Arrange
      const invalidInput = {{errorCase1Input}};

      // Act & Assert
      expect(() => {
        {{functionName}}(invalidInput);
      }).toThrow({{expectedError}});
    });
  });

  // 境界値テスト
  describe('境界値', () => {
    test('{{boundaryCase1Description}}', () => {
      // 実装
    });
  });
});
```

#### 3.2 統合テストの生成

複数のモジュールを組み合わせたテスト：

```typescript
import { describe, test, expect } from 'vitest';
import { {{module1}}, {{module2}} } from '../{{path}}';

describe('{{module1}} と {{module2}} の統合', () => {
  test('{{integrationScenario}}', async () => {
    // Arrange: テストデータのセットアップ
    const testData = {{setupData}};

    // Act: 統合処理の実行
    const step1Result = await {{module1}}.process(testData);
    const finalResult = await {{module2}}.process(step1Result);

    // Assert: 期待される結果の検証
    expect(finalResult).toMatchObject({{expectedResult}});
  });
});
```

#### 3.3 E2Eテストの生成

```typescript
import { test, expect } from '@playwright/test';

test.describe('{{featureName}}', () => {
  test('{{userScenario}}', async ({ page }) => {
    // Given: 初期状態
    await page.goto('{{url}}');

    // When: ユーザー操作
    await page.fill('{{inputSelector}}', '{{testValue}}');
    await page.click('{{buttonSelector}}');

    // Then: 期待される結果
    await expect(page.locator('{{resultSelector}}')).toHaveText('{{expectedText}}');
  });
});
```

### Phase 4: モックの生成

外部依存をモックするコードを生成：

```typescript
import { vi } from 'vitest';
import type { {{DependencyType}} } from '../types';

// モックの作成
const mock{{DependencyName}} = vi.fn<{{DependencyType}}>(() => ({
  method1: vi.fn().mockResolvedValue({{mockValue1}}),
  method2: vi.fn().mockResolvedValue({{mockValue2}})
}));

// テストでの使用
describe('{{functionName}} with mocks', () => {
  let dependency: {{DependencyType}};

  beforeEach(() => {
    dependency = mock{{DependencyName}}();
  });

  test('{{testCase}}', async () => {
    // テスト実装
  });
});
```

### Phase 5: テストカバレッジの確認

生成されたテストのカバレッジを確認：

```bash
# カバレッジ実行
npm run test:coverage

# カバレッジレポートの確認
open coverage/index.html
```

カバレッジ目標：
- **文レベル**: 80%以上
- **分岐レベル**: 75%以上
- **関数レベル**: 90%以上
- **行レベル**: 80%以上

不足しているテストケースを特定して追加します。

### Phase 6: テストドキュメント生成

```markdown
# テスト仕様書: {{moduleName}}

## テスト対象

- **ファイル**: {{filePath}}
- **関数/クラス**: {{targetName}}
- **生成日**: {{date}}

## テスト戦略

このモジュールは以下の戦略でテストします：

1. **ユニットテスト**: 個別の関数を独立してテスト
2. **統合テスト**: 関連モジュールとの連携をテスト
3. **エッジケーステスト**: 境界値と異常系をテスト

## テストケース一覧

### 正常系

| ID | 説明 | 入力 | 期待される出力 | 状態 |
|----|------|------|---------------|------|
| TC001 | {{description}} | {{input}} | {{output}} | ✅ |
| TC002 | {{description}} | {{input}} | {{output}} | ✅ |

### 異常系

| ID | 説明 | 入力 | 期待される動作 | 状態 |
|----|------|------|---------------|------|
| TC101 | {{description}} | {{input}} | {{error}} | ✅ |

### 境界値

| ID | 説明 | 入力 | 期待される出力 | 状態 |
|----|------|------|---------------|------|
| TC201 | {{description}} | {{input}} | {{output}} | ✅ |

## カバレッジ

- **文レベル**: 85%
- **分岐レベル**: 80%
- **関数レベル**: 95%
- **行レベル**: 85%

## 未カバー箇所

以下の箇所はテストされていません：

1. **{{file}}:{{line}}**: {{reason}}
2. **{{file}}:{{line}}**: {{reason}}

## 推奨事項

1. エッジケースのテストを追加
2. 非同期処理のタイムアウトテストを追加
3. パフォーマンステストを追加
```

## スクリプト実装

### analyze-code.js

```javascript
#!/usr/bin/env node

const fs = require('fs');
const ts = require('typescript');

function analyzeCode(filePath) {
  const sourceCode = fs.readFileSync(filePath, 'utf-8');
  const sourceFile = ts.createSourceFile(
    filePath,
    sourceCode,
    ts.ScriptTarget.Latest,
    true
  );

  const analysis = {
    functions: [],
    classes: [],
    imports: [],
    exports: []
  };

  function visit(node) {
    // 関数の解析
    if (ts.isFunctionDeclaration(node)) {
      analysis.functions.push({
        name: node.name?.text,
        parameters: node.parameters.map(p => ({
          name: p.name.getText(sourceFile),
          type: p.type?.getText(sourceFile) || 'any',
          optional: !!p.questionToken
        })),
        returnType: node.type?.getText(sourceFile) || 'void',
        isAsync: node.modifiers?.some(
          m => m.kind === ts.SyntaxKind.AsyncKeyword
        ),
        isExported: node.modifiers?.some(
          m => m.kind === ts.SyntaxKind.ExportKeyword
        )
      });
    }

    // クラスの解析
    if (ts.isClassDeclaration(node)) {
      const methods = [];
      node.members.forEach(member => {
        if (ts.isMethodDeclaration(member)) {
          methods.push({
            name: member.name.getText(sourceFile),
            parameters: member.parameters.map(p => ({
              name: p.name.getText(sourceFile),
              type: p.type?.getText(sourceFile) || 'any'
            })),
            returnType: member.type?.getText(sourceFile) || 'void',
            isAsync: member.modifiers?.some(
              m => m.kind === ts.SyntaxKind.AsyncKeyword
            )
          });
        }
      });

      analysis.classes.push({
        name: node.name?.text,
        methods: methods,
        isExported: node.modifiers?.some(
          m => m.kind === ts.SyntaxKind.ExportKeyword
        )
      });
    }

    // インポートの解析
    if (ts.isImportDeclaration(node)) {
      const moduleSpecifier = node.moduleSpecifier.getText(sourceFile).replace(/['"]/g, '');
      analysis.imports.push({
        module: moduleSpecifier,
        imports: node.importClause?.namedBindings
          ? Array.from(node.importClause.namedBindings.elements || [])
              .map(e => e.name.text)
          : []
      });
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return analysis;
}

// メイン処理
function main() {
  const args = process.argv.slice(2);
  const filePath = args[args.indexOf('--file') + 1];
  const outputFile = args[args.indexOf('--output') + 1];

  const analysis = analyzeCode(filePath);

  fs.writeFileSync(
    outputFile,
    JSON.stringify(analysis, null, 2)
  );

  console.log(`Analysis completed: ${outputFile}`);
  console.log(`Found ${analysis.functions.length} functions`);
  console.log(`Found ${analysis.classes.length} classes`);
}

if (require.main === module) {
  main();
}
```

## 実行例

```bash
# テスト生成
claude skill test-generator

# 対話形式
# 1. テスト対象ファイルを選択
# 2. テストフレームワークを選択
# 3. テストタイプを選択（unit/integration/e2e）
# 4. テスト生成
# 5. カバレッジ確認
```

期待される出力：
- `src/__tests__/{{module}}.test.ts`: ユニットテスト
- `src/__tests__/integration/{{feature}}.test.ts`: 統合テスト
- `e2e/{{scenario}}.spec.ts`: E2Eテスト
- `docs/test-spec-{{module}}.md`: テスト仕様書
```

## ベストプラクティス

### 1. 明確な目的

各Skillは単一の明確な目的を持つべきです。

```markdown
✅ 良い例:
- code-review: コードレビューに特化
- test-generator: テスト生成に特化

❌ 悪い例:
- all-in-one: あらゆることをする汎用Skill
```

### 2. 詳細な指示

曖昧さを排除し、具体的な指示を提供します。

```markdown
✅ 良い例:
「src/ディレクトリ内の.tsファイルをすべて検索し、
エクスポートされた関数のJSDocコメントを抽出してください」

❌ 悪い例:
「コードを見てドキュメントを作って」
```

### 3. エラーハンドリング

すべての失敗シナリオを考慮します。

```markdown
## エラーハンドリング

1. **ファイルが見つからない場合**
   - ユーザーに正しいパスを確認
   - 類似ファイル名を提案

2. **権限エラーの場合**
   - 実行権限の確認方法を提示
   - 代替手段を提案

3. **依存関係が不足している場合**
   - 必要なパッケージを明示
   - インストールコマンドを提供
```

### 4. テンプレートの活用

再利用可能なテンプレートを提供します。

```
.claude/skills/my-skill/
└── templates/
    ├── basic.md
    ├── advanced.md
    └── custom.md
```

### 5. バージョン管理

セマンティックバージョニングを使用します。

```yaml
---
version: 1.2.3
---

# Changelog
- v1.2.3: バグ修正
- v1.2.0: 新機能追加
- v1.1.0: 改善
- v1.0.0: 初版
```

### 6. ドキュメント

READMEとCHANGELOGを必ず提供します。

```
.claude/skills/my-skill/
├── SKILL.md
├── README.md          # 使用方法
├── CHANGELOG.md       # 変更履歴
└── examples/          # 使用例
```

### 7. モジュール化

複雑なSkillsは小さな部品に分割します。

```
.claude/skills/complex-skill/
├── SKILL.md
├── modules/
│   ├── step1.md
│   ├── step2.md
│   └── step3.md
└── scripts/
    ├── helper1.js
    └── helper2.js
```

### 8. パフォーマンス

大規模なタスクは並列処理を検討します。

```bash
# 並列実行の例
for file in src/*.ts; do
  process_file "$file" &
done
wait
```

### 9. セキュリティ

機密情報を含めないようにします。

```yaml
⚠️ 注意:
- APIキーやパスワードをハードコードしない
- 環境変数を使用する
- .gitignoreに機密ファイルを追加
```

### 10. 保守性

将来の変更を考慮した設計にします。

```markdown
## 設定ファイル

`config/settings.json`で動作をカスタマイズできます。

新しいルールを追加する場合は、このファイルを編集してください。
```

## まとめ

カスタムSkillsを作成することで、Claude Codeを自分のワークフローに最適化できます。

### 次のステップ

1. 簡単なSkillから始める
2. 実際に使って改善する
3. チームで共有してフィードバックを得る
4. 複雑なワークフローに拡張する

### 関連ドキュメント

- [Skills基礎](./04-skills-basics.md) - Skillsの基本概念
- [スラッシュコマンド](./02-slash-commands.md) - コマンドとの違い
- [MCP統合](./06-mcp-integration.md) - MCPとの連携

---

#中級者 #上級者 #Skills #カスタマイズ #開発 #自動化 #ワークフロー #チーム開発