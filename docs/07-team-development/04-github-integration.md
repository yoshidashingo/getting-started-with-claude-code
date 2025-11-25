# GitHub統合ガイド

Claude CodeとGitHubを統合し、プルリクエスト管理、Issue管理、コードレビュー、CI/CDワークフローを効率化する方法を詳しく解説します。

## 概要

### GitHub統合の重要性

Claude CodeとGitHubを統合することで、以下のメリットが得られます:

- **開発効率の向上**: PR作成、コードレビュー、Issue管理を自動化
- **品質の向上**: 自動テスト、リント、セキュリティチェックの統合
- **協働の促進**: チーム全体での知識共有と協力体制の構築
- **トレーサビリティ**: コード変更の履歴と理由の明確化
- **プロセスの自動化**: 反復的なタスクの削減

### 統合の全体像

```mermaid
graph LR
    A[Claude Code] --> B[GitHub MCP]
    B --> C[Pull Requests]
    B --> D[Issues]
    B --> E[Code Review]
    C --> F[GitHub Actions]
    D --> F
    F --> G[自動テスト]
    F --> H[自動デプロイ]
```

## GitHub MCPサーバーの設定

### 前提条件

1. **GitHub Personal Access Token（PAT）の作成**
2. **必要な権限**: `repo`, `read:org`, `workflow`, `read:project`
3. **Node.js 18以上**のインストール

### GitHub Personal Access Tokenの作成

#### ステップ1: GitHubでトークン作成

1. GitHub.com にアクセス
2. Settings > Developer settings > Personal access tokens > Tokens (classic)
3. "Generate new token (classic)" をクリック
4. 以下のスコープを選択:

```
✅ repo (フルアクセス)
  ✅ repo:status
  ✅ repo_deployment
  ✅ public_repo
  ✅ repo:invite
✅ workflow (ワークフロー管理)
✅ write:packages (パッケージ管理)
✅ read:org (組織情報読み取り)
✅ read:project (プロジェクト読み取り)
```

5. トークンを生成し、安全に保管

⚠️ **重要**: トークンは一度しか表示されません。必ず安全な場所に保管してください。

### MCPサーバー設定

**`.mcp.json`の設定**:
```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-github"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

**環境変数の設定**:

```bash
# .env.local に追加
GITHUB_TOKEN=ghp_your_personal_access_token_here
GITHUB_ORG=your-organization-name
GITHUB_REPO=your-repository-name
```

### 動作確認

```bash
# Claude Codeを起動
claude-code

# MCPサーバーの状態確認（Claude Code内で実行）
> show MCP servers

# GitHubリポジトリ情報の取得テスト
> list repositories
```

## PR作成の自動化

### 基本的なPR作成フロー

#### 1. ブランチ作成から実装

Claude Codeを使用した典型的なワークフロー:

```
# Claude Codeプロンプト例
新しい機能「ユーザー認証」を実装したいです。
以下の手順で進めてください:

1. feature/user-authentication ブランチを作成
2. 認証ロジックを実装
3. テストコードを作成
4. コミットとプッシュ
5. PRを作成
```

Claude Codeの応答例:
```bash
# 1. ブランチ作成
git checkout -b feature/user-authentication

# 2. 実装（Claude Codeがコード生成）
# src/auth/authentication.ts などを生成

# 3. テスト作成
# src/auth/authentication.test.ts などを生成

# 4. コミット
git add .
git commit -m "feat: ユーザー認証機能の実装

- JWT認証の実装
- パスワードハッシュ化
- リフレッシュトークン機能

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"

# 5. プッシュ
git push -u origin feature/user-authentication

# 6. PR作成（GitHub MCPを使用）
gh pr create --title "feat: ユーザー認証機能の実装" --body "$(cat <<'EOF'
## 概要
ユーザー認証機能を実装しました。

## 変更内容
- JWT認証の実装
- パスワードハッシュ化（bcrypt使用）
- リフレッシュトークン機能
- ログイン/ログアウトエンドポイント

## テスト
- [ ] ユニットテスト実装
- [ ] 統合テスト実装
- [ ] E2Eテスト実装
- [ ] セキュリティレビュー

## チェックリスト
- [x] テストが追加され、全て通過
- [x] ドキュメントを更新
- [x] 型定義を追加
- [x] セキュリティ考慮

