# 簡単なアプリ作成チュートリアル

Claude Codeを使って実際にWebアプリケーションを作成する実践的なチュートリアルです。このチュートリアルを通じて、Claude Codeの基本的な開発フローを体験できます。

## チュートリアル概要

### 作成するアプリケーション
**タスク管理アプリ（Todo App）**

### 主な機能
- タスクの追加・削除
- 完了状態の切り替え
- フィルタリング（全て/未完了/完了済み）
- ローカルストレージでのデータ永続化

### 使用技術
- **フロントエンド**: React + TypeScript
- **スタイリング**: CSS Modules
- **状態管理**: React Hooks
- **データ永続化**: LocalStorage

### 学習目標
- Claude Codeでの基本的な開発フロー
- プロンプトの効果的な書き方
- 段階的な機能追加の方法
- エラー解決とデバッグの実践

## 事前準備

### 必要な環境
- Node.js 16.x以降
- Claude Code APIキー
- テキストエディタ（VS Code推奨）

### プロジェクトの初期化
```bash
# Reactプロジェクトの作成
npx create-react-app todo-app --template typescript
cd todo-app

# 開発サーバーの起動確認
npm start
```

## ステップ1: プロジェクト構造の設計

### Claude Codeへのプロンプト
```
React TypeScriptでタスク管理アプリを作成します。
以下の要件に基づいて、適切なプロジェクト構造を提案してください：

機能要件:
- タスクの追加、削除、完了状態の切り替え
- フィルタリング機能（全て/未完了/完了済み）
- ローカルストレージでのデータ永続化

技術要件:
- React + TypeScript
- CSS Modules
- 関数コンポーネント + Hooks

プロジェクト構造とファイル一覧を教えてください。
```

### Claude Codeからの提案
```
推奨プロジェクト構造:

src/
├── components/
│   ├── TodoApp/
│   │   ├── TodoApp.tsx
│   │   └── TodoApp.module.css
│   ├── TodoItem/
│   │   ├── TodoItem.tsx
│   │   └── TodoItem.module.css
│   ├── TodoList/
│   │   ├── TodoList.tsx
│   │   └── TodoList.module.css
│   ├── TodoForm/
│   │   ├── TodoForm.tsx
│   │   └── TodoForm.module.css
│   └── TodoFilter/
│       ├── TodoFilter.tsx
│       └── TodoFilter.module.css
├── hooks/
│   ├── useTodos.ts
│   └── useLocalStorage.ts
├── types/
│   └── todo.ts
├── utils/
│   └── storage.ts
└── App.tsx

この構造により、各コンポーネントが単一責任を持ち、
再利用可能で保守しやすいコードになります。
```

## ステップ2: 型定義の作成

### プロンプト
```
タスク管理アプリ用のTypeScript型定義を作成してください。

必要な型:
- Todo: タスクの基本情報
- TodoFilter: フィルタリングの種類
- その他必要な型

各型には適切なコメントも含めてください。
```

### 生成されるコード
```typescript
// src/types/todo.ts

/**
 * タスクの基本情報を表す型
 */
export interface Todo {
  /** 一意識別子 */
  id: string;
  /** タスクのタイトル */
  title: string;
  /** 完了状態 */
  completed: boolean;
  /** 作成日時 */
  createdAt: Date;
  /** 更新日時 */
  updatedAt: Date;
}

/**
 * 新しいタスクを作成する際の入力型
 */
export interface CreateTodoInput {
  title: string;
}

/**
 * タスクを更新する際の入力型
 */
export interface UpdateTodoInput {
  title?: string;
  completed?: boolean;
}

/**
 * フィルタリングの種類
 */
export type TodoFilter = 'all' | 'active' | 'completed';

/**
 * フィルタリングオプションの表示情報
 */
export interface FilterOption {
  value: TodoFilter;
  label: string;
  count?: number;
}

/**
 * タスク統計情報
 */
export interface TodoStats {
  total: number;
  active: number;
  completed: number;
}
```

## ステップ3: ユーティリティ関数の作成

### プロンプト
```
タスク管理アプリ用のユーティリティ関数を作成してください。

必要な機能:
- ローカルストレージへの保存・読み込み
- 一意IDの生成
- 日付のフォーマット
- タスクのフィルタリング

TypeScriptで型安全に実装してください。
```

