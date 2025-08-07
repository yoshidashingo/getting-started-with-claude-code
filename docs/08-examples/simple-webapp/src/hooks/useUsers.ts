import { useState, useCallback, useMemo, useEffect } from 'react';
import { User, CreateUserInput, UpdateUserInput, UserStats } from '@/types/user';
import { useLocalStorage } from './useLocalStorage';
import {
  generateId,
  filterUsers,
  sortUsers,
  loadUsersFromStorage,
  saveUsersToStorage,
} from '@/utils/storage';
import {
  validateCreateUserInput,
  validateUpdateUserInput,
  validateSearchQuery,
  hasValidationErrors,
} from '@/utils/validation';

/**
 * useUsersフックの戻り値の型
 */
interface UseUsersReturn {
  // 状態
  /** 全ユーザーリスト */
  users: User[];
  /** フィルタリングされたユーザーリスト */
  filteredUsers: User[];
  /** 検索クエリ */
  searchQuery: string;
  /** ローディング状態 */
  isLoading: boolean;
  /** エラーメッセージ */
  error: string | null;
  /** ユーザー統計情報 */
  stats: UserStats;

  // CRUD操作
  /** ユーザーを追加 */
  addUser: (input: CreateUserInput) => Promise<{ success: boolean; errors?: string[] }>;
  /** ユーザーを更新 */
  updateUser: (id: string, input: UpdateUserInput) => Promise<{ success: boolean; errors?: string[] }>;
  /** ユーザーを削除 */
  deleteUser: (id: string) => Promise<{ success: boolean; error?: string }>;

  // 検索・フィルタリング
  /** 検索クエリを設定 */
  setSearchQuery: (query: string) => void;
  /** 検索をクリア */
  clearSearch: () => void;

  // ユーティリティ
  /** IDでユーザーを取得 */
  getUserById: (id: string) => User | undefined;
  /** ユーザー数を取得 */
  getUserCount: () => number;
  /** 全データをクリア */
  clearAllUsers: () => Promise<void>;
}

/**
 * ユーザー管理のカスタムフック
 * @returns ユーザー管理のための状態と操作関数
 */
