# Meet-Admin

<p><a href="README.md">English</a> | 中文</p>

## 介绍

Meet-Admin 是一款基于 Vue 3.5、TypeScript、Vite 8、Pinia、Element Plus 的开源后台管理框架，使用目前最新的技术栈构建。项目内置了一组常用的封装组件、Hooks、指令、布局以及完整类型化的 Axios 请求层，帮助你快速开启一个后台项目。

## 在线预览

- Link：https://admin.wjp.plus

## 代码仓库

- GitHub：https://github.com/wjp980108/meet-admin

## 项目文档

- 项目更新日志：[CHANGELOG.zh-CN.md](./CHANGELOG.zh-CN.md)

- 项目文档地址：https://docs.wjp.plus

## 项目功能

- 使用 Vue 3.5 + TypeScript 开发，全部基于 `<script setup>` 单文件组件
- 采用 Vite 8 工具链（gzip / brotli 压缩、JSX/TSX 支持、开发代理、vue-devtools …）
- 使用 Pinia 3 管理状态，集成 `pinia-plugin-persistedstate` 持久化插件
- 集成 Element Plus 2.13，按需解析组件，支持组件大小切换与暗黑模式
- 使用 UnoCSS（Wind3 预设 + 属性化 + rem-to-px）并预置了实用的 shortcuts 与动态规则，同时提供统一的 4px 间距规范（`src/styles/variables.scss`）
- 类型安全的 Axios 二次封装：自动注入 Bearer Token、重复请求取消、可选 Loading 遮罩、自动成功 / 错误提示、401 处理、空值清洗
- 自动导入 `vue` / `vue-router` / `pinia` / `@vueuse/core` / `vue-i18n`，以及所有以 `App` 开头的全局组件
- Vue I18n 国际化（中英文），YAML 文案预编译
- 基于文件的路由模块，支持菜单排序、单子级折叠、`<keep-alive>` 缓存管理
- 通过 `@wecom/jssdk` 接入企业微信免登
- 集成 ECharts 6、wangEditor-next、vue-draggable-plus、GSAP、JsBarcode、QRCode、Print.js、file-saver 等常用库
- 使用 husky + lint-staged + commitlint + cz-git 规范提交信息（`pnpm commit`）
- 使用 `@antfu/eslint-config` 严格 lint（包含 UnoCSS、CSS/HTML 格式化）

## 环境要求

- Node.js `>= 24`（见 `.nvmrc`）
- pnpm `>= 11`

## 安装使用步骤

- **Clone：**

```bash
# GitHub
git clone https://github.com/wjp980108/meet-admin.git
```

- **Install：**

```bash
pnpm install
```

- **Run：**

```bash
# 开发环境（使用 .env + .env.dev）
pnpm dev

# 测试环境
pnpm dev:test

# 生产环境
pnpm dev:prod
```

- **Build：**

```bash
# 测试环境（并行执行 type-check）
pnpm build:test

# 生产环境（并行执行 type-check）
pnpm build
```

- **本地预览构建产物：**

```bash
pnpm preview
```

- **类型检查：**

```bash
pnpm type-check
```

- **Lint：**

```bash
# 检查
pnpm lint

# 自动修复
pnpm lint:fix
```

- **commit：**

```bash
# 交互式 Conventional Commits 提交（提交前会自动执行 lint-staged）
pnpm commit
```

## 文件资源目录

```text
Meet-Admin
├─ .github                 # GitHub 工作流与 Issue 模板
├─ .husky                  # Husky git 钩子
├─ build                   # Vite 插件配置
├─ public                  # 静态资源（不会被打包处理）
├─ src
│  ├─ api                  # API 请求模块
│  ├─ assets               # Vite 处理的静态资源
│  ├─ components           # 全局 App* 组件（自动导入）
│  ├─ config               # 各类库的初始化配置（Element Plus、i18n、dayjs、echarts …）
│  ├─ constants            # 全局常量
│  ├─ directives           # 全局自定义指令
│  ├─ enums                # 全局枚举（regex、common …）
│  ├─ hooks                # 复用 Hooks
│  ├─ layouts              # 框架布局与子模块
│  ├─ locales              # i18n YAML 资源（预编译）
│  ├─ router               # 路由入口、模块与工具
│  ├─ stores               # Pinia store
│  ├─ styles               # 全局样式（明 / 暗、Element Plus 覆盖）
│  ├─ typings              # 全局 TS 声明
│  ├─ utils                # 工具库（axios、storage、color、date …）
│  ├─ views                # 页面组件
│  ├─ App.vue              # 项目根组件
│  └─ main.ts              # 项目入口文件
├─ .editorconfig           # EditorConfig
├─ .env                    # Vite 公共配置
├─ .env.dev                # 开发环境配置
├─ .env.prod               # 生产环境配置
├─ .env.test               # 测试环境配置
├─ .gitignore              # Git 忽略规则
├─ .nvmrc                  # Node 版本锁定
├─ CHANGELOG.en-US.md      # 项目更新日志（英文）
├─ CHANGELOG.zh-CN.md      # 项目更新日志（中文）
├─ commitlint.config.ts    # Git 提交规范配置
├─ eslint.config.ts        # ESLint 扁平配置
├─ index.html              # 入口 HTML
├─ LICENSE                 # MIT 开源协议
├─ package.json            # 依赖管理
├─ pnpm-lock.yaml          # pnpm 锁文件
├─ README.md               # README（英文）
├─ README.zh-CN.md         # README（中文）
├─ tsconfig.json           # TypeScript 项目引用
├─ tsconfig.app.json       # 应用代码 TS 配置（含 @/* 别名）
├─ tsconfig.node.json      # 构建 / Node 工具链 TS 配置
├─ uno.config.ts           # UnoCSS 配置
└─ vite.config.ts          # Vite 配置
```

## 浏览器支持

- 本地开发推荐使用最新版 Chrome 浏览器 [Download](https://www.google.com/intl/zh-CN/chrome/)。
- 生产环境支持现代浏览器，不再支持 IE，更多浏览器兼容性信息可查看 [Can I Use Es Module](https://caniuse.com/?search=ESModule)。

| ![IE](https://i.imgtg.com/2023/04/11/8z7ot.png) | ![Edge](https://i.imgtg.com/2023/04/11/8zr3p.png) | ![Firefox](https://i.imgtg.com/2023/04/11/8zKiU.png) | ![Chrome](https://i.imgtg.com/2023/04/11/8zNrx.png) | ![Safari](https://i.imgtg.com/2023/04/11/8zeGj.png) |
| :---------------------------------------------: | :-----------------------------------------------: | :--------------------------------------------------: | :-------------------------------------------------: | :-------------------------------------------------: |
|                   not support                   |                  last 2 versions                  |                   last 2 versions                    |                   last 2 versions                   |                   last 2 versions                   |

## 开源协议

[MIT](./LICENSE)
