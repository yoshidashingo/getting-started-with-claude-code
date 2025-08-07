# チーム開発セットアップ

Claude Codeを活用したチーム開発環境の構築と設定方法について詳細に解説します。開発者間での環境統一とベストプラクティスの実装を通じて、効率的なチーム開発を実現します。

## 概要

### チーム開発環境統一の重要性

チーム開発において環境の統一は以下の理由で重要です：

- **再現性の確保**: 全員が同じ環境で開発することで、「私の環境では動く」問題を回避
- **オンボーディングの効率化**: 新メンバーが素早く開発に参加可能
- **トラブルシューティングの簡素化**: 共通の環境により問題解決が容易
- **品質の統一**: 同じツールと設定により一貫したコード品質を実現

### 統一すべき要素

1. **Claude Code設定**: プロンプトテンプレート、設定ファイル
2. **開発ツール**: エディタ、拡張機能、フォーマッター
3. **プロジェクト構造**: ディレクトリ構成、命名規則
4. **ドキュメント管理**: 設計原則、コーディング規約
5. **自動化ツール**: テスト、ビルド、デプロイ設定

## チーム環境構築手順

### ステップ1: チーム設定リポジトリの作成

#### 1.1 設定管理リポジトリの準備

```bash
# チーム設定用リポジトリの作成
mkdir team-claude-config
cd team-claude-config

# 基本構造の作成
mkdir -p {claude-templates,editor-config,project-templates,docs}
```

#### 1.2 基本ディレクトリ構造

```
team-claude-config/
├── README.md                    # セットアップガイド
├── claude-templates/            # Claude用プロンプトテンプレート
│   ├── code-review.md
│   ├── refactoring.md
│   ├── testing.md
│   └── documentation.md
├── editor-config/               # エディタ設定
│   ├── .vscode/
│   ├── .editorconfig
│   └── prettier.config.js
├── project-templates/           # プロジェクトテンプレート
│   ├── web-app/
│   ├── api-server/
│   └── library/
├── docs/                        # チーム開発ドキュメント
│   ├── coding-standards.md
│   ├── design-principles.md
│   └── workflow.md
└── scripts/                     # セットアップスクリプト
    ├── setup-dev-env.sh
    └── sync-config.sh
```

### ステップ2: Claude Code設定の統一

#### 2.1 共通プロンプトテンプレートの作成

**claude-templates/code-review.md**:
```markdown
# コードレビュープロンプト

以下のコードをレビューしてください。チームの設計原則に従って評価し、改善提案を行ってください。

## レビュー観点
- [ ] コーディング規約への準拠
- [ ] 設計原則との整合性
- [ ] テストカバレッジ
- [ ] パフォーマンス
- [ ] セキュリティ
- [ ] 保守性

## コード
[ここにコードを貼り付け]

## 期待する出力
1. 良い点の指摘
2. 改善が必要な点
3. 具体的な修正提案
4. 代替実装案（必要に応じて）
```

**claude-templates/refactoring.md**:
```markdown
# リファクタリングプロンプト

以下のコードをチームの設計原則に基づいてリファクタリングしてください。

## リファクタリング目標
- [ ] 可読性の向上
- [ ] 保守性の向上
- [ ] テスタビリティの向上
- [ ] パフォーマンスの最適化

## 現在のコード
[ここにコードを貼り付け]

## 制約条件
- 既存のAPIは変更しない
- テストは全て通る状態を維持
- チームのコーディング規約に準拠

## 期待する出力
1. リファクタリング後のコード
2. 変更点の説明
3. 改善された点の説明
```

#### 2.2 チーム設計原則の定義

**docs/design-principles.md**:
```markdown
# チーム設計原則

## コード品質原則

### 1. 可読性優先
- 変数名は意図を明確に表現
- 関数は単一責任を持つ
- コメントは「なぜ」を説明

### 2. テスタビリティ
- 依存関係の注入を活用
- 純粋関数を優先
- モックしやすい設計

### 3. 保守性
- DRY原則の適用
- 適切な抽象化レベル
- 変更に強い設計

## アーキテクチャ原則

### 1. レイヤー分離
- プレゼンテーション層
- ビジネスロジック層
- データアクセス層

### 2. 依存関係の管理
- 上位層は下位層に依存
- インターフェースによる抽象化
- 循環依存の回避

## Claude Code活用原則

### 1. プロンプト設計
- 具体的で明確な指示
- コンテキストの適切な提供
- 期待する出力形式の明示

### 2. コード生成
- 生成後の必須レビュー
- テストコードの同時生成
- ドキュメントの更新
```

### ステップ3: 開発環境の統一

#### 3.1 エディタ設定の統一

**editor-config/.vscode/settings.json**:
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "editor.rulers": [80, 120],
  "files.trimTrailingWhitespace": true,
  "files.insertFinalNewline": true,
  "typescript.preferences.importModuleSpecifier": "relative",
  "javascript.preferences.importModuleSpecifier": "relative"
}
```

**editor-config/.vscode/extensions.json**:
```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.test-adapter-converter"
  ]
}
```

**editor-config/.editorconfig**:
```ini
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
indent_style = space
indent_size = 2