export const useUsers = (): UseUsersReturn => {
  // LocalStorageと同期する状態
  const {
    value: users,
    setValue: setUsers,
    isLoading: storageLoading,
    error: storageError,
  } = useLocalStorage<User[]>('userManagementApp_users', []);

  // ローカル状態
  const [searchQuery, setSearchQueryState] = useState('');
  const [isOperating, setIsOperating] = useState(false);
  const [operationError, setOperationError] = useState<string | null>(null);

  // 初期データの読み込み
  useEffect(() => {
    const loadInitialData = async (): Promise<void> => {
      try {
        const storedUsers = loadUsersFromStorage();
        if (storedUsers.length > 0) {
          setUsers(storedUsers);
        }
      } catch (error) {
        console.error('Failed to load initial user data:', error);
      }
    };

    loadInitialData();
  }, [setUsers]);

  // フィルタリングされたユーザーリスト
  const filteredUsers = useMemo(() => {
    return filterUsers(users, searchQuery);
  }, [users, searchQuery]);

  // ユーザー統計情報
  const stats = useMemo((): UserStats => {
    return {
      total: users.length,
      filtered: filteredUsers.length,
    };
  }, [users.length, filteredUsers.length]);

  // ローディング状態
  const isLoading = storageLoading || isOperating;

  // エラー状態
  const error = storageError || operationError;

  // ユーザーを追加
  const addUser = useCallback(
    async (input: CreateUserInput): Promise<{ success: boolean; errors?: string[] }> => {
      try {
        setIsOperating(true);
        setOperationError(null);

        // バリデーション
        const existingEmails = users.map((user) => user.email.toLowerCase());
        const validationErrors = validateCreateUserInput(input, existingEmails);

        if (hasValidationErrors(validationErrors)) {
          return {
            success: false,
            errors: validationErrors.map((err) => err.message),
          };
        }

        // 新しいユーザーを作成
        const newUser: User = {
          id: generateId(),
          name: input.name.trim(),
          email: input.email.trim().toLowerCase(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        // ユーザーリストを更新
        const updatedUsers = [...users, newUser];
        setUsers(updatedUsers);

        // LocalStorageに保存
        saveUsersToStorage(updatedUsers);

        return { success: true };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'ユーザーの追加に失敗しました';
        setOperationError(errorMessage);
        return {
          success: false,
          errors: [errorMessage],
        };
      } finally {
        setIsOperating(false);
      }
    },
    [users, setUsers]
  );

  // ユーザーを更新
  const updateUser = useCallback(
    async (id: string, input: UpdateUserInput): Promise<{ success: boolean; errors?: string[] }> => {
      try {
        setIsOperating(true);
        setOperationError(null);

        // 対象ユーザーを検索
        const targetUser = users.find((user) => user.id === id);
        if (!targetUser) {
          return {
            success: false,
            errors: ['ユーザーが見つかりません'],
          };
        }

        // バリデーション
        const existingEmails = users
          .filter((user) => user.id !== id)
          .map((user) => user.email.toLowerCase());
        const validationErrors = validateUpdateUserInput(
          input,
          existingEmails,
          targetUser.email
        );

        if (hasValidationErrors(validationErrors)) {
          return {
            success: false,
            errors: validationErrors.map((err) => err.message),
          };
        }

        // ユーザー情報を更新
        const updatedUsers = users.map((user) => {
          if (user.id === id) {
            return {
              ...user,
              name: input.name?.trim() ?? user.name,
              email: input.email?.trim().toLowerCase() ?? user.email,
              updatedAt: new Date(),
            };
          }
          return user;
        });

        setUsers(updatedUsers);
        saveUsersToStorage(updatedUsers);

        return { success: true };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'ユーザーの更新に失敗しました';
        setOperationError(errorMessage);
        return {
          success: false,
          errors: [errorMessage],
        };
      } finally {
        setIsOperating(false);
      }
    },
    [users, setUsers]
  );

  // ユーザーを削除
  const deleteUser = useCallback(
    async (id: string): Promise<{ success: boolean; error?: string }> => {
      try {
        setIsOperating(true);
        setOperationError(null);

        // 対象ユーザーが存在するかチェック
        const userExists = users.some((user) => user.id === id);
        if (!userExists) {
          return {
            success: false,
            error: 'ユーザーが見つかりません',
          };
        }

        // ユーザーを削除
        const updatedUsers = users.filter((user) => user.id !== id);
        setUsers(updatedUsers);
        saveUsersToStorage(updatedUsers);

        return { success: true };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'ユーザーの削除に失敗しました';
        setOperationError(errorMessage);
        return {
          success: false,
          error: errorMessage,
        };
      } finally {
        setIsOperating(false);
      }
    },
    [users, setUsers]
  );

  // 検索クエリを設定
  const setSearchQuery = useCallback((query: string): void => {
    // 検索クエリのバリデーション
    const validationErrors = validateSearchQuery(query);
    if (hasValidationErrors(validationErrors)) {
      setOperationError(validationErrors[0].message);
      return;
    }

    setOperationError(null);
    setSearchQueryState(query);
  }, []);

  // 検索をクリア
  const clearSearch = useCallback((): void => {
    setSearchQueryState('');
    setOperationError(null);
  }, []);

  // IDでユーザーを取得
  const getUserById = useCallback(
    (id: string): User | undefined => {
      return users.find((user) => user.id === id);
    },
    [users]
  );

  // ユーザー数を取得
  const getUserCount = useCallback((): number => {
    return users.length;
  }, [users.length]);

  // 全データをクリア
  const clearAllUsers = useCallback(async (): Promise<void> => {
    try {
      setIsOperating(true);
      setOperationError(null);

      setUsers([]);
      saveUsersToStorage([]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'データのクリアに失敗しました';
      setOperationError(errorMessage);
    } finally {
      setIsOperating(false);
    }
  }, [setUsers]);

  return {
    // 状態
    users,
    filteredUsers,
    searchQuery,
    isLoading,
    error,
    stats,

    // CRUD操作
    addUser,
    updateUser,
    deleteUser,

    // 検索・フィルタリング
    setSearchQuery,
    clearSearch,

    // ユーティリティ
    getUserById,
    getUserCount,
    clearAllUsers,
  };
};