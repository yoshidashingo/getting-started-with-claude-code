# Hooks実践ガイド

Hooksは、Claude Codeのワークフローに自動化を組み込むための強力な仕組みです。このドキュメントでは、実践的なHook実装例、開発ワークフローへの統合方法、高度なテクニック、そしてベストプラクティスを解説します。

## 開発ワークフローへの統合

### 基本的な統合パターン

Hooksを開発ワークフローに統合する際は、以下の3つのフェーズで段階的に導入することを推奨します：

#### フェーズ1: コード品質の自動化
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "command": "npx prettier --write \"$file_path\"",
        "description": "自動フォーマット適用"
      }
    ]
  }
}
```

#### フェーズ2: バリデーションの追加
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "command": "npx prettier --write \"$file_path\"",
        "description": "自動フォーマット適用"
      },
      {
        "matcher": "Write|Edit",
        "filter": "\\.ts$|\\.tsx$",
        "command": "npx tsc --noEmit \"$file_path\"",
        "description": "TypeScript型チェック"
      }
    ]
  }
}
```

#### フェーズ3: 高度な自動化
```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write|Edit",
        "filter": "\\.env$",
        "command": "/path/to/check-secrets.sh \"$file_path\"",
        "description": "機密情報チェック"
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "command": "npx prettier --write \"$file_path\"",
        "description": "自動フォーマット適用"
      },
      {
        "matcher": "Write|Edit",
        "filter": "\\.ts$|\\.tsx$",
        "command": "npx tsc --noEmit \"$file_path\"",
        "description": "TypeScript型チェック"
      },
      {
        "matcher": "Write|Edit",
        "filter": "\\.test\\.(ts|tsx|js|jsx)$",
        "command": "npm test -- \"$file_path\"",
        "description": "テスト自動実行"
      }
    ],
    "UserPromptSubmit": [
      {
        "command": "/path/to/log-command.sh \"$prompt\"",
        "description": "コマンドロギング"
      }
    ]
  }
}
```

### ワークフロー最適化の考え方

**1. 高頻度タスクを優先的に自動化**

開発中に頻繁に行う作業から自動化します：
- コードフォーマット（毎回実行）
- 型チェック（TypeScriptファイル編集時）
- リンティング（保存時）

**2. 段階的な導入**

一度にすべてのHooksを有効化せず、チームが慣れてから追加します：
```bash
# 週1: フォーマッターのみ
# 週2: 型チェック追加
# 週3: リンティング追加
# 週4: テスト自動実行追加
```

**3. パフォーマンスを考慮**

重い処理は必要な時のみ実行します：
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "filter": "package\\.json$",
        "command": "npm install",
        "description": "依存関係自動インストール"
      }
    ]
  }
}
```

## 実践的なHook実装例

### 1. Bashコマンドロガー

すべてのBashコマンドを記録し、監査証跡を作成します。

**用途:**
- チーム開発での作業履歴管理
- デバッグ時のコマンド追跡
- セキュリティ監査

**実装:**

```bash
#!/bin/bash
# /path/to/hooks/log-bash-command.sh

LOG_FILE="$HOME/.claude/bash-commands.log"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# ログディレクトリ作成
mkdir -p "$(dirname "$LOG_FILE")"

# コマンドをログに記録
echo "[$TIMESTAMP] $1" >> "$LOG_FILE"

# ディスク容量チェック（ログファイルが10MBを超えたらローテーション）
LOG_SIZE=$(stat -f%z "$LOG_FILE" 2>/dev/null || stat -c%s "$LOG_FILE" 2>/dev/null || echo 0)
if [ "$LOG_SIZE" -gt 10485760 ]; then
    mv "$LOG_FILE" "$LOG_FILE.old"
    echo "Log rotated at $TIMESTAMP" > "$LOG_FILE"
fi

exit 0
```

**設定:**

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "command": "/path/to/hooks/log-bash-command.sh \"$command\"",
        "description": "Bashコマンドロギング"
      }
    ]
  }
}
```

**使用例:**

```bash
# Claude Codeで実行:
# > git status

# ログファイルに記録される:
# [2024-01-20 10:30:15] git status
```

### 2. TypeScript自動フォーマッター

TypeScriptファイルの保存時に自動でPrettierとESLintを実行します。

**用途:**
- コードスタイルの統一
- 品質の維持
- レビュー時間の削減

**実装:**

```bash
#!/bin/bash
# /path/to/hooks/format-typescript.sh

FILE_PATH="$1"

# TypeScript/TSXファイルかチェック
if [[ ! "$FILE_PATH" =~ \.(ts|tsx)$ ]]; then
    exit 0
fi

# ファイルが存在するかチェック
if [ ! -f "$FILE_PATH" ]; then
    echo "Error: File not found: $FILE_PATH"
    exit 2
fi

# プロジェクトディレクトリを検出
PROJECT_DIR=$(dirname "$FILE_PATH")
while [ "$PROJECT_DIR" != "/" ]; do
    if [ -f "$PROJECT_DIR/package.json" ]; then
        break
    fi
    PROJECT_DIR=$(dirname "$PROJECT_DIR")
done

cd "$PROJECT_DIR" || exit 2

# Prettierでフォーマット
if command -v npx &> /dev/null; then
    npx prettier --write "$FILE_PATH" 2>&1
    PRETTIER_EXIT=$?

    if [ $PRETTIER_EXIT -ne 0 ]; then
        echo "Warning: Prettier failed with exit code $PRETTIER_EXIT"
        exit 2
    fi

    # ESLintで自動修正
    npx eslint --fix "$FILE_PATH" 2>&1
    ESLINT_EXIT=$?

    if [ $ESLINT_EXIT -ne 0 ]; then
        echo "Warning: ESLint found issues (exit code $ESLINT_EXIT)"
        # ESLintエラーは警告として処理（終了コード0）
        exit 0
    fi

    echo "✓ Formatted and linted: $FILE_PATH"
fi

exit 0
```

**設定:**

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "filter": "\\.(ts|tsx)$",
        "command": "/path/to/hooks/format-typescript.sh \"$file_path\"",
        "description": "TypeScript自動フォーマット"
      }
    ]
  }
}
```

### 3. デスクトップ通知

長時間実行されるコマンドの完了を通知します。

**用途:**
- ビルドやテストの完了通知
- エラー発生の即座の通知
- マルチタスク中の効率向上

**実装:**

```bash
#!/bin/bash
# /path/to/hooks/desktop-notify.sh

TOOL_NAME="$1"
STATUS="$2"
DURATION="$3"

# macOSの場合
if command -v osascript &> /dev/null; then
    if [ "$STATUS" = "success" ]; then
        osascript -e "display notification \"$TOOL_NAME completed in ${DURATION}s\" with title \"Claude Code\" sound name \"Glass\""
    else
        osascript -e "display notification \"$TOOL_NAME failed after ${DURATION}s\" with title \"Claude Code\" sound name \"Basso\""
    fi
fi

