# Hooks（フック）基礎

Hooks（フック）は、Claude Codeのライフサイクルの特定のポイントで自動的に実行されるカスタマイズ可能なスクリプトです。言語モデルに依存せず、決定論的な制御を提供することで、確実に特定のアクションを実行できます。

## Hooksとは

### 基本概念

Hooksは、Claude Codeの動作を特定のイベント発生時に自動的に制御するメカニズムです。以下の図は、Hooksの基本的な実行フローを示しています：

```
┌──────────────┐
│ユーザー      │
│ プロンプト   │
└──────┬───────┘
       │
       ▼
┌──────────────────────┐
│UserPromptSubmit Hook │ ◄─── プロンプト送信前
└──────┬───────────────┘
       │
       ▼
┌──────────────┐
│ Claude Code  │
│  処理開始    │
└──────┬───────┘
       │
       ▼
┌──────────────────────┐
│  PreToolUse Hook     │ ◄─── ツール実行前
└──────┬───────────────┘
       │
       ▼
┌──────────────┐
│ツール実行    │ (例: ファイル編集)
└──────┬───────┘
       │
       ▼
┌──────────────────────┐
│ PostToolUse Hook     │ ◄─── ツール実行後
└──────┬───────────────┘
       │
       ▼
┌──────────────┐
│   応答完了   │
└──────┬───────┘
       │
       ▼
┌──────────────────────┐
│    Stop Hook         │ ◄─── 応答完了時
└──────────────────────┘
```

**主な特徴:**

- **自動実行**: 特定のイベント発生時に自動的にトリガー
- **決定論的制御**: LLMの判断に依存せず、確実に実行
- **柔軟な設定**: Bashコマンドまたはプロンプトベースの評価
- **強力な制御**: ツール実行の許可/拒否、入力パラメータの変更が可能

### Hooksでできること

Hooksを活用すると、以下のような強力な自動化と制御が可能です：

#### 1. コード品質の自動チェック
```
PostToolUse Hook (Edit/Write) → Linter実行 → 問題検出時にClaudeへフィードバック
```

#### 2. セキュリティ制御
```
PreToolUse Hook (Write) → .envファイルへの書き込み検出 → ブロック
```

#### 3. 自動フォーマット
```
PostToolUse Hook (Edit) → prettier/gofmt実行 → コードスタイル統一
```

#### 4. コマンド実行ログ
```
PreToolUse Hook (Bash) → コマンド記録 → 監査証跡の作成
```

#### 5. カスタム通知
```
Notification Hook → Slack/Discord通知 → チームへの即座の連絡
```

#### 6. コンテキスト注入
```
UserPromptSubmit Hook → プロジェクト固有情報追加 → Claudeの理解向上
```

## Hooksの種類とイベント

Claude Codeは10種類のHookイベントをサポートしています。それぞれ異なる目的とタイミングで実行されます。

### ツール関連Hooks

これらのHooksは、Claude Codeがツール（Bash、Write、Edit等）を使用する際にトリガーされます。

#### 1. PreToolUse

**実行タイミング:** Claude がツールパラメータを生成した後、実際に処理する前

**目的:**
- ツール実行の許可/拒否を制御
- 入力パラメータの検証・変更
- セキュリティチェックの実施

**対応ツール（マッチャー）:**
- `Bash` - シェルコマンド実行
- `Write` - ファイル書き込み
- `Edit` - ファイル編集
- `Read` - ファイル読み込み
- `Glob` - ファイル検索
- `Grep` - コンテンツ検索
- `NotebookEdit` - Jupyter Notebook編集
- その他、すべてのツール

**入力パラメータ:**
```json
{
  "session_id": "セッションID",
  "transcript_path": "会話履歴のパス",
  "cwd": "現在の作業ディレクトリ",
  "permission_mode": "default|plan|acceptEdits|bypassPermissions",
  "hook_event_name": "PreToolUse",
  "tool_name": "Bash",
  "tool_input": {
    "command": "npm test"
  },
  "tool_use_id": "ツール使用ID"
}
```

**制御オプション（JSON応答）:**
```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "allow",
    "permissionDecisionReason": "安全なコマンドのため許可",
    "updatedInput": {
      "command": "npm test --silent"
    }
  }
}
```

**permissionDecisionの値:**
- `allow` - ツール実行を許可（権限システムをバイパス）
- `deny` - ツール実行を拒否
- `ask` - ユーザーに確認を求める（デフォルト動作）

#### 2. PermissionRequest

**実行タイミング:** 権限確認ダイアログがユーザーに表示されるとき

**目的:**
- 権限リクエストの自動承認/拒否
- カスタムロジックによる権限制御
- 入力パラメータの変更

**マッチャー:** PreToolUseと同じツール名を使用

**入力パラメータ:** PreToolUseと同様

**制御オプション（JSON応答）:**
```json
{
  "hookSpecificOutput": {
    "hookEventName": "PermissionRequest",
    "decision": {
      "behavior": "allow",
      "updatedInput": {
        "file_path": "/modified/path.txt"
      },
      "message": "自動承認: テストファイルのため",
      "interrupt": false
    }
  }
}
```

**decision.behaviorの値:**
- `allow` - 権限リクエストを自動承認
- `deny` - 権限リクエストを拒否

**interrupt:** `true`の場合、ユーザーに確認を求める

#### 3. PostToolUse

**実行タイミング:** ツール実行が成功した直後

**目的:**
- 実行結果の検証
- 自動フォーマットの適用
- ログ記録
- Claudeへのフィードバック提供

**マッチャー:** PreToolUseと同じツール名を使用

**入力パラメータ:**
```json
{
  "session_id": "セッションID",
  "transcript_path": "会話履歴のパス",
  "cwd": "現在の作業ディレクトリ",
  "permission_mode": "default",
  "hook_event_name": "PostToolUse",
  "tool_name": "Edit",
  "tool_input": {
    "file_path": "/path/to/file.js",
    "old_string": "const x = 1",
    "new_string": "const x = 2"
  },
  "tool_response": "編集成功メッセージ",
  "tool_use_id": "ツール使用ID"
}
```

