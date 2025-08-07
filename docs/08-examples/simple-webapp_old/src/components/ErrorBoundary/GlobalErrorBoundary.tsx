import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import styles from './GlobalErrorBoundary.module.css';

/**
 * デバッグ情報の型定義
 */
interface DebugInfo {
  timestamp: Date;
  userAgent: string;
  url: string;
  userId?: string;
  componentStack: string;
  errorBoundary: string;
  buildInfo: {
    version: string;
    environment: string;
    buildTime: string;
  };
  performanceInfo: {
    memory?: any; // MemoryInfo type not available in all environments
    connection?: any; // NetworkInformation type not available in all environments
    timing: PerformanceTiming;
  };
}

/**
 * エラーレポートの型定義
 */
interface ErrorReport {
  error: {
    message: string;
    stack?: string;
    name: string;
  };
  debugInfo: DebugInfo;
  context: {
    route: string;
    previousRoute?: string;
    userActions: string[];
  };
}

/**
 * GlobalErrorBoundaryの状態
 */
interface GlobalErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
  isRetrying: boolean;
  errorId: string;
}

/**
 * GlobalErrorBoundaryのProps
 */
interface GlobalErrorBoundaryProps {
  children: ReactNode;
  maxRetries?: number;
  retryDelay?: number;
  enableAutoRetry?: boolean;
  onError?: (error: Error, errorInfo: ErrorInfo, debugInfo: DebugInfo) => void;
}

/**
 * アプリケーション全体のエラーを管理するグローバルエラーバウンダリ
 */
export class GlobalErrorBoundary extends Component<
  GlobalErrorBoundaryProps,
  GlobalErrorBoundaryState
