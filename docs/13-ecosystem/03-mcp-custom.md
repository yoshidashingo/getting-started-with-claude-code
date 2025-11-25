# カスタムMCPサーバーの作成

Model Context Protocol (MCP)のカスタムサーバーを開発して、Claude Codeに独自の機能を追加する方法を学びます。

## 目次

- [カスタムMCPサーバーを作る理由](#カスタムmcpサーバーを作る理由)
- [MCPサーバーの基本構造](#mcpサーバーの基本構造)
- [開発環境のセットアップ](#開発環境のセットアップ)
- [TypeScript/JavaScriptでの実装](#typescriptjavascriptでの実装)
  - [Stdioサーバーの作成](#stdioサーバーの作成)
  - [HTTPサーバーの作成](#httpサーバーの作成)
  - [ツール定義](#ツール定義)
  - [リソース提供](#リソース提供)
  - [プロンプト定義](#プロンプト定義)
- [テスト方法](#テスト方法)
- [デバッグ方法](#デバッグ方法)
- [デプロイ方法](#デプロイ方法)
- [セキュリティ考慮事項](#セキュリティ考慮事項)
- [パフォーマンス最適化](#パフォーマンス最適化)
- [ベストプラクティス](#ベストプラクティス)
- [実践例](#実践例)

---

## カスタムMCPサーバーを作る理由

### カスタムMCPサーバーが必要なケース

既存のMCPサーバーでは対応できない、以下のようなニーズがある場合にカスタムサーバーを開発します:

**1. 独自システムとの統合**
- 社内システムやAPIへのアクセス
- カスタムデータベースとの連携
- 既存のワークフローツールとの統合

**2. 特殊なビジネスロジック**
- 業界固有の処理や計算
- カスタムデータ変換
- 独自の検証ルール

**3. プライベートリソースへのアクセス**
- 機密データへの安全なアクセス
- 企業内ナレッジベース
- プライベートドキュメント管理

**4. パフォーマンス最適化**
- 特定のユースケースに最適化された処理
- カスタムキャッシング戦略
- バッチ処理の効率化

### MCPサーバーの利点

- **標準化されたインターフェース**: MCPプロトコルに準拠することで、Claude Codeとシームレスに統合
- **再利用性**: 一度作成すれば、複数のプロジェクトや環境で再利用可能
- **拡張性**: 新しい機能を簡単に追加できる柔軟な設計
- **セキュリティ**: アクセス制御とデータ保護を適切に実装可能

---

## MCPサーバーの基本構造

### MCPアーキテクチャ

```
┌─────────────────┐
│  Claude Code    │
│    (クライアント)  │
└────────┬────────┘
         │ MCP Protocol
         │ (JSON-RPC 2.0)
         │
┌────────┴────────┐
│   MCP Server    │
│                 │
│  ┌───────────┐  │
│  │  Tools    │  │  ← 実行可能な機能
│  ├───────────┤  │
│  │ Resources │  │  ← 読み取り可能なデータ
│  ├───────────┤  │
│  │ Prompts   │  │  ← テンプレート
│  └───────────┘  │
└─────────────────┘
```

### コア概念

**1. Tools (ツール)**
- Claude Codeが実行できる機能
- 入力パラメータと出力を定義
- 例: データベース検索、API呼び出し、ファイル処理

**2. Resources (リソース)**
- Claude Codeが読み取れるデータ
- URI形式でアクセス
- 例: ファイル、データベースエントリ、API レスポンス

**3. Prompts (プロンプト)**
- 再利用可能なプロンプトテンプレート
- 変数を含むことが可能
- 例: コードレビュー、ドキュメント生成テンプレート

### 通信プロトコル

MCPはJSON-RPC 2.0をベースにしており、2つの通信方式をサポート:

**1. Stdio (標準入出力)**
- ローカルプロセス間通信
- シンプルで軽量
- 開発・テストに最適

**2. HTTP/HTTPS**
- ネットワーク経由の通信
- スケーラブル
- 本番環境に最適

---

## 開発環境のセットアップ

### 前提条件

```bash
# Node.js 18以上が必要
node --version  # v18.0.0以上

# TypeScriptをグローバルにインストール（推奨）
npm install -g typescript ts-node
```

### プロジェクト初期化

```bash
# プロジェクトディレクトリを作成
mkdir my-mcp-server
cd my-mcp-server

# package.jsonを初期化
npm init -y

# 必要な依存関係をインストール
npm install @modelcontextprotocol/sdk zod
npm install -D typescript @types/node tsx

# TypeScript設定を初期化
npx tsc --init
```

### TypeScript設定

`tsconfig.json`を以下のように設定:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "Node16",
    "moduleResolution": "Node16",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### プロジェクト構造

```
my-mcp-server/
├── src/
│   ├── index.ts          # エントリーポイント
│   ├── tools/            # ツール定義
│   │   ├── index.ts
│   │   └── myTool.ts
│   ├── resources/        # リソース提供
│   │   ├── index.ts
│   │   └── myResource.ts
│   ├── prompts/          # プロンプト定義
│   │   ├── index.ts
│   │   └── myPrompt.ts
│   └── types/            # 型定義
│       └── index.ts
├── tests/                # テストファイル
├── package.json
├── tsconfig.json
└── README.md
```

### package.json設定

```json
{
  "name": "my-mcp-server",
  "version": "1.0.0",
  "description": "Custom MCP Server",
  "type": "module",
  "main": "dist/index.js",
  "bin": {
    "my-mcp-server": "./dist/index.js"
  },
  "scripts": {
    "build": "tsc",
    "dev": "tsx watch src/index.ts",
    "start": "node dist/index.js",
    "test": "jest",
    "lint": "eslint src --ext .ts",
    "prepare": "npm run build"
  },
  "keywords": ["mcp", "model-context-protocol"],
  "author": "Your Name",
  "license": "MIT",
  "dependencies": {
    "@modelcontextprotocol/sdk": "^0.5.0",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.3.0",
    "tsx": "^4.0.0"
  }
}
```

---

## TypeScript/JavaScriptでの実装

### Stdioサーバーの作成

最もシンプルなMCPサーバーの実装例:

```typescript
// src/index.ts
#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// サーバーインスタンスを作成
const server = new Server(
  {
    name: "my-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},  // ツール機能を有効化
    },
  }
);

// ツール一覧を返すハンドラー
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "hello",
        description: "シンプルな挨拶を返すツール",
        inputSchema: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "挨拶する相手の名前",
            },
          },
          required: ["name"],
        },
      },
    ],
  };
});

// ツール実行ハンドラー
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "hello") {
    const name = String(request.params.arguments?.name ?? "World");
    return {
      content: [
        {
          type: "text",
          text: `こんにちは、${name}さん!`,
        },
      ],
    };
  }

  throw new Error(`Unknown tool: ${request.params.name}`);
});

// Stdioトランスポートで起動
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
```

### HTTPサーバーの作成

HTTPトランスポートを使用したサーバー実装:

```typescript
// src/http-server.ts
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

// MCPサーバーインスタンス
const server = new Server(
  {
    name: "my-http-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// ツール定義（Stdioサーバーと同じ）
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_time",
        description: "現在時刻を取得",
        inputSchema: {
          type: "object",
          properties: {
            timezone: {
              type: "string",
              description: "タイムゾーン（例: Asia/Tokyo）",
              default: "UTC",
            },
          },
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "get_time") {
    const timezone = String(request.params.arguments?.timezone ?? "UTC");
    const time = new Date().toLocaleString("ja-JP", { timeZone: timezone });

    return {
      content: [
        {
          type: "text",
          text: `現在時刻 (${timezone}): ${time}`,
        },
      ],
    };
  }

  throw new Error(`Unknown tool: ${request.params.name}`);
});

// SSEエンドポイント
app.get("/sse", async (req, res) => {
  const transport = new SSEServerTransport("/messages", res);
  await server.connect(transport);
});

// メッセージ受信エンドポイント
app.post("/messages", express.json(), async (req, res) => {
  // SSEServerTransportが自動処理
  res.status(200).end();
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`MCP HTTP Server running on http://localhost:${PORT}`);
});
```

### ツール定義

より複雑なツールの実装例:

```typescript
// src/tools/fileAnalyzer.ts
import { z } from "zod";
import fs from "fs/promises";
import path from "path";

// Zodでスキーマを定義
const FileAnalyzerArgsSchema = z.object({
  filePath: z.string().describe("解析するファイルのパス"),
  includeStats: z.boolean().optional().describe("ファイル統計を含めるか"),
});

type FileAnalyzerArgs = z.infer<typeof FileAnalyzerArgsSchema>;

// ツール定義
export const fileAnalyzerTool = {
  name: "analyze_file",
  description: "ファイルを解析して詳細情報を返す",
  inputSchema: {
    type: "object",
    properties: {
      filePath: {
        type: "string",
        description: "解析するファイルのパス",
      },
      includeStats: {
        type: "boolean",
        description: "ファイル統計を含めるか",
        default: false,
      },
    },
    required: ["filePath"],
  },
};

// ツール実装
export async function analyzeFile(args: unknown) {
  // 引数をバリデーション
  const parsed = FileAnalyzerArgsSchema.safeParse(args);
  if (!parsed.success) {
    throw new Error(`Invalid arguments: ${parsed.error.message}`);
  }

  const { filePath, includeStats } = parsed.data;

  try {
    // ファイル情報を取得
    const stats = await fs.stat(filePath);
    const content = await fs.readFile(filePath, "utf-8");

    // 基本情報
    const analysis = {
      path: filePath,
      name: path.basename(filePath),
      extension: path.extname(filePath),
      size: stats.size,
      lines: content.split("\n").length,
      characters: content.length,
    };

    // オプション: 詳細統計
    if (includeStats) {
      Object.assign(analysis, {
        created: stats.birthtime,
        modified: stats.mtime,
        isDirectory: stats.isDirectory(),
        isFile: stats.isFile(),
        permissions: stats.mode.toString(8).slice(-3),
      });
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(analysis, null, 2),
        },
      ],
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`ファイル解析エラー: ${error.message}`);
    }
    throw error;
  }
}
```

```typescript
// src/index.ts にツールを統合
import { fileAnalyzerTool, analyzeFile } from "./tools/fileAnalyzer.js";

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      fileAnalyzerTool,
      // 他のツールを追加...
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  switch (request.params.name) {
    case "analyze_file":
      return await analyzeFile(request.params.arguments);

    // 他のツールハンドラー...

    default:
      throw new Error(`Unknown tool: ${request.params.name}`);
  }
});
```

### リソース提供

リソースを提供する実装例:

```typescript
// src/resources/documentation.ts
import {
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import fs from "fs/promises";
import path from "path";

// リソース一覧を返す
export async function listDocumentationResources(docsDir: string) {
  const files = await fs.readdir(docsDir);
  const mdFiles = files.filter(f => f.endsWith(".md"));

  return {
    resources: mdFiles.map(file => ({
      uri: `docs:///${file}`,
      name: file,
      description: `ドキュメント: ${file}`,
      mimeType: "text/markdown",
    })),
  };
}

// リソースを読み取る
export async function readDocumentationResource(uri: string, docsDir: string) {
  // URIからファイル名を抽出
  const filename = uri.replace("docs:///", "");
  const filePath = path.join(docsDir, filename);

  try {
    const content = await fs.readFile(filePath, "utf-8");

    return {
      contents: [
        {
          uri,
          mimeType: "text/markdown",
          text: content,
        },
      ],
    };
  } catch (error) {
    throw new Error(`リソースが見つかりません: ${uri}`);
  }
}
```

```typescript
// src/index.ts にリソースを統合
import {
  listDocumentationResources,
  readDocumentationResource,
} from "./resources/documentation.js";

const DOCS_DIR = process.env.DOCS_DIR || "./docs";

// リソース機能を有効化
const server = new Server(
  {
    name: "my-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
      resources: {},  // リソース機能を追加
    },
  }
);

// リソース一覧ハンドラー
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return await listDocumentationResources(DOCS_DIR);
});

// リソース読み取りハンドラー
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  return await readDocumentationResource(request.params.uri, DOCS_DIR);
});
```

### プロンプト定義

再利用可能なプロンプトテンプレートの実装:

```typescript
// src/prompts/codeReview.ts
import {
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// プロンプト定義
export const codeReviewPrompt = {
  name: "code_review",
  description: "コードレビュー用のプロンプトテンプレート",
  arguments: [
    {
      name: "language",
      description: "プログラミング言語",
      required: true,
    },
    {
      name: "focus",
      description: "レビューの焦点（security, performance, style）",
      required: false,
    },
  ],
};

// プロンプト生成
export function generateCodeReviewPrompt(args: {
  language: string;
  focus?: string;
}) {
  const { language, focus = "general" } = args;

  const focusInstructions = {
    security: "セキュリティ上の脆弱性や問題点を重点的にチェックしてください。",
    performance: "パフォーマンスの最適化ポイントを重点的にチェックしてください。",
    style: "コーディングスタイルとベストプラクティスを重点的にチェックしてください。",
    general: "全体的な品質をチェックしてください。",
  };

  const instruction = focusInstructions[focus as keyof typeof focusInstructions]
    || focusInstructions.general;

  return {
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: `
以下の${language}コードをレビューしてください。

レビューの焦点: ${focus}
${instruction}

以下の観点でレビューしてください:
1. コードの品質と可読性
2. 潜在的なバグや問題
3. パフォーマンスの考慮事項
4. セキュリティの懸念
5. ベストプラクティスへの準拠

改善提案を具体的なコード例とともに提供してください。
          `.trim(),
        },
      },
    ],
  };
}
```

```typescript
// src/index.ts にプロンプトを統合
import { codeReviewPrompt, generateCodeReviewPrompt } from "./prompts/codeReview.js";

// プロンプト機能を有効化
const server = new Server(
  {
    name: "my-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
      resources: {},
      prompts: {},  // プロンプト機能を追加
    },
  }
);

// プロンプト一覧ハンドラー
server.setRequestHandler(ListPromptsRequestSchema, async () => {
  return {
    prompts: [
      codeReviewPrompt,
      // 他のプロンプトを追加...
    ],
  };
});

// プロンプト取得ハンドラー
server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  if (request.params.name === "code_review") {
    return generateCodeReviewPrompt(request.params.arguments || {});
  }

  throw new Error(`Unknown prompt: ${request.params.name}`);
});
```

---

## テスト方法

### ユニットテスト

Jestを使用したテスト例:

```typescript
// tests/tools/fileAnalyzer.test.ts
import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import fs from "fs/promises";
import path from "path";
import { analyzeFile } from "../../src/tools/fileAnalyzer.js";

