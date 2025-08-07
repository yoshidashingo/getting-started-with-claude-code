# ドキュメント品質チェックシステム

Claude Codeドキュメントの品質を自動的にチェックし、維持するためのツール群です。リンク切れ検出、コード例の検証、マークダウン構文チェックなどの機能を提供します。

## 概要

### 品質チェック項目

1. **リンク整合性チェック**
   - 内部リンクの存在確認
   - 外部リンクのアクセス可能性確認
   - アンカーリンクの正確性確認

2. **マークダウン構文チェック**
   - 構文エラーの検出
   - 見出し階層の適切性確認
   - リスト形式の統一性確認

3. **コード例検証**
   - コードブロックの構文チェック
   - 実行可能性の確認
   - 言語指定の適切性確認

4. **ドキュメント構造チェック**
   - 必須セクションの存在確認
   - 目次との整合性確認
   - クロスリファレンスの正確性確認

5. **コンテンツ品質チェック**
   - 誤字脱字の検出
   - 用語の一貫性確認
   - 読みやすさの評価

## ツール構成

```
tools/quality-check/
├── README.md                    # このファイル
├── package.json                 # 依存関係定義
├── scripts/                     # 実行スクリプト
│   ├── check-all.js            # 全体品質チェック
│   ├── check-links.js          # リンクチェック
│   ├── check-markdown.js       # マークダウンチェック
│   ├── check-code.js           # コード例チェック
│   ├── check-structure.js      # 構造チェック
│   └── generate-report.js      # レポート生成
├── config/                      # 設定ファイル
│   ├── markdownlint.json       # マークダウンリント設定
│   ├── link-check.json         # リンクチェック設定
│   ├── code-check.json         # コードチェック設定
│   └── quality-rules.json      # 品質ルール定義
├── lib/                         # ライブラリ
│   ├── link-checker.js         # リンクチェック機能
│   ├── markdown-validator.js   # マークダウン検証
│   ├── code-validator.js       # コード検証
│   ├── structure-validator.js  # 構造検証
│   └── report-generator.js     # レポート生成
└── reports/                     # チェック結果
    ├── latest/                  # 最新結果
    └── history/                 # 履歴
```

## セットアップ

### 1. 依存関係のインストール

```bash
cd tools/quality-check
npm install
```

**package.json**:
```json
{
  "name": "claude-docs-quality-check",
  "version": "1.0.0",
  "description": "Claude Code documentation quality check tools",
  "scripts": {
    "check:all": "node scripts/check-all.js",
    "check:links": "node scripts/check-links.js",
    "check:markdown": "node scripts/check-markdown.js",
    "check:code": "node scripts/check-code.js",
    "check:structure": "node scripts/check-structure.js",
    "report": "node scripts/generate-report.js",
    "watch": "nodemon --watch ../../docs --exec 'npm run check:all'"
  },
  "dependencies": {
    "markdown-link-check": "^3.11.2",
    "markdownlint": "^0.31.1",
    "glob": "^10.3.10",
    "chalk": "^5.3.0",
    "fs-extra": "^11.1.1",
    "axios": "^1.6.0",
    "cheerio": "^1.0.0-rc.12",
    "prismjs": "^1.29.0",
    "acorn": "^8.11.2",
    "typescript": "^5.3.2"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
```

### 2. 設定ファイルの準備

**config/markdownlint.json**:
```json
{
  "default": true,
  "MD013": {
    "line_length": 120,
    "code_blocks": false,
    "tables": false
  },
  "MD033": {
    "allowed_elements": ["details", "summary", "br", "sub", "sup"]
  },
  "MD041": false,
  "MD024": {
    "siblings_only": true
  }
}
```

**config/link-check.json**:
```json
{
  "timeout": "10s",
  "retryOn429": true,
  "retryCount": 3,
  "fallbackProtocols": ["https", "http"],
  "ignorePatterns": [
    {
      "pattern": "^https://localhost"
    },
    {
      "pattern": "^http://localhost"
    }
  ],
  "httpHeaders": [
    {
      "urls": ["https://github.com"],
      "headers": {
        "User-Agent": "Mozilla/5.0 (compatible; documentation-checker)"
      }
    }
  ]
}
```