**制御オプション（JSON応答）:**
```json
{
  "decision": "block",
  "reason": "Linterエラーが検出されました",
  "hookSpecificOutput": {
    "hookEventName": "PostToolUse",
    "additionalContext": "line 42: 'x' is assigned a value but never used"
  }
}
```

⚠️ **重要:** PostToolUseはツール実行後に動作するため、`decision: "block"`を設定しても実行自体は巻き戻せません。Claudeに問題を伝えて修正を促すことができます。

### セッション関連Hooks

セッションのライフサイクルイベントでトリガーされます。

#### 4. UserPromptSubmit

**実行タイミング:** ユーザーがプロンプトを送信した直後、Claudeが処理する前

**目的:**
- プロンプトの検証
- コンテキスト情報の注入
- 不適切な内容のブロック
- セキュリティフィルタリング

**マッチャー:** 使用しない（すべてのプロンプトに適用）

**入力パラメータ:**
```json
{
  "session_id": "セッションID",
  "transcript_path": "会話履歴のパス",
  "cwd": "現在の作業ディレクトリ",
  "permission_mode": "default",
  "hook_event_name": "UserPromptSubmit",
  "prompt": "ユーザーが入力したプロンプト"
}
```

**制御オプション（JSON応答）:**
```json
{
  "decision": "block",
  "reason": "機密情報が含まれているため送信をブロックしました",
  "hookSpecificOutput": {
    "hookEventName": "UserPromptSubmit",
    "additionalContext": "プロンプトに認証トークンが含まれています"
  }
}
```

**特別な動作:**
- 標準出力（stdout）はClaudeのコンテキストに追加される
- 終了コード2でプロンプトをブロックすると、入力が消去される

#### 5. Stop

**実行タイミング:** メインエージェントが応答を完了したとき

**目的:**
- 応答品質のチェック
- 自動テスト実行
- ビルド検証
- エンド・オブ・ターン品質ゲート

**マッチャー:** 使用しない

**入力パラメータ:**
```json
{
  "session_id": "セッションID",
  "transcript_path": "会話履歴のパス",
  "cwd": "現在の作業ディレクトリ",
  "permission_mode": "default",
  "hook_event_name": "Stop",
  "stop_hook_active": true
}
```

**制御オプション（JSON応答）:**
```json
{
  "decision": "block",
  "reason": "テストが失敗しました。修正が必要です。",
  "systemMessage": "以下のテストケースが失敗:\n- UserService.test.js\n- AuthService.test.js"
}
```

**特別な動作:**
- `decision: "block"`を設定すると、Claudeが停止せず継続して問題解決を試みる
- 品質ゲートの実装に最適

#### 6. SubagentStop

**実行タイミング:** サブエージェントが応答を完了したとき

**目的:**
- サブエージェントの応答品質チェック
- マルチエージェントワークフローの制御

**マッチャー:** 使用しない

**入力パラメータ:** Stopと同様

**制御オプション:** Stopと同様

#### 7. SessionStart

**実行タイミング:** Claude Codeセッションの開始時または再開時

**目的:**
- 環境のセットアップ
- 依存関係のチェック
- プロジェクト固有の初期化
- 環境変数の永続化

**マッチャー（source）:**
- `startup` - 新しいセッション開始時
- `resume` - 既存セッション再開時
- `clear` - セッションクリア後
- `compact` - コンテキスト圧縮後

**入力パラメータ:**
```json
{
  "session_id": "セッションID",
  "transcript_path": "会話履歴のパス",
  "cwd": "現在の作業ディレクトリ",
  "permission_mode": "default",
  "hook_event_name": "SessionStart",
  "source": "startup"
}
```

**特別な環境変数:**
- `CLAUDE_ENV_FILE` - 環境変数を永続化するためのファイルパス（SessionStartのみで利用可能）

**特別な動作:**
- 標準出力（stdout）はClaudeのコンテキストに追加される
- セッション全体で使用する環境変数の設定に最適

#### 8. SessionEnd

**実行タイミング:** Claude Codeセッションの終了時

**目的:**
- クリーンアップ処理
- セッション統計の記録
- リソース解放

**マッチャー:** 使用しない

**入力パラメータ:**
```json
{
  "session_id": "セッションID",
  "transcript_path": "会話履歴のパス",
  "cwd": "現在の作業ディレクトリ",
  "permission_mode": "default",
  "hook_event_name": "SessionEnd",
  "reason": "clear"
}
```

**reasonの値:**
- `clear` - セッションクリア
- `logout` - ログアウト
- `prompt_input_exit` - プロンプト入力で終了
- `other` - その他の理由

### その他のHooks

#### 9. PreCompact

**実行タイミング:** コンテキスト圧縮（compaction）の前

**目的:**
- 圧縮前の状態保存
- カスタム圧縮指示の追加

**マッチャー（trigger）:**
- `manual` - 手動トリガー
- `auto` - 自動トリガー

**入力パラメータ:**
```json
{
  "session_id": "セッションID",
  "transcript_path": "会話履歴のパス",
  "cwd": "現在の作業ディレクトリ",
  "permission_mode": "default",
  "hook_event_name": "PreCompact",
  "trigger": "auto",
  "custom_instructions": "カスタム圧縮指示"
}
```

#### 10. Notification

**実行タイミング:** Claude Codeが通知を送信するとき

**目的:**
- カスタム通知システムとの統合
- Slack、Discord等への通知転送

**マッチャー（notification_type）:**
- `permission_prompt` - 権限確認待ち
- `idle_prompt` - アイドル状態（入力待ち）
- `auth_success` - 認証成功

**入力パラメータ:**
```json
{
  "session_id": "セッションID",
  "transcript_path": "会話履歴のパス",
  "cwd": "現在の作業ディレクトリ",
  "permission_mode": "default",
  "hook_event_name": "Notification",
  "notification_type": "permission_prompt",
  "message": "通知メッセージ"
}
```

## 設定ファイルの場所と構造

Hooksは3つの異なるスコープで設定できます。

### 1. ユーザーレベル設定

**保存場所:** `~/.claude/settings.json`

**特徴:**
- すべてのプロジェクトで有効
- 個人的な設定に最適
- グローバルツールやワークフロー

