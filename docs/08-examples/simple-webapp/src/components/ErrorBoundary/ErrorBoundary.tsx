import React, { Component, ErrorInfo, ReactNode } from 'react';
import styles from './ErrorBoundary.module.css';

/**
 * ErrorBoundaryの状態
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * ErrorBoundaryのProps
 */
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

/**
 * アプリケーション全体のエラーをキャッチするエラーバウンダリコンポーネント
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // エラーが発生した時に状態を更新
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // エラー情報を状態に保存
    this.setState({
      error,
      errorInfo,
    });

    // エラーログを出力
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // 外部のエラーハンドラーを呼び出し
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // 本番環境では外部のエラー監視サービスに送信
    if (process.env.NODE_ENV === 'production') {
      this.reportErrorToService(error, errorInfo);
    }
  }

  /**
   * エラーを外部サービスに報告（実装例）
   */
  private reportErrorToService(error: Error, errorInfo: ErrorInfo): void {
    // 実際の実装では、Sentry、LogRocket、Bugsnagなどのサービスを使用
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    // 例: fetch('/api/errors', { method: 'POST', body: JSON.stringify(errorReport) });
    console.log('Error report:', errorReport);
  }

  /**
   * エラー状態をリセット
   */
  private handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  /**
   * ページをリロード
   */
  private handleReload = (): void => {
    window.location.reload();
  };

  /**
   * エラー詳細の表示/非表示を切り替え
   */
  private toggleErrorDetails = (): void => {
    const details = document.getElementById('error-details');
    if (details) {
      details.style.display = details.style.display === 'none' ? 'block' : 'none';
    }
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // カスタムフォールバックUIが提供されている場合はそれを使用
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // デフォルトのエラーUI
      return (
        <div className={styles.errorBoundary}>
          <div className={styles.errorContainer}>
            <div className={styles.errorIcon} aria-hidden="true">
              ⚠️
            </div>
            
            <div className={styles.errorContent}>
              <h1 className={styles.errorTitle}>
                申し訳ございません
              </h1>
              
              <p className={styles.errorMessage}>
                予期しないエラーが発生しました。ページを再読み込みするか、しばらく時間をおいてから再度お試しください。
              </p>

              <div className={styles.errorActions}>
                <button
                  type="button"
                  onClick={this.handleReset}
                  className={styles.primaryButton}
                >
                  再試行
                </button>
                
                <button
                  type="button"
                  onClick={this.handleReload}
                  className={styles.secondaryButton}
                >
                  ページを再読み込み
                </button>
              </div>

              {/* 開発環境でのエラー詳細 */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className={styles.errorDetails}>
                  <button
                    type="button"
                    onClick={this.toggleErrorDetails}
                    className={styles.detailsToggle}
                  >
                    エラー詳細を表示
                  </button>
                  
                  <div id="error-details" className={styles.detailsContent} style={{ display: 'none' }}>
                    <div className={styles.errorInfo}>
                      <h3>エラーメッセージ:</h3>
                      <pre className={styles.errorText}>
                        {this.state.error.message}
                      </pre>
                    </div>
                    
                    {this.state.error.stack && (
                      <div className={styles.errorInfo}>
                        <h3>スタックトレース:</h3>
                        <pre className={styles.errorText}>
                          {this.state.error.stack}
                        </pre>
                      </div>
                    )}
                    
                    {this.state.errorInfo?.componentStack && (
                      <div className={styles.errorInfo}>
                        <h3>コンポーネントスタック:</h3>
                        <pre className={styles.errorText}>
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}