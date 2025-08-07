# チーム開発プロジェクトテンプレート

Claude Codeを活用したチーム開発用のプロジェクトテンプレートとセットアップガイドです。共有設定ファイルとドキュメントテンプレートを含む、すぐに使える開発環境を提供します。

## 概要

### テンプレートの特徴

このテンプレートは以下の要素を含みます：

- **統一された開発環境**: チーム全体で一貫した設定
- **Claude Code最適化**: 効果的なプロンプトとワークフロー
- **自動化ツール**: 品質管理とデプロイメントの自動化
- **ドキュメント体系**: 保守可能な文書管理システム
- **スケーラブル構造**: 成長に対応できる柔軟な設計

### 対象プロジェクト

- **チームサイズ**: 3-20人
- **プロジェクト規模**: 中〜大規模Webアプリケーション
- **技術スタック**: TypeScript + React + Node.js
- **開発期間**: 3ヶ月以上の継続的開発

## プロジェクト構造

```
team-project-template/
├── README.md                           # プロジェクト概要
├── docs/                               # ドキュメント
│   ├── architecture/                   # アーキテクチャ設計
│   │   ├── overview.md
│   │   ├── api-design.md
│   │   └── database-design.md
│   ├── development/                    # 開発ガイド
│   │   ├── setup.md
│   │   ├── coding-standards.md
│   │   ├── git-workflow.md
│   │   └── deployment.md
│   ├── claude-context/                 # Claude Code用コンテキスト
│   │   ├── project-context.md
│   │   ├── prompts/
│   │   └── patterns/
│   └── team/                          # チーム管理
│       ├── onboarding.md
│       ├── roles-responsibilities.md
│       └── communication.md
├── src/                               # ソースコード
│   ├── frontend/                      # フロントエンド
│   │   ├── src/
│   │   ├── public/
│   │   ├── package.json
│   │   └── vite.config.ts
│   ├── backend/                       # バックエンド
│   │   ├── src/
│   │   ├── tests/
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── shared/                        # 共有ライブラリ
│       ├── types/
│       ├── utils/
│       └── constants/
├── tools/                             # 開発ツール
│   ├── scripts/                       # 自動化スクリプト
│   ├── docker/                        # Docker設定
│   └── ci-cd/                         # CI/CD設定
├── config/                            # 設定ファイル
│   ├── eslint/
│   ├── prettier/
│   ├── typescript/
│   └── jest/
└── .github/                           # GitHub設定
    ├── workflows/                     # GitHub Actions
    ├── ISSUE_TEMPLATE/
    ├── PULL_REQUEST_TEMPLATE.md
    └── CODEOWNERS
```

## セットアップガイド

### 1. プロジェクト初期化

#### 1.1 テンプレートのクローン

```bash
# テンプレートリポジトリをクローン
git clone https://github.com/your-org/team-project-template.git my-new-project
cd my-new-project

# Git履歴をリセット
rm -rf .git
git init
git add .
git commit -m "Initial commit from template"
```

#### 1.2 プロジェクト情報の更新

```bash
# セットアップスクリプトを実行
./tools/scripts/setup-project.sh

# 対話的にプロジェクト情報を入力
# - プロジェクト名
# - 説明
# - チーム情報
# - 技術スタック詳細
```

**setup-project.sh**:
```bash
#!/bin/bash

echo "🚀 プロジェクトセットアップを開始します"

# プロジェクト情報の入力
read -p "プロジェクト名: " PROJECT_NAME
read -p "プロジェクト説明: " PROJECT_DESCRIPTION
read -p "チーム名: " TEAM_NAME
read -p "リポジトリURL: " REPO_URL

# テンプレート内のプレースホルダーを置換
find . -type f -name "*.md" -o -name "*.json" -o -name "*.ts" -o -name "*.js" | \
  xargs sed -i "s/{{PROJECT_NAME}}/$PROJECT_NAME/g"
find . -type f -name "*.md" -o -name "*.json" -o -name "*.ts" -o -name "*.js" | \
  xargs sed -i "s/{{PROJECT_DESCRIPTION}}/$PROJECT_DESCRIPTION/g"
find . -type f -name "*.md" -o -name "*.json" -o -name "*.ts" -o -name "*.js" | \
  xargs sed -i "s/{{TEAM_NAME}}/$TEAM_NAME/g"
find . -type f -name "*.md" -o -name "*.json" -o -name "*.ts" -o -name "*.js" | \
  xargs sed -i "s/{{REPO_URL}}/$REPO_URL/g"

# package.jsonの更新
cd src/frontend && npm pkg set name="$PROJECT_NAME-frontend"
cd ../backend && npm pkg set name="$PROJECT_NAME-backend"
cd ../..

echo "✅ プロジェクト情報の更新が完了しました"
```

