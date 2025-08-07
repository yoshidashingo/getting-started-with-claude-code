# スラッシュコマンド

Claude Codeのスラッシュコマンドを使用することで、対話を効率的にコントロールし、様々な機能に素早くアクセスできます。

## コマンド一覧

### 基本コマンド

#### /help
Claude Codeの使い方やコマンドのヘルプを表示します。

```
/help
```

**用途:**
- 利用可能なコマンドの確認
- 機能の使い方を調べる
- トラブルシューティング

#### /exit または /quit
現在のセッションを終了します。

```
/exit
```

**注意:**
- 保存されていない作業は失われる可能性があります
- セッション再開機能（--resume）で後から続行可能

### メモリ管理コマンド

#### /memory
プロジェクトメモリ（CLAUDE.md）を編集・管理します。

```
/memory              # メモリファイルを編集
/memory show         # 現在のメモリ内容を表示
/memory clear        # セッションメモリをクリア
/memory reload       # メモリファイルを再読み込み
```

**活用例:**
```
/memory
# エディタが開くので、プロジェクト情報を追加
# 保存して閉じると、即座に反映される
```

#### /init
新しいプロジェクトメモリファイルを初期化します。

```
/init                # 対話形式で設定
/init --template api # APIプロジェクト用テンプレート
/init --minimal      # 最小限のテンプレート
```

**テンプレートオプション:**
- `api`: REST API プロジェクト
- `webapp`: Webアプリケーション
- `cli`: CLIツール
- `library`: ライブラリ/パッケージ

### セッション管理コマンド

#### /clear
現在の会話履歴をクリアします。

```
/clear
```

**用途:**
- コンテキストのリセット
- 新しいタスクの開始
- メモリ使用量の削減

#### /context
現在のコンテキスト情報を表示します。

```
/context             # 全体のコンテキスト情報
/context files       # 読み込まれているファイル一覧
/context memory      # アクティブなメモリ情報
/context stats       # 統計情報（トークン使用量など）
```

### ファイル操作コマンド

#### /ls
ディレクトリの内容を表示します。

```
/ls                  # 現在のディレクトリ
/ls src/             # 指定ディレクトリ
/ls -la              # 詳細情報を含む
/ls **/*.ts          # パターンマッチング
```

#### /cat
ファイルの内容を表示します。

```
/cat README.md       # ファイル内容を表示
/cat src/*.ts        # 複数ファイルを表示
/cat -n file.js      # 行番号付きで表示
```

#### /find
ファイルやディレクトリを検索します。

```
/find "TODO"         # TODOを含むファイルを検索
/find -name "*.test.js"  # ファイル名で検索
/find -type f -size +1M  # 1MB以上のファイル
```

### プロジェクト管理コマンド

#### /project
プロジェクト情報と統計を表示します。

```
/project info        # プロジェクト概要
/project stats       # コード統計
/project deps        # 依存関係一覧
/project structure   # ディレクトリ構造
```

#### /git
Git操作を実行します（読み取り専用）。

```
/git status          # 現在の状態
/git log -5          # 最新5件のコミット
/git diff            # 変更内容
/git branch          # ブランチ一覧
```

### 開発支援コマンド

#### /run
コマンドの実行（シミュレーション）を行います。

```
/run npm test        # テストコマンドの確認
/run build           # ビルドプロセスの確認
/run docker-compose  # Docker構成の確認
```

**注意:** 実際には実行されず、コマンドの内容と予想される結果を表示します。

#### /explain
コードや概念の説明を求めます。

```
/explain this function
/explain async/await
/explain the error above
```

#### /refactor
コードのリファクタリング提案を求めます。

```
/refactor this method
/refactor for performance
/refactor using patterns
```

### 特殊コマンド

#### /think
拡張思考モードを一時的に有効化します。

```
/think
# 次の質問に対して深い分析を行う
```

#### /web
Web検索を実行します（利用可能な場合）。

```
/web search "React 18 新機能"
/web docs "TypeScript generics"
```

#### /save
現在のセッション情報を保存します。

```
/save session        # セッション全体を保存
/save memory         # メモリのスナップショット
/save context        # コンテキスト情報
```

## コマンドの組み合わせ

### 効率的なワークフロー

```bash
# プロジェクト開始時
/init --template api
/project info
/memory

# 開発中
/context files
/find "TODO"
/refactor this function

# デバッグ時
/git diff
/explain this error
/think

# セッション終了時
/save session
/exit
```

### パイプライン的な使用

いくつかのコマンドは組み合わせて使用できます：

```bash
/find "deprecated" | /explain
/ls src/**/*.test.js | /run jest
/git log -10 | /context
```

## カスタムエイリアス

よく使うコマンドの組み合わせをエイリアスとして登録できます（CLAUDE.mdファイル内）：

```markdown
## コマンドエイリアス
- check: /run npm test && /run npm run lint
- review: /git diff | /explain
- clean: /clear && /context reset
```

## コマンドのオプション

### 共通オプション

多くのコマンドで使用できる共通オプション：

- `--help`, `-h`: コマンドのヘルプを表示
- `--verbose`, `-v`: 詳細な出力
- `--quiet`, `-q`: 最小限の出力
- `--format`, `-f`: 出力フォーマット（json, table, plain）

### 出力のフォーマット

```bash
/project stats --format json
/ls --format table
/context --format plain
```

## トラブルシューティング

### コマンドが認識されない

1. スペルを確認（`/memeory` → `/memory`）
2. Claude Codeのバージョンを確認
3. `/help`で利用可能なコマンドを確認

### コマンドの実行が遅い

1. `/context stats`でメモリ使用量を確認
2. `/clear`で不要なコンテキストをクリア
3. 大きなファイルの読み込みを避ける

### 期待した結果が得られない

1. コマンドオプションを確認（`--help`）
2. より具体的なパラメータを指定
3. `/think`モードで詳細な分析を依頼

## ベストプラクティス

### 1. セッション開始時のルーチン

```bash
/project info        # プロジェクト確認
/git status          # 現在の状態確認
/memory show         # メモリ設定確認
```

### 2. 定期的なコンテキスト管理

```bash
/context stats       # 使用量チェック
/clear              # 必要に応じてクリア
/memory reload      # メモリ更新の反映
```

### 3. 効率的な検索

```bash
/find "TODO" --type comment     # TODOコメントのみ
/find "error" --recent 1d       # 最近のエラー
/find "test" --exclude node_modules  # 除外指定
```

---

**関連ドキュメント:**
- [メモリ管理機能](memory-management.md) - メモリ関連コマンドの詳細
- [拡張思考モード](extended-thinking.md) - /thinkコマンドの詳細
- [セッション管理](session-management.md) - セッション関連機能