🤖 Generated with Claude Code
EOF
)"
```

### 高度なPR作成プロンプトテンプレート

**`.claude/prompts/create-pr.md`**:
```markdown
# プルリクエスト作成プロンプト

以下の情報に基づいてプルリクエストを作成してください。

## ブランチ情報
- ベースブランチ: main
- フィーチャーブランチ: [ブランチ名]

## 実装内容
[実装した機能や修正内容]

## PR作成要件

### タイトル
以下のプレフィックスを使用:
- `feat:` 新機能
- `fix:` バグ修正
- `docs:` ドキュメント
- `refactor:` リファクタリング
- `test:` テスト追加
- `chore:` ビルド・設定変更

### 本文に含める内容
1. **概要**: 何を実装したか
2. **変更内容**: 具体的な変更点（箇条書き）
3. **テスト**: 実装したテストの内容
4. **スクリーンショット**: UI変更がある場合
5. **破壊的変更**: 後方互換性がない場合は記載
6. **関連Issue**: `Closes #123` の形式で記載
7. **チェックリスト**: レビュー観点
8. **デプロイメモ**: 必要な環境変数やマイグレーション

### レビュアー指定
- 自動的にチームメンバーを指定
- 必須レビュアー: @team-lead
- オプション: @frontend-team, @backend-team

### ラベル設定
- 機能カテゴリ（frontend, backend, infrastructure）
- 優先度（priority: high, medium, low）
- サイズ（size: S, M, L, XL）

## 実行コマンド
```bash
gh pr create \
  --title "[タイトル]" \
  --body "$(cat <<'EOF'
[本文]
EOF
)" \
  --base main \
  --head [ブランチ名] \
  --reviewer @team-lead \
  --label "frontend,priority:high,size:M"
```
```

### PR作成時の自動化

**`.github/pull_request_template.md`**:
```markdown
## 概要
<!-- PRの目的と背景を簡潔に説明 -->

## 変更内容
<!-- 具体的な変更点を箇条書きで -->
-
-
-

## 関連Issue
<!-- 関連するIssueがあれば記載 -->
Closes #

## テスト
<!-- 実装したテストの内容 -->
- [ ] ユニットテスト
- [ ] 統合テスト
- [ ] E2Eテスト
- [ ] 手動テスト完了

## スクリーンショット
<!-- UI変更がある場合、Before/Afterのスクリーンショットを添付 -->

## 破壊的変更
<!-- 後方互換性がない場合は詳細を記載 -->
- [ ] 破壊的変更なし
- [ ] 破壊的変更あり（詳細: ）

## チェックリスト
<!-- レビュー前に確認 -->
- [ ] コードが設計原則に準拠している
- [ ] テストが追加され、全て通過している
- [ ] ドキュメントが更新されている
- [ ] 型定義が適切に追加されている
- [ ] セキュリティリスクを考慮している
- [ ] パフォーマンスへの影響を確認している
- [ ] アクセシビリティを考慮している（UI変更の場合）

## デプロイメモ
<!-- デプロイ時に必要な作業があれば記載 -->
- [ ] 環境変数の追加/変更:
- [ ] データベースマイグレーション:
- [ ] 外部サービス設定:

## レビュアーへのメモ
<!-- レビュアーに特に確認してほしい点 -->

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

## Issue管理の自動化

### Issue作成

#### Claude Codeプロンプト例

```
バグレポート用のIssueを作成してください。

症状: ログイン画面でエラーが発生する
再現手順:
1. ログインページにアクセス
2. メールアドレスとパスワードを入力
3. ログインボタンをクリック
4. "Network Error" が表示される

環境:
- ブラウザ: Chrome 120
- OS: macOS Sonoma
- アプリバージョン: 1.2.3
```

Claude Codeの応答:
```bash
gh issue create \
  --title "🐛 ログイン時にNetwork Errorが発生" \
  --body "$(cat <<'EOF'
## 症状
ログイン画面でエラーが発生し、ログインできない。

## 再現手順
1. ログインページにアクセス（http://localhost:3000/login）
2. メールアドレスとパスワードを入力
3. ログインボタンをクリック
4. "Network Error" というエラーメッセージが表示される

## 期待される動作
正常にログインし、ダッシュボード画面に遷移する。

## 環境情報
- **ブラウザ**: Chrome 120.0.6099.109
- **OS**: macOS Sonoma 14.2
- **アプリバージョン**: 1.2.3
- **環境**: Development

## スクリーンショット
<!-- エラー画面のスクリーンショットをここに添付 -->

## 追加情報
- コンソールエラー: [該当する場合は記載]
- ネットワークタブの情報: [該当する場合は記載]

## 優先度
High（ユーザーがログインできない重大な問題）

---

🤖 Generated with Claude Code
EOF
)" \
  --label "bug,priority:high,area:authentication" \
  --assignee @me
```