**設定例:**
```json
{
  "hooks": {
    "Notification": [
      {
        "matcher": "permission_prompt",
        "hooks": [
          {
            "type": "command",
            "command": "osascript -e 'display notification \"Claude が入力を待っています\" with title \"Claude Code\"'"
          }
        ]
      }
    ]
  }
}
```

### 2. プロジェクトレベル設定【推奨】

**保存場所:** `<プロジェクトルート>/.claude/settings.json`

**特徴:**
- プロジェクト固有の設定
- チーム全体で共有可能
- Gitにコミット推奨

**設定例:**
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "npm run lint",
            "timeout": 30
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "npm test",
            "timeout": 120
          }
        ]
      }
    ]
  }
}
```

### 3. ローカル設定

**保存場所:** `<プロジェクトルート>/.claude/settings.local.json`

**特徴:**
- ローカル環境専用
- Gitにコミットしない（`.gitignore`に追加）
- 個人的な実験や開発環境固有の設定

**.gitignoreへの追加:**
```
# Claude Code ローカル設定
.claude/settings.local.json
```

### 設定の優先順位

複数の設定ファイルが存在する場合、以下の優先順位が適用されます：

```
Local (.claude/settings.local.json)
  ↓
Project (.claude/settings.json)
  ↓
User (~/.claude/settings.json)
```

### 基本的な設定構造

```json
{
  "hooks": {
    "<EventName>": [
      {
        "matcher": "<MatcherPattern>",
        "hooks": [
          {
            "type": "command|prompt",
            "command": "<BashCommand>",
            "timeout": 60
          }
        ]
      }
    ]
  }
}
```

**フィールド説明:**
- `EventName` - イベント名（PreToolUse、PostToolUse等）
- `matcher` - マッチングパターン（オプション）
- `type` - `command`（Bashスクリプト）または`prompt`（LLM評価）
- `command` - 実行するコマンド
- `timeout` - タイムアウト秒数（デフォルト: 60秒）

## マッチャーの使い方

マッチャーは、特定の条件に一致するイベントのみでHookをトリガーするために使用します。

### 1. 完全一致

特定のツール名に完全一致する場合にのみトリガー：

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "echo 'Bashコマンドが実行されます' | tee -a command.log"
          }
        ]
      }
    ]
  }
}
```

### 2. 正規表現パターン

複数のツールに対応する場合、正規表現を使用：

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "prettier --write \"$CLAUDE_PROJECT_DIR/src/**/*.{js,ts,jsx,tsx}\""
          }
        ]
      }
    ]
  }
}
```

**よく使用するパターン:**
- `Edit|Write` - 編集または書き込み
- `Notebook.*` - すべてのNotebook関連ツール
- `Bash|Edit|Write` - 複数ツールの組み合わせ

### 3. ワイルドカード（すべてにマッチ）

すべてのツールでHookをトリガー：

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "echo \"ツール: $(jq -r '.tool_name')\""
          }
        ]
      }
    ]
  }
}
```

**または空文字列:**
```json
{
  "matcher": "",
  "hooks": [...]
}
```

### 4. MCPツールのマッチング

MCP（Model Context Protocol）ツールに対応する場合、`mcp__`プレフィックスを使用：

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "mcp__.*",
        "hooks": [
          {
            "type": "command",
            "command": "echo 'MCPツール使用' >> mcp-usage.log"
          }
        ]
      }
    ]
  }
}
```

### 5. イベント固有のマッチャー

いくつかのイベントは、ツール名以外のマッチャーを使用します：

**SessionStart:**
```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "startup",
        "hooks": [
          {
            "type": "command",
            "command": "echo 'セッション開始' | tee session.log"
          }
        ]
      }
    ]
  }
}
```

**Notification:**
```json
{
  "hooks": {
    "Notification": [
      {
        "matcher": "permission_prompt",
        "hooks": [
          {
            "type": "command",
            "command": "osascript -e 'beep'"
          }
        ]
      }
    ]
  }
}
```

**PreCompact:**
```json
{
  "hooks": {
    "PreCompact": [
      {
        "matcher": "auto",
        "hooks": [
          {
            "type": "command",
            "command": "echo 'コンテキスト圧縮開始' >> compact.log"
          }
        ]
      }
    ]
  }
}
```

## Hookの実行タイプ

Hooksは2つの実行タイプをサポートしています。

### 1. Commandフック（Bashスクリプト）

Bashコマンドやスクリプトを直接実行します。

**特徴:**
- 高速で決定論的
- シンプルなバリデーションに最適
- 外部ツールとの統合が容易

**基本的な使用例:**

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "eslint --fix \"$(jq -r '.tool_input.file_path')\""
          }
        ]
      }
    ]
  }
}
```

**複雑なスクリプトの実行:**

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/validate_bash.sh"
          }
        ]
      }
    ]
  }
}
```

**スクリプト例（`.claude/hooks/validate_bash.sh`）:**
```bash
#!/bin/bash

# 標準入力からJSONを読み込み
INPUT=$(cat)

# コマンドを抽出
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command')

# 危険なコマンドをチェック
if echo "$COMMAND" | grep -qE 'rm -rf|dd|mkfs|:(){ :|:& };:'; then
  echo "危険なコマンドが検出されました: $COMMAND" >&2
  exit 2  # ブロック
fi

# 安全な場合は許可
jq -n '{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "allow",
    "permissionDecisionReason": "安全なコマンドのため許可"
  }
}'
exit 0
```

**実行権限の付与:**
```bash
chmod +x .claude/hooks/validate_bash.sh
```

### 2. Promptベースフック（LLM評価）

Claude Haiku（小型モデル）を使用して、コンテキストに基づいた判断を行います。

**特徴:**
- コンテキストを理解した判断
- 柔軟で適応的
- 複雑なルールの実装に最適

**サポートされるイベント:**
- PreToolUse
- PermissionRequest
- UserPromptSubmit
- Stop
- SubagentStop

**基本的な使用例:**

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "prompt",
            "command": "以下のツール実行履歴を分析してください。本番環境に影響を与える変更が含まれている場合は\"block\"を返してください:\n\n$ARGUMENTS"
          }
        ]
      }
    ]
  }
}
```

