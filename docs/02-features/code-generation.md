# コード生成機能

Claude Codeの核心機能であるコード生成について詳しく説明します。様々な言語・フレームワークでの生成例と、生成されたコードの品質向上テクニックを学習できます。

## コード生成機能とは

コード生成機能は、自然言語での指示に基づいて、新しいコードを自動的に作成する機能です。単純な関数から複雑なアプリケーション全体まで、幅広い範囲のコード生成が可能です。

### 主な特徴

- **多言語対応**: JavaScript、Python、Java、C#など主要言語をサポート
- **フレームワーク対応**: React、Vue.js、Django、Spring Bootなど
- **ベストプラクティス準拠**: 業界標準のコーディング規約に従った生成
- **カスタマイズ可能**: プロジェクト固有の要件に対応

## 対応言語・フレームワーク

### フロントエンド

#### JavaScript/TypeScript
- **React**: コンポーネント、フック、状態管理
- **Vue.js**: コンポーネント、Composition API、Vuex
- **Angular**: コンポーネント、サービス、ディレクティブ
- **Svelte**: コンポーネント、ストア、アクション

#### CSS/スタイリング
- **CSS**: 標準CSS、Flexbox、Grid
- **Sass/SCSS**: 変数、ミックスイン、ネスト
- **Tailwind CSS**: ユーティリティクラス
- **Styled Components**: CSS-in-JS
- **Material-UI**: Reactコンポーネント

### バックエンド

#### Node.js
- **Express**: ルーター、ミドルウェア、API
- **Fastify**: 高性能API
- **NestJS**: エンタープライズ級アプリケーション

#### Python
- **Django**: MVCアーキテクチャ、ORM
- **FastAPI**: 高性能API、自動ドキュメント生成
- **Flask**: 軽量Webアプリケーション

#### Java
- **Spring Boot**: エンタープライズアプリケーション
- **Spring MVC**: Webアプリケーション
- **JPA/Hibernate**: データベース操作

#### C#
- **.NET Core**: Webアプリケーション、API
- **ASP.NET MVC**: Webアプリケーション
- **Entity Framework**: ORM

### データベース

- **SQL**: MySQL、PostgreSQL、SQL Server
- **NoSQL**: MongoDB、Redis
- **ORM**: Prisma、TypeORM、Sequelize

## 実践的な生成例

### 例1: React TypeScript コンポーネント

**プロンプト:**
```
React TypeScriptでユーザープロフィールカードコンポーネントを作成してください。

Props:
- user: { id: number, name: string, email: string, avatar?: string }
- onEdit: (userId: number) => void
- onDelete: (userId: number) => void

機能:
- アバター画像の表示（デフォルト画像対応）
- ユーザー情報の表示
- 編集・削除ボタン
- ホバー効果
```

**生成されるコード:**
```typescript
import React from 'react';
import './UserProfileCard.css';

interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

interface UserProfileCardProps {
  user: User;
  onEdit: (userId: number) => void;
  onDelete: (userId: number) => void;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({
  user,
  onEdit,
  onDelete
}) => {
  const handleEdit = () => {
    onEdit(user.id);
  };

  const handleDelete = () => {
    if (window.confirm(`${user.name}を削除しますか？`)) {
      onDelete(user.id);
    }
  };

  return (
    <div className="user-profile-card">
      <div className="avatar-container">
        <img
          src={user.avatar || '/default-avatar.png'}
          alt={`${user.name}のアバター`}
          className="avatar"
          onError={(e) => {
            e.currentTarget.src = '/default-avatar.png';
          }}
        />
      </div>
      
      <div className="user-info">
        <h3 className="user-name">{user.name}</h3>
        <p className="user-email">{user.email}</p>
      </div>
      
      <div className="actions">
        <button
          className="edit-button"
          onClick={handleEdit}
          aria-label={`${user.name}を編集`}
        >
          編集
        </button>
        <button
          className="delete-button"
          onClick={handleDelete}
          aria-label={`${user.name}を削除`}
        >
          削除
        </button>
      </div>
    </div>
  );
};

export default UserProfileCard;
```

