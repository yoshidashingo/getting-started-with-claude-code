import React, { Component, ReactNode, ErrorInfo } from 'react';
import styles from './ErrorRecovery.module.css';

/**
 * エラー回復戦略の型定義
 */
type RecoveryStrategy = 'retry' | 'fallback' | 'reload' | 'redirect';

/**
 * エラー回復設定
 */
interface RecoveryConfig {
  strategy: RecoveryStrategy;
  maxRetries?: number;
  retryDelay?: number;
  fallbackComponent?: ReactNode;
  redirectUrl?: string;
  onRecovery?: () => void;
}

/**
 * ErrorRecoveryの状態
 */
interface ErrorRecoveryState {
  hasError: boolean;
  error: Error | null;
  retryCount: number;
  isRecovering: boolean;
}

/**
 * ErrorRecoveryのProps
 */
interface ErrorRecoveryProps {
  children: ReactNode;
  recoveryConfig: RecoveryConfig;
  componentName?: string;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

/**
 * 自動エラー回復機能を持つコンポーネントラッパー
 */
export class ErrorRecovery extends Component<ErrorRecoveryProps, ErrorRecoveryState> {
  private recoveryTimeoutId: NodeJS.Timeout | null = null;

  constructor(props: ErrorRecoveryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      retryCount: 0,
      isRecovering: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorRecoveryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error(`ErrorRecovery caught error in ${this.props.componentName || 'Unknown'}:`, error);
    
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // 自動回復を試行
    this.attemptRecovery();
  }

  /**
   * エラー回復を試行
   */
  private attemptRecovery = (): void => {
    const { strategy, maxRetries = 3, retryDelay = 1000 } = this.props.recoveryConfig;
    
    if (this.state.retryCount >= maxRetries) {
      console.warn(`Max retries (${maxRetries}) reached for ${this.props.componentName}`);
      return;
    }

    switch (strategy) {
      case 'retry':
        this.scheduleRetry(retryDelay);
        break;
      case 'fallback':
        // フォールバックコンポーネントを表示（エラー状態を維持）
        break;
      case 'reload':
        this.scheduleReload(retryDelay);
        break;
      case 'redirect':
        this.scheduleRedirect(retryDelay);
        break;
    }
  };

  /**
   * リトライをスケジュール
   */
  private scheduleRetry = (delay: number): void => {
    this.setState({ isRecovering: true });

    this.recoveryTimeoutId = setTimeout(() => {
      this.setState(prevState => ({
        hasError: false,
        error: null,
        retryCount: prevState.retryCount + 1,
        isRecovering: false,
      }));

      if (this.props.recoveryConfig.onRecovery) {
        this.props.recoveryConfig.onRecovery();
      }
    }, delay);
  };

  /**
   * ページリロードをスケジュール
   */
  private scheduleReload = (delay: number): void => {
    this.setState({ isRecovering: true });

    this.recoveryTimeoutId = setTimeout(() => {
      window.location.reload();
    }, delay);
  };

  /**
   * リダイレクトをスケジュール
   */
  private scheduleRedirect = (delay: number): void => {
    const { redirectUrl = '/' } = this.props.recoveryConfig;
    this.setState({ isRecovering: true });

    this.recoveryTimeoutId = setTimeout(() => {
      window.location.href = redirectUrl;
    }, delay);
  };

  /**
   * 手動リトライ
   */
  private handleManualRetry = (): void => {
    this.setState({
      hasError: false,
      error: null,
      isRecovering: false,
    });

    if (this.props.recoveryConfig.onRecovery) {
      this.props.recoveryConfig.onRecovery();
    }
  };

  componentWillUnmount(): void {
    if (this.recoveryTimeoutId) {
      clearTimeout(this.recoveryTimeoutId);
    }
  }

  render(): ReactNode {
    const { strategy, fallbackComponent } = this.props.recoveryConfig;

    // 回復中の表示
    if (this.state.isRecovering) {
      return (
        <div className={styles.recoveryContainer}>
          <div className={styles.recoverySpinner} />
          <p className={styles.recoveryMessage}>
            {strategy === 'retry' && 'コンポーネントを再読み込み中...'}
            {strategy === 'reload' && 'ページを再読み込み中...'}
            {strategy === 'redirect' && 'リダイレクト中...'}
          </p>
        </div>
      );
    }

    // エラー状態の表示
    if (this.state.hasError) {
      // フォールバック戦略の場合
      if (strategy === 'fallback' && fallbackComponent) {
        return (
          <div className={styles.fallbackContainer}>
            {fallbackComponent}
            <div className={styles.fallbackActions}>
              <button
                type="button"
                onClick={this.handleManualRetry}
                className={styles.retryButton}
              >
                再試行
              </button>
            </div>
          </div>
        );
      }

      // デフォルトのエラー表示
      return (
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>⚠️</div>
          <div className={styles.errorContent}>
            <h3 className={styles.errorTitle}>
              {this.props.componentName || 'コンポーネント'}でエラーが発生しました
            </h3>
            <p className={styles.errorMessage}>
              {this.state.retryCount > 0 && (
                <span>
                  {this.state.retryCount}回自動回復を試行しましたが、問題が解決されませんでした。
                </span>
              )}
            </p>
            <div className={styles.errorActions}>
              <button
                type="button"
                onClick={this.handleManualRetry}
                className={styles.primaryButton}
              >
                手動で再試行
              </button>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className={styles.secondaryButton}
              >
                ページを再読み込み
              </button>
            </div>
            
            {/* 開発環境でのエラー詳細 */}
            {import.meta.env.DEV && this.state.error && (
              <details className={styles.errorDetails}>
                <summary>エラー詳細</summary>
                <pre className={styles.errorText}>
                  {this.state.error.message}
                  {'\n\n'}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * エラー回復機能付きコンポーネントラッパーのHOC
 */
export function withErrorRecovery<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  recoveryConfig: RecoveryConfig,
  componentName?: string
) {
  const WithErrorRecoveryComponent = (props: P) => (
    <ErrorRecovery
      recoveryConfig={recoveryConfig}
      componentName={componentName || WrappedComponent.displayName || WrappedComponent.name}
    >
      <WrappedComponent {...props} />
    </ErrorRecovery>
  );

  WithErrorRecoveryComponent.displayName = `withErrorRecovery(${
    componentName || WrappedComponent.displayName || WrappedComponent.name
  })`;

  return WithErrorRecoveryComponent;
}

/**
 * エラー回復機能付きコンポーネントラッパーのHook
 */
export function useErrorRecovery(
  recoveryConfig: RecoveryConfig,
  componentName?: string
) {
  return React.useCallback(
    (children: ReactNode) => (
      <ErrorRecovery
        recoveryConfig={recoveryConfig}
        componentName={componentName}
      >
        {children}
      </ErrorRecovery>
    ),
    [recoveryConfig, componentName]
  );
}