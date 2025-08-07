# フィードバック収集・アップデートシステム

Claude Codeドキュメントのユーザーフィードバック収集とアップデートプロセスを管理するシステムです。継続的な品質向上とコミュニティ貢献を促進します。

## 概要

### システムの目的

1. **ユーザーフィードバック収集**
   - ドキュメントの改善提案
   - エラー報告
   - 新機能リクエスト
   - 使用体験の共有

2. **アップデートプロセス管理**
   - バージョン管理
   - 変更履歴の記録
   - リリースノート生成
   - 自動更新通知

3. **コミュニティ参加促進**
   - 貢献者の認識
   - 改善提案の追跡
   - 議論の促進

## システム構成

```
tools/feedback-system/
├── README.md                    # このファイル
├── package.json                 # 依存関係定義
├── config/                      # 設定ファイル
│   ├── feedback-config.json    # フィードバック設定
│   ├── update-config.json      # アップデート設定
│   └── notification-config.json # 通知設定
├── scripts/                     # 実行スクリプト
│   ├── collect-feedback.js     # フィードバック収集
│   ├── process-feedback.js     # フィードバック処理
│   ├── generate-changelog.js   # 変更履歴生成
│   ├── create-release.js       # リリース作成
│   └── notify-updates.js       # 更新通知
├── lib/                         # ライブラリ
│   ├── feedback-collector.js   # フィードバック収集機能
│   ├── feedback-processor.js   # フィードバック処理機能
│   ├── version-manager.js      # バージョン管理
│   ├── changelog-generator.js  # 変更履歴生成
│   └── notification-sender.js  # 通知送信
├── templates/                   # テンプレート
│   ├── issue-templates/        # GitHub Issue テンプレート
│   ├── pr-templates/           # Pull Request テンプレート
│   ├── changelog-template.md   # 変更履歴テンプレート
│   └── release-notes-template.md # リリースノートテンプレート
├── data/                        # データ保存
│   ├── feedback/               # フィードバックデータ
│   ├── analytics/              # 分析データ
│   └── versions/               # バージョン情報
└── web/                         # Web インターフェース
    ├── index.html              # フィードバックフォーム
    ├── dashboard.html          # 管理ダッシュボード
    ├── css/
    └── js/
```

## フィードバック収集システム

### 1. GitHub Issues テンプレート

**.github/ISSUE_TEMPLATE/documentation-improvement.md**:
```markdown
---
name: ドキュメント改善提案
about: ドキュメントの改善や修正を提案する
title: '[DOCS] '
labels: ['documentation', 'enhancement']
assignees: ''
---

## 📄 対象ドキュメント
<!-- 改善したいドキュメントのパスまたはURL -->

## 🎯 改善提案
<!-- 具体的な改善内容を記載 -->

### 現在の問題
<!-- 現在のドキュメントの問題点 -->

### 提案する改善内容
<!-- どのように改善したいか -->

### 改善理由
<!-- なぜこの改善が必要か -->

## 📊 影響範囲
- [ ] 初心者向けコンテンツ
- [ ] 中級者向けコンテンツ
- [ ] 上級者向けコンテンツ
- [ ] チーム開発関連
- [ ] サンプルコード
- [ ] その他: 

## 🔗 関連情報
<!-- 関連するドキュメントやリソースがあれば記載 -->

## ✅ チェックリスト
- [ ] 既存のIssueで同様の提案がないことを確認した
- [ ] 具体的で実行可能な改善提案である
- [ ] 改善の理由が明確である
```

**.github/ISSUE_TEMPLATE/bug-report.md**:
```markdown
---
name: バグ報告
about: ドキュメントのエラーや問題を報告する
title: '[BUG] '
labels: ['bug', 'documentation']
assignees: ''
---

## 🐛 問題の概要
<!-- 発見した問題を簡潔に説明 -->

## 📄 対象ドキュメント
<!-- 問題があるドキュメントのパスまたはURL -->

## 🔍 問題の詳細

### 期待される内容
<!-- 正しくはどうあるべきか -->

### 実際の内容
<!-- 現在どうなっているか -->

### 問題の種類
- [ ] リンク切れ
- [ ] コードエラー
- [ ] 情報の不正確性
- [ ] 誤字・脱字
- [ ] 構造・フォーマットの問題
- [ ] その他: 

## 🌍 環境情報
- **OS**: 
- **ブラウザ**: 
- **デバイス**: 

## 📸 スクリーンショット
<!-- 可能であれば問題のスクリーンショットを添付 -->

## 🔗 関連情報
<!-- 関連するドキュメントやリソースがあれば記載 -->

## ✅ チェックリスト
- [ ] 既存のIssueで同様の報告がないことを確認した
- [ ] 問題を再現できることを確認した
- [ ] 必要な情報を提供した
```