### Issueテンプレート

**`.github/ISSUE_TEMPLATE/bug_report.md`**:
```markdown
---
name: バグレポート
about: バグを報告する
title: '🐛 '
labels: 'bug'
assignees: ''
---

## 症状
<!-- バグの症状を簡潔に説明 -->

## 再現手順
1.
2.
3.

## 期待される動作
<!-- 本来どのように動作すべきか -->

## 実際の動作
<!-- 実際にどのように動作しているか -->

## 環境情報
- **ブラウザ**:
- **OS**:
- **アプリバージョン**:
- **環境**: Development / Staging / Production

## スクリーンショット
<!-- 該当する場合は添付 -->

## 追加情報
<!-- コンソールエラー、ネットワークログなど -->

## 優先度
<!-- Low / Medium / High / Critical を選択 -->
```

**`.github/ISSUE_TEMPLATE/feature_request.md`**:
```markdown
---
name: 機能リクエスト
about: 新機能を提案する
title: '✨ '
labels: 'enhancement'
assignees: ''
---

## 機能の概要
<!-- 実装したい機能の概要 -->

## 背景・動機
<!-- なぜこの機能が必要か -->

## 提案する解決策
<!-- どのように実装すべきか -->

## 代替案
<!-- 他に考えられる実装方法 -->

## 実装詳細
<!-- 技術的な詳細や考慮事項 -->

## 受け入れ基準
<!-- どうなれば完了とみなすか -->
- [ ]
- [ ]
- [ ]

## 依存関係
<!-- 他のIssueやPRとの関連 -->

## 優先度
<!-- Low / Medium / High を選択 -->

## 見積もり
<!-- 実装にかかる時間の見積もり -->
Small (< 1日) / Medium (1-3日) / Large (> 3日)
```

### Issue管理の自動化プロンプト

**`.claude/prompts/issue-management.md`**:
```markdown
# Issue管理プロンプト

## Issue作成
```
以下の情報に基づいてIssueを作成してください:

タイプ: [bug / feature / improvement / docs]
タイトル: [Issue タイトル]
説明: [詳細な説明]
ラベル: [該当するラベル]
担当者: [担当者名]
優先度: [low / medium / high / critical]
```

## Issue更新
```
Issue #[番号] を以下のように更新してください:

状態: [open / in progress / in review / closed]
コメント追加: [進捗や調査結果]
ラベル追加: [新しいラベル]
```

## Issue クローズ
```
Issue #[番号] をクローズしてください。

解決方法: [どのように解決したか]
関連PR: #[PR番号]
```

## Issue検索
```
以下の条件でIssueを検索してください:

ラベル: [label:bug]
状態: [is:open]
担当者: [assignee:username]
マイルストーン: [milestone:"v1.0"]
```
```

### ラベル管理

**`.github/labels.yml`** (GitHub Labelerアクション用):
```yaml
# タイプラベル
bug:
  color: 'd73a4a'
  description: 'バグ・不具合'

enhancement:
  color: 'a2eeef'
  description: '新機能・改善'

documentation:
  color: '0075ca'
  description: 'ドキュメント'

# 優先度ラベル
priority:high:
  color: 'ff0000'
  description: '優先度: 高'

priority:medium:
  color: 'ffaa00'
  description: '優先度: 中'

priority:low:
  color: '00ff00'
  description: '優先度: 低'

# エリアラベル
area:frontend:
  color: 'f9d0c4'
  description: 'フロントエンド関連'

area:backend:
  color: 'c5def5'
  description: 'バックエンド関連'

area:infrastructure:
  color: 'd4c5f9'
  description: 'インフラ関連'

# サイズラベル
size:S:
  color: 'e0e0e0'
  description: '実装規模: 小（< 1日）'

size:M:
  color: 'c0c0c0'
  description: '実装規模: 中（1-3日）'

size:L:
  color: 'a0a0a0'
  description: '実装規模: 大（> 3日）'
```