describe("FileAnalyzer Tool", () => {
  const testDir = path.join(__dirname, "test-files");
  const testFile = path.join(testDir, "test.txt");

  beforeEach(async () => {
    await fs.mkdir(testDir, { recursive: true });
    await fs.writeFile(testFile, "Hello\nWorld\n");
  });

  afterEach(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
  });

  it("should analyze file correctly", async () => {
    const result = await analyzeFile({
      filePath: testFile,
      includeStats: false,
    });

    const content = JSON.parse(result.content[0].text);
    expect(content.name).toBe("test.txt");
    expect(content.lines).toBe(3);
    expect(content.extension).toBe(".txt");
  });

  it("should include stats when requested", async () => {
    const result = await analyzeFile({
      filePath: testFile,
      includeStats: true,
    });

    const content = JSON.parse(result.content[0].text);
    expect(content.created).toBeDefined();
    expect(content.modified).toBeDefined();
    expect(content.permissions).toBeDefined();
  });

  it("should throw error for non-existent file", async () => {
    await expect(
      analyzeFile({ filePath: "non-existent.txt" })
    ).rejects.toThrow();
  });
});
```

### 統合テスト

MCPクライアントを使用した統合テスト:

```typescript
// tests/integration/server.test.ts
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { spawn } from "child_process";

