# 設定ファイル詳細

Claude Codeの動作を細かくカスタマイズするための設定ファイルと環境変数について説明します。

## 設定ファイルの階層

Claude Codeは以下の優先順位で設定を読み込みます：

1. **コマンドライン引数** (最優先)
2. **プロジェクト設定** (`.claude/config.json`)
3. **ユーザー設定** (`~/.claude/config.json`)
4. **グローバル設定** (`/etc/claude/config.json`)
5. **デフォルト設定**

## グローバル設定

### 場所

- **macOS/Linux**: `~/.claude/config.json`
- **Windows**: `%APPDATA%\claude\config.json`

### 基本構成

```json
{
  "version": "1.0",
  "api": {
    "endpoint": "https://api.anthropic.com",
    "timeout": 30000,
    "maxRetries": 3
  },
  "ui": {
    "theme": "auto",
    "language": "ja",
    "editor": "default"
  },
  "performance": {
    "maxTokens": 100000,
    "cacheEnabled": true,
    "cacheTTL": 3600
  },
  "privacy": {
    "telemetry": false,
    "crashReports": false,
    "usageAnalytics": false
  }
}
```

## プロジェクト設定

### `.claude/config.json`

プロジェクトルートに配置：

```json
{
  "project": {
    "name": "My Project",
    "type": "web-app",
    "language": "typescript",
    "framework": "react"
  },
  "memory": {
    "autoLoad": true,
    "searchPaths": [".", "..", "../shared"],
    "importDepth": 5
  },
  "tools": {
    "enabled": [
      "file-edit",
      "code-generation",
      "test-generation",
      "documentation"
    ],
    "disabled": [
      "deployment",
      "database-access"
    ]
  },
  "context": {
    "include": [
      "src/**/*",
      "tests/**/*",
      "docs/**/*.md"
    ],
    "exclude": [
      "node_modules/**",
      "dist/**",
      "*.log",
      ".env*"
    ],
    "maxFileSize": "1MB",
    "maxFiles": 100
  }
}
```

### `.claude/hooks.json`

カスタムフックの設定：

```json
{
  "hooks": {
    "preCommand": [
      {
        "pattern": "file-edit",
        "script": "./scripts/pre-edit-check.sh"
      }
    ],
    "postCommand": [
      {
        "pattern": "code-generation",
        "script": "./scripts/format-code.sh"
      }
    ],
    "onError": [
      {
        "script": "./scripts/error-handler.sh",
        "continueOnFailure": true
      }
    ]
  }
}
```

## 環境変数

### 認証関連

```bash
# APIキー
export ANTHROPIC_API_KEY="sk-ant-..."

# カスタムエンドポイント
export CLAUDE_API_ENDPOINT="https://custom.api.endpoint"

# プロキシ設定
export HTTPS_PROXY="http://proxy.company.com:8080"
export NO_PROXY="localhost,127.0.0.1"
```

### パフォーマンス設定

```bash
# 最大トークン数
export CLAUDE_MAX_TOKENS="150000"

# タイムアウト（ミリ秒）
export CLAUDE_TIMEOUT="60000"

# 並列処理数
export CLAUDE_CONCURRENCY="4"

# キャッシュディレクトリ
export CLAUDE_CACHE_DIR="/path/to/cache"
```

### デバッグ設定

```bash
# デバッグモード
export CLAUDE_DEBUG="true"

# ログレベル
export CLAUDE_LOG_LEVEL="debug"

# ログファイル
export CLAUDE_LOG_FILE="/path/to/claude.log"

# プロファイリング
export CLAUDE_PROFILE="true"
```

## 詳細設定オプション

### API設定

```json
{
  "api": {
    "endpoint": "https://api.anthropic.com",
    "version": "v1",
    "timeout": 30000,
    "maxRetries": 3,
    "retryDelay": 1000,
    "headers": {
      "X-Custom-Header": "value"
    },
    "rateLimit": {
      "requests": 100,
      "window": 60000
    }
  }
}
```

### セッション設定

```json
{
  "session": {
    "autoSave": true,
    "saveInterval": 300,
    "maxHistory": 1000,
    "compressHistory": true,
    "resumeOnStart": true,
    "shareAcrossProjects": false
  }
}
```

### メモリ設定

```json
{
  "memory": {
    "maxSize": "10MB",
    "compression": true,
    "autoCompact": true,
    "compactThreshold": 0.8,
    "hierarchy": {
      "enterprise": "/org/claude/memory",
      "project": "./CLAUDE.md",
      "user": "~/.claude/memory.md"
    }
  }
}
```

### セキュリティ設定

```json
{
  "security": {
    "maskSecrets": true,
    "secretPatterns": [
      "api[_-]?key",
      "password",
      "token",
      "secret"
    ],
    "allowedDomains": [
      "github.com",
      "gitlab.com"
    ],
    "fileAccessControl": {
      "readOnly": [
        "/etc/**",
        "/usr/**"
      ],
      "noAccess": [
        "*.key",
        "*.pem",
        ".env*"
      ]
    }
  }
}
```