**.github/ISSUE_TEMPLATE/feature-request.md**:
```markdown
---
name: 機能リクエスト
about: 新しい機能やコンテンツを提案する
title: '[FEATURE] '
labels: ['enhancement', 'feature-request']
assignees: ''
---

## 💡 機能・コンテンツ提案
<!-- 提案する機能やコンテンツを簡潔に説明 -->

## 🎯 解決したい課題
<!-- この機能・コンテンツで解決したい問題 -->

## 📋 詳細な説明

### 提案内容
<!-- 具体的にどのような機能・コンテンツか -->

### 使用場面
<!-- どのような場面で使用されるか -->

### 期待される効果
<!-- この機能・コンテンツによって得られる効果 -->

## 🎨 実装イメージ
<!-- 可能であれば、実装のイメージやサンプルを記載 -->

## 📊 優先度
- [ ] 高 - 多くのユーザーに影響する重要な機能
- [ ] 中 - 特定のユースケースで有用な機能
- [ ] 低 - あると便利だが必須ではない機能

## 🔗 参考資料
<!-- 参考になるドキュメントやリソースがあれば記載 -->

## ✅ チェックリスト
- [ ] 既存の機能で代替できないことを確認した
- [ ] 具体的で実現可能な提案である
- [ ] 提案の価値が明確である
```

### 2. フィードバック収集スクリプト