### 生成されるコード
```typescript
// src/utils/storage.ts
import { Todo } from '../types/todo';

const STORAGE_KEY = 'todos';

/**
 * ローカルストレージからタスクを読み込む
 */
export const loadTodos = (): Todo[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    return parsed.map((todo: any) => ({
      ...todo,
      createdAt: new Date(todo.createdAt),
      updatedAt: new Date(todo.updatedAt)
    }));
  } catch (error) {
    console.error('Failed to load todos from localStorage:', error);
    return [];
  }
};

/**
 * ローカルストレージにタスクを保存する
 */
export const saveTodos = (todos: Todo[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (error) {
    console.error('Failed to save todos to localStorage:', error);
  }
};

/**
 * 一意IDを生成する
 */
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * 日付を読みやすい形式でフォーマットする
 */
export const formatDate = (date: Date): string => {
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
  
  if (diffInHours < 1) {
    const minutes = Math.floor(diffInHours * 60);
    return `${minutes}分前`;
  } else if (diffInHours < 24) {
    const hours = Math.floor(diffInHours);
    return `${hours}時間前`;
  } else if (diffInHours < 24 * 7) {
    const days = Math.floor(diffInHours / 24);
    return `${days}日前`;
  } else {
    return date.toLocaleDateString('ja-JP');
  }
};

/**
 * タスクをフィルタリングする
 */
export const filterTodos = (todos: Todo[], filter: TodoFilter): Todo[] => {
  switch (filter) {
    case 'active':
      return todos.filter(todo => !todo.completed);
    case 'completed':
      return todos.filter(todo => todo.completed);
    case 'all':
    default:
      return todos;
  }
};

/**
 * タスクの統計情報を計算する
 */
export const calculateStats = (todos: Todo[]): TodoStats => {
  const total = todos.length;
  const completed = todos.filter(todo => todo.completed).length;
  const active = total - completed;
  
  return { total, active, completed };
};
```

## ステップ4: カスタムフックの作成

### プロンプト
```
タスク管理アプリ用のカスタムフックを作成してください。

必要なフック:
1. useTodos: タスクの状態管理とCRUD操作
2. useLocalStorage: ローカルストレージとの同期

React Hooksのベストプラクティスに従って実装してください。
```

### 生成されるコード
```typescript
// src/hooks/useLocalStorage.ts
import { useState, useEffect } from 'react';

/**
 * ローカルストレージと同期するカスタムフック
 */
export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] => {
  // 初期値の設定
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // 値を設定する関数
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};
```

```typescript
// src/hooks/useTodos.ts
import { useState, useCallback, useMemo } from 'react';
import { Todo, CreateTodoInput, UpdateTodoInput, TodoFilter, TodoStats } from '../types/todo';
import { useLocalStorage } from './useLocalStorage';
import { generateId, filterTodos, calculateStats } from '../utils/storage';

/**
 * タスク管理のカスタムフック
 */
export const useTodos = () => {
  const [todos, setTodos] = useLocalStorage<Todo[]>('todos', []);
  const [filter, setFilter] = useState<TodoFilter>('all');

  // フィルタリングされたタスク
  const filteredTodos = useMemo(() => {
    return filterTodos(todos, filter);
  }, [todos, filter]);

  // 統計情報
  const stats = useMemo(() => {
    return calculateStats(todos);
  }, [todos]);

  // タスクを追加
  const addTodo = useCallback((input: CreateTodoInput) => {
    const newTodo: Todo = {
      id: generateId(),
      title: input.title.trim(),
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setTodos(prevTodos => [...prevTodos, newTodo]);
  }, [setTodos]);

  // タスクを更新
  const updateTodo = useCallback((id: string, input: UpdateTodoInput) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id
          ? {
              ...todo,
              ...input,
              updatedAt: new Date()
            }
          : todo
      )
    );
  }, [setTodos]);

  // タスクを削除
  const deleteTodo = useCallback((id: string) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  }, [setTodos]);

  // タスクの完了状態を切り替え
  const toggleTodo = useCallback((id: string) => {
    updateTodo(id, { completed: !todos.find(todo => todo.id === id)?.completed });
  }, [todos, updateTodo]);

  // 完了済みタスクを全て削除
  const clearCompleted = useCallback(() => {
    setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));
  }, [setTodos]);

  // 全てのタスクの完了状態を切り替え
  const toggleAll = useCallback(() => {
    const allCompleted = todos.every(todo => todo.completed);
    setTodos(prevTodos =>
      prevTodos.map(todo => ({
        ...todo,
        completed: !allCompleted,
        updatedAt: new Date()
      }))
    );
  }, [todos, setTodos]);

  return {
    // 状態
    todos: filteredTodos,
    allTodos: todos,
    filter,
    stats,
    
    // アクション
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    clearCompleted,
    toggleAll,
    setFilter
  };
};
```