describe("MCP Server Integration", () => {
  let client: Client;
  let serverProcess: any;

  beforeEach(async () => {
    // サーバープロセスを起動
    serverProcess = spawn("node", ["dist/index.js"], {
      stdio: ["pipe", "pipe", "pipe"],
    });

    // クライアントを作成
    const transport = new StdioClientTransport({
      command: "node",
      args: ["dist/index.js"],
    });

    client = new Client(
      {
        name: "test-client",
        version: "1.0.0",
      },
      {
        capabilities: {},
      }
    );

    await client.connect(transport);
  });

  afterEach(async () => {
    await client.close();
    serverProcess.kill();
  });

  it("should list tools", async () => {
    const response = await client.request(
      { method: "tools/list" },
      { method: "tools/list" }
    );

    expect(response.tools).toBeDefined();
    expect(response.tools.length).toBeGreaterThan(0);
  });

  it("should execute tool", async () => {
    const response = await client.request(
      {
        method: "tools/call",
        params: {
          name: "hello",
          arguments: { name: "Test" },
        },
      },
      { method: "tools/call" }
    );

    expect(response.content).toBeDefined();
    expect(response.content[0].text).toContain("Test");
  });
});
```

### テスト設定

```json
// jest.config.json
{
  "preset": "ts-jest",
  "testEnvironment": "node",
  "roots": ["<rootDir>/tests"],
  "testMatch": ["**/*.test.ts"],
  "collectCoverageFrom": [
    "src/**/*.ts",
    "!src/**/*.d.ts",
    "!src/index.ts"
  ],
  "coverageThreshold": {
    "global": {
      "branches": 80,
      "functions": 80,
      "lines": 80,
      "statements": 80
    }
  }
}
```

---

## デバッグ方法

### ログ出力

```typescript
// src/utils/logger.ts
import fs from "fs";
import path from "path";