[*.md]
trim_trailing_whitespace = false

[*.{yml,yaml}]
indent_size = 2

[*.py]
indent_size = 4
```

#### 3.2 コードフォーマット設定

**editor-config/prettier.config.js**:
```javascript
module.exports = {
  semi: true,
  trailingComma: 'es5',
  singleQuote: true,
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  bracketSpacing: true,
  arrowParens: 'avoid',
  endOfLine: 'lf',
};
```

### ステップ4: プロジェクトテンプレートの作成

#### 4.1 Webアプリケーションテンプレート

**project-templates/web-app/package.json**:
```json
{
  "name": "team-web-app-template",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "test": "vitest",
    "test:e2e": "playwright test",
    "lint": "eslint src --ext .ts,.tsx",
    "format": "prettier --write src"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "@vitejs/plugin-react": "^4.0.0",
    "eslint": "^8.45.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.3",
    "playwright": "^1.40.0",
    "prettier": "^3.0.0",
    "typescript": "^5.0.2",
    "vite": "^4.4.5",
    "vitest": "^0.34.0"
  }
}
```

#### 4.2 プロジェクト構造テンプレート

**project-templates/web-app/src/structure.md**:
```markdown
# プロジェクト構造

```
src/
├── components/          # 再利用可能なコンポーネント
│   ├── ui/             # 基本UIコンポーネント
│   └── features/       # 機能別コンポーネント
├── hooks/              # カスタムフック
├── services/           # API通信・外部サービス
├── utils/              # ユーティリティ関数
├── types/              # TypeScript型定義
├── constants/          # 定数定義
├── styles/             # スタイル定義
└── __tests__/          # テストファイル
```

## 命名規則

### ファイル・ディレクトリ
- コンポーネント: PascalCase (Button.tsx)
- フック: camelCase (useAuth.ts)
- ユーティリティ: camelCase (formatDate.ts)
- 定数: UPPER_SNAKE_CASE (API_ENDPOINTS.ts)

### 変数・関数
- 変数: camelCase
- 関数: camelCase
- 定数: UPPER_SNAKE_CASE
- 型: PascalCase
```

### ステップ5: 自動化スクリプトの作成

#### 5.1 開発環境セットアップスクリプト

**scripts/setup-dev-env.sh**:
```bash
#!/bin/bash

echo "🚀 チーム開発環境をセットアップしています..."

# 現在のディレクトリを確認
if [ ! -f "package.json" ]; then
    echo "❌ package.jsonが見つかりません。プロジェクトルートで実行してください。"
    exit 1
fi

# エディタ設定をコピー
echo "📝 エディタ設定をコピーしています..."
cp -r ../team-claude-config/editor-config/.vscode ./ 2>/dev/null || true
cp ../team-claude-config/editor-config/.editorconfig ./ 2>/dev/null || true
cp ../team-claude-config/editor-config/prettier.config.js ./ 2>/dev/null || true

