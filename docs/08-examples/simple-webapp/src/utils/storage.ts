import { User } from '@/types/user';

/**
 * LocalStorageのキー定数
 */
const STORAGE_KEYS = {
  USERS: 'userManagementApp_users',
  SETTINGS: 'userManagementApp_settings',
} as const;

/**
 * ストレージデータの構造
 */
interface StorageData {
  users: User[];
  version: string;
  lastUpdated: string;
}

/**
 * LocalStorageからユーザーデータを読み込む
 * @returns ユーザー配列
 */
export const loadUsersFromStorage = (): User[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!stored) {
      return [];
    }

    const data: StorageData = JSON.parse(stored);
    
    // 日付文字列をDateオブジェクトに変換
    return data.users.map((user) => ({
      ...user,
      createdAt: new Date(user.createdAt),
      updatedAt: new Date(user.updatedAt),
    }));
  } catch (error) {
    console.error('Failed to load users from localStorage:', error);
    return [];
  }
};

/**
 * LocalStorageにユーザーデータを保存する
 * @param users - 保存するユーザー配列
 */
export const saveUsersToStorage = (users: User[]): void => {
  try {
    const data: StorageData = {
      users,
      version: '1.0.0',
      lastUpdated: new Date().toISOString(),
    };
    
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save users to localStorage:', error);
    throw new Error('データの保存に失敗しました。ブラウザの容量を確認してください。');
  }
};

/**
 * LocalStorageからユーザーデータを削除する
 */
export const clearUsersFromStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.USERS);
  } catch (error) {
    console.error('Failed to clear users from localStorage:', error);
  }
};

/**
 * 一意のIDを生成する
 * @returns 一意のID文字列
 */
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
};

/**
 * 日付を読みやすい形式でフォーマットする
 * @param date - フォーマットする日付
 * @returns フォーマットされた日付文字列
 */
export const formatDate = (date: Date): string => {
  try {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) {
      return 'たった今';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}分前`;
    } else if (diffInHours < 24) {
      return `${diffInHours}時間前`;
    } else if (diffInDays < 7) {
      return `${diffInDays}日前`;
    } else {
      return date.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }
  } catch (error) {
    console.error('Date formatting error:', error);
    return '不明';
  }
};

/**
 * メールアドレスの形式を検証する
 * @param email - 検証するメールアドレス
 * @returns 有効かどうか
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * ユーザー名の形式を検証する
 * @param name - 検証するユーザー名
 * @returns 有効かどうか
 */
export const isValidName = (name: string): boolean => {
  const trimmedName = name.trim();
  return trimmedName.length >= 1 && trimmedName.length <= 50;
};

/**
 * ユーザーリストを検索クエリでフィルタリングする
 * @param users - 検索対象のユーザー配列
 * @param query - 検索クエリ
 * @returns フィルタリングされたユーザー配列
 */
export const filterUsers = (users: User[], query: string): User[] => {
  if (!query.trim()) {
    return users;
  }

  const lowercaseQuery = query.toLowerCase().trim();
  
  return users.filter((user) => {
    return (
      user.name.toLowerCase().includes(lowercaseQuery) ||
      user.email.toLowerCase().includes(lowercaseQuery)
    );
  });
};

/**
 * 検索クエリに基づいてテキストをハイライトする
 * @param text - ハイライト対象のテキスト
 * @param query - 検索クエリ
 * @returns ハイライト情報を含むオブジェクト
 */
export const highlightText = (text: string, query: string): {
  highlighted: boolean;
  parts: Array<{ text: string; isHighlight: boolean }>;
} => {
  if (!query.trim()) {
    return {
      highlighted: false,
      parts: [{ text, isHighlight: false }],
    };
  }

  const lowercaseText = text.toLowerCase();
  const lowercaseQuery = query.toLowerCase().trim();
  const index = lowercaseText.indexOf(lowercaseQuery);

  if (index === -1) {
    return {
      highlighted: false,
      parts: [{ text, isHighlight: false }],
    };
  }

  const parts = [];
  
  if (index > 0) {
    parts.push({ text: text.slice(0, index), isHighlight: false });
  }
  
  parts.push({
    text: text.slice(index, index + query.length),
    isHighlight: true,
  });
  
  if (index + query.length < text.length) {
    parts.push({
      text: text.slice(index + query.length),
      isHighlight: false,
    });
  }

  return {
    highlighted: true,
    parts,
  };
};

/**
 * ユーザー配列をソートする
 * @param users - ソート対象のユーザー配列
 * @param sortBy - ソート基準
 * @param order - ソート順序
 * @returns ソートされたユーザー配列
 */
export const sortUsers = (
  users: User[],
  sortBy: 'name' | 'email' | 'createdAt' | 'updatedAt',
  order: 'asc' | 'desc' = 'asc'
): User[] => {
  return [...users].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name, 'ja');
        break;
      case 'email':
        comparison = a.email.localeCompare(b.email);
        break;
      case 'createdAt':
        comparison = a.createdAt.getTime() - b.createdAt.getTime();
        break;
      case 'updatedAt':
        comparison = a.updatedAt.getTime() - b.updatedAt.getTime();
        break;
    }

    return order === 'desc' ? -comparison : comparison;
  });
};

/**
 * LocalStorageが利用可能かチェックする
 * @returns 利用可能かどうか
 */
export const isStorageAvailable = (): boolean => {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
};