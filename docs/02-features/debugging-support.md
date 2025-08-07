# デバッグサポート機能

Claude Codeのデバッグサポート機能について詳しく説明します。エラー解析と修正提案の活用方法を学習することで、効率的に問題を解決できます。

## デバッグサポート機能とは

デバッグサポート機能は、コードのエラーや問題を自動的に分析し、根本原因の特定と具体的な修正方法を提案する機能です。単純な構文エラーから複雑なロジックエラーまで、幅広い問題に対応します。

### 主な特徴

- **エラーメッセージの解析**: 複雑なエラーメッセージを分かりやすく説明
- **根本原因の特定**: 表面的な症状ではなく、真の原因を特定
- **修正方法の提案**: 具体的で実行可能な修正手順を提示
- **予防策の提案**: 同様の問題を防ぐためのベストプラクティス

## 対応できるエラーの種類

### 1. 構文エラー（Syntax Errors）

**例: TypeScript構文エラー**

**エラーコード:**
```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

const users: User[] = [
  { id: 1, name: "田中", email: "tanaka@example.com" },
  { id: 2, name: "佐藤", email: "sato@example.com" }
  { id: 3, name: "鈴木", email: "suzuki@example.com" }  // カンマが不足
];
```

**エラーメッセージ:**
```
error TS1005: ',' expected.
```

**プロンプト:**
```
以下のTypeScriptコードでエラーが発生しています：
[エラーメッセージとコードを貼り付け]

エラーの原因と修正方法を教えてください。
```

**Claude Codeの分析:**
```
エラー分析:
- エラーの種類: 構文エラー（カンマ不足）
- 発生箇所: 配列の2番目の要素の後
- 原因: オブジェクトリテラルの区切りカンマが不足

修正方法:
2行目の後にカンマを追加してください。

修正後のコード:
```typescript
const users: User[] = [
  { id: 1, name: "田中", email: "tanaka@example.com" },
  { id: 2, name: "佐藤", email: "sato@example.com" }, // カンマを追加
  { id: 3, name: "鈴木", email: "suzuki@example.com" }
];
```

予防策:
- ESLintやPrettierを使用して自動フォーマット
- エディタの構文ハイライト機能を活用
- 配列やオブジェクトの最後の要素にもカンマを付ける習慣
```

### 2. 型エラー（Type Errors）

**例: TypeScript型エラー**

**エラーコード:**
```typescript
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

const calculateTotal = (products: Product[]): string => {
  return products.reduce((total, product) => {
    return total + product.price;  // 型エラー: string + number
  }, "0");
};
```

**エラーメッセージ:**
```
error TS2365: Operator '+' cannot be applied to types 'string' and 'number'.
```

**Claude Codeの分析:**
```
エラー分析:
- エラーの種類: 型の不整合
- 問題: 初期値が文字列"0"なのに、numberを加算しようとしている
- 戻り値の型: stringと宣言されているが、計算結果はnumberになるべき

修正方法:
1. 初期値を数値の0に変更
2. 戻り値の型をnumberに変更

修正後のコード:
```typescript
const calculateTotal = (products: Product[]): number => {
  return products.reduce((total, product) => {
    return total + product.price;
  }, 0); // 初期値を数値に変更
};
```

または、文字列として返したい場合:
```typescript
const calculateTotal = (products: Product[]): string => {
  const total = products.reduce((sum, product) => {
    return sum + product.price;
  }, 0);
  return total.toString();
};
```
```

### 3. ランタイムエラー（Runtime Errors）

**例: Null参照エラー**

**エラーコード:**
```typescript
const getUserName = (userId: string) => {
  const user = users.find(u => u.id === userId);
  return user.name; // user が undefined の可能性
};
```

**エラーメッセージ:**
```
TypeError: Cannot read property 'name' of undefined
```

**Claude Codeの分析:**
```
エラー分析:
- エラーの種類: Null参照エラー
- 原因: find()メソッドは該当する要素がない場合undefinedを返す
- 問題箇所: undefinedのnameプロパティにアクセスしようとしている

修正方法:
1. Optional Chainingを使用
2. 明示的なnullチェック
3. デフォルト値の提供

修正後のコード（方法1: Optional Chaining）:
```typescript
const getUserName = (userId: string): string | undefined => {
  const user = users.find(u => u.id === userId);
  return user?.name;
};
```

修正後のコード（方法2: 明示的チェック）:
```typescript
const getUserName = (userId: string): string => {
  const user = users.find(u => u.id === userId);
  if (!user) {
    throw new Error(`User with ID ${userId} not found`);
  }
  return user.name;
};
```

修正後のコード（方法3: デフォルト値）:
```typescript
const getUserName = (userId: string): string => {
  const user = users.find(u => u.id === userId);
  return user?.name || "Unknown User";
};
```

予防策:
- TypeScriptの strict モードを有効化
- Optional Chainingの積極的な使用
- 適切なエラーハンドリングの実装
```

