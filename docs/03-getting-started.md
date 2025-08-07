# セットアップガイド

Claude Codeの環境構築から初回使用までの完全な手順を説明します。このガイドに従うことで、スムーズにClaude Codeを使い始めることができます。

## システム要件

### 最小要件

- **オペレーティングシステム**: Windows 10/11、macOS 10.15以降、Ubuntu 18.04以降
- **メモリ**: 4GB RAM（8GB推奨）
- **ストレージ**: 2GB以上の空き容量
- **インターネット接続**: 安定したブロードバンド接続

### 推奨要件

- **メモリ**: 16GB RAM以上
- **プロセッサ**: Intel i5/AMD Ryzen 5以上
- **ストレージ**: SSD推奨
- **ディスプレイ**: 1920x1080以上の解像度

### 必要なソフトウェア

- **Node.js**: 16.x以降（18.x推奨）
- **Git**: 2.30以降
- **テキストエディタ**: VS Code、WebStorm、Sublime Text等
- **ブラウザ**: Chrome、Firefox、Safari、Edge（最新版）

## インストール手順

### ステップ1: Node.jsのインストール

#### Windows
1. [Node.js公式サイト](https://nodejs.org/)にアクセス
2. LTS版をダウンロード
3. インストーラーを実行し、指示に従ってインストール
4. コマンドプロンプトで確認：
```cmd
node --version
npm --version
```

#### macOS
**Homebrewを使用（推奨）:**
```bash
# Homebrewのインストール（未インストールの場合）
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Node.jsのインストール
brew install node

# 確認
node --version
npm --version
```

**公式インストーラーを使用:**
1. [Node.js公式サイト](https://nodejs.org/)からmacOS用インストーラーをダウンロード
2. .pkgファイルを実行してインストール

#### Linux (Ubuntu/Debian)
```bash
# Node.jsの最新LTSをインストール
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# 確認
node --version
npm --version
```

### ステップ2: Gitのインストール

#### Windows
1. [Git公式サイト](https://git-scm.com/)からダウンロード
2. インストーラーを実行
3. 設定は基本的にデフォルトでOK
4. 確認：
```cmd
git --version
```

#### macOS
```bash
# Homebrewを使用
brew install git

# または、Xcodeコマンドラインツールを使用
xcode-select --install
```

#### Linux
```bash
# Ubuntu/Debian
sudo apt-get install git

# CentOS/RHEL
sudo yum install git
```

### ステップ3: Claude Codeのセットアップ

#### アカウント作成
1. [Claude Code公式サイト](https://claude.ai/code)にアクセス
2. 「Sign Up」をクリック
3. メールアドレスとパスワードを入力
4. 確認メールのリンクをクリックして認証完了

#### APIキーの取得
1. ダッシュボードにログイン
2. 「API Keys」セクションに移動
3. 「Create New Key」をクリック
4. キー名を入力（例：「Development Key」）
5. 生成されたAPIキーを安全な場所に保存

⚠️ **重要**: APIキーは一度しか表示されません。必ず安全な場所に保存してください。

### ステップ4: 開発環境の設定

#### VS Code拡張機能（推奨）

1. **VS Codeのインストール**
   - [VS Code公式サイト](https://code.visualstudio.com/)からダウンロード・インストール

2. **推奨拡張機能のインストール**
```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-json",
    "redhat.vscode-yaml",
    "ms-python.python",
    "ms-vscode.vscode-jest"
  ]
}
```

3. **設定ファイルの作成**
```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "emmet.includeLanguages": {
    "javascript": "javascriptreact",
    "typescript": "typescriptreact"
  }
}
```

#### 環境変数の設定

**Windows:**
```cmd
# システム環境変数に追加
setx CLAUDE_API_KEY "your-api-key-here"

# または .env ファイルを使用
echo CLAUDE_API_KEY=your-api-key-here > .env
```

**macOS/Linux:**
```bash
# ~/.bashrc または ~/.zshrc に追加
echo 'export CLAUDE_API_KEY="your-api-key-here"' >> ~/.bashrc
source ~/.bashrc

# または .env ファイルを使用
echo "CLAUDE_API_KEY=your-api-key-here" > .env
```

## 初期設定

### プロジェクトの作成

#### 新規プロジェクトの作成
```bash
# プロジェクトディレクトリを作成
mkdir my-claude-project
cd my-claude-project

# package.jsonの初期化
npm init -y

# 必要な依存関係をインストール
npm install --save-dev typescript @types/node eslint prettier
npm install dotenv axios

# TypeScript設定ファイルの作成
npx tsc --init
```

#### 基本的なプロジェクト構造
```
my-claude-project/
├── src/
│   ├── index.ts
│   ├── utils/
│   └── types/
├── tests/
├── .env
├── .gitignore
├── package.json
├── tsconfig.json
├── .eslintrc.js
└── .prettierrc
```

### 設定ファイルの作成

#### TypeScript設定 (tsconfig.json)
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

#### ESLint設定 (.eslintrc.js)
```javascript
module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'prettier'
  ],
  plugins: ['@typescript-eslint'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-function-return-type': 'warn',
    'no-console': 'warn'
  }
};
```

#### Prettier設定 (.prettierrc)
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

#### Git設定 (.gitignore)
```gitignore
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Build outputs
dist/
build/
*.tsbuildinfo

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log

# Coverage
coverage/
.nyc_output/

# Cache
.cache/
.parcel-cache/
```

## 最初のプロジェクト作成

### Hello World プロジェクト

#### 1. 基本的なセットアップ
```typescript
// src/index.ts
import dotenv from 'dotenv';

// 環境変数の読み込み
dotenv.config();

const main = async (): Promise<void> => {
  console.log('Claude Code Hello World!');
  
  // APIキーの確認
  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) {
    console.error('CLAUDE_API_KEY が設定されていません');
    process.exit(1);
  }
  
  console.log('APIキーが正常に設定されています');
};

main().catch(console.error);
```

#### 2. Claude Code APIの基本的な使用
```typescript
// src/claude-client.ts
import axios from 'axios';

interface ClaudeResponse {
  content: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

export class ClaudeClient {
  private apiKey: string;
  private baseURL = 'https://api.anthropic.com/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateCode(prompt: string): Promise<ClaudeResponse> {
    try {
      const response = await axios.post(
        `${this.baseURL}/messages`,
        {
          model: 'claude-3-sonnet-20240229',
          max_tokens: 1000,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ]
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'x-api-key': this.apiKey
          }
        }
      );

      return {
        content: response.data.content[0].text,
        usage: response.data.usage
      };
    } catch (error) {
      console.error('Claude API Error:', error);
      throw error;
    }
  }
}
```

#### 3. 実際の使用例
```typescript
// src/example.ts
import { ClaudeClient } from './claude-client';

const runExample = async (): Promise<void> => {
  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) {
    throw new Error('CLAUDE_API_KEY が設定されていません');
  }

  const client = new ClaudeClient(apiKey);

  const prompt = `
TypeScriptで簡単な計算機クラスを作成してください。
以下の機能が必要です：
- 加算、減算、乗算、除算
- 計算履歴の保存
- 履歴のクリア機能
`;

  try {
    console.log('Claude Codeにリクエストを送信中...');
    const response = await client.generateCode(prompt);
    
    console.log('生成されたコード:');
    console.log(response.content);
    
    console.log('\n使用量:');
    console.log(`入力トークン: ${response.usage.input_tokens}`);
    console.log(`出力トークン: ${response.usage.output_tokens}`);
  } catch (error) {
    console.error('エラーが発生しました:', error);
  }
};

runExample();
```

### プロジェクトの実行

#### 1. 依存関係のインストール
```bash
npm install
```

#### 2. TypeScriptのコンパイル
```bash
npx tsc
```

#### 3. プロジェクトの実行
```bash
node dist/index.js
```

#### 4. 開発用スクリプトの追加
```json
// package.json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "ts-node src/index.ts",
    "watch": "tsc --watch",
    "lint": "eslint src/**/*.ts",
    "format": "prettier --write src/**/*.ts",
    "clean": "rm -rf dist"
  }
}
```

## 動作確認

### 基本的な動作テスト

#### 1. API接続テスト
```typescript
// tests/api-test.ts
import { ClaudeClient } from '../src/claude-client';

const testConnection = async (): Promise<void> => {
  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) {
    console.error('❌ APIキーが設定されていません');
    return;
  }

  const client = new ClaudeClient(apiKey);

  try {
    const response = await client.generateCode('Hello, Claude!');
    console.log('✅ API接続成功');
    console.log('レスポンス:', response.content.substring(0, 100) + '...');
  } catch (error) {
    console.error('❌ API接続失敗:', error);
  }
};

testConnection();
```

#### 2. 実行
```bash
npm run dev
```

### 期待される結果

正常にセットアップが完了している場合、以下のような出力が表示されます：

```
Claude Code Hello World!
APIキーが正常に設定されています
✅ API接続成功
レスポンス: Hello! I'm Claude, an AI assistant created by Anthropic. I'm here to help you with...
```

## よくある問題と解決方法

### 問題1: APIキーエラー
**エラー**: `CLAUDE_API_KEY が設定されていません`

**解決方法**:
1. .envファイルが正しく作成されているか確認
2. APIキーが正確にコピーされているか確認
3. 環境変数が正しく読み込まれているか確認

```bash
# 環境変数の確認
echo $CLAUDE_API_KEY  # macOS/Linux
echo %CLAUDE_API_KEY% # Windows
```

### 問題2: Node.jsバージョンエラー
**エラー**: `Node.js version not supported`

**解決方法**:
```bash
# Node.jsバージョンの確認
node --version

# 16.x以降でない場合はアップデート
# macOS (Homebrew)
brew upgrade node

# Windows (公式インストーラーを再実行)
# Linux (NodeSourceを使用)
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 問題3: 依存関係エラー
**エラー**: `Module not found`

**解決方法**:
```bash
# node_modulesを削除して再インストール
rm -rf node_modules package-lock.json
npm install

# または yarn を使用
rm -rf node_modules yarn.lock
yarn install
```

### 問題4: TypeScriptコンパイルエラー
**エラー**: `TypeScript compilation failed`

**解決方法**:
```bash
# TypeScriptを最新版に更新
npm install -D typescript@latest

# 型定義ファイルの確認
npm install -D @types/node

# tsconfig.jsonの確認
npx tsc --showConfig
```

### 問題5: ネットワーク接続エラー
**エラー**: `Network request failed`

**解決方法**:
1. インターネット接続を確認
2. プロキシ設定を確認
3. ファイアウォール設定を確認
4. Claude APIのステータスを確認

```bash
# 接続テスト
curl -I https://api.anthropic.com/v1/messages

# プロキシ設定（必要な場合）
npm config set proxy http://proxy.company.com:8080
npm config set https-proxy http://proxy.company.com:8080
```

## 次のステップ

セットアップが完了したら、次の学習ステップに進みましょう：

### 初心者向け
1. **[簡単なアプリ作成](04-quick-tutorial.md)** - 実践的なチュートリアル
2. **[機能概要](02-features/README.md)** - Claude Codeの全機能を把握
3. **[チャットインターフェース](02-features/chat-interface.md)** - 効果的な対話方法

### 経験者向け
1. **[プロジェクトコンテキスト](02-features/project-context.md)** - 大規模プロジェクト対応
2. **[外部ツール連携](02-features/integration-tools.md)** - 開発ツールとの統合
3. **[体系的な開発プロセス](06-development-process/README.md)** - 本格的な開発手法

## サポート

問題が解決しない場合は、以下のリソースを活用してください：

- **公式ドキュメント**: [Claude Code Docs](https://docs.claude.ai/code)
- **コミュニティフォーラム**: [Claude Community](https://community.claude.ai)
- **GitHub Issues**: [Claude Code Issues](https://github.com/anthropic/claude-code/issues)
- **サポートチケット**: [Contact Support](https://support.claude.ai)

---

**ナビゲーション:**
- ⬅️ 前へ: [基本概念](01-basic-concepts.md) - Claude Codeの基礎理解
- ➡️ 次へ: [簡単なアプリ作成](04-quick-tutorial.md) - 実践的なチュートリアル

**関連ドキュメント:**
- [機能概要](02-features/README.md) - Claude Codeの全機能
- [テスト基礎](05-testing-basics.md) - 自動テスト入門
- [トラブルシューティング](09-troubleshooting.md) - 詳細な問題解決ガイド