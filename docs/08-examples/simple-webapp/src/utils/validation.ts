import { CreateUserInput, UpdateUserInput, ValidationError } from '@/types/user';
import { isValidEmail, isValidName } from './storage';

/**
 * ユーザー作成入力のバリデーション
 * @param input - バリデーション対象の入力データ
 * @param existingEmails - 既存のメールアドレス一覧（重複チェック用）
 * @returns バリデーションエラーの配列
 */
export const validateCreateUserInput = (
  input: CreateUserInput,
  existingEmails: string[] = []
): ValidationError[] => {
  const errors: ValidationError[] = [];

  // 名前のバリデーション
  if (!input.name.trim()) {
    errors.push({
      field: 'name',
      message: 'ユーザー名は必須です',
    });
  } else if (!isValidName(input.name)) {
    errors.push({
      field: 'name',
      message: 'ユーザー名は1文字以上50文字以下で入力してください',
    });
  }

  // メールアドレスのバリデーション
  if (!input.email.trim()) {
    errors.push({
      field: 'email',
      message: 'メールアドレスは必須です',
    });
  } else if (!isValidEmail(input.email)) {
    errors.push({
      field: 'email',
      message: '有効なメールアドレスを入力してください',
    });
  } else if (existingEmails.includes(input.email.toLowerCase())) {
    errors.push({
      field: 'email',
      message: 'このメールアドレスは既に使用されています',
    });
  }

  return errors;
};

/**
 * ユーザー更新入力のバリデーション
 * @param input - バリデーション対象の入力データ
 * @param existingEmails - 既存のメールアドレス一覧（重複チェック用）
 * @param currentEmail - 現在のメールアドレス（重複チェック除外用）
 * @returns バリデーションエラーの配列
 */
export const validateUpdateUserInput = (
  input: UpdateUserInput,
  existingEmails: string[] = [],
  currentEmail?: string
): ValidationError[] => {
  const errors: ValidationError[] = [];

  // 名前のバリデーション（提供されている場合）
  if (input.name !== undefined) {
    if (!input.name.trim()) {
      errors.push({
        field: 'name',
        message: 'ユーザー名は必須です',
      });
    } else if (!isValidName(input.name)) {
      errors.push({
        field: 'name',
        message: 'ユーザー名は1文字以上50文字以下で入力してください',
      });
    }
  }

  // メールアドレスのバリデーション（提供されている場合）
  if (input.email !== undefined) {
    if (!input.email.trim()) {
      errors.push({
        field: 'email',
        message: 'メールアドレスは必須です',
      });
    } else if (!isValidEmail(input.email)) {
      errors.push({
        field: 'email',
        message: '有効なメールアドレスを入力してください',
      });
    } else {
      // 現在のメールアドレスと異なる場合のみ重複チェック
      const emailToCheck = input.email.toLowerCase();
      const currentEmailLower = currentEmail?.toLowerCase();
      
      if (emailToCheck !== currentEmailLower && existingEmails.includes(emailToCheck)) {
        errors.push({
          field: 'email',
          message: 'このメールアドレスは既に使用されています',
        });
      }
    }
  }

  return errors;
};

/**
 * 検索クエリのバリデーション
 * @param query - 検索クエリ
 * @returns バリデーションエラーの配列
 */
export const validateSearchQuery = (query: string): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (query.length > 100) {
    errors.push({
      field: 'search',
      message: '検索クエリは100文字以下で入力してください',
    });
  }

  return errors;
};

/**
 * バリデーションエラーから特定フィールドのエラーメッセージを取得
 * @param errors - バリデーションエラーの配列
 * @param field - フィールド名
 * @returns エラーメッセージ（なければundefined）
 */
export const getFieldError = (
  errors: ValidationError[],
  field: string
): string | undefined => {
  const error = errors.find((err) => err.field === field);
  return error?.message;
};

/**
 * バリデーションエラーが存在するかチェック
 * @param errors - バリデーションエラーの配列
 * @returns エラーが存在するかどうか
 */
export const hasValidationErrors = (errors: ValidationError[]): boolean => {
  return errors.length > 0;
};