**`$ARGUMENTS`プレースホルダー:**
- Hook入力データ（JSON）に自動置換される
- コンテキスト情報をプロンプトに含める

**応答形式:**

Promptベースフックは、以下の形式でJSON応答を返します：

```json
{
  "decision": "approve|block",
  "reason": "判断理由の説明",
  "systemMessage": "ユーザーへの追加メッセージ（オプション）"
}
```

**実践例 - コード品質チェック:**

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "prompt",
            "command": "以下の編集内容を分析してください。コード品質の問題（命名規則、エラーハンドリング、セキュリティ）がある場合は\"block\"を返し、Claudeに修正を促してください:\n\n$ARGUMENTS"
          }
        ]
      }
    ]
  }
}
```

**実践例 - プロンプト検証:**

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "prompt",
            "command": "以下のプロンプトに機密情報（APIキー、パスワード、トークン）が含まれていないか確認してください。含まれている場合は\"block\"を返してください:\n\n$ARGUMENTS"
          }
        ]
      }
    ]
  }
}
```

## 動作の制御

Hooksは終了コードとJSON応答を組み合わせて動作を制御します。

### 終了コードによる制御

#### 終了コード 0（成功）

**動作:**
- Hookは正常に完了
- 標準出力（stdout）はverboseモードで表示
- JSON応答が解析され、制御オプションが適用される

**使用例:**
```bash
#!/bin/bash

# 検証成功
jq -n '{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "allow"
  }
}'
exit 0
```

#### 終了コード 2（ブロックエラー）

**動作:**
- アクションをブロック
- 標準エラー出力（stderr）のみが使用される
- JSON応答は無視される
- stderrの内容がClaudeに送信される（または、イベントによってはユーザーに表示）

**イベント別の動作:**

| イベント | 終了コード2の効果 |
|---------|------------------|
| PreToolUse | ツール実行をブロック、stderrをClaudeに送信 |
| PermissionRequest | 権限を拒否、stderrをClaudeに送信 |
| PostToolUse | stderrをClaudeに送信（ツールは既に実行済み） |
| UserPromptSubmit | プロンプト処理をブロック、入力を消去 |
| Stop/SubagentStop | 停止をブロック、stderrをClaudeに送信 |
| Notification/PreCompact/SessionStart/SessionEnd | stderrをユーザーのみに表示 |

**使用例:**
```bash
#!/bin/bash

# 危険な操作を検出
if [ "$DANGEROUS_OPERATION" = "true" ]; then
  echo "エラー: 本番データベースへの変更は許可されていません" >&2
  exit 2  # ブロック
fi
```

#### その他の終了コード（非ブロックエラー）

**動作:**
- エラーとして記録されるが、実行は継続
- 標準エラー出力（stderr）はverboseモードで表示
- Hook失敗の通知のみ

**使用例:**
```bash
#!/bin/bash

# 警告を出すが、実行は継続
if [ "$WARNING_CONDITION" = "true" ]; then
  echo "警告: 推奨されない操作です" >&2
  exit 1
fi
```

### JSON応答の構造

#### 共通フィールド（すべてのイベント）

```json
{
  "continue": true,
  "stopReason": "continueがfalseの場合のメッセージ",
  "suppressOutput": false,
  "systemMessage": "ユーザーへの警告やコンテキスト情報"
}
```

**フィールド説明:**
- `continue` - `false`の場合、セッションを停止
- `stopReason` - 停止理由のメッセージ
- `suppressOutput` - `true`の場合、Hook出力を抑制
- `systemMessage` - ユーザーに表示する追加メッセージ

#### PreToolUse 固有の応答

```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "allow|deny|ask",
    "permissionDecisionReason": "判断理由",
    "updatedInput": {
      "modified_field": "変更後の値"
    }
  }
}
```

**使用例 - 入力パラメータの変更:**
```bash
#!/bin/bash

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command')

# コマンドに--verboseフラグを追加
MODIFIED_COMMAND="$COMMAND --verbose"

jq -n \
  --arg cmd "$MODIFIED_COMMAND" \
  '{
    "hookSpecificOutput": {
      "hookEventName": "PreToolUse",
      "permissionDecision": "allow",
      "updatedInput": {
        "command": $cmd
      }
    }
  }'
exit 0
```

#### PermissionRequest 固有の応答

```json
{
  "hookSpecificOutput": {
    "hookEventName": "PermissionRequest",
    "decision": {
      "behavior": "allow|deny",
      "updatedInput": {},
      "message": "拒否理由（denyの場合）",
      "interrupt": false
    }
  }
}
```

**使用例 - テストファイルの自動承認:**
```bash
#!/bin/bash

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path')

# テストファイルは自動承認
if echo "$FILE_PATH" | grep -qE '\.test\.(js|ts|jsx|tsx)$'; then
  jq -n '{
    "hookSpecificOutput": {
      "hookEventName": "PermissionRequest",
      "decision": {
        "behavior": "allow",
        "message": "テストファイルのため自動承認"
      }
    }
  }'
  exit 0
fi

# その他はユーザーに確認
jq -n '{
  "hookSpecificOutput": {
    "hookEventName": "PermissionRequest",
    "decision": {
      "behavior": "deny",
      "message": "ユーザー確認が必要です",
      "interrupt": true
    }
  }
}'
exit 0
```

#### PostToolUse 固有の応答

```json
{
  "decision": "block",
  "reason": "問題の説明",
  "hookSpecificOutput": {
    "hookEventName": "PostToolUse",
    "additionalContext": "Claudeへの追加情報"
  }
}
```

**使用例 - Linterチェック:**
```bash
#!/bin/bash

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path')

# ESLintを実行
LINT_OUTPUT=$(eslint "$FILE_PATH" 2>&1)
LINT_EXIT_CODE=$?

if [ $LINT_EXIT_CODE -ne 0 ]; then
  jq -n \
    --arg output "$LINT_OUTPUT" \
    '{
      "decision": "block",
      "reason": "Linterエラーが検出されました",
      "hookSpecificOutput": {
        "hookEventName": "PostToolUse",
        "additionalContext": $output
      }
    }'
  exit 0
fi

# Linter成功
jq -n '{
  "systemMessage": "✓ Linterチェック成功"
}'
exit 0
```