**config/quality-rules.json**:
```json
{
  "structure": {
    "requiredSections": {
      "README.md": ["概要", "機能", "使い方"],
      "tutorial": ["概要", "前提条件", "手順", "まとめ"],
      "reference": ["概要", "API", "例", "関連情報"]
    },
    "maxHeadingDepth": 4,
    "minWordsPerSection": 50
  },
  "content": {
    "terminology": {
      "Claude Code": ["claude code", "ClaudeCode", "claude-code"],
      "JavaScript": ["javascript", "Javascript", "java script"],
      "TypeScript": ["typescript", "Typescript", "type script"]
    },
    "bannedWords": ["TODO", "FIXME", "XXX"],
    "maxLineLength": 120
  },
  "code": {
    "requiredLanguages": ["javascript", "typescript", "bash", "json"],
    "maxCodeBlockLength": 100,
    "requireLanguageSpecification": true
  }
}
```

## 品質チェック機能

### 1. リンクチェック機能

**lib/link-checker.js**:
```javascript
const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');
const axios = require('axios');
const chalk = require('chalk');

class LinkChecker {
  constructor(config) {
    this.config = config;
    this.results = {
      total: 0,
      passed: 0,
      failed: 0,
      errors: []
    };
  }

  async checkAllDocuments(docsPath) {
    console.log(chalk.blue('🔗 リンクチェックを開始します...'));
    
    const markdownFiles = glob.sync('**/*.md', { cwd: docsPath });
    
    for (const file of markdownFiles) {
      const filePath = path.join(docsPath, file);
      await this.checkFile(filePath, file);
    }
    
    return this.results;
  }

  async checkFile(filePath, relativePath) {
    const content = await fs.readFile(filePath, 'utf8');
    const links = this.extractLinks(content);
    
    console.log(chalk.gray(`📄 ${relativePath} (${links.length} links)`));
    
    for (const link of links) {
      await this.checkLink(link, relativePath);
    }
  }

  extractLinks(content) {
    const linkRegex = /\[([^\]]*)\]\(([^)]+)\)/g;
    const links = [];
    let match;
    
    while ((match = linkRegex.exec(content)) !== null) {
      links.push({
        text: match[1],
        url: match[2],
        line: this.getLineNumber(content, match.index)
      });
    }
    
    return links;
  }

  async checkLink(link, filePath) {
    this.results.total++;
    
    try {
      if (link.url.startsWith('http')) {
        await this.checkExternalLink(link, filePath);
      } else {
        await this.checkInternalLink(link, filePath);
      }
      
      this.results.passed++;
      console.log(chalk.green(`  ✓ ${link.url}`));
    } catch (error) {
      this.results.failed++;
      this.results.errors.push({
        file: filePath,
        link: link.url,
        text: link.text,
        line: link.line,
        error: error.message
      });
      console.log(chalk.red(`  ✗ ${link.url} - ${error.message}`));
    }
  }

  async checkExternalLink(link, filePath) {
    try {
      const response = await axios.head(link.url, {
        timeout: this.config.timeout || 10000,
        headers: this.getHeaders(link.url)
      });
      
      if (response.status >= 400) {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      if (error.code === 'ENOTFOUND') {
        throw new Error('ドメインが見つかりません');
      } else if (error.code === 'ECONNREFUSED') {
        throw new Error('接続が拒否されました');
      } else if (error.response) {
        throw new Error(`HTTP ${error.response.status}`);
      } else {
        throw new Error(error.message);
      }
    }
  }

  async checkInternalLink(link, filePath) {
    const basePath = path.dirname(path.join('../../docs', filePath));
    let targetPath;
    
    if (link.url.startsWith('/')) {
      targetPath = path.join('../../docs', link.url);
    } else {
      targetPath = path.resolve(basePath, link.url);
    }
    
    // アンカーリンクの処理
    const [filePart, anchor] = targetPath.split('#');
    
    if (!await fs.pathExists(filePart)) {
      throw new Error('ファイルが存在しません');
    }
    
    if (anchor) {
      await this.checkAnchor(filePart, anchor);
    }
  }

  async checkAnchor(filePath, anchor) {
    const content = await fs.readFile(filePath, 'utf8');
    const headingRegex = /^#+\s+(.+)$/gm;
    const headings = [];
    let match;
    
    while ((match = headingRegex.exec(content)) !== null) {
      const heading = match[1].toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      headings.push(heading);
    }
    
    if (!headings.includes(anchor.toLowerCase())) {
      throw new Error(`アンカー "${anchor}" が見つかりません`);
    }
  }

  getHeaders(url) {
    const headers = { 'User-Agent': 'Mozilla/5.0 (compatible; documentation-checker)' };
    
    if (this.config.httpHeaders) {
      for (const config of this.config.httpHeaders) {
        if (config.urls.some(pattern => url.includes(pattern))) {
          Object.assign(headers, config.headers);
        }
      }
    }
    
    return headers;
  }

  getLineNumber(content, index) {
    return content.substring(0, index).split('\n').length;
  }
}

module.exports = LinkChecker;
```