# Linuxの場合
if command -v notify-send &> /dev/null; then
    if [ "$STATUS" = "success" ]; then
        notify-send "Claude Code" "$TOOL_NAME completed in ${DURATION}s" -i dialog-information
    else
        notify-send "Claude Code" "$TOOL_NAME failed after ${DURATION}s" -i dialog-error
    fi
fi

exit 0
```

**設定:**

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Bash",
        "command": "/path/to/hooks/desktop-notify.sh \"Bash Command\" \"success\" \"$duration\"",
        "description": "コマンド完了通知"
      }
    ]
  }
}
```

### 4. ファイル保護（機密情報チェック）

環境変数ファイルや機密情報の編集時に警告を表示します。

**用途:**
- 機密情報の誤コミット防止
- セキュリティポリシーの強制
- コンプライアンス対応

**実装:**

```bash
#!/bin/bash
# /path/to/hooks/check-secrets.sh

FILE_PATH="$1"

# 機密情報パターンのチェック
PATTERNS=(
    'password\s*=\s*["\047][^"\047]{3,}'
    'api[_-]?key\s*=\s*["\047][^"\047]{10,}'
    'secret\s*=\s*["\047][^"\047]{10,}'
    'token\s*=\s*["\047][^"\047]{10,}'
    'private[_-]?key\s*=\s*["\047][^"\047]{10,}'
    '[A-Za-z0-9+/]{40,}={0,2}'  # Base64エンコードされた可能性のある文字列
    'ghp_[A-Za-z0-9]{36}'  # GitHub Personal Access Token
    'sk_live_[A-Za-z0-9]{24,}'  # Stripe API Key
)

FOUND_SECRETS=false

for PATTERN in "${PATTERNS[@]}"; do
    if grep -qiE "$PATTERN" "$FILE_PATH"; then
        echo "⚠️  Warning: Potential secret detected in $FILE_PATH"
        echo "   Pattern matched: $PATTERN"
        FOUND_SECRETS=true
    fi
done

if [ "$FOUND_SECRETS" = true ]; then
    # JSON応答で警告を返す
    cat <<EOF
{
  "action": "warn",
  "message": "⚠️  機密情報が検出されました。環境変数の使用を検討してください。\n\n例:\npassword = \"\${DB_PASSWORD}\"\napi_key = \"\${API_KEY}\"",
  "continueExecution": true
}
EOF
    exit 0
fi

exit 0
```

**設定:**

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write|Edit",
        "filter": "\\.(env.*|config\\.json|credentials\\.json)$",
        "command": "/path/to/hooks/check-secrets.sh \"$file_path\"",
        "description": "機密情報チェック"
      }
    ]
  }
}
```

### 5. テスト自動実行

テストファイルの変更時に自動でテストを実行します。

**用途:**
- TDD（Test-Driven Development）のサポート
- リグレッションの早期発見
- CI/CD前の事前チェック

**実装:**

```bash
#!/bin/bash
# /path/to/hooks/auto-test.sh

FILE_PATH="$1"
START_TIME=$(date +%s)

# テストファイルかチェック
if [[ ! "$FILE_PATH" =~ \.(test|spec)\.(ts|tsx|js|jsx)$ ]]; then
    exit 0
fi

# プロジェクトルートを検出
PROJECT_DIR=$(dirname "$FILE_PATH")
while [ "$PROJECT_DIR" != "/" ]; do
    if [ -f "$PROJECT_DIR/package.json" ]; then
        break
    fi
    PROJECT_DIR=$(dirname "$PROJECT_DIR")
done

cd "$PROJECT_DIR" || exit 2

# テストフレームワークの検出と実行
if [ -f "package.json" ]; then
    # Jest/Vitest
    if grep -q "\"jest\"" package.json || grep -q "\"vitest\"" package.json; then
        echo "Running tests for $FILE_PATH..."
        npm test -- "$FILE_PATH" --passWithNoTests
        TEST_EXIT=$?

        END_TIME=$(date +%s)
        DURATION=$((END_TIME - START_TIME))

        if [ $TEST_EXIT -eq 0 ]; then
            echo "✓ All tests passed in ${DURATION}s"
            exit 0
        else
            echo "✗ Tests failed (exit code $TEST_EXIT)"

            # JSON応答でClaudeに通知
            cat <<EOF
{
  "action": "error",
  "message": "テストが失敗しました。修正が必要です。",
  "continueExecution": false
}
EOF
            exit 2
        fi
    fi
fi

exit 0
```

**設定:**

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "filter": "\\.(test|spec)\\.(ts|tsx|js|jsx)$",
        "command": "/path/to/hooks/auto-test.sh \"$file_path\"",
        "description": "テスト自動実行"
      }
    ]
  }
}
```

### 6. コミットメッセージバリデーション

Conventional Commitsに準拠したコミットメッセージを強制します。

**用途:**
- コミットメッセージの標準化
- 変更履歴の可読性向上
- 自動化ツール（semantic-release等）との連携

**実装:**

```bash
#!/bin/bash
# /path/to/hooks/validate-commit-message.sh

PROMPT="$1"

# コミット関連のプロンプトかチェック
if [[ ! "$PROMPT" =~ (commit|コミット) ]]; then
    exit 0
fi

# Conventional Commitsパターン
# 形式: <type>(<scope>): <subject>
PATTERN='^(feat|fix|docs|style|refactor|perf|test|chore|build|ci|revert)(\(.+\))?: .{1,100}$'

# プロンプトから潜在的なコミットメッセージを抽出（簡易版）
COMMIT_MSG=$(echo "$PROMPT" | grep -oE '"[^"]+"' | head -1 | tr -d '"')

if [ -n "$COMMIT_MSG" ]; then
    if [[ ! "$COMMIT_MSG" =~ $PATTERN ]]; then
        cat <<EOF
{
  "action": "warn",
  "message": "⚠️  コミットメッセージがConventional Commits形式ではありません。\n\n推奨形式:\nfeat(scope): 新機能の追加\nfix(scope): バグ修正\ndocs(scope): ドキュメント更新\n\n例:\nfeat(auth): ユーザーログイン機能を追加\nfix(api): レスポンスタイムアウトの問題を修正",
  "continueExecution": true
}
EOF
    fi
fi

exit 0
```

**設定:**

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "command": "/path/to/hooks/validate-commit-message.sh \"$prompt\"",
        "description": "コミットメッセージバリデーション"
      }
    ]
  }
}
```

### 7. セキュリティスキャン

コードの脆弱性を自動スキャンします。

**用途:**
- セキュリティ脆弱性の早期発見
- 依存関係の監査
- コンプライアンス対応

**実装:**

```bash
#!/bin/bash
# /path/to/hooks/security-scan.sh

FILE_PATH="$1"

# プロジェクトルートを検出
PROJECT_DIR=$(dirname "$FILE_PATH")
while [ "$PROJECT_DIR" != "/" ]; do
    if [ -f "$PROJECT_DIR/package.json" ]; then
        break
    fi
    PROJECT_DIR=$(dirname "$PROJECT_DIR")
done

cd "$PROJECT_DIR" || exit 2