## コードレビューの効率化

### PR自動レビュー

**`.claude/prompts/pr-review.md`**:
```markdown
# プルリクエストレビュープロンプト

以下のPRをレビューしてください。

## PR情報
- PR番号: #[番号]
- ブランチ: [ブランチ名]
- 変更ファイル数: [数]

## レビュー観点

### 1. コード品質
- [ ] 可読性が高い
- [ ] 適切な命名規則
- [ ] 単一責任原則の遵守
- [ ] DRY原則の適用

### 2. 設計
- [ ] アーキテクチャパターンに準拠
- [ ] 適切な抽象化レベル
- [ ] 依存関係が適切
- [ ] 拡張性を考慮

### 3. テスト
- [ ] テストカバレッジ80%以上
- [ ] エッジケースを考慮
- [ ] テストの可読性
- [ ] モック/スタブの適切な使用

### 4. セキュリティ
- [ ] 入力値のバリデーション
- [ ] SQL インジェクション対策
- [ ] XSS 対策
- [ ] 機密情報の適切な管理

### 5. パフォーマンス
- [ ] 不要な処理の削減
- [ ] メモリ使用量への配慮
- [ ] データベースクエリの最適化
- [ ] バンドルサイズへの影響

## 出力形式
```
## レビューサマリー
[全体的な評価]

## 良い点
- [具体的な良い点]

## 改善提案
### 重要度: 高
- [必須の修正事項]

### 重要度: 中
- [推奨する改善]

### 重要度: 低
- [軽微な提案]

## セキュリティ/パフォーマンス懸念
[該当する場合は記載]

## 追加コメント
[その他気づいた点]
```
```

### 自動レビューコメント

**GitHub Actionsでの自動レビュー**:

**`.github/workflows/pr-review.yml`**:
```yaml
name: Automated PR Review

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  code-review:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run ESLint
        id: eslint
        run: |
          npm run lint -- --format json > eslint-results.json || true

      - name: Run Type Check
        id: typecheck
        run: |
          npm run type-check > typecheck-results.txt || true

      - name: Run Tests with Coverage
        id: test
        run: |
          npm run test -- --coverage --json > test-results.json || true

      - name: Comment PR with Results
        uses: actions/github-script@v6
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          script: |
            const fs = require('fs');

            // ESLint結果
            const eslintResults = JSON.parse(fs.readFileSync('eslint-results.json', 'utf8'));
            const eslintErrors = eslintResults.reduce((sum, file) => sum + file.errorCount, 0);
            const eslintWarnings = eslintResults.reduce((sum, file) => sum + file.warningCount, 0);

            // テスト結果
            const testResults = JSON.parse(fs.readFileSync('test-results.json', 'utf8'));
            const coverage = testResults.coverageMap?.getCoverageSummary();

            // コメント作成
            const comment = `
            ## 🤖 自動コードレビュー結果

            ### 📊 コード品質
            - **ESLint**: ${eslintErrors} errors, ${eslintWarnings} warnings
            - **TypeScript**: ${fs.readFileSync('typecheck-results.txt', 'utf8').includes('error') ? '❌ 型エラーあり' : '✅ 型チェック通過'}

            ### 🧪 テストカバレッジ
            - **Statements**: ${coverage?.statements.pct || 0}%
            - **Branches**: ${coverage?.branches.pct || 0}%
            - **Functions**: ${coverage?.functions.pct || 0}%
            - **Lines**: ${coverage?.lines.pct || 0}%

            ${coverage?.statements.pct < 80 ? '⚠️ テストカバレッジが80%未満です' : '✅ テストカバレッジ目標達成'}

            ### 📝 推奨アクション
            ${eslintErrors > 0 ? '- ❌ ESLintエラーを修正してください\n' : ''}
            ${eslintWarnings > 0 ? '- ⚠️ ESLint警告を確認してください\n' : ''}
            ${coverage?.statements.pct < 80 ? '- ⚠️ テストを追加してカバレッジを向上させてください\n' : ''}

            ---
            🤖 Generated by GitHub Actions
            `;

            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: comment
            });
```

### Claude Codeを使ったレビュー支援

