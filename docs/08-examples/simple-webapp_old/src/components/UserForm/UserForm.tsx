import React, { useState, useCallback } from 'react';
import { CreateUserInput, ValidationError } from '../../types/user';
import { validateCreateUserInput, getFieldError } from '../../utils/validation';
import styles from './UserForm.module.css';

/**
 * UserFormコンポーネントのProps
 */
interface UserFormProps {
  /** ユーザー追加時のコールバック関数 */
  onAddUser: (input: CreateUserInput) => Promise<{ success: boolean; errors?: string[] }>;
  /** フォームが無効化されているかどうか */
  disabled?: boolean;
  /** プレースホルダーテキスト */
  placeholder?: {
    name?: string;
    email?: string;
  };
}

/**
 * ユーザー追加フォームコンポーネント
 */
export const UserForm: React.FC<UserFormProps> = ({
  onAddUser,
  disabled = false,
  placeholder = {},
}) => {
  // フォーム状態
  const [formData, setFormData] = useState<CreateUserInput>({
    name: '',
    email: '',
  });
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // 入力値変更ハンドラー
  const handleInputChange = useCallback(
    (field: keyof CreateUserInput) =>
      (event: React.ChangeEvent<HTMLInputElement>): void => {
        const value = event.target.value;
        
        setFormData((prev) => ({
          ...prev,
          [field]: value,
        }));

        // リアルタイムバリデーション（エラーがある場合のみ）
        if (errors.some((error) => error.field === field)) {
          const newFormData = { ...formData, [field]: value };
          const validationErrors = validateCreateUserInput(newFormData);
          setErrors(validationErrors);
        }

        // 送信エラーをクリア
        if (submitError) {
          setSubmitError(null);
        }
      },
    [formData, errors, submitError]
  );

  // フォーム送信ハンドラー
  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
      event.preventDefault();

      if (isSubmitting || disabled) {
        return;
      }

      try {
        setIsSubmitting(true);
        setSubmitError(null);

        // バリデーション
        const validationErrors = validateCreateUserInput(formData);
        setErrors(validationErrors);

        if (validationErrors.length > 0) {
          return;
        }

        // ユーザー追加を実行
        const result = await onAddUser(formData);

        if (result.success) {
          // 成功時はフォームをリセット
          setFormData({ name: '', email: '' });
          setErrors([]);
        } else {
          // エラー時はエラーメッセージを表示
          if (result.errors && result.errors.length > 0) {
            setSubmitError(result.errors[0]);
          }
        }
      } catch (error) {
        console.error('Form submission error:', error);
        setSubmitError('予期しないエラーが発生しました');
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, onAddUser, isSubmitting, disabled]
  );

  // フォームリセットハンドラー
  const handleReset = useCallback((): void => {
    setFormData({ name: '', email: '' });
    setErrors([]);
    setSubmitError(null);
  }, []);

  // キーボードショートカットハンドラー
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent): void => {
      // Ctrl+Enter または Cmd+Enter で送信
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        const form = event.currentTarget.closest('form');
        if (form) {
          form.requestSubmit();
        }
      }
    },
    []
  );

  // フィールドエラーの取得
  const nameError = getFieldError(errors, 'name');
  const emailError = getFieldError(errors, 'email');

  // 送信ボタンの無効化判定
  const isSubmitDisabled = 
    disabled || 
    isSubmitting || 
    !formData.name.trim() || 
    !formData.email.trim();

  return (
    <form 
      className={styles.form} 
      onSubmit={handleSubmit}
      onKeyDown={handleKeyDown}
      noValidate
    >
      <div className={styles.header}>
        <h2 className={styles.title}>新しいユーザーを追加</h2>
        <p className={styles.description}>
          ユーザー名とメールアドレスを入力してください
        </p>
      </div>

      <div className={styles.fields}>
        {/* ユーザー名フィールド */}
        <div className={styles.field}>
          <label htmlFor="user-name" className={styles.label}>
            ユーザー名 <span className={styles.required}>*</span>
          </label>
          <input
            id="user-name"
            type="text"
            value={formData.name}
            onChange={handleInputChange('name')}
            placeholder={placeholder.name || 'ユーザー名を入力'}
            className={`${styles.input} ${nameError ? styles.inputError : ''}`}
            disabled={disabled || isSubmitting}
            maxLength={50}
            aria-describedby={nameError ? 'name-error' : undefined}
            aria-invalid={!!nameError}
            autoComplete="name"
          />
          {nameError && (
            <div id="name-error" className={styles.errorMessage} role="alert">
              {nameError}
            </div>
          )}
        </div>

        {/* メールアドレスフィールド */}
        <div className={styles.field}>
          <label htmlFor="user-email" className={styles.label}>
            メールアドレス <span className={styles.required}>*</span>
          </label>
          <input
            id="user-email"
            type="email"
            value={formData.email}
            onChange={handleInputChange('email')}
            placeholder={placeholder.email || 'example@email.com'}
            className={`${styles.input} ${emailError ? styles.inputError : ''}`}
            disabled={disabled || isSubmitting}
            maxLength={100}
            aria-describedby={emailError ? 'email-error' : undefined}
            aria-invalid={!!emailError}
            autoComplete="email"
          />
          {emailError && (
            <div id="email-error" className={styles.errorMessage} role="alert">
              {emailError}
            </div>
          )}
        </div>
      </div>

      {/* 送信エラー */}
      {submitError && (
        <div className={styles.submitError} role="alert">
          {submitError}
        </div>
      )}

      {/* アクションボタン */}
      <div className={styles.actions}>
        <button
          type="button"
          onClick={handleReset}
          className={styles.resetButton}
          disabled={disabled || isSubmitting}
          aria-label="フォームをリセット"
        >
          リセット
        </button>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitDisabled}
          aria-label="ユーザーを追加"
        >
          {isSubmitting ? (
            <>
              <span className={styles.spinner} aria-hidden="true" />
              追加中...
            </>
          ) : (
            '追加'
          )}
        </button>
      </div>

      {/* ヒント */}
      <div className={styles.hint}>
        <p>
          <kbd>Ctrl</kbd> + <kbd>Enter</kbd> で素早く送信できます
        </p>
      </div>
    </form>
  );
};