## ステップ5: コンポーネントの作成

### TodoItemコンポーネント

#### プロンプト
```
タスク管理アプリのTodoItemコンポーネントを作成してください。

機能:
- タスクの表示（タイトル、完了状態、作成日時）
- 完了状態の切り替え
- 編集機能（ダブルクリックで編集モード）
- 削除機能
- アクセシビリティ対応

React TypeScript + CSS Modulesで実装してください。
```

#### 生成されるコード
```typescript
// src/components/TodoItem/TodoItem.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Todo } from '../../types/todo';
import { formatDate } from '../../utils/storage';
import styles from './TodoItem.module.css';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onUpdate: (id: string, title: string) => void;
  onDelete: (id: string) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggle,
  onUpdate,
  onDelete
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const editInputRef = useRef<HTMLInputElement>(null);

  // 編集モードに入った時にフォーカス
  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [isEditing]);

  // 編集を開始
  const handleEditStart = () => {
    setIsEditing(true);
    setEditTitle(todo.title);
  };

  // 編集を保存
  const handleEditSave = () => {
    const trimmedTitle = editTitle.trim();
    if (trimmedTitle && trimmedTitle !== todo.title) {
      onUpdate(todo.id, trimmedTitle);
    }
    setIsEditing(false);
  };

  // 編集をキャンセル
  const handleEditCancel = () => {
    setEditTitle(todo.title);
    setIsEditing(false);
  };

  // キーボードイベントの処理
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEditSave();
    } else if (e.key === 'Escape') {
      handleEditCancel();
    }
  };

  // 削除の確認
  const handleDelete = () => {
    if (window.confirm(`「${todo.title}」を削除しますか？`)) {
      onDelete(todo.id);
    }
  };

  return (
    <li className={`${styles.todoItem} ${todo.completed ? styles.completed : ''}`}>
      <div className={styles.content}>
        {/* 完了チェックボックス */}
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggle(todo.id)}
            className={styles.checkbox}
            aria-label={`${todo.title}を${todo.completed ? '未完了' : '完了'}にする`}
          />
          <span className={styles.checkmark}></span>
        </label>

        {/* タスクタイトル */}
        <div className={styles.titleContainer}>
          {isEditing ? (
            <input
              ref={editInputRef}
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleEditSave}
              onKeyDown={handleKeyDown}
              className={styles.editInput}
              aria-label="タスクタイトルを編集"
            />
          ) : (
            <span
              className={styles.title}
              onDoubleClick={handleEditStart}
              title="ダブルクリックで編集"
            >
              {todo.title}
            </span>
          )}
          
          {/* 作成日時 */}
          <span className={styles.timestamp} title={todo.createdAt.toLocaleString()}>
            {formatDate(todo.createdAt)}
          </span>
        </div>

        {/* アクションボタン */}
        <div className={styles.actions}>
          {!isEditing && (
            <>
              <button
                onClick={handleEditStart}
                className={styles.editButton}
                aria-label={`${todo.title}を編集`}
                title="編集"
              >
                ✏️
              </button>
              <button
                onClick={handleDelete}
                className={styles.deleteButton}
                aria-label={`${todo.title}を削除`}
                title="削除"
              >
                🗑️
              </button>
            </>
          )}
        </div>
      </div>
    </li>
  );
};
```

