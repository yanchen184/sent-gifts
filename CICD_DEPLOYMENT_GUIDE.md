# React GitHub Pages CI/CD Pipeline 完整設置指南

> 基於實戰經驗的快速部署文檔 - 避免常見陷阱，一次設置成功

## 📋 目錄

- [快速開始](#快速開始)
- [完整工作流程配置](#完整工作流程配置)
- [常見問題解決方案](#常見問題解決方案)
- [故障排除指南](#故障排除指南)
- [最佳實踐](#最佳實踐)

## 🚀 快速開始

### 前置條件檢查

```bash
# 1. 確認專案類型
ls package.json  # 必須存在
cat package.json | grep "react-scripts"  # React 專案確認

# 2. 確認建構指令
npm run build  # 必須能成功執行，產生 build/ 目錄
```

### 核心設置步驟

#### 1. 更新 package.json

```json
{
  "name": "your-project-name",
  "version": "1.0.0",
  "homepage": "https://your-username.github.io/your-repo-name",
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

#### 2. 創建 GitHub Actions 工作流程

創建 `.github/workflows/deploy.yml`：

```yaml
name: Build and Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:  # 允許手動觸發

permissions:
  contents: write
  pages: write
  id-token: write

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install dependencies
      run: npm install
      env:
        CI: false  # 重要：避免 warnings 被當作 errors

    - name: Build project
      run: npm run build
      env:
        CI: false
        PUBLIC_URL: /your-repo-name  # 替換為實際倉庫名

    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./build
        force_orphan: true  # 重要：確保乾淨的 gh-pages 分支

  enable-pages:
    runs-on: ubuntu-latest
    needs: build-and-deploy
    steps:
    - name: Enable GitHub Pages via API
      uses: actions/github-script@v7
      with:
        script: |
          try {
            await github.rest.repos.createPagesSite({
              owner: context.repo.owner,
              repo: context.repo.repo,
              source: {
                branch: 'gh-pages',
                path: '/'
              }
            });
            console.log('✅ GitHub Pages enabled successfully!');
          } catch (error) {
            if (error.status === 409) {
              console.log('✅ GitHub Pages already enabled');
            } else {
              console.log('Pages setup result:', error.message);
            }
          }
```

#### 3. 版本號自動顯示 (可選)

更新 `src/App.js` 以動態顯示版本：

```javascript
// 在檔案頂部加入
const packageJson = require('../package.json');
const APP_VERSION = packageJson.version;

// 在 JSX 中使用
<div className="version">v{APP_VERSION}</div>
```

## 🔧 完整工作流程配置

### A. 基礎部署工作流程

```yaml
# .github/workflows/deploy.yml
name: Build and Deploy

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: write

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
    - run: npm install
    - run: npm run build
      env:
        CI: false
    - uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./build
        force_orphan: true
```

### B. 進階配置 (包含測試和 Linting)

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: write
  pull-requests: write

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
    - run: npm ci
    - run: npm run test -- --coverage --watchAll=false
    - run: npm run lint
    
  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
    - run: npm install
    - run: npm run build
      env:
        CI: false
        PUBLIC_URL: /${{ github.event.repository.name }}
    - uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./build
        force_orphan: true
```

## ❌ 常見問題解決方案

### 問題 1: "Resource not accessible by integration"

**原因**: 權限不足
**解決方案**:
```yaml
permissions:
  contents: write  # 必須有這個權限
  pages: write     # 如果使用 GitHub Pages API
```

### 問題 2: "Get Pages site failed. Not Found"

**原因**: GitHub Pages 未啟用
**解決方案**: 使用 API 自動啟用
```yaml
- name: Enable Pages
  uses: actions/github-script@v7
  with:
    script: |
      try {
        await github.rest.repos.createPagesSite({
          owner: context.repo.owner,
          repo: context.repo.repo,
          source: { branch: 'gh-pages', path: '/' }
        });
      } catch (error) {
        console.log('Pages setup:', error.message);
      }
```

### 問題 3: gh-pages 分支不存在或不可見

**原因**: 分支創建失敗或權限問題
**解決方案**: 使用 `force_orphan: true`
```yaml
- uses: peaceiris/actions-gh-pages@v3
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./build
    force_orphan: true  # 強制創建乾淨分支
```

### 問題 4: Build 失敗 - "Treating warnings as errors"

**原因**: React Scripts 預設在 CI 環境將 warnings 當作 errors
**解決方案**:
```yaml
- run: npm run build
  env:
    CI: false  # 關閉嚴格模式
```

### 問題 5: 靜態資源 404

**原因**: PUBLIC_URL 路徑不正確
**解決方案**:
```yaml
- run: npm run build
  env:
    PUBLIC_URL: /${{ github.event.repository.name }}
```

或在 package.json 中設定:
```json
{
  "homepage": "https://username.github.io/repo-name"
}
```

## 🔍 故障排除指南

### 檢查清單

1. **權限檢查**
   ```bash
   # 確認倉庫設定
   # Settings > Actions > General > Workflow permissions
   # 選擇 "Read and write permissions"
   ```

2. **分支檢查**
   ```bash
   git branch -a  # 檢查所有分支
   # 應該看到 origin/gh-pages
   ```

3. **Build 檢查**
   ```bash
   npm run build  # 本地測試建構
   ls build/      # 確認產生檔案
   ```

4. **Actions 日誌檢查**
   - 前往 GitHub > Actions 頁面
   - 檢查失敗的步驟詳細日誌
   - 尋找關鍵錯誤訊息

### 常見錯誤訊息對照表

| 錯誤訊息 | 原因 | 解決方案 |
|---------|------|----------|
| `Resource not accessible by integration` | 權限不足 | 設定 `contents: write` |
| `Reference already exists` | 分支已存在 | 使用 `force_orphan: true` |
| `Process completed with exit code 1` | Build 失敗 | 檢查 `CI: false` 設定 |
| `fatal: couldn't find remote ref refs/heads/gh-pages` | 分支不存在 | 讓 peaceiris/actions-gh-pages 自動創建 |

## 📚 最佳實踐

### 1. 倉庫設定

```yaml
# 推薦的完整 package.json scripts
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

### 2. 環境變數管理

```yaml
# 在 Actions 中使用環境變數
env:
  CI: false
  NODE_ENV: production
  PUBLIC_URL: /${{ github.event.repository.name }}
  GENERATE_SOURCEMAP: false  # 減少 build 大小
```

### 3. 快取最佳化

```yaml
- name: Cache node modules
  uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-
```

### 4. 多環境部署

```yaml
# 為不同分支設定不同部署目標
jobs:
  deploy-staging:
    if: github.ref == 'refs/heads/develop'
    # 部署到 staging 環境
    
  deploy-production:
    if: github.ref == 'refs/heads/main'
    # 部署到 production 環境
```

### 5. 通知設定

```yaml
- name: Notify deployment status
  if: always()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

## 🎯 快速部署範本

### 最小化設定 (5 分鐘完成)

1. **建立檔案**: `.github/workflows/deploy.yml`
2. **複製貼上**:
```yaml
name: Deploy
on:
  push:
    branches: [ main ]
permissions:
  contents: write
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
    - run: npm install
    - run: npm run build
      env:
        CI: false
    - uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./build
        force_orphan: true
```
3. **推送程式碼**: `git add . && git commit -m "Add CI/CD" && git push`
4. **等待部署**: 前往 Actions 頁面查看進度
5. **訪問網站**: `https://username.github.io/repo-name`

## 📝 部署檢查清單

- [ ] package.json 包含 homepage 欄位
- [ ] Build 指令可以本地成功執行
- [ ] GitHub Actions workflow 檔案已建立
- [ ] 權限設定為 `contents: write`
- [ ] 環境變數 `CI: false` 已設定
- [ ] PUBLIC_URL 路徑正確
- [ ] peaceiris/actions-gh-pages 使用 `force_orphan: true`
- [ ] Actions 運行成功
- [ ] gh-pages 分支已建立
- [ ] GitHub Pages 設定已啟用
- [ ] 網站可以正常訪問

## 🔄 版本控制建議

```bash
# 建議的 Git 工作流程
git checkout -b feature/ci-cd-setup
# 進行 CI/CD 設定
git add .
git commit -m "feat: setup CI/CD pipeline for GitHub Pages deployment"
git push origin feature/ci-cd-setup
# 建立 PR 並合併到 main
```

---

**文檔版本**: v1.0  
**最後更新**: 2025-08-01  
**適用於**: React 專案 + GitHub Pages  
**測試環境**: Node.js 18, GitHub Actions Ubuntu Latest

> 💡 **提示**: 每次設定新專案時，直接複製「快速部署範本」即可在 5 分鐘內完成部署設定！