**対応するCSS:**
```css
.user-profile-card {
  display: flex;
  align-items: center;
  padding: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #ffffff;
  transition: box-shadow 0.2s ease;
  max-width: 400px;
}

.user-profile-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.avatar-container {
  margin-right: 16px;
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #f0f0f0;
}

.user-info {
  flex: 1;
  margin-right: 16px;
}

.user-name {
  margin: 0 0 4px 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.user-email {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.actions {
  display: flex;
  gap: 8px;
}

.edit-button,
.delete-button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s ease;
}

.edit-button {
  background-color: #007bff;
  color: white;
}

.edit-button:hover {
  background-color: #0056b3;
}

.delete-button {
  background-color: #dc3545;
  color: white;
}

.delete-button:hover {
  background-color: #c82333;
}
```

### 例2: Python FastAPI エンドポイント

**プロンプト:**
```
Python FastAPIでユーザー管理APIを作成してください。

エンドポイント:
- GET /users - ユーザー一覧取得（ページネーション対応）
- POST /users - ユーザー作成
- GET /users/{user_id} - 特定ユーザー取得
- PUT /users/{user_id} - ユーザー更新
- DELETE /users/{user_id} - ユーザー削除

要件:
- Pydanticモデルでバリデーション
- エラーハンドリング
- レスポンスモデル定義
- SQLAlchemyでのデータベース操作
```

**生成されるコード:**
```python
from fastapi import FastAPI, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel, EmailStr
from datetime import datetime
import math

# Pydanticモデル
class UserBase(BaseModel):
    name: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None

class UserResponse(UserBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class UserListResponse(BaseModel):
    users: List[UserResponse]
    total: int
    page: int
    per_page: int
    total_pages: int

# APIルーター
app = FastAPI()

@app.get("/users", response_model=UserListResponse)
async def get_users(
    page: int = Query(1, ge=1, description="ページ番号"),
    per_page: int = Query(10, ge=1, le=100, description="1ページあたりの件数"),
    db: Session = Depends(get_db)
):
    """ユーザー一覧を取得（ページネーション対応）"""
    try:
        # 総件数を取得
        total = db.query(User).count()
        
        # ページネーション計算
        offset = (page - 1) * per_page
        total_pages = math.ceil(total / per_page)
        
        # ユーザー一覧を取得
        users = db.query(User).offset(offset).limit(per_page).all()
        
        return UserListResponse(
            users=users,
            total=total,
            page=page,
            per_page=per_page,
            total_pages=total_pages
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail="ユーザー一覧の取得に失敗しました")

@app.post("/users", response_model=UserResponse, status_code=201)
async def create_user(user: UserCreate, db: Session = Depends(get_db)):
    """新しいユーザーを作成"""
    try:
        # メールアドレスの重複チェック
        existing_user = db.query(User).filter(User.email == user.email).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="このメールアドレスは既に使用されています")
        
        # パスワードのハッシュ化
        hashed_password = hash_password(user.password)
        
        # ユーザー作成
        db_user = User(
            name=user.name,
            email=user.email,
            password=hashed_password
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        
        return db_user
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="ユーザーの作成に失敗しました")

@app.get("/users/{user_id}", response_model=UserResponse)
async def get_user(user_id: int, db: Session = Depends(get_db)):
    """特定のユーザーを取得"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="ユーザーが見つかりません")
    return user

@app.put("/users/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: int, 
    user_update: UserUpdate, 
    db: Session = Depends(get_db)
):
    """ユーザー情報を更新"""
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="ユーザーが見つかりません")
        
        # 更新データの適用
        update_data = user_update.dict(exclude_unset=True)
        
        # メールアドレスの重複チェック
        if "email" in update_data:
            existing_user = db.query(User).filter(
                User.email == update_data["email"],
                User.id != user_id
            ).first()
            if existing_user:
                raise HTTPException(status_code=400, detail="このメールアドレスは既に使用されています")
        
        # パスワードのハッシュ化
        if "password" in update_data:
            update_data["password"] = hash_password(update_data["password"])
        
        # 更新実行
        for field, value in update_data.items():
            setattr(user, field, value)
        
        user.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(user)
        
        return user
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="ユーザーの更新に失敗しました")

@app.delete("/users/{user_id}", status_code=204)
async def delete_user(user_id: int, db: Session = Depends(get_db)):
    """ユーザーを削除"""
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="ユーザーが見つかりません")
        
        db.delete(user)
        db.commit()
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="ユーザーの削除に失敗しました")

# ヘルパー関数
def hash_password(password: str) -> str:
    """パスワードをハッシュ化"""
    # 実際の実装では bcrypt などを使用
    import hashlib
    return hashlib.sha256(password.encode()).hexdigest()

def get_db():
    """データベースセッションを取得"""
    # 実際の実装では SQLAlchemy のセッション管理を使用
    pass
```