```css
/* src/components/TodoItem/TodoItem.module.css */
.todoItem {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #e0e0e0;
  background-color: #ffffff;
  transition: background-color 0.2s ease;
}

.todoItem:hover {
  background-color: #f8f9fa;
}

.todoItem.completed {
  opacity: 0.6;
}

.content {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 12px;
}

/* チェックボックス */
.checkboxLabel {
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;
}

.checkbox {
  opacity: 0;
  position: absolute;
  width: 20px;
  height: 20px;
}

.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid #ddd;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.checkbox:checked + .checkmark {
  background-color: #4caf50;
  border-color: #4caf50;
}

.checkbox:checked + .checkmark::after {
  content: '✓';
  color: white;
  font-size: 14px;
  font-weight: bold;
}

.checkbox:focus + .checkmark {
  outline: 2px solid #2196f3;
  outline-offset: 2px;
}

/* タイトル */
.titleContainer {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.title {
  font-size: 16px;
  line-height: 1.4;
  cursor: pointer;
  word-break: break-word;
}

.completed .title {
  text-decoration: line-through;
  color: #888;
}

.editInput {
  font-size: 16px;
  padding: 4px 8px;
  border: 2px solid #2196f3;
  border-radius: 4px;
  outline: none;
  width: 100%;
}

.timestamp {
  font-size: 12px;
  color: #888;
}

/* アクション */
.actions {
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.todoItem:hover .actions {
  opacity: 1;
}

.editButton,
.deleteButton {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  font-size: 16px;
  transition: background-color 0.2s ease;
}

.editButton:hover {
  background-color: #e3f2fd;
}

.deleteButton:hover {
  background-color: #ffebee;
}

.editButton:focus,
.deleteButton:focus {
  outline: 2px solid #2196f3;
  outline-offset: 2px;
}

/* レスポンシブ */
@media (max-width: 768px) {
  .todoItem {
    padding: 8px 12px;
  }
  
  .actions {
    opacity: 1;
  }
  
  .title {
    font-size: 14px;
  }
  
  .timestamp {
    font-size: 11px;
  }
}
```

### TodoFormコンポーネント

#### プロンプト
```
タスク追加用のTodoFormコンポーネントを作成してください。

機能:
- タスクタイトルの入力
- 入力値のバリデーション
- Enterキーでの送信
- 送信後の入力フィールドクリア
- アクセシビリティ対応

React TypeScript + CSS Modulesで実装してください。
```

#### 生成されるコード
```typescript
// src/components/TodoForm/TodoForm.tsx
import React, { useState } from 'react';
import styles from './TodoForm.module.css';

interface TodoFormProps {
  onAdd: (title: string) => void;
  placeholder?: string;
}

export const TodoForm: React.FC<TodoFormProps> = ({
  onAdd,
  placeholder = "新しいタスクを入力..."
}) => {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  // フォーム送信処理
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedTitle = title.trim();
    
    // バリデーション
    if (!trimmedTitle) {
      setError('タスクタイトルを入力してください');
      return;
    }
    
    if (trimmedTitle.length > 100) {
      setError('タスクタイトルは100文字以内で入力してください');
      return;
    }
    
    // タスクを追加
    onAdd(trimmedTitle);
    
    // フォームをリセット
    setTitle('');
    setError('');
  };

  // 入力値変更処理
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (error) {
      setError('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.inputContainer}>
        <input
          type="text"
          value={title}
          onChange={handleChange}
          placeholder={placeholder}
          className={`${styles.input} ${error ? styles.error : ''}`}
          aria-label="新しいタスクのタイトル"
          aria-describedby={error ? 'error-message' : undefined}
          maxLength={100}
        />
        <button
          type="submit"
          className={styles.addButton}
          disabled={!title.trim()}
          aria-label="タスクを追加"
        >
          追加
        </button>
      </div>
      
      {error && (
        <div id="error-message" className={styles.errorMessage} role="alert">
          {error}
        </div>
      )}
      
      <div className={styles.hint}>
        Enterキーを押すか「追加」ボタンをクリックしてタスクを追加
      </div>
    </form>
  );
};
```