class Logger {
  private logFile: string;

  constructor(logFile: string = "mcp-server.log") {
    this.logFile = path.join(process.cwd(), logFile);
  }

  log(level: string, message: string, data?: any) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      data,
    };

    // stderrに出力（stdoutはMCPプロトコルで使用）
    console.error(JSON.stringify(logEntry));

    // ファイルにも記録
    fs.appendFileSync(
      this.logFile,
      JSON.stringify(logEntry) + "\n"
    );
  }

  info(message: string, data?: any) {
    this.log("INFO", message, data);
  }

  error(message: string, data?: any) {
    this.log("ERROR", message, data);
  }

  debug(message: string, data?: any) {
    if (process.env.DEBUG === "true") {
      this.log("DEBUG", message, data);
    }
  }
}

export const logger = new Logger();
```

```typescript
// 使用例
import { logger } from "./utils/logger.js";

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  logger.info("Tool called", {
    name: request.params.name,
    arguments: request.params.arguments,
  });

  try {
    const result = await handleTool(request);
    logger.info("Tool succeeded", { name: request.params.name });
    return result;
  } catch (error) {
    logger.error("Tool failed", {
      name: request.params.name,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
});
```

### デバッグモード

```typescript
// src/config.ts
export const config = {
  debug: process.env.DEBUG === "true",
  logLevel: process.env.LOG_LEVEL || "info",
  logFile: process.env.LOG_FILE || "mcp-server.log",
};

// 使用例
if (config.debug) {
  logger.debug("Server configuration", config);
}
```

### VS Codeデバッグ設定

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug MCP Server",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/src/index.ts",
      "preLaunchTask": "npm: build",
      "outFiles": ["${workspaceFolder}/dist/**/*.js"],
      "env": {
        "DEBUG": "true",
        "LOG_LEVEL": "debug"
      },
      "console": "integratedTerminal"
    }
  ]
}
```

### インスペクター機能

```typescript
// src/inspector.ts
export class ServerInspector {
  private requestCount = 0;
  private errorCount = 0;
  private requestTimes: number[] = [];

  trackRequest(duration: number) {
    this.requestCount++;
    this.requestTimes.push(duration);
  }

  trackError() {
    this.errorCount++;
  }

  getStats() {
    const avgTime = this.requestTimes.length > 0
      ? this.requestTimes.reduce((a, b) => a + b) / this.requestTimes.length
      : 0;

    return {
      totalRequests: this.requestCount,
      totalErrors: this.errorCount,
      averageResponseTime: avgTime,
      errorRate: this.requestCount > 0
        ? (this.errorCount / this.requestCount) * 100
        : 0,
    };
  }
}

export const inspector = new ServerInspector();
```

---

## デプロイ方法

### ローカルデプロイ

#### npmパッケージとして公開

```bash
# ビルド
npm run build

# npmに公開
npm publish

# ユーザーがインストール
npm install -g my-mcp-server
```

#### Claude Code設定

```json
// ~/.claude/config.json
{
  "mcpServers": {
    "my-server": {
      "command": "my-mcp-server",
      "args": [],
      "env": {
        "DEBUG": "false"
      }
    }
  }
}
```

### Dockerデプロイ

```dockerfile
# Dockerfile
FROM node:20-alpine

WORKDIR /app

# 依存関係をコピーしてインストール
COPY package*.json ./
RUN npm ci --only=production

# ソースコードをコピー
COPY dist ./dist

# 非rootユーザーで実行
USER node

# ヘルスチェック
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "console.log('OK')" || exit 1

CMD ["node", "dist/index.js"]
```

```bash
# イメージをビルド
docker build -t my-mcp-server .

# コンテナを実行
docker run -d \
  --name mcp-server \
  -p 3000:3000 \
  -e DEBUG=false \
  my-mcp-server
```

### クラウドデプロイ

#### AWS Lambda

```typescript
// src/lambda.ts
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { APIGatewayProxyHandler } from "aws-lambda";

let server: Server | null = null;

function getServer() {
  if (!server) {
    server = new Server(
      {
        name: "lambda-mcp-server",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    // ハンドラーを設定...
  }
  return server;
}

export const handler: APIGatewayProxyHandler = async (event) => {
  const server = getServer();

  try {
    const request = JSON.parse(event.body || "{}");
    const response = await server.handleRequest(request);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(response),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};
```

#### Vercel/Netlify

```typescript
// api/mcp.ts (Vercel)
import { VercelRequest, VercelResponse } from "@vercel/node";
import { createServer } from "../src/server.js";

const server = createServer();

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const response = await server.handleRequest(req.body);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
```

### 環境変数管理

```bash
# .env.example
DEBUG=false
LOG_LEVEL=info
PORT=3000
API_KEY=your-api-key
DATABASE_URL=postgresql://user:pass@host:5432/db
```

```typescript
// src/config.ts
import { z } from "zod";

const EnvSchema = z.object({
  DEBUG: z.string().transform(v => v === "true").default("false"),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
  PORT: z.string().transform(Number).default("3000"),
  API_KEY: z.string().optional(),
  DATABASE_URL: z.string().url().optional(),
});

export const env = EnvSchema.parse(process.env);
```

---

## セキュリティ考慮事項

### 入力バリデーション

```typescript
// 常にZodなどで入力を検証
import { z } from "zod";

const ToolArgsSchema = z.object({
  path: z.string().refine(
    (path) => !path.includes(".."),
    "パストラバーサル攻撃を検出"
  ),
  content: z.string().max(1000000, "コンテンツが大きすぎます"),
});
```

### 認証・認可

```typescript
// src/middleware/auth.ts
export class AuthMiddleware {
  private apiKeys: Set<string>;

  constructor(apiKeys: string[]) {
    this.apiKeys = new Set(apiKeys);
  }

  authenticate(request: any): boolean {
    const apiKey = request.headers?.["x-api-key"];

    if (!apiKey || !this.apiKeys.has(apiKey)) {
      throw new Error("Unauthorized: Invalid API key");
    }

    return true;
  }

  authorize(user: string, resource: string, action: string): boolean {
    // 権限チェックロジック
    // 例: RBACやABACの実装
    return true;
  }
}
```

### レート制限

```typescript
// src/middleware/rateLimit.ts
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private limit: number;
  private window: number;

  constructor(limit: number = 100, windowMs: number = 60000) {
    this.limit = limit;
    this.window = windowMs;
  }

  checkLimit(clientId: string): boolean {
    const now = Date.now();
    const clientRequests = this.requests.get(clientId) || [];

    // 古いリクエストを削除
    const recentRequests = clientRequests.filter(
      time => now - time < this.window
    );

    if (recentRequests.length >= this.limit) {
      throw new Error("Rate limit exceeded");
    }

    recentRequests.push(now);
    this.requests.set(clientId, recentRequests);

    return true;
  }
}
```

### データサニタイゼーション

```typescript
// src/utils/sanitize.ts
export function sanitizeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

export function sanitizePath(input: string): string {
  // パストラバーサル攻撃を防ぐ
  const normalized = path.normalize(input);
  if (normalized.includes("..")) {
    throw new Error("Invalid path: contains parent directory reference");
  }
  return normalized;
}
```

### セキュリティヘッダー

```typescript
// src/middleware/security.ts
export function setSecurityHeaders(res: any) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self'; object-src 'none'"
  );
}
```

### ⚠️ セキュリティチェックリスト

- [ ] すべての入力をバリデーション
- [ ] 認証・認可の実装
- [ ] レート制限の設定
- [ ] エラーメッセージから機密情報を除外
- [ ] ログに機密情報を記録しない
- [ ] HTTPS通信の強制（本番環境）
- [ ] 依存関係の脆弱性スキャン（`npm audit`）
- [ ] 環境変数の安全な管理
- [ ] CSRFトークンの実装（該当する場合）
- [ ] SQLインジェクション対策（該当する場合）

---

## パフォーマンス最適化

### キャッシング戦略

```typescript
// src/utils/cache.ts
export class SimpleCache<T> {
  private cache: Map<string, { value: T; expires: number }> = new Map();
  private ttl: number;

  constructor(ttlMs: number = 300000) {
    this.ttl = ttlMs;
  }

  set(key: string, value: T, ttl?: number): void {
    const expires = Date.now() + (ttl || this.ttl);
    this.cache.set(key, { value, expires });
  }

  get(key: string): T | null {
    const item = this.cache.get(key);

    if (!item) return null;

    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  clear(): void {
    this.cache.clear();
  }

  // 定期的に期限切れアイテムを削除
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expires) {
        this.cache.delete(key);
      }
    }
  }
}

// 使用例
const cache = new SimpleCache<any>(60000); // 1分間キャッシュ

export async function cachedToolHandler(args: any) {
  const cacheKey = JSON.stringify(args);

  // キャッシュをチェック
  const cached = cache.get(cacheKey);
  if (cached) {
    return cached;
  }

  // 実行してキャッシュ
  const result = await expensiveOperation(args);
  cache.set(cacheKey, result);

  return result;
}
```

### 並行処理

```typescript
// src/utils/parallel.ts
export async function processInParallel<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  concurrency: number = 5
): Promise<R[]> {
  const results: R[] = [];
  const executing: Promise<void>[] = [];

  for (const item of items) {
    const promise = processor(item).then(result => {
      results.push(result);
    });

    executing.push(promise);

    if (executing.length >= concurrency) {
      await Promise.race(executing);
      executing.splice(
        executing.findIndex(p => p === promise),
        1
      );
    }
  }

  await Promise.all(executing);
  return results;
}

// 使用例
const files = ["file1.txt", "file2.txt", "file3.txt"];
const results = await processInParallel(
  files,
  async (file) => await analyzeFile({ filePath: file }),
  3 // 最大3つ同時実行
);
```

### ストリーミング処理

```typescript
// src/utils/streaming.ts
import { Readable } from "stream";

export async function* streamLargeFile(filePath: string) {
  const stream = fs.createReadStream(filePath, {
    encoding: "utf-8",
    highWaterMark: 64 * 1024, // 64KB chunks
  });

  for await (const chunk of stream) {
    yield chunk;
  }
}

// 使用例
export async function processLargeFileInChunks(filePath: string) {
  let processedChunks = 0;

  for await (const chunk of streamLargeFile(filePath)) {
    // チャンクごとに処理
    await processChunk(chunk);
    processedChunks++;
  }

  return { processedChunks };
}
```

### メモリ管理

```typescript
// src/utils/memory.ts
export class MemoryMonitor {
  private maxMemoryMB: number;

  constructor(maxMemoryMB: number = 512) {
    this.maxMemoryMB = maxMemoryMB;
  }

  checkMemoryUsage(): void {
    const usage = process.memoryUsage();
    const usedMB = usage.heapUsed / 1024 / 1024;

    if (usedMB > this.maxMemoryMB) {
      // ガベージコレクションを強制
      if (global.gc) {
        global.gc();
      }

      logger.warn("High memory usage", {
        usedMB: usedMB.toFixed(2),
        maxMB: this.maxMemoryMB,
      });
    }
  }

  getMemoryStats() {
    const usage = process.memoryUsage();
    return {
      heapUsed: (usage.heapUsed / 1024 / 1024).toFixed(2) + " MB",
      heapTotal: (usage.heapTotal / 1024 / 1024).toFixed(2) + " MB",
      external: (usage.external / 1024 / 1024).toFixed(2) + " MB",
      rss: (usage.rss / 1024 / 1024).toFixed(2) + " MB",
    };
  }
}
```

---

## ベストプラクティス

### 1. エラーハンドリング

```typescript
// 明確なエラーメッセージを提供
export class MCPError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = "MCPError";
  }
}

// 使用例
if (!fileExists) {
  throw new MCPError(
    "ファイルが見つかりません",
    "FILE_NOT_FOUND",
    404
  );
}
```

### 2. 型安全性

```typescript
// Zodで実行時バリデーションと型推論を組み合わせる
import { z } from "zod";

const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  email: z.string().email(),
  age: z.number().int().min(0).max(150).optional(),
});

type User = z.infer<typeof UserSchema>;

// 型安全な関数
function processUser(data: unknown): User {
  return UserSchema.parse(data); // バリデーション + 型変換
}
```

### 3. ドキュメント化

```typescript
/**
 * ファイルを解析して詳細情報を返すツール
 *
 * @param args - ツールの引数
 * @param args.filePath - 解析するファイルのパス
 * @param args.includeStats - ファイル統計を含めるか（デフォルト: false）
 * @returns ファイル解析結果
 * @throws {MCPError} ファイルが見つからない場合
 *
 * @example
 * ```typescript
 * const result = await analyzeFile({
 *   filePath: "/path/to/file.txt",
 *   includeStats: true
 * });
 * ```
 */
export async function analyzeFile(args: FileAnalyzerArgs) {
  // 実装...
}
```

### 4. 設定管理

```typescript
// src/config/index.ts
import { z } from "zod";

const ConfigSchema = z.object({
  server: z.object({
    name: z.string(),
    version: z.string(),
    port: z.number().default(3000),
  }),
  features: z.object({
    tools: z.boolean().default(true),
    resources: z.boolean().default(true),
    prompts: z.boolean().default(true),
  }),
  performance: z.object({
    cacheEnabled: z.boolean().default(true),
    cacheTTL: z.number().default(300000),
    maxConcurrency: z.number().default(5),
  }),
  security: z.object({
    apiKeys: z.array(z.string()).optional(),
    rateLimit: z.number().default(100),
    rateLimitWindow: z.number().default(60000),
  }),
});

export type Config = z.infer<typeof ConfigSchema>;

export function loadConfig(): Config {
  return ConfigSchema.parse({
    server: {
      name: process.env.SERVER_NAME || "my-mcp-server",
      version: process.env.SERVER_VERSION || "1.0.0",
      port: parseInt(process.env.PORT || "3000"),
    },
    features: {
      tools: process.env.ENABLE_TOOLS !== "false",
      resources: process.env.ENABLE_RESOURCES !== "false",
      prompts: process.env.ENABLE_PROMPTS !== "false",
    },
    performance: {
      cacheEnabled: process.env.CACHE_ENABLED !== "false",
      cacheTTL: parseInt(process.env.CACHE_TTL || "300000"),
      maxConcurrency: parseInt(process.env.MAX_CONCURRENCY || "5"),
    },
    security: {
      apiKeys: process.env.API_KEYS?.split(","),
      rateLimit: parseInt(process.env.RATE_LIMIT || "100"),
      rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW || "60000"),
    },
  });
}
```

### 5. モジュラー設計

```typescript
// src/server.ts
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { registerTools } from "./tools/index.js";
import { registerResources } from "./resources/index.js";
import { registerPrompts } from "./prompts/index.js";
import { loadConfig } from "./config/index.js";

export function createServer() {
  const config = loadConfig();

  const server = new Server(
    {
      name: config.server.name,
      version: config.server.version,
    },
    {
      capabilities: {
        tools: config.features.tools ? {} : undefined,
        resources: config.features.resources ? {} : undefined,
        prompts: config.features.prompts ? {} : undefined,
      },
    }
  );

  // 各機能を登録
  if (config.features.tools) {
    registerTools(server, config);
  }

  if (config.features.resources) {
    registerResources(server, config);
  }

  if (config.features.prompts) {
    registerPrompts(server, config);
  }

  return server;
}
```

---

## 実践例

### 例1: GitHub統合サーバー

完全なGitHub APIと連携するMCPサーバー:

```typescript
// src/servers/github-server.ts
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { Octokit } from "@octokit/rest";
import { z } from "zod";

// GitHub設定
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

// スキーマ定義
const RepoInfoArgsSchema = z.object({
  owner: z.string().describe("リポジトリオーナー"),
  repo: z.string().describe("リポジトリ名"),
});

const CreateIssueArgsSchema = z.object({
  owner: z.string(),
  repo: z.string(),
  title: z.string().min(1),
  body: z.string().optional(),
  labels: z.array(z.string()).optional(),
});

const SearchCodeArgsSchema = z.object({
  query: z.string().describe("検索クエリ"),
  repo: z.string().optional().describe("owner/repo形式"),
});

// サーバー作成
export function createGitHubServer() {
  const server = new Server(
    {
      name: "github-mcp-server",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {},
        resources: {},
      },
    }
  );

  // ツール一覧
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        {
          name: "get_repo_info",
          description: "GitHubリポジトリの詳細情報を取得",
          inputSchema: {
            type: "object",
            properties: {
              owner: { type: "string", description: "リポジトリオーナー" },
              repo: { type: "string", description: "リポジトリ名" },
            },
            required: ["owner", "repo"],
          },
        },
        {
          name: "create_issue",
          description: "新しいGitHub Issueを作成",
          inputSchema: {
            type: "object",
            properties: {
              owner: { type: "string" },
              repo: { type: "string" },
              title: { type: "string" },
              body: { type: "string" },
              labels: { type: "array", items: { type: "string" } },
            },
            required: ["owner", "repo", "title"],
          },
        },
        {
          name: "search_code",
          description: "GitHub上のコードを検索",
          inputSchema: {
            type: "object",
            properties: {
              query: { type: "string", description: "検索クエリ" },
              repo: { type: "string", description: "owner/repo形式（オプション）" },
            },
            required: ["query"],
          },
        },
      ],
    };
  });

  // ツール実行
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    switch (request.params.name) {
      case "get_repo_info": {
        const args = RepoInfoArgsSchema.parse(request.params.arguments);
        const { data } = await octokit.repos.get(args);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                name: data.name,
                full_name: data.full_name,
                description: data.description,
                stars: data.stargazers_count,
                forks: data.forks_count,
                language: data.language,
                open_issues: data.open_issues_count,
                created_at: data.created_at,
                updated_at: data.updated_at,
                homepage: data.homepage,
                topics: data.topics,
              }, null, 2),
            },
          ],
        };
      }

      case "create_issue": {
        const args = CreateIssueArgsSchema.parse(request.params.arguments);
        const { data } = await octokit.issues.create({
          owner: args.owner,
          repo: args.repo,
          title: args.title,
          body: args.body,
          labels: args.labels,
        });

        return {
          content: [
            {
              type: "text",
              text: `Issue作成成功: ${data.html_url}\nNumber: #${data.number}`,
            },
          ],
        };
      }

      case "search_code": {
        const args = SearchCodeArgsSchema.parse(request.params.arguments);
        const query = args.repo
          ? `${args.query} repo:${args.repo}`
          : args.query;

        const { data } = await octokit.search.code({ q: query });

        const results = data.items.slice(0, 10).map(item => ({
          name: item.name,
          path: item.path,
          repo: item.repository.full_name,
          url: item.html_url,
        }));

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                total: data.total_count,
                results,
              }, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${request.params.name}`);
    }
  });

  // リソース一覧
  server.setRequestHandler(ListResourcesRequestSchema, async () => {
    // 認証ユーザーのリポジトリ一覧を提供
    const { data } = await octokit.repos.listForAuthenticatedUser({
      per_page: 100,
      sort: "updated",
    });

    return {
      resources: data.map(repo => ({
        uri: `github:///${repo.full_name}`,
        name: repo.full_name,
        description: repo.description || "No description",
        mimeType: "application/json",
      })),
    };
  });

  // リソース読み取り
  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const match = request.params.uri.match(/^github:\/\/\/(.+)$/);
    if (!match) {
      throw new Error("Invalid GitHub URI");
    }

    const [owner, repo] = match[1].split("/");
    const { data } = await octokit.repos.get({ owner, repo });

    return {
      contents: [
        {
          uri: request.params.uri,
          mimeType: "application/json",
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  });

  return server;
}
```

```bash
# 使用方法
export GITHUB_TOKEN=your_token_here
node dist/github-server.js
```

### 例2: データベース統合サーバー

PostgreSQLと連携するMCPサーバー:

```typescript
// src/servers/database-server.ts
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { Pool } from "pg";
import { z } from "zod";

