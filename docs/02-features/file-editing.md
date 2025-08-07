# ファイル編集機能

Claude Codeの既存コード編集機能について詳しく説明します。既存コードの修正・リファクタリング手法を学習することで、効率的にコードベースを改善できます。

## ファイル編集機能とは

ファイル編集機能は、既存のコードファイルを理解し、適切な修正・改善を行う機能です。単純な文字列置換ではなく、コードの構造と意味を理解した上で、安全で効果的な編集を実行します。

### 主な特徴

- **コンテキスト理解**: 既存コードの構造と意図を理解
- **安全な編集**: 既存の機能を壊さない修正
- **段階的改善**: 小さな変更から大規模なリファクタリングまで
- **一貫性維持**: プロジェクト全体のコーディングスタイルを保持

## 編集の種類

### 1. 機能追加

既存のコードに新しい機能を追加します。

**例: React コンポーネントに新機能追加**

**既存コード:**
```typescript
interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle }) => {
  return (
    <div className="todo-item">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <span className={todo.completed ? 'completed' : ''}>
        {todo.text}
      </span>
    </div>
  );
};
```

**プロンプト:**
```
このTodoItemコンポーネントに以下の機能を追加してください:
1. 編集機能（ダブルクリックで編集モード）
2. 削除ボタン
3. 優先度表示（high, medium, low）
```

**編集後のコード:**
```typescript
interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
  onDelete: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ 
  todo, 
  onToggle, 
  onEdit, 
  onDelete 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleEdit = () => {
    if (isEditing && editText.trim() !== todo.text) {
      onEdit(todo.id, editText.trim());
    }
    setIsEditing(!isEditing);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEdit();
    } else if (e.key === 'Escape') {
      setEditText(todo.text);
      setIsEditing(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ff4757';
      case 'medium': return '#ffa502';
      case 'low': return '#2ed573';
      default: return '#747d8c';
    }
  };

  return (
    <div className="todo-item">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      
      <div 
        className="priority-indicator"
        style={{ backgroundColor: getPriorityColor(todo.priority) }}
        title={`優先度: ${todo.priority}`}
      />
      
      {isEditing ? (
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleEdit}
          onKeyPress={handleKeyPress}
          className="edit-input"
          autoFocus
        />
      ) : (
        <span 
          className={todo.completed ? 'completed' : ''}
          onDoubleClick={() => setIsEditing(true)}
          title="ダブルクリックで編集"
        >
          {todo.text}
        </span>
      )}
      
      <button
        onClick={() => onDelete(todo.id)}
        className="delete-button"
        aria-label="削除"
      >
        ×
      </button>
    </div>
  );
};
```

### 2. バグ修正

既存コードのバグを特定し、修正します。

**例: メモリリークの修正**

**既存コード（問題あり）:**
```typescript
const useTimer = (interval: number) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount(prev => prev + 1);
    }, interval);
    
    // クリーンアップが不完全
    return () => clearInterval(timer);
  }, []); // 依存配列が不適切

  return count;
};
```

**プロンプト:**
```
このuseTimerフックにメモリリークの問題があります。
問題を特定して修正してください。
```

**修正後のコード:**
```typescript
const useTimer = (interval: number) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount(prev => prev + 1);
    }, interval);
    
    // 適切なクリーンアップ
    return () => {
      clearInterval(timer);
    };
  }, [interval]); // 依存配列を修正

  return count;
};
```

### 3. リファクタリング

コードの構造を改善し、保守性を向上させます。

**例: 複雑な関数の分割**

**既存コード:**
```typescript
const processUserData = (users: User[]) => {
  const result = [];
  
  for (const user of users) {
    if (user.age >= 18 && user.status === 'active') {
      const fullName = user.firstName + ' ' + user.lastName;
      const email = user.email.toLowerCase();
      const score = user.purchases.reduce((sum, purchase) => {
        return sum + purchase.amount * 0.1;
      }, 0);
      
      if (score > 100) {
        result.push({
          id: user.id,
          name: fullName,
          email: email,
          score: Math.round(score),
          tier: score > 500 ? 'gold' : score > 200 ? 'silver' : 'bronze'
        });
      }
    }
  }
  
  return result.sort((a, b) => b.score - a.score);
};
```

**プロンプト:**
```
この関数は複雑すぎます。以下の観点でリファクタリングしてください:
1. 単一責任の原則に従って関数を分割
2. 可読性の向上
3. テストしやすい構造
4. 型安全性の向上
```