```css
/* src/components/TodoForm/TodoForm.module.css */
.form {
  margin-bottom: 24px;
}

.inputContainer {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.input {
  flex: 1;
  padding: 12px 16px;
  font-size: 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  outline: none;
  transition: border-color 0.2s ease;
}

.input:focus {
  border-color: #2196f3;
}

.input.error {
  border-color: #f44336;
}

.input::placeholder {
  color: #999;
}

.addButton {
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  color: white;
  background-color: #2196f3;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.addButton:hover:not(:disabled) {
  background-color: #1976d2;
}

.addButton:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.addButton:focus {
  outline: 2px solid #2196f3;
  outline-offset: 2px;
}

.errorMessage {
  color: #f44336;
  font-size: 14px;
  margin-bottom: 4px;
}

.hint {
  font-size: 12px;
  color: #666;
}

/* レスポンシブ */
@media (max-width: 768px) {
  .inputContainer {
    flex-direction: column;
  }
  
  .input,
  .addButton {
    font-size: 14px;
    padding: 10px 12px;
  }
}
```

## ステップ6: メインアプリケーションの統合

### プロンプト
```
これまで作成したコンポーネントを統合して、
メインのTodoAppコンポーネントを作成してください。

機能:
- 全てのコンポーネントの統合
- フィルタリング機能
- 統計情報の表示
- レスポンシブデザイン
- アクセシビリティ対応

React TypeScript + CSS Modulesで実装してください。
```

### 生成されるコード
```typescript
// src/components/TodoApp/TodoApp.tsx
import React from 'react';
import { useTodos } from '../../hooks/useTodos';
import { TodoForm } from '../TodoForm/TodoForm';
import { TodoItem } from '../TodoItem/TodoItem';
import { TodoFilter } from '../TodoFilter/TodoFilter';
import { TodoStats } from '../TodoStats/TodoStats';
import styles from './TodoApp.module.css';

export const TodoApp: React.FC = () => {
  const {
    todos,
    stats,
    filter,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    clearCompleted,
    toggleAll,
    setFilter
  } = useTodos();

  // タスク追加
  const handleAddTodo = (title: string) => {
    addTodo({ title });
  };

  // タスク更新
  const handleUpdateTodo = (id: string, title: string) => {
    updateTodo(id, { title });
  };

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title}>Todo App</h1>
        <p className={styles.subtitle}>Claude Codeで作成したタスク管理アプリ</p>
      </header>

      <main className={styles.main}>
        {/* タスク追加フォーム */}
        <section className={styles.formSection}>
          <TodoForm onAdd={handleAddTodo} />
        </section>

        {/* 統計情報 */}
        <section className={styles.statsSection}>
          <TodoStats stats={stats} />
        </section>

        {/* フィルター */}
        <section className={styles.filterSection}>
          <TodoFilter
            currentFilter={filter}
            onFilterChange={setFilter}
            stats={stats}
          />
        </section>

        {/* タスクリスト */}
        <section className={styles.listSection}>
          {stats.total > 0 && (
            <div className={styles.listHeader}>
              <button
                onClick={toggleAll}
                className={styles.toggleAllButton}
                aria-label="全てのタスクの完了状態を切り替え"
                title="全て完了/未完了を切り替え"
              >
                {stats.active === 0 ? '↻' : '✓'}
              </button>
              <span className={styles.listTitle}>
                {filter === 'all' && 'すべてのタスク'}
                {filter === 'active' && '未完了のタスク'}
                {filter === 'completed' && '完了済みのタスク'}
                ({todos.length}件)
              </span>
            </div>
          )}

          {todos.length > 0 ? (
            <ul className={styles.todoList} role="list">
              {todos.map(todo => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={toggleTodo}
                  onUpdate={handleUpdateTodo}
                  onDelete={deleteTodo}
                />
              ))}
            </ul>
          ) : (
            <div className={styles.emptyState}>
              {stats.total === 0 ? (
                <p>まだタスクがありません。<br />上のフォームから新しいタスクを追加してみましょう！</p>
              ) : (
                <p>
                  {filter === 'active' && '未完了のタスクはありません。'}
                  {filter === 'completed' && '完了済みのタスクはありません。'}
                </p>
              )}
            </div>
          )}

          {/* 完了済みタスクのクリア */}
          {stats.completed > 0 && (
            <div className={styles.actions}>
              <button
                onClick={clearCompleted}
                className={styles.clearButton}
                aria-label={`完了済みのタスク${stats.completed}件を削除`}
              >
                完了済みを削除 ({stats.completed}件)
              </button>
            </div>
          )}
        </section>
      </main>

      <footer className={styles.footer}>
        <p>Made with Claude Code</p>
      </footer>
    </div>
  );
};
```