// データベース接続
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// スキーマ定義
const QueryArgsSchema = z.object({
  sql: z.string().describe("実行するSQLクエリ"),
  params: z.array(z.any()).optional().describe("SQLパラメータ"),
});

const TableInfoArgsSchema = z.object({
  tableName: z.string().describe("テーブル名"),
});

// サーバー作成
export function createDatabaseServer() {
  const server = new Server(
    {
      name: "database-mcp-server",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // ツール一覧
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        {
          name: "query",
          description: "SQLクエリを実行（SELECT限定）",
          inputSchema: {
            type: "object",
            properties: {
              sql: { type: "string", description: "SQLクエリ" },
              params: {
                type: "array",
                items: { type: "any" },
                description: "パラメータ",
              },
            },
            required: ["sql"],
          },
        },
        {
          name: "list_tables",
          description: "データベース内のテーブル一覧を取得",
          inputSchema: {
            type: "object",
            properties: {},
          },
        },
        {
          name: "table_info",
          description: "テーブルのスキーマ情報を取得",
          inputSchema: {
            type: "object",
            properties: {
              tableName: { type: "string", description: "テーブル名" },
            },
            required: ["tableName"],
          },
        },
      ],
    };
  });

  // ツール実行
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    switch (request.params.name) {
      case "query": {
        const args = QueryArgsSchema.parse(request.params.arguments);

        // SELECTクエリのみ許可（セキュリティ）
        if (!args.sql.trim().toLowerCase().startsWith("select")) {
          throw new Error("Only SELECT queries are allowed");
        }

        const client = await pool.connect();
        try {
          const result = await client.query(args.sql, args.params);

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  rows: result.rows,
                  rowCount: result.rowCount,
                  fields: result.fields.map(f => ({
                    name: f.name,
                    dataType: f.dataTypeID,
                  })),
                }, null, 2),
              },
            ],
          };
        } finally {
          client.release();
        }
      }

      case "list_tables": {
        const client = await pool.connect();
        try {
          const result = await client.query(`
            SELECT
              table_name,
              table_type
            FROM information_schema.tables
            WHERE table_schema = 'public'
            ORDER BY table_name
          `);

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(result.rows, null, 2),
              },
            ],
          };
        } finally {
          client.release();
        }
      }

      case "table_info": {
        const args = TableInfoArgsSchema.parse(request.params.arguments);
        const client = await pool.connect();

        try {
          const result = await client.query(`
            SELECT
              column_name,
              data_type,
              is_nullable,
              column_default
            FROM information_schema.columns
            WHERE table_name = $1
            ORDER BY ordinal_position
          `, [args.tableName]);

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  table: args.tableName,
                  columns: result.rows,
                }, null, 2),
              },
            ],
          };
        } finally {
          client.release();
        }
      }

      default:
        throw new Error(`Unknown tool: ${request.params.name}`);
    }
  });

  return server;
}