**レビュー依頼のプロンプト例**:
```
PR #123 をレビューしてください。

以下の点に特に注意してください:
1. 認証ロジックのセキュリティ
2. データベースクエリのパフォーマンス
3. エラーハンドリングの適切性
4. テストカバレッジ

変更ファイル:
- src/auth/authentication.ts
- src/auth/authentication.test.ts
- src/middleware/auth.middleware.ts
```

## GitHub Actionsとの連携

### CI/CDワークフロー

#### 基本的なCIパイプライン

**`.github/workflows/ci.yml`**:
```yaml
name: CI Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

env:
  NODE_ENV: test

jobs:
  # 1. Lintとフォーマットチェック
  lint:
    name: Lint and Format
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run ESLint
        run: npm run lint

      - name: Check Prettier formatting
        run: npm run format:check

  # 2. 型チェック
  type-check:
    name: TypeScript Type Check
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Type check
        run: npm run type-check

  # 3. ユニットテスト
  test-unit:
    name: Unit Tests
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test:unit -- --coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
          flags: unittests
          name: unit-test-coverage

  # 4. 統合テスト
  test-integration:
    name: Integration Tests
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15-alpine
        env:
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

      redis:
        image: redis:7-alpine
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run database migrations
        run: npm run db:migrate
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db

      - name: Run integration tests
        run: npm run test:integration
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
          REDIS_URL: redis://localhost:6379

  # 5. E2Eテスト
  test-e2e:
    name: E2E Tests
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload Playwright report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30

  # 6. セキュリティチェック
  security:
    name: Security Checks
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run npm audit
        run: npm audit --audit-level=moderate

      - name: Run Snyk security scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}

  # 7. ビルド
  build:
    name: Build
    runs-on: ubuntu-latest
    needs: [lint, type-check, test-unit]

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build

      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build
          path: dist/
          retention-days: 7
```

### 自動デプロイワークフロー

**`.github/workflows/deploy-production.yml`**:
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
    tags:
      - 'v*'

jobs:
  deploy:
    name: Deploy to Production
    runs-on: ubuntu-latest
    environment: production

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build
        env:
          NODE_ENV: production
          VITE_API_URL: ${{ secrets.PRODUCTION_API_URL }}

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          working-directory: ./

      - name: Create GitHub Release
        if: startsWith(github.ref, 'refs/tags/')
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: ${{ github.ref }}
          release_name: Release ${{ github.ref }}
          draft: false
          prerelease: false

      - name: Notify Slack
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: 'Production deployment completed!'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
        if: always()
```

### Claude Codeとの統合

**デプロイ自動化のプロンプト例**:
```
mainブランチに以下の変更をマージし、本番環境にデプロイしてください:

変更内容:
- ユーザー認証機能の追加
- パフォーマンス改善
- バグ修正 3件

手順:
1. feature/user-auth ブランチをmainにマージ
2. タグ v1.2.0 を作成
3. GitHub Actionsで自動デプロイ実行
4. デプロイ完了を確認
5. Slackで通知
```

## プロジェクト管理

### GitHub Projectsとの連携

#### プロジェクトボード自動化

**`.github/workflows/project-automation.yml`**:
```yaml
name: Project Board Automation

on:
  issues:
    types: [opened, closed, labeled]
  pull_request:
    types: [opened, closed, ready_for_review, review_requested]

jobs:
  update-project:
    runs-on: ubuntu-latest

    steps:
      - name: Add issue to project
        if: github.event_name == 'issues' && github.event.action == 'opened'
        uses: actions/add-to-project@v0.4.0
        with:
          project-url: https://github.com/orgs/your-org/projects/1
          github-token: ${{ secrets.GH_PROJECT_TOKEN }}

      - name: Move to In Progress
        if: github.event_name == 'pull_request' && github.event.action == 'opened'
        uses: actions/github-script@v6
        with:
          github-token: ${{ secrets.GH_PROJECT_TOKEN }}
          script: |
            // プロジェクトボードのステータスを更新
            // 詳細な実装は省略
```

### マイルストーン管理

**Claude Codeプロンプト例**:
```
v1.2.0リリースのマイルストーンを管理してください:

タスク:
1. マイルストーン "v1.2.0" を作成
2. 期限: 2024-02-01
3. 以下のIssueを追加:
   - #45: ユーザー認証機能
   - #52: ダッシュボード改善
   - #58: パフォーマンス最適化