### 2. マークダウン構文チェック

**lib/markdown-validator.js**:
```javascript
const markdownlint = require('markdownlint');
const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');
const chalk = require('chalk');

class MarkdownValidator {
  constructor(config) {
    this.config = config;
    this.results = {
      total: 0,
      passed: 0,
      failed: 0,
      errors: []
    };
  }

  async validateAllDocuments(docsPath) {
    console.log(chalk.blue('📝 マークダウン構文チェックを開始します...'));
    
    const markdownFiles = glob.sync('**/*.md', { cwd: docsPath });
    
    const options = {
      files: markdownFiles.map(file => path.join(docsPath, file)),
      config: this.config
    };
    
    const results = markdownlint.sync(options);
    
    this.processResults(results, docsPath);
    
    return this.results;
  }

  processResults(lintResults, docsPath) {
    for (const [filePath, errors] of Object.entries(lintResults)) {
      const relativePath = path.relative(docsPath, filePath);
      this.results.total++;
      
      if (errors.length === 0) {
        this.results.passed++;
        console.log(chalk.green(`✓ ${relativePath}`));
      } else {
        this.results.failed++;
        console.log(chalk.red(`✗ ${relativePath} (${errors.length} errors)`));
        
        for (const error of errors) {
          this.results.errors.push({
            file: relativePath,
            line: error.lineNumber,
            rule: error.ruleNames[0],
            description: error.ruleDescription,
            detail: error.errorDetail
          });
          
          console.log(chalk.yellow(`  Line ${error.lineNumber}: ${error.ruleDescription}`));
          if (error.errorDetail) {
            console.log(chalk.gray(`    ${error.errorDetail}`));
          }
        }
      }
    }
  }

  async validateStructure(filePath) {
    const content = await fs.readFile(filePath, 'utf8');
    const errors = [];
    
    // 見出し階層チェック
    const headings = this.extractHeadings(content);
    errors.push(...this.validateHeadingHierarchy(headings));
    
    // 必須セクションチェック
    const fileName = path.basename(filePath);
    const requiredSections = this.getRequiredSections(fileName);
    errors.push(...this.validateRequiredSections(headings, requiredSections));
    
    return errors;
  }

  extractHeadings(content) {
    const headingRegex = /^(#+)\s+(.+)$/gm;
    const headings = [];
    let match;
    
    while ((match = headingRegex.exec(content)) !== null) {
      headings.push({
        level: match[1].length,
        text: match[2],
        line: this.getLineNumber(content, match.index)
      });
    }
    
    return headings;
  }

  validateHeadingHierarchy(headings) {
    const errors = [];
    let previousLevel = 0;
    
    for (const heading of headings) {
      if (heading.level > previousLevel + 1) {
        errors.push({
          line: heading.line,
          rule: 'heading-hierarchy',
          description: '見出しレベルが飛んでいます',
          detail: `H${previousLevel} の次に H${heading.level} が使用されています`
        });
      }
      previousLevel = heading.level;
    }
    
    return errors;
  }

  validateRequiredSections(headings, requiredSections) {
    const errors = [];
    const headingTexts = headings.map(h => h.text.toLowerCase());
    
    for (const required of requiredSections) {
      if (!headingTexts.some(text => text.includes(required.toLowerCase()))) {
        errors.push({
          rule: 'required-section',
          description: `必須セクション "${required}" が見つかりません`
        });
      }
    }
    
    return errors;
  }

  getRequiredSections(fileName) {
    const rules = this.config.structure?.requiredSections || {};
    
    if (fileName === 'README.md') {
      return rules.README || [];
    } else if (fileName.includes('tutorial')) {
      return rules.tutorial || [];
    } else if (fileName.includes('reference')) {
      return rules.reference || [];
    }
    
    return [];
  }

  getLineNumber(content, index) {
    return content.substring(0, index).split('\n').length;
  }
}

module.exports = MarkdownValidator;
```

### 3. コード例検証機能