### UI/UX設定

```json
{
  "ui": {
    "theme": "dark",
    "fontSize": 14,
    "fontFamily": "Monaco, monospace",
    "colors": {
      "primary": "#00529B",
      "secondary": "#FFD700",
      "background": "#1E1E1E",
      "text": "#D4D4D4"
    },
    "shortcuts": {
      "newChat": "Ctrl+N",
      "clearChat": "Ctrl+L",
      "search": "Ctrl+F"
    },
    "notifications": {
      "sound": false,
      "desktop": true,
      "types": ["error", "warning"]
    }
  }
}
```

### 実験的機能

```json
{
  "experimental": {
    "features": {
      "advancedContext": true,
      "multiModal": false,
      "codeExecution": false,
      "webBrowsing": true
    },
    "models": {
      "default": "claude-3-opus",
      "fallback": "claude-3-sonnet"
    }
  }
}
```

## 設定の検証

### 設定ファイルの検証

```bash
# 設定ファイルの検証
claude config validate

# 特定の設定ファイルを検証
claude config validate --file .claude/config.json

# スキーマを表示
claude config schema
```

### 現在の設定を確認

```bash
# すべての設定を表示
claude config show

# 特定の設定を表示
claude config get api.endpoint

# 有効な設定のソースを表示
claude config show --with-source
```

## 設定のマイグレーション

### バージョンアップ時

```bash
# 設定ファイルのマイグレーション
claude config migrate

# ドライラン
claude config migrate --dry-run

# バックアップを作成
claude config backup
```

### 設定のエクスポート/インポート

```bash
# エクスポート
claude config export > my-config.json

# インポート
claude config import < my-config.json

# マージ
claude config merge team-config.json
```

## トラブルシューティング

### 設定が反映されない

1. **優先順位を確認**
```bash
claude config show --debug
```

2. **キャッシュをクリア**
```bash
claude cache clear
rm -rf ~/.claude/cache
```

3. **設定をリセット**
```bash
claude config reset
```

### パフォーマンスの問題

```json
{
  "performance": {
    "streaming": true,
    "compression": true,
    "minifyRequests": true,
    "batchRequests": true,
    "connectionPool": {
      "size": 10,
      "ttl": 60000
    }
  }
}
```

### プロキシ設定

```json
{
  "network": {
    "proxy": {
      "http": "http://proxy:8080",
      "https": "https://proxy:8443",
      "noProxy": ["localhost", "127.0.0.1", "*.internal.com"]
    },
    "ssl": {
      "rejectUnauthorized": true,
      "ca": "/path/to/ca.pem"
    }
  }
}
```

## ベストプラクティス

### 1. チーム設定の共有

```bash
# チーム設定をGitで管理
.claude/
├── config.json       # バージョン管理する
├── config.local.json # .gitignoreに追加
└── hooks/           # 共有スクリプト
```

### 2. 環境別設定

```bash
# 開発環境
export CLAUDE_ENV=development
export CLAUDE_CONFIG=.claude/config.dev.json

# 本番環境
export CLAUDE_ENV=production
export CLAUDE_CONFIG=.claude/config.prod.json
```

### 3. セキュアな設定管理

```bash
# 機密情報は環境変数で
export ANTHROPIC_API_KEY=$(vault read -field=key secret/claude)

# または専用ファイル
chmod 600 ~/.claude/secrets.json
```

## 高度な設定例

### エンタープライズ設定

```json
{
  "enterprise": {
    "sso": {
      "enabled": true,
      "provider": "okta",
      "endpoint": "https://company.okta.com"
    },
    "compliance": {
      "dataRetention": 90,
      "auditLog": true,
      "encryption": "aes-256"
    },
    "policy": {
      "maxTokensPerUser": 1000000,
      "allowedModels": ["claude-3-opus"],
      "restrictedFeatures": ["web-browsing"]
    }
  }
}
```

### カスタム統合

```json
{
  "integrations": {
    "github": {
      "enabled": true,
      "token": "${GITHUB_TOKEN}",
      "webhooks": true
    },
    "slack": {
      "enabled": true,
      "webhook": "${SLACK_WEBHOOK}"
    },
    "custom": [
      {
        "name": "internal-tool",
        "endpoint": "https://tools.company.com",
        "auth": "bearer"
      }
    ]
  }
}
```

---

**ナビゲーション:**
- ⬅️ 前へ: [IDE統合](11-ide-integration.md) - エディタとの連携
- ➡️ 次へ: [目次](TABLE_OF_CONTENTS.md) - 完全な目次と学習パス

**関連ドキュメント:**
- [メモリ管理機能](02-features/memory-management.md) - メモリ関連の設定
- [セッション管理](02-features/session-management.md) - セッション関連の設定
- [IDE統合ガイド](11-ide-integration.md) - IDE固有の設定