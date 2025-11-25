import React, { useCallback, useRef } from 'react';
import { useUsers } from '../../hooks/useUsers';
import { ErrorRecovery, withErrorRecovery } from '../ErrorBoundary';
import { UserForm } from '../UserForm/UserForm';
import { SearchBar } from '../SearchBar/SearchBar';
import { UserStats } from '../UserStats/UserStats';
import { UserList } from '../UserList/UserList';
import styles from './UserManagementApp.module.css';

/**
 * UserManagementAppコンポーネントのProps
 */
interface UserManagementAppProps {
  /** アプリケーションタイトル */
  title?: string;
  /** サブタイトル */
  subtitle?: string;
  /** デバッグモード */
  debugMode?: boolean;
}

/**
 * ユーザー管理アプリケーションのメインコンポーネント
 */
export const UserManagementApp: React.FC<UserManagementAppProps> = ({
  title = 'ユーザー管理システム',
  subtitle = 'Claude Codeで作成したシンプルなWebアプリケーション',
  debugMode = false,
}) => {
  // ユーザー管理フック
  const {
    users,
    filteredUsers,
    searchQuery,
    isLoading,
    error,
    stats,
    addUser,
    updateUser,
    deleteUser,
    setSearchQuery,
    clearSearch,
    clearAllUsers,
  } = useUsers();

  // 参照
  const formRef = useRef<HTMLDivElement>(null);

  // ユーザー追加ハンドラー
  const handleAddUser = useCallback(
    async (input: { name: string; email: string }) => {
      const result = await addUser(input);
      
      if (result.success) {
        // 成功時は検索をクリア（新しいユーザーを表示するため）
        if (searchQuery) {
          clearSearch();
        }
      }
      
      return result;
    },
    [addUser, searchQuery, clearSearch]
  );

  // ユーザー編集ハンドラー
  const handleEditUser = useCallback(
    async (id: string, input: { name?: string; email?: string }) => {
      return await updateUser(id, input);
    },
    [updateUser]
  );

  // ユーザー削除ハンドラー
  const handleDeleteUser = useCallback(
    async (id: string) => {
      return await deleteUser(id);
    },
    [deleteUser]
  );

  // 検索ハンドラー
  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
    },
    [setSearchQuery]
  );

  // 検索クリアハンドラー
  const handleClearSearch = useCallback(() => {
    clearSearch();
  }, [clearSearch]);

  // フォームにスクロールする関数
  const scrollToForm = useCallback(() => {
    if (formRef.current) {
      formRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, []);

  // 全データクリアハンドラー（デバッグ用）
  const handleClearAllData = useCallback(async () => {
    const confirmed = window.confirm(
      '全てのユーザーデータを削除しますか？\n\nこの操作は取り消せません。'
    );
    
    if (confirmed) {
      await clearAllUsers();
      clearSearch();
    }
  }, [clearAllUsers, clearSearch]);

  // エラー回復設定
  const formRecoveryConfig = {
    strategy: 'retry' as const,
    maxRetries: 2,
    retryDelay: 1000,
  };

  const statsRecoveryConfig = {
    strategy: 'fallback' as const,
    fallbackComponent: (
      <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>
        統計情報を読み込めませんでした
      </div>
    ),
  };

  const searchRecoveryConfig = {
    strategy: 'retry' as const,
    maxRetries: 1,
    retryDelay: 500,
  };

  const listRecoveryConfig = {
    strategy: 'retry' as const,
    maxRetries: 3,
    retryDelay: 2000,
  };

  return (
    <div className={styles.app}>
      {/* ヘッダー */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.titleSection}>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.subtitle}>{subtitle}</p>
          </div>
          
          {/* デバッグ情報 */}
          {debugMode && (
            <div className={styles.debugInfo}>
              <div className={styles.debugLabel}>Debug Mode</div>
              <button
                type="button"
                onClick={handleClearAllData}
                className={styles.debugButton}
                title="全データを削除（デバッグ用）"
              >
                🗑️ Clear All
              </button>
            </div>
          )}
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className={styles.main}>
        <div className={styles.container}>
          {/* ユーザー追加フォーム */}
          <section 
            ref={formRef}
            className={styles.formSection}
            aria-labelledby="form-heading"
          >
            <h2 id="form-heading" className={styles.sectionTitle}>
              新しいユーザーを追加
            </h2>
            <ErrorRecovery
              recoveryConfig={formRecoveryConfig}
              componentName="UserForm"
            >
              <UserForm
                onAddUser={handleAddUser}
                disabled={isLoading}
                placeholder={{
                  name: 'ユーザー名を入力',
                  email: 'メールアドレスを入力',
                }}
              />
            </ErrorRecovery>
          </section>

          {/* 統計情報 */}
          <section 
            className={styles.statsSection}
            aria-labelledby="stats-heading"
          >
            <h2 id="stats-heading" className={styles.sectionTitle}>
              統計情報
            </h2>
            <ErrorRecovery
              recoveryConfig={statsRecoveryConfig}
              componentName="UserStats"
            >
              <UserStats
                stats={stats}
                searchQuery={searchQuery}
                disabled={isLoading}
              />
            </ErrorRecovery>
          </section>

          {/* 検索バー */}
          <section 
            className={styles.searchSection}
            aria-labelledby="search-heading"
          >
            <h2 id="search-heading" className={styles.sectionTitle}>
              ユーザー検索
            </h2>
            <ErrorRecovery
              recoveryConfig={searchRecoveryConfig}
              componentName="SearchBar"
            >
              <SearchBar
                onSearch={handleSearch}
                onClear={handleClearSearch}
                value={searchQuery}
                disabled={isLoading}
                resultStats={stats}
                placeholder="ユーザー名またはメールアドレスで検索..."
              />
            </ErrorRecovery>
          </section>

          {/* ユーザーリスト */}
          <section 
            className={styles.listSection}
            aria-labelledby="list-heading"
          >
            <h2 id="list-heading" className={styles.sectionTitle}>
              {searchQuery ? '検索結果' : 'ユーザー一覧'}
            </h2>
            <ErrorRecovery
              recoveryConfig={listRecoveryConfig}
              componentName="UserList"
            >
              <UserList
                users={filteredUsers}
                searchQuery={searchQuery}
                onEditUser={handleEditUser}
                onDeleteUser={handleDeleteUser}
                isLoading={isLoading}
                error={error}
                disabled={isLoading}
                emptyStateConfig={{
                  showAddButton: !searchQuery,
                  onAddClick: scrollToForm,
                }}
              />
            </ErrorRecovery>
          </section>
        </div>
      </main>

      {/* フッター */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerInfo}>
            <p className={styles.footerText}>
              Made with ❤️ using Claude Code
            </p>
            <p className={styles.footerSubtext}>
              React + TypeScript + CSS Modules
            </p>
          </div>
          
          {/* フッターリンク */}
          <div className={styles.footerLinks}>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.footerLink}
              aria-label="GitHubで見る"
            >
              GitHub
            </a>
            <a
              href="https://claude.ai"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.footerLink}
              aria-label="Claude Codeについて"
            >
              Claude Code
            </a>
          </div>
        </div>
      </footer>

      {/* デバッグ情報パネル */}
      {debugMode && (
        <div className={styles.debugPanel}>
          <details className={styles.debugDetails}>
            <summary className={styles.debugSummary}>Debug Information</summary>
            <div className={styles.debugContent}>
              <div className={styles.debugItem}>
                <strong>Total Users:</strong> {stats.total}
              </div>
              <div className={styles.debugItem}>
                <strong>Filtered Users:</strong> {stats.filtered}
              </div>
              <div className={styles.debugItem}>
                <strong>Search Query:</strong> "{searchQuery}"
              </div>
              <div className={styles.debugItem}>
                <strong>Is Loading:</strong> {isLoading ? 'Yes' : 'No'}
              </div>
              <div className={styles.debugItem}>
                <strong>Error:</strong> {error || 'None'}
              </div>
              <div className={styles.debugItem}>
                <strong>LocalStorage Available:</strong> {
                  typeof Storage !== 'undefined' ? 'Yes' : 'No'
                }
              </div>
            </div>
          </details>
        </div>
      )}
    </div>
  );
};