### 4. ロジックエラー（Logic Errors）

**例: 無限ループ**

**エラーコード:**
```typescript
const fibonacci = (n: number): number => {
  if (n <= 1) return n;
  
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) {
    const temp = a + b;
    a = b;
    b = temp;
    // i++ が抜けている（無限ループ）
  }
  return b;
};
```

**プロンプト:**
```
このフィボナッチ数列の関数が無限ループになってしまいます。
原因と修正方法を教えてください。

[コードを貼り付け]
```

**Claude Codeの分析:**
```
エラー分析:
- エラーの種類: 無限ループ
- 原因: forループのインクリメント部分でiが更新されていない
- 結果: i <= n の条件が永続的にtrueになる

修正方法:
forループの構文を正しく記述する

修正後のコード:
```typescript
const fibonacci = (n: number): number => {
  if (n <= 1) return n;
  
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) { // i++は自動的に実行される
    const temp = a + b;
    a = b;
    b = temp;
  }
  return b;
};
```

または、より明示的に:
```typescript
const fibonacci = (n: number): number => {
  if (n <= 1) return n;
  
  let a = 0, b = 1;
  let i = 2;
  while (i <= n) {
    const temp = a + b;
    a = b;
    b = temp;
    i++; // 明示的なインクリメント
  }
  return b;
};
```

予防策:
- ループ条件の慎重な設計
- デバッガーを使用したステップ実行
- 単体テストでの境界値テスト
```

## 高度なデバッグテクニック

### 1. パフォーマンス問題の分析

**プロンプト:**
```
このReactコンポーネントが重くて、レンダリングが遅いです。
パフォーマンスの問題を特定して改善してください。

```typescript
const UserList: React.FC<{ users: User[] }> = ({ users }) => {
  const [filter, setFilter] = useState('');
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(filter.toLowerCase()) ||
    user.email.toLowerCase().includes(filter.toLowerCase())
  );
  
  const sortedUsers = filteredUsers.sort((a, b) => 
    a.name.localeCompare(b.name)
  );
  
  return (
    <div>
      <input 
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="ユーザーを検索..."
      />
      {sortedUsers.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
};
```

**Claude Codeの分析:**
```
パフォーマンス問題の分析:

1. 問題点:
   - 毎回のレンダリングでfilter()とsort()が実行される
   - 大量のデータで重い処理が繰り返される
   - 不要な再計算が発生

2. 改善方法:
   - useMemoを使用して計算結果をメモ化
   - デバウンス処理でフィルタリングの頻度を制限
   - 仮想化で表示要素を制限

改善後のコード:
```typescript
import { useMemo, useState, useCallback } from 'react';
import { useDebounce } from './hooks/useDebounce';

const UserList: React.FC<{ users: User[] }> = ({ users }) => {
  const [filter, setFilter] = useState('');
  const debouncedFilter = useDebounce(filter, 300);
  
  const filteredAndSortedUsers = useMemo(() => {
    if (!debouncedFilter) return users;
    
    return users
      .filter(user => 
        user.name.toLowerCase().includes(debouncedFilter.toLowerCase()) ||
        user.email.toLowerCase().includes(debouncedFilter.toLowerCase())
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [users, debouncedFilter]);
  
  const handleFilterChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  }, []);
  
  return (
    <div>
      <input 
        value={filter}
        onChange={handleFilterChange}
        placeholder="ユーザーを検索..."
      />
      {filteredAndSortedUsers.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
};
```

追加の最適化（大量データの場合）:
```typescript
import { FixedSizeList as List } from 'react-window';

const VirtualizedUserList: React.FC<{ users: User[] }> = ({ users }) => {
  // ... フィルタリングロジック
  
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={style}>
      <UserCard user={filteredAndSortedUsers[index]} />
    </div>
  );
  
  return (
    <div>
      <input 
        value={filter}
        onChange={handleFilterChange}
        placeholder="ユーザーを検索..."
      />
      <List
        height={600}
        itemCount={filteredAndSortedUsers.length}
        itemSize={80}
      >
        {Row}
      </List>
    </div>
  );
};
```
```

### 2. メモリリークの検出

**プロンプト:**
```
このReactアプリでメモリリークが発生しているようです。
原因を特定して修正してください。

```typescript
const Timer: React.FC = () => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => prev + 1);
    }, 1000);
    
    // クリーンアップが不完全
  }, []);
  
  return <div>Count: {count}</div>;
};
```

**Claude Codeの分析:**
```
メモリリーク分析:

1. 問題点:
   - setIntervalのクリーンアップが実装されていない
   - コンポーネントがアンマウントされてもタイマーが継続
   - 存在しないコンポーネントの状態更新でエラー発生

2. 修正方法:
   - useEffectのクリーンアップ関数でclearInterval実行
   - コンポーネントのマウント状態を追跡

修正後のコード:
```typescript
const Timer: React.FC = () => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => prev + 1);
    }, 1000);
    
    // クリーンアップ関数
    return () => {
      clearInterval(interval);
    };
  }, []);
  
  return <div>Count: {count}</div>;
};
```

より堅牢な実装:
```typescript
const Timer: React.FC = () => {
  const [count, setCount] = useState(0);
  const mountedRef = useRef(true);
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (mountedRef.current) {
        setCount(prev => prev + 1);
      }
    }, 1000);
    
    return () => {
      mountedRef.current = false;
      clearInterval(interval);
    };
  }, []);
  
  return <div>Count: {count}</div>;
};
```
```

