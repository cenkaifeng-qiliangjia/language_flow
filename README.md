# LanguageFlow - 英语跟练工具 Demo

基于 Next.js 14 + TailwindCSS + Dify Workflow 构建的英语口语跟练工具。

## 功能特性

- 🇨🇳 **中文输入**: 粘贴中文演讲稿，自动翻译为地道英文。
- 💡 **学习辅助**: 生成 IPA 音标、助记提示及逐句拆解。
- 🎙️ **原生录音**: 浏览器原生录音，实时可视化反馈。
- 📊 **AI 评分**: 对接 Dify 评分工作流，给出综合得分及改进建议。
- 💾 **本地存储**: 自动保存最近的练习记录。

## 技术栈

- **框架**: Next.js 14 (App Router)
- **样式**: TailwindCSS
- **图标**: Lucide React
- **包管理**: pnpm
- **后端 API**: Dify Workflow

## 本地开发

1. **安装依赖**:
   ```bash
   pnpm install
   ```

2. **配置环境变量**:
   在项目根目录创建 `.env.local` 文件并填入：
   ```env
   DIFY_TRANSLATE_API_KEY=你的翻译工作流API_KEY
   DIFY_SCORE_API_KEY=你的评分工作流API_KEY
   ```

3. **启动**:
   ```bash
   pnpm dev
   ```

## 部署到 Vercel

### 方式一：本地 CLI 一键部署 (推荐)

项目已集成 Vercel CLI 脚本，可快速完成部署。

1. **登录 Vercel**:
   ```bash
   npx vercel login
   ```

2. **初始化并部署**:
   ```bash
   pnpm v-deploy
   ```
   *首次运行请按提示完成项目关联（一路回车即可）。*

3. **设置生产环境变量**:
   部署成功后，运行以下命令将 API Key 同步到云端（仅需设置一次）：
   ```bash
   npx vercel env add DIFY_TRANSLATE_API_KEY [你的Key] production
   npx vercel env add DIFY_SCORE_API_KEY [你的Key] production
   ```

4. **重新部署使环境生效**:
   ```bash
   pnpm v-deploy
   ```

---

### 方式二：GitHub 自动部署

如果您已将代码上传至 GitHub，可以使用下方的按钮快速部署：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=YOUR_REPO_URL_HERE&env=DIFY_TRANSLATE_API_KEY,DIFY_SCORE_API_KEY&project-name=language-flow&repository-name=language-flow)

> **注意**: 请将 `YOUR_REPO_URL_HERE` 替换为您真实的 GitHub 仓库地址。

部署过程中，Vercel 会提示您输入环境变量：`DIFY_TRANSLATE_API_KEY` 和 `DIFY_SCORE_API_KEY`。
