# Subagents（サブエージェント）活用ガイド

## 目次
- [Subagentsとは](#subagentsとは)
- [Subagentsの利点](#subagentsの利点)
- [Subagentsの作成方法](#subagentsの作成方法)
- [配置場所](#配置場所)
- [Subagentの起動方法](#subagentの起動方法)
- [実践的な使用例](#実践的な使用例)
- [設計のベストプラクティス](#設計のベストプラクティス)
- [チームでの共有方法](#チームでの共有方法)
- [トラブルシューティング](#トラブルシューティング)

---

## Subagentsとは

**Subagents（サブエージェント）** は、特定のタスクやドメインに特化した専門的なAIアシスタントです。メインのClaude Codeセッションから独立したコンテキストウィンドウを持ち、カスタムシステムプロンプトと設定可能なツールアクセス権限を持つことで、より効率的で安全なタスク委譲が可能になります。

### 基本概念

```
┌─────────────────────┐
│   Claude Code       │
│   (メインセッション)   │
└──────────┬──────────┘
           │ タスク委譲
           ▼
┌─────────────────────┐
│   Subagent          │
│   (専門エージェント)   │
│                     │
│ ✓ 独自コンテキスト   │
│ ✓ カスタムプロンプト │
│ ✓ ツール制限        │
│ ✓ モデル選択可能    │
└─────────────────────┘
```

**主な特徴:**

- **専門化**: 特定のドメインやタスクに最適化されたプロンプト
- **独立したコンテキスト**: メインセッションと分離された会話履歴
- **柔軟なツール制御**: 必要最小限のツールのみへのアクセス
- **モデル選択**: タスクに応じた最適なモデルを選択可能
- **再利用性**: 一度作成すれば繰り返し使用可能

---

## Subagentsの利点

### 1. コンテキスト管理

```
【問題】
メインセッションでコンテキストが肥大化し、重要な情報が埋もれる

【解決】
専門タスクを独立したSubagentに委譲することで、
各エージェントが明確なコンテキストを保持
```

**メリット:**
- トークン使用量の最適化
- 会話履歴の整理
- フォーカスの明確化

### 2. ドメイン専門知識

各Subagentに特定分野の深い知識を持たせることができます：

```yaml
# セキュリティ監査の例
- OWASP Top 10の脆弱性チェック
- セキュアコーディングのベストプラクティス
- 依存関係の脆弱性スキャン
```

**メリット:**
- 高品質な専門的アドバイス
- 一貫した評価基準
- 学習コストの削減

### 3. 再利用性とスケーラビリティ

一度作成したSubagentは、チーム全体で共有し、繰り返し使用できます：

```bash
# プロジェクトレベルで共有
.claude/agents/code-reviewer/

# チームメンバー全員が使用可能
```

**メリット:**
- 知識の標準化
- オンボーディングの効率化
- チーム生産性の向上

### 4. セキュリティとアクセス制御

各Subagentに必要最小限のツールアクセスを付与：

```yaml
# データサイエンティストには読み取り専用
tools: ["Read", "Grep", "Glob", "Bash"]

# デプロイヤーには実行権限
tools: ["Bash", "Read", "WebFetch"]
```

**メリット:**
- リスクの最小化
- 誤操作の防止
- 監査証跡の明確化

---

## Subagentsの作成方法

### `/agents` コマンドの使用

最も簡単な方法は、対話型コマンドを使用することです：

```bash
# Subagent作成コマンド
/agents
```

実行すると、以下のオプションが表示されます：

```
Claude Code Agents Menu:
1. List available agents
2. Create a new agent
3. Edit an existing agent
4. Delete an agent
5. Test an agent
```

### 手動作成の手順

より細かく制御したい場合は、手動でファイルを作成します：

#### ステップ1: ディレクトリ構造の作成

```bash
# プロジェクトレベル
mkdir -p .claude/agents/my-agent

# ユーザーレベル
mkdir -p ~/.claude/agents/my-agent
```

#### ステップ2: 設定ファイルの作成

`AGENT.md` ファイルを作成します：

```markdown
---
name: code-reviewer
description: コードレビューを実施し、ベストプラクティスに基づいた改善提案を行う
model: claude-sonnet-4-5-20250929
tools:
  - Read
  - Grep
  - Glob
  - Bash
temperature: 0.2
max_tokens: 8000
---

# コードレビューエージェント

あなたは経験豊富なシニアソフトウェアエンジニアです。以下の観点からコードレビューを実施してください。

## レビュー観点

### 1. コード品質
- 可読性と保守性
- 命名規則の一貫性
- コメントとドキュメント
- DRY原則の遵守

### 2. 設計とアーキテクチャ
- SOLID原則の適用
- デザインパターンの適切な使用
- モジュール性と疎結合

### 3. パフォーマンス
- アルゴリズムの効率性
- メモリ使用量
- 不要な処理の有無

### 4. セキュリティ
- 入力バリデーション
- SQL/XSS/CSRF対策
- 機密情報の取り扱い

### 5. テスタビリティ
- ユニットテストの充実度
- テストカバレッジ
- モック・スタブの適切な使用

## 出力フォーマット

レビュー結果は以下の形式で提供してください：

### ✅ 良い点
[具体的な良い実装を列挙]

### ⚠️ 改善提案
[優先度付きで改善点を提示]

### 🔴 重要な問題
[セキュリティやバグの可能性がある箇所]

### 📝 コード例
[改善案の具体的なコード例]
```

### 設定ファイルの構造

#### YAMLフロントマター

```yaml
---
# 必須フィールド
name: エージェント名（一意の識別子）
description: Claudeが自動選択する際の判断材料となる説明

# オプションフィールド
model: claude-sonnet-4-5-20250929  # 使用するモデル
temperature: 0.0-1.0               # 創造性の度合い（デフォルト: 0.5）
max_tokens: 1000-200000           # 最大トークン数
tools:                             # 使用可能なツールのリスト
  - Read
  - Write
  - Bash
---
```

#### 設定項目の詳細

| 項目 | 説明 | デフォルト値 | 推奨設定 |
|------|------|-------------|----------|
| `name` | エージェント名 | （必須） | ケバブケース推奨 |
| `description` | 用途の説明 | （必須） | 具体的で明確に |
| `model` | AIモデル | `claude-sonnet-4-5-20250929` | タスクに応じて選択 |
| `temperature` | 出力のランダム性 | 0.5 | コードレビュー: 0.2、創作: 0.8 |
| `max_tokens` | 最大トークン数 | 8000 | 複雑なタスク: 大きめに |
| `tools` | 使用可能なツール | 全ツール | 最小権限の原則に従う |

### システムプロンプトの作成

効果的なシステムプロンプトの要素：

#### 1. 役割の明確化

```markdown
# あなたの役割
あなたは[専門分野]の専門家であり、[具体的な責任]を担当します。
```

#### 2. 作業範囲の定義

```markdown
## スコープ
以下のタスクに専念してください：
- タスク1
- タスク2
- タスク3

以下は実施しないでください：
- 範囲外のタスク1
- 範囲外のタスク2
```

#### 3. 出力フォーマットの指定

```markdown
## 出力形式
すべてのレポートは以下の構造に従ってください：
1. サマリー（3-5文）
2. 詳細分析
3. 推奨事項
4. 次のステップ
```

#### 4. 評価基準の設定

```markdown
## 評価基準
以下の基準に従って評価してください：
- 基準1: [説明]
- 基準2: [説明]
- 基準3: [説明]
```

### ツール選択の設定

各タスクに最適なツールセットを選択します：

#### 読み取り専用タスク

```yaml
tools:
  - Read
  - Grep
  - Glob
  # Write、Editは含めない
```

**適用例:**
- コードレビュー
- ドキュメント分析
- セキュリティ監査

#### 編集タスク

```yaml
tools:
  - Read
  - Write
  - Edit
  - Grep
  - Glob
```

**適用例:**
- リファクタリング
- ドキュメント更新
- コード生成

#### 実行タスク

```yaml
tools:
  - Bash
  - Read
  - Write
  # 慎重に使用
```

**適用例:**
- テスト実行
- ビルド
- デプロイメント

#### ⚠️ ツール選択の注意点

- **最小権限の原則**: 必要最小限のツールのみを付与
- **リスク評価**: `Bash`、`Write`は慎重に
- **監査可能性**: ツール使用をログに記録

### モデル選択

タスクに応じた最適なモデルを選択：

#### Claude Sonnet 4.5（推奨）

```yaml
model: claude-sonnet-4-5-20250929
```

**適用シナリオ:**
- 複雑なコード分析
- 高度な推論が必要なタスク
- 大規模プロジェクトのレビュー

**特徴:**
- 最高の性能
- 深い理解力
- コスト高め

#### Claude Haiku（高速・低コスト）

```yaml
model: claude-haiku-4-20250514
```

**適用シナリオ:**
- シンプルなフォーマット変換
- 大量の反復タスク
- クイックチェック

**特徴:**
- 高速レスポンス
- 低コスト
- 基本的なタスクに最適

#### Temperature設定の指針

```yaml
# 決定論的なタスク（コードレビュー、バグ修正）
temperature: 0.0 - 0.3

# バランス型（一般的なタスク）
temperature: 0.4 - 0.6

# 創造的なタスク（ドキュメント作成、アイデア出し）
temperature: 0.7 - 1.0
```

---

## 配置場所

Subagentは2つの場所に配置できます：

### 1. プロジェクトレベル

```bash
.claude/agents/
├── code-reviewer/
│   └── AGENT.md
├── debugger/
│   └── AGENT.md
└── security-auditor/
    └── AGENT.md
```

**用途:**
- プロジェクト固有のワークフロー
- チームで共有するエージェント
- バージョン管理に含める

**設定方法:**
```bash
# プロジェクトルートで作成
mkdir -p .claude/agents/my-agent
cd .claude/agents/my-agent
# AGENT.mdを作成
```

### 2. ユーザーレベル

```bash
~/.claude/agents/
├── personal-assistant/
│   └── AGENT.md
├── data-analyst/
│   └── AGENT.md
└── doc-writer/
    └── AGENT.md
```

**用途:**
- 個人用エージェント
- 複数プロジェクトで共有
- 個人的なワークフロー

**設定方法:**
```bash
# ホームディレクトリに作成
mkdir -p ~/.claude/agents/my-agent
cd ~/.claude/agents/my-agent
# AGENT.mdを作成
```

### 優先順位

両方に同名のエージェントがある場合：

```
プロジェクトレベル > ユーザーレベル
```

**理由:**
- プロジェクト固有の設定を優先
- チーム標準を個人設定より優先

---

## Subagentの起動方法

### 1. 手動起動

明示的にSubagentを呼び出す方法：

```
あなた: @code-reviewer を使って、UserForm.tsxをレビューしてください
```

**メリット:**
- 明確な制御
- 予測可能な動作
- デバッグしやすい

### 2. 自動委譲

Claude Codeが自動的に適切なSubagentを選択：

```
あなた: このコンポーネントをレビューして改善提案をください

Claude: タスクに最適なcode-reviewerエージェントを使用します
[Subagentが自動的に起動]
```

**仕組み:**
1. Claudeがタスク内容を分析
2. 利用可能なSubagentsの`description`を確認
3. 最適なエージェントを選択して起動
4. 結果をメインセッションに返す

**自動委譲を促すコツ:**
- `description`を具体的かつ明確に記述
- タスクの種類を明示的に伝える
- 期待する出力を明確にする

### 3. 会話中の切り替え

既に起動中のSubagentから別のエージェントへ：

```
あなた: このバグを修正したので、セキュリティ面も確認してください

Claude: security-auditorエージェントに切り替えます
[別のSubagentが起動]
```

---

## 実践的な使用例

### 例1: コードレビューアー

#### AGENT.md

```markdown
---
name: code-reviewer
description: TypeScript/React/Node.jsのコードレビューを実施し、ベストプラクティスに基づいた改善提案を行う
model: claude-sonnet-4-5-20250929
temperature: 0.2
tools:
  - Read
  - Grep
  - Glob
---

# コードレビューエージェント

あなたは10年以上の経験を持つシニアフルスタックエンジニアです。以下の観点から徹底的なコードレビューを実施してください。

## レビュー基準

### 1. TypeScript/JavaScript品質
- 型定義の適切性（`any`の使用を避ける）
- 非同期処理の適切なハンドリング
- エラーハンドリングの完全性
- ESLintルールの遵守

### 2. React ベストプラクティス
- フックの正しい使用（依存配列の完全性）
- 不要な再レンダリングの回避
- Propsドリリングの防止
- コンポーネントの責務分離

### 3. パフォーマンス
- メモ化の適切な使用（`useMemo`、`useCallback`）
- バンドルサイズへの影響
- 重い計算処理の最適化

### 4. セキュリティ
- XSS脆弱性チェック
- 機密情報のハードコード防止
- 依存パッケージの脆弱性

### 5. テスタビリティ
- ユニットテストの書きやすさ
- 副作用の分離
- モックのしやすさ

## 出力フォーマット

### ✅ 優れた実装
[コードの良い点を具体的に挙げる]

### ⚠️ 改善提案（優先度: 高）
**ファイル名: 行番号**
- 問題点
- 理由
- 改善案のコード例

### 💡 改善提案（優先度: 中）
[同上]

### 📚 学習リソース
[関連するベストプラクティスやドキュメントへのリンク]
```

#### 使用方法

```
あなた: src/components/UserForm.tsxをレビューしてください

Code Reviewer: UserForm.tsxのレビュー結果をお伝えします。

✅ 優れた実装
- フォームバリデーションが適切に実装されています
- エラーメッセージがユーザーフレンドリーです
- TypeScriptの型定義が明確です

⚠️ 改善提案（優先度: 高）

**src/components/UserForm.tsx: 45-50**
問題点: useEffectの依存配列にhandleSubmitが含まれていません

現在のコード:
```tsx
useEffect(() => {
  handleSubmit(formData);
}, [formData]);
```

改善案:
```tsx
const handleSubmit = useCallback((data: FormData) => {
  // 処理
}, []);

useEffect(() => {
  handleSubmit(formData);
}, [formData, handleSubmit]);
```

理由: 依存配列の不完全性はReactの警告を引き起こし、予期しない動作の原因となります。
```

### 例2: デバッガー

#### AGENT.md

```markdown
---
name: debugger
description: コードのバグを特定し、根本原因を分析して修正案を提示する
model: claude-sonnet-4-5-20250929
temperature: 0.1
tools:
  - Read
  - Grep
  - Glob
  - Bash
---

# デバッグエージェント

あなたは経験豊富なデバッグスペシャリストです。体系的なアプローチでバグの根本原因を特定し、解決策を提供してください。

## デバッグプロセス

### 1. 問題の理解
- エラーメッセージの詳細分析
- 再現手順の確認
- 期待される動作と実際の動作の差異

### 2. 仮説の構築
- 考えられる原因のリストアップ
- 優先度付け（発生確率、影響度）

### 3. 調査
- 関連コードの確認
- ログの分析
- 状態の検証

### 4. 根本原因の特定
- 仮説の検証
- 最小再現コードの作成

### 5. 解決策の提案
- 短期的な修正（ホットフィックス）
- 長期的な改善（リファクタリング）
- テストケースの追加

## 調査手順

1. **エラーログの確認**
   ```bash
   # コンソールエラー
   # スタックトレース
   # ネットワークエラー
   ```

2. **関連ファイルの検索**
   ```bash
   # エラーメッセージからキーワード抽出
   # 該当コードの特定
   ```

3. **データフローの追跡**
   - 入力値の確認
   - 中間状態の検証
   - 出力値の検証

4. **依存関係の確認**
   - 外部ライブラリのバージョン
   - 環境変数
   - 設定ファイル

## 出力フォーマット

### 🐛 バグの概要
[簡潔な説明]

### 🔍 根本原因
[詳細な原因分析]

### 💊 修正案

#### 即時修正
```
[具体的なコード変更]
```

#### 推奨される改善
```
[長期的な改善案]
```

### ✅ テストケース
```
[バグを検出するテストコード]
```

### 📋 再発防止策
[プロセス改善提案]
```

#### 使用方法

```
あなた: ユーザー登録時に「Invalid email」エラーが出るバグを調査してください

Debugger: バグの調査を開始します。

🐛 バグの概要
ユーザー登録フォームで有効なメールアドレスを入力してもバリデーションエラーが発生します。

🔍 根本原因
src/utils/validation.ts:23の正規表現に問題があります。

現在のコード:
```ts
const EMAIL_REGEX = /^[a-z0-9]+@[a-z]+\.[a-z]+$/;
```

問題点:
1. 大文字を許可していない
2. ドット（.）やハイフン（-）を許可していない
3. サブドメインに対応していない

💊 修正案

即時修正:
```ts
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
```

推奨される改善:
```ts
import { z } from 'zod';

const emailSchema = z.string().email();

export function validateEmail(email: string): boolean {
  return emailSchema.safeParse(email).success;
}
```

✅ テストケース:
```ts
describe('validateEmail', () => {
  it('should accept valid emails', () => {
    expect(validateEmail('user@example.com')).toBe(true);
    expect(validateEmail('User.Name+tag@Example.co.jp')).toBe(true);
  });

  it('should reject invalid emails', () => {
    expect(validateEmail('invalid')).toBe(false);
    expect(validateEmail('@example.com')).toBe(false);
  });
});
```
```

### 例3: データサイエンティスト

#### AGENT.md

```markdown
---
name: data-scientist
description: データ分析、統計処理、可視化を実施し、インサイトを提供する
model: claude-sonnet-4-5-20250929
temperature: 0.3
tools:
  - Read
  - Bash
  - Glob
---

# データサイエンスエージェント

あなたはデータサイエンスの専門家です。データの探索、分析、可視化を通じて価値あるインサイトを提供してください。

## 分析プロセス

### 1. データ理解
- データの構造確認（行数、列数、型）
- 欠損値の確認
- 基本統計量の算出

### 2. データクリーニング
- 欠損値の処理
- 異常値の検出
- データ型の変換

### 3. 探索的データ分析（EDA）
- 分布の確認
- 相関分析
- 特徴量の重要度

### 4. 可視化
- 適切なグラフの選択
- インタラクティブな可視化
- ダッシュボード作成

### 5. インサイト抽出
- パターンの発見
- 異常の検出
- 予測モデルの提案

## 使用ツール

```python
# 標準ライブラリ
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# 機械学習
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
```

## 出力フォーマット

### 📊 データ概要
- データサイズ: X行 × Y列
- データ型: [リスト]
- 欠損値: X%

### 📈 主要な発見
1. [発見1]
2. [発見2]
3. [発見3]

### 📉 可視化
```python
[グラフ生成コード]
```

### 💡 推奨事項
[データに基づく推奨アクション]

### 🔮 次のステップ
[さらなる分析の提案]
```

#### 使用方法

```
あなた: sales_data.csvを分析して、売上傾向を教えてください

Data Scientist: sales_data.csvの分析結果をお伝えします。

📊 データ概要
- データサイズ: 10,000行 × 8列
- 期間: 2023-01-01 〜 2024-12-31
- 欠損値: 2.3%（主にoptional_notes列）

📈 主要な発見

1. **季節性のパターン**
   - 12月の売上が平均より45%高い
   - 7-8月が最も低い（夏季休暇の影響）

2. **製品カテゴリ別の傾向**
   - Electronics: 成長率 +25% YoY
   - Apparel: 横ばい
   - Home Goods: 微減 -5%

3. **地域別の特徴**
   - 東京地域が全体の35%を占める
   - 地方都市で高成長（+30%）

📉 可視化

```python
import pandas as pd
import matplotlib.pyplot as plt

# 月別売上トレンド
df['month'] = pd.to_datetime(df['date']).dt.month
monthly_sales = df.groupby('month')['amount'].sum()

plt.figure(figsize=(12, 6))
monthly_sales.plot(kind='bar')
plt.title('Monthly Sales Trend')
plt.xlabel('Month')
plt.ylabel('Sales Amount (¥)')
plt.savefig('monthly_sales.png')
```

💡 推奨事項

1. **在庫管理の最適化**
   12月の需要増に備え、11月から在庫を増強

2. **地方都市へのマーケティング強化**
   高成長地域へのリソース配分を増加

3. **夏季キャンペーンの実施**
   売上低迷期の7-8月にプロモーション実施

🔮 次のステップ

1. 顧客セグメンテーション分析
2. リピート率の調査
3. 予測モデルの構築（来年度売上予測）
```

### 例4: セキュリティ監査

#### AGENT.md

```markdown
---
name: security-auditor
description: コードとインフラのセキュリティ脆弱性を検出し、修正案を提供する
model: claude-sonnet-4-5-20250929
temperature: 0.1
tools:
  - Read
  - Grep
  - Glob
  - Bash
---

# セキュリティ監査エージェント

あなたはサイバーセキュリティの専門家です。OWASP Top 10とセキュアコーディングのベストプラクティスに基づいて、徹底的なセキュリティ監査を実施してください。

## 監査スコープ

### 1. OWASP Top 10 (2021)
- A01: アクセス制御の不備
- A02: 暗号化の失敗
- A03: インジェクション
- A04: 安全でない設計
- A05: セキュリティの設定ミス
- A06: 脆弱で古くなったコンポーネント
- A07: 識別と認証の失敗
- A08: ソフトウェアとデータの整合性の不具合
- A09: セキュリティログとモニタリングの失敗
- A10: サーバーサイドリクエストフォージェリ (SSRF)

### 2. コードレベルの脆弱性
- SQL/NoSQLインジェクション
- クロスサイトスクリプティング (XSS)
- クロスサイトリクエストフォージェリ (CSRF)
- パストラバーサル
- コマンドインジェクション
- XXE (XML External Entity)
- デシリアライゼーション攻撃

### 3. インフラとデプロイ
- 環境変数の適切な管理
- 機密情報のハードコード
- 依存パッケージの脆弱性
- TLS/SSL設定
- CORS設定

### 4. 認証・認可
- パスワードポリシー
- セッション管理
- トークン管理（JWT等）
- 多要素認証の実装

## 検査手順

### フェーズ1: 静的解析
```bash
# 機密情報の検索
grep -r "password\s*=\s*['\"]" .
grep -r "api_key\s*=\s*['\"]" .

# 危険な関数の使用
grep -r "eval(" .
grep -r "dangerouslySetInnerHTML" .
```

### フェーズ2: 依存関係チェック
```bash
npm audit
npm outdated
```

### フェーズ3: 設定ファイルレビュー
- .env.example の存在確認
- .gitignore の設定
- セキュリティヘッダー

## 出力フォーマット

### 🔴 Critical（即座に対応必須）
**脆弱性タイプ: [OWASP A0X]**
- ファイル: [ファイル名:行番号]
- 問題: [詳細]
- 影響: [攻撃シナリオ]
- 修正方法: [コード例]

### 🟠 High（優先対応）
[同上]

### 🟡 Medium（計画的に対応）
[同上]

### 🟢 Low（改善推奨）
[同上]

### ✅ セキュアな実装
[良い実装例]

### 📋 チェックリスト
- [ ] 依存パッケージの更新
- [ ] 環境変数の見直し
- [ ] セキュリティヘッダーの設定
```

#### 使用方法

```
あなた: このAPIエンドポイントのセキュリティをチェックしてください

Security Auditor: セキュリティ監査結果をお伝えします。

🔴 Critical（即座に対応必須）

**脆弱性タイプ: SQLインジェクション [OWASP A03]**

ファイル: src/api/users.ts:45
```ts
// 危険なコード
const query = `SELECT * FROM users WHERE id = ${userId}`;
db.query(query);
```

問題: ユーザー入力を直接SQL文に埋め込んでいます

影響:
- データベース全体の漏洩
- データの改ざん・削除
- システム乗っ取りの可能性

修正方法:
```ts
// プリペアドステートメントを使用
const query = 'SELECT * FROM users WHERE id = ?';
db.query(query, [userId]);

// またはORMを使用
const user = await User.findByPk(userId);
```

🟠 High（優先対応）

**脆弱性タイプ: 機密情報のハードコード [OWASP A05]**

ファイル: src/config/database.ts:12
```ts
const dbPassword = "MyP@ssw0rd123";  // ❌
```

修正方法:
```ts
const dbPassword = process.env.DB_PASSWORD;  // ✅

// .env.example を作成
// DB_PASSWORD=your_password_here
```

🟡 Medium（計画的に対応）

**脆弱性タイプ: XSS [OWASP A03]**

ファイル: src/components/Comment.tsx:34
```tsx
<div dangerouslySetInnerHTML={{ __html: userComment }} />
```

修正方法:
```tsx
import DOMPurify from 'dompurify';

<div dangerouslySetInnerHTML={{
  __html: DOMPurify.sanitize(userComment)
}} />
```

📋 チェックリスト

- [x] SQLインジェクション対策
- [ ] XSS対策の完全実施
- [ ] CSRF トークンの実装
- [ ] セキュリティヘッダーの設定
- [ ] 依存パッケージの更新（3件の脆弱性あり）
```

### 例5: ドキュメンテーションライター

#### AGENT.md

```markdown
---
name: doc-writer
description: 技術ドキュメント、README、APIドキュメントを作成・改善する
model: claude-sonnet-4-5-20250929
temperature: 0.6
tools:
  - Read
  - Write
  - Grep
  - Glob
---

# ドキュメンテーションエージェント

あなたはテクニカルライターの専門家です。明確で、包括的で、ユーザーフレンドリーなドキュメントを作成してください。

## ドキュメント作成の原則

### 1. 読者を理解する
- 対象読者のスキルレベル
- 読者が解決したい問題
- 期待される予備知識

### 2. 明確な構造
- 論理的な情報の流れ
- 適切な見出し階層
- 目次とナビゲーション

### 3. 実践的な例
- 動作するコード例
- ユースケースの説明
- トラブルシューティング

### 4. 一貫性
- 用語の統一
- フォーマットの統一
- トーンの統一

## ドキュメントの種類

### README.md
- プロジェクト概要
- クイックスタート
- インストール手順
- 基本的な使用例
- ライセンス情報

### API ドキュメント
- エンドポイント一覧
- リクエスト/レスポンス形式
- 認証方法
- エラーコード
- レート制限

### チュートリアル
- ステップバイステップのガイド
- スクリーンショット付き
- 各ステップの説明
- よくあるエラーと対処法

### リファレンス
- 完全な関数/クラス一覧
- パラメータの詳細
- 戻り値の説明
- 使用例

## スタイルガイド

### 見出し
- H1: ドキュメントタイトル
- H2: メインセクション
- H3: サブセクション
- H4以下: 詳細項目

### コードブロック
```language
// 言語を明示
// コメントで説明
// 動作するコード
```

### 箇条書き
- 並列な項目に使用
- 簡潔に
- 統一された形式

### 注意喚起
⚠️ 警告
💡 ヒント
📝 注記
✅ ベストプラクティス

## 出力フォーマット

### ドキュメントの構造
1. タイトルと概要
2. 目次（長いドキュメントの場合）
3. 前提条件
4. メインコンテンツ
5. 関連リソース
6. FAQまたはトラブルシューティング

### 品質チェックリスト
- [ ] スペルチェック完了
- [ ] コード例の動作確認
- [ ] リンクの有効性確認
- [ ] 用語の一貫性確認
- [ ] 読みやすさの確認
```

#### 使用方法

```
あなた: このReactフックライブラリのREADMEを作成してください

Doc Writer: useLocalStorageフックのREADMEを作成しました。

# useLocalStorage

React用のタイプセーフなlocalStorage永続化フック

## 概要

`useLocalStorage`は、Reactの状態をlocalStorageと自動的に同期するカスタムフックです。TypeScript完全対応で、型安全な状態管理を提供します。

## 特徴

✅ TypeScript完全対応
✅ 自動的なシリアライゼーション/デシリアライゼーション
✅ SSR対応（サーバーサイドレンダリングで安全）
✅ エラーハンドリング内蔵
✅ 軽量（1KB未満）

## インストール

```bash
npm install @your-org/use-local-storage
```

## 基本的な使い方

```tsx
import { useLocalStorage } from '@your-org/use-local-storage';

function App() {
  const [name, setName] = useLocalStorage<string>('username', 'Guest');

  return (
    <div>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <p>Hello, {name}!</p>
    </div>
  );
}
```

## API リファレンス

### useLocalStorage<T>(key, initialValue)

#### パラメータ

| パラメータ | 型 | 説明 |
|-----------|-----|------|
| `key` | `string` | localStorageのキー |
| `initialValue` | `T` | 初期値（キーが存在しない場合） |

#### 戻り値

`[value, setValue, remove]`

- `value: T` - 現在の値
- `setValue: (value: T) => void` - 値を更新する関数
- `remove: () => void` - localStorageから削除する関数

## 高度な使用例

### オブジェクトの保存

```tsx
interface UserSettings {
  theme: 'light' | 'dark';
  fontSize: number;
  notifications: boolean;
}

const [settings, setSettings] = useLocalStorage<UserSettings>(
  'user-settings',
  {
    theme: 'light',
    fontSize: 14,
    notifications: true,
  }
);

// 一部のプロパティのみ更新
setSettings({
  ...settings,
  theme: 'dark',
});
```

### 配列の管理

```tsx
const [todos, setTodos] = useLocalStorage<string[]>('todos', []);

// 追加
setTodos([...todos, 'New task']);

// 削除
setTodos(todos.filter(todo => todo !== 'Task to remove'));
```

## エラーハンドリング

localStorageが利用できない環境では、メモリ上の状態として動作します：

```tsx
// localStorageが無効でも動作します
const [value, setValue] = useLocalStorage('key', 'default');
```

## トラブルシューティング

### Q: 値が保存されない

A: ブラウザのlocalStorageが有効か確認してください：
```js
// デベロッパーコンソールで実行
localStorage.setItem('test', 'test');
console.log(localStorage.getItem('test'));
```

### Q: TypeScriptの型エラーが出る

A: ジェネリック型を明示的に指定してください：
```tsx
const [value, setValue] = useLocalStorage<YourType>('key', defaultValue);
```

## ライセンス

MIT © Your Organization

## 関連リソース

- [API ドキュメント](./docs/API.md)
- [サンプル集](./examples)
- [Changelog](./CHANGELOG.md)
```

### 例6: テストエンジニア

#### AGENT.md

```markdown
---
name: test-engineer
description: ユニットテスト、統合テスト、E2Eテストを作成し、テストカバレッジを向上させる
model: claude-sonnet-4-5-20250929
temperature: 0.3
tools:
  - Read
  - Write
  - Grep
  - Glob
  - Bash
---

# テストエンジニアエージェント

あなたはテスト自動化の専門家です。包括的で保守性の高いテストを作成し、コード品質を向上させてください。

## テスト戦略

### テストピラミッド
```
        /\
       /E2E\
      /------\
     /Integration\
    /--------------\
   /  Unit Tests    \
  /------------------\
```

### 1. ユニットテスト（70%）
- 個別の関数/メソッド
- モックとスタブを活用
- 高速実行
- 独立性

### 2. 統合テスト（20%）
- コンポーネント間の連携
- API連携
- データベース操作
- 実際の依存関係

### 3. E2Eテスト（10%）
- ユーザーシナリオ
- ブラウザ自動化
- クリティカルパス
- スモークテスト

## テスト設計原則

### FIRST原則
- **Fast**: 高速に実行
- **Independent**: 独立して実行可能
- **Repeatable**: 再現可能
- **Self-validating**: 自己検証
- **Timely**: タイムリーに作成

### AAA パターン
```typescript
test('description', () => {
  // Arrange: 準備
  const input = setupTestData();

  // Act: 実行
  const result = functionUnderTest(input);

  // Assert: 検証
  expect(result).toBe(expectedValue);
});
```

## テストの種類

### ユニットテスト（Vitest/Jest）

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { myFunction } from './myModule';

describe('myFunction', () => {
  beforeEach(() => {
    // 各テスト前の準備
  });

  it('should handle valid input', () => {
    expect(myFunction('valid')).toBe('expected');
  });

  it('should throw error for invalid input', () => {
    expect(() => myFunction('invalid')).toThrow();
  });
});
```

### Reactコンポーネントテスト

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserForm } from './UserForm';

describe('UserForm', () => {
  it('should submit form with valid data', async () => {
    const onSubmit = vi.fn();
    render(<UserForm onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText('Name'), 'John');
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(onSubmit).toHaveBeenCalledWith({ name: 'John' });
  });
});
```

### E2Eテスト（Playwright）

```typescript
import { test, expect } from '@playwright/test';

test('user can complete registration', async ({ page }) => {
  await page.goto('/register');
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'Password123!');
  await page.click('button[type="submit"]');

  await expect(page).toHaveURL('/dashboard');
  await expect(page.locator('text=Welcome')).toBeVisible();
});
```

## カバレッジ目標

- **Statements**: 80%以上
- **Branches**: 75%以上
- **Functions**: 80%以上
- **Lines**: 80%以上

## 出力フォーマット

### テストファイル構造

```typescript
// [ComponentName].test.tsx

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('[ComponentName]', () => {
  // セットアップ
  beforeEach(() => {});
  afterEach(() => {});

  describe('[機能1]', () => {
    it('should [期待される動作]', () => {});
    it('should [エッジケース]', () => {});
  });

  describe('[機能2]', () => {
    // ...
  });
});
```

### テストレポート

```
✅ 作成したテスト
- ファイル名
- カバレッジ: XX%
- テストケース数: X件

📋 テストケース詳細
1. [ケース名] - 正常系
2. [ケース名] - 異常系
3. [ケース名] - エッジケース

🔍 カバーされていない箇所
- [ファイル名:行番号]: [理由]

💡 改善提案
- [提案1]
- [提案2]
```
```

#### 使用方法

```
あなた: UserCard コンポーネントのテストを作成してください

Test Engineer: UserCard.test.tsxを作成しました。

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserCard } from './UserCard';
import type { User } from '../../types/user';

describe('UserCard', () => {
  const mockUser: User = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    age: 30,
  };

  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('表示機能', () => {
    it('should display user information', () => {
      render(
        <UserCard
          user={mockUser}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
      expect(screen.getByText('30')).toBeInTheDocument();
    });

    it('should show edit and delete buttons', () => {
      render(
        <UserCard
          user={mockUser}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
    });
  });

  describe('編集機能', () => {
    it('should call onEdit when edit button is clicked', async () => {
      render(
        <UserCard
          user={mockUser}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      await userEvent.click(screen.getByRole('button', { name: /edit/i }));

      expect(mockOnEdit).toHaveBeenCalledTimes(1);
      expect(mockOnEdit).toHaveBeenCalledWith(mockUser);
    });

    it('should enter edit mode and show input fields', async () => {
      render(
        <UserCard
          user={mockUser}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      await userEvent.click(screen.getByRole('button', { name: /edit/i }));

      expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
      expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument();
    });
  });

  describe('削除機能', () => {
    it('should show confirmation dialog before delete', async () => {
      window.confirm = vi.fn(() => false);

      render(
        <UserCard
          user={mockUser}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      await userEvent.click(screen.getByRole('button', { name: /delete/i }));

      expect(window.confirm).toHaveBeenCalledWith(
        'Are you sure you want to delete this user?'
      );
      expect(mockOnDelete).not.toHaveBeenCalled();
    });

    it('should call onDelete when confirmed', async () => {
      window.confirm = vi.fn(() => true);

      render(
        <UserCard
          user={mockUser}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      await userEvent.click(screen.getByRole('button', { name: /delete/i }));

      expect(mockOnDelete).toHaveBeenCalledTimes(1);
      expect(mockOnDelete).toHaveBeenCalledWith(mockUser.id);
    });
  });

  describe('エッジケース', () => {
    it('should handle missing optional fields', () => {
      const userWithoutAge = { ...mockUser, age: undefined };

      render(
        <UserCard
          user={userWithoutAge}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.queryByText('30')).not.toBeInTheDocument();
    });

    it('should disable buttons while loading', () => {
      render(
        <UserCard
          user={mockUser}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          isLoading={true}
        />
      );

      expect(screen.getByRole('button', { name: /edit/i })).toBeDisabled();
      expect(screen.getByRole('button', { name: /delete/i })).toBeDisabled();
    });
  });
});
```

✅ 作成したテスト
- ファイル名: UserCard.test.tsx
- カバレッジ: 95%
- テストケース数: 8件

📋 テストケース詳細
1. ユーザー情報の表示 - 正常系
2. ボタンの表示 - 正常系
3. 編集ボタンのクリック - 正常系
4. 編集モードへの移行 - 正常系
5. 削除確認ダイアログ - キャンセル
6. 削除実行 - 確認
7. オプションフィールドの欠如 - エッジケース
8. ローディング中のボタン無効化 - エッジケース

🔍 カバーされていない箇所
- UserCard.tsx:85: エラーハンドリング（ネットワークエラー時）
  → 推奨: ネットワークエラーのモックを追加

💡 改善提案
1. エラーバウンダリのテスト追加
2. アクセシビリティテスト（aria-label等）
3. スナップショットテストの追加
```

---

## 設計のベストプラクティス

### 1. 単一責任の原則

各Subagentは明確な責務を持つべきです：

```
❌ 悪い例: "general-helper"
   - コードレビュー
   - バグ修正
   - ドキュメント作成
   - デプロイ

✅ 良い例:
   - "code-reviewer": コードレビューのみ
   - "debugger": バグ調査と修正
   - "doc-writer": ドキュメント作成
   - "deployer": デプロイメント
```

### 2. 明確で具体的な説明

`description`フィールドは自動委譲の鍵となります：

```yaml
# ❌ 悪い例
description: コードをチェックする

# ✅ 良い例
description: TypeScript/React/Node.jsのコードレビューを実施し、型安全性、パフォーマンス、セキュリティの観点から改善提案を行う
```

### 3. 適切なツール制限

最小権限の原則に従いましょう：

```yaml
# ❌ 読み取り専用タスクに不要
tools:
  - Read
  - Write  # 不要
  - Edit   # 不要
  - Bash   # 危険

# ✅ 必要最小限
tools:
  - Read
  - Grep
  - Glob
```

### 4. コンテキストに適したTemperature

タスクの性質に応じて調整：

```yaml
# コードレビュー、バグ修正（決定論的）
temperature: 0.0 - 0.2

# ドキュメント作成、説明（バランス）
temperature: 0.4 - 0.6

# ブレインストーミング、アイデア出し（創造的）
temperature: 0.7 - 0.9
```

### 5. 段階的な詳細化

システムプロンプトは構造化された形式で：

```markdown
# 役割定義
[何をするエージェントか]

## スコープ
### 実施すること
- [タスク1]
- [タスク2]

### 実施しないこと
- [範囲外1]
- [範囲外2]

## 評価基準
[具体的な基準]

## 出力フォーマット
[期待される形式]
```

### 6. バージョン管理

Subagentの変更履歴を記録：

```markdown
---
name: code-reviewer
version: 2.1.0
updated: 2024-03-15
---

<!-- 変更履歴 -->
## Changelog

### v2.1.0 (2024-03-15)
- React Hooksのレビュー基準を追加
- パフォーマンスチェックを強化

### v2.0.0 (2024-02-01)
- TypeScript 5.0対応
- 新しいESLintルールに対応
```

### 7. テストとバリデーション

Subagentを本番投入前にテスト：

```bash
# テストスクリプト
cat > test-agent.sh << 'EOF'
#!/bin/bash

echo "Testing code-reviewer agent..."

# テストケース1: 簡単なレビュー
echo "Test 1: Simple review"
echo "@code-reviewer src/utils/validation.ts をレビューして" | claude

# テストケース2: エラーハンドリング
echo "Test 2: Error handling"
echo "@code-reviewer 存在しないファイルをレビューして" | claude

echo "Tests completed"
EOF

chmod +x test-agent.sh
./test-agent.sh
```

### 8. ドキュメント化

各Subagentにドキュメントを付与：

```markdown
# Code Reviewer Agent

## 概要
このエージェントは、TypeScript/React/Node.jsコードベースのレビューを実施します。

## 使用方法
```
@code-reviewer [ファイル名] をレビューして
```

## 評価基準
- 型安全性
- パフォーマンス
- セキュリティ
- テスタビリティ
- 保守性

## 出力例
[スクリーンショットまたは例]

## よくある質問
Q: 複数ファイルを一度にレビューできますか？
A: はい、ディレクトリを指定してください。

## 更新履歴
[バージョン履歴]
```

---

## チームでの共有方法

### 1. プロジェクトリポジトリに含める

```bash
# ディレクトリ構造
.claude/
├── agents/
│   ├── code-reviewer/
│   │   ├── AGENT.md
│   │   └── README.md
│   ├── debugger/
│   │   ├── AGENT.md
│   │   └── README.md
│   └── README.md  # エージェント一覧と使い方
├── commands/
└── skills/

# .gitignoreに含めない
# .claude/ ディレクトリをコミット
```

### 2. チーム標準の確立

プロジェクトルートにガイドラインを作成：

```markdown
# .claude/agents/README.md

## チームエージェント一覧

### code-reviewer
**用途**: コードレビューの自動化
**使用方法**: `@code-reviewer [ファイル] をレビュー`
**担当者**: @developer1

### debugger
**用途**: バグの調査と修正
**使用方法**: `@debugger [エラー内容] を調査`
**担当者**: @developer2

## エージェント作成ガイドライン

1. 単一責任の原則に従う
2. 明確な説明を記述
3. 必要最小限のツールのみ付与
4. バージョン管理を行う
5. テストしてからコミット

## 新規エージェントの追加手順

1. `/agents` コマンドで作成
2. テストを実施
3. README.mdに追加
4. プルリクエストを作成
5. チームレビュー後にマージ
```

### 3. CI/CDでのバリデーション

エージェント設定の検証を自動化：

```yaml
# .github/workflows/validate-agents.yml
name: Validate Agents

on:
  pull_request:
    paths:
      - '.claude/agents/**'

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Validate AGENT.md files
        run: |
          # YAMLフロントマターの検証
          for file in .claude/agents/*/AGENT.md; do
            echo "Validating $file"

            # 必須フィールドの確認
            grep -q "^name:" "$file" || {
              echo "Error: 'name' field missing in $file"
              exit 1
            }

            grep -q "^description:" "$file" || {
              echo "Error: 'description' field missing in $file"
              exit 1
            }
          done

      - name: Check for README
        run: |
          for dir in .claude/agents/*/; do
            if [ ! -f "${dir}README.md" ]; then
              echo "Warning: README.md missing in $dir"
            fi
          done
```

### 4. ドキュメントの集約

チーム向けの統合ドキュメント：

```bash
# スクリプトでエージェント一覧を自動生成
cat > .claude/generate-agent-docs.sh << 'EOF'
#!/bin/bash

echo "# Available Agents" > .claude/agents/AGENTS.md
echo "" >> .claude/agents/AGENTS.md

for agent_dir in .claude/agents/*/; do
  if [ -f "${agent_dir}AGENT.md" ]; then
    name=$(grep "^name:" "${agent_dir}AGENT.md" | cut -d: -f2 | xargs)
    desc=$(grep "^description:" "${agent_dir}AGENT.md" | cut -d: -f2 | xargs)

    echo "## $name" >> .claude/agents/AGENTS.md
    echo "$desc" >> .claude/agents/AGENTS.md
    echo "" >> .claude/agents/AGENTS.md
  fi
done
EOF

chmod +x .claude/generate-agent-docs.sh
```

### 5. オンボーディング資料

新メンバー向けのガイド：

```markdown
# Subagents 使い方ガイド

## クイックスタート

### 1. エージェント一覧の確認
```bash
/agents
# または
ls .claude/agents/
```

### 2. エージェントの使用
```
# 手動起動
@code-reviewer src/components/UserForm.tsx をレビューして

# 自動委譲（タスクを伝えるだけ）
このコンポーネントの問題点を教えて
```

### 3. 新規エージェントの作成
```bash
/agents
# 2. Create a new agent を選択
```

## よく使うエージェント

1. **code-reviewer**: コードレビュー
2. **debugger**: バグ調査
3. **test-engineer**: テスト作成
4. **doc-writer**: ドキュメント作成

## 詳細ドキュメント
各エージェントの詳細は `.claude/agents/[名前]/README.md` を参照
```

### 6. ナレッジ共有

チーム内でベストプラクティスを共有：

```markdown
# .claude/agents/BEST_PRACTICES.md

## 成功事例

### Case 1: コードレビューの効率化
**Before**: 手動レビューに平均2時間
**After**: code-reviewerで30分に短縮

**設定のポイント**:
- プロジェクト固有のルールをプロンプトに含める
- 過去のレビューコメントを学習データとして活用

### Case 2: バグ修正の高速化
**Before**: 原因特定に平均1時間
**After**: debuggerで15分に短縮

**設定のポイント**:
- ログファイルへのアクセスを許可
- プロジェクトのアーキテクチャ情報を含める

## アンチパターン

### ❌ 汎用的すぎるエージェント
問題: "helper"という名前で何でもやらせる
解決: 責務ごとに分離

### ❌ 過度なツール権限
問題: 読み取り専用タスクにWrite権限
解決: 最小権限の原則

### ❌ 不明瞭な説明
問題: description が "コードをチェック"
解決: 具体的な責務と対象を明記
```

---

## トラブルシューティング

### 問題1: Subagentが起動しない

**症状:**
```
エラー: Agent 'my-agent' not found
```

**原因と解決:**

#### 1. ファイル名の確認
```bash
# 確認
ls .claude/agents/my-agent/

# 正しいファイル名
AGENT.md  # ✅
agent.md  # ❌（小文字はNG）
Agent.md  # ❌（大文字小文字が違う）
```

#### 2. YAMLフロントマターの検証
```yaml
---
name: my-agent  # ✅ 必須
description: 説明  # ✅ 必須
---

# ❌ 間違った例（ハイフンが足りない）
--
name: my-agent
--

# ❌ 間違った例（閉じハイフンがない）
---
name: my-agent
description: 説明
```

#### 3. パスの確認
```bash
# プロジェクトレベル
.claude/agents/my-agent/AGENT.md  # ✅

# ユーザーレベル
~/.claude/agents/my-agent/AGENT.md  # ✅

# 間違った場所
.claude/my-agent/AGENT.md  # ❌
agents/my-agent/AGENT.md   # ❌
```

### 問題2: 自動委譲が機能しない

**症状:**
Subagentが自動的に起動されず、メインセッションで処理される

**原因と解決:**

#### 1. Description が不明確
```yaml
# ❌ 悪い例
description: コードを確認する

# ✅ 良い例
description: TypeScript/Reactコードのレビューを実施し、型安全性、パフォーマンス、セキュリティの観点から詳細な改善提案を行う。SOLID原則、Reactベストプラクティス、アクセシビリティ基準に基づく評価を提供
```

#### 2. タスクの伝え方
```
# ❌ 曖昧な依頼
このコードを見て

# ✅ 明確な依頼
このTypeScriptコンポーネントをレビューして、型定義とReactフックの使い方について改善提案をください
```

#### 3. 手動起動で確認
```
# まず手動起動で動作確認
@my-agent [タスク内容]

# 動作すれば、自動委譲の設定を調整
```

### 問題3: ツールへのアクセスエラー

**症状:**
```
エラー: Tool 'Write' is not available for this agent
```

**原因と解決:**

#### 1. ツールリストの確認
```yaml
---
tools:
  - Read
  - Grep
  # Write が含まれていない！
---
```

**修正:**
```yaml
---
tools:
  - Read
  - Write  # 追加
  - Grep
---
```

#### 2. タイポの確認
```yaml
# ❌ 間違い
tools:
  - read  # 小文字
  - GREP  # 全て大文字

# ✅ 正しい
tools:
  - Read  # 最初だけ大文字
  - Grep
```

### 問題4: モデルの選択エラー

**症状:**
```
エラー: Invalid model specified
```

**原因と解決:**

```yaml
# ❌ 間違ったモデル名
model: claude-4-sonnet  # 存在しない

# ✅ 正しいモデル名
model: claude-sonnet-4-5-20250929

# または省略（デフォルト使用）
# model: フィールドを削除
```

**利用可能なモデル:**
- `claude-sonnet-4-5-20250929` (推奨)
- `claude-haiku-4-20250514` (高速・低コスト)

### 問題5: Temperature設定エラー

**症状:**
予想外の出力や一貫性のない結果

**原因と解決:**

```yaml
# ❌ 範囲外の値
temperature: 1.5  # 1.0を超えている
temperature: -0.1  # 負の値

# ✅ 正しい範囲
temperature: 0.0  # 最も決定論的
temperature: 0.5  # バランス
temperature: 1.0  # 最も創造的

# タスク別の推奨値
temperature: 0.1  # コードレビュー、バグ修正
temperature: 0.5  # 一般的なタスク
temperature: 0.8  # ドキュメント作成、アイデア出し
```

### 問題6: コンテキストオーバーフロー

**症状:**
```
エラー: Context limit exceeded
```

**原因と解決:**

#### 1. Max_tokensの調整
```yaml
# ❌ 大きすぎる
max_tokens: 200000

# ✅ タスクに応じた適切な値
max_tokens: 8000   # 通常のレビュー
max_tokens: 16000  # 大規模ファイル
max_tokens: 32000  # 複雑な分析
```

#### 2. 処理の分割
```
# ❌ 一度に全てを処理
全ファイルをレビューして

# ✅ ファイルごとに分割
src/components/UserForm.tsx をレビューして
次に src/components/UserCard.tsx をレビューして
```

### 問題7: 権限エラー

**症状:**
```
エラー: Permission denied
```

**原因と解決:**

#### 1. ファイル権限の確認
```bash
# 確認
ls -la .claude/agents/my-agent/AGENT.md

# 修正（読み取り権限を付与）
chmod 644 .claude/agents/my-agent/AGENT.md
```

#### 2. ディレクトリ権限
```bash
# 確認
ls -la .claude/agents/

# 修正
chmod 755 .claude/agents/my-agent/
```

### デバッグのベストプラクティス

#### 1. ログの確認

```bash
# Claude Codeのログを確認
claude --verbose

# または環境変数で詳細ログ
export CLAUDE_DEBUG=1
claude
```

#### 2. シンプルなテストから始める

```markdown
---
name: test-agent
description: テスト用の最小エージェント
tools:
  - Read
---

# Test Agent
テスト用の最小限のエージェントです。
```

#### 3. 段階的に機能追加

```
1. 最小構成で動作確認
2. ツールを1つずつ追加
3. システムプロンプトを充実
4. Temperature等の最適化
```

#### 4. エラーメッセージの活用

```
エラーメッセージから判断:
- "not found" → パスやファイル名の問題
- "not available" → ツール設定の問題
- "invalid" → YAML形式や値の問題
- "permission denied" → ファイル権限の問題
```

---

## まとめ

Subagentsは、Claude Codeの能力を特定のドメインやタスクに特化させる強力な機能です。

### 主要なポイント

✅ **専門化**: 各タスクに最適化されたエージェント
✅ **独立性**: 分離されたコンテキストで効率的に動作
✅ **再利用性**: 一度作成すれば繰り返し使用可能
✅ **チーム共有**: プロジェクトで標準化されたワークフロー
✅ **セキュリティ**: 最小権限の原則による安全な運用

### 次のステップ

1. **簡単なSubagentから始める**
   - コードレビューアーやドキュメントライターなど

2. **チームで共有**
   - プロジェクトリポジトリにコミット
   - ベストプラクティスを文書化

3. **継続的な改善**
   - フィードバックを収集
   - 定期的にプロンプトを最適化

4. **高度な活用**
   - 複数エージェントの連携
   - プロジェクト固有のワークフロー自動化

### 関連ドキュメント

- [Skills基礎ガイド](./04-skills-basics.md) - 自動化モジュールの作成
- [Skills実践ガイド](./05-skills-custom.md) - カスタムSkillsの開発
- [Hooks基礎ガイド](./06-hooks-basics.md) - ワークフロー自動化
- [MCP基礎](./01-mcp-basics.md) - 外部ツール統合

---

`#中級者` `#Subagents` `#自動化` `#ワークフロー` `#チーム開発` `#コードレビュー` `#専門化` `#タスク委譲`
