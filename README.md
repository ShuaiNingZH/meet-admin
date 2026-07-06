# Meet-Admin

<p>English | <a href="README.zh-CN.md">中文</a></p>

## Introduction

Meet-Admin is an open-source admin framework built with Vue 3, TypeScript, Vite 8, Pinia, and Element Plus. It uses the latest technology stack and ships with a set of pre-wrapped components, hooks, directives, layouts, and a fully typed Axios layer to help you start a back-office project quickly.

## Online preview

- Link: https://admin.wjp.plus

## Code repository

- GitHub: https://github.com/wjp980108/meet-admin

## Project documentation

- Project changelog: [CHANGELOG.en-US.md](./CHANGELOG.en-US.md)

- Project documentation: https://docs.wjp.plus

## Features

- Vue 3 + TypeScript with `<script setup>` SFCs
- Vite 8 toolchain (gzip / brotli compression, JSX/TSX support, dev proxy, vue-devtools, …)
- Pinia 3 for state management with `pinia-plugin-persistedstate`
- Element Plus with on-demand component resolution and global size / dark-mode switching
- UnoCSS (Wind3 preset + attributify + rem-to-px) with custom shortcuts and dynamic rules, plus a shared 4px spacing scale (`src/styles/variables.scss`)
- Type-safe Axios wrapper: bearer-token injection, duplicate-request cancellation, optional loading overlay, auto success / error toasts, 401 handling, and payload sanitization
- Auto-imports for `vue` / `vue-router` / `pinia` / `@vueuse/core` / `vue-i18n` and any `App*` component
- Vue I18n internationalization (Chinese / English) with precompiled YAML locales
- File-based routing modules with menu sorting, single-child collapsing, and `<keep-alive>` cache management
- WeCom (企业微信) silent login via `@wecom/jssdk`
- ECharts 6, wangEditor-next, vue-draggable-plus, GSAP, JsBarcode, QRCode, Print.js, file-saver, and other commonly used integrations
- Conventional Commits enforced via husky + lint-staged + commitlint + cz-git (`pnpm commit`)
- Strict ESLint rules powered by `@antfu/eslint-config` (with UnoCSS and CSS/HTML formatters)

## Requirements

- Node.js `>= 24` (see `.nvmrc`)
- pnpm `>= 11`

## Installation and usage

- **Clone:**

```bash
# GitHub
git clone https://github.com/wjp980108/meet-admin.git
```

- **Install:**

```bash
pnpm install
```

- **Run:**

```bash
# development (uses .env + .env.dev)
pnpm dev

# test
pnpm dev:test

# production
pnpm dev:prod
```

- **Build:**

```bash
# test (runs type-check in parallel)
pnpm build:test

# production (runs type-check in parallel)
pnpm build
```

- **Preview built dist:**

```bash
pnpm preview
```

- **Type check:**

```bash
pnpm type-check
```

- **Lint:**

```bash
# check
pnpm lint

# auto-fix
pnpm lint:fix
```

- **Commit:**

```bash
# interactive Conventional Commits prompt (lint-staged runs in pre-commit hook)
pnpm commit
```

## Project structure

```text
Meet-Admin
├─ .github                 # GitHub workflows and issue templates
├─ .husky                  # Husky git hooks
├─ build                   # Vite plugin configuration
├─ public                  # Static assets (not processed by the bundler)
├─ src
│  ├─ api                  # API request modules
│  ├─ assets               # Static assets bundled by Vite
│  ├─ components           # Global App* components (auto-imported)
│  ├─ config               # Per-library setup (Element Plus, i18n, dayjs, echarts, …)
│  ├─ constants            # Shared constants
│  ├─ directives           # Global custom directives
│  ├─ enums                # Shared enums (regex, common, …)
│  ├─ hooks                # Reusable composables
│  ├─ layouts              # Layout shell and sub-modules
│  ├─ locales              # i18n YAML resources (precompiled)
│  ├─ router               # Route entry, modules, and helpers
│  ├─ stores               # Pinia stores
│  ├─ styles               # Global styles (light/dark, Element Plus overrides)
│  ├─ typings              # Ambient TS declarations
│  ├─ utils                # Utility library (axios, storage, color, date, …)
│  ├─ views                # Page components
│  ├─ App.vue              # Root component
│  └─ main.ts              # App entry
├─ .editorconfig           # EditorConfig
├─ .env                    # Shared Vite env defaults
├─ .env.dev                # Development env
├─ .env.prod               # Production env
├─ .env.test               # Test env
├─ .gitignore              # Git ignore rules
├─ .nvmrc                  # Node version pin
├─ CHANGELOG.en-US.md      # Changelog (English)
├─ CHANGELOG.zh-CN.md      # Changelog (Chinese)
├─ CLAUDE.md               # Claude Code project instructions
├─ commitlint.config.ts    # Conventional Commits configuration
├─ eslint.config.ts        # ESLint flat config
├─ index.html              # HTML entry
├─ LICENSE                 # MIT license
├─ package.json            # Package manifest
├─ pnpm-lock.yaml          # pnpm lockfile
├─ pnpm-workspace.yaml     # pnpm configuration (build allowlist, trust policy)
├─ README.md               # README (English)
├─ README.zh-CN.md         # README (Chinese)
├─ tsconfig.json           # TypeScript project references
├─ tsconfig.app.json       # TS config for app code (with @/* alias)
├─ tsconfig.node.json      # TS config for build/Node tooling
├─ uno.config.ts           # UnoCSS configuration
└─ vite.config.ts          # Vite configuration
```

## Browser support

- For local development, the latest Chrome is recommended ([Download](https://www.google.com/intl/en/chrome/)).
- The production build targets modern browsers; IE is not supported. See [Can I Use Es Module](https://caniuse.com/?search=ESModule) for compatibility details.

| ![IE](https://raw.githubusercontent.com/alrra/browser-logos/master/src/archive/internet-explorer_9-11/internet-explorer_9-11_48x48.png) | ![Edge](https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png) | ![Firefox](https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png) | ![Chrome](https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png) | ![Safari](https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png) |
| :-------------------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------: |
|                                                                not support                                                                |                                                  last 2 versions                                  |                                                     last 2 versions                                      |                                                     last 2 versions                                      |                                                     last 2 versions                                      |

## License

[MIT](./LICENSE)