### 2. 開発環境構築

#### 2.1 依存関係のインストール

```bash
# ルートディレクトリで実行
npm run install:all

# または個別にインストール
cd src/frontend && npm install
cd ../backend && npm install
cd ../shared && npm install
```

**package.json** (ルート):
```json
{
  "name": "{{PROJECT_NAME}}",
  "private": true,
  "workspaces": [
    "src/frontend",
    "src/backend",
    "src/shared"
  ],
  "scripts": {
    "install:all": "npm install && npm run install:workspaces",
    "install:workspaces": "npm install --workspaces",
    "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\"",
    "dev:frontend": "npm run dev --workspace=src/frontend",
    "dev:backend": "npm run dev --workspace=src/backend",
    "build": "npm run build --workspaces",
    "test": "npm run test --workspaces",
    "lint": "npm run lint --workspaces",
    "format": "prettier --write .",
    "type-check": "npm run type-check --workspaces"
  },
  "devDependencies": {
    "concurrently": "^8.2.0",
    "prettier": "^3.0.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "eslint": "^8.45.0",
    "typescript": "^5.0.2"
  }
}
```

#### 2.2 環境変数の設定

```bash
# 環境変数ファイルをコピー
cp .env.example .env.local
cp src/backend/.env.example src/backend/.env.local
cp src/frontend/.env.example src/frontend/.env.local

# 必要な値を設定
# - データベース接続情報
# - API キー
# - 外部サービス設定
```

**.env.example**:
```bash
# データベース
DATABASE_URL=postgresql://user:password@localhost:5432/{{PROJECT_NAME}}_dev
REDIS_URL=redis://localhost:6379

# 認証
JWT_SECRET=your-jwt-secret-here
JWT_EXPIRES_IN=7d

# 外部サービス
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-password

# 開発環境
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:5173
```

### 3. Claude Code設定

#### 3.1 プロジェクトコンテキストの設定

**docs/claude-context/project-context.md**:
```markdown
# {{PROJECT_NAME}} プロジェクトコンテキスト

## プロジェクト概要
{{PROJECT_DESCRIPTION}}

## 技術スタック

### フロントエンド
- **フレームワーク**: React 18 + TypeScript
- **ビルドツール**: Vite
- **状態管理**: Zustand
- **UI ライブラリ**: Material-UI (MUI)
- **ルーティング**: React Router v6
- **フォーム**: React Hook Form + Zod
- **テスト**: Vitest + React Testing Library

### バックエンド
- **ランタイム**: Node.js + TypeScript
- **フレームワーク**: Express.js
- **データベース**: PostgreSQL + TypeORM
- **認証**: JWT + bcrypt
- **バリデーション**: Zod
- **テスト**: Jest + Supertest
- **API ドキュメント**: OpenAPI + Swagger

### インフラ
- **コンテナ**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **監視**: Prometheus + Grafana
- **ログ**: Winston + ELK Stack

## アーキテクチャ原則

### 設計原則
1. **Clean Architecture**: レイヤー分離と依存関係逆転
2. **Domain-Driven Design**: ドメインロジックの中心化
3. **SOLID原則**: 保守性と拡張性の確保
4. **Test-Driven Development**: テストファーストの開発

### コーディング規約
1. **TypeScript Strict Mode**: 型安全性の最大化
2. **Functional Programming**: 副作用の最小化
3. **Immutability**: 状態の不変性維持
4. **Error Handling**: 明示的なエラー処理

## Claude Code活用ガイドライン

### コード生成時の注意点
1. **型安全性**: 必ずTypeScriptの型定義を含める
2. **テストコード**: 実装と同時にテストも生成
3. **エラーハンドリング**: 適切な例外処理を実装
4. **ドキュメント**: JSDocコメントを含める
5. **設計原則**: プロジェクトの設計原則に準拠

### 推奨プロンプトパターン
```
以下の要件に基づいて[機能名]を実装してください：