**lib/feedback-collector.js**:
```javascript
const { Octokit } = require('@octokit/rest');
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

class FeedbackCollector {
  constructor(config) {
    this.config = config;
    this.octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN
    });
    this.owner = config.repository.owner;
    this.repo = config.repository.name;
  }

  async collectAllFeedback() {
    console.log(chalk.blue('📥 フィードバック収集を開始します...'));
    
    const feedback = {
      timestamp: new Date().toISOString(),
      issues: await this.collectIssues(),
      pullRequests: await this.collectPullRequests(),
      discussions: await this.collectDiscussions(),
      analytics: await this.collectAnalytics()
    };
    
    await this.saveFeedback(feedback);
    return feedback;
  }

  async collectIssues() {
    console.log(chalk.gray('📋 Issues を収集中...'));
    
    const issues = await this.octokit.paginate(this.octokit.rest.issues.listForRepo, {
      owner: this.owner,
      repo: this.repo,
      labels: 'documentation',
      state: 'all',
      sort: 'updated',
      direction: 'desc'
    });

    return issues.map(issue => ({
      id: issue.id,
      number: issue.number,
      title: issue.title,
      body: issue.body,
      state: issue.state,
      labels: issue.labels.map(label => label.name),
      author: issue.user.login,
      created_at: issue.created_at,
      updated_at: issue.updated_at,
      comments_count: issue.comments,
      reactions: issue.reactions
    }));
  }

  async collectPullRequests() {
    console.log(chalk.gray('🔄 Pull Requests を収集中...'));
    
    const prs = await this.octokit.paginate(this.octokit.rest.pulls.list, {
      owner: this.owner,
      repo: this.repo,
      state: 'all',
      sort: 'updated',
      direction: 'desc'
    });

    const documentationPRs = prs.filter(pr => 
      pr.title.toLowerCase().includes('doc') ||
      pr.labels.some(label => label.name === 'documentation')
    );

    return documentationPRs.map(pr => ({
      id: pr.id,
      number: pr.number,
      title: pr.title,
      body: pr.body,
      state: pr.state,
      author: pr.user.login,
      created_at: pr.created_at,
      updated_at: pr.updated_at,
      merged_at: pr.merged_at,
      files_changed: pr.changed_files,
      additions: pr.additions,
      deletions: pr.deletions
    }));
  }

  async collectDiscussions() {
    console.log(chalk.gray('💬 Discussions を収集中...'));
    
    try {
      const query = `
        query($owner: String!, $repo: String!) {
          repository(owner: $owner, name: $repo) {
            discussions(first: 100, orderBy: {field: UPDATED_AT, direction: DESC}) {
              nodes {
                id
                title
                body
                category {
                  name
                }
                author {
                  login
                }
                createdAt
                updatedAt
                comments(first: 10) {
                  totalCount
                }
                reactions(first: 10) {
                  totalCount
                }
              }
            }
          }
        }
      `;

      const result = await this.octokit.graphql(query, {
        owner: this.owner,
        repo: this.repo
      });

      return result.repository.discussions.nodes.map(discussion => ({
        id: discussion.id,
        title: discussion.title,
        body: discussion.body,
        category: discussion.category.name,
        author: discussion.author.login,
        created_at: discussion.createdAt,
        updated_at: discussion.updatedAt,
        comments_count: discussion.comments.totalCount,
        reactions_count: discussion.reactions.totalCount
      }));
    } catch (error) {
      console.log(chalk.yellow('⚠️ Discussions の収集をスキップしました (権限不足の可能性)'));
      return [];
    }
  }

  async collectAnalytics() {
    console.log(chalk.gray('📊 分析データを収集中...'));
    
    // GitHub API から取得可能な基本的な分析データ
    const analytics = {
      repository: await this.getRepositoryStats(),
      traffic: await this.getTrafficStats(),
      contributors: await this.getContributorStats()
    };

    return analytics;
  }

  async getRepositoryStats() {
    const repo = await this.octokit.rest.repos.get({
      owner: this.owner,
      repo: this.repo
    });

    return {
      stars: repo.data.stargazers_count,
      forks: repo.data.forks_count,
      watchers: repo.data.watchers_count,
      open_issues: repo.data.open_issues_count,
      size: repo.data.size,
      language: repo.data.language,
      updated_at: repo.data.updated_at
    };
  }

  async getTrafficStats() {
    try {
      const [views, clones] = await Promise.all([
        this.octokit.rest.repos.getViews({
          owner: this.owner,
          repo: this.repo
        }),
        this.octokit.rest.repos.getClones({
          owner: this.owner,
          repo: this.repo
        })
      ]);

      return {
        views: {
          count: views.data.count,
          uniques: views.data.uniques
        },
        clones: {
          count: clones.data.count,
          uniques: clones.data.uniques
        }
      };
    } catch (error) {
      console.log(chalk.yellow('⚠️ トラフィック統計の取得をスキップしました (権限不足の可能性)'));
      return null;
    }
  }

  async getContributorStats() {
    const contributors = await this.octokit.paginate(this.octokit.rest.repos.listContributors, {
      owner: this.owner,
      repo: this.repo
    });

    return contributors.map(contributor => ({
      login: contributor.login,
      contributions: contributor.contributions,
      avatar_url: contributor.avatar_url
    }));
  }

  async saveFeedback(feedback) {
    const dataPath = path.resolve(__dirname, '../data/feedback');
    await fs.ensureDir(dataPath);
    
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `feedback-${timestamp}.json`;
    
    await fs.writeJson(path.join(dataPath, filename), feedback, { spaces: 2 });
    await fs.writeJson(path.join(dataPath, 'latest.json'), feedback, { spaces: 2 });
    
    console.log(chalk.green(`✅ フィードバックを保存しました: ${filename}`));
  }

  async analyzeFeedback(feedback) {
    console.log(chalk.blue('📊 フィードバック分析を実行中...'));
    
    const analysis = {
      summary: {
        total_issues: feedback.issues.length,
        open_issues: feedback.issues.filter(i => i.state === 'open').length,
        total_prs: feedback.pullRequests.length,
        merged_prs: feedback.pullRequests.filter(pr => pr.merged_at).length,
        total_discussions: feedback.discussions.length
      },
      categories: this.categorizeIssues(feedback.issues),
      trends: this.analyzeTrends(feedback),
      top_contributors: this.getTopContributors(feedback),
      priority_items: this.identifyPriorityItems(feedback)
    };

    return analysis;
  }

  categorizeIssues(issues) {
    const categories = {
      'bug': 0,
      'enhancement': 0,
      'documentation': 0,
      'feature-request': 0,
      'question': 0,
      'other': 0
    };

    issues.forEach(issue => {
      let categorized = false;
      issue.labels.forEach(label => {
        if (categories.hasOwnProperty(label)) {
          categories[label]++;
          categorized = true;
        }
      });
      
      if (!categorized) {
        categories.other++;
      }
    });

    return categories;
  }

  analyzeTrends(feedback) {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const recentIssues = feedback.issues.filter(issue => 
      new Date(issue.created_at) > thirtyDaysAgo
    );
    
    const recentPRs = feedback.pullRequests.filter(pr => 
      new Date(pr.created_at) > thirtyDaysAgo
    );

    return {
      recent_issues: recentIssues.length,
      recent_prs: recentPRs.length,
      issue_resolution_rate: this.calculateResolutionRate(feedback.issues),
      pr_merge_rate: this.calculateMergeRate(feedback.pullRequests)
    };
  }

  calculateResolutionRate(issues) {
    const closedIssues = issues.filter(issue => issue.state === 'closed');
    return issues.length > 0 ? (closedIssues.length / issues.length * 100).toFixed(1) : 0;
  }

  calculateMergeRate(prs) {
    const mergedPRs = prs.filter(pr => pr.merged_at);
    return prs.length > 0 ? (mergedPRs.length / prs.length * 100).toFixed(1) : 0;
  }

  getTopContributors(feedback) {
    const contributors = {};
    
    // Issues からの貢献
    feedback.issues.forEach(issue => {
      if (!contributors[issue.author]) {
        contributors[issue.author] = { issues: 0, prs: 0, total: 0 };
      }
      contributors[issue.author].issues++;
      contributors[issue.author].total++;
    });
    
    // PRs からの貢献
    feedback.pullRequests.forEach(pr => {
      if (!contributors[pr.author]) {
        contributors[pr.author] = { issues: 0, prs: 0, total: 0 };
      }
      contributors[pr.author].prs++;
      contributors[pr.author].total++;
    });

    return Object.entries(contributors)
      .sort(([,a], [,b]) => b.total - a.total)
      .slice(0, 10)
      .map(([author, stats]) => ({ author, ...stats }));
  }

  identifyPriorityItems(feedback) {
    const openIssues = feedback.issues.filter(issue => issue.state === 'open');
    
    // 優先度の計算（コメント数、リアクション数、ラベルに基づく）
    const priorityItems = openIssues.map(issue => {
      let priority = 0;
      
      // コメント数による優先度
      priority += issue.comments_count * 2;
      
      // リアクション数による優先度
      priority += (issue.reactions.total_count || 0) * 3;
      
      // ラベルによる優先度
      if (issue.labels.includes('bug')) priority += 10;
      if (issue.labels.includes('high-priority')) priority += 15;
      if (issue.labels.includes('good-first-issue')) priority += 5;
      
      return {
        ...issue,
        priority_score: priority
      };
    });

    return priorityItems
      .sort((a, b) => b.priority_score - a.priority_score)
      .slice(0, 10);
  }
}

module.exports = FeedbackCollector;
```

