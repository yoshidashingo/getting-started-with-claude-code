import React, { useState, useRef, useEffect, useCallback } from 'react';
import { User, UpdateUserInput } from '../../types/user';
import { formatDate, highlightText } from '../../utils/storage';
import { validateUpdateUserInput, getFieldError } from '../../utils/validation';
import styles from './UserCard.module.css';

/**
 * UserCardコンポーネントのProps
 */
interface UserCardProps {
  /** 表示するユーザー情報 */
  user: User;
  /** 編集時のコールバック関数 */
  onEdit: (id: string, input: UpdateUserInput) => Promise<{ success: boolean; errors?: string[] }>;
  /** 削除時のコールバック関数 */
  onDelete: (id: string) => Promise<{ success: boolean; error?: string }>;
  /** 検索クエリ（ハイライト用） */
  searchQuery?: string;
  /** カードが無効化されているかどうか */
  disabled?: boolean;
}

/**
 * 個別ユーザー情報表示カードコンポーネント
 */
export const UserCard: React.FC<UserCardProps> = ({
  user,
  onEdit,
  onDelete,
  searchQuery = '',
  disabled = false,
}) => {
  // 編集状態
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<UpdateUserInput>({
    name: user.name,
    email: user.email,
  });
  const [editErrors, setEditErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 参照
  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  // 編集モードに入った時にフォーカス
  useEffect(() => {
    if (isEditing && nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.select();
    }
  }, [isEditing]);

  // 編集開始
  const handleEditStart = useCallback((): void => {
    if (disabled || isSubmitting) return;

    setIsEditing(true);
    setEditData({
      name: user.name,
      email: user.email,
    });
    setEditErrors([]);
  }, [user.name, user.email, disabled, isSubmitting]);

  // 編集キャンセル
  const handleEditCancel = useCallback((): void => {
    setIsEditing(false);
    setEditData({
      name: user.name,
      email: user.email,
    });
    setEditErrors([]);
  }, [user.name, user.email]);

  // 編集保存
  const handleEditSave = useCallback(async (): Promise<void> => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      setEditErrors([]);

      // バリデーション
      const validationErrors = validateUpdateUserInput(editData, [], user.email);
      if (validationErrors.length > 0) {
        setEditErrors(validationErrors.map(err => err.message));
        return;
      }

      // 変更がない場合はそのまま終了
      if (editData.name === user.name && editData.email === user.email) {
        setIsEditing(false);
        return;
      }

      // 更新実行
      const result = await onEdit(user.id, editData);

      if (result.success) {
        setIsEditing(false);
      } else {
        setEditErrors(result.errors || ['更新に失敗しました']);
      }
    } catch (error) {
      console.error('Edit save error:', error);
      setEditErrors(['予期しないエラーが発生しました']);
    } finally {
      setIsSubmitting(false);
    }
  }, [editData, user.id, user.name, user.email, onEdit, isSubmitting]);

  // 削除実行
  const handleDelete = useCallback(async (): Promise<void> => {
    if (disabled || isSubmitting) return;

    const confirmed = window.confirm(
      `「${user.name}」を削除しますか？\n\nこの操作は取り消せません。`
    );

    if (!confirmed) return;

    try {
      setIsSubmitting(true);
      const result = await onDelete(user.id);

      if (!result.success && result.error) {
        alert(`削除に失敗しました: ${result.error}`);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('削除中にエラーが発生しました');
    } finally {
      setIsSubmitting(false);
    }
  }, [user.id, user.name, onDelete, disabled, isSubmitting]);

  // 入力値変更ハンドラー
  const handleInputChange = useCallback(
    (field: keyof UpdateUserInput) =>
      (event: React.ChangeEvent<HTMLInputElement>): void => {
        const value = event.target.value;
        setEditData(prev => ({ ...prev, [field]: value }));
        
        // エラーをクリア
        if (editErrors.length > 0) {
          setEditErrors([]);
        }
      },
    [editErrors.length]
  );

  // キーボードイベントハンドラー
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent): void => {
      if (!isEditing) return;

      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        handleEditSave();
      } else if (event.key === 'Escape') {
        event.preventDefault();
        handleEditCancel();
      }
    },
    [isEditing, handleEditSave, handleEditCancel]
  );

  // ダブルクリックハンドラー
  const handleDoubleClick = useCallback((): void => {
    if (!isEditing) {
      handleEditStart();
    }
  }, [isEditing, handleEditStart]);

  // テキストハイライト
  const highlightedName = highlightText(user.name, searchQuery);
  const highlightedEmail = highlightText(user.email, searchQuery);

  return (
    <div 
      className={`${styles.card} ${disabled ? styles.disabled : ''} ${isEditing ? styles.editing : ''}`}
      onKeyDown={handleKeyDown}
    >
      <div className={styles.content}>
        {/* ユーザー情報 */}
        <div className={styles.userInfo}>
          {isEditing ? (
            // 編集モード
            <div className={styles.editForm}>
              <div className={styles.editField}>
                <label htmlFor={`edit-name-${user.id}`} className={styles.editLabel}>
                  ユーザー名
                </label>
                <input
                  id={`edit-name-${user.id}`}
                  ref={nameInputRef}
                  type="text"
                  value={editData.name || ''}
                  onChange={handleInputChange('name')}
                  className={styles.editInput}
                  disabled={isSubmitting}
                  maxLength={50}
                  aria-label="ユーザー名を編集"
                />
              </div>
              <div className={styles.editField}>
                <label htmlFor={`edit-email-${user.id}`} className={styles.editLabel}>
                  メールアドレス
                </label>
                <input
                  id={`edit-email-${user.id}`}
                  ref={emailInputRef}
                  type="email"
                  value={editData.email || ''}
                  onChange={handleInputChange('email')}
                  className={styles.editInput}
                  disabled={isSubmitting}
                  maxLength={100}
                  aria-label="メールアドレスを編集"
                />
              </div>
              {editErrors.length > 0 && (
                <div className={styles.editErrors} role="alert">
                  {editErrors.map((error, index) => (
                    <div key={index} className={styles.editError}>
                      {error}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            // 表示モード
            <div className={styles.displayInfo} onDoubleClick={handleDoubleClick}>
              <div className={styles.name}>
                {highlightedName.highlighted ? (
                  highlightedName.parts.map((part, index) => (
                    <span
                      key={index}
                      className={part.isHighlight ? styles.highlight : ''}
                    >
                      {part.text}
                    </span>
                  ))
                ) : (
                  user.name
                )}
              </div>
              <div className={styles.email}>
                {highlightedEmail.highlighted ? (
                  highlightedEmail.parts.map((part, index) => (
                    <span
                      key={index}
                      className={part.isHighlight ? styles.highlight : ''}
                    >
                      {part.text}
                    </span>
                  ))
                ) : (
                  user.email
                )}
              </div>
              <div className={styles.metadata}>
                <span className={styles.createdAt} title={user.createdAt.toLocaleString()}>
                  作成: {formatDate(user.createdAt)}
                </span>
                {user.updatedAt.getTime() !== user.createdAt.getTime() && (
                  <span className={styles.updatedAt} title={user.updatedAt.toLocaleString()}>
                    更新: {formatDate(user.updatedAt)}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* アクションボタン */}
        <div className={styles.actions}>
          {isEditing ? (
            // 編集モードのアクション
            <>
              <button
                type="button"
                onClick={handleEditSave}
                className={styles.saveButton}
                disabled={isSubmitting}
                aria-label="変更を保存"
                title="変更を保存 (Enter)"
              >
                {isSubmitting ? '保存中...' : '保存'}
              </button>
              <button
                type="button"
                onClick={handleEditCancel}
                className={styles.cancelButton}
                disabled={isSubmitting}
                aria-label="編集をキャンセル"
                title="キャンセル (Esc)"
              >
                キャンセル
              </button>
            </>
          ) : (
            // 表示モードのアクション
            <>
              <button
                type="button"
                onClick={handleEditStart}
                className={styles.editButton}
                disabled={disabled || isSubmitting}
                aria-label={`${user.name}を編集`}
                title="編集 (ダブルクリックでも可)"
              >
                <span className={styles.buttonIcon}>✏️</span>
                編集
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className={styles.deleteButton}
                disabled={disabled || isSubmitting}
                aria-label={`${user.name}を削除`}
                title="削除"
              >
                <span className={styles.buttonIcon}>🗑️</span>
                削除
              </button>
            </>
          )}
        </div>
      </div>

      {/* 編集ヒント */}
      {isEditing && (
        <div className={styles.editHint}>
          <kbd>Enter</kbd>で保存、<kbd>Esc</kbd>でキャンセル
        </div>
      )}
    </div>
  );
};