# package.jsonの変更時のみ実行
if [[ "$FILE_PATH" =~ package\.json$ ]]; then
    echo "Running security audit..."

    # npm audit
    AUDIT_OUTPUT=$(npm audit --json 2>&1)
    VULNERABILITIES=$(echo "$AUDIT_OUTPUT" | jq -r '.metadata.vulnerabilities | to_entries[] | select(.value > 0) | "\(.key): \(.value)"' 2>/dev/null)

    if [ -n "$VULNERABILITIES" ]; then
        cat <<EOF
{
  "action": "warn",
  "message": "⚠️  セキュリティ脆弱性が検出されました:\n\n$VULNERABILITIES\n\n対応:\nnpm audit fix\n\n詳細:\nnpm audit",
  "continueExecution": true
}
EOF
        exit 0
    fi

    echo "✓ No security vulnerabilities found"
fi

exit 0
```

**設定:**

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "filter": "package\\.json$",
        "command": "/path/to/hooks/security-scan.sh \"$file_path\"",
        "description": "セキュリティスキャン"
      }
    ]
  }
}
```

### 8. パフォーマンスモニタリング

コマンド実行時間を計測し、パフォーマンス問題を検出します。

**用途:**
- パフォーマンスボトルネックの特定
- ビルド時間の監視
- 開発体験の改善

**実装:**

```bash
#!/bin/bash
# /path/to/hooks/performance-monitor.sh

TOOL_NAME="$1"
COMMAND="$2"
THRESHOLD=10  # 10秒以上かかったら警告

# 実行時間の取得（PostToolUseで利用可能な場合）
START_TIME=$(date +%s)

# 実際のコマンドは既に実行済みなので、ログに記録するのみ
LOG_FILE="$HOME/.claude/performance.log"
mkdir -p "$(dirname "$LOG_FILE")"

# 前回の実行時間と比較（存在する場合）
LAST_DURATION=$(grep "^$TOOL_NAME|" "$LOG_FILE" | tail -1 | cut -d'|' -f2)

# 現在の実行時間を記録（実際のシナリオでは$durationパラメータを使用）
CURRENT_TIME=$(date '+%Y-%m-%d %H:%M:%S')
echo "$TOOL_NAME|0|$CURRENT_TIME" >> "$LOG_FILE"

# 過去30日分のみ保持
if [ -f "$LOG_FILE" ]; then
    THIRTY_DAYS_AGO=$(date -d '30 days ago' '+%Y-%m-%d' 2>/dev/null || date -v-30d '+%Y-%m-%d' 2>/dev/null)
    grep -v "^.*|.*|$THIRTY_DAYS_AGO" "$LOG_FILE" > "$LOG_FILE.tmp"
    mv "$LOG_FILE.tmp" "$LOG_FILE"
fi

exit 0
```

**設定:**

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Bash",
        "command": "/path/to/hooks/performance-monitor.sh \"$tool_name\" \"$command\"",
        "description": "パフォーマンスモニタリング"
      }
    ]
  }
}
```

### 9. ドキュメント自動生成

コードの変更時にドキュメントを自動生成します。

**用途:**
- APIドキュメントの自動更新
- コードとドキュメントの同期
- ドキュメンテーション負荷の軽減

**実装:**

```bash
#!/bin/bash
# /path/to/hooks/auto-generate-docs.sh

FILE_PATH="$1"

# TypeScriptファイルの変更時のみ実行
if [[ ! "$FILE_PATH" =~ \.(ts|tsx)$ ]]; then
    exit 0
fi

# srcディレクトリ内のファイルのみ対象
if [[ ! "$FILE_PATH" =~ /src/ ]]; then
    exit 0
fi

# プロジェクトルートを検出
PROJECT_DIR=$(dirname "$FILE_PATH")
while [ "$PROJECT_DIR" != "/" ]; do
    if [ -f "$PROJECT_DIR/package.json" ]; then
        break
    fi
    PROJECT_DIR=$(dirname "$PROJECT_DIR")
done

cd "$PROJECT_DIR" || exit 2

# TypeDocがインストールされているかチェック
if [ -f "package.json" ] && grep -q "\"typedoc\"" package.json; then
    echo "Generating documentation..."

    # TypeDocを実行（エラーは無視）
    npx typedoc --out docs/api src --exclude "**/*.test.ts" 2>&1 | grep -v "Warning"

    if [ ${PIPESTATUS[0]} -eq 0 ]; then
        echo "✓ Documentation generated successfully"
    else
        echo "Note: Documentation generation completed with warnings"
    fi
fi

exit 0
```

**設定:**

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "filter": "src/.*\\.(ts|tsx)$",
        "command": "/path/to/hooks/auto-generate-docs.sh \"$file_path\"",
        "description": "ドキュメント自動生成"
      }
    ]
  }
}
```

### 10. カスタムバリデーション

プロジェクト固有のコーディング規約をチェックします。

**用途:**
- チーム独自のコーディング規約の強制
- アンチパターンの検出
- コードレビュー時間の削減

**実装:**

```bash
#!/bin/bash
# /path/to/hooks/custom-validation.sh

FILE_PATH="$1"

# TypeScript/JSXファイルのみ対象
if [[ ! "$FILE_PATH" =~ \.(ts|tsx|js|jsx)$ ]]; then
    exit 0
fi

ISSUES=()

# 規約1: console.logの使用禁止（開発環境を除く）
if grep -q "console\.log" "$FILE_PATH"; then
    if [[ ! "$FILE_PATH" =~ \.dev\.(ts|js)$ ]]; then
        ISSUES+=("console.logの使用が検出されました。loggerを使用してください。")
    fi
fi

# 規約2: TODO/FIXMEコメントのチェック
TODO_COUNT=$(grep -c "// TODO\|// FIXME" "$FILE_PATH" 2>/dev/null || echo 0)
if [ "$TODO_COUNT" -gt 0 ]; then
    ISSUES+=("$TODO_COUNT 個のTODO/FIXMEコメントがあります。対応を検討してください。")
fi

# 規約3: コンポーネント名の命名規則（PascalCase）
BASENAME=$(basename "$FILE_PATH")
if [[ "$FILE_PATH" =~ components/ ]] && [[ "$BASENAME" =~ ^[a-z] ]]; then
    ISSUES+=("コンポーネントファイル名はPascalCaseにしてください: $BASENAME")
fi

# 規約4: ファイルサイズチェック（500行以上で警告）
LINE_COUNT=$(wc -l < "$FILE_PATH")
if [ "$LINE_COUNT" -gt 500 ]; then
    ISSUES+=("ファイルが大きすぎます（${LINE_COUNT}行）。分割を検討してください。")
fi

# 問題が見つかった場合
if [ ${#ISSUES[@]} -gt 0 ]; then
    MESSAGE="⚠️  コーディング規約チェック:\n\n"
    for ISSUE in "${ISSUES[@]}"; do
        MESSAGE+="• $ISSUE\n"
    done

    cat <<EOF
{
  "action": "warn",
  "message": "$MESSAGE",
  "continueExecution": true
}
EOF
fi

exit 0
```