#### UserPromptSubmit/Stop/SubagentStop の応答

```json
{
  "decision": "approve|block",
  "reason": "判断理由",
  "continue": false,
  "stopReason": "ユーザー向けメッセージ",
  "systemMessage": "追加コンテキスト"
}
```

**Promptベースフックの応答例:**
```json
{
  "decision": "block",
  "reason": "テストが失敗しているため、修正が必要です",
  "systemMessage": "以下のテストが失敗:\n- UserService.test.js:42\n- AuthService.test.js:15"
}
```

## 環境変数の活用

Hooksは特別な環境変数にアクセスできます。

### 利用可能な環境変数

#### 1. CLAUDE_PROJECT_DIR

**説明:** プロジェクトルートの絶対パス

**利用可能:** すべてのHook

**使用例:**
```bash
#!/bin/bash

# プロジェクトルート基準でファイルにアクセス
LINT_CONFIG="$CLAUDE_PROJECT_DIR/.eslintrc.json"
eslint --config "$LINT_CONFIG" "$FILE_PATH"
```

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "cd \"$CLAUDE_PROJECT_DIR\" && npm run lint"
          }
        ]
      }
    ]
  }
}
```

#### 2. CLAUDE_ENV_FILE

**説明:** 環境変数を永続化するためのファイルパス

**利用可能:** SessionStartのみ

**使用例:**

**Hook設定:**
```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "startup",
        "hooks": [
          {
            "type": "command",
            "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/session_setup.sh"
          }
        ]
      }
    ]
  }
}
```

**スクリプト（`.claude/hooks/session_setup.sh`）:**
```bash
#!/bin/bash

# セッション全体で使用する環境変数を設定
cat >> "$CLAUDE_ENV_FILE" <<EOF
export NODE_ENV=development
export API_BASE_URL=http://localhost:3000
export LOG_LEVEL=debug
EOF

echo "環境変数を設定しました" | jq -R '{systemMessage: .}'
exit 0
```

**永続化された環境変数の使用:**
これらの環境変数は、セッション中のすべてのツール実行で利用可能になります：

```bash
# Claudeが実行するBashコマンドで自動的に利用可能
echo "API URL: $API_BASE_URL"
# 出力: API URL: http://localhost:3000
```

#### 3. CLAUDE_CODE_REMOTE

**説明:** リモート実行かどうかを示すフラグ

**利用可能:** すべてのHook

**値:**
- `"true"` - リモート環境で実行中
- 未設定 - ローカル環境で実行中

**使用例:**
```bash
#!/bin/bash

if [ "$CLAUDE_CODE_REMOTE" = "true" ]; then
  echo "リモート環境では一部の機能が制限されます" >&2
  exit 1
fi

# ローカル環境のみで実行
./local-only-tool.sh
exit 0
```

#### 4. ${CLAUDE_PLUGIN_ROOT}（プラグイン用）

**説明:** プラグインディレクトリの絶対パス

**利用可能:** プラグインHooksのみ

**使用例:**
```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PLUGIN_ROOT}/scripts/validate.sh"
          }
        ]
      }
    ]
  }
}
```

### 環境変数のベストプラクティス

#### 1. クォート処理

**必ず変数をクォートする:**
```bash
# ✅ 正しい
cd "$CLAUDE_PROJECT_DIR" && npm test

# ❌ 間違い（スペースを含むパスでエラー）
cd $CLAUDE_PROJECT_DIR && npm test
```

#### 2. 存在チェック

**変数の存在を確認:**
```bash
#!/bin/bash

if [ -z "$CLAUDE_PROJECT_DIR" ]; then
  echo "CLAUDE_PROJECT_DIR が設定されていません" >&2
  exit 1
fi

cd "$CLAUDE_PROJECT_DIR"
```

#### 3. デフォルト値の設定

**環境変数にデフォルト値を提供:**
```bash
#!/bin/bash

# NODE_ENVが未設定の場合はdevelopmentを使用
NODE_ENV="${NODE_ENV:-development}"
LOG_LEVEL="${LOG_LEVEL:-info}"

echo "環境: $NODE_ENV, ログレベル: $LOG_LEVEL"
```

## 基本的な使用例

### 例1: Bashコマンドログの記録

すべてのBashコマンド実行を記録します。

**設定（`.claude/settings.json`）:**
```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "jq -r '.tool_input.command' | tee -a \"$CLAUDE_PROJECT_DIR/.claude/bash-commands.log\""
          }
        ]
      }
    ]
  }
}
```

**動作:**
1. ClaudeがBashコマンドを実行しようとする
2. Hookがコマンドをログファイルに記録
3. コマンドが通常通り実行される

**ログファイル例（`.claude/bash-commands.log`）:**
```
npm test
git status
npm run build
```

### 例2: コードの自動フォーマット

ファイル編集後に自動的にPrettierでフォーマットします。

**設定（`.claude/settings.json`）:**
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/format.sh",
            "timeout": 30
          }
        ]
      }
    ]
  }
}
```

**スクリプト（`.claude/hooks/format.sh`）:**
```bash
#!/bin/bash

# 標準入力からJSONを読み込み
INPUT=$(cat)

# ファイルパスを抽出
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path')

# JavaScriptファイルのみフォーマット
if echo "$FILE_PATH" | grep -qE '\.(js|ts|jsx|tsx)$'; then
  prettier --write "$FILE_PATH" 2>&1

  if [ $? -eq 0 ]; then
    jq -n '{
      "systemMessage": "✓ コードをフォーマットしました"
    }'
  else
    jq -n '{
      "systemMessage": "⚠ フォーマット中にエラーが発生しました"
    }'
  fi
fi

exit 0
```

**実行権限の付与:**
```bash
chmod +x .claude/hooks/format.sh
```

### 例3: 機密ファイルへの書き込みブロック

`.env`ファイルや認証情報への書き込みを防ぎます。

**設定（`.claude/settings.json`）:**
```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/block_sensitive.sh"
          }
        ]
      }
    ]
  }
}
```