4. 進捗状況をレポート
```

## トラブルシューティング

### よくある問題と解決方法

#### 1. GitHub Personal Access Tokenエラー

**問題**: `Authentication failed` エラー

```bash
# 解決方法1: トークンの権限確認
# GitHub > Settings > Developer settings > Personal access tokens
# 必要なスコープが選択されているか確認

# 解決方法2: トークンの再生成
# 古いトークンを削除し、新しいトークンを生成

# 解決方法3: 環境変数の確認
echo $GITHUB_TOKEN
# 正しく設定されているか確認
```

#### 2. GitHub Actions権限エラー

**問題**: Workflow実行時に権限エラー

**解決方法**: リポジトリ設定を確認
```yaml
# Settings > Actions > General > Workflow permissions
# "Read and write permissions" を選択

# または、workflow内で明示的に権限付与
permissions:
  contents: write
  pull-requests: write
  issues: write
```

#### 3. MCPサーバー接続エラー

**問題**: GitHub MCPサーバーに接続できない

```bash
# 解決方法1: MCPサーバーログ確認
cat ~/.claude/logs/mcp.log

# 解決方法2: 手動でMCPサーバー起動テスト
npx @modelcontextprotocol/server-github

# 解決方法3: Node.jsバージョン確認
node --version  # 18以上必要
```

#### 4. PR作成時のテンプレート未適用

**問題**: PRテンプレートが自動的に適用されない

```bash
# 解決方法: テンプレートファイルの配置確認
# 以下のいずれかに配置:
.github/pull_request_template.md
.github/PULL_REQUEST_TEMPLATE.md
docs/pull_request_template.md
PULL_REQUEST_TEMPLATE.md
```

## ベストプラクティス

### 1. PR管理

```markdown
## PR作成のベストプラクティス

### サイズ
- 小さく保つ（変更行数 < 400行が目安）
- 1つのPRで1つの変更に集中
- 大きな変更は複数のPRに分割

### コミットメッセージ
- Conventional Commits形式を使用
- 意図と理由を明確に記載
- 関連Issueを参照

### レビュー
- 少なくとも1名の承認が必要
- CI/CDチェックが全て通過
- コンフリクトを解消

### マージ戦略
- Squash and merge（機能PR）
- Merge commit（リリースPR）
- Rebase and merge（ホットフィックス）
```

### 2. Issue管理

```markdown
## Issue管理のベストプラクティス

### 作成時
- 明確なタイトル
- 詳細な説明
- 適切なラベル付け
- 担当者の割り当て

### 進行中
- 定期的な進捗更新
- ブロッカーの早期報告
- 関連PRのリンク

### クローズ時
- 解決方法の記載
- テスト結果の共有
- ドキュメントの更新確認
```

### 3. CI/CD

```markdown
## CI/CDのベストプラクティス

### パイプライン
- 高速なフィードバック（< 10分）
- 並列実行の活用
- キャッシュの効果的な使用

### テスト
- ユニットテスト: 必須
- 統合テスト: 重要な機能
- E2Eテスト: クリティカルパス

### デプロイ
- ステージング環境で検証
- ブルーグリーンデプロイ
- ロールバック計画の準備
```

## 次のステップ

GitHub統合を完了したら、次の段階に進みましょう:

### 即座に実践
1. **[大規模開発テクニック](05-large-scale-techniques.md)** - スケーラブルな開発手法
2. CI/CDパイプラインの最適化
3. 自動化の拡張

### 継続的改善
1. GitHub Actionsワークフローの定期的な見直し
2. Issue/PRテンプレートの改善
3. チームフィードバックによる最適化

---

**ナビゲーション:**
- ⬅️ 前へ: [共有コンテキスト管理](03-shared-context.md) - チーム知識の共有
- ➡️ 次へ: [大規模開発テクニック](05-large-scale-techniques.md) - スケーラブルな開発

**関連ドキュメント:**
- [チーム開発概要](README.md) - チーム開発の全体像
- [共有環境管理](02-shared-environment.md) - 環境設定の統一
- [外部ツール連携](../02-features/integration-tools.md) - 開発ツール統合

**タグ:** `#チーム開発` `#GitHub` `#CI/CD` `#自動化` `#プルリクエスト` `#Issue管理` `#コードレビュー` `#GitHub Actions` `#MCP`
