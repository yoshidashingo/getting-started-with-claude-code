import React from 'react';
import { UserManagementApp } from './components/UserManagementApp/UserManagementApp';
import './App.css';

/**
 * メインアプリケーションコンポーネント
 */
function App(): JSX.Element {
  // 開発環境でのデバッグモード
  const debugMode = import.meta.env.DEV;

  return (
    <div className="App">
      <UserManagementApp
        title="ユーザー管理システム"
        subtitle="Claude Codeで作成したシンプルなWebアプリケーション"
        debugMode={debugMode}
      />
    </div>
  );
}

export default App;