**lib/code-validator.js**:
```javascript
const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');
const chalk = require('chalk');
const { parse } = require('acorn');
const ts = require('typescript');
const Prism = require('prismjs');

// 追加言語の読み込み
require('prismjs/components/prism-typescript');
require('prismjs/components/prism-bash');
require('prismjs/components/prism-json');

class CodeValidator {
  constructor(config) {
    this.config = config;
    this.results = {
      total: 0,
      passed: 0,
      failed: 0,
      errors: []
    };
  }

  async validateAllDocuments(docsPath) {
    console.log(chalk.blue('💻 コード例検証を開始します...'));
    
    const markdownFiles = glob.sync('**/*.md', { cwd: docsPath });
    
    for (const file of markdownFiles) {
      const filePath = path.join(docsPath, file);
      await this.validateFile(filePath, file);
    }
    
    return this.results;
  }

  async validateFile(filePath, relativePath) {
    const content = await fs.readFile(filePath, 'utf8');
    const codeBlocks = this.extractCodeBlocks(content);
    
    console.log(chalk.gray(`📄 ${relativePath} (${codeBlocks.length} code blocks)`));
    
    for (const block of codeBlocks) {
      await this.validateCodeBlock(block, relativePath);
    }
  }

  extractCodeBlocks(content) {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const blocks = [];
    let match;
    
    while ((match = codeBlockRegex.exec(content)) !== null) {
      blocks.push({
        language: match[1] || 'text',
        code: match[2],
        line: this.getLineNumber(content, match.index)
      });
    }
    
    return blocks;
  }

  async validateCodeBlock(block, filePath) {
    this.results.total++;
    
    try {
      // 言語指定チェック
      if (this.config.requireLanguageSpecification && !block.language) {
        throw new Error('言語指定が必要です');
      }
      
      // コード長チェック
      const lines = block.code.split('\n');
      if (lines.length > this.config.maxCodeBlockLength) {
        throw new Error(`コードブロックが長すぎます (${lines.length} > ${this.config.maxCodeBlockLength})`);
      }
      
      // 構文チェック
      await this.validateSyntax(block);
      
      this.results.passed++;
      console.log(chalk.green(`  ✓ ${block.language} (line ${block.line})`));
    } catch (error) {
      this.results.failed++;
      this.results.errors.push({
        file: filePath,
        line: block.line,
        language: block.language,
        error: error.message,
        code: block.code.substring(0, 100) + '...'
      });
      console.log(chalk.red(`  ✗ ${block.language} (line ${block.line}) - ${error.message}`));
    }
  }

  async validateSyntax(block) {
    switch (block.language.toLowerCase()) {
      case 'javascript':
      case 'js':
        return this.validateJavaScript(block.code);
      
      case 'typescript':
      case 'ts':
        return this.validateTypeScript(block.code);
      
      case 'json':
        return this.validateJSON(block.code);
      
      case 'bash':
      case 'sh':
        return this.validateBash(block.code);
      
      default:
        // Prismでの基本的な構文チェック
        return this.validateWithPrism(block.code, block.language);
    }
  }

  validateJavaScript(code) {
    try {
      parse(code, { ecmaVersion: 2022, sourceType: 'module' });
    } catch (error) {
      throw new Error(`JavaScript構文エラー: ${error.message}`);
    }
  }

  validateTypeScript(code) {
    const result = ts.transpileModule(code, {
      compilerOptions: {
        target: ts.ScriptTarget.ES2022,
        module: ts.ModuleKind.ESNext,
        strict: true,
        noEmitOnError: true
      }
    });
    
    if (result.diagnostics && result.diagnostics.length > 0) {
      const error = result.diagnostics[0];
      throw new Error(`TypeScript構文エラー: ${error.messageText}`);
    }
  }

  validateJSON(code) {
    try {
      JSON.parse(code);
    } catch (error) {
      throw new Error(`JSON構文エラー: ${error.message}`);
    }
  }

  validateBash(code) {
    // 基本的なbashコマンドの検証
    const lines = code.split('\n').filter(line => line.trim());
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      // コメント行はスキップ
      if (trimmed.startsWith('#')) continue;
      
      // 危険なコマンドのチェック
      const dangerousCommands = ['rm -rf /', 'sudo rm -rf', 'format c:'];
      if (dangerousCommands.some(cmd => trimmed.includes(cmd))) {
        throw new Error(`危険なコマンドが含まれています: ${trimmed}`);
      }
      
      // 基本的な構文チェック
      if (trimmed.includes('&&') && trimmed.split('&&').some(part => !part.trim())) {
        throw new Error('不正な && 構文です');
      }
    }
  }

  validateWithPrism(code, language) {
    try {
      if (Prism.languages[language]) {
        Prism.highlight(code, Prism.languages[language], language);
      }
    } catch (error) {
      throw new Error(`構文エラー: ${error.message}`);
    }
  }

  getLineNumber(content, index) {
    return content.substring(0, index).split('\n').length;
  }
}

module.exports = CodeValidator;
```