// クリーンアップ
process.on("exit", () => {
  pool.end();
});
```

### 例3: ドキュメント検索サーバー

Markdown文書を検索・提供するMCPサーバー:

```typescript
// src/servers/docs-server.ts
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  GetPromptRequestSchema,
  ListPromptsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import fs from "fs/promises";
import path from "path";
import { z } from "zod";
import { marked } from "marked";

// スキーマ定義
const SearchArgsSchema = z.object({
  query: z.string().describe("検索クエリ"),
  caseSensitive: z.boolean().optional().default(false),
});

// ドキュメント検索
async function searchDocuments(docsDir: string, query: string, caseSensitive: boolean) {
  const results: Array<{
    file: string;
    matches: Array<{ line: number; content: string }>;
  }> = [];

  async function searchDir(dir: string) {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        await searchDir(fullPath);
      } else if (entry.name.endsWith(".md")) {
        const content = await fs.readFile(fullPath, "utf-8");
        const lines = content.split("\n");
        const matches: Array<{ line: number; content: string }> = [];

        lines.forEach((line, index) => {
          const searchLine = caseSensitive ? line : line.toLowerCase();
          const searchQuery = caseSensitive ? query : query.toLowerCase();

          if (searchLine.includes(searchQuery)) {
            matches.push({
              line: index + 1,
              content: line.trim(),
            });
          }
        });

        if (matches.length > 0) {
          results.push({
            file: path.relative(docsDir, fullPath),
            matches: matches.slice(0, 5), // 最初の5件のみ
          });
        }
      }
    }
  }

  await searchDir(docsDir);
  return results;
}

