import React, { useMemo } from 'react';
import { User, UpdateUserInput } from '../../types/user';
import { UserCard } from '../UserCard/UserCard';
import styles from './UserList.module.css';

/**
 * UserListコンポーネントのProps
 */
interface UserListProps {
  /** 表示するユーザーリスト */
  users: User[];
  /** 検索クエリ（ハイライト用） */
  searchQuery?: string;
  /** ユーザー編集時のコールバック関数 */
  onEditUser: (id: string, input: UpdateUserInput) => Promise<{ success: boolean; errors?: string[] }>;
  /** ユーザー削除時のコールバック関数 */
  onDeleteUser: (id: string) => Promise<{ success: boolean; error?: string }>;
  /** ローディング状態 */
  isLoading?: boolean;
  /** エラーメッセージ */
  error?: string | null;
  /** リストが無効化されているかどうか */
  disabled?: boolean;
  /** 空状態のメッセージをカスタマイズ */
  emptyStateConfig?: {
    title?: string;
    description?: string;
    showAddButton?: boolean;
    onAddClick?: () => void;
  };
}

/**
 * ユーザー一覧表示コンポーネント
 */
export const UserList: React.FC<UserListProps> = ({
  users,
  searchQuery = '',
  onEditUser,
  onDeleteUser,
  isLoading = false,
  error = null,
  disabled = false,
  emptyStateConfig,
}) => {
  // ユーザーリストのソート（作成日時の降順）
  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }, [users]);

  // 空状態の設定
  const emptyState = useMemo(() => {
    const hasSearchQuery = searchQuery.trim().length > 0;
    
    return {
      title: emptyStateConfig?.title || (hasSearchQuery ? '検索結果が見つかりません' : 'ユーザーがいません'),
      description: emptyStateConfig?.description || (
        hasSearchQuery 
          ? `「${searchQuery}」に一致するユーザーが見つかりませんでした。別のキーワードで検索してみてください。`
          : '新しいユーザーを追加して始めましょう。上のフォームからユーザー情報を入力できます。'
      ),
      showAddButton: emptyStateConfig?.showAddButton ?? !hasSearchQuery,
      onAddClick: emptyStateConfig?.onAddClick,
    };
  }, [searchQuery, emptyStateConfig]);

  // ローディング状態
  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner} aria-hidden="true" />
          <p className={styles.loadingText}>ユーザー情報を読み込み中...</p>
        </div>
      </div>
    );
  }

  // エラー状態
  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error} role="alert">
          <div className={styles.errorIcon} aria-hidden="true">⚠️</div>
          <div className={styles.errorContent}>
            <h3 className={styles.errorTitle}>エラーが発生しました</h3>
            <p className={styles.errorMessage}>{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className={styles.retryButton}
            >
              ページを再読み込み
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 空状態
  if (sortedUsers.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon} aria-hidden="true">
            {searchQuery.trim() ? '🔍' : '👥'}
          </div>
          <h3 className={styles.emptyTitle}>{emptyState.title}</h3>
          <p className={styles.emptyDescription}>{emptyState.description}</p>
          {emptyState.showAddButton && emptyState.onAddClick && (
            <button
              type="button"
              onClick={emptyState.onAddClick}
              className={styles.addButton}
            >
              最初のユーザーを追加
            </button>
          )}
        </div>
      </div>
    );
  }

  // ユーザーリスト表示
  return (
    <div className={styles.container}>
      {/* リストヘッダー */}
      <div className={styles.listHeader}>
        <h2 className={styles.listTitle}>
          {searchQuery.trim() ? (
            <>
              「<span className={styles.searchQuery}>{searchQuery}</span>」の検索結果
            </>
          ) : (
            'ユーザー一覧'
          )}
        </h2>
        <div className={styles.listStats}>
          {sortedUsers.length} 件のユーザー
        </div>
      </div>

      {/* ユーザーリスト */}
      <div 
        className={`${styles.userList} ${disabled ? styles.disabled : ''}`}
        role="list"
        aria-label={searchQuery.trim() ? `${searchQuery}の検索結果` : 'ユーザー一覧'}
      >
        {sortedUsers.map((user, index) => (
          <div
            key={user.id}
            className={styles.userItem}
            role="listitem"
            style={{
              animationDelay: `${index * 50}ms`,
            }}
          >
            <UserCard
              user={user}
              onEdit={onEditUser}
              onDelete={onDeleteUser}
              searchQuery={searchQuery}
              disabled={disabled}
            />
          </div>
        ))}
      </div>

      {/* リストフッター */}
      <div className={styles.listFooter}>
        <div className={styles.footerStats}>
          {searchQuery.trim() ? (
            <>
              {sortedUsers.length} 件の検索結果を表示中
              {users.length !== sortedUsers.length && (
                <span className={styles.totalCount}>
                  （全 {users.length} 件中）
                </span>
              )}
            </>
          ) : (
            <>
              全 {sortedUsers.length} 件のユーザーを表示中
            </>
          )}
        </div>
      </div>
    </div>
  );
};