### 3. バージョン管理・変更履歴システム

**lib/version-manager.js**:
```javascript
const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk');

class VersionManager {
  constructor(config) {
    this.config = config;
    this.versionsPath = path.resolve(__dirname, '../data/versions');
  }

  async getCurrentVersion() {
    try {
      const packagePath = path.resolve(__dirname, '../../package.json');
      if (await fs.pathExists(packagePath)) {
        const pkg = await fs.readJson(packagePath);
        return pkg.version || '1.0.0';
      }
    } catch (error) {
      console.log(chalk.yellow('⚠️ package.json が見つかりません。デフォルトバージョンを使用します。'));
    }
    
    return '1.0.0';
  }

  async createNewVersion(type = 'patch') {
    console.log(chalk.blue(`📦 新しい${type}バージョンを作成中...`));
    
    const currentVersion = await this.getCurrentVersion();
    const newVersion = this.incrementVersion(currentVersion, type);
    
    const versionInfo = {
      version: newVersion,
      previous_version: currentVersion,
      type: type,
      created_at: new Date().toISOString(),
      changes: await this.collectChanges(currentVersion),
      statistics: await this.collectStatistics()
    };

    await this.saveVersionInfo(versionInfo);
    await this.updatePackageVersion(newVersion);
    
    console.log(chalk.green(`✅ バージョン ${newVersion} を作成しました`));
    return versionInfo;
  }

  incrementVersion(version, type) {
    const [major, minor, patch] = version.split('.').map(Number);
    
    switch (type) {
      case 'major':
        return `${major + 1}.0.0`;
      case 'minor':
        return `${major}.${minor + 1}.0`;
      case 'patch':
      default:
        return `${major}.${minor}.${patch + 1}`;
    }
  }

  async collectChanges(fromVersion) {
    console.log(chalk.gray('📝 変更内容を収集中...'));
    
    try {
      // Git ログから変更を取得
      const gitLog = execSync(
        `git log --oneline --grep="docs:" --grep="feat:" --grep="fix:" --since="1 month ago"`,
        { encoding: 'utf8' }
      );
      
      const commits = gitLog.trim().split('\n').filter(line => line.trim());
      
      const changes = {
        features: [],
        improvements: [],
        fixes: [],
        documentation: []
      };

      commits.forEach(commit => {
        const [hash, ...messageParts] = commit.split(' ');
        const message = messageParts.join(' ');
        
        if (message.startsWith('feat:')) {
          changes.features.push({
            hash: hash,
            message: message.replace('feat:', '').trim()
          });
        } else if (message.startsWith('fix:')) {
          changes.fixes.push({
            hash: hash,
            message: message.replace('fix:', '').trim()
          });
        } else if (message.startsWith('docs:')) {
          changes.documentation.push({
            hash: hash,
            message: message.replace('docs:', '').trim()
          });
        } else {
          changes.improvements.push({
            hash: hash,
            message: message
          });
        }
      });

      return changes;
    } catch (error) {
      console.log(chalk.yellow('⚠️ Git ログの取得に失敗しました'));
      return {
        features: [],
        improvements: [],
        fixes: [],
        documentation: []
      };
    }
  }

  async collectStatistics() {
    console.log(chalk.gray('📊 統計情報を収集中...'));
    
    try {
      const docsPath = path.resolve(__dirname, '../../../docs');
      const stats = {
        total_files: 0,
        total_lines: 0,
        total_words: 0,
        file_types: {}
      };

      const files = await this.getAllFiles(docsPath);
      
      for (const file of files) {
        const ext = path.extname(file);
        stats.file_types[ext] = (stats.file_types[ext] || 0) + 1;
        stats.total_files++;
        
        if (ext === '.md') {
          const content = await fs.readFile(file, 'utf8');
          const lines = content.split('\n').length;
          const words = content.split(/\s+/).filter(word => word.length > 0).length;
          
          stats.total_lines += lines;
          stats.total_words += words;
        }
      }

      return stats;
    } catch (error) {
      console.log(chalk.yellow('⚠️ 統計情報の収集に失敗しました'));
      return {};
    }
  }

  async getAllFiles(dir) {
    const files = [];
    const items = await fs.readdir(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = await fs.stat(fullPath);
      
      if (stat.isDirectory()) {
        files.push(...await this.getAllFiles(fullPath));
      } else {
        files.push(fullPath);
      }
    }
    
    return files;
  }

  async saveVersionInfo(versionInfo) {
    await fs.ensureDir(this.versionsPath);
    
    const filename = `version-${versionInfo.version}.json`;
    await fs.writeJson(path.join(this.versionsPath, filename), versionInfo, { spaces: 2 });
    await fs.writeJson(path.join(this.versionsPath, 'latest.json'), versionInfo, { spaces: 2 });
  }

  async updatePackageVersion(version) {
    try {
      const packagePath = path.resolve(__dirname, '../../package.json');
      if (await fs.pathExists(packagePath)) {
        const pkg = await fs.readJson(packagePath);
        pkg.version = version;
        await fs.writeJson(packagePath, pkg, { spaces: 2 });
      }
    } catch (error) {
      console.log(chalk.yellow('⚠️ package.json の更新に失敗しました'));
    }
  }

  async getVersionHistory() {
    await fs.ensureDir(this.versionsPath);
    
    const files = await fs.readdir(this.versionsPath);
    const versionFiles = files.filter(file => file.startsWith('version-') && file.endsWith('.json'));
    
    const versions = [];
    for (const file of versionFiles) {
      const versionInfo = await fs.readJson(path.join(this.versionsPath, file));
      versions.push(versionInfo);
    }
    
    return versions.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }
}

module.exports = VersionManager;
```

