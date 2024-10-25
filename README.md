# Meet-Admin

<p>English | <a href="README.zh-CN.md">中文</a></p>

### Introduction

Meet-Admin is an open-source admin framework based on Vue 3.4, TypeScript, Vite 5, Pinia, and Element-Plus. It uses the latest technology stack. This project also wraps common components, hooks, directives, dynamic routing, and other features.

### Online preview

- Link：https://admin.wjp.plus

### Code repository

- GitHub：https://github.com/wjp980108/meet-admin

### Project documentation

- Project update log：[CHANGELOG.en-US.md](./CHANGELOG.en-US)

- Project document address：https://docs.wjp.plus

### Project function

- Developed using Vue3.4 + TypeScript, single file component**<script setup>**
- Use Vite5 as project development and packaging tool (configuration of gzip/brotli packaging, tsx syntax, cross-domain proxy...)
- Use Pinia to replace Vuex, lightweight, simple and easy to use, integrating Pinia persistence plug-in
- Use TypeScript to encapsulate the entire Axios secondary package (request interception, cancellation, common request encapsulation...)
- Supports Element component size switching, dark mode, and i18n internationalization
- Use VueRouter to configure dynamic routing and lazy loading of routes
- Use KeepAlive to cache pages and support multi-level nested route caching
- Use husky, lint-staged, commitlint, czg, cz-git to standardize submission information

### Installation and usage steps

- **Clone：**

```text
# GitHub
git clone https://github.com/wjp980108/meet-admin.git
```

- **Install：**

```text
pnpm install
```

- **Run：**

```text
# development
pnpm dev

# test
pnpm dev:test

# production
pnpm dev:prod
```

- **Build：**

```text
# test
pnpm build:test

# production
pnpm build
```

- **Lint：**

```text
# Eslint instrumentation code
pnpm lint

# Eslint fix code
pnpm lint:fix
```

- **commit：**

```text
# Submit the code (the lint:lint-staged command will be automatically executed before submission)
pnpm commit
```

### File resource directory

```text
Meet-Admin
├─ .github                 # GitHub configuration file
├─ .husky                  # Husky configuration file
├─ build                   # Vite configuration file
├─ public                  # Static resource files (this folder will not be packaged)
├─ src
│  ├─ api                  # API interface management
│  ├─ assets               # Static resource files
│  ├─ components           # Global components
│  ├─ config               # Global configuration items
│  ├─ constants            # Global constants
│  ├─ directives           # Global directive file
│  ├─ hooks                # Commonly used Hooks packages
│  ├─ locales              # Language internationalization i18n
│  ├─ layouts              # Frame layout module
│  ├─ router               # Route management
│  ├─ stores               # Pinia store
│  ├─ styles               # Global style file
│  ├─ typings              # Global ts declaration
│  ├─ utils                # Commonly used tool library
│  ├─ views                # All project pages
│  ├─ App.vue              # Project main component
│  └─ main.ts              # Project entry file
├─ .env                    # Vite common configuration
├─ .env.dev                # Development environment configuration
├─ .env.prod               # Production environment configuration
├─ .env.test               # Test environment configuration
├─ .gitignore              # Ignore git commits
├─ .nvmdrc                 # Node version management configuration
├─ CHANGELOG.en-US.md      # Project update log (English)
├─ CHANGELOG.zh-CN.md      # Project update log (Chinese)
├─ commitlint.config.js    # Git commit specification configuration
├─ eslint.config.js        # Eslint configuration file
├─ index.html              # Entry html
├─ LICENSE                 # Open source agreement document
├─ package.json            # Dependency package management
├─ pnpm-lock.yaml          # Pnpm dependency management
├─ README.md               # README introduction
├─ README.zh-CN.md         # README introduction (Chinese)
├─ tsconfig.json           # Typescript global configuration
├─ uno.config.ts           # UnoCss configuration file
└─ vite.config.ts          # Vite global configuration file
```

### Browser support

- For local development, it is recommended to use the latest version of Chrome browser [Download](https://www.google.com/intl/zh-CN/chrome/)。
- The production environment supports modern browsers, IE browser is no longer supported, more browsers can view [Can I Use Es Module](https://caniuse.com/?search=ESModule)。

| ![IE](https://i.imgtg.com/2023/04/11/8z7ot.png) | ![Edge](https://i.imgtg.com/2023/04/11/8zr3p.png) | ![Firefox](https://i.imgtg.com/2023/04/11/8zKiU.png) | ![Chrome](https://i.imgtg.com/2023/04/11/8zNrx.png) | ![Safari](https://i.imgtg.com/2023/04/11/8zeGj.png) |
| :---------------------------------------------: | :-----------------------------------------------: | :--------------------------------------------------: | :-------------------------------------------------: | :-------------------------------------------------: |
|                   not support                   |                  last 2 versions                  |                   last 2 versions                    |                   last 2 versions                   |                   last 2 versions                   |

### Project backend interface

The project backend interface completely uses Mock data, thanks to the following Mock platform support:

- EasyMock：https://mock.mengxuegu.com