// ドキュメント一覧取得
async function listDocuments(docsDir: string) {
  const documents: Array<{ path: string; size: number }> = [];

  async function scanDir(dir: string) {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        await scanDir(fullPath);
      } else if (entry.name.endsWith(".md")) {
        const stats = await fs.stat(fullPath);
        documents.push({
          path: path.relative(docsDir, fullPath),
          size: stats.size,
        });
      }
    }
  }

  await scanDir(docsDir);
  return documents;
}

// サーバー作成
export function createDocsServer(docsDir: string) {
  const server = new Server(
    {
      name: "docs-mcp-server",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {},
        resources: {},
        prompts: {},
      },
    }
  );

  // ツール一覧
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        {
          name: "search_docs",
          description: "ドキュメント内を全文検索",
          inputSchema: {
            type: "object",
            properties: {
              query: { type: "string", description: "検索クエリ" },
              caseSensitive: {
                type: "boolean",
                description: "大文字小文字を区別",
                default: false,
              },
            },
            required: ["query"],
          },
        },
        {
          name: "list_docs",
          description: "すべてのドキュメントファイルを一覧表示",
          inputSchema: {
            type: "object",
            properties: {},
          },
        },
      ],
    };
  });

  // ツール実行
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    switch (request.params.name) {
      case "search_docs": {
        const args = SearchArgsSchema.parse(request.params.arguments);
        const results = await searchDocuments(
          docsDir,
          args.query,
          args.caseSensitive
        );

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                query: args.query,
                totalFiles: results.length,
                results,
              }, null, 2),
            },
          ],
        };
      }

      case "list_docs": {
        const docs = await listDocuments(docsDir);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                total: docs.length,
                documents: docs,
              }, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${request.params.name}`);
    }
  });

  // リソース一覧
  server.setRequestHandler(ListResourcesRequestSchema, async () => {
    const docs = await listDocuments(docsDir);

    return {
      resources: docs.map(doc => ({
        uri: `docs:///${doc.path}`,
        name: doc.path,
        description: `ドキュメント: ${doc.path}`,
        mimeType: "text/markdown",
      })),
    };
  });

  // リソース読み取り
  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const docPath = request.params.uri.replace("docs:///", "");
    const fullPath = path.join(docsDir, docPath);

    try {
      const content = await fs.readFile(fullPath, "utf-8");

      return {
        contents: [
          {
            uri: request.params.uri,
            mimeType: "text/markdown",
            text: content,
          },
        ],
      };
    } catch (error) {
      throw new Error(`ドキュメントが見つかりません: ${docPath}`);
    }
  });

  // プロンプト一覧
  server.setRequestHandler(ListPromptsRequestSchema, async () => {
    return {
      prompts: [
        {
          name: "summarize_doc",
          description: "ドキュメントを要約",
          arguments: [
            {
              name: "docPath",
              description: "ドキュメントパス",
              required: true,
            },
          ],
        },
      ],
    };
  });

  // プロンプト取得
  server.setRequestHandler(GetPromptRequestSchema, async (request) => {
    if (request.params.name === "summarize_doc") {
      const docPath = String(request.params.arguments?.docPath);
      const fullPath = path.join(docsDir, docPath);
      const content = await fs.readFile(fullPath, "utf-8");

      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `以下のMarkdownドキュメントを簡潔に要約してください:\n\n${content}`,
            },
          },
        ],
      };
    }

    throw new Error(`Unknown prompt: ${request.params.name}`);
  });

  return server;
}
```

---

## まとめ

カスタムMCPサーバーの作成により、Claude Codeを自社のワークフローやシステムに完全に統合できます。

### 重要なポイント

1. **明確な目的**: カスタムサーバーが本当に必要か検討
2. **型安全性**: TypeScript + Zodで堅牢な実装
3. **セキュリティ**: 認証、バリデーション、レート制限を実装
4. **パフォーマンス**: キャッシング、並行処理、ストリーミングを活用
5. **テスト**: ユニットテストと統合テストで品質保証
6. **ドキュメント**: 使い方を明確に記述

### 次のステップ

- [MCP公式ドキュメント](https://modelcontextprotocol.io)を参照
- [MCP SDK](https://github.com/anthropics/mcp)で最新情報を確認
- 既存のMCPサーバーを研究してベストプラクティスを学ぶ
- コミュニティと共有して改善を続ける

---

#上級者 #MCP #開発 #TypeScript #カスタマイズ #統合 #セキュリティ #パフォーマンス