### 4. 変更履歴・リリースノート生成

**lib/changelog-generator.js**:
```javascript
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

class ChangelogGenerator {
  constructor(config) {
    this.config = config;
    this.templatePath = path.resolve(__dirname, '../templates');
  }

  async generateChangelog(versionInfo) {
    console.log(chalk.blue('📋 変更履歴を生成中...'));
    
    const template = await this.loadTemplate('changelog-template.md');
    const changelog = this.renderTemplate(template, versionInfo);
    
    const changelogPath = path.resolve(__dirname, '../../../CHANGELOG.md');
    await this.updateChangelog(changelogPath, changelog);
    
    console.log(chalk.green('✅ 変更履歴を更新しました'));
    return changelog;
  }

  async generateReleaseNotes(versionInfo) {
    console.log(chalk.blue('📄 リリースノートを生成中...'));
    
    const template = await this.loadTemplate('release-notes-template.md');
    const releaseNotes = this.renderTemplate(template, versionInfo);
    
    const releasePath = path.resolve(__dirname, '../data/releases');
    await fs.ensureDir(releasePath);
    
    const filename = `release-${versionInfo.version}.md`;
    await fs.writeFile(path.join(releasePath, filename), releaseNotes);
    
    console.log(chalk.green(`✅ リリースノートを生成しました: ${filename}`));
    return releaseNotes;
  }

  async loadTemplate(templateName) {
    const templatePath = path.join(this.templatePath, templateName);
    
    if (await fs.pathExists(templatePath)) {
      return await fs.readFile(templatePath, 'utf8');
    }
    
    // デフォルトテンプレート
    return this.getDefaultTemplate(templateName);
  }

  getDefaultTemplate(templateName) {
    if (templateName === 'changelog-template.md') {
      return `# 変更履歴

## [{{version}}] - {{date}}