## コンテキスト
- プロジェクト: {{PROJECT_NAME}}
- 技術スタック: [該当する技術]
- アーキテクチャ: Clean Architecture + DDD

## 要件
[具体的な要件]

## 制約条件
- TypeScript strict mode準拠
- 単体テスト必須
- エラーハンドリング実装
- JSDocコメント記載

## 期待する出力
- 実装ファイル
- テストファイル
- 型定義ファイル
- 使用例
```
```

#### 3.2 プロンプトテンプレート集

**docs/claude-context/prompts/component-generation.md**:
```markdown
# Reactコンポーネント生成プロンプト

## 基本コンポーネント生成

```
以下の仕様に基づいてReactコンポーネントを生成してください：

## コンポーネント仕様
- **名前**: [コンポーネント名]
- **目的**: [コンポーネントの役割]
- **Props**: [必要なProps]
- **状態**: [内部状態の有無]
- **イベント**: [ハンドルするイベント]

## 技術要件
- TypeScript + React 18
- Material-UI使用
- React Hook Form対応（フォームの場合）
- アクセシビリティ対応
- レスポンシブデザイン

## 出力ファイル
1. コンポーネントファイル (.tsx)
2. 型定義ファイル (.types.ts)
3. テストファイル (.test.tsx)
4. Storybookファイル (.stories.tsx)
5. スタイルファイル (.styles.ts)

## 実装例
```typescript
// UserCard.tsx
import React from 'react';
import { Card, CardContent, Avatar, Typography, Button } from '@mui/material';
import { UserCardProps } from './UserCard.types';

/**
 * ユーザー情報を表示するカードコンポーネント
 * @param user - 表示するユーザー情報
 * @param onEdit - 編集ボタンクリック時のハンドラー
 * @param onDelete - 削除ボタンクリック時のハンドラー
 */
export const UserCard: React.FC<UserCardProps> = ({
  user,
  onEdit,
  onDelete,
  ...props
}) => {
  return (
    <Card {...props}>
      <CardContent>
        <Avatar src={user.avatar} alt={user.name} />
        <Typography variant="h6">{user.name}</Typography>
        <Typography variant="body2" color="text.secondary">
          {user.email}
        </Typography>
        <Button onClick={() => onEdit(user.id)}>編集</Button>
        <Button onClick={() => onDelete(user.id)} color="error">
          削除
        </Button>
      </CardContent>
    </Card>
  );
};
```
```

**docs/claude-context/prompts/api-generation.md**:
```markdown
# API エンドポイント生成プロンプト

## RESTful API生成

```
以下の仕様に基づいてRESTful APIエンドポイントを生成してください：

## API仕様
- **リソース**: [リソース名]
- **エンドポイント**: [URL パス]
- **HTTPメソッド**: [GET/POST/PUT/DELETE]
- **リクエスト**: [リクエスト形式]
- **レスポンス**: [レスポンス形式]
- **認証**: [認証要件]

## 技術要件
- Express.js + TypeScript
- OpenAPI仕様準拠
- Zodバリデーション
- JWT認証対応
- エラーハンドリング実装
- ログ出力対応

## 出力ファイル
1. ルーターファイル (.router.ts)
2. コントローラーファイル (.controller.ts)
3. サービスファイル (.service.ts)
4. DTOファイル (.dto.ts)
5. バリデーションスキーマ (.schema.ts)
6. テストファイル (.test.ts)
7. OpenAPI仕様 (.yaml)

## 実装例
```typescript
// users.controller.ts
import { Request, Response, NextFunction } from 'express';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { validateSchema } from '../middleware/validation';
import { createUserSchema, updateUserSchema } from './user.schema';

export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * ユーザー一覧取得
   * @route GET /api/users
   */
  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 20 } = req.query;
      const result = await this.userService.getUsers({
        page: Number(page),
        limit: Number(limit)
      });
      
      res.json({
        success: true,
        data: result.users,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * ユーザー作成
   * @route POST /api/users
   */
  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userData = validateSchema(createUserSchema, req.body);
      const user = await this.userService.createUser(userData);
      
      res.status(201).json({
        success: true,
        data: user,
        message: 'ユーザーが正常に作成されました'
      });
    } catch (error) {
      next(error);
    }
  }
}
```
```