**スクリプト（`.claude/hooks/block_sensitive.sh`）:**
```bash
#!/bin/bash

# 標準入力からJSONを読み込み
INPUT=$(cat)

# ファイルパスを抽出
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path')

# 機密ファイルのパターン
SENSITIVE_PATTERNS=(
  "\.env"
  "\.env\..*"
  "credentials\.json"
  "\.ssh/"
  "\.aws/credentials"
  "\.gitconfig"
)

# チェック
for pattern in "${SENSITIVE_PATTERNS[@]}"; do
  if echo "$FILE_PATH" | grep -qE "$pattern"; then
    echo "エラー: 機密ファイルへの書き込みはブロックされました: $FILE_PATH" >&2
    echo "このファイルは手動で編集してください。" >&2
    exit 2  # ブロック
  fi
done

# 安全な場合は許可
jq -n '{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "allow"
  }
}'
exit 0
```

### 例4: エンド・オブ・ターン品質ゲート（テスト実行）

Claudeの応答完了時に自動的にテストを実行し、失敗時は修正を促します。

**設定（`.claude/settings.json`）:**
```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/run_tests.sh",
            "timeout": 120
          }
        ]
      }
    ]
  }
}
```

**スクリプト（`.claude/hooks/run_tests.sh`）:**
```bash
#!/bin/bash

cd "$CLAUDE_PROJECT_DIR" || exit 1

# テストを実行
TEST_OUTPUT=$(npm test 2>&1)
TEST_EXIT_CODE=$?

if [ $TEST_EXIT_CODE -ne 0 ]; then
  # テスト失敗: Claudeに修正を促す
  jq -n \
    --arg output "$TEST_OUTPUT" \
    '{
      "decision": "block",
      "reason": "テストが失敗しています。修正してください。",
      "systemMessage": $output
    }'
  exit 0  # 終了コード0でJSON応答を有効化
fi

# テスト成功
jq -n '{
  "systemMessage": "✓ すべてのテストが成功しました"
}'
exit 0
```

**動作フロー:**
```
Claude応答完了
  ↓
Stop Hookトリガー
  ↓
テスト実行
  ↓
成功? ─Yes→ セッション継続
  │
  No
  ↓
Claudeに失敗情報を送信
  ↓
Claudeが修正を試みる
  ↓
修正完了
  ↓
再度Stop Hookトリガー（テスト再実行）
```

### 例5: カスタム通知システム統合

Claude Codeの通知をSlackに転送します。

**設定（`.claude/settings.json`）:**
```json
{
  "hooks": {
    "Notification": [
      {
        "matcher": "permission_prompt",
        "hooks": [
          {
            "type": "command",
            "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/notify_slack.sh"
          }
        ]
      }
    ]
  }
}
```

**スクリプト（`.claude/hooks/notify_slack.sh`）:**
```bash
#!/bin/bash

# 標準入力からJSONを読み込み
INPUT=$(cat)

# 通知メッセージを抽出
MESSAGE=$(echo "$INPUT" | jq -r '.message')
NOTIFICATION_TYPE=$(echo "$INPUT" | jq -r '.notification_type')

# Slack Webhook URL（環境変数から取得）
SLACK_WEBHOOK_URL="${SLACK_WEBHOOK_URL:-}"

if [ -z "$SLACK_WEBHOOK_URL" ]; then
  echo "SLACK_WEBHOOK_URL が設定されていません" >&2
  exit 1
fi

# Slackに送信
curl -X POST "$SLACK_WEBHOOK_URL" \
  -H 'Content-Type: application/json' \
  -d "{\"text\":\"🤖 Claude Code: $MESSAGE\",\"channel\":\"#dev-notifications\"}" \
  2>&1 > /dev/null

exit 0
```

**環境変数の設定:**
```bash
export SLACK_WEBHOOK_URL="https://hooks.slack.com/services/YOUR/WEBHOOK/URL"
```

### 例6: セッション開始時の環境セットアップ

セッション開始時に依存関係をチェックし、環境を準備します。

**設定（`.claude/settings.json`）:**
```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "startup",
        "hooks": [
          {
            "type": "command",
            "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/session_init.sh",
            "timeout": 60
          }
        ]
      }
    ]
  }
}
```

**スクリプト（`.claude/hooks/session_init.sh`）:**
```bash
#!/bin/bash

cd "$CLAUDE_PROJECT_DIR" || exit 1

# 依存関係チェック
check_dependency() {
  if ! command -v "$1" &> /dev/null; then
    echo "エラー: $1 がインストールされていません" >&2
    exit 2
  fi
}

check_dependency "node"
check_dependency "npm"
check_dependency "git"

# package.jsonの存在確認
if [ ! -f "package.json" ]; then
  echo "警告: package.json が見つかりません" >&2
fi

# node_modulesの存在確認
if [ ! -d "node_modules" ]; then
  echo "node_modules が見つかりません。npm install を実行してください。" >&2
fi

# 環境変数の永続化
if [ -n "$CLAUDE_ENV_FILE" ]; then
  cat >> "$CLAUDE_ENV_FILE" <<EOF
export NODE_ENV=development
export PROJECT_ROOT="$CLAUDE_PROJECT_DIR"
EOF
fi

# セットアップ完了メッセージ
jq -n '{
  "systemMessage": "✓ セッション環境のセットアップが完了しました"
}'
exit 0
```

## セキュリティ考慮事項

Hooksは強力な機能ですが、適切に管理しないとセキュリティリスクになります。

### ⚠️ 重要な警告

**Hooksは自動的に実行され、現在の環境の認証情報にアクセスできます。**

悪意のあるHookは以下を実行できる可能性があります：
- ファイルシステムへのアクセス・変更
- 環境変数の読み取り（APIキー、パスワード等）
- ネットワーク通信
- システムコマンドの実行

### セキュリティベストプラクティス

#### 1. サードパーティHooksの評価

⚠️ **チェックリスト:**
- [ ] ソースコードを確認しましたか？
- [ ] 信頼できる開発者/組織ですか？
- [ ] コミュニティで実績がありますか？
- [ ] 定期的にメンテナンスされていますか？
- [ ] セキュリティ監査を受けていますか？