## デバッグのベストプラクティス

### 1. 段階的なデバッグアプローチ

```
1. エラーメッセージの正確な理解
2. 問題の再現手順の確立
3. 最小限の再現コードの作成
4. 仮説の立案と検証
5. 修正の実装とテスト
```

### 2. 効果的なログ出力

**プロンプト:**
```
このAPIエンドポイントでエラーが発生していますが、
原因が特定できません。適切なログ出力を追加してください。

```typescript
const createUser = async (req: Request, res: Response) => {
  try {
    const userData = req.body;
    const user = await userService.create(userData);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
```

**改善後のコード:**
```typescript
import { logger } from '../utils/logger';

const createUser = async (req: Request, res: Response) => {
  const requestId = req.headers['x-request-id'] || generateRequestId();
  
  try {
    logger.info('User creation started', {
      requestId,
      body: req.body,
      userAgent: req.headers['user-agent']
    });
    
    const userData = req.body;
    
    // バリデーション
    if (!userData.email || !userData.name) {
      logger.warn('Invalid user data provided', {
        requestId,
        providedFields: Object.keys(userData)
      });
      return res.status(400).json({ 
        error: 'Email and name are required' 
      });
    }
    
    const user = await userService.create(userData);
    
    logger.info('User created successfully', {
      requestId,
      userId: user.id,
      email: user.email
    });
    
    res.status(201).json(user);
  } catch (error) {
    logger.error('User creation failed', {
      requestId,
      error: error.message,
      stack: error.stack,
      userData: req.body
    });
    
    if (error.code === 'DUPLICATE_EMAIL') {
      return res.status(409).json({ 
        error: 'Email already exists' 
      });
    }
    
    res.status(500).json({ 
      error: 'Internal Server Error',
      requestId 
    });
  }
};
```

### 3. テスト駆動デバッグ

**プロンプト:**
```
このバグを修正するためのテストケースを作成し、
テスト駆動でデバッグを進めてください。

バグ: 計算機能で小数点の計算が正確でない
```

**テスト駆動デバッグ:**
```typescript
// 1. 失敗するテストを作成
describe('Calculator', () => {
  test('should handle decimal calculations correctly', () => {
    const calculator = new Calculator();
    
    // 既知のバグを再現するテスト
    expect(calculator.add(0.1, 0.2)).toBe(0.3);
    expect(calculator.multiply(0.1, 3)).toBe(0.3);
    expect(calculator.divide(1, 3)).toBeCloseTo(0.333333, 6);
  });
});

// 2. バグのある実装
class Calculator {
  add(a: number, b: number): number {
    return a + b; // 0.1 + 0.2 = 0.30000000000000004
  }
  
  multiply(a: number, b: number): number {
    return a * b;
  }
  
  divide(a: number, b: number): number {
    return a / b;
  }
}

// 3. 修正された実装
class Calculator {
  private roundToPrecision(num: number, precision: number = 10): number {
    return Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision);
  }
  
  add(a: number, b: number): number {
    return this.roundToPrecision(a + b);
  }
  
  multiply(a: number, b: number): number {
    return this.roundToPrecision(a * b);
  }
  
  divide(a: number, b: number): number {
    if (b === 0) {
      throw new Error('Division by zero');
    }
    return this.roundToPrecision(a / b);
  }
}
```

## 次のステップ

デバッグサポート機能を理解したら：

1. **[コードレビュー](code-review.md)** - 品質向上と予防的デバッグ
2. **[外部ツール連携](integration-tools.md)** - デバッグツールとの連携
3. **[テスト基礎](../05-testing-basics.md)** - 自動テストによる品質保証

---

**関連ドキュメント:**
- [ファイル編集](file-editing.md) - エラー修正の実践
- [プロジェクトコンテキスト](project-context.md) - 大規模プロジェクトでのデバッグ
- [単体テスト](../06-development-process/06-unit-testing.md) - テスト駆動デバッグ