## 品質向上テクニック

### 1. 詳細な要件指定

**基本的な指示:**
```
ログイン機能を作って
```

**改善された指示:**
```
React TypeScriptでログイン機能を作成してください。

要件:
- メールアドレスとパスワードでの認証
- フォームバリデーション（必須項目、メール形式）
- ローディング状態の表示
- エラーメッセージの表示
- 成功時のリダイレクト処理
- レスポンシブデザイン

技術仕様:
- React Hook Form使用
- Yupでバリデーション
- Axiosで API通信
- Material-UI でスタイリング
```

### 2. コード品質の指定

```
以下の品質要件を満たすコードを生成してください:

- TypeScriptの厳密な型定義
- ESLintルールに準拠
- 適切なエラーハンドリング
- ユニットテスト対応の設計
- アクセシビリティ対応
- パフォーマンス最適化
```

### 3. アーキテクチャパターンの指定

```
Clean Architectureパターンに従って、
以下の層構造でユーザー管理機能を作成してください:

- Presentation Layer (Controllers)
- Application Layer (Use Cases)
- Domain Layer (Entities, Repositories)
- Infrastructure Layer (Database, External APIs)
```

## 生成コードの活用方法

### 1. 段階的な改善

生成されたコードを基に、段階的に改善を重ねます：

```
1. 基本機能の生成
2. エラーハンドリングの追加
3. テストコードの生成
4. パフォーマンス最適化
5. セキュリティ強化
```

### 2. カスタマイズ

プロジェクト固有の要件に合わせてカスタマイズ：

```
「生成されたコードを以下の要件に合わせて修正してください:
- 会社の命名規約に準拠
- 既存のデザインシステムを使用
- 特定のライブラリとの統合」
```

### 3. 統合とテスト

既存のプロジェクトとの統合：

```
「生成されたコンポーネントを既存のプロジェクトに統合し、
必要な import文と型定義を追加してください。

既存のプロジェクト構造:
[プロジェクト構造を提示]」
```

## よくある問題と解決方法

### 問題1: 生成されたコードが複雑すぎる

**解決方法:**
- より具体的で限定的な要件を指定
- 段階的なアプローチを採用
- シンプルな実装を明示的に要求

### 問題2: プロジェクトの規約に合わない

**解決方法:**
- プロジェクトの規約を事前に説明
- 既存のコード例を提供
- 生成後にカスタマイズを依頼

### 問題3: 依存関係の問題

**解決方法:**
- 使用可能なライブラリを明示
- package.jsonの内容を共有
- 代替ライブラリの提案を求める

## 次のステップ

コード生成機能を理解したら：

1. **[ファイル編集](file-editing.md)** - 既存コードの編集方法を学習
2. **[プロジェクトコンテキスト](project-context.md)** - 大規模プロジェクトでの活用
3. **[簡単なアプリ作成](../04-quick-tutorial.md)** - 実践的なチュートリアル

---

**関連ドキュメント:**
- [チャットインターフェース](chat-interface.md) - 効果的なプロンプト作成
- [ファイル編集](file-editing.md) - 既存コードの修正
- [デバッグサポート](debugging-support.md) - エラー解決