**リファクタリング後:**
```typescript
// 型定義
interface ProcessedUser {
  id: string;
  name: string;
  email: string;
  score: number;
  tier: 'gold' | 'silver' | 'bronze';
}

// ヘルパー関数群
const isEligibleUser = (user: User): boolean => {
  return user.age >= 18 && user.status === 'active';
};

const formatFullName = (user: User): string => {
  return `${user.firstName} ${user.lastName}`;
};

const normalizeEmail = (email: string): string => {
  return email.toLowerCase();
};

const calculateUserScore = (purchases: Purchase[]): number => {
  return purchases.reduce((sum, purchase) => sum + purchase.amount * 0.1, 0);
};

const determineUserTier = (score: number): 'gold' | 'silver' | 'bronze' => {
  if (score > 500) return 'gold';
  if (score > 200) return 'silver';
  return 'bronze';
};

const transformUser = (user: User): ProcessedUser | null => {
  if (!isEligibleUser(user)) {
    return null;
  }

  const score = calculateUserScore(user.purchases);
  
  if (score <= 100) {
    return null;
  }

  return {
    id: user.id,
    name: formatFullName(user),
    email: normalizeEmail(user.email),
    score: Math.round(score),
    tier: determineUserTier(score)
  };
};

const sortByScore = (users: ProcessedUser[]): ProcessedUser[] => {
  return users.sort((a, b) => b.score - a.score);
};

// メイン関数
const processUserData = (users: User[]): ProcessedUser[] => {
  const processedUsers = users
    .map(transformUser)
    .filter((user): user is ProcessedUser => user !== null);
    
  return sortByScore(processedUsers);
};
```

## 高度な編集テクニック

### 1. パターンベースの編集

**プロンプト:**
```
以下のコードをObserverパターンに変更してください:

現在のコード:
[既存のコードを貼り付け]

要件:
- イベントの購読/配信機能
- 型安全性の確保
- メモリリーク防止
```

### 2. パフォーマンス最適化

**プロンプト:**
```
このReactコンポーネントのパフォーマンスを最適化してください:

問題点:
- 不要な再レンダリング
- 重い計算の繰り返し実行
- メモリ使用量の増加

最適化手法:
- React.memo
- useMemo
- useCallback
- 仮想化
```

### 3. セキュリティ強化

**プロンプト:**
```
このAPIエンドポイントのセキュリティを強化してください:

現在のコード:
[APIコードを貼り付け]

強化項目:
- 入力値検証
- SQLインジェクション対策
- XSS対策
- レート制限
- 認証・認可
```

## 編集のベストプラクティス

### 1. 段階的な編集

大きな変更は段階的に実行：

```
1. 小さな改善から開始
2. テストで動作確認
3. 次の改善を実施
4. 継続的な検証
```

### 2. 既存テストの活用

```
「既存のテストコードを確認して、
編集後もすべてのテストが通るように修正してください。

既存テスト:
[テストコードを貼り付け]」
```

### 3. 後方互換性の維持

```
「APIの後方互換性を維持しながら、
新しい機能を追加してください。

既存のAPI仕様:
[API仕様を貼り付け]」
```

## プロジェクトコンテキストの活用

### 大規模プロジェクトでの編集

**プロンプト:**
```
このプロジェクトの構造を理解して、
一貫性を保ちながら機能を追加してください:

プロジェクト構造:
src/
├── components/
├── hooks/
├── services/
├── types/
└── utils/

既存のパターン:
- コンポーネントの命名規約
- フォルダ構造の規則
- 型定義の場所
- エラーハンドリングの方法
```

### 依存関係の管理

**プロンプト:**
```
以下の依存関係を考慮して、
安全にコードを修正してください:

依存関係:
- ComponentA → ComponentB
- ServiceX → ServiceY
- HookA → HookB

修正対象: ComponentB
影響範囲の分析も含めてください。
```

## よくある編集パターン

### 1. 状態管理の改善

```typescript
// Before: 複雑な状態管理
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

// After: useReducerを使用
const [state, dispatch] = useReducer(userReducer, initialState);
```

### 2. エラーハンドリングの統一

```typescript
// Before: 個別のエラーハンドリング
try {
  const result = await apiCall();
  setData(result);
} catch (error) {
  console.error(error);
}

// After: 統一されたエラーハンドリング
const { data, error, loading } = useApiCall(endpoint, {
  onError: handleError,
  onSuccess: handleSuccess
});
```

### 3. 型安全性の向上

```typescript
// Before: any型の使用
const processData = (data: any) => {
  return data.map((item: any) => item.value);
};

// After: 適切な型定義
interface DataItem {
  value: string;
  id: number;
}

const processData = (data: DataItem[]): string[] => {
  return data.map(item => item.value);
};
```

## 次のステップ

ファイル編集機能を理解したら：

1. **[プロジェクトコンテキスト](project-context.md)** - 大規模プロジェクトでの活用
2. **[デバッグサポート](debugging-support.md)** - エラー解決技術
3. **[コードレビュー](code-review.md)** - 品質向上手法

---

**関連ドキュメント:**
- [コード生成](code-generation.md) - 新規コード作成
- [チャットインターフェース](chat-interface.md) - 効果的な指示方法
- [簡単なアプリ作成](../04-quick-tutorial.md) - 実践的なチュートリアル