### 🚀 新機能
{{#each changes.features}}
- {{message}} ({{hash}})
{{/each}}

### 🐛 バグ修正
{{#each changes.fixes}}
- {{message}} ({{hash}})
{{/each}}

### 📝 ドキュメント
{{#each changes.documentation}}
- {{message}} ({{hash}})
{{/each}}

### ✨ 改善
{{#each changes.improvements}}
- {{message}} ({{hash}})
{{/each}}

### 📊 統計
- 総ファイル数: {{statistics.total_files}}
- 総行数: {{statistics.total_lines}}
- 総単語数: {{statistics.total_words}}

---
`;
    }
    
    if (templateName === 'release-notes-template.md') {
      return `# Claude Code ドキュメント v{{version}}

**リリース日**: {{date}}

## 🎉 このリリースについて

このリリースでは、Claude Codeドキュメントの品質向上と新機能の追加を行いました。

## 🚀 新機能

{{#each changes.features}}
### {{message}}
{{/each}}

## 🐛 修正された問題

{{#each changes.fixes}}
- {{message}}
{{/each}}

## 📝 ドキュメント更新

{{#each changes.documentation}}
- {{message}}
{{/each}}

## ✨ 改善点

{{#each changes.improvements}}
- {{message}}
{{/each}}

## 📊 このリリースの統計

- **総ファイル数**: {{statistics.total_files}}
- **総行数**: {{statistics.total_lines}}
- **総単語数**: {{statistics.total_words}}

## 🙏 貢献者

このリリースに貢献してくださった皆様に感謝いたします。

## 📥 フィードバック

ご質問やフィードバックがございましたら、[GitHub Issues](https://github.com/your-org/claude-code-docs/issues) でお知らせください。

---

**前回のリリース**: [v{{previous_version}}](https://github.com/your-org/claude-code-docs/releases/tag/v{{previous_version}})
`;
    }
    
    return '';
  }

  renderTemplate(template, data) {
    let rendered = template;
    
    // 基本的な変数置換
    rendered = rendered.replace(/\{\{version\}\}/g, data.version);
    rendered = rendered.replace(/\{\{previous_version\}\}/g, data.previous_version);
    rendered = rendered.replace(/\{\{date\}\}/g, new Date(data.created_at).toLocaleDateString('ja-JP'));
    
    // 統計情報の置換
    if (data.statistics) {
      rendered = rendered.replace(/\{\{statistics\.total_files\}\}/g, data.statistics.total_files || 0);
      rendered = rendered.replace(/\{\{statistics\.total_lines\}\}/g, data.statistics.total_lines || 0);
      rendered = rendered.replace(/\{\{statistics\.total_words\}\}/g, data.statistics.total_words || 0);
    }
    
    // 変更内容のループ処理
    rendered = this.renderChangesList(rendered, 'features', data.changes?.features || []);
    rendered = this.renderChangesList(rendered, 'fixes', data.changes?.fixes || []);
    rendered = this.renderChangesList(rendered, 'documentation', data.changes?.documentation || []);
    rendered = this.renderChangesList(rendered, 'improvements', data.changes?.improvements || []);
    
    return rendered;
  }

  renderChangesList(template, type, changes) {
    const regex = new RegExp(`\\{\\{#each changes\\.${type}\\}\\}([\\s\\S]*?)\\{\\{/each\\}\\}`, 'g');
    
    return template.replace(regex, (match, itemTemplate) => {
      if (changes.length === 0) {
        return '- 変更なし\n';
      }
      
      return changes.map(change => {
        return itemTemplate
          .replace(/\{\{message\}\}/g, change.message)
          .replace(/\{\{hash\}\}/g, change.hash);
      }).join('');
    });
  }

  async updateChangelog(changelogPath, newEntry) {
    let existingChangelog = '';
    
    if (await fs.pathExists(changelogPath)) {
      existingChangelog = await fs.readFile(changelogPath, 'utf8');
    } else {
      existingChangelog = '# 変更履歴\n\n';
    }
    
    // 新しいエントリを先頭に追加
    const lines = existingChangelog.split('\n');
    const headerIndex = lines.findIndex(line => line.startsWith('# '));
    
    if (headerIndex !== -1) {
      lines.splice(headerIndex + 1, 0, '', newEntry);
    } else {
      lines.unshift(newEntry);
    }
    
    await fs.writeFile(changelogPath, lines.join('\n'));
  }
}

module.exports = ChangelogGenerator;
```

### 5. 通知システム

**lib/notification-sender.js**:
```javascript
const axios = require('axios');
const chalk = require('chalk');

class NotificationSender {
  constructor(config) {
    this.config = config;
  }

  async sendUpdateNotification(versionInfo, releaseNotes) {
    console.log(chalk.blue('📢 更新通知を送信中...'));
    
    const notifications = [];
    
    if (this.config.slack?.webhook_url) {
      notifications.push(this.sendSlackNotification(versionInfo, releaseNotes));
    }
    
    if (this.config.discord?.webhook_url) {
      notifications.push(this.sendDiscordNotification(versionInfo, releaseNotes));
    }
    
    if (this.config.email?.enabled) {
      notifications.push(this.sendEmailNotification(versionInfo, releaseNotes));
    }
    
    const results = await Promise.allSettled(notifications);
    
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        console.log(chalk.green(`✅ 通知 ${index + 1} を送信しました`));
      } else {
        console.log(chalk.red(`❌ 通知 ${index + 1} の送信に失敗しました: ${result.reason}`));
      }
    });
  }

  async sendSlackNotification(versionInfo, releaseNotes) {
    const message = {
      text: `📚 Claude Code ドキュメント v${versionInfo.version} がリリースされました！`,
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: `📚 Claude Code ドキュメント v${versionInfo.version}`
          }
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `新しいバージョンがリリースされました！\n\n*リリース日*: ${new Date(versionInfo.created_at).toLocaleDateString('ja-JP')}`
          }
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: this.formatChangesForSlack(versionInfo.changes)
          }
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: '📖 ドキュメントを見る'
              },
              url: this.config.documentation_url || 'https://github.com/your-org/claude-code-docs'
            },
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: '🔄 変更履歴を見る'
              },
              url: `${this.config.repository_url}/blob/main/CHANGELOG.md`
            }
          ]
        }
      ]
    };

    await axios.post(this.config.slack.webhook_url, message);
  }

  async sendDiscordNotification(versionInfo, releaseNotes) {
    const embed = {
      title: `📚 Claude Code ドキュメント v${versionInfo.version}`,
      description: '新しいバージョンがリリースされました！',
      color: 0x00ff00,
      fields: [
        {
          name: '📅 リリース日',
          value: new Date(versionInfo.created_at).toLocaleDateString('ja-JP'),
          inline: true
        },
        {
          name: '🚀 新機能',
          value: versionInfo.changes.features.length > 0 
            ? versionInfo.changes.features.slice(0, 3).map(f => `• ${f.message}`).join('\n')
            : 'なし',
          inline: false
        },
        {
          name: '🐛 バグ修正',
          value: versionInfo.changes.fixes.length > 0
            ? versionInfo.changes.fixes.slice(0, 3).map(f => `• ${f.message}`).join('\n')
            : 'なし',
          inline: false
        }
      ],
      footer: {
        text: 'Claude Code Documentation'
      },
      timestamp: versionInfo.created_at
    };

    const message = {
      embeds: [embed]
    };

    await axios.post(this.config.discord.webhook_url, message);
  }

  async sendEmailNotification(versionInfo, releaseNotes) {
    // メール送信の実装（SendGrid、AWS SES等を使用）
    console.log(chalk.yellow('📧 メール通知は未実装です'));
  }

  formatChangesForSlack(changes) {
    let text = '';
    
    if (changes.features.length > 0) {
      text += `*🚀 新機能 (${changes.features.length})*\n`;
      changes.features.slice(0, 3).forEach(feature => {
        text += `• ${feature.message}\n`;
      });
      if (changes.features.length > 3) {
        text += `• ...他 ${changes.features.length - 3} 件\n`;
      }
      text += '\n';
    }
    
    if (changes.fixes.length > 0) {
      text += `*🐛 バグ修正 (${changes.fixes.length})*\n`;
      changes.fixes.slice(0, 3).forEach(fix => {
        text += `• ${fix.message}\n`;
      });
      if (changes.fixes.length > 3) {
        text += `• ...他 ${changes.fixes.length - 3} 件\n`;
      }
      text += '\n';
    }
    
    if (changes.documentation.length > 0) {
      text += `*📝 ドキュメント更新 (${changes.documentation.length})*\n`;
      changes.documentation.slice(0, 2).forEach(doc => {
        text += `• ${doc.message}\n`;
      });
      if (changes.documentation.length > 2) {
        text += `• ...他 ${changes.documentation.length - 2} 件\n`;
      }
    }
    
    return text || '変更内容の詳細は変更履歴をご確認ください。';
  }
}

module.exports = NotificationSender;
```

### 6. 統合実行スクリプト

**scripts/create-release.js**:
```javascript
#!/usr/bin/env node

const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');
const FeedbackCollector = require('../lib/feedback-collector');
const VersionManager = require('../lib/version-manager');
const ChangelogGenerator = require('../lib/changelog-generator');
const NotificationSender = require('../lib/notification-sender');

async function main() {
  console.log(chalk.bold.blue('🚀 Claude Code ドキュメント リリース作成'));
  console.log('='.repeat(50));
  
  const configPath = path.resolve(__dirname, '../config');
  
  try {
    // 設定ファイル読み込み
    const feedbackConfig = await fs.readJson(path.join(configPath, 'feedback-config.json'));
    const updateConfig = await fs.readJson(path.join(configPath, 'update-config.json'));
    const notificationConfig = await fs.readJson(path.join(configPath, 'notification-config.json'));
    
    // コマンドライン引数の処理
    const args = process.argv.slice(2);
    const versionType = args[0] || 'patch'; // major, minor, patch
    
    if (!['major', 'minor', 'patch'].includes(versionType)) {
      console.error(chalk.red('❌ バージョンタイプは major, minor, patch のいずれかを指定してください'));
      process.exit(1);
    }
    
    console.log(chalk.blue(`📦 ${versionType} リリースを作成します...`));
    
    // 1. フィードバック収集
    console.log('\n' + chalk.bold('1. フィードバック収集'));
    const feedbackCollector = new FeedbackCollector(feedbackConfig);
    const feedback = await feedbackCollector.collectAllFeedback();
    const analysis = await feedbackCollector.analyzeFeedback(feedback);
    
    console.log(chalk.green(`✅ フィードバック収集完了:`));
    console.log(`  - Issues: ${analysis.summary.total_issues} (Open: ${analysis.summary.open_issues})`);
    console.log(`  - PRs: ${analysis.summary.total_prs} (Merged: ${analysis.summary.merged_prs})`);
    console.log(`  - Discussions: ${analysis.summary.total_discussions}`);
    
    // 2. バージョン作成
    console.log('\n' + chalk.bold('2. バージョン作成'));
    const versionManager = new VersionManager(updateConfig);
    const versionInfo = await versionManager.createNewVersion(versionType);
    
    console.log(chalk.green(`✅ バージョン作成完了: v${versionInfo.version}`));
    
    // 3. 変更履歴・リリースノート生成
    console.log('\n' + chalk.bold('3. ドキュメント生成'));
    const changelogGenerator = new ChangelogGenerator(updateConfig);
    
    const changelog = await changelogGenerator.generateChangelog(versionInfo);
    const releaseNotes = await changelogGenerator.generateReleaseNotes(versionInfo);
    
    console.log(chalk.green('✅ ドキュメント生成完了'));
    
    // 4. 通知送信
    console.log('\n' + chalk.bold('4. 通知送信'));
    const notificationSender = new NotificationSender(notificationConfig);
    await notificationSender.sendUpdateNotification(versionInfo, releaseNotes);
    
    // 5. GitHub Release作成（オプション）
    if (process.env.GITHUB_TOKEN && updateConfig.create_github_release) {
      console.log('\n' + chalk.bold('5. GitHub Release作成'));
      await createGitHubRelease(versionInfo, releaseNotes, feedbackConfig);
    }
    
    // 結果サマリー
    console.log('\n' + chalk.bold.green('🎉 リリース作成完了！'));
    console.log('='.repeat(30));
    console.log(`バージョン: v${versionInfo.version}`);
    console.log(`作成日時: ${new Date(versionInfo.created_at).toLocaleString('ja-JP')}`);
    console.log(`変更内容:`);
    console.log(`  - 新機能: ${versionInfo.changes.features.length}`);
    console.log(`  - バグ修正: ${versionInfo.changes.fixes.length}`);
    console.log(`  - ドキュメント更新: ${versionInfo.changes.documentation.length}`);
    console.log(`  - その他改善: ${versionInfo.changes.improvements.length}`);
    
    console.log('\n📄 生成されたファイル:');
    console.log(`  - CHANGELOG.md (更新)`);
    console.log(`  - tools/feedback-system/data/releases/release-${versionInfo.version}.md`);
    console.log(`  - tools/feedback-system/data/versions/version-${versionInfo.version}.json`);
    
  } catch (error) {
    console.error(chalk.red('❌ リリース作成中にエラーが発生しました:'));
    console.error(error);
    process.exit(1);
  }
}

async function createGitHubRelease(versionInfo, releaseNotes, config) {
  const { Octokit } = require('@octokit/rest');
  
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
  });
  
  try {
    const release = await octokit.rest.repos.createRelease({
      owner: config.repository.owner,
      repo: config.repository.name,
      tag_name: `v${versionInfo.version}`,
      name: `v${versionInfo.version}`,
      body: releaseNotes,
      draft: false,
      prerelease: false
    });
    
    console.log(chalk.green(`✅ GitHub Release作成完了: ${release.data.html_url}`));
  } catch (error) {
    console.log(chalk.yellow(`⚠️ GitHub Release作成に失敗しました: ${error.message}`));
  }
}

if (require.main === module) {
  main();
}

module.exports = main;
```

### 7. 設定ファイル例

**config/feedback-config.json**:
```json
{
  "repository": {
    "owner": "your-org",
    "name": "claude-code-docs"
  },
  "collection": {
    "include_closed_issues": true,
    "max_age_days": 90,
    "labels": ["documentation", "enhancement", "bug"],
    "exclude_authors": ["dependabot", "github-actions"]
  },
  "analysis": {
    "priority_threshold": 10,
    "trending_period_days": 30,
    "top_contributors_count": 10
  }
}
```

**config/notification-config.json**:
```json
{
  "slack": {
    "webhook_url": "https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK",
    "channel": "#documentation",
    "enabled": true
  },
  "discord": {
    "webhook_url": "https://discord.com/api/webhooks/YOUR/DISCORD/WEBHOOK",
    "enabled": false
  },
  "email": {
    "enabled": false,
    "service": "sendgrid",
    "api_key": "YOUR_SENDGRID_API_KEY",
    "from": "docs@yourcompany.com",
    "subscribers": []
  },
  "documentation_url": "https://your-org.github.io/claude-code-docs",
  "repository_url": "https://github.com/your-org/claude-code-docs"
}
```

## 使用方法

### 1. セットアップ

```bash
cd tools/feedback-system
npm install

# 環境変数設定
export GITHUB_TOKEN="your_github_token"
```

### 2. フィードバック収集

```bash
# 全フィードバック収集
npm run collect

# 分析レポート生成
npm run analyze
```

### 3. リリース作成

```bash
# パッチリリース
npm run release

# マイナーリリース
npm run release minor

# メジャーリリース
npm run release major
```

### 4. 定期実行設定

```bash
# crontab設定例
# 毎日午前2時にフィードバック収集
0 2 * * * cd /path/to/tools/feedback-system && npm run collect

# 毎週月曜日午前9時に分析レポート生成
0 9 * * 1 cd /path/to/tools/feedback-system && npm run analyze
```

## GitHub Actions統合

**.github/workflows/feedback-collection.yml**:
```yaml
name: Feedback Collection

on:
  schedule:
    # 毎日午前2時に実行
    - cron: '0 2 * * *'
  workflow_dispatch:

jobs:
  collect-feedback:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: 'tools/feedback-system/package-lock.json'
      
      - name: Install dependencies
        run: |
          cd tools/feedback-system
          npm ci
      
      - name: Collect feedback
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          cd tools/feedback-system
          npm run collect
      
      - name: Generate analysis
        run: |
          cd tools/feedback-system
          npm run analyze
      
      - name: Commit results
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add tools/feedback-system/data/
          git diff --staged --quiet || git commit -m "Update feedback data [skip ci]"
          git push
```

---

**関連ドキュメント:**
- [品質チェックシステム](../quality-check/README.md) - ドキュメント品質管理
- [ドキュメント目次](../../docs/TABLE_OF_CONTENTS.md) - 全体構造
- [トラブルシューティング](../../docs/09-troubleshooting.md) - 問題解決ガイド