**設定:**

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "filter": "\\.(ts|tsx|js|jsx)$",
        "command": "/path/to/hooks/custom-validation.sh \"$file_path\"",
        "description": "カスタムバリデーション"
      }
    ]
  }
}
```

### 11. Git統合チェック

Git操作前にステータスを確認し、問題を検出します。

**用途:**
- マージコンフリクトの事前検出
- コミット前のチェック
- ブランチ保護

**実装:**

```bash
#!/bin/bash
# /path/to/hooks/git-pre-check.sh

COMMAND="$1"

# Git関連のコマンドかチェック
if [[ ! "$COMMAND" =~ git\ (commit|push|merge) ]]; then
    exit 0
fi

# Gitリポジトリかチェック
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    exit 0
fi

# 現在のブランチを取得
CURRENT_BRANCH=$(git branch --show-current)

# mainブランチへの直接コミット/プッシュを警告
if [[ "$COMMAND" =~ (commit|push) ]] && [[ "$CURRENT_BRANCH" =~ ^(main|master)$ ]]; then
    cat <<EOF
{
  "action": "warn",
  "message": "⚠️  メインブランチへの直接コミット/プッシュは推奨されません。\n\nフィーチャーブランチを作成してください:\ngit checkout -b feature/your-feature",
  "continueExecution": true
}
EOF
    exit 0
fi

# Unstaged changesがある場合の警告
if [[ "$COMMAND" =~ commit ]] && [ -n "$(git diff --name-only)" ]; then
    cat <<EOF
{
  "action": "warn",
  "message": "⚠️  Unstaged changesがあります。すべての変更をステージングしてください:\ngit add .",
  "continueExecution": true
}
EOF
    exit 0
fi

# リモートとの同期チェック
if [[ "$COMMAND" =~ push ]]; then
    git fetch origin "$CURRENT_BRANCH" 2>/dev/null
    BEHIND=$(git rev-list --count HEAD..origin/"$CURRENT_BRANCH" 2>/dev/null || echo 0)

    if [ "$BEHIND" -gt 0 ]; then
        cat <<EOF
{
  "action": "error",
  "message": "リモートブランチが$BEHIND コミット先に進んでいます。\n\nまずpullしてください:\ngit pull origin $CURRENT_BRANCH",
  "continueExecution": false
}
EOF
        exit 2
    fi
fi

exit 0
```

**設定:**

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "filter": "git (commit|push|merge)",
        "command": "/path/to/hooks/git-pre-check.sh \"$command\"",
        "description": "Git操作前チェック"
      }
    ]
  }
}
```

### 12. 依存関係自動インストール

package.jsonの変更時に自動でnpm installを実行します。

**用途:**
- 依存関係の自動同期
- 手動インストールの忘れ防止
- チーム開発での一貫性確保

**実装:**

```bash
#!/bin/bash
# /path/to/hooks/auto-install-deps.sh

FILE_PATH="$1"

# package.jsonの変更時のみ実行
if [[ ! "$FILE_PATH" =~ package\.json$ ]]; then
    exit 0
fi

# プロジェクトルートに移動
PROJECT_DIR=$(dirname "$FILE_PATH")
cd "$PROJECT_DIR" || exit 2

echo "Installing dependencies..."

# npm installを実行
npm install 2>&1

if [ $? -eq 0 ]; then
    echo "✓ Dependencies installed successfully"
    exit 0
else
    cat <<EOF
{
  "action": "error",
  "message": "依存関係のインストールに失敗しました。\n\nログを確認してください。",
  "continueExecution": false
}
EOF
    exit 2
fi
```

**設定:**

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "filter": "package\\.json$",
        "command": "/path/to/hooks/auto-install-deps.sh \"$file_path\"",
        "description": "依存関係自動インストール"
      }
    ]
  }
}
```

## 複雑なHookパターン

### 複数条件のマッチング

複雑な条件でHooksをトリガーする方法です。

#### パターン1: OR条件（複数パターンのいずれか）

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "filter": "\\.(ts|tsx|js|jsx|css|scss)$",
        "command": "/path/to/hooks/format-all.sh \"$file_path\"",
        "description": "すべてのフロントエンドファイルをフォーマット"
      }
    ]
  }
}
```

#### パターン2: AND条件（シェルスクリプトで実装）

```bash
#!/bin/bash
# /path/to/hooks/complex-matcher.sh

FILE_PATH="$1"

# 条件1: srcディレクトリ内
if [[ ! "$FILE_PATH" =~ /src/ ]]; then
    exit 0
fi

# 条件2: TypeScriptファイル
if [[ ! "$FILE_PATH" =~ \.(ts|tsx)$ ]]; then
    exit 0
fi

# 条件3: テストファイルではない
if [[ "$FILE_PATH" =~ \.(test|spec)\.(ts|tsx)$ ]]; then
    exit 0
fi

# すべての条件を満たす場合のみ実行
echo "Processing: $FILE_PATH"
# 処理を実行...

exit 0
```

#### パターン3: NOT条件（除外パターン）

```bash
#!/bin/bash
# /path/to/hooks/exclude-patterns.sh

FILE_PATH="$1"

# 除外パターン
EXCLUDE_PATTERNS=(
    "node_modules/"
    "dist/"
    "build/"
    ".git/"
    "*.min.js"
    "*.bundle.js"
)

for PATTERN in "${EXCLUDE_PATTERNS[@]}"; do
    if [[ "$FILE_PATH" =~ $PATTERN ]]; then
        echo "Skipped (excluded): $FILE_PATH"
        exit 0
    fi
done

# 除外されなかった場合のみ処理
echo "Processing: $FILE_PATH"
# 処理を実行...

exit 0
```

### JSON応答での高度な制御

Hooksは標準出力にJSONを返すことで、Claude Codeの動作を制御できます。

#### 1. 警告メッセージの表示

```bash
#!/bin/bash

cat <<EOF
{
  "action": "warn",
  "message": "⚠️  警告: このファイルは重要なシステムファイルです。\n\n変更する前にバックアップを取ることを推奨します。",
  "continueExecution": true
}
EOF

exit 0
```

#### 2. エラーと実行中断

```bash
#!/bin/bash

cat <<EOF
{
  "action": "error",
  "message": "エラー: テストが失敗しました。\n\n修正してから再度実行してください。",
  "continueExecution": false
}
EOF

exit 2
```

#### 3. 複数のメッセージ

```bash
#!/bin/bash

ISSUES_FOUND=0
MESSAGES=()

# チェック1
if grep -q "console.log" "$1"; then
    MESSAGES+=("console.logが見つかりました")
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
fi

# チェック2
if grep -q "debugger" "$1"; then
    MESSAGES+=("debugger文が見つかりました")
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
fi

if [ $ISSUES_FOUND -gt 0 ]; then
    MESSAGE="⚠️  ${ISSUES_FOUND}件の問題が見つかりました:\n\n"
    for MSG in "${MESSAGES[@]}"; do
        MESSAGE+="• $MSG\n"
    done

    cat <<EOF
{
  "action": "warn",
  "message": "$MESSAGE",
  "continueExecution": true
}
EOF
fi

exit 0
```