**推奨:**
```bash
# ✅ 公式ドキュメントの例
# ✅ チームメンバーが作成したHook（コードレビュー済み）
# ✅ 自分で作成・理解したHook
```

**避けるべき:**
```bash
# ❌ 出所不明なスクリプト
# ❌ ソースコードが公開されていない
# ❌ 過剰な権限を要求する
```

#### 2. 入力の検証とサニタイゼーション

**すべての入力を検証する:**
```bash
#!/bin/bash

INPUT=$(cat)

# ファイルパスの検証
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path')

# パストラバーサル攻撃の防止
if echo "$FILE_PATH" | grep -q '\.\./'; then
  echo "エラー: 無効なファイルパス" >&2
  exit 2
fi

# 絶対パスの確認
if [[ ! "$FILE_PATH" = /* ]]; then
  echo "エラー: 絶対パスが必要です" >&2
  exit 2
fi

# プロジェクトディレクトリ内かチェック
if [[ ! "$FILE_PATH" =~ ^"$CLAUDE_PROJECT_DIR" ]]; then
  echo "エラー: プロジェクト外のファイルアクセスは禁止" >&2
  exit 2
fi
```

#### 3. シェル変数の適切なクォート

**必ず変数をクォートする:**
```bash
# ✅ 正しい
cd "$CLAUDE_PROJECT_DIR" && npm test
eslint "$FILE_PATH"
echo "$COMMAND" | grep "pattern"

# ❌ 危険（インジェクション攻撃のリスク）
cd $CLAUDE_PROJECT_DIR && npm test
eslint $FILE_PATH
eval $COMMAND
```

#### 4. 機密情報の保護

**機密ファイルをスキップ:**
```bash
#!/bin/bash

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path')

# 機密ファイルパターン
SENSITIVE_PATTERNS=(
  "\.env"
  "\.env\..*"
  "\.git/"
  "\.ssh/"
  "\.aws/"
  "credentials"
  "secrets"
  "\.key$"
  "\.pem$"
)

# チェック
for pattern in "${SENSITIVE_PATTERNS[@]}"; do
  if echo "$FILE_PATH" | grep -qE "$pattern"; then
    echo "エラー: 機密ファイルへのアクセスは禁止されています" >&2
    exit 2
  fi
done
```

#### 5. コマンドインジェクションの防止

**`eval`の使用を避ける:**
```bash
# ❌ 危険
COMMAND=$(jq -r '.tool_input.command')
eval $COMMAND  # 任意のコード実行リスク

# ✅ より安全
COMMAND=$(jq -r '.tool_input.command')
# ホワイトリストでコマンドを検証
case "$COMMAND" in
  "npm test"|"npm run lint"|"npm run build")
    $COMMAND
    ;;
  *)
    echo "エラー: 許可されていないコマンド" >&2
    exit 2
    ;;
esac
```

#### 6. 権限の最小化

**必要最小限の権限で実行:**
```bash
#!/bin/bash

# 読み取り専用操作のみ許可
TOOL_NAME=$(jq -r '.tool_name')

if [ "$TOOL_NAME" != "Read" ] && [ "$TOOL_NAME" != "Grep" ] && [ "$TOOL_NAME" != "Glob" ]; then
  echo "エラー: 読み取り専用モードでは書き込み操作は許可されていません" >&2
  exit 2
fi
```

#### 7. ログの記録

**すべてのHook実行をログに記録:**
```bash
#!/bin/bash

LOG_FILE="$CLAUDE_PROJECT_DIR/.claude/hooks.log"

# ログエントリ作成
{
  echo "=== Hook実行 ==="
  echo "日時: $(date)"
  echo "イベント: $hook_event_name"
  echo "ツール: $tool_name"
  echo "入力: $INPUT"
  echo ""
} >> "$LOG_FILE"

# 実際の処理
# ...
```

#### 8. タイムアウトの設定