#### 3.3 コードパターン集

**docs/claude-context/patterns/error-handling.md**:
```markdown
# エラーハンドリングパターン

## カスタムエラークラス

```typescript
// errors/base.error.ts
export abstract class BaseError extends Error {
  abstract readonly statusCode: number;
  abstract readonly isOperational: boolean;

  constructor(message: string, public readonly context?: any) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// errors/domain.error.ts
export class DomainError extends BaseError {
  readonly statusCode = 400;
  readonly isOperational = true;

  constructor(message: string, context?: any) {
    super(message, context);
  }
}

// errors/not-found.error.ts
export class NotFoundError extends BaseError {
  readonly statusCode = 404;
  readonly isOperational = true;

  constructor(resource: string, id: string) {
    super(`${resource} with id ${id} not found`);
  }
}
```

## エラーハンドリングミドルウェア

```typescript
// middleware/error-handler.ts
import { Request, Response, NextFunction } from 'express';
import { BaseError } from '../errors/base.error';
import { logger } from '../utils/logger';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error('Error occurred:', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query
  });

  if (error instanceof BaseError) {
    return res.status(error.statusCode).json({
      success: false,
      error: {
        message: error.message,
        context: error.context
      }
    });
  }

  // 予期しないエラー
  res.status(500).json({
    success: false,
    error: {
      message: 'Internal server error'
    }
  });
};
```
```

### 4. 開発ワークフロー

#### 4.1 Git ワークフロー

**docs/development/git-workflow.md**:
```markdown
# Git ワークフロー

## ブランチ戦略

### メインブランチ
- **main**: 本番環境用の安定版
- **develop**: 開発統合ブランチ

### 作業ブランチ
- **feature/**: 新機能開発 (feature/user-authentication)
- **bugfix/**: バグ修正 (bugfix/login-error)
- **hotfix/**: 緊急修正 (hotfix/security-patch)
- **release/**: リリース準備 (release/v1.2.0)

## 作業フロー

### 1. 新機能開発
```bash
# developブランチから作業ブランチを作成
git checkout develop
git pull origin develop
git checkout -b feature/user-profile-edit

# 開発作業
# ... コード実装 ...

# コミット
git add .
git commit -m "feat: ユーザープロフィール編集機能を追加

- プロフィール編集フォームを実装
- バリデーション機能を追加
- 更新APIエンドポイントを作成
- 単体テストを追加

Closes #123"

# プッシュしてプルリクエスト作成
git push origin feature/user-profile-edit
```

### 2. コミットメッセージ規約
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Type**:
- feat: 新機能
- fix: バグ修正
- docs: ドキュメント更新
- style: コードスタイル修正
- refactor: リファクタリング
- test: テスト追加・修正
- chore: その他の変更

**例**:
```
feat(auth): JWT認証機能を実装

- JWTトークンの生成・検証機能を追加
- 認証ミドルウェアを実装
- ログイン・ログアウトAPIを作成
- 認証関連のテストを追加

Closes #45
```
```

#### 4.2 コードレビュープロセス

**.github/PULL_REQUEST_TEMPLATE.md**:
```markdown
## 変更内容
<!-- 何を変更したかを簡潔に説明 -->

## 変更理由
<!-- なぜこの変更が必要かを説明 -->

## 影響範囲
<!-- この変更が影響する範囲を記載 -->
- [ ] フロントエンド
- [ ] バックエンド
- [ ] データベース
- [ ] API
- [ ] 設定ファイル

## テスト
<!-- 実施したテストを記載 -->
- [ ] 単体テスト追加・更新
- [ ] 統合テスト実行
- [ ] E2Eテスト実行
- [ ] 手動テスト実行

## チェックリスト
- [ ] コードがコーディング規約に準拠している
- [ ] 適切なテストが追加されている
- [ ] ドキュメントが更新されている
- [ ] 破壊的変更がある場合、マイグレーション手順を記載
- [ ] セキュリティ上の問題がないことを確認

## スクリーンショット
<!-- UI変更がある場合、スクリーンショットを添付 -->

## 関連Issue
<!-- 関連するIssueがあれば記載 -->
Closes #

## レビュー観点
<!-- レビュアーに特に注目してほしい点があれば記載 -->
```

