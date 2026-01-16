

你是一个资深前端工程师兼产品实现顾问，擅长用 Vercel + Next.js(App Router) + TailwindCSS 快速搭建可上线的 Demo，并能对接现成的 workflow API。

## 项目目标

实现一个「英语跟练工具 Demo」的客户界面（Web），满足：

1) 用户粘贴一套中文演讲稿
2) 调用“翻译 workflow API”生成：英文译文 + 助记词/记忆提示 + 发音辅助（音标/IPA）
3) 用户在页面内录音（浏览器录音）
4) 调用“评分 workflow API”，上传录音并基于译文/目标文本返回评分与反馈
5) 给出清晰的练习闭环：输入 → 翻译结果 → 录音 → 评分反馈 → 再练一次

## 已知前提（必须遵守）

- “翻译”和“录音评分”这两项能力已经通过 workflow 封装成 HTTP API；前端只需调用，不负责模型推理。
- 你需要输出的是「客户界面」：可用、可演示、可部署到 Vercel 的前端实现方案与代码骨架。
- 默认不引入复杂后端；如必须写后端，仅允许使用 Next.js Route Handlers 作为 BFF（用于隐藏 API Key、转发请求、做最小校验）。
- 全程中文回答（UI 文案可中英混排）。

## 你要产出的内容（一次性给全）

请按以下结构输出，务必包含可直接复制的代码片段与文件路径。

### 1. Demo 信息架构与页面

给出建议的页面结构（尽量少页）并说明每页用途。至少包含：

- 首页/练习页：输入中文演讲稿、触发翻译、展示译文与学习辅助
- 跟读练习区：播放参考文本（可选）、录音按钮、录音状态、重录
- 评分结果区：总分、分项（发音/流利度/完整度等以API返回为准）、逐条反馈、可操作建议
- 历史记录（可选但建议）：本地保存最近 N 次练习（localStorage）

### 2. 交互流程（必须可落地）

用步骤列表写清楚 UI 状态流转与边界处理：

- 翻译中/loading、失败重试
- 翻译成功后如何呈现：英文、助记词、音标（按段落/句子）
- 录音权限申请、录音中、录音完成、上传评分中、评分失败
- 禁用态：未翻译不能评分、无录音文件不能提交、API未返回时的占位
- 数据持久化策略：localStorage 保存输入与结果（可开关）

### 3. 技术实现方案（Next.js + Tailwind）

给出明确技术决策：

- Next.js 版本与 App Router 使用方式
- 组件拆分建议（如：TextInputPanel、TranslationResult、RecorderPanel、ScorePanel、HistoryDrawer）
- 状态管理：优先 React useState/useReducer；如需要可用 Zustand（说明原因）
- API 调用策略：在 `/app/api/.../route.ts` 做转发（隐藏密钥），前端 fetch 调用本地路由
- 样式：Tailwind + 简单的设计系统（按钮、卡片、输入框、提示条）

### 4. 目录结构（必须给出）

输出一个可执行的目录树，例如：

- app/
  - page.tsx
  - api/
    - translate/route.ts
    - score/route.ts
- components/...
- lib/...
- styles/...

### 5. 关键代码（必须提供）

至少提供以下文件的可用代码（可简化，但要能跑）：

- `app/page.tsx`：主页面组合所有模块
- `components/TextInputPanel.tsx`
- `components/TranslationResult.tsx`：展示英文/助记词/音标（支持按句子折叠/复制）
- `components/RecorderPanel.tsx`：使用 MediaRecorder 实现录音、生成 blob、回放、提交评分
- `components/ScorePanel.tsx`
- `app/api/translate/route.ts`：转发到 workflow 翻译 API（使用环境变量）
- `app/api/score/route.ts`：转发到 workflow 评分 API（支持 multipart/form-data 或 base64（二选一，按你判断更稳））
- `lib/types.ts`：定义翻译与评分返回的 TypeScript 类型（可根据未知字段做兼容）
- `lib/storage.ts`：localStorage 读写最近练习（可选）

### 6. API 契约（以占位符形式写清楚）

由于我未提供具体 API 文档，你必须在输出中声明“可替换的契约”，并提供默认假设：

- 翻译 API 请求体字段名（例如 `{ zhText: string }`）与返回结构（包含 english、mnemonics、ipa、segments）
- 评分 API 请求体字段名（例如 `audio` + `targetText`）与返回结构（score、subScores、feedbackItems）
同时在代码中把这些字段集中写在 `lib/types.ts` 或 `lib/api.ts`，方便我替换。

有两个api分别由dify提供

```bash
curl -X POST 'https://api-ai.qiliangjia.org/v1/workflows/run' \
--header 'Authorization: Bearer {api_key}' \
--header 'Content-Type: application/json' \
--data-raw '{
  "inputs": {},
  "response_mode": "streaming",
  "user": "abc-123"
}'
```

### 7. Demo 体验优化（必须包含）

加入以下至少 6 项体验细节（用清单给出并在代码中体现其中 3 项）：

- 一键复制译文
- 句子级高亮/逐句折叠
- 录音时的可视化状态（简单脉冲动画或计时器）
- 错误提示与重试按钮
- 评分结果的“下一步建议”
- 自动保存草稿
- 移动端适配布局
- 空状态引导文案

### 8. 部署与运行（必须给命令）

给出本地启动与 Vercel 部署要点：

- 初始化命令（create-next-app）
- 安装依赖
- `.env.local` 示例（仅变量名，不要写真实key）
- `vercel` 部署注意项（环境变量、Edge/Node runtime 选择）

## 约束条件

- 不要输出多套备选方案，只输出一套“最适合 Demo 快速落地”的方案。
- 不要引入需要复杂配置的 UI 框架（如 Antd/MUI），优先原生 + Tailwind。
- 不要假设有数据库；历史记录仅本地存储即可。
- 代码必须是 TypeScript。
- 录音功能必须使用浏览器原生能力（MediaRecorder），不要依赖第三方录音库。
- 若遇到浏览器兼容性问题，给出最小降级策略（例如 Safari 处理、提示用户切换 Chrome）。

## 输入变量（由我后续提供/替换）

- 翻译 workflow API URL：{TRANSLATE_API_URL}
- 评分 workflow API URL：{SCORE_API_URL}
- API 鉴权方式：{AUTH_METHOD}（例如 Bearer token / header key）
- 翻译 API 的真实返回字段：{TRANSLATE_SCHEMA}
- 评分 API 的真实返回字段：{SCORE_SCHEMA}

## 开始执行

现在请直接输出完整方案与全部关键代码。务必让代码在“我只替换环境变量和API字段名”的情况下即可跑起来并完成 Demo 演示闭环。
