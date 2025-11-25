/**
 * ユーザー管理アプリケーション用の型定義
 */

/**
 * ユーザーの基本情報を表す型
 */
export interface User {
  /** 一意識別子 */
  id: string;
  /** ユーザー名 */
  name: string;
  /** メールアドレス */
  email: string;
  /** 作成日時 */
  createdAt: Date;
  /** 更新日時 */
  updatedAt: Date;
}

/**
 * 新しいユーザーを作成する際の入力型
 */
export interface CreateUserInput {
  /** ユーザー名 */
  name: string;
  /** メールアドレス */
  email: string;
}

/**
 * ユーザーを更新する際の入力型
 */
export interface UpdateUserInput {
  /** ユーザー名（オプション） */
  name?: string;
  /** メールアドレス（オプション） */
  email?: string;
}

/**
 * バリデーションエラーを表す型
 */
export interface ValidationError {
  /** エラーが発生したフィールド名 */
  field: string;
  /** エラーメッセージ */
  message: string;
}

/**
 * フォームの状態を表す型
 */
export interface FormState {
  /** 入力値 */
  values: CreateUserInput;
  /** バリデーションエラー */
  errors: ValidationError[];
  /** 送信中かどうか */
  isSubmitting: boolean;
}

/**
 * アプリケーション全体の状態を表す型
 */
export interface AppState {
  /** ユーザーリスト */
  users: User[];
  /** 検索クエリ */
  searchQuery: string;
  /** ローディング状態 */
  isLoading: boolean;
  /** エラーメッセージ */
  error: string | null;
}

/**
 * ユーザー統計情報を表す型
 */
export interface UserStats {
  /** 総ユーザー数 */
  total: number;
  /** 検索結果数 */
  filtered: number;
}