**無限ループを防ぐ:**
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "./validate.sh",
            "timeout": 30
          }
        ]
      }
    ]
  }
}
```

### セキュリティチェックリスト

新しいHookを追加する前に、以下を確認してください：

- [ ] Hookのソースコードを理解している
- [ ] すべての入力を検証している
- [ ] シェル変数を適切にクォートしている
- [ ] 機密ファイルへのアクセスを制限している
- [ ] `eval`やその他の危険なコマンドを使用していない
- [ ] 必要最小限の権限で動作する
- [ ] タイムアウトを設定している
- [ ] エラー処理が適切に実装されている
- [ ] ログ記録を実装している
- [ ] チームメンバーにコードレビューを依頼した

## トラブルシューティング

### 問題1: Hookが実行されない

**症状:**
Hookが設定されているが、イベント発生時に実行されない。

**解決方法:**

1. **設定ファイルの場所を確認**
   ```bash
   # プロジェクトレベル
   ls -la .claude/settings.json

   # ユーザーレベル
   ls -la ~/.claude/settings.json
   ```

2. **JSON構文を検証**
   ```bash
   # JSON構文チェック
   jq . .claude/settings.json

   # エラーがある場合は修正
   ```

3. **マッチャーパターンを確認**
   ```bash
   # デバッグモードでClaudeを起動
   claude --debug

   # Hook実行ログを確認
   ```

4. **実行権限を確認**
   ```bash
   # スクリプトに実行権限を付与
   chmod +x .claude/hooks/my_hook.sh

   # 確認
   ls -l .claude/hooks/my_hook.sh
   ```

5. **Hookタイプを確認**
   ```json
   {
     "hooks": {
       "PreToolUse": [
         {
           "matcher": "Bash",
           "hooks": [
             {
               "type": "command",  // "command" または "prompt"
               "command": "./script.sh"
             }
           ]
         }
       ]
     }
   }
   ```

### 問題2: Hookがエラーで失敗する

**症状:**
Hookが実行されるが、エラーで失敗する。

**解決方法:**

1. **スクリプトを手動で実行してテスト**
   ```bash
   # サンプル入力を作成
   echo '{
     "session_id": "test",
     "tool_name": "Bash",
     "tool_input": {"command": "npm test"}
   }' | .claude/hooks/my_hook.sh

   # エラーメッセージを確認
   ```

2. **パスを確認**
   ```bash
   #!/bin/bash

   # 絶対パスを使用
   cd "$CLAUDE_PROJECT_DIR" || exit 1

   # 相対パスではなく絶対パス
   "$CLAUDE_PROJECT_DIR/.claude/hooks/helper.sh"
   ```

3. **依存関係を確認**
   ```bash
   #!/bin/bash

   # 必要なコマンドの存在確認
   if ! command -v jq &> /dev/null; then
     echo "エラー: jq がインストールされていません" >&2
     exit 1
   fi
   ```

4. **デバッグ出力を追加**
   ```bash
   #!/bin/bash

   # デバッグモード
   set -x  # コマンドをトレース

   # エラー時に終了
   set -e

   # 未定義変数をエラーとする
   set -u
   ```

### 問題3: JSON応答が認識されない

**症状:**
Hookが正常終了するが、JSON応答が適用されない。

**解決方法:**

1. **JSON構文を検証**
   ```bash
   #!/bin/bash

   # JSON出力をテスト
   OUTPUT=$(jq -n '{
     "hookSpecificOutput": {
       "hookEventName": "PreToolUse",
       "permissionDecision": "allow"
     }
   }')

   # 構文チェック
   echo "$OUTPUT" | jq .
   ```

2. **終了コードを確認**
   ```bash
   #!/bin/bash

   # JSON応答は終了コード0でのみ有効
   jq -n '{
     "hookSpecificOutput": {
       "hookEventName": "PreToolUse",
       "permissionDecision": "allow"
     }
   }'
   exit 0  # 必ず0で終了
   ```

3. **hookEventNameを確認**
   ```json
   {
     "hookSpecificOutput": {
       "hookEventName": "PreToolUse",  // イベント名が正確か確認
       "permissionDecision": "allow"
     }
   }
   ```

### 問題4: Hookがタイムアウトする

**症状:**
Hookの実行が途中で中断される。

**解決方法:**

1. **タイムアウト時間を延長**
   ```json
   {
     "hooks": {
       "Stop": [
         {
           "hooks": [
             {
               "type": "command",
               "command": "npm test",
               "timeout": 300  // 5分に延長
             }
           ]
         }
       ]
     }
   }
   ```

2. **処理を最適化**
   ```bash
   #!/bin/bash

   # 並列処理で高速化
   eslint src/ &
   prettier --check src/ &
   wait  # すべてのジョブの完了を待つ
   ```

3. **バックグラウンド実行を検討**
   ```bash
   #!/bin/bash

   # 長時間処理はバックグラウンドで実行
   ./long-running-task.sh > /dev/null 2>&1 &

   # 即座に完了
   jq -n '{"systemMessage": "バックグラウンドで処理中"}'
   exit 0
   ```

### 問題5: 環境変数が利用できない

**症状:**
`$CLAUDE_PROJECT_DIR`等の環境変数が未定義。

**解決方法:**

1. **変数の存在を確認**
   ```bash
   #!/bin/bash

   if [ -z "$CLAUDE_PROJECT_DIR" ]; then
     echo "エラー: CLAUDE_PROJECT_DIR が設定されていません" >&2
     exit 1
   fi
   ```

2. **デフォルト値を設定**
   ```bash
   #!/bin/bash

   # プロジェクトディレクトリのデフォルト値
   PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}"
   cd "$PROJECT_DIR"
   ```

3. **CLAUDE_ENV_FILEの使用確認**
   ```bash
   # CLAUDE_ENV_FILEはSessionStartのみで利用可能
   # 他のHookでは使用不可
   ```

### 問題6: Promptベースフックが動作しない

**症状:**
`type: "prompt"`のHookが実行されない。

**解決方法:**

1. **サポートされるイベントか確認**
   ```
   Promptベースフックをサポート:
   - PreToolUse
   - PermissionRequest
   - UserPromptSubmit
   - Stop
   - SubagentStop

   サポートされない:
   - PostToolUse
   - SessionStart
   - SessionEnd
   - Notification
   - PreCompact
   ```

2. **プロンプト形式を確認**
   ```json
   {
     "hooks": {
       "Stop": [
         {
           "hooks": [
             {
               "type": "prompt",
               "command": "以下のテスト結果を分析し、失敗がある場合は\"block\"を返してください:\n\n$ARGUMENTS"
             }
           ]
         }
       ]
     }
   }
   ```

3. **$ARGUMENTSプレースホルダーを使用**
   ```json
   {
     "type": "prompt",
     "command": "プロンプト内容... $ARGUMENTS"  // 入力データを含める
   }
   ```

## まとめ

Hooksは、Claude Codeの動作を自動化・制御するための強力な機能です。

**重要なポイント:**

1. **適切なイベント選択** - 目的に応じて最適なHookイベントを選択
2. **セキュリティ優先** - 入力検証、権限最小化、機密情報の保護
3. **段階的導入** - シンプルなHookから始め、徐々に複雑化
4. **チーム共有** - プロジェクトレベル設定でチーム全体の効率向上
5. **適切なエラーハンドリング** - 終了コードとJSON応答を適切に使用

**次のステップ:**

- **[Skills基礎](04-skills-basics.md)** - 再利用可能なAIスキルの作成方法を学ぶ
- **[スラッシュコマンド](../02-features/slash-commands.md)** - カスタムコマンドとの組み合わせ
- **[MCP基礎](01-mcp-basics.md)** - 外部サービスとの統合を学ぶ

---

**関連ドキュメント:**
- [設定ファイル](../12-configuration.md) - 詳細な設定方法
- [開発プロセス](../06-development-process/README.md) - Hooksを活用した開発ワークフロー
- [トラブルシューティング](../09-troubleshooting.md) - 一般的な問題解決

**外部リソース:**
- [Hooks Reference - Claude Code Docs](https://code.claude.com/docs/en/hooks)
- [Get started with Claude Code hooks](https://code.claude.com/docs/en/hooks-guide)
- [GitHub - claude-code-hooks-mastery](https://github.com/disler/claude-code-hooks-mastery)

**タグ:** `#中級者` `#Hooks` `#自動化` `#品質管理` `#セキュリティ` `#ワークフロー` `#カスタマイズ`