### 5. 自動化設定

#### 5.1 GitHub Actions

**.github/workflows/ci.yml**:
```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
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
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379

    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Type check
        run: npm run type-check
      
      - name: Lint
        run: npm run lint
      
      - name: Test
        run: npm run test:coverage
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
          REDIS_URL: redis://localhost:6379
      
      - name: Build
        run: npm run build
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info

  e2e:
    runs-on: ubuntu-latest
    needs: test
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - name: Start services
        run: |
          docker-compose -f docker-compose.test.yml up -d
          npm run build
          npm run start:test &
          sleep 30
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

#### 5.2 品質ゲート設定

**sonar-project.properties**:
```properties
sonar.projectKey={{PROJECT_NAME}}
sonar.organization={{TEAM_NAME}}
sonar.sources=src
sonar.tests=src
sonar.test.inclusions=**/*.test.ts,**/*.test.tsx,**/*.spec.ts,**/*.spec.tsx
sonar.typescript.lcov.reportPaths=coverage/lcov.info
sonar.coverage.exclusions=**/*.test.ts,**/*.test.tsx,**/*.spec.ts,**/*.spec.tsx,**/*.config.ts,**/*.config.js

# 品質ゲート設定
sonar.qualitygate.wait=true

# メトリクス閾値
sonar.coverage.minimum=80
sonar.duplicated_lines_density.maximum=5
sonar.maintainability_rating.minimum=A
sonar.reliability_rating.minimum=A
sonar.security_rating.minimum=A
```

## チーム管理ドキュメント

### 1. オンボーディングガイド

**docs/team/onboarding.md**:
```markdown
# 新メンバーオンボーディングガイド

## 初日のタスク (2時間)

### 1. アカウント設定 (30分)
- [ ] GitHubアカウントをチームに追加
- [ ] Slackワークスペースに参加
- [ ] 必要なツールのアカウント作成
  - [ ] Figma (デザイン)
  - [ ] Notion (ドキュメント)
  - [ ] Linear (タスク管理)

### 2. 開発環境構築 (60分)
- [ ] リポジトリをクローン
- [ ] 開発環境をセットアップ
- [ ] サンプルアプリケーションを起動
- [ ] テストを実行して動作確認

### 3. ドキュメント確認 (30分)
- [ ] プロジェクト概要を読む
- [ ] アーキテクチャドキュメントを確認
- [ ] コーディング規約を理解
- [ ] Git ワークフローを確認

## 1週目のタスク

### 1. 基礎学習 (1日目-3日目)
- [ ] 技術スタックの学習
- [ ] Claude Code活用方法の習得
- [ ] 既存コードの理解
- [ ] テスト実行とデバッグ体験

### 2. 小さなタスク実施 (4日目-5日目)
- [ ] バグ修正タスクを1つ完了
- [ ] コードレビューを受ける
- [ ] フィードバックを反映

## 1ヶ月目の目標

### 技術面
- [ ] 主要な機能の実装ができる
- [ ] 適切なテストが書ける
- [ ] コードレビューができる
- [ ] Claude Codeを効果的に活用できる

### チーム面
- [ ] チームメンバーとの関係構築
- [ ] プロジェクトの全体像を理解
- [ ] 自立して作業ができる
- [ ] 積極的にコミュニケーションを取る

## サポート体制

### メンター制度
- **技術メンター**: 技術的な質問・相談
- **チームメンター**: チーム文化・プロセスの相談

### 定期面談
- **1週目**: 毎日15分の振り返り
- **2-4週目**: 週2回の進捗確認
- **2ヶ月目以降**: 週1回の定期面談

### 学習リソース
- [技術スタック学習ガイド](learning-resources.md)
- [Claude Code活用事例集](../claude-context/patterns/)
- [よくある質問集](faq.md)
```

### 2. 役割と責任

**docs/team/roles-responsibilities.md**:
```markdown
# 役割と責任

## チーム構成

### テックリード (1名)
**責任範囲**:
- アーキテクチャ設計と技術的意思決定
- コードレビューの最終承認
- 技術的負債の管理
- チームの技術力向上支援