# Claude テンプレートをコピー
echo "🤖 Claude テンプレートをコピーしています..."
mkdir -p .claude/templates
cp -r ../team-claude-config/claude-templates/* .claude/templates/ 2>/dev/null || true

# 依存関係をインストール
echo "📦 依存関係をインストールしています..."
npm install

# Git hooks をセットアップ
echo "🔧 Git hooks をセットアップしています..."
npx husky install 2>/dev/null || true

echo "✅ セットアップが完了しました！"
echo ""
echo "次のステップ:"
echo "1. .claude/templates/ のプロンプトテンプレートを確認"
echo "2. docs/design-principles.md でチーム設計原則を確認"
echo "3. npm run dev でプロジェクトを起動"
```

#### 5.2 設定同期スクリプト

**scripts/sync-config.sh**:
```bash
#!/bin/bash

echo "🔄 チーム設定を同期しています..."

# チーム設定リポジトリから最新を取得
cd ../team-claude-config
git pull origin main

cd - > /dev/null

# 設定ファイルを更新
echo "📝 設定ファイルを更新しています..."
cp -r ../team-claude-config/editor-config/.vscode ./ 2>/dev/null || true
cp ../team-claude-config/editor-config/.editorconfig ./ 2>/dev/null || true
cp ../team-claude-config/editor-config/prettier.config.js ./ 2>/dev/null || true

# Claude テンプレートを更新
echo "🤖 Claude テンプレートを更新しています..."
cp -r ../team-claude-config/claude-templates/* .claude/templates/ 2>/dev/null || true

# チーム設計原則を更新
echo "📋 設計原則を更新しています..."
mkdir -p docs/team
cp ../team-claude-config/docs/* docs/team/ 2>/dev/null || true

echo "✅ 設定の同期が完了しました！"
```

## チーム開発ワークフロー

### 新メンバーのオンボーディング

#### 1. 環境セットアップ（15分）

```bash
# 1. チーム設定リポジトリをクローン
git clone https://github.com/your-team/team-claude-config.git

# 2. プロジェクトリポジトリをクローン
git clone https://github.com/your-team/your-project.git
cd your-project

# 3. 開発環境をセットアップ
../team-claude-config/scripts/setup-dev-env.sh
```

#### 2. チーム規約の確認（30分）

- [ ] `docs/team/design-principles.md` を読む
- [ ] `docs/team/coding-standards.md` を確認
- [ ] `.claude/templates/` のプロンプトテンプレートを確認
- [ ] サンプルプロジェクトで動作確認

#### 3. 初回開発タスク（60分）

- [ ] 簡単な機能追加タスクを実施
- [ ] Claude テンプレートを使用してコード生成
- [ ] チームレビューを受ける

### 日常的な開発フロー

#### 1. 作業開始時

```bash
# 最新の設定を同期
./scripts/sync-config.sh

# 最新のコードを取得
git pull origin main
```

#### 2. 開発中

- Claude テンプレートを活用したコード生成
- チーム設計原則に基づく実装
- 定期的なコードフォーマット実行

#### 3. コミット前

```bash
# コードフォーマット
npm run format

# リント実行
npm run lint

# テスト実行
npm run test
```

## ベストプラクティス

### 1. 設定管理

#### 設定の版数管理
- チーム設定リポジトリでバージョンタグを使用
- 破壊的変更は事前にチーム内で合意
- 段階的なロールアウト計画

#### 設定の文書化
```markdown
# 設定変更ログ

## v2.1.0 (2024-01-15)
- Prettier設定にtrailingCommaを追加
- ESLint規則を更新
- 新しいClaude テンプレートを追加

## v2.0.0 (2024-01-01)
- TypeScript 5.0対応
- 新しいプロジェクト構造テンプレート
- 破壊的変更: 古いESLint設定を削除
```

### 2. Claude Code活用

#### プロンプトテンプレートの管理
- チーム共通のテンプレートを使用
- 個人的なカスタマイズは個別ファイルで管理
- 効果的なテンプレートはチームで共有

#### コード生成のガイドライン
```markdown
# Claude Code使用ガイドライン

## 必須事項
- [ ] 生成されたコードは必ずレビューする
- [ ] テストコードも同時に生成する
- [ ] チーム設計原則との整合性を確認

## 推奨事項
- [ ] 複雑な処理は段階的に生成
- [ ] 生成理由をコミットメッセージに記載
- [ ] 生成したコードの理解を深める
```

### 3. 品質管理

#### 自動化チェック
```json
{
  "scripts": {
    "pre-commit": "lint-staged",
    "pre-push": "npm run test && npm run build"
  },
  "lint-staged": {
    "*.{ts,tsx,js,jsx}": [
      "prettier --write",
      "eslint --fix"
    ],
    "*.md": [
      "prettier --write"
    ]
  }
}
```

#### コードレビュー基準
- チーム設計原則への準拠
- テストカバレッジの確保
- ドキュメントの更新
- パフォーマンスへの配慮

## トラブルシューティング

### よくある問題と解決方法

#### 1. 設定の不整合

**問題**: メンバー間で異なるフォーマット結果
```bash
# 解決方法: 設定を再同期
./scripts/sync-config.sh
npm run format
```

#### 2. Claude テンプレートが見つからない

**問題**: `.claude/templates/` が空
```bash
# 解決方法: テンプレートを再コピー
mkdir -p .claude/templates
cp -r ../team-claude-config/claude-templates/* .claude/templates/
```

#### 3. エディタ設定が反映されない

**問題**: VSCode設定が適用されない
```bash
# 解決方法: VSCodeを再起動し、設定を確認
code --install-extension esbenp.prettier-vscode
code --install-extension dbaeumer.vscode-eslint
```

### サポート体制

#### 1. 内部サポート
- チーム内のClaude Code エキスパートを指名
- 定期的な知識共有セッション
- 問題解決のためのSlackチャンネル

#### 2. 外部リソース
- [Claude Code公式ドキュメント](../README.md)
- [トラブルシューティングガイド](../09-troubleshooting.md)
- コミュニティフォーラム

## 次のステップ

チーム開発環境のセットアップが完了したら、次の段階に進みましょう：

### 即座に実践
1. **[共有環境管理](02-shared-environment.md)** - ツールと設定の詳細な標準化
2. **[共有コンテキスト管理](03-shared-context.md)** - チーム知識の共有システム

### 段階的な改善
1. **[GitHub連携](04-github-integration.md)** - バージョン管理との統合
2. **[大規模開発テクニック](05-large-scale-techniques.md)** - スケーラブルな開発手法

---

**関連ドキュメント:**
- [チーム開発概要](README.md) - チーム開発の全体像
- [設計原則管理](../06-development-process/03-design-principles.md) - 設計原則の詳細
- [外部ツール連携](../02-features/integration-tools.md) - 開発ツールとの連携