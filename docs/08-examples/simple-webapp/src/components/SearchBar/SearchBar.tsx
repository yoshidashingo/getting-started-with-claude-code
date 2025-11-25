import React, { useState, useCallback, useRef, useEffect } from 'react';
import { validateSearchQuery } from '../../utils/validation';
import styles from './SearchBar.module.css';

/**
 * SearchBarコンポーネントのProps
 */
interface SearchBarProps {
  /** 検索実行時のコールバック関数 */
  onSearch: (query: string) => void;
  /** 検索クリア時のコールバック関数 */
  onClear?: () => void;
  /** 現在の検索クエリ */
  value?: string;
  /** プレースホルダーテキスト */
  placeholder?: string;
  /** 検索が無効化されているかどうか */
  disabled?: boolean;
  /** 検索結果の統計情報 */
  resultStats?: {
    total: number;
    filtered: number;
  };
  /** オートフォーカスするかどうか */
  autoFocus?: boolean;
}

/**
 * リアルタイム検索機能を持つ検索バーコンポーネント
 */
export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onClear,
  value = '',
  placeholder = 'ユーザー名またはメールアドレスで検索...',
  disabled = false,
  resultStats,
  autoFocus = false,
}) => {
  // ローカル状態
  const [query, setQuery] = useState(value);
  const [error, setError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  // 参照
  const inputRef = useRef<HTMLInputElement>(null);

  // propsのvalueが変更された時にローカル状態を同期
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // オートフォーカス
  useEffect(() => {
    if (autoFocus && inputRef.current && !disabled) {
      inputRef.current.focus();
    }
  }, [autoFocus, disabled]);

  // 検索実行
  const executeSearch = useCallback(
    (searchQuery: string): void => {
      // バリデーション
      const validationErrors = validateSearchQuery(searchQuery);
      if (validationErrors.length > 0) {
        setError(validationErrors[0].message);
        return;
      }

      setError(null);
      onSearch(searchQuery);
    },
    [onSearch]
  );

  // 入力値変更ハンドラー
  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      const newQuery = event.target.value;
      setQuery(newQuery);

      // エラーをクリア
      if (error) {
        setError(null);
      }

      // リアルタイム検索
      executeSearch(newQuery);
    },
    [executeSearch, error]
  );

  // 検索クリア
  const handleClear = useCallback((): void => {
    setQuery('');
    setError(null);
    executeSearch('');
    
    if (onClear) {
      onClear();
    }

    // フォーカスを戻す
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [executeSearch, onClear]);

  // フォーカスイベント
  const handleFocus = useCallback((): void => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback((): void => {
    setIsFocused(false);
  }, []);

  // キーボードショートカット
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>): void => {
      if (event.key === 'Escape') {
        event.preventDefault();
        handleClear();
      } else if (event.key === 'Enter') {
        event.preventDefault();
        // Enterキーでは現在の値で検索を実行（リアルタイム検索と同じ）
        executeSearch(query);
      }
    },
    [query, executeSearch, handleClear]
  );

  // 検索結果の表示テキスト
  const getResultText = (): string => {
    if (!resultStats) return '';

    const { total, filtered } = resultStats;
    
    if (query.trim() === '') {
      return `全 ${total} 件`;
    } else {
      return `${filtered} 件 / 全 ${total} 件`;
    }
  };

  // 検索アイコンのクリック
  const handleSearchIconClick = useCallback((): void => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className={`${styles.searchBar} ${disabled ? styles.disabled : ''}`}>
      <div className={styles.searchContainer}>
        {/* 検索入力フィールド */}
        <div className={`${styles.inputContainer} ${isFocused ? styles.focused : ''} ${error ? styles.error : ''}`}>
          <button
            type="button"
            className={styles.searchIcon}
            onClick={handleSearchIconClick}
            disabled={disabled}
            aria-label="検索"
            tabIndex={-1}
          >
            🔍
          </button>
          
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={styles.input}
            disabled={disabled}
            maxLength={100}
            aria-label="検索クエリ"
            aria-describedby={error ? 'search-error' : 'search-results'}
            autoComplete="off"
            spellCheck="false"
          />

          {/* クリアボタン */}
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className={styles.clearButton}
              disabled={disabled}
              aria-label="検索をクリア"
              title="検索をクリア (Esc)"
            >
              ✕
            </button>
          )}
        </div>

        {/* 検索結果統計 */}
        {resultStats && (
          <div 
            id="search-results" 
            className={styles.resultStats}
            aria-live="polite"
          >
            {getResultText()}
          </div>
        )}
      </div>

      {/* エラーメッセージ */}
      {error && (
        <div id="search-error" className={styles.errorMessage} role="alert">
          {error}
        </div>
      )}

      {/* 検索ヒント */}
      <div className={styles.searchHints}>
        <div className={styles.hint}>
          💡 ユーザー名やメールアドレスの一部を入力すると、リアルタイムで検索結果が表示されます
        </div>
        <div className={styles.shortcuts}>
          <span className={styles.shortcut}>
            <kbd>Esc</kbd> クリア
          </span>
          <span className={styles.shortcut}>
            <kbd>Enter</kbd> 検索実行
          </span>
        </div>
      </div>
    </div>
  );
};