#### 4. 動的メッセージ生成

```bash
#!/bin/bash

FILE_PATH="$1"
LINE_COUNT=$(wc -l < "$FILE_PATH")
FILE_SIZE=$(stat -f%z "$FILE_PATH" 2>/dev/null || stat -c%s "$FILE_PATH")

# ファイル情報を含むメッセージ
cat <<EOF
{
  "action": "info",
  "message": "ファイル情報:\n• 行数: ${LINE_COUNT}\n• サイズ: ${FILE_SIZE} bytes\n• パス: ${FILE_PATH}",
  "continueExecution": true
}
EOF

exit 0
```

### エラーハンドリング

Hooksでのエラーハンドリングのベストプラクティスです。

#### パターン1: Graceful Degradation（段階的縮退）

```bash
#!/bin/bash
# /path/to/hooks/graceful-error.sh

FILE_PATH="$1"

# 必須ツールのチェック
if ! command -v prettier &> /dev/null; then
    echo "Warning: prettier not found, skipping formatting"
    exit 0  # エラーではなく正常終了
fi

# 処理実行
prettier --write "$FILE_PATH" 2>&1

if [ $? -ne 0 ]; then
    echo "Warning: Formatting failed, but continuing"
    exit 0  # 警告として処理
fi

exit 0
```

#### パターン2: Fail Fast（即座の失敗）

```bash
#!/bin/bash
# /path/to/hooks/fail-fast.sh

set -e  # エラー時に即座に終了
set -o pipefail  # パイプラインのエラーも検出

FILE_PATH="$1"

# 必須ツールのチェック
if ! command -v eslint &> /dev/null; then
    cat <<EOF
{
  "action": "error",
  "message": "ESLintがインストールされていません。\n\nインストール:\nnpm install -g eslint",
  "continueExecution": false
}
EOF
    exit 2
fi

# 処理実行（エラー時は自動的に終了）
eslint --fix "$FILE_PATH"

exit 0
```

#### パターン3: Retry Logic（リトライロジック）

```bash
#!/bin/bash
# /path/to/hooks/retry-logic.sh

FILE_PATH="$1"
MAX_RETRIES=3
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    # ネットワーク依存の処理を実行
    if npm audit fix --dry-run 2>&1; then
        echo "✓ Audit check successful"
        exit 0
    fi

    RETRY_COUNT=$((RETRY_COUNT + 1))
    if [ $RETRY_COUNT -lt $MAX_RETRIES ]; then
        echo "Retrying... ($RETRY_COUNT/$MAX_RETRIES)"
        sleep 2
    fi
done

# 最大リトライ回数に達した
cat <<EOF
{
  "action": "error",
  "message": "${MAX_RETRIES}回のリトライ後も処理に失敗しました。\n\nネットワーク接続を確認してください。",
  "continueExecution": false
}
EOF

exit 2
```

#### パターン4: Timeout処理

```bash
#!/bin/bash
# /path/to/hooks/timeout-handler.sh

FILE_PATH="$1"
TIMEOUT=30  # 30秒

# タイムアウト付きで処理を実行
timeout $TIMEOUT npm test -- "$FILE_PATH" 2>&1

EXIT_CODE=$?

if [ $EXIT_CODE -eq 124 ]; then
    # タイムアウト発生
    cat <<EOF
{
  "action": "error",
  "message": "テストが${TIMEOUT}秒でタイムアウトしました。\n\nテストを最適化するか、タイムアウト時間を延長してください。",
  "continueExecution": false
}
EOF
    exit 2
elif [ $EXIT_CODE -ne 0 ]; then
    # その他のエラー
    cat <<EOF
{
  "action": "error",
  "message": "テストが失敗しました（終了コード: $EXIT_CODE）",
  "continueExecution": false
}
EOF
    exit 2
fi

exit 0
```

## MCPツールとの連携

HooksはMCPサーバーと連携して、より強力な機能を提供できます。

### 例1: GitHubへの自動通知

コミット時にGitHub issue/PRにコメントを追加します。

```bash
#!/bin/bash
# /path/to/hooks/github-notify.sh

COMMIT_MESSAGE="$1"

# コミットメッセージからissue番号を抽出
ISSUE_NUMBER=$(echo "$COMMIT_MESSAGE" | grep -oE '#[0-9]+' | head -1 | tr -d '#')

if [ -n "$ISSUE_NUMBER" ]; then
    # Claude CodeのMCP統合を使用してGitHubにコメント
    # （実際の実装ではClaude APIを呼び出す）
    echo "Would notify GitHub issue #$ISSUE_NUMBER about commit"
fi

exit 0
```

### 例2: Sentryへのエラー報告

ビルドエラーを自動的にSentryに報告します。

```bash
#!/bin/bash
# /path/to/hooks/sentry-report.sh

BUILD_OUTPUT="$1"
EXIT_CODE="$2"

if [ "$EXIT_CODE" -ne 0 ]; then
    # エラー情報を抽出
    ERROR_MESSAGE=$(echo "$BUILD_OUTPUT" | grep -i "error" | head -5)

    # Sentry MCPサーバー経由でエラーを報告
    # （実際の実装ではClaude APIまたはSentry APIを呼び出す）
    echo "Would report build error to Sentry: $ERROR_MESSAGE"
fi

exit 0
```

### 例3: データベーススキーマ検証

データベーススキーマファイルの変更時に自動検証します。

```bash
#!/bin/bash
# /path/to/hooks/db-schema-validate.sh

FILE_PATH="$1"

# マイグレーションファイルかチェック
if [[ ! "$FILE_PATH" =~ migrations/ ]]; then
    exit 0
fi

# PostgreSQL MCPサーバー経由でスキーマを検証
# （実際の実装ではClaude APIまたはデータベース接続を使用）
echo "Validating database schema changes..."

exit 0
```

## CI/CD統合

HooksをCI/CDパイプラインと統合する方法です。

### 環境変数での制御

```bash
#!/bin/bash
# /path/to/hooks/ci-aware-hook.sh

FILE_PATH="$1"

# CI環境での動作を変更
if [ "$CI" = "true" ]; then
    # CI環境では厳格にチェック
    npm run lint -- "$FILE_PATH" --max-warnings 0

    if [ $? -ne 0 ]; then
        cat <<EOF
{
  "action": "error",
  "message": "CI環境でのリントエラー。警告も許可されません。",
  "continueExecution": false
}
EOF
        exit 2
    fi
else
    # ローカル環境では警告のみ
    npm run lint -- "$FILE_PATH"

    if [ $? -ne 0 ]; then
        echo "⚠️  リント警告がありますが、処理を続行します"
    fi
fi

exit 0
```

### CI/CDパイプライン設定例

#### GitHub Actions

```yaml
# .github/workflows/claude-hooks.yml
name: Claude Hooks Validation

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  validate:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Run Hook scripts
        run: |
          # Hooksスクリプトを手動実行
          chmod +x .claude/hooks/*.sh

          # すべてのTypeScriptファイルをチェック
          find src -name "*.ts" -o -name "*.tsx" | while read file; do
            .claude/hooks/format-typescript.sh "$file"
            .claude/hooks/custom-validation.sh "$file"
          done

      - name: Run tests
        run: npm test
```