### 4. 実行スクリプト

**scripts/check-all.js**:
```javascript
#!/usr/bin/env node

const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');
const LinkChecker = require('../lib/link-checker');
const MarkdownValidator = require('../lib/markdown-validator');
const CodeValidator = require('../lib/code-validator');

async function main() {
  console.log(chalk.bold.blue('🔍 Claude Code ドキュメント品質チェック'));
  console.log('='.repeat(50));
  
  const docsPath = path.resolve(__dirname, '../../../docs');
  const configPath = path.resolve(__dirname, '../config');
  
  // 設定ファイル読み込み
  const linkConfig = await fs.readJson(path.join(configPath, 'link-check.json'));
  const markdownConfig = await fs.readJson(path.join(configPath, 'markdownlint.json'));
  const codeConfig = await fs.readJson(path.join(configPath, 'code-check.json'));
  const qualityRules = await fs.readJson(path.join(configPath, 'quality-rules.json'));
  
  const results = {
    timestamp: new Date().toISOString(),
    summary: {
      total: 0,
      passed: 0,
      failed: 0
    },
    checks: {}
  };
  
  try {
    // 1. リンクチェック
    console.log('\n' + chalk.bold('1. リンクチェック'));
    const linkChecker = new LinkChecker(linkConfig);
    const linkResults = await linkChecker.checkAllDocuments(docsPath);
    results.checks.links = linkResults;
    
    // 2. マークダウン構文チェック
    console.log('\n' + chalk.bold('2. マークダウン構文チェック'));
    const markdownValidator = new MarkdownValidator(markdownConfig);
    const markdownResults = await markdownValidator.validateAllDocuments(docsPath);
    results.checks.markdown = markdownResults;
    
    // 3. コード例検証
    console.log('\n' + chalk.bold('3. コード例検証'));
    const codeValidator = new CodeValidator(codeConfig.code);
    const codeResults = await codeValidator.validateAllDocuments(docsPath);
    results.checks.code = codeResults;
    
    // 結果集計
    results.summary.total = linkResults.total + markdownResults.total + codeResults.total;
    results.summary.passed = linkResults.passed + markdownResults.passed + codeResults.passed;
    results.summary.failed = linkResults.failed + markdownResults.failed + codeResults.failed;
    
    // 結果表示
    console.log('\n' + chalk.bold('📊 チェック結果サマリー'));
    console.log('='.repeat(30));
    console.log(`総チェック数: ${results.summary.total}`);
    console.log(chalk.green(`✓ 成功: ${results.summary.passed}`));
    console.log(chalk.red(`✗ 失敗: ${results.summary.failed}`));
    
    const successRate = ((results.summary.passed / results.summary.total) * 100).toFixed(1);
    console.log(`成功率: ${successRate}%`);
    
    // レポート保存
    const reportPath = path.resolve(__dirname, '../reports/latest');
    await fs.ensureDir(reportPath);
    await fs.writeJson(path.join(reportPath, 'quality-check-results.json'), results, { spaces: 2 });
    
    console.log(`\n📄 詳細レポートを保存しました: ${reportPath}/quality-check-results.json`);
    
    // エラーがある場合は詳細表示
    if (results.summary.failed > 0) {
      console.log('\n' + chalk.bold.red('❌ エラー詳細'));
      console.log('='.repeat(30));
      
      if (linkResults.errors.length > 0) {
        console.log(chalk.red('\nリンクエラー:'));
        linkResults.errors.forEach(error => {
          console.log(`  ${error.file}:${error.line} - ${error.link}`);
          console.log(`    ${error.error}`);
        });
      }
      
      if (markdownResults.errors.length > 0) {
        console.log(chalk.red('\nマークダウンエラー:'));
        markdownResults.errors.forEach(error => {
          console.log(`  ${error.file}:${error.line} - ${error.rule}`);
          console.log(`    ${error.description}`);
        });
      }
      
      if (codeResults.errors.length > 0) {
        console.log(chalk.red('\nコードエラー:'));
        codeResults.errors.forEach(error => {
          console.log(`  ${error.file}:${error.line} - ${error.language}`);
          console.log(`    ${error.error}`);
        });
      }
      
      process.exit(1);
    } else {
      console.log(chalk.green('\n🎉 すべてのチェックが成功しました！'));
      process.exit(0);
    }
    
  } catch (error) {
    console.error(chalk.red('❌ チェック実行中にエラーが発生しました:'));
    console.error(error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = main;
```

