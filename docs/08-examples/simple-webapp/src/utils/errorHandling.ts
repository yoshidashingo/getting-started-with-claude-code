/**
 * エラーハンドリング関連のユーティリティ関数
 */

/**
 * エラーの種類を判定
 */
export type ErrorType = 
  | 'network'
  | 'validation'
  | 'storage'
  | 'permission'
  | 'timeout'
  | 'unknown';

/**
 * エラーの重要度レベル
 */
export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

/**
 * 構造化されたエラー情報
 */
export interface StructuredError {
  type: ErrorType;
  severity: ErrorSeverity;
  message: string;
  originalError: Error;
  context?: Record<string, any>;
  timestamp: Date;
  userAgent: string;
  url: string;
}

/**
 * エラーの種類を判定する
 */
export function categorizeError(error: Error): ErrorType {
  const message = error.message.toLowerCase();
  const name = error.name.toLowerCase();

  // ネットワークエラー
  if (
    message.includes('network') ||
    message.includes('fetch') ||
    message.includes('connection') ||
    name.includes('networkerror')
  ) {
    return 'network';
  }

  // バリデーションエラー
  if (
    message.includes('validation') ||
    message.includes('invalid') ||
    message.includes('required') ||
    name.includes('validationerror')
  ) {
    return 'validation';
  }

  // ストレージエラー
  if (
    message.includes('storage') ||
    message.includes('localstorage') ||
    message.includes('quota') ||
    name.includes('quotaexceedederror')
  ) {
    return 'storage';
  }

  // 権限エラー
  if (
    message.includes('permission') ||
    message.includes('denied') ||
    message.includes('unauthorized') ||
    name.includes('permissionerror')
  ) {
    return 'permission';
  }

  // タイムアウトエラー
  if (
    message.includes('timeout') ||
    message.includes('abort') ||
    name.includes('timeouterror')
  ) {
    return 'timeout';
  }

  return 'unknown';
}

/**
 * エラーの重要度を判定する
 */
export function assessErrorSeverity(error: Error, errorType: ErrorType): ErrorSeverity {
  // クリティカルエラー
  if (
    error.name === 'ChunkLoadError' ||
    error.message.includes('Loading chunk') ||
    error.message.includes('Loading CSS chunk')
  ) {
    return 'critical';
  }

  // 高重要度エラー
  if (
    errorType === 'network' ||
    errorType === 'storage' ||
    error.name === 'TypeError' ||
    error.name === 'ReferenceError'
  ) {
    return 'high';
  }

  // 中重要度エラー
  if (
    errorType === 'validation' ||
    errorType === 'permission' ||
    errorType === 'timeout'
  ) {
    return 'medium';
  }

  return 'low';
}

/**
 * エラーを構造化する
 */
export function structureError(
  error: Error,
  context?: Record<string, any>
): StructuredError {
  const errorType = categorizeError(error);
  const severity = assessErrorSeverity(error, errorType);

  return {
    type: errorType,
    severity,
    message: error.message,
    originalError: error,
    context,
    timestamp: new Date(),
    userAgent: navigator.userAgent,
    url: window.location.href,
  };
}

/**
 * エラーが回復可能かどうかを判定
 */
export function isRecoverableError(structuredError: StructuredError): boolean {
  const { type, severity } = structuredError;

  // クリティカルエラーは回復不可能
  if (severity === 'critical') {
    return false;
  }

  // 一時的なエラーは回復可能
  if (type === 'network' || type === 'timeout') {
    return true;
  }

  // バリデーションエラーは回復可能（ユーザーが修正可能）
  if (type === 'validation') {
    return true;
  }

  // ストレージエラーは部分的に回復可能
  if (type === 'storage') {
    return true;
  }

  return false;
}

/**
 * エラーメッセージをユーザーフレンドリーに変換
 */
export function getUserFriendlyErrorMessage(structuredError: StructuredError): string {
  const { type, originalError } = structuredError;

  switch (type) {
    case 'network':
      return 'インターネット接続を確認してください。しばらく時間をおいてから再度お試しください。';
    
    case 'validation':
      return '入力内容に問題があります。入力内容を確認してください。';
    
    case 'storage':
      return 'データの保存に問題が発生しました。ブラウザの容量を確認してください。';
    
    case 'permission':
      return '必要な権限がありません。ブラウザの設定を確認してください。';
    
    case 'timeout':
      return '処理に時間がかかりすぎています。しばらく時間をおいてから再度お試しください。';
    
    default:
      // 開発環境では詳細なエラーメッセージを表示
      if (import.meta.env.DEV) {
        return `予期しないエラーが発生しました: ${originalError.message}`;
      }
      return '予期しないエラーが発生しました。ページを再読み込みしてください。';
  }
}

/**
 * エラーの自動回復を試行すべきかどうかを判定
 */
export function shouldAutoRetry(
  structuredError: StructuredError,
  retryCount: number,
  maxRetries: number = 3
): boolean {
  // 最大リトライ回数に達している場合は回復しない
  if (retryCount >= maxRetries) {
    return false;
  }

  // 回復可能なエラーのみ自動回復を試行
  if (!isRecoverableError(structuredError)) {
    return false;
  }

  // ネットワークエラーとタイムアウトエラーは自動回復を試行
  if (structuredError.type === 'network' || structuredError.type === 'timeout') {
    return true;
  }

  return false;
}

/**
 * リトライ遅延時間を計算（指数バックオフ）
 */
export function calculateRetryDelay(
  retryCount: number,
  baseDelay: number = 1000,
  maxDelay: number = 10000
): number {
  const delay = baseDelay * Math.pow(2, retryCount);
  return Math.min(delay, maxDelay);
}

/**
 * エラーレポートを生成
 */
export function generateErrorReport(
  structuredError: StructuredError,
  additionalContext?: Record<string, any>
): Record<string, any> {
  return {
    error: {
      type: structuredError.type,
      severity: structuredError.severity,
      message: structuredError.message,
      name: structuredError.originalError.name,
      stack: structuredError.originalError.stack,
    },
    context: {
      ...structuredError.context,
      ...additionalContext,
    },
    environment: {
      userAgent: structuredError.userAgent,
      url: structuredError.url,
      timestamp: structuredError.timestamp.toISOString(),
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      screen: {
        width: window.screen.width,
        height: window.screen.height,
      },
    },
    performance: {
      memory: (performance as any).memory,
      timing: performance.timing,
      navigation: performance.navigation,
    },
  };
}

/**
 * エラーをローカルストレージに保存
 */
export function saveErrorToLocalStorage(structuredError: StructuredError): void {
  try {
    const errorReport = generateErrorReport(structuredError);
    const existingErrors = JSON.parse(localStorage.getItem('error_logs') || '[]');
    
    existingErrors.push(errorReport);
    
    // 最新の50件のみ保持
    if (existingErrors.length > 50) {
      existingErrors.splice(0, existingErrors.length - 50);
    }
    
    localStorage.setItem('error_logs', JSON.stringify(existingErrors));
  } catch (error) {
    console.warn('Failed to save error to localStorage:', error);
  }
}

/**
 * ローカルストレージからエラーログを取得
 */
export function getErrorLogsFromLocalStorage(): Record<string, any>[] {
  try {
    return JSON.parse(localStorage.getItem('error_logs') || '[]');
  } catch (error) {
    console.warn('Failed to retrieve error logs from localStorage:', error);
    return [];
  }
}

/**
 * エラーログをクリア
 */
export function clearErrorLogs(): void {
  try {
    localStorage.removeItem('error_logs');
  } catch (error) {
    console.warn('Failed to clear error logs:', error);
  }
}