**Claude Code活用**:
- 複雑な設計パターンの生成
- アーキテクチャレビューの支援
- 技術調査の効率化

### シニアエンジニア (2-3名)
**責任範囲**:
- 機能設計と実装
- ジュニアメンバーのメンタリング
- コードレビュー
- 技術的な問題解決

**Claude Code活用**:
- 高品質なコード生成
- リファクタリング支援
- テスト設計の効率化

### エンジニア (3-5名)
**責任範囲**:
- 機能実装
- 単体テスト作成
- バグ修正
- ドキュメント更新

**Claude Code活用**:
- 基本的なコード生成
- テストコード作成
- デバッグ支援

### ジュニアエンジニア (2-3名)
**責任範囲**:
- 簡単な機能実装
- テスト作成
- ドキュメント作成
- 学習と成長

**Claude Code活用**:
- 学習支援
- 基本的なコード生成
- ベストプラクティスの習得

## 意思決定プロセス

### 技術的決定
1. **小さな変更**: 担当エンジニアが決定
2. **中程度の変更**: シニアエンジニアと相談
3. **大きな変更**: テックリードと技術会議で決定

### アーキテクチャ変更
1. **提案**: RFC (Request for Comments) を作成
2. **議論**: チーム全体での議論
3. **決定**: テックリードが最終決定
4. **実装**: 段階的な移行計画を策定

## コミュニケーション

### 定期ミーティング
- **デイリースタンドアップ**: 毎日15分
- **スプリントプランニング**: 2週間に1回
- **レトロスペクティブ**: 2週間に1回
- **技術共有会**: 月1回

### 非同期コミュニケーション
- **Slack**: 日常的なコミュニケーション
- **GitHub**: コードレビューと技術議論
- **Notion**: ドキュメント共有と議事録
- **Linear**: タスク管理と進捗共有
```

## 使用方法

### 1. 新規プロジェクト作成

```bash
# 1. テンプレートを使用してプロジェクト作成
npx create-team-project my-new-project

# 2. プロジェクトディレクトリに移動
cd my-new-project

# 3. セットアップスクリプト実行
./tools/scripts/setup-project.sh

# 4. 開発環境構築
npm run install:all
npm run dev
```

### 2. 既存プロジェクトへの適用

```bash
# 1. 必要なファイルをコピー
cp -r team-project-template/config ./
cp -r team-project-template/tools ./
cp -r team-project-template/.github ./

# 2. package.jsonにスクリプト追加
npm run merge-package-scripts

# 3. 設定ファイルを調整
./tools/scripts/migrate-config.sh
```

### 3. カスタマイズ

#### 技術スタックの変更
```bash
# React → Vue.js の場合
./tools/scripts/switch-frontend.sh vue

# Express → Fastify の場合
./tools/scripts/switch-backend.sh fastify
```

#### 追加機能の有効化
```bash
# 認証機能を追加
./tools/scripts/add-feature.sh auth

# 支払い機能を追加
./tools/scripts/add-feature.sh payment

# 通知機能を追加
./tools/scripts/add-feature.sh notification
```

## トラブルシューティング

### よくある問題

#### 1. 依存関係のインストールエラー
```bash
# Node.jsバージョンを確認
node --version  # 18.x以上が必要

# キャッシュをクリア
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### 2. データベース接続エラー
```bash
# PostgreSQLが起動しているか確認
docker-compose ps

# データベースを再作成
docker-compose down -v
docker-compose up -d postgres
npm run db:migrate
```

#### 3. テスト実行エラー
```bash
# テスト環境をリセット
npm run test:reset
npm run test:setup
npm run test
```

### サポート

#### 内部サポート
- **Slack**: #{{PROJECT_NAME}}-support チャンネル
- **ドキュメント**: [FAQ](docs/team/faq.md)
- **メンター**: 各チームメンバーに割り当て

#### 外部リソース
- **Claude Code公式ドキュメント**
- **技術スタック公式ドキュメント**
- **コミュニティフォーラム**

---

**関連ドキュメント:**
- [チーム開発セットアップ](../07-team-development/01-team-setup.md) - 基本的な環境構築
- [共有コンテキスト管理](../07-team-development/03-shared-context.md) - チーム知識の共有
- [大規模開発テクニック](../07-team-development/05-large-scale-techniques.md) - スケーラブルな開発手法