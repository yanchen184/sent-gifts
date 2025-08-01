# 禮物管理系統 v1.1.0

一個基於 React 和 Firebase 的禮物管理系統，幫助你追蹤和管理送禮狀態。

## 🚀 線上演示

**[立即體驗 - GitHub Pages](https://yanchen184.github.io/sent-gifts/)**

[![Deploy Status](https://github.com/yanchen184/sent-gifts/actions/workflows/deploy.yml/badge.svg)](https://github.com/yanchen184/sent-gifts/actions/workflows/deploy.yml)

## 功能特色

- ✨ **拖拽管理**: 使用直觀的拖拽操作在不同狀態間移動人員
- 📊 **即時統計**: 實時顯示各狀態的人數統計
- 🔥 **即時同步**: 基於 Firebase 的即時數據同步
- 📱 **響應式設計**: 支援桌面和移動設備
- 🎯 **三種狀態**: 還未送禮、準備送禮、已送禮
- 🚀 **自動部署**: 透過 GitHub Actions 自動部署到 GitHub Pages

## 安裝和運行

### 前置要求

- Node.js (版本 14 或以上)
- npm 或 yarn

### 安裝步驟

1. 下載項目到本地
```bash
git clone https://github.com/yanchen184/sent-gifts.git
cd sent-gifts
```

2. 安裝依賴
```bash
npm install
```

3. 啟動開發服務器
```bash
npm start
```

4. 打開瀏覽器訪問 `http://localhost:3000`

## 使用方法

### 新增人員
1. 在左側表單中輸入姓名
2. 支援多種分隔符：逗號、分號、換行
3. 點擊「新增到待送禮」按鈕

### 管理狀態
- **拖拽移動**: 直接拖拽人員卡片到目標狀態欄
- **刪除人員**: 點擊人員卡片上的 × 按鈕

### 狀態說明
- **還未送禮** (紅色): 尚未準備或送出禮物的人員
- **準備送禮** (橙色): 正在準備或挑選禮物的人員  
- **已送禮** (綠色): 已經送出禮物的人員

## 技術架構

### 前端技術
- **React 18**: 現代化的前端框架
- **React Beautiful DnD**: 拖拽功能實現
- **CSS3**: 現代化樣式和動畫效果

### 後端服務
- **Firebase Firestore**: NoSQL 雲端資料庫
- **Firebase Analytics**: 使用情況分析

### 部署服務
- **GitHub Actions**: 自動化 CI/CD 流水線
- **GitHub Pages**: 靜態網站託管服務

### 項目結構
```
src/
├── components/          # React 組件
│   ├── AddPersonForm/   # 新增人員表單
│   ├── GiftColumn/      # 狀態欄組件
│   └── PersonCard/      # 人員卡片組件
├── services/            # 服務層
│   ├── firebase.js      # Firebase 配置
│   └── giftService.js   # 禮物管理服務
├── App.js              # 主應用組件
└── index.js            # 應用入口點
```

## 開發指南

### 本地開發
```bash
# 啟動開發服務器
npm start

# 運行測試
npm test

# 建置生產版本
npm run build
```

### 代碼規範
- 使用 ES6+ 語法
- 組件使用函數式組件和 Hooks
- CSS 使用 BEM 命名規範
- 所有註解使用英文

## 部署

### 自動部署 (推薦)
推送到 main 分支時會自動觸發 GitHub Actions 進行部署：

```bash
git add .
git commit -m "feat: your feature description"
git push origin main
```

### 手動部署
```bash
# 建置並部署到 GitHub Pages
npm run deploy
```

### Firebase 部署
1. 安裝 Firebase CLI
```bash
npm install -g firebase-tools
```

2. 登入 Firebase
```bash
firebase login
```

3. 初始化項目
```bash
firebase init
```

4. 部署
```bash
firebase deploy
```

## 版本歷史

### v1.1.0 (2025-08-01)
- ✨ 新增 GitHub Actions 自動部署
- 🔧 配置 GitHub Pages 部署流程
- 📝 優化 README 文檔
- 🚀 添加線上演示鏈接

### v1.0.0
- 🎉 初始版本發布
- ✨ 基本的拖拽管理功能
- 💾 Firebase 數據存儲
- 📱 響應式設計

## 授權

本項目僅供學習和個人使用。

## 支援

如有問題或建議，請聯繫開發者或在 GitHub 上提交 Issue。
