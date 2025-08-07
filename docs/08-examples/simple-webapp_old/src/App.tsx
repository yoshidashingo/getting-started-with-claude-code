import React from 'react';
import { GlobalErrorBoundary } from './components/ErrorBoundary/GlobalErrorBoundary';
import { UserManagementApp } from './components/UserManagementApp/UserManagementApp';
import './App.css';

/**
 * エラーハンドラー
 */
const handleGlobalError = (error: Error, errorInfo: React.ErrorInfo, debugInfo: any) => {
  // エラーログを出力
  console.group('🚨 Global Application Error');
  console.error('Error:', error);
  console.error('Error Info:', errorInfo);
  console.error('Debug Info:', debugInfo);
  console.groupEnd();

  // 本番環境では外部監視サービスに送信
  if (import.meta.env.PROD) {
    // 例: Sentry.captureException(error, { extra: { errorInfo, debugInfo } });
  }
};

/**
 * メインアプリケーションコンポーネント
 */
function App(): JSX.Element {
  // 開発環境でのデバッグモード
  const debugMode = import.meta.env.DEV;

  return (
    <GlobalErrorBoundary
      maxRetries={3}
      retryDelay={2000}
      enableAutoRetry={true}
      onError={handleGlobalError}
    >
      <div className="App">
        <UserManagementApp
          title="ユーザー管理システム"
          subtitle="Claude Codeで作成したシンプルなWebアプリケーション"
          debugMode={debugMode}
        />
      </div>
    </GlobalErrorBoundary>
  );
}

export default App;