import { useState, useEffect, useCallback, useRef } from 'react';
import { isStorageAvailable } from '../utils/storage';

/**
 * useLocalStorageフックの戻り値の型
 */
interface UseLocalStorageReturn<T> {
  /** 現在の値 */
  value: T;
  /** 値を設定する関数 */
  setValue: (value: T | ((prev: T) => T)) => void;
  /** 値を削除する関数 */
  removeValue: () => void;
  /** ローディング状態 */
  isLoading: boolean;
  /** エラーメッセージ */
  error: string | null;
}

/**
 * LocalStorageと同期するカスタムフック
 * @param key - LocalStorageのキー
 * @param initialValue - 初期値
 * @returns LocalStorage操作のためのオブジェクト
 */
export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): UseLocalStorageReturn<T> => {
  const [value, setStoredValue] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const initialValueRef = useRef<T>(initialValue);

  // LocalStorageから初期値を読み込む
  useEffect(() => {
    const loadInitialValue = (): void => {
      try {
        setIsLoading(true);
        setError(null);

        // LocalStorageが利用可能かチェック
        if (!isStorageAvailable()) {
          console.warn('LocalStorage is not available');
          setStoredValue(initialValue);
          return;
        }

        const item = window.localStorage.getItem(key);
        if (item !== null) {
          const parsedValue = JSON.parse(item);
          setStoredValue(parsedValue);
        } else {
          setStoredValue(initialValueRef.current);
        }
      } catch (err) {
        console.error(`Error reading localStorage key "${key}":`, err);
        setError('データの読み込みに失敗しました');
        setStoredValue(initialValueRef.current);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialValue();
  }, [key]); // initialValue を依存関係から削除して無限ループを防ぐ

  // 値を設定する関数
  const setValue = useCallback(
    (newValue: T | ((prev: T) => T)): void => {
      try {
        setError(null);

        // 状態を更新（関数の場合は setStoredValue に直接渡す）
        if (newValue instanceof Function) {
          setStoredValue(prevValue => {
            const valueToStore = newValue(prevValue);
            // LocalStorageが利用可能な場合のみ保存
            if (isStorageAvailable()) {
              window.localStorage.setItem(key, JSON.stringify(valueToStore));
            } else {
              console.warn('LocalStorage is not available, value not persisted');
            }
            return valueToStore;
          });
        } else {
          setStoredValue(newValue);
          // LocalStorageが利用可能な場合のみ保存
          if (isStorageAvailable()) {
            window.localStorage.setItem(key, JSON.stringify(newValue));
          } else {
            console.warn('LocalStorage is not available, value not persisted');
          }
        }
      } catch (err) {
        console.error(`Error setting localStorage key "${key}":`, err);
        setError('データの保存に失敗しました');
      }
    },
    [key] // value を依存関係から削除して無限ループを防ぐ
  );

  // 値を削除する関数
  const removeValue = useCallback((): void => {
    try {
      setError(null);
      
      // 状態を初期値にリセット
      setStoredValue(initialValueRef.current);

      // LocalStorageが利用可能な場合のみ削除
      if (isStorageAvailable()) {
        window.localStorage.removeItem(key);
      }
    } catch (err) {
      console.error(`Error removing localStorage key "${key}":`, err);
      setError('データの削除に失敗しました');
    }
  }, [key]); // initialValue を依存関係から削除して無限ループを防ぐ

  return {
    value,
    setValue,
    removeValue,
    isLoading,
    error,
  };
};

/**
 * 複数のLocalStorageキーを管理するカスタムフック
 * @param keys - 管理するキーと初期値のマップ
 * @returns 各キーの値と操作関数のマップ
 */
export const useMultipleLocalStorage = <T extends Record<string, any>>(
  keys: T
): {
  [K in keyof T]: UseLocalStorageReturn<T[K]>;
} => {
  const result = {} as {
    [K in keyof T]: UseLocalStorageReturn<T[K]>;
  };

  for (const [key, initialValue] of Object.entries(keys)) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    result[key as keyof T] = useLocalStorage(key, initialValue);
  }

  return result;
};

/**
 * LocalStorageの変更を監視するカスタムフック
 * @param key - 監視するキー
 * @param callback - 変更時のコールバック関数
 */
export const useLocalStorageListener = (
  key: string,
  callback: (newValue: string | null, oldValue: string | null) => void
): void => {
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent): void => {
      if (e.key === key && e.storageArea === localStorage) {
        callback(e.newValue, e.oldValue);
      }
    };

    // 他のタブでの変更を監視
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key, callback]);
};