> {
  private retryTimeoutId: NodeJS.Timeout | null = null;
  private userActions: string[] = [];

  constructor(props: GlobalErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      isRetrying: false,
      errorId: '',
    };

    // ユーザーアクションの追跡
    this.trackUserActions();
  }

  static getDerivedStateFromError(error: Error): Partial<GlobalErrorBoundaryState> {
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      hasError: true,
      error,
      errorId,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({
      error,
      errorInfo,
    });

    const debugInfo = this.collectDebugInfo(error, errorInfo);
    
    // エラーログを出力
    console.group(`🚨 Global Error Boundary - ${this.state.errorId}`);
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
    console.error('Debug Info:', debugInfo);
    console.groupEnd();

    // 外部のエラーハンドラーを呼び出し
    if (this.props.onError) {
      this.props.onError(error, errorInfo, debugInfo);
    }

    // エラーレポートを作成・送信
    this.reportError(error, errorInfo, debugInfo);

    // 自動リトライが有効な場合
    if (this.props.enableAutoRetry && this.shouldAutoRetry()) {
      this.scheduleAutoRetry();
    }
  }

  /**
   * ユーザーアクションを追跡
   */
  private trackUserActions(): void {
    const trackAction = (action: string) => {
      this.userActions.push(`${new Date().toISOString()}: ${action}`);
      // 最新の10アクションのみ保持
      if (this.userActions.length > 10) {
        this.userActions.shift();
      }
    };

    // クリックイベントの追跡
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const tagName = target.tagName.toLowerCase();
      const className = target.className;
      const id = target.id;
      trackAction(`Click: ${tagName}${id ? `#${id}` : ''}${className ? `.${className}` : ''}`);
    });

    // ナビゲーションの追跡
    let previousUrl = window.location.href;
    const observer = new MutationObserver(() => {
      if (window.location.href !== previousUrl) {
        trackAction(`Navigation: ${previousUrl} -> ${window.location.href}`);
        previousUrl = window.location.href;
      }
    });
    observer.observe(document, { subtree: true, childList: true });
  }

  /**
   * デバッグ情報を収集
   */
  private collectDebugInfo(error: Error, errorInfo: ErrorInfo): DebugInfo {
    const performance = window.performance;
    const navigator = window.navigator;

    return {
      timestamp: new Date(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      componentStack: errorInfo.componentStack || '',
      errorBoundary: 'GlobalErrorBoundary',
      buildInfo: {
        version: import.meta.env.VITE_APP_VERSION || '1.0.0',
        environment: import.meta.env.MODE || 'development',
        buildTime: import.meta.env.VITE_BUILD_TIME || new Date().toISOString(),
      },
      performanceInfo: {
        memory: (performance as any).memory,
        connection: (navigator as any).connection,
        timing: performance.timing,
      },
    };
  }

  /**
   * エラーレポートを外部サービスに送信
   */
  private async reportError(error: Error, errorInfo: ErrorInfo, debugInfo: DebugInfo): Promise<void> {
    const errorReport: ErrorReport = {
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name,
      },
      debugInfo,
      context: {
        route: window.location.pathname,
        userActions: this.userActions,
      },
    };

    try {
      // 本番環境では実際のエラー監視サービスに送信
      if (import.meta.env.PROD) {
        // 例: Sentry、LogRocket、Bugsnagなどのサービス
        // await fetch('/api/errors', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(errorReport),
        // });
      }

      // 開発環境ではローカルストレージに保存
      if (import.meta.env.DEV) {
        const existingReports = JSON.parse(
          localStorage.getItem('error_reports') || '[]'
        );
        existingReports.push(errorReport);
        // 最新の50件のみ保持
        if (existingReports.length > 50) {
          existingReports.splice(0, existingReports.length - 50);
        }
        localStorage.setItem('error_reports', JSON.stringify(existingReports));
      }
    } catch (reportError) {
      console.error('Failed to report error:', reportError);
    }
  }

  /**
   * 自動リトライを実行すべきかどうかを判定
   */
  private shouldAutoRetry(): boolean {
    const maxRetries = this.props.maxRetries || 3;
    return this.state.retryCount < maxRetries;
  }

  /**
   * 自動リトライをスケジュール
   */
  private scheduleAutoRetry(): void {
    const delay = this.props.retryDelay || 2000;
    
    this.setState({ isRetrying: true });

    this.retryTimeoutId = setTimeout(() => {
      this.handleRetry();
    }, delay);
  }

  /**
   * リトライを実行
   */
  private handleRetry = (): void => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1,
      isRetrying: false,
    }));

    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
      this.retryTimeoutId = null;
    }
  };

  /**
   * 手動リセット
   */
  private handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      isRetrying: false,
      errorId: '',
    });

    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
      this.retryTimeoutId = null;
    }
  };

  /**
   * ページリロード
   */
  private handleReload = (): void => {
    window.location.reload();
  };

  /**
   * エラーレポートをダウンロード
   */
  private handleDownloadReport = (): void => {
    if (!this.state.error || !this.state.errorInfo) return;

    const debugInfo = this.collectDebugInfo(this.state.error, this.state.errorInfo);
    const errorReport: ErrorReport = {
      error: {
        message: this.state.error.message,
        stack: this.state.error.stack,
        name: this.state.error.name,
      },
      debugInfo,
      context: {
        route: window.location.pathname,
        userActions: this.userActions,
      },
    };

    const blob = new Blob([JSON.stringify(errorReport, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `error-report-${this.state.errorId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  componentWillUnmount(): void {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // リトライ中の表示
      if (this.state.isRetrying) {
        return (
          <div className={styles.retryContainer}>
            <div className={styles.retrySpinner} />
            <p className={styles.retryMessage}>
              エラーから回復中です...
            </p>
          </div>
        );
      }

      // エラー表示
      return (
        <div className={styles.globalErrorBoundary}>
          <div className={styles.errorContainer}>
            <div className={styles.errorHeader}>
              <div className={styles.errorIcon} aria-hidden="true">
                🚨
              </div>
              <div className={styles.errorMeta}>
                <h1 className={styles.errorTitle}>
                  アプリケーションエラー
                </h1>
                <p className={styles.errorId}>
                  エラーID: {this.state.errorId}
                </p>
              </div>
            </div>

            <div className={styles.errorContent}>
              <p className={styles.errorMessage}>
                申し訳ございません。予期しないエラーが発生しました。
                {this.state.retryCount > 0 && (
                  <span className={styles.retryInfo}>
                    （{this.state.retryCount}回リトライしました）
                  </span>
                )}
              </p>

              <div className={styles.errorActions}>
                <button
                  type="button"
                  onClick={this.handleRetry}
                  className={styles.primaryButton}
                  disabled={!this.shouldAutoRetry()}
                >
                  再試行
                </button>
                
                <button
                  type="button"
                  onClick={this.handleReset}
                  className={styles.secondaryButton}
                >
                  リセット
                </button>
                
                <button
                  type="button"
                  onClick={this.handleReload}
                  className={styles.secondaryButton}
                >
                  ページを再読み込み
                </button>

                {import.meta.env.DEV && (
                  <button
                    type="button"
                    onClick={this.handleDownloadReport}
                    className={styles.debugButton}
                  >
                    エラーレポートをダウンロード
                  </button>
                )}
              </div>

              {/* 開発環境での詳細情報 */}
              {import.meta.env.DEV && this.state.error && (
                <details className={styles.errorDetails}>
                  <summary className={styles.detailsSummary}>
                    開発者向け詳細情報
                  </summary>
                  
                  <div className={styles.detailsContent}>
                    <div className={styles.errorSection}>
                      <h3>エラーメッセージ</h3>
                      <pre className={styles.errorText}>
                        {this.state.error.message}
                      </pre>
                    </div>

                    {this.state.error.stack && (
                      <div className={styles.errorSection}>
                        <h3>スタックトレース</h3>
                        <pre className={styles.errorText}>
                          {this.state.error.stack}
                        </pre>
                      </div>
                    )}

                    {this.state.errorInfo?.componentStack && (
                      <div className={styles.errorSection}>
                        <h3>コンポーネントスタック</h3>
                        <pre className={styles.errorText}>
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}

                    <div className={styles.errorSection}>
                      <h3>最近のユーザーアクション</h3>
                      <ul className={styles.actionList}>
                        {this.userActions.map((action, index) => (
                          <li key={index} className={styles.actionItem}>
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return (
      <ErrorBoundary 
        onError={this.props.onError ? (error: Error, errorInfo: ErrorInfo) => {
          const debugInfo = this.collectDebugInfo(error, errorInfo);
          this.props.onError!(error, errorInfo, debugInfo);
        } : undefined}
      >
        {this.props.children}
      </ErrorBoundary>
    );
  }
}