### 5. GitHub Actions統合

**.github/workflows/quality-check.yml**:
```yaml
name: Documentation Quality Check

on:
  push:
    paths:
      - 'docs/**/*.md'
      - 'tools/quality-check/**'
  pull_request:
    paths:
      - 'docs/**/*.md'
      - 'tools/quality-check/**'
  schedule:
    # 毎日午前2時に実行
    - cron: '0 2 * * *'

jobs:
  quality-check:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: 'tools/quality-check/package-lock.json'
      
      - name: Install dependencies
        run: |
          cd tools/quality-check
          npm ci
      
      - name: Run quality checks
        run: |
          cd tools/quality-check
          npm run check:all
      
      - name: Upload quality report
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: quality-check-report
          path: tools/quality-check/reports/latest/
      
      - name: Comment PR with results
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs');
            const path = './tools/quality-check/reports/latest/quality-check-results.json';
            
            if (fs.existsSync(path)) {
              const results = JSON.parse(fs.readFileSync(path, 'utf8'));
              const successRate = ((results.summary.passed / results.summary.total) * 100).toFixed(1);
              
              const comment = `## 📊 ドキュメント品質チェック結果
              
              - **総チェック数**: ${results.summary.total}
              - **✅ 成功**: ${results.summary.passed}
              - **❌ 失敗**: ${results.summary.failed}
              - **成功率**: ${successRate}%
              
              ${results.summary.failed > 0 ? '⚠️ エラーが検出されました。詳細は Artifacts をご確認ください。' : '🎉 すべてのチェックが成功しました！'}
              `;
              
              github.rest.issues.createComment({
                issue_number: context.issue.number,
                owner: context.repo.owner,
                repo: context.repo.repo,
                body: comment
              });
            }
```

## 使用方法

### 1. 全体品質チェック実行

```bash
cd tools/quality-check
npm run check:all
```

### 2. 個別チェック実行

```bash
# リンクチェックのみ
npm run check:links

# マークダウン構文チェックのみ
npm run check:markdown

# コード例検証のみ
npm run check:code

# 構造チェックのみ
npm run check:structure
```

### 3. 監視モード

```bash
# ドキュメント変更を監視して自動チェック
npm run watch
```

### 4. レポート生成

```bash
# 詳細レポート生成
npm run report
```

## カスタマイズ

### 1. チェックルールの追加

**config/quality-rules.json** を編集してカスタムルールを追加：

```json
{
  "customRules": {
    "maxImageSize": "1MB",
    "requiredMetadata": ["title", "description", "tags"],
    "bannedPhrases": ["click here", "read more"]
  }
}
```

### 2. 新しいバリデーターの追加

```javascript
// lib/custom-validator.js
class CustomValidator {
  constructor(config) {
    this.config = config;
  }
  
  async validate(content, filePath) {
    // カスタム検証ロジック
  }
}

module.exports = CustomValidator;
```

### 3. レポート形式のカスタマイズ

```javascript
// lib/custom-reporter.js
class CustomReporter {
  generateReport(results) {
    // カスタムレポート生成
    return {
      html: this.generateHTML(results),
      pdf: this.generatePDF(results),
      slack: this.generateSlackMessage(results)
    };
  }
}
```

## トラブルシューティング

### よくある問題

#### 1. 外部リンクのタイムアウト
```bash
# タイムアウト時間を延長
# config/link-check.json で timeout を調整
{
  "timeout": "30s"
}
```

#### 2. 大量のマークダウンエラー
```bash
# 特定のルールを無効化
# config/markdownlint.json で該当ルールを false に設定
{
  "MD013": false
}
```

#### 3. コード検証の誤検出
```bash
# 特定の言語を検証対象から除外
# config/code-check.json で除外設定
{
  "excludeLanguages": ["pseudocode", "diagram"]
}
```

---

**関連ドキュメント:**
- [ドキュメント目次](../docs/TABLE_OF_CONTENTS.md) - 全体構造の確認
- [タグシステム](../docs/TAGS.md) - 検索性向上のためのタグ付け
- [トラブルシューティング](../docs/09-troubleshooting.md) - 一般的な問題解決