#### GitLab CI

```yaml
# .gitlab-ci.yml
validate-hooks:
  stage: test
  image: node:18

  before_script:
    - npm install
    - chmod +x .claude/hooks/*.sh

  script:
    - |
      # すべての変更されたファイルをチェック
      git diff --name-only $CI_COMMIT_BEFORE_SHA $CI_COMMIT_SHA | while read file; do
        if [[ "$file" =~ \.(ts|tsx)$ ]]; then
          .claude/hooks/format-typescript.sh "$file"
          .claude/hooks/custom-validation.sh "$file"
        fi
      done
    - npm test

  only:
    - merge_requests
    - main
```

## チームでの標準化

Hooksをチーム全体で標準化する方法です。

### プロジェクトテンプレート

```
project-root/
├── .claude/
│   ├── hooks/
│   │   ├── 01-format.sh          # フォーマッター
│   │   ├── 02-lint.sh            # リンター
│   │   ├── 03-test.sh            # テスト
│   │   ├── 04-security.sh        # セキュリティチェック
│   │   └── README.md             # Hooks説明書
│   └── settings.json             # Hooks設定
├── .github/
│   └── workflows/
│       └── validate-hooks.yml    # CI統合
└── docs/
    └── development/
        └── hooks-guide.md        # チーム向けガイド
```

### チーム設定ファイル

```json
// .claude/settings.json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write|Edit",
        "filter": "\\.(env.*|credentials\\.json)$",
        "command": "./.claude/hooks/04-security.sh \"$file_path\"",
        "description": "[必須] 機密情報チェック"
      },
      {
        "matcher": "Bash",
        "filter": "git (push|commit)",
        "command": "./.claude/hooks/git-pre-check.sh \"$command\"",
        "description": "[必須] Git操作前チェック"
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "filter": "\\.(ts|tsx|js|jsx)$",
        "command": "./.claude/hooks/01-format.sh \"$file_path\"",
        "description": "[必須] 自動フォーマット"
      },
      {
        "matcher": "Write|Edit",
        "filter": "\\.(ts|tsx)$",
        "command": "./.claude/hooks/02-lint.sh \"$file_path\"",
        "description": "[必須] リントチェック"
      },
      {
        "matcher": "Write|Edit",
        "filter": "\\.(test|spec)\\.(ts|tsx|js|jsx)$",
        "command": "./.claude/hooks/03-test.sh \"$file_path\"",
        "description": "[推奨] テスト自動実行"
      }
    ]
  }
}
```

### チーム向けドキュメント

```markdown
<!-- docs/development/hooks-guide.md -->

# 開発者向けHooksガイド

## セットアップ

1. Hooksスクリプトに実行権限を付与:
   ```bash
   chmod +x .claude/hooks/*.sh
   ```

2. 依存ツールをインストール:
   ```bash
   npm install -g prettier eslint
   ```

## 必須Hooks

以下のHooksは必須です。無効化しないでください：

- **機密情報チェック**: 環境変数ファイルの編集時
- **Git操作前チェック**: コミット/プッシュ前
- **自動フォーマット**: すべてのコード変更時
- **リントチェック**: TypeScriptファイル変更時

## 推奨Hooks

以下のHooksは推奨です。状況に応じて有効/無効を切り替えられます：

- **テスト自動実行**: テストファイル編集時
- **ドキュメント生成**: APIコード変更時

## トラブルシューティング

### Hookが実行されない

```bash
# Hooks設定を確認
cat .claude/settings.json

# スクリプトの実行権限を確認
ls -la .claude/hooks/

# 手動でHookを実行してテスト
./.claude/hooks/01-format.sh "path/to/file.ts"
```

### Hookがエラーになる

```bash
# エラーメッセージを確認
./.claude/hooks/02-lint.sh "path/to/file.ts" 2>&1

# 依存ツールをチェック
which prettier
which eslint
```
```

## パフォーマンス最適化

Hooksのパフォーマンスを最適化する方法です。

### 1. 並列実行

複数の独立したチェックを並列で実行します。

```bash
#!/bin/bash
# /path/to/hooks/parallel-checks.sh

FILE_PATH="$1"

# バックグラウンドで複数のチェックを実行
(
    npx prettier --check "$FILE_PATH"
) &
PID1=$!

(
    npx eslint "$FILE_PATH"
) &
PID2=$!

(
    npx tsc --noEmit "$FILE_PATH"
) &
PID3=$!

# すべてのプロセスを待機
wait $PID1
PRETTIER_EXIT=$?

wait $PID2
ESLINT_EXIT=$?

wait $PID3
TSC_EXIT=$?

# いずれかが失敗したらエラー
if [ $PRETTIER_EXIT -ne 0 ] || [ $ESLINT_EXIT -ne 0 ] || [ $TSC_EXIT -ne 0 ]; then
    exit 2
fi

exit 0
```

### 2. キャッシング

処理結果をキャッシュして再実行を避けます。

```bash
#!/bin/bash
# /path/to/hooks/cached-lint.sh

FILE_PATH="$1"
CACHE_DIR="$HOME/.claude/cache"
HASH=$(md5sum "$FILE_PATH" | cut -d' ' -f1)
CACHE_FILE="$CACHE_DIR/$HASH"

mkdir -p "$CACHE_DIR"

# キャッシュが存在し、ファイルが変更されていない場合
if [ -f "$CACHE_FILE" ]; then
    CACHED_HASH=$(cat "$CACHE_FILE")
    if [ "$CACHED_HASH" = "$HASH" ]; then
        echo "✓ Using cached lint result"
        exit 0
    fi
fi

# リント実行
npx eslint "$FILE_PATH"

if [ $? -eq 0 ]; then
    # 成功した場合、キャッシュに保存
    echo "$HASH" > "$CACHE_FILE"
    exit 0
else
    exit 2
fi
```

### 3. 条件付き実行

変更された部分のみチェックします。

```bash
#!/bin/bash
# /path/to/hooks/incremental-check.sh

FILE_PATH="$1"

# Gitで追跡されているファイルのみチェック
if ! git ls-files --error-unmatch "$FILE_PATH" &> /dev/null; then
    echo "Skipping untracked file: $FILE_PATH"
    exit 0
fi

# 変更された行のみチェック
CHANGED_LINES=$(git diff --unified=0 "$FILE_PATH" | grep "^+" | grep -v "^+++" | wc -l)

if [ "$CHANGED_LINES" -eq 0 ]; then
    echo "No changes detected, skipping"
    exit 0
fi

# 変更がある場合のみ実行
npx eslint "$FILE_PATH"
exit $?
```

### 4. タイムアウト設定

長時間実行されるHooksにタイムアウトを設定します。

```bash
#!/bin/bash
# /path/to/hooks/timeout-wrapper.sh

FILE_PATH="$1"
TIMEOUT=10  # 10秒

# タイムアウト付きで実行
timeout $TIMEOUT npx eslint "$FILE_PATH" 2>&1

EXIT_CODE=$?

if [ $EXIT_CODE -eq 124 ]; then
    echo "⚠️  Timeout: Skipping slow check"
    exit 0  # タイムアウトは警告として処理
fi

exit $EXIT_CODE
```

### 5. 選択的実行

ファイルタイプや環境に応じて実行内容を変更します。

```bash
#!/bin/bash
# /path/to/hooks/selective-execution.sh

FILE_PATH="$1"

# 小さいファイルは完全チェック
FILE_SIZE=$(stat -f%z "$FILE_PATH" 2>/dev/null || stat -c%s "$FILE_PATH")

if [ "$FILE_SIZE" -lt 10000 ]; then
    # 10KB未満: 完全チェック
    npx eslint "$FILE_PATH"
elif [ "$FILE_SIZE" -lt 100000 ]; then
    # 100KB未満: 基本チェックのみ
    npx eslint --rule 'no-console:error' --rule 'no-debugger:error' "$FILE_PATH"
else
    # 100KB以上: スキップ
    echo "File too large, skipping detailed checks"
    exit 0
fi

exit $?
```

## デバッグテクニック

Hooksのデバッグに役立つテクニックです。

### 1. 詳細ログ出力

```bash
#!/bin/bash
# /path/to/hooks/debug-logging.sh

# デバッグモードを有効化
DEBUG="${CLAUDE_HOOK_DEBUG:-false}"

debug_log() {
    if [ "$DEBUG" = "true" ]; then
        echo "[DEBUG] $1" >&2
    fi
}

FILE_PATH="$1"

debug_log "Starting hook execution"
debug_log "File path: $FILE_PATH"
debug_log "Current directory: $(pwd)"
debug_log "Environment: CI=${CI:-false}"

# 処理実行
npx prettier --write "$FILE_PATH" 2>&1

EXIT_CODE=$?
debug_log "Exit code: $EXIT_CODE"

exit $EXIT_CODE
```

**使用方法:**
```bash
# デバッグモードで実行
export CLAUDE_HOOK_DEBUG=true
claude
```

### 2. トレース実行

```bash
#!/bin/bash
# /path/to/hooks/trace-execution.sh

# トレースを有効化
set -x

FILE_PATH="$1"

# 各コマンドが詳細に表示される
npx prettier --write "$FILE_PATH"
npx eslint --fix "$FILE_PATH"

set +x

exit 0
```

### 3. エラー情報の収集

```bash
#!/bin/bash
# /path/to/hooks/error-collector.sh

FILE_PATH="$1"
ERROR_LOG="$HOME/.claude/hook-errors.log"

# エラー情報を記録
exec 2> >(tee -a "$ERROR_LOG")

echo "=== Hook Execution: $(date) ==="
echo "File: $FILE_PATH"
echo "CWD: $(pwd)"

# 処理実行
npx eslint "$FILE_PATH"

EXIT_CODE=$?

if [ $EXIT_CODE -ne 0 ]; then
    echo "Exit code: $EXIT_CODE"
    echo "========================="
fi

exit $EXIT_CODE
```

### 4. インタラクティブデバッグ

```bash
#!/bin/bash
# /path/to/hooks/interactive-debug.sh

FILE_PATH="$1"

# インタラクティブモードかチェック
if [ "$CLAUDE_HOOK_INTERACTIVE" = "true" ]; then
    echo "File to process: $FILE_PATH"
    echo "Press Enter to continue, or Ctrl+C to abort..."
    read -r
fi

# 処理実行
npx prettier --write "$FILE_PATH"

exit $?
```

## トラブルシューティング

### 問題1: Hookが実行されない

**症状:**
Hookが設定されているのに実行されない。

**解決方法:**

1. **設定を確認**
   ```bash
   # settings.jsonの内容を確認
   cat ~/.config/claude/settings.json
   # または
   cat .claude/settings.json
   ```

2. **matcherパターンを確認**
   ```json
   {
     "hooks": {
       "PostToolUse": [
         {
           "matcher": "Write|Edit",  // 大文字小文字を確認
           "command": "..."
         }
       ]
     }
   }
   ```

3. **filterパターンを確認**
   ```json
   {
     "filter": "\\.(ts|tsx)$"  // エスケープを確認
   }
   ```

4. **スクリプトの実行権限を確認**
   ```bash
   chmod +x /path/to/hook-script.sh
   ls -la /path/to/hook-script.sh
   ```

### 問題2: Hookがエラーで失敗する

**症状:**
Hookが実行されるがエラーで終了する。

**解決方法:**

1. **手動でスクリプトを実行**
   ```bash
   # エラーメッセージを確認
   /path/to/hook-script.sh "/path/to/test-file.ts"
   echo $?  # 終了コードを確認
   ```

2. **依存ツールを確認**
   ```bash
   which prettier
   which eslint
   which tsc

   # バージョンも確認
   prettier --version
   eslint --version
   ```

3. **環境変数を確認**
   ```bash
   env | grep -i claude
   echo $PATH
   ```

4. **デバッグモードで実行**
   ```bash
   bash -x /path/to/hook-script.sh "/path/to/test-file.ts"
   ```

### 問題3: パフォーマンスが遅い

**症状:**
Hooksの実行に時間がかかりすぎる。

**解決方法:**

1. **実行時間を計測**
   ```bash
   time /path/to/hook-script.sh "/path/to/test-file.ts"
   ```

2. **並列実行を検討**
   ```bash
   # 複数のチェックを並列化
   # 前述の「並列実行」パターンを参照
   ```

3. **キャッシュを活用**
   ```bash
   # 前述の「キャッシング」パターンを参照
   ```

4. **条件付き実行に変更**
   ```bash
   # 大きなファイルはスキップ
   if [ $(stat -f%z "$FILE_PATH") -gt 100000 ]; then
       exit 0
   fi
   ```

### 問題4: JSON応答が認識されない

**症状:**
JSON応答を返してもClaude Codeが認識しない。

**解決方法:**

1. **JSON形式を検証**
   ```bash
   # スクリプトの出力をjqで検証
   /path/to/hook-script.sh "test.ts" | jq .
   ```

2. **正しいフォーマットを使用**
   ```bash
   cat <<EOF
   {
     "action": "warn",
     "message": "警告メッセージ",
     "continueExecution": true
   }
   EOF
   ```

3. **エスケープを確認**
   ```bash
   # 改行はnで表現
   "message": "行1\n行2\n行3"
   ```

4. **標準出力を確認**
   ```bash
   # エラーメッセージが標準エラーに出力されていないか確認
   /path/to/hook-script.sh "test.ts" 2>&1
   ```

### 問題5: 環境変数が展開されない

**症状:**
`$file_path`などの変数が展開されない。

**解決方法:**

1. **変数名を確認**
   ```json
   {
     "command": "script.sh \"$file_path\""  // ✅ 正しい
   }
   ```
   ```json
   {
     "command": "script.sh \"$FILE_PATH\""  // ❌ 間違い（大文字）
   }
   ```

2. **利用可能な変数を確認**
   ```
   PreToolUse / PostToolUse:
   - $tool_name (ツール名)
   - $file_path (Write/Editの場合)
   - $command (Bashの場合)
   - $duration (PostToolUseのみ)

   UserPromptSubmit:
   - $prompt (ユーザーのプロンプト)
   ```

3. **クォートを確認**
   ```json
   {
     "command": "script.sh \"$file_path\""  // ✅ ダブルクォート
   }
   ```
   ```json
   {
     "command": "script.sh '$file_path'"  // ❌ シングルクォート（展開されない）
   }
   ```

### 問題6: CI環境で動作しない

**症状:**
ローカルでは動作するが、CI環境で失敗する。

**解決方法:**

1. **環境変数で動作を分岐**
   ```bash
   if [ "$CI" = "true" ]; then
       # CI用の処理
   else
       # ローカル用の処理
   fi
   ```

2. **絶対パスを使用**
   ```bash
   # ❌ 相対パス
   ./node_modules/.bin/prettier

   # ✅ 絶対パスまたはPATH経由
   npx prettier
   ```

3. **依存関係を明示的にインストール**
   ```yaml
   # .github/workflows/ci.yml
   - name: Install Hook Dependencies
     run: |
       npm install -g prettier eslint typescript
   ```

## ベストプラクティス

### 1. セキュリティ

#### 機密情報を扱わない

```bash
#!/bin/bash

# ❌ 機密情報をログに出力
echo "API Key: $API_KEY"

# ✅ 機密情報をマスク
echo "API Key: ${API_KEY:0:4}****"
```

#### スクリプトの検証

```bash
# ❌ 未検証のスクリプトを実行
eval "$USER_INPUT"

# ✅ 入力を検証
if [[ "$FILE_PATH" =~ ^[a-zA-Z0-9/_.-]+$ ]]; then
    process_file "$FILE_PATH"
fi
```

#### 権限の最小化

```bash
# ファイルは読み取り専用で開く
if [ -r "$FILE_PATH" ] && [ ! -w "$FILE_PATH" ]; then
    cat "$FILE_PATH" | process_data
fi
```

### 2. 可読性とメンテナンス性

#### 明確な命名

```bash
# ❌ 曖昧な名前
script.sh

# ✅ 目的が明確
auto-format-typescript.sh
```

#### コメントの追加

```bash
#!/bin/bash
# Purpose: TypeScriptファイルを自動フォーマット
# Author: Development Team
# Last Modified: 2024-01-20
# Dependencies: prettier, eslint
# Exit codes:
#   0 - Success
#   2 - Error (stops Claude execution)

FILE_PATH="$1"

# ... implementation
```

#### 関数による構造化

```bash
#!/bin/bash

check_dependencies() {
    for cmd in prettier eslint; do
        if ! command -v $cmd &> /dev/null; then
            echo "Error: $cmd not found"
            return 1
        fi
    done
    return 0
}

format_file() {
    local file="$1"
    prettier --write "$file"
    eslint --fix "$file"
}

main() {
    if ! check_dependencies; then
        exit 2
    fi

    format_file "$1"
}

main "$@"
```

### 3. エラーハンドリング

#### 明確なエラーメッセージ

```bash
# ❌ 不明瞭なエラー
echo "Error"
exit 2

# ✅ 詳細なエラーメッセージ
cat <<EOF
{
  "action": "error",
  "message": "Prettierが見つかりません。\n\nインストール方法:\nnpm install -g prettier",
  "continueExecution": false
}
EOF
exit 2
```

#### 適切な終了コード

```bash
# 0: 正常終了（処理続行）
exit 0

# 2: エラー（処理中断）
exit 2

# その他のコードは使用しない
```

### 4. パフォーマンス

#### 早期リターン

```bash
# ✅ 不要な処理をスキップ
if [[ ! "$FILE_PATH" =~ \.(ts|tsx)$ ]]; then
    exit 0
fi

# 処理を実行
```

#### リソース管理

```bash
# 一時ファイルのクリーンアップ
TEMP_FILE=$(mktemp)
trap "rm -f $TEMP_FILE" EXIT

# 処理...
```

### 5. テスタビリティ

#### ユニットテスト可能な構造

```bash
#!/bin/bash

# テスト可能な関数
validate_file_extension() {
    local file="$1"
    [[ "$file" =~ \.(ts|tsx)$ ]]
}

# メイン処理
if [ "${BASH_SOURCE[0]}" = "${0}" ]; then
    # スクリプトとして実行された場合
    FILE_PATH="$1"
    if validate_file_extension "$FILE_PATH"; then
        # 処理...
    fi
fi
```

#### テストスクリプト

```bash
#!/bin/bash
# test-hooks.sh

TEST_DIR=$(mktemp -d)
trap "rm -rf $TEST_DIR" EXIT

# テスト1: TypeScriptファイル
echo "console.log('test')" > "$TEST_DIR/test.ts"
./format-typescript.sh "$TEST_DIR/test.ts"
if [ $? -eq 0 ]; then
    echo "✓ Test 1 passed"
else
    echo "✗ Test 1 failed"
    exit 1
fi

# テスト2: 非TypeScriptファイル
echo "test" > "$TEST_DIR/test.txt"
./format-typescript.sh "$TEST_DIR/test.txt"
if [ $? -eq 0 ]; then
    echo "✓ Test 2 passed"
else
    echo "✗ Test 2 failed"
    exit 1
fi

echo "All tests passed!"
```

## まとめ

Hooksは、Claude Codeのワークフローを自動化・最適化するための強力な機能です。

**重要なポイント:**

1. **段階的な導入** - 基本的な自動化から始め、徐々に高度な機能を追加
2. **パフォーマンス最適化** - キャッシング、並列実行、条件付き実行を活用
3. **エラーハンドリング** - 明確なエラーメッセージとJSON応答で適切に制御
4. **セキュリティ** - 機密情報の保護、入力検証を徹底
5. **チーム標準化** - 設定を共有し、ドキュメント化する

**次のステップ:**

- **[Hooks基礎](06-hooks-basics.md)** - Hooksの基本概念を学ぶ
- **[Subagents活用](08-subagents.md)** - 専門化されたエージェントとの連携
- **[MCP統合](02-mcp-servers.md)** - 外部サービスとの連携

---

**関連ドキュメント:**
- [単体テスト](../06-development-process/06-unit-testing.md) - テスト自動化との連携
- [ビルド自動化](../06-development-process/09-build-automation.md) - CI/CDとの統合
- [設定ファイル](../12-configuration.md) - 詳細な設定方法
- [トラブルシューティング](../09-troubleshooting.md) - 一般的な問題解決

**外部リソース:**
- [Bash スクリプティングガイド](https://www.gnu.org/software/bash/manual/) - シェルスクリプトリファレンス
- [jq マニュアル](https://stedolan.github.io/jq/manual/) - JSON処理ツール
- [Conventional Commits](https://www.conventionalcommits.org/) - コミットメッセージ規約

**タグ:** `#中級者` `#Hooks` `#実践` `#自動化` `#ワークフロー` `#開発効率` `#品質管理` `#CI/CD`