## ステップ7: 動作確認とテスト

### 基本機能のテスト

1. **タスクの追加**
   - フォームにタスクを入力して追加
   - 空の入力での送信エラー確認
   - 長すぎるタイトルでのエラー確認

2. **タスクの操作**
   - チェックボックスでの完了状態切り替え
   - ダブルクリックでの編集機能
   - 削除ボタンでの削除確認

3. **フィルタリング**
   - 「全て」「未完了」「完了済み」の切り替え
   - 各フィルターでの表示内容確認

4. **データ永続化**
   - ページリロード後のデータ保持確認
   - ブラウザを閉じて再開後の確認

### デバッグとエラー解決

#### よくある問題と解決方法

**問題1: ローカルストレージエラー**
```typescript
// エラーハンドリングの改善
const saveToStorage = (data: Todo[]) => {
  try {
    localStorage.setItem('todos', JSON.stringify(data));
  } catch (error) {
    console.error('Storage error:', error);
    // フォールバック処理
    alert('データの保存に失敗しました。ブラウザの容量を確認してください。');
  }
};
```

**問題2: 日付フォーマットエラー**
```typescript
// 安全な日付処理
const safeFormatDate = (date: Date | string): string => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) {
      return '不明';
    }
    return formatDate(dateObj);
  } catch (error) {
    console.error('Date formatting error:', error);
    return '不明';
  }
};
```

## ステップ8: 機能拡張

### 追加機能の実装

#### プロンプト
```
作成したTodoアプリに以下の機能を追加してください：

1. タスクの優先度設定（高・中・低）
2. 期限設定機能
3. カテゴリ分類
4. 検索機能
5. ダークモード切り替え

段階的に実装方法を教えてください。
```

### 学習の振り返り

このチュートリアルを通じて学習したこと：

1. **Claude Codeの基本的な使い方**
   - 効果的なプロンプトの書き方
   - 段階的な開発アプローチ
   - エラー解決の方法

2. **React + TypeScriptの実践**
   - カスタムフックの作成
   - 型安全な状態管理
   - コンポーネント設計

3. **開発のベストプラクティス**
   - 単一責任の原則
   - アクセシビリティ対応
   - レスポンシブデザイン

## 次のステップ

チュートリアルを完了したら、次の学習に進みましょう：

### 初心者向け
1. **[テスト基礎](05-testing-basics.md)** - 作成したアプリのテスト
2. **[デバッグサポート](02-features/debugging-support.md)** - エラー解決技術
3. **[コードレビュー](02-features/code-review.md)** - コード品質向上

### 中級者向け
1. **[体系的な開発プロセス](06-development-process/README.md)** - 本格的な開発手法
2. **[外部ツール連携](02-features/integration-tools.md)** - CI/CDの構築
3. **[チーム開発](07-team-development/README.md)** - チーム開発への展開

## まとめ

このチュートリアルでは、Claude Codeを使って実際のWebアプリケーションを作成しました。重要なポイント：

- **段階的なアプローチ**: 小さな機能から始めて徐々に拡張
- **明確なプロンプト**: 具体的で詳細な指示が良い結果を生む
- **エラーハンドリング**: 実用的なアプリには適切なエラー処理が必要
- **ユーザビリティ**: アクセシビリティとレスポンシブデザインの重要性

Claude Codeを活用することで、効率的に高品質なアプリケーションを開発できることを実感できたでしょう。

---

**ナビゲーション:**
- ⬅️ 前へ: [セットアップガイド](03-getting-started.md) - 環境構築の詳細
- ➡️ 次へ: [機能概要](02-features/README.md) - Claude Codeの全機能

**関連ドキュメント:**
- [テスト基礎](05-testing-basics.md) - アプリケーションのテスト方法
- [開発プロセス](06-development-process/README.md) - 体系的な開発手法
- [サンプル集](